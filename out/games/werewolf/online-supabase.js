// ====================================================================
// ONLINE-SUPABASE.JS - Engine Multiplayer Online Berbasis Supabase
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  function t(key, vars) {
    return window.WerewolfI18n ? window.WerewolfI18n.t(key, vars) : key;
  }

  function getMaxPlayers(state) {
    const val = Number(state && state.max_players);
    if (!Number.isFinite(val)) return 15;
    return Math.min(30, Math.max(5, Math.floor(val)));
  }

  function isPlayerAlive(p) {
    return Boolean(p && p.alive === true && p.status !== 'dead');
  }

  const ROLE_META = {
    werewolf: { team: 'werewolf', color: '#ef4444', badgeClass: 'role-werewolf' },
    villager: { team: 'villager', color: '#38bdf8', badgeClass: 'role-villager' },
    seer: { team: 'villager', color: '#c084fc', badgeClass: 'role-seer' },
    bodyguard: { team: 'villager', color: '#fbbf24', badgeClass: 'role-bodyguard' },
    hunter: { team: 'villager', color: '#34d399', badgeClass: 'role-hunter' }
  };

  function getRoleDef(role) {
    const meta = ROLE_META[role];
    if (!meta) return { name: '?', color: '#fff', badgeClass: '', desc: '' };
    return {
      ...meta,
      name: t('role_' + role + '_name'),
      desc: t('role_' + role + '_desc')
    };
  }

  let supabaseClient = null;
  let activeChannel = null;

  // Local Player Session State
  let myPlayerId = null;
  let myPlayerName = '';
  let currentRoomCode = null;
  let currentRoomData = null; // latest room record
  let isHost = false;

  // Selection states
  let mySelectedNightTargetId = null;
  let mySelectedVoteTargetId = null;
  let mySelectedHunterShotId = null;
  let nightStepCountdownTimer = null;

  // Session & Identity Cache Keys
  const DEVICE_ID_KEY = 'teknogame_werewolf_device_id';
  const IP_CACHE_KEY = 'teknogame_werewolf_ip_cache';
  const SESSION_CACHE_KEY = 'teknogame_werewolf_session';

  // Ephemeral Broadcast Chat State
  let chatMessages = [];
  let chatUnreadCount = 0;
  let isChatOpen = false;
  let chatUIInitialized = false;
  let roleAdjustDebounceTimer = null;
  let isLeavingRoom = false;

  function getOrCreateDeviceId() {
    try {
      let devId = localStorage.getItem(DEVICE_ID_KEY);
      if (!devId) {
        devId = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem(DEVICE_ID_KEY, devId);
      }
      return devId;
    } catch {
      return 'dev_' + Math.random().toString(36).substring(2, 10);
    }
  }

  async function getClientIdentityKey() {
    const fallbackId = getOrCreateDeviceId();
    try {
      const rawCache = localStorage.getItem(IP_CACHE_KEY);
      if (rawCache) {
        const parsed = JSON.parse(rawCache);
        if (parsed && parsed.ip && Date.now() - (parsed.ts || 0) < 24 * 60 * 60 * 1000) {
          return `ip_${parsed.ip}`;
        }
      }
    } catch {
      // ignore storage error
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1800);
      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && data.ip) {
          try {
            localStorage.setItem(IP_CACHE_KEY, JSON.stringify({ ip: data.ip, ts: Date.now() }));
          } catch {}
          return `ip_${data.ip}`;
        }
      }
    } catch {
      // Network/CORS blocked: fallback to persistent device ID
    }
    return fallbackId;
  }

  function saveSessionCache(roomCode, playerId, playerName, ipKey) {
    try {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
        room_code: roomCode,
        player_id: playerId,
        player_name: playerName,
        ip_key: ipKey,
        saved_at: Date.now()
      }));
    } catch {}
  }

  function clearSessionCache() {
    try {
      localStorage.removeItem(SESSION_CACHE_KEY);
    } catch {}
  }

  async function restoreSessionOnLoad() {
    let session = null;
    try {
      const raw = localStorage.getItem(SESSION_CACHE_KEY);
      if (raw) session = JSON.parse(raw);
    } catch {}

    if (!session || !session.room_code || !session.player_id) return false;

    const client = initClient();
    if (!client) return false;

    const ipKey = session.ip_key || await getClientIdentityKey();

    try {
      // 1x SELECT saat restore session
      const { data: room, error } = await client
        .from('werewolf_rooms')
        .select('*')
        .eq('room_code', session.room_code)
        .single();

      if (error || !room || !room.game_state || room.status === 'finished') {
        clearSessionCache();
        return false;
      }

      const players = room.game_state.players || [];
      const matched = players.find(
        p => p.id === session.player_id || (ipKey && p.player_ip === ipKey)
      );

      if (!matched) {
        clearSessionCache();
        return false;
      }

      myPlayerId = matched.id;
      myPlayerName = matched.name;
      currentRoomCode = room.room_code;
      isHost = Boolean(matched.is_host);
      saveSessionCache(currentRoomCode, myPlayerId, myPlayerName, ipKey);

      subscribeToRoom(currentRoomCode);
      handleRoomStateSync(room);
      return true;
    } catch {
      return false;
    }
  }

  function initClient() {
    if (supabaseClient) return supabaseClient;

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('Supabase SDK belum termuat dari CDN.');
      return null;
    }

    const cfg = window.WerewolfConfig.getSupabaseConfig();
    if (!cfg.url || !cfg.anonKey) {
      return null;
    }

    try {
      supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      return supabaseClient;
    } catch (e) {
      console.error('Gagal inisialisasi Supabase client:', e);
      return null;
    }
  }

  // Generate 6 digit angka acak unik
  function generate6DigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate UUID v4 sederhana untuk ID pemain
  function generateUUID() {
    return 'p_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  // ==========================================
  // 1. BUAT ROOM BARU (HOST)
  // ==========================================
  async function createRoom(hostName) {
    const client = initClient();
    if (!client) {
      alert(t('supabase_error'));
      return;
    }

    hostName = hostName.trim() || 'Host';
    const ipKey = await getClientIdentityKey();
    myPlayerId = generateUUID();
    myPlayerName = hostName;
    isHost = true;

    // Bersihkan room lama yang kedaluwarsa (> 2 jam) sebagai garbage collection
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      await client.from('werewolf_rooms').delete().lt('updated_at', twoHoursAgo);
    } catch (err) {
      console.warn('Garbage collection notice:', err);
    }

    // Buat kode 6 digit
    let code = generate6DigitCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data } = await client.from('werewolf_rooms').select('room_code').eq('room_code', code).single();
      if (!data) break; // kode unik tersedia
      code = generate6DigitCode();
      attempts++;
    }

    currentRoomCode = code;

    const initialGameState = {
      room_code: code,
      host_id: myPlayerId,
      phase: 'lobby',
      max_players: 15,
      chat_enabled: true,
      role_config: {
        werewolf: 1,
        villager: 2,
        seer: 1,
        bodyguard: 1,
        hunter: 0
      },
      players: [
        {
          id: myPlayerId,
          name: hostName,
          player_ip: ipKey,
          is_host: true,
          alive: true,
          role: null,
          card_id: null,
          ready: false,
          last_protected: null,
          vote: null
        }
      ],
      cards: [],
      night_step: 'bodyguard', // bodyguard -> werewolf -> seer -> resolving
      night_actions: {
        protected_id: null,
        wolf_target_id: null,
        seer_target_id: null,
        hunter_shot_id: null
      },
      last_night_victim: null,
      winner: null,
      discussion_end_time: null
    };

    const { data: insertedRoom, error } = await client
      .from('werewolf_rooms')
      .insert([
        {
          room_code: code,
          status: 'lobby',
          game_state: initialGameState,
          updated_at: new Date().toISOString()
        }
      ])
      .select('*')
      .single();

    if (error) {
      alert(t('create_room_err', { msg: error.message }));
      return;
    }

    currentRoomData = insertedRoom || { room_code: code, status: 'lobby', game_state: initialGameState };
    saveSessionCache(code, myPlayerId, hostName, ipKey);
    subscribeToRoom(code);
    handleRoomStateSync(currentRoomData);
  }

  // ==========================================
  // 2. GABUNG ROOM (PEMAIN)
  // ==========================================
  async function joinRoom(playerName, roomCode) {
    const client = initClient();
    if (!client) {
      alert(t('supabase_error'));
      return;
    }

    playerName = playerName.trim() || t('player_name_short');
    roomCode = roomCode.trim();

    if (!roomCode || roomCode.length !== 6) {
      alert(t('invalid_room_code'));
      return;
    }

    const { data: room, error } = await client
      .from('werewolf_rooms')
      .select('*')
      .eq('room_code', roomCode)
      .single();

    if (error || !room) {
      alert(t('room_not_found', { code: roomCode }));
      return;
    }

    if (room.status !== 'lobby') {
      alert(t('room_already_started', { code: roomCode }));
      return;
    }

    const gameState = room.game_state;
    const ipKey = await getClientIdentityKey();

    // Auto-rejoin jika IP sama dengan pemain yang sudah ada di lobi
    const existingByIp = gameState.players.find(p => p.player_ip && p.player_ip === ipKey);
    if (existingByIp) {
      myPlayerId = existingByIp.id;
      myPlayerName = existingByIp.name;
      isHost = Boolean(existingByIp.is_host);
      currentRoomCode = roomCode;
      currentRoomData = room;
      saveSessionCache(roomCode, myPlayerId, myPlayerName, ipKey);
      subscribeToRoom(roomCode);
      handleRoomStateSync(room);
      return;
    }

    const maxPlayers = getMaxPlayers(gameState);
    if (gameState.players.length >= maxPlayers) {
      alert(t('room_full', { max: maxPlayers }));
      return;
    }

    myPlayerId = generateUUID();
    myPlayerName = playerName;
    isHost = false;
    currentRoomCode = roomCode;

    gameState.players.push({
      id: myPlayerId,
      name: playerName,
      player_ip: ipKey,
      is_host: false,
      alive: true,
      role: null,
      card_id: null,
      ready: false,
      last_protected: null,
      vote: null
    });

    // Otomatis seimbangkan role jika Host mengizinkan
    autoBalanceOnlineRoles(gameState);

    const { data: updatedRoom } = await client
      .from('werewolf_rooms')
      .update({
        game_state: gameState,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', roomCode)
      .select('*')
      .single();

    currentRoomData = updatedRoom || { ...room, game_state: gameState };
    saveSessionCache(roomCode, myPlayerId, myPlayerName, ipKey);
    subscribeToRoom(roomCode);
    handleRoomStateSync(currentRoomData);
  }

  // ==========================================
  // REALTIME SUBSCRIPTION & BROADCAST CHAT
  // ==========================================
  function initChatUI() {
    if (chatUIInitialized) return;
    chatUIInitialized = true;

    const btnOpen = document.getElementById('btnOpenRoomChat');
    const btnClose = document.getElementById('btnCloseRoomChat');
    const drawer = document.getElementById('roomChatDrawer');
    const form = document.getElementById('roomChatForm');
    const input = document.getElementById('inputRoomChat');

    if (btnOpen) {
      btnOpen.onclick = () => {
        window.WerewolfAudio.play('click');
        isChatOpen = true;
        chatUnreadCount = 0;
        updateChatBadge();
        if (drawer) {
          drawer.classList.remove('hidden');
          drawer.style.display = 'flex';
        }
        renderChatMessages();
        if (input) input.focus();
      };
    }

    const closeDrawer = () => {
      isChatOpen = false;
      if (drawer) {
        drawer.classList.add('hidden');
        drawer.style.display = 'none';
      }
    };

    if (btnClose) btnClose.onclick = closeDrawer;
    if (drawer) {
      drawer.onclick = (e) => {
        if (e.target === drawer) closeDrawer();
      };
    }

    if (form && input) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        sendChatMessage(text);
      };
    }
  }

  function updateChatBadge() {
    const badge = document.getElementById('chatUnreadBadge');
    if (!badge) return;
    if (chatUnreadCount > 0) {
      badge.textContent = chatUnreadCount > 99 ? '99+' : String(chatUnreadCount);
      badge.classList.remove('hidden');
      badge.style.display = 'inline-flex';
    } else {
      badge.classList.add('hidden');
      badge.style.display = 'none';
    }
  }

  function renderChatMessages() {
    const listEl = document.getElementById('roomChatMessages');
    if (!listEl) return;

    const state = currentRoomData ? currentRoomData.game_state : null;
    const me = state && state.players ? state.players.find(p => p.id === myPlayerId) : null;
    const isAlive = !me || me.alive !== false;

    const channelBadge = document.getElementById('roomChatChannelBadge');
    const deadNotice = document.getElementById('roomChatReadOnlyNotice');
    if (channelBadge) {
      channelBadge.textContent = isAlive ? t('chat_channel_public') : t('chat_channel_dead');
      channelBadge.style.color = isAlive ? 'var(--rose-light)' : 'var(--text-muted)';
    }
    if (deadNotice) {
      if (isAlive) {
        deadNotice.classList.add('hidden');
      } else {
        deadNotice.classList.remove('hidden');
      }
    }

    const visibleMsgs = chatMessages.filter(m => isAlive ? m.channel === 'alive' : true);
    listEl.innerHTML = '';

    if (visibleMsgs.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.style.cssText = 'text-align:center; font-size:12px; color:var(--text-muted); margin:auto 0;';
      emptyEl.textContent = t('chat_empty');
      listEl.appendChild(emptyEl);
      return;
    }

    visibleMsgs.forEach(m => {
      const row = document.createElement('div');
      const isMine = m.senderId === myPlayerId;
      row.className = 'chat-msg' + (isMine ? ' is-mine' : '') + (m.channel === 'dead' ? ' is-dead' : '');
      const senderTag = document.createElement('div');
      senderTag.style.cssText = 'font-size:10px; font-weight:800; margin-bottom:2px; color:' + (m.channel === 'dead' ? 'var(--text-muted)' : 'var(--rose-light)') + ';';
      senderTag.textContent = m.senderName + (m.channel === 'dead' ? ` (${t('chat_channel_dead')})` : '');
      const body = document.createElement('div');
      body.style.color = '#fff';
      body.textContent = m.text;
      row.appendChild(senderTag);
      row.appendChild(body);
      listEl.appendChild(row);
    });

    listEl.scrollTop = listEl.scrollHeight;
  }

  function handleIncomingChat(payload) {
    if (!payload || !payload.text) return;
    const state = currentRoomData ? currentRoomData.game_state : null;
    const me = state && state.players ? state.players.find(p => p.id === myPlayerId) : null;
    const isAlive = !me || me.alive !== false;

    // Pemain hidup tidak boleh menerima Dead/Spectator Chat
    if (payload.channel === 'dead' && isAlive) return;

    chatMessages.push(payload);
    if (chatMessages.length > 80) {
      chatMessages = chatMessages.slice(-80);
    }

    if (isChatOpen) {
      renderChatMessages();
    } else if (payload.senderId !== myPlayerId) {
      chatUnreadCount++;
      updateChatBadge();
    }
  }

  function sendChatMessage(text) {
    if (!activeChannel || !currentRoomCode) return;
    const state = currentRoomData ? currentRoomData.game_state : null;
    if (state && state.chat_enabled === false) return;

    const me = state && state.players ? state.players.find(p => p.id === myPlayerId) : null;
    const channelType = (me && me.alive === false) ? 'dead' : 'alive';

    // Ephemeral Realtime Broadcast (0 DB writes)
    activeChannel.send({
      type: 'broadcast',
      event: 'room_chat',
      payload: {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        senderId: myPlayerId,
        senderName: myPlayerName,
        text: text,
        channel: channelType,
        ts: Date.now()
      }
    });
  }

  function updateHudRoomControls(status, state) {
    initChatUI();
    const btnLeave = document.getElementById('btnHudLeaveRoom');
    const btnChat = document.getElementById('btnOpenRoomChat');
    const drawer = document.getElementById('roomChatDrawer');

    if (btnLeave) {
      if (currentRoomCode) {
        btnLeave.classList.remove('hidden');
        btnLeave.style.display = 'flex';
      } else {
        btnLeave.classList.add('hidden');
        btnLeave.style.display = 'none';
      }
    }

    const chatAllowedPhase = (
      status === 'lobby' ||
      status === 'day_announcement' ||
      status === 'day_voting' ||
      status === 'day_vote_result'
    );
    const chatEnabled = !state || state.chat_enabled !== false;

    if (btnChat) {
      if (currentRoomCode && chatEnabled && chatAllowedPhase) {
        btnChat.classList.remove('hidden');
        btnChat.style.display = 'flex';
      } else {
        btnChat.classList.add('hidden');
        btnChat.style.display = 'none';
        isChatOpen = false;
        if (drawer) {
          drawer.classList.add('hidden');
          drawer.style.display = 'none';
        }
      }
    }
  }

  function subscribeToRoom(roomCode) {
    const client = initClient();
    if (!client) return;

    if (activeChannel) {
      supabaseClient.removeChannel(activeChannel);
    }

    activeChannel = client
      .channel('werewolf_room_' + roomCode, {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'werewolf_rooms',
          filter: `room_code=eq.${roomCode}`
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            alert(t('room_closed'));
            leaveRoom(false);
            return;
          }
          if (payload.new && payload.new.game_state) {
            handleRoomStateSync(payload.new);
          }
        }
      )
      .on('broadcast', { event: 'room_chat' }, ({ payload }) => {
        handleIncomingChat(payload);
      })
      .subscribe();
  }

  function handleRoomStateSync(roomRecord) {
    currentRoomData = roomRecord;
    const state = roomRecord.game_state;
    const status = roomRecord.status;

    // Sinkronisasi status Host
    const me = state.players.find(p => p.id === myPlayerId);
    if (me) {
      isHost = Boolean(me.is_host);
    }

    updateHudRoomControls(status, state);

    if (status === 'lobby') {
      renderLobbyScreen(state);
    } else if (status === 'playing' || status === 'card_pick') {
      renderOnlineRoleReveal(state);
    } else if (status === 'night') {
      renderOnlineNight(state);
    } else if (status === 'day_announcement') {
      renderOnlineDayAnnouncement(state);
    } else if (status === 'day_voting') {
      renderOnlineDayVoting(state);
    } else if (status === 'day_vote_result') {
      renderOnlineVoteResult(state);
    } else if (status === 'finished') {
      renderOnlineGameOver(state);
    }
  }

  // ==========================================
  // 3. TAMPILAN LOBI ONLINE
  // ==========================================
  function renderLobbyScreen(state) {
    lastRenderedNightKey = null;
    clearCardPickTimer();
    clearVoteResultTimer();
    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(null);
    }
    window.WerewolfApp.switchScreen('screenOnlineLobby');
    window.WerewolfApp.setHudStatusKey('hud_lobby_code', { code: state.room_code });

    document.getElementById('onlineRoomCodeDisplay').textContent = state.room_code;
    const rosterList = document.getElementById('onlineLobbyRosterList');
    rosterList.innerHTML = '';

    state.players.forEach(p => {
      const isMe = (p.id === myPlayerId);
      const row = document.createElement('div');
      row.className = 'roster-item' + (isMe ? ' is-me' : '');
      row.innerHTML = `
        <div class="roster-name-wrap">
          ${p.is_host ? `<span class="roster-host-icon">${window.WerewolfIcons.get('crown')}</span>` : ''}
          <span class="roster-name">${p.name} ${isMe ? t('you_tag') : ''}</span>
        </div>
        <span class="roster-status-badge ${p.ready ? 'ready' : ''}">
          ${p.is_host ? t('badge_host') : (p.ready ? t('badge_ready') : t('badge_waiting'))}
        </span>
      `;
      rosterList.appendChild(row);
    });

    const maxPlayers = getMaxPlayers(state);
    document.getElementById('onlinePlayerCountBadge').textContent = t('player_count_max', { count: state.players.length, max: maxPlayers });

    // Pengaturan Role (Hanya Host yang bisa mengubah)
    const hostRoleControls = document.getElementById('onlineHostRoleControls');
    const guestRoleSummary = document.getElementById('onlineGuestRoleSummary');
    const btnStartGame = document.getElementById('btnStartOnlineGame');

    if (isHost) {
      hostRoleControls.classList.remove('hidden');
      guestRoleSummary.classList.add('hidden');
      btnStartGame.classList.remove('hidden');

      const maxValEl = document.getElementById('onlineMaxPlayersValue');
      const btnMaxMinus = document.getElementById('btnOnlineMaxPlayersMinus');
      const btnMaxPlus = document.getElementById('btnOnlineMaxPlayersPlus');
      if (maxValEl) maxValEl.textContent = maxPlayers;
      if (btnMaxMinus) btnMaxMinus.disabled = (maxPlayers <= Math.max(5, state.players.length));
      if (btnMaxPlus) btnMaxPlus.disabled = (maxPlayers >= 30);

      ['werewolf', 'villager', 'seer', 'bodyguard', 'hunter'].forEach(role => {
        const countEl = document.getElementById(`onlineRoleCount_${role}`);
        if (countEl) countEl.textContent = state.role_config[role] || 0;
      });

      const totalRoles = Object.values(state.role_config).reduce((a, b) => a + b, 0);
      const sumEl = document.getElementById('onlineRoleTotalSum');
      if (sumEl) {
        sumEl.textContent = `${totalRoles} / ${state.players.length}`;
        sumEl.style.color = (totalRoles === state.players.length) ? 'var(--role-hunter)' : 'var(--blood-red)';
      }

      btnStartGame.disabled = (state.players.length < 5 || state.players.length > maxPlayers || totalRoles !== state.players.length);

      const btnToggleChat = document.getElementById('btnToggleRoomChat');
      if (btnToggleChat) {
        const enabled = state.chat_enabled !== false;
        btnToggleChat.textContent = enabled ? t('chat_status_on') : t('chat_status_off');
        btnToggleChat.style.color = enabled ? 'var(--role-hunter)' : 'var(--text-muted)';
        btnToggleChat.onclick = async () => {
          window.WerewolfAudio.play('click');
          await updateRoomStateAtomically((s, st) => {
            s.chat_enabled = (s.chat_enabled === false);
            return { status: st, state: s };
          });
        };
      }
    } else {
      hostRoleControls.classList.add('hidden');
      guestRoleSummary.classList.remove('hidden');
      btnStartGame.classList.add('hidden');

      const guestChatStatus = document.getElementById('onlineGuestChatStatus');
      if (guestChatStatus) {
        const enabled = state.chat_enabled !== false;
        guestChatStatus.textContent = enabled ? t('chat_status_on') : t('chat_status_off');
        guestChatStatus.style.color = enabled ? 'var(--role-hunter)' : 'var(--text-muted)';
      }

      const guestList = document.getElementById('onlineGuestRoleList');
      if (guestList) {
        guestList.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--role-wolf); font-weight:700;">${t('role_werewolf_name')}</span>
            <span style="font-weight:800; color:#fff;">${state.role_config.werewolf || 0}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--role-villager); font-weight:700;">${t('role_villager_name')}</span>
            <span style="font-weight:800; color:#fff;">${state.role_config.villager || 0}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--role-seer); font-weight:700;">${t('role_seer_name')}</span>
            <span style="font-weight:800; color:#fff;">${state.role_config.seer || 0}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--role-guard); font-weight:700;">${t('role_bodyguard_name')}</span>
            <span style="font-weight:800; color:#fff;">${state.role_config.bodyguard || 0}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--role-hunter); font-weight:700;">${t('role_hunter_name')}</span>
            <span style="font-weight:800; color:#fff;">${state.role_config.hunter || 0}</span>
          </div>
        `;
      }

      const totalRoles = Object.values(state.role_config).reduce((a, b) => a + b, 0);
      const sumEl = document.getElementById('onlineGuestRoleTotalSum');
      if (sumEl) {
        sumEl.textContent = `${totalRoles} / ${state.players.length}`;
        sumEl.style.color = (totalRoles === state.players.length) ? 'var(--role-hunter)' : 'var(--blood-red)';
      }
    }
  }

  function autoBalanceOnlineRoles(state) {
    const total = state.players.length;
    let wolfCount = 1;
    if (total >= 7 && total <= 11) wolfCount = 2;
    if (total >= 12) wolfCount = 3;

    let seerCount = 1;
    let guardCount = 1;
    let hunterCount = total >= 6 ? 1 : 0;
    let villagerCount = total - (wolfCount + seerCount + guardCount + hunterCount);

    if (villagerCount < 1) {
      villagerCount = 1;
      hunterCount = 0;
    }

    state.role_config = {
      werewolf: wolfCount,
      villager: villagerCount,
      seer: seerCount,
      bodyguard: guardCount,
      hunter: hunterCount
    };
  }

  function adjustOnlineRole(role, delta) {
    if (!isHost || !currentRoomData) return;
    const state = currentRoomData.game_state;
    const current = state.role_config[role] || 0;
    const nextVal = current + delta;
    if (nextVal < 0) return;
    if (role === 'werewolf' && nextVal < 1) return;

    state.role_config[role] = nextVal;
    renderLobbyScreen(state); // Update optimistik di layar Host

    if (roleAdjustDebounceTimer) clearTimeout(roleAdjustDebounceTimer);
    const snapshotConfig = { ...state.role_config };
    roleAdjustDebounceTimer = setTimeout(async () => {
      roleAdjustDebounceTimer = null;
      await updateRoomStateAtomically((freshState, st) => {
        if (st !== 'lobby') return { abort: 'not_lobby' };
        freshState.role_config = snapshotConfig;
        return { status: st, state: freshState };
      });
    }, 300);
  }

  let maxPlayersDebounceTimer = null;

  function adjustOnlineMaxPlayers(delta) {
    if (!isHost || !currentRoomData) return;
    const state = currentRoomData.game_state;
    const currentMax = getMaxPlayers(state);
    const minAllowed = Math.max(5, state.players.length);
    const nextMax = Math.min(30, Math.max(minAllowed, currentMax + delta));
    if (nextMax === currentMax) return;

    state.max_players = nextMax;
    renderLobbyScreen(state);

    if (maxPlayersDebounceTimer) clearTimeout(maxPlayersDebounceTimer);
    maxPlayersDebounceTimer = setTimeout(async () => {
      maxPlayersDebounceTimer = null;
      await updateRoomStateAtomically((freshState, st) => {
        if (st !== 'lobby') return { abort: 'not_lobby' };
        const minNow = Math.max(5, freshState.players.length);
        freshState.max_players = Math.min(30, Math.max(minNow, nextMax));
        return { status: st, state: freshState };
      });
    }, 250);
  }

  // ==========================================
  // 4. MULAI PERMAINAN (AUTO-SHUFFLE & ROLE REVEAL)
  // ==========================================
  let isStartingGame = false;

  async function startOnlineGame() {
    if (!isHost || !currentRoomData || isStartingGame) return;
    isStartingGame = true;
    try {
      const state = currentRoomData.game_state;
      const maxPlayers = getMaxPlayers(state);
      if (state.players.length < 5) {
        alert(t('min_players_alert'));
        return;
      }
      if (state.players.length > maxPlayers) {
        alert(t('room_full', { max: maxPlayers }));
        return;
      }
      const totalRoles = Object.values(state.role_config).reduce((a, b) => a + b, 0);
      if (totalRoles !== state.players.length) {
        alert(t('role_sum_mismatch', { sum: totalRoles, total: state.players.length }));
        return;
      }

      await updateRoomStateAtomically((freshState, st) => {
        if (st !== 'lobby') return { abort: 'already_started' };
        const pool = [];
        Object.keys(freshState.role_config).forEach(role => {
          for (let i = 0; i < freshState.role_config[role]; i++) {
            pool.push(role);
          }
        });

        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        freshState.cards = pool.map((role, idx) => {
          const owner = freshState.players[idx] || null;
          if (owner) {
            owner.card_id = idx;
            owner.role = role;
            owner.ready = false;
          }
          return {
            id: idx,
            role: role,
            picked_by: owner ? owner.id : null
          };
        });

        freshState.phase = 'playing';
        freshState.sub_phase = 'role_reveal';
        freshState.role_reveal_start_time = Date.now();
        freshState.card_pick_start_time = freshState.role_reveal_start_time;
        return { status: 'playing', state: freshState };
      });
    } finally {
      isStartingGame = false;
    }
  }

  // ==========================================
  // 5. TAMPILAN PEMILIHAN KARTU ONLINE
  // ==========================================
  let cardPickCountdownTimer = null;
  let autoPickHandledTurnKey = null;
  let lastRenderedNightKey = null;
  let voteResultCountdownTimer = null;
  let voteResultTransitionedAt = null;

  function clearCardPickTimer() {
    if (cardPickCountdownTimer) {
      clearInterval(cardPickCountdownTimer);
      cardPickCountdownTimer = null;
    }
  }

  function clearVoteResultTimer() {
    if (voteResultCountdownTimer) {
      clearInterval(voteResultCountdownTimer);
      voteResultCountdownTimer = null;
    }
  }

  let votingCountdownTimer = null;

  function clearVotingTimer() {
    if (votingCountdownTimer) {
      clearInterval(votingCountdownTimer);
      votingCountdownTimer = null;
    }
  }

  function renderOnlineRoleReveal(state) {
    lastRenderedNightKey = null;
    clearVoteResultTimer();
    window.WerewolfApp.switchScreen('screenCardPick');
    window.WerewolfApp.setHudStatusKey('hud_pick_card');

    const me = state.players.find(p => p.id === myPlayerId);
    const hasRole = Boolean(me && me.role);

    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(hasRole ? me.role : null);
    }

    const headerTitle = document.getElementById('cardPickHeaderTitle');
    const headerDesc = document.getElementById('cardPickHeaderDesc');
    headerTitle.textContent = t('card_pick_yours_title');
    headerDesc.textContent = t('card_pick_yours_desc');

    const metaBar = document.getElementById('cardPickMetaBar');
    const timerBadge = document.getElementById('cardPickTimerBadge');
    const timerDigits = document.getElementById('cardPickTimerDigits');
    if (metaBar) {
      metaBar.classList.remove('hidden');
      metaBar.style.display = 'flex';
    }
    if (timerBadge) timerBadge.classList.remove('hidden');

    clearCardPickTimer();
    const startTime = state.role_reveal_start_time || state.card_pick_start_time || Date.now();
    const updateReadyTimer = async () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remain = Math.max(0, 15 - elapsed);
      if (timerDigits) timerDigits.textContent = `${remain}s`;

      if (remain <= 0 && autoPickHandledTurnKey !== startTime) {
        autoPickHandledTurnKey = startTime;
        clearCardPickTimer();
        if (me && !me.ready) {
          await syncPlayerReadyState();
        }
      }
    };

    const initRemain = Math.max(0, 15 - Math.floor((Date.now() - startTime) / 1000));
    if (timerDigits) timerDigits.textContent = `${initRemain}s`;
    cardPickCountdownTimer = setInterval(updateReadyTimer, 1000);

    const roleRevealPanel = document.getElementById('cardPickRoleReveal');
    const actionBtns = document.getElementById('cardPickActionBtns');

    if (hasRole) {
      roleRevealPanel.classList.remove('hidden');
      actionBtns.classList.remove('hidden');

      const def = getRoleDef(me.role);
      document.getElementById('revealRoleIcon').innerHTML = window.WerewolfIcons.get(me.role);
      const titleWrap = document.getElementById('revealRoleTitle');
      titleWrap.textContent = def.name;
      titleWrap.style.color = def.color;
      document.getElementById('revealRoleDesc').textContent = def.desc;

      const btnConfirm = document.getElementById('btnConfirmCardPick');
      const notReadyCount = state.players.filter(p => !p.ready).length;
      btnConfirm.textContent = me.ready
        ? t('waiting_other_players_count', { count: notReadyCount })
        : t('iam_ready');
      btnConfirm.disabled = Boolean(me.ready);

      btnConfirm.onclick = async () => {
        window.WerewolfAudio.play('click');
        btnConfirm.disabled = true;
        await syncPlayerReadyState();
      };
    } else {
      roleRevealPanel.classList.add('hidden');
      actionBtns.classList.add('hidden');
    }
  }

  let isReadySubmitting = false;

  async function updateRoomStateAtomically(mutatorFn, maxRetries = 8) {
    if (!supabaseClient || !currentRoomCode) return { ok: false, reason: 'no_room' };

    // Gunakan state memori lokal dulu agar hemat 1x SELECT bila tidak ada konflik
    let baseRow = currentRoomData && currentRoomData.updated_at ? currentRoomData : null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (!baseRow) {
        const { data: freshRow, error: fetchError } = await supabaseClient
          .from('werewolf_rooms')
          .select('room_code, status, game_state, updated_at')
          .eq('room_code', currentRoomCode)
          .single();

        if (fetchError || !freshRow || !freshRow.game_state) {
          return { ok: false, reason: 'fetch_error' };
        }
        baseRow = freshRow;
      }

      const clonedState = JSON.parse(JSON.stringify(baseRow.game_state));
      const outcome = mutatorFn(clonedState, baseRow.status);
      if (outcome && outcome.abort) {
        handleRoomStateSync(baseRow);
        return { ok: false, reason: outcome.abort };
      }

      const nextStatus = (outcome && outcome.status) || baseRow.status;
      const nextState = (outcome && outcome.state) || clonedState;
      const nextUpdatedAt = new Date().toISOString();

      const { data: updatedRows, error: updateError } = await supabaseClient
        .from('werewolf_rooms')
        .update({
          status: nextStatus,
          game_state: nextState,
          updated_at: nextUpdatedAt
        })
        .eq('room_code', currentRoomCode)
        .eq('updated_at', baseRow.updated_at)
        .select('room_code, status, game_state, updated_at');

      if (!updateError && Array.isArray(updatedRows) && updatedRows.length > 0) {
        handleRoomStateSync(updatedRows[0]);
        return { ok: true, row: updatedRows[0] };
      }

      // Konflik CAS: reset baseRow agar iterasi berikut fetch data terbaru dari DB
      baseRow = null;
      await new Promise(resolve => setTimeout(resolve, 45 + Math.floor(Math.random() * 90)));
    }

    return { ok: false, reason: 'conflict' };
  }

  async function syncPlayerReadyState() {
    if (!currentRoomData || isReadySubmitting) return;
    isReadySubmitting = true;
    try {
      await updateRoomStateAtomically((state, status) => {
        if (status !== 'playing' && status !== 'card_pick') {
          return { abort: 'already_started' };
        }
        const me = state.players.find(p => p.id === myPlayerId);
        if (me) me.ready = true;

        const allReady = state.players.every(p => p.ready && Boolean(p.role));
        if (allReady) {
          state.phase = 'night';
          state.sub_phase = null;
          state.night_step = 'bodyguard';
          state.night_step_start_time = Date.now();
          state.players.forEach(p => { p.ready = false; });
          return { status: 'night', state };
        }
        return { status, state };
      });
    } finally {
      isReadySubmitting = false;
    }
  }

  // ==========================================
  // 6. SIKLUS MALAM REALTIME
  // ==========================================
  function renderOnlineNight(state) {
    clearCardPickTimer();
    clearVoteResultTimer();
    clearVotingTimer();

    const me = state.players.find(p => p.id === myPlayerId);
    const currentStep = state.night_step; // 'bodyguard' | 'werewolf' | 'seer' | 'resolving'
    const isMyTurn = (isPlayerAlive(me) && me.role === currentStep);

    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(me ? me.role : null);
    }

    const aliveCount = state.players.filter(isPlayerAlive).length;
    const nightKey = `${currentStep}:${state.night_step_start_time || 0}:${isMyTurn ? '1' : '0'}:${aliveCount}`;
    if (lastRenderedNightKey === nightKey) {
      return;
    }
    lastRenderedNightKey = nightKey;

    if (nightStepCountdownTimer) {
      clearInterval(nightStepCountdownTimer);
      nightStepCountdownTimer = null;
    }

    window.WerewolfApp.switchScreen('screenNightAction');
    window.WerewolfApp.setHudStatusKey('hud_night_time');

    const waitingBox = document.getElementById('nightWaitingBox');
    const actionBox = document.getElementById('nightActiveActionBox');

    // Hitung sisa waktu 30 detik untuk langkah malam saat ini
    const stepStartTime = state.night_step_start_time || Date.now();
    const elapsed = Math.floor((Date.now() - stepStartTime) / 1000);
    let remainSec = Math.max(0, 30 - elapsed);

    if (isMyTurn) {
      waitingBox.classList.add('hidden');
      actionBox.classList.remove('hidden');

      const iconWrap = document.getElementById('nightRoleIcon');
      const titleWrap = document.getElementById('nightRoleTitle');
      const promptWrap = document.getElementById('nightActionPrompt');
      const teammateWrap = document.getElementById('nightTeammateInfo');
      const seerResultBox = document.getElementById('seerResultBox');
      const targetList = document.getElementById('nightTargetList');
      const btnConfirm = document.getElementById('btnConfirmNightAction');
      const timerDigits = document.getElementById('nightActiveTimerDigits');

      const stepDef = getRoleDef(currentStep);
      iconWrap.innerHTML = window.WerewolfIcons.get(currentStep);
      titleWrap.textContent = stepDef.name;
      titleWrap.style.color = stepDef.color;
      seerResultBox.classList.add('hidden');
      teammateWrap.classList.add('hidden');
      targetList.innerHTML = '';
      mySelectedNightTargetId = null;

      if (timerDigits) timerDigits.textContent = remainSec;

      // Jalankan hitung mundur 30 detik untuk pemain aktif
      nightStepCountdownTimer = setInterval(async () => {
        remainSec--;
        if (timerDigits) timerDigits.textContent = Math.max(0, remainSec);

        if (remainSec <= 0) {
          clearInterval(nightStepCountdownTimer);
          nightStepCountdownTimer = null;

          // Auto-submit bila waktu habis
          if (!mySelectedNightTargetId) {
            if (currentStep === 'bodyguard') {
              const valids = state.players.filter(p => isPlayerAlive(p) && p.id !== me.last_protected);
              if (valids.length > 0) mySelectedNightTargetId = valids[0].id;
            } else if (currentStep === 'werewolf') {
              const valids = state.players.filter(p => isPlayerAlive(p) && p.role !== 'werewolf');
              if (valids.length > 0) mySelectedNightTargetId = valids[0].id;
            } else if (currentStep === 'seer') {
              const valids = state.players.filter(p => isPlayerAlive(p) && p.id !== myPlayerId);
              if (valids.length > 0) mySelectedNightTargetId = valids[0].id;
            }
          }

          if (mySelectedNightTargetId) {
            await submitNightAction(currentStep, mySelectedNightTargetId);
          } else {
            await advanceNightStep();
          }
        }
      }, 1000);

      if (currentStep === 'bodyguard') {
        promptWrap.textContent = t('prompt_bodyguard');
        window.WerewolfAudio.play('shield');

        state.players.forEach(p => {
          if (!isPlayerAlive(p)) return;
          const isDisallowed = (p.id === me.last_protected);
          const card = createOnlineTargetCard(p, isDisallowed ? t('tag_protected_last') : t('tag_protect'), isDisallowed);

          if (!isDisallowed) {
            card.onclick = () => {
              targetList.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');
              mySelectedNightTargetId = p.id;
              window.WerewolfAudio.play('click');
            };
          }
          targetList.appendChild(card);
        });
      } 
      else if (currentStep === 'werewolf') {
        promptWrap.textContent = t('prompt_werewolf');
        window.WerewolfAudio.play('howl');

        const fellowWolves = state.players.filter(p => p.role === 'werewolf');
        if (fellowWolves.length > 1) {
          teammateWrap.classList.remove('hidden');
          teammateWrap.innerHTML = `<strong>${t('fellow_wolves')}</strong> ${fellowWolves.map(p => p.name).join(', ')}`;
        }

        state.players.forEach(p => {
          if (!isPlayerAlive(p)) return;
          const isWolf = (p.role === 'werewolf');
          const card = createOnlineTargetCard(p, isWolf ? t('tag_fellow_wolf') : t('tag_prey'), isWolf);

          if (!isWolf) {
            card.onclick = () => {
              targetList.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');
              mySelectedNightTargetId = p.id;
              window.WerewolfAudio.play('click');
            };
          }
          targetList.appendChild(card);
        });
      } 
      else if (currentStep === 'seer') {
        promptWrap.textContent = t('prompt_seer');
        window.WerewolfAudio.play('seer');

        state.players.forEach(p => {
          if (!isPlayerAlive(p) || p.id === myPlayerId) return;
          const card = createOnlineTargetCard(p, t('tag_inspect'));
          card.onclick = () => {
            if (mySelectedNightTargetId !== null) return; // Batasi klik Seer hanya 1 kali!
            mySelectedNightTargetId = p.id;

            // Kunci seluruh kartu target lain agar Seer tidak bisa mengintip pemain kedua
            targetList.querySelectorAll('.target-card').forEach(c => {
              c.classList.remove('selected');
              c.classList.add('disabled');
              c.onclick = null;
            });
            card.classList.add('selected');
            card.classList.remove('disabled');

            window.WerewolfAudio.play('click');

            const isWolf = (p.role === 'werewolf');
            seerResultBox.classList.remove('hidden');
            seerResultBox.innerHTML = t('seer_result_html', {
              name: p.name,
              color: isWolf ? 'var(--role-wolf)' : 'var(--role-villager)',
              verdict: isWolf ? t('seer_is_wolf') : t('seer_not_wolf')
            });
          };
          targetList.appendChild(card);
        });
      }

      btnConfirm.onclick = async () => {
        if (!mySelectedNightTargetId) {
          alert(t('must_pick_target'));
          return;
        }
        clearInterval(nightStepCountdownTimer);
        nightStepCountdownTimer = null;
        await submitNightAction(currentStep, mySelectedNightTargetId);
      };
    } else {
      // Layar tunggu bagi pemain lain
      waitingBox.classList.remove('hidden');
      actionBox.classList.add('hidden');

      const waitingIcon = document.getElementById('nightWaitingIcon');
      const waitingTitle = document.getElementById('nightWaitingTitle');
      const waitingDesc = document.getElementById('nightWaitingDesc');
      const waitingDigits = document.getElementById('nightWaitingTimerDigits');

      if (waitingIcon) waitingIcon.innerHTML = window.WerewolfIcons.get(currentStep) || window.WerewolfIcons.get('moon');
      if (waitingTitle) waitingTitle.textContent = t('online_night_title', { role: getRoleDef(currentStep).name });

      if (waitingDesc) {
        if (currentStep === 'bodyguard') {
          waitingDesc.textContent = t('waiting_bodyguard');
        } else if (currentStep === 'werewolf') {
          waitingDesc.textContent = t('waiting_werewolf');
        } else if (currentStep === 'seer') {
          waitingDesc.textContent = t('waiting_seer');
        } else {
          waitingDesc.textContent = t('waiting_default');
        }
      }

      if (waitingDigits) waitingDigits.textContent = remainSec;

      nightStepCountdownTimer = setInterval(() => {
        remainSec--;
        if (waitingDigits) waitingDigits.textContent = Math.max(0, remainSec);
        if (remainSec <= 0) {
          clearInterval(nightStepCountdownTimer);
          nightStepCountdownTimer = null;
        }
      }, 1000);

      // Jika role yang aktif sudah mati atau tidak ada di game, Host memicu jeda otomatis
      if (isHost && !state.players.some(p => p.role === currentStep && p.alive)) {
        setTimeout(async () => {
          await advanceNightStep();
        }, 4000);
      }
    }
  }

  async function submitNightAction(role, targetId) {
    if (!currentRoomData) return;
    await updateRoomStateAtomically((state, status) => {
      if (status !== 'night' || state.night_step !== role) {
        return { abort: 'stale_night_step' };
      }
      const me = state.players.find(p => p.id === myPlayerId);
      const target = state.players.find(p => p.id === targetId);
      if (!me || !isPlayerAlive(me) || !target || !isPlayerAlive(target)) {
        return { abort: 'invalid_dead_target' };
      }
      if (role === 'bodyguard') {
        if (target.id === me.last_protected) return { abort: 'protected_last_night' };
        state.night_actions.protected_id = targetId;
        me.last_protected = targetId;
      } else if (role === 'werewolf') {
        if (target.role === 'werewolf') return { abort: 'cannot_target_wolf' };
        state.night_actions.wolf_target_id = targetId;
      } else if (role === 'seer') {
        if (target.id === myPlayerId) return { abort: 'cannot_target_self' };
        state.night_actions.seer_target_id = targetId;
      }
      return applyAdvanceNightStep(state, status);
    });
  }

  function applyAdvanceNightStep(state, status) {
    const steps = ['bodyguard', 'werewolf', 'seer'];
    const currentIdx = steps.indexOf(state.night_step);

    if (currentIdx < steps.length - 1) {
      state.night_step = steps[currentIdx + 1];
      state.night_step_start_time = Date.now();
      return { status, state };
    }

    const wolfTarget = state.players.find(p => p.id === state.night_actions.wolf_target_id);
    let victim = null;

    if (wolfTarget && isPlayerAlive(wolfTarget)) {
      if (state.night_actions.protected_id === wolfTarget.id) {
        victim = null;
      } else {
        wolfTarget.alive = false;
        wolfTarget.status = 'dead';
        victim = wolfTarget;
      }
    }

    state.last_night_victim = victim ? { id: victim.id, name: victim.name, role: victim.role } : null;
    state.phase = 'day_announcement';
    state.night_step = 'bodyguard';
    state.night_actions = { protected_id: null, wolf_target_id: null, seer_target_id: null, hunter_shot_id: null };

    if (checkOnlineWin(state)) {
      state.phase = 'finished';
      return { status: 'finished', state };
    }

    return { status: 'day_announcement', state };
  }

  async function advanceNightStep() {
    if (!currentRoomData) return;
    await updateRoomStateAtomically((state, status) => applyAdvanceNightStep(state, status));
  }

  // ==========================================
  // 7. SIKLUS SIANG & VOTING ONLINE
  // ==========================================
  let onlineDiscussionTimer = null;
  let onlineDiscussionSeconds = 120;

  function renderOnlineDayAnnouncement(state) {
    lastRenderedNightKey = null;
    clearCardPickTimer();
    clearVoteResultTimer();
    if (nightStepCountdownTimer) {
      clearInterval(nightStepCountdownTimer);
      nightStepCountdownTimer = null;
    }
    if (onlineDiscussionTimer) {
      clearInterval(onlineDiscussionTimer);
      onlineDiscussionTimer = null;
    }

    const me = state.players.find(p => p.id === myPlayerId);
    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(me ? me.role : null);
    }

    window.WerewolfApp.switchScreen('screenDayAnnouncement');
    window.WerewolfApp.setHudStatusKey('hud_day_phase');
    window.WerewolfAudio.play('bell');

    const newsText = document.getElementById('dayNewsText');
    const hunterPanel = document.getElementById('dayHunterRevengePanel');
    const btnVote = document.getElementById('btnProceedToVoting');
    const btnSkip = document.getElementById('btnSkipDiscussion');

    // Default: Selalu sembunyikan panel tembakan hunter secara ketat
    hunterPanel.classList.add('hidden');
    hunterPanel.style.display = 'none';

    const victim = state.last_night_victim;
    let waitingHunterAction = false;

    if (victim) {
      const vDef = getRoleDef(victim.role);
      newsText.innerHTML = t('night_victim_html', {
        name: victim.name,
        color: vDef.color,
        role: vDef.name
      });

      if (victim.role === 'hunter') {
        const isDeadHunterMe = (victim.id === myPlayerId);
        if (isDeadHunterMe) {
          waitingHunterAction = true;
          setupOnlineHunterShoot(state);
        } else {
          waitingHunterAction = true;
          newsText.innerHTML += `<br><span style="color:var(--role-hunter); font-weight:700;">${t('waiting_hunter_shot', { name: victim.name })}</span>`;
        }
      }
    } else {
      newsText.innerHTML = t('night_peaceful_html');
    }

    // Aksi menuju voting
    const proceedToVotingOnline = async () => {
      if (onlineDiscussionTimer) {
        clearInterval(onlineDiscussionTimer);
        onlineDiscussionTimer = null;
      }
      await updateRoomStateAtomically((freshState, st) => {
        if (st !== 'day_announcement') return { abort: 'not_day_announcement' };
        const endsAt = Date.now() + 45000;
        freshState.phase = 'day_voting';
        freshState.phase_ends_at = endsAt;
        freshState.voting_ends_at = endsAt;
        freshState.players.forEach(p => { p.vote = null; });
        return { status: 'day_voting', state: freshState };
      });
    };

    // Tombol Lanjut ke Voting & Lewati Diskusi
    if (isHost) {
      btnVote.classList.remove('hidden');
      btnVote.disabled = false;
      btnVote.textContent = t('start_voting_btn');
      btnVote.onclick = proceedToVotingOnline;

      if (btnSkip) {
        btnSkip.classList.remove('hidden');
        btnSkip.disabled = false;
        btnSkip.onclick = proceedToVotingOnline;
      }
    } else {
      btnVote.classList.remove('hidden');
      btnVote.disabled = true;
      btnVote.textContent = t('waiting_host_btn');

      if (btnSkip) {
        btnSkip.classList.remove('hidden');
        btnSkip.disabled = false;
        btnSkip.onclick = () => {
          alert(t('only_host_skip'));
        };
      }
    }

    // Countdown Timer Diskusi Terbuka
    onlineDiscussionSeconds = 120;
    const timerDigits = document.getElementById('discussionTimerDigits');
    const updateTimerDisplay = () => {
      if (timerDigits) {
        const m = String(Math.floor(onlineDiscussionSeconds / 60)).padStart(2, '0');
        const s = String(onlineDiscussionSeconds % 60).padStart(2, '0');
        timerDigits.textContent = `${m}:${s}`;
      }
    };
    updateTimerDisplay();

    if (!waitingHunterAction) {
      onlineDiscussionTimer = setInterval(() => {
        onlineDiscussionSeconds--;
        updateTimerDisplay();
        if (onlineDiscussionSeconds <= 0) {
          clearInterval(onlineDiscussionTimer);
          onlineDiscussionTimer = null;
          if (isHost) {
            proceedToVotingOnline();
          }
        }
      }, 1000);
    }
  }

  function setupOnlineHunterShoot(state) {
    const hunterPanel = document.getElementById('dayHunterRevengePanel');
    hunterPanel.classList.remove('hidden');
    hunterPanel.style.display = 'block';
    document.getElementById('hunterRevengeName').textContent = myPlayerName;

    const list = document.getElementById('hunterTargetList');
    list.innerHTML = '';
    mySelectedHunterShotId = null;

    state.players.forEach(p => {
      if (!isPlayerAlive(p) || p.id === myPlayerId) return;
      const card = createOnlineTargetCard(p, t('tag_shoot'));
      card.onclick = () => {
        list.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        mySelectedHunterShotId = p.id;
        window.WerewolfAudio.play('click');
      };
      list.appendChild(card);
    });

    document.getElementById('btnHunterConfirmShoot').onclick = async () => {
      if (!mySelectedHunterShotId) {
        alert(t('hunter_must_pick'));
        return;
      }

      const shotVictim = state.players.find(p => p.id === mySelectedHunterShotId);
      if (shotVictim) {
        shotVictim.alive = false;
        shotVictim.status = 'dead';
      }

      window.WerewolfAudio.play('gunshot');
      hunterPanel.classList.add('hidden');
      hunterPanel.style.display = 'none';

      if (checkOnlineWin(state)) {
        state.phase = 'finished';
        await supabaseClient
          .from('werewolf_rooms')
          .update({
            status: 'finished',
            game_state: state,
            updated_at: new Date().toISOString()
          })
          .eq('room_code', currentRoomCode);
        return;
      }

      state.last_night_victim = null; // Tembakan selesai diproses
      await supabaseClient
        .from('werewolf_rooms')
        .update({
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
    };
  }

  function renderOnlineDayVoting(state) {
    lastRenderedNightKey = null;
    clearCardPickTimer();
    clearVoteResultTimer();
    clearVotingTimer();
    if (onlineDiscussionTimer) {
      clearInterval(onlineDiscussionTimer);
      onlineDiscussionTimer = null;
    }
    const hunterPanel = document.getElementById('dayHunterRevengePanel');
    if (hunterPanel) {
      hunterPanel.classList.add('hidden');
      hunterPanel.style.display = 'none';
    }

    window.WerewolfApp.switchScreen('screenDayVoting');
    window.WerewolfApp.setHudStatusKey('hud_voting');

    const me = state.players.find(p => p.id === myPlayerId);
    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(me ? me.role : null);
    }
    const hasVoted = Boolean(me && me.vote !== null && me.vote !== undefined);
    const alivePlayers = state.players.filter(isPlayerAlive);
    const remainingVoters = alivePlayers.filter(p => p.vote === null || p.vote === undefined).length;

    const list = document.getElementById('votingTargetList');
    list.innerHTML = '';
    if (hasVoted || !isPlayerAlive(me)) {
      mySelectedVoteTargetId = null;
    }

    state.players.forEach(p => {
      if (!isPlayerAlive(p)) return;
      const card = createOnlineTargetCard(p, t('tag_vote_execute'));
      if (mySelectedVoteTargetId === p.id && !hasVoted) {
        card.classList.add('selected');
      }
      if (isPlayerAlive(me) && !hasVoted) {
        card.onclick = () => {
          list.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          mySelectedVoteTargetId = p.id;
          window.WerewolfAudio.play('click');
        };
      } else {
        card.classList.add('disabled');
      }
      list.appendChild(card);
    });

    const btnConfirm = document.getElementById('btnConfirmExecution');
    if (!isPlayerAlive(me)) {
      btnConfirm.textContent = t('you_are_dead');
      btnConfirm.disabled = true;
    } else if (hasVoted) {
      btnConfirm.textContent = t('vote_submitted_count', { count: remainingVoters });
      btnConfirm.disabled = true;
    } else {
      btnConfirm.textContent = t('submit_vote_btn');
      btnConfirm.disabled = false;
      btnConfirm.onclick = async () => {
        if (!mySelectedVoteTargetId) {
          alert(t('must_pick_vote'));
          return;
        }
        window.WerewolfAudio.play('click');
        await submitVoteOnline(mySelectedVoteTargetId);
      };
    }

    const endsAt = state.phase_ends_at || state.voting_ends_at || (Date.now() + 45000);
    const voteDigits = document.getElementById('votingTimerDigits');
    const updateVoteTimer = async () => {
      const remain = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      if (voteDigits) voteDigits.textContent = `${remain}s`;
      if (remain <= 0) {
        clearVotingTimer();
        await finalizeVotingOnTimeout(endsAt);
      }
    };
    const initRemain = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    if (voteDigits) voteDigits.textContent = `${initRemain}s`;
    votingCountdownTimer = setInterval(updateVoteTimer, 1000);
  }

  let isSubmittingVote = false;

  function resolveOnlineVoting(state, alivePlayers) {
    const voteCounts = {};
    let totalSubmitted = 0;
    alivePlayers.forEach(p => {
      if (p.vote !== null && p.vote !== undefined) {
        voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
        totalSubmitted++;
      }
    });

    let highestTargetId = null;
    let maxVotes = 0;
    Object.keys(voteCounts).forEach(tid => {
      if (voteCounts[tid] > maxVotes) {
        maxVotes = voteCounts[tid];
        highestTargetId = tid;
      }
    });

    const executed = highestTargetId ? state.players.find(p => p.id === highestTargetId && isPlayerAlive(p)) : null;
    if (executed) {
      executed.alive = false;
      executed.status = 'dead';
      window.WerewolfAudio.play('gavel');
    }

    const isWin = checkOnlineWin(state);
    state.last_vote_result = {
      counts: voteCounts,
      executed: executed ? { id: executed.id, name: executed.name, role: executed.role } : null,
      total_votes: totalSubmitted,
      result_start_time: Date.now(),
      is_win: isWin
    };
    state.phase_ends_at = null;
    state.voting_ends_at = null;
    state.phase = 'day_vote_result';
    return { status: 'day_vote_result', state };
  }

  async function finalizeVotingOnTimeout(expectedEndsAt) {
    if (isSubmittingVote) return;
    isSubmittingVote = true;
    try {
      await updateRoomStateAtomically((state, status) => {
        if (status !== 'day_voting') return { abort: 'not_voting' };
        const phaseEnd = state.phase_ends_at || state.voting_ends_at;
        if (phaseEnd && Date.now() < phaseEnd - 500) {
          return { abort: 'voting_not_expired' };
        }
        if (expectedEndsAt && phaseEnd && phaseEnd !== expectedEndsAt) {
          return { abort: 'phase_mismatch' };
        }
        const alivePlayers = state.players.filter(isPlayerAlive);
        return resolveOnlineVoting(state, alivePlayers);
      });
    } finally {
      isSubmittingVote = false;
    }
  }

  async function submitVoteOnline(targetId) {
    if (isSubmittingVote) return;
    isSubmittingVote = true;
    try {
      await updateRoomStateAtomically((state, status) => {
        if (status !== 'day_voting') {
          return { abort: 'not_voting' };
        }
        const me = state.players.find(p => p.id === myPlayerId);
        const target = state.players.find(p => p.id === targetId);
        if (!isPlayerAlive(me) || !isPlayerAlive(target)) {
          return { abort: 'invalid_vote_target' };
        }
        if (me.vote === null || me.vote === undefined) {
          me.vote = targetId;
        }

        const alivePlayers = state.players.filter(isPlayerAlive);
        const allVoted = alivePlayers.every(p => p.vote !== null && p.vote !== undefined);

        if (allVoted) {
          return resolveOnlineVoting(state, alivePlayers);
        }

        return { status, state };
      });
    } finally {
      isSubmittingVote = false;
    }
  }

  async function proceedAfterVoteResult() {
    await updateRoomStateAtomically((state, status) => {
      if (status !== 'day_vote_result') {
        return { abort: 'already_advanced' };
      }
      const isWin = checkOnlineWin(state);
      state.players.forEach(p => { p.vote = null; });
      if (isWin) {
        state.phase = 'finished';
        return { status: 'finished', state };
      }
      state.phase = 'night';
      state.night_step = 'bodyguard';
      state.night_step_start_time = Date.now();
      return { status: 'night', state };
    });
  }

  function renderOnlineVoteResult(state) {
    lastRenderedNightKey = null;
    clearCardPickTimer();
    clearVoteResultTimer();

    window.WerewolfApp.switchScreen('screenVoteResult');
    window.WerewolfApp.setHudStatusKey('hud_vote_result');

    const me = state.players.find(p => p.id === myPlayerId);
    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(me ? me.role : null);
    }

    const res = state.last_vote_result || { counts: {}, executed: null, result_start_time: Date.now(), is_win: false };
    const elimEl = document.getElementById('voteResultEliminatedText');
    if (elimEl) {
      if (res.executed) {
        const def = getRoleDef(res.executed.role);
        elimEl.innerHTML = t('vote_eliminated_html', {
          name: res.executed.name,
          color: def.color,
          role: def.name
        });
      } else {
        elimEl.textContent = t('vote_none_eliminated');
      }
    }

    const listEl = document.getElementById('voteResultList');
    if (listEl) {
      listEl.innerHTML = '';
      const counts = res.counts || {};
      const entries = Object.keys(counts)
        .map(pid => {
          const pl = state.players.find(p => p.id === pid);
          return { id: pid, name: pl ? pl.name : pid, count: counts[pid], isEliminated: Boolean(res.executed && res.executed.id === pid) };
        })
        .sort((a, b) => b.count - a.count);

      entries.forEach(item => {
        const row = document.createElement('div');
        row.className = 'roster-item' + (item.isEliminated ? ' is-me' : '');
        row.innerHTML = `
          <div class="roster-name-wrap">
            <span class="roster-name">${item.name}</span>
          </div>
          <span class="roster-status-badge" style="${item.isEliminated ? 'border-color:var(--blood-glow); color:var(--rose-light);' : ''}">
            ${t('vote_count_badge', { count: item.count })}
          </span>
        `;
        listEl.appendChild(row);
      });
    }

    const btnContinue = document.getElementById('btnContinueAfterVote');
    if (btnContinue) {
      if (isHost) {
        btnContinue.classList.remove('hidden');
        btnContinue.disabled = false;
        btnContinue.textContent = res.is_win ? t('continue_gameover_btn') : t('continue_night_btn');
        btnContinue.onclick = async () => {
          clearVoteResultTimer();
          await proceedAfterVoteResult();
        };
      } else {
        btnContinue.classList.remove('hidden');
        btnContinue.disabled = true;
        btnContinue.textContent = t('waiting_host_btn');
      }
    }

    const startTime = res.result_start_time || Date.now();
    const durationMs = 6000;
    const timerDigits = document.getElementById('voteResultTimerDigits');
    const progressBar = document.getElementById('voteResultProgressBar');
    const updateTimer = async () => {
      const elapsedMs = Date.now() - startTime;
      const remainMs = Math.max(0, durationMs - elapsedMs);
      const remain = Math.ceil(remainMs / 1000);
      if (timerDigits) timerDigits.textContent = `${remain}s`;
      if (progressBar) progressBar.style.width = `${(remainMs / durationMs) * 100}%`;
      if (remainMs <= 0) {
        clearVoteResultTimer();
        if (isHost && voteResultTransitionedAt !== startTime) {
          voteResultTransitionedAt = startTime;
          await proceedAfterVoteResult();
        }
      }
    };

    const initRemainMs = Math.max(0, durationMs - (Date.now() - startTime));
    if (timerDigits) timerDigits.textContent = `${Math.ceil(initRemainMs / 1000)}s`;
    if (progressBar) progressBar.style.width = `${(initRemainMs / durationMs) * 100}%`;
    voteResultCountdownTimer = setInterval(updateTimer, 200);
  }

  function checkOnlineWin(state) {
    const wolves = state.players.filter(p => p.role === 'werewolf' && p.alive).length;
    const nonWolves = state.players.filter(p => p.role !== 'werewolf' && p.alive).length;

    if (wolves === 0) {
      state.winner = 'villager';
      return true;
    } else if (wolves >= nonWolves) {
      state.winner = 'werewolf';
      return true;
    }
    return false;
  }

  // ==========================================
  // 8. GAME OVER & AUTO-CLEANUP
  // ==========================================
  let gameOverCleanupRoom = null;

  function renderOnlineGameOver(state) {
    lastRenderedNightKey = null;
    clearCardPickTimer();
    clearVoteResultTimer();
    clearSessionCache();
    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(null);
    }
    window.WerewolfApp.switchScreen('screenGameOver');
    window.WerewolfAudio.play('victory');

    const titleEl = document.getElementById('gameOverTitle');
    const descEl = document.getElementById('gameOverDesc');
    const rosterEl = document.getElementById('gameOverRoster');

    if (state.winner === 'villager') {
      titleEl.textContent = t('villager_win_title');
      titleEl.style.color = 'var(--role-villager)';
      descEl.textContent = t('villager_win_desc');
    } else {
      titleEl.textContent = t('wolf_win_title');
      titleEl.style.color = 'var(--role-wolf)';
      descEl.textContent = t('wolf_win_desc');
    }

    rosterEl.innerHTML = '';
    state.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'roster-item';
      const def = getRoleDef(p.role);
      row.innerHTML = `
        <div class="roster-name-wrap">
          <span class="roster-name">${p.name} ${p.id === myPlayerId ? t('you_tag') : ''}</span>
          <span style="font-size:11px; color:${p.alive ? 'var(--role-hunter)' : 'var(--text-muted)'}; font-weight:700;">
            (${p.alive ? t('status_alive') : t('status_dead')})
          </span>
        </div>
        <span class="roster-status-badge" style="color:${def.color}; border:1px solid ${def.color}; background:rgba(0,0,0,0.5);">
          ${def.name}
        </span>
      `;
      rosterEl.appendChild(row);
    });

    // Auto-delete room di Supabase setelah 30 detik (sekali saja) agar semua pemain sempat menerima Game Over
    if (isHost && currentRoomCode && gameOverCleanupRoom !== currentRoomCode) {
      gameOverCleanupRoom = currentRoomCode;
      setTimeout(() => {
        deleteCurrentRoom();
      }, 30000);
    }
  }

  async function deleteCurrentRoom() {
    if (!currentRoomCode) return;
    try {
      const client = initClient();
      if (client) {
        await client.from('werewolf_rooms').delete().eq('room_code', currentRoomCode);
      }
    } catch (e) {
      console.warn('Auto delete room notice:', e);
    }
  }

  async function leaveRoom(shouldSync = true) {
    if (isLeavingRoom) return;
    isLeavingRoom = true;
    try {
      clearCardPickTimer();
      clearVoteResultTimer();
      clearVotingTimer();
      if (maxPlayersDebounceTimer) {
        clearTimeout(maxPlayersDebounceTimer);
        maxPlayersDebounceTimer = null;
      }
      if (roleAdjustDebounceTimer) {
        clearTimeout(roleAdjustDebounceTimer);
        roleAdjustDebounceTimer = null;
      }
      if (nightStepCountdownTimer) {
        clearInterval(nightStepCountdownTimer);
        nightStepCountdownTimer = null;
      }
      if (onlineDiscussionTimer) {
        clearInterval(onlineDiscussionTimer);
        onlineDiscussionTimer = null;
      }

      const leavingRoomCode = currentRoomCode;
      const leavingPlayerId = myPlayerId;
      const client = initClient();

      if (shouldSync && leavingRoomCode && leavingPlayerId && client) {
        try {
          const { data: freshRow } = await client
            .from('werewolf_rooms')
            .select('room_code, status, game_state, updated_at')
            .eq('room_code', leavingRoomCode)
            .single();

          if (freshRow && freshRow.game_state) {
            const state = freshRow.game_state;
            const idx = state.players.findIndex(p => p.id === leavingPlayerId);
            if (idx !== -1) {
              const wasHost = Boolean(state.players[idx].is_host);
              state.players.splice(idx, 1);

              if (state.players.length === 0) {
                await client.from('werewolf_rooms').delete().eq('room_code', leavingRoomCode);
              } else {
                if (wasHost) {
                  state.players[0].is_host = true;
                  state.host_id = state.players[0].id;
                }
                let nextStatus = freshRow.status;
                if (freshRow.status !== 'lobby' && freshRow.status !== 'finished') {
                  if (checkOnlineWin(state)) {
                    state.phase = 'finished';
                    nextStatus = 'finished';
                  }
                }
                await client
                  .from('werewolf_rooms')
                  .update({
                    status: nextStatus,
                    game_state: state,
                    updated_at: new Date().toISOString()
                  })
                  .eq('room_code', leavingRoomCode);
              }
            }
          }
        } catch (err) {
          console.warn('Leave room sync notice:', err);
        }
      }

      clearSessionCache();

      if (activeChannel && supabaseClient) {
        try {
          await supabaseClient.removeChannel(activeChannel);
        } catch {}
        activeChannel = null;
      }

      currentRoomCode = null;
      currentRoomData = null;
      myPlayerId = null;
      myPlayerName = '';
      isHost = false;
      lastRenderedNightKey = null;
      chatMessages = [];
      chatUnreadCount = 0;
      isChatOpen = false;
      updateChatBadge();
      updateHudRoomControls(null, null);

      if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
        window.WerewolfApp.setHudRole(null);
      }
      window.WerewolfApp.switchScreen('screenMainMenu');
    } finally {
      isLeavingRoom = false;
    }
  }

  function createOnlineTargetCard(player, tagText, isDisabled = false) {
    const card = document.createElement('div');
    card.className = 'target-card' + (isDisabled ? ' disabled' : '');
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="target-name">${player.name}</span>
        <span style="font-size:10px; color:var(--text-muted); font-weight:700;">(${tagText})</span>
      </div>
      <div class="target-radio-indicator"></div>
    `;
    return card;
  }

  window.WerewolfOnlineEngine = {
    createRoom,
    joinRoom,
    adjustOnlineMaxPlayers,
    adjustOnlineRole,
    startOnlineGame,
    leaveRoom,
    restoreSessionOnLoad,
    isInRoom: () => Boolean(currentRoomCode)
  };
})();
