// ====================================================================
// ONLINE-SUPABASE.JS - Engine Multiplayer Online Berbasis Supabase
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  function t(key, vars) {
    return window.WerewolfI18n ? window.WerewolfI18n.t(key, vars) : key;
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
  let mySelectedCardId = null;
  let mySelectedNightTargetId = null;
  let mySelectedVoteTargetId = null;
  let mySelectedHunterShotId = null;
  let onlineDiscussionInterval = null;
  let roomPollingInterval = null;
  let nightStepCountdownTimer = null;

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

    const { error } = await client.from('werewolf_rooms').insert([
      {
        room_code: code,
        status: 'lobby',
        game_state: initialGameState,
        updated_at: new Date().toISOString()
      }
    ]);

    if (error) {
      alert(t('create_room_err', { msg: error.message }));
      return;
    }

    subscribeToRoom(code);
    renderLobbyScreen(initialGameState);
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
    if (gameState.players.length >= 15) {
      alert(t('room_full'));
      return;
    }

    myPlayerId = generateUUID();
    myPlayerName = playerName;
    isHost = false;
    currentRoomCode = roomCode;

    gameState.players.push({
      id: myPlayerId,
      name: playerName,
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

    await client
      .from('werewolf_rooms')
      .update({
        game_state: gameState,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', roomCode);

    subscribeToRoom(roomCode);
    renderLobbyScreen(gameState);
  }

  function startRoomPolling(roomCode) {
    stopRoomPolling();
    roomPollingInterval = setInterval(async () => {
      if (!currentRoomCode || !supabaseClient) return;
      try {
        const { data: room } = await supabaseClient
          .from('werewolf_rooms')
          .select('*')
          .eq('room_code', currentRoomCode)
          .single();

        if (room && room.game_state) {
          if (!currentRoomData || room.status !== currentRoomData.status || room.updated_at !== currentRoomData.updated_at) {
            handleRoomStateSync(room);
          }
        }
      } catch (err) {
        // Abaikan network jitter
      }
    }, 1200);
  }

  function stopRoomPolling() {
    if (roomPollingInterval) {
      clearInterval(roomPollingInterval);
      roomPollingInterval = null;
    }
  }

  // ==========================================
  // REALTIME SUBSCRIPTION
  // ==========================================
  function subscribeToRoom(roomCode) {
    const client = initClient();
    if (!client) return;

    if (activeChannel) {
      supabaseClient.removeChannel(activeChannel);
    }

    startRoomPolling(roomCode);

    activeChannel = client
      .channel('werewolf_room_' + roomCode)
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
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime tersambung ke room:', roomCode);
        }
      });
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

    if (status === 'lobby') {
      renderLobbyScreen(state);
    } else if (status === 'card_pick') {
      renderOnlineCardPick(state);
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

    document.getElementById('onlinePlayerCountBadge').textContent = t('player_count_max', { count: state.players.length });

    // Pengaturan Role (Hanya Host yang bisa mengubah)
    const hostRoleControls = document.getElementById('onlineHostRoleControls');
    const guestRoleSummary = document.getElementById('onlineGuestRoleSummary');
    const btnStartGame = document.getElementById('btnStartOnlineGame');

    if (isHost) {
      hostRoleControls.classList.remove('hidden');
      guestRoleSummary.classList.add('hidden');
      btnStartGame.classList.remove('hidden');

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

      btnStartGame.disabled = (state.players.length < 5 || totalRoles !== state.players.length);
    } else {
      hostRoleControls.classList.add('hidden');
      guestRoleSummary.classList.remove('hidden');
      btnStartGame.classList.add('hidden');

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

  async function adjustOnlineRole(role, delta) {
    if (!isHost || !currentRoomData) return;
    const state = currentRoomData.game_state;
    const current = state.role_config[role] || 0;
    const nextVal = current + delta;
    if (nextVal < 0) return;
    if (role === 'werewolf' && nextVal < 1) return;

    state.role_config[role] = nextVal;
    renderLobbyScreen(state); // Update optimistik di layar Host

    await supabaseClient
      .from('werewolf_rooms')
      .update({
        game_state: state,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', currentRoomCode);
  }

  // ==========================================
  // 4. MULAI PERMAINAN (CARD PICK FASE)
  // ==========================================
  async function startOnlineGame() {
    if (!isHost || !currentRoomData) return;
    const state = currentRoomData.game_state;

    const totalRoles = Object.values(state.role_config).reduce((a, b) => a + b, 0);
    if (totalRoles !== state.players.length) {
      alert(t('role_sum_mismatch', { sum: totalRoles, total: state.players.length }));
      return;
    }

    // Bangun dan acak kartu
    const pool = [];
    Object.keys(state.role_config).forEach(role => {
      for (let i = 0; i < state.role_config[role]; i++) {
        pool.push(role);
      }
    });

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    state.cards = pool.map((role, idx) => ({
      id: idx,
      role: role,
      picked_by: null
    }));

    state.phase = 'card_pick';
    state.card_pick_turn_index = 0;
    state.card_pick_turn_start_time = Date.now();
    state.card_pick_start_time = Date.now();

    await supabaseClient
      .from('werewolf_rooms')
      .update({
        status: 'card_pick',
        game_state: state,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', currentRoomCode);
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

  function renderOnlineCardPick(state) {
    lastRenderedNightKey = null;
    clearVoteResultTimer();
    window.WerewolfApp.switchScreen('screenCardPick');
    window.WerewolfApp.setHudStatusKey('hud_pick_card');

    const me = state.players.find(p => p.id === myPlayerId);
    const hasPicked = Boolean(me && me.card_id !== null && me.card_id !== undefined);
    const turnIndex = typeof state.card_pick_turn_index === 'number' ? state.card_pick_turn_index : 0;
    const activePicker = state.players[turnIndex] || null;
    const allPicked = !activePicker || state.cards.every(c => c.picked_by !== null);
    const isMyPickTurn = Boolean(activePicker && activePicker.id === myPlayerId && !hasPicked && !allPicked);

    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(hasPicked && me ? me.role : null);
    }

    const headerTitle = document.getElementById('cardPickHeaderTitle');
    const headerDesc = document.getElementById('cardPickHeaderDesc');
    if (hasPicked) {
      headerTitle.textContent = t('card_pick_yours_title');
      headerDesc.textContent = allPicked
        ? t('card_pick_done_desc')
        : t('card_pick_wait_turn_title', { name: activePicker.name });
    } else if (isMyPickTurn) {
      headerTitle.textContent = t('card_pick_your_turn_title');
      headerDesc.textContent = t('card_pick_your_turn_desc');
    } else if (activePicker) {
      headerTitle.textContent = t('card_pick_wait_turn_title', { name: activePicker.name });
      headerDesc.textContent = t('card_pick_wait_turn_desc');
    } else {
      headerTitle.textContent = t('card_pick_title');
      headerDesc.textContent = t('card_pick_desc');
    }

    const totalCards = state.cards.length;
    const pickedCards = state.cards.filter(c => c.picked_by !== null).length;
    const remainingCards = Math.max(0, totalCards - pickedCards);

    const metaBar = document.getElementById('cardPickMetaBar');
    const quotaBadge = document.getElementById('cardPickQuotaBadge');
    const timerBadge = document.getElementById('cardPickTimerBadge');
    const timerDigits = document.getElementById('cardPickTimerDigits');
    if (metaBar) {
      metaBar.classList.remove('hidden');
      metaBar.style.display = 'flex';
    }
    if (quotaBadge) {
      quotaBadge.textContent = t('card_pick_quota', {
        picked: pickedCards,
        total: totalCards,
        remaining: remainingCards
      });
    }

    clearCardPickTimer();
    if (timerBadge) {
      if (allPicked) {
        timerBadge.classList.add('hidden');
      } else {
        timerBadge.classList.remove('hidden');
      }
    }

    if (!allPicked && activePicker) {
      const turnStartTime = state.card_pick_turn_start_time || state.card_pick_start_time || Date.now();
      const turnKey = `${turnIndex}:${turnStartTime}`;
      const updateCardPickTimer = async () => {
        const elapsed = Math.floor((Date.now() - turnStartTime) / 1000);
        const remain = Math.max(0, 3 - elapsed);
        if (timerDigits) timerDigits.textContent = `${remain}s`;

        if (remain <= 0 && autoPickHandledTurnKey !== turnKey) {
          // Active player auto-picks at 3s; Host acts as fallback at 4s if player lagged/disconnected
          if (isMyPickTurn || (isHost && elapsed >= 4)) {
            autoPickHandledTurnKey = turnKey;
            clearCardPickTimer();
            const available = state.cards.filter(c => c.picked_by === null);
            if (available.length > 0) {
              const randomCard = available[Math.floor(Math.random() * available.length)];
              await pickCardAtomically(randomCard.id, activePicker.id);
            }
          }
        }
      };

      const initRemain = Math.max(0, 3 - Math.floor((Date.now() - turnStartTime) / 1000));
      if (timerDigits) timerDigits.textContent = `${initRemain}s`;
      cardPickCountdownTimer = setInterval(updateCardPickTimer, 500);
    }

    const grid = document.getElementById('cardPickGrid');
    grid.innerHTML = '';

    state.cards.forEach((c, idx) => {
      const isTaken = (c.picked_by !== null);
      const isMine = (c.picked_by === myPlayerId);
      const picker = isTaken ? state.players.find(p => p.id === c.picked_by) : null;
      const cDef = getRoleDef(c.role);

      const cardEl = document.createElement('div');
      cardEl.className = 'card-pick-item' + (isMine ? ' flipped is-mine' : (isTaken ? ' taken' : ''));
      if (!isMyPickTurn && !isMine && !isTaken) {
        cardEl.style.cursor = 'not-allowed';
        cardEl.style.opacity = '0.7';
      }

      const backStatusText = isTaken && !isMine && picker
        ? t('card_taken_by', { name: picker.name })
        : t('card_label', { n: idx + 1 });

      cardEl.innerHTML = `
        <div class="card-face card-back">
          <div class="card-back-pattern">${window.WerewolfIcons.get('moon')}</div>
          <div class="card-back-number">${backStatusText}</div>
        </div>
        <div class="card-face card-front ${isMine ? cDef.badgeClass : ''}">
          <div class="card-front-icon">${isMine ? window.WerewolfIcons.get(c.role) : ''}</div>
          <div class="card-front-title">${isMine ? cDef.name : t('card_taken')}</div>
          ${isMine ? `<div class="card-mine-badge">${t('card_mine_badge')}</div>` : ''}
        </div>
      `;

      if (isMyPickTurn && !isTaken) {
        cardEl.onclick = () => {
          pickCardAtomically(c.id, myPlayerId);
        };
      }

      grid.appendChild(cardEl);
    });

    const roleRevealPanel = document.getElementById('cardPickRoleReveal');
    const actionBtns = document.getElementById('cardPickActionBtns');
    const btnRandom = document.getElementById('btnCardPickRandom');

    if (hasPicked) {
      btnRandom.classList.add('hidden');
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
        me.ready = true;
        await syncPlayerReadyState();
      };
    } else {
      roleRevealPanel.classList.add('hidden');
      actionBtns.classList.add('hidden');

      if (isMyPickTurn) {
        btnRandom.classList.remove('hidden');
        btnRandom.disabled = false;
        btnRandom.onclick = () => {
          const available = state.cards.filter(c => c.picked_by === null);
          if (available.length === 0) return;
          const randomCard = available[Math.floor(Math.random() * available.length)];
          pickCardAtomically(randomCard.id, myPlayerId);
        };
      } else {
        btnRandom.classList.add('hidden');
      }
    }
  }

  let isPickingCard = false;

  async function updateRoomStateAtomically(mutatorFn, maxRetries = 8) {
    if (!supabaseClient || !currentRoomCode) return { ok: false, reason: 'no_room' };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const { data: freshRow, error: fetchError } = await supabaseClient
        .from('werewolf_rooms')
        .select('room_code, status, game_state, updated_at')
        .eq('room_code', currentRoomCode)
        .single();

      if (fetchError || !freshRow || !freshRow.game_state) {
        return { ok: false, reason: 'fetch_error' };
      }

      const clonedState = JSON.parse(JSON.stringify(freshRow.game_state));
      const outcome = mutatorFn(clonedState, freshRow.status);
      if (outcome && outcome.abort) {
        handleRoomStateSync(freshRow);
        return { ok: false, reason: outcome.abort };
      }

      const nextStatus = (outcome && outcome.status) || freshRow.status;
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
        .eq('updated_at', freshRow.updated_at)
        .select('room_code, status, game_state, updated_at');

      if (!updateError && Array.isArray(updatedRows) && updatedRows.length > 0) {
        handleRoomStateSync(updatedRows[0]);
        return { ok: true, row: updatedRows[0] };
      }

      await new Promise(resolve => setTimeout(resolve, 45 + Math.floor(Math.random() * 90)));
    }

    return { ok: false, reason: 'conflict' };
  }

  async function pickCardAtomically(cardId, targetPlayerId = myPlayerId) {
    if (!currentRoomData || isPickingCard) return;
    isPickingCard = true;
    try {
      const res = await updateRoomStateAtomically((state, status) => {
        if (status !== 'card_pick') return { abort: 'not_card_pick' };
        const turnIdx = typeof state.card_pick_turn_index === 'number' ? state.card_pick_turn_index : 0;
        const activePlayer = state.players[turnIdx];
        if (!activePlayer || activePlayer.id !== targetPlayerId) {
          return { abort: 'not_your_turn' };
        }
        if (activePlayer.card_id !== null && activePlayer.card_id !== undefined) {
          return { abort: 'already_picked' };
        }

        const card = state.cards.find(c => c.id === cardId);
        if (!card || card.picked_by !== null) {
          return { abort: 'taken' };
        }

        card.picked_by = targetPlayerId;
        activePlayer.card_id = cardId;
        activePlayer.role = card.role;
        state.card_pick_turn_index = turnIdx + 1;
        state.card_pick_turn_start_time = Date.now();
        return { state };
      });

      if (res.ok && targetPlayerId === myPlayerId) {
        window.WerewolfAudio.play('flip');
      } else if (res.reason === 'taken' && targetPlayerId === myPlayerId) {
        alert(t('card_already_taken'));
      }
    } finally {
      isPickingCard = false;
    }
  }

  async function syncPlayerReadyState() {
    if (!currentRoomData) return;
    await updateRoomStateAtomically((state, status) => {
      const me = state.players.find(p => p.id === myPlayerId);
      if (me) me.ready = true;

      const allReady = state.players.every(
        p => p.ready && p.card_id !== null && p.card_id !== undefined
      );
      if (allReady) {
        state.phase = 'night';
        state.night_step = 'bodyguard';
        state.night_step_start_time = Date.now();
        state.players.forEach(p => { p.ready = false; });
        return { status: 'night', state };
      }
      return { status, state };
    });
  }

  // ==========================================
  // 6. SIKLUS MALAM REALTIME
  // ==========================================
  function renderOnlineNight(state) {
    clearCardPickTimer();
    clearVoteResultTimer();

    const me = state.players.find(p => p.id === myPlayerId);
    const currentStep = state.night_step; // 'bodyguard' | 'werewolf' | 'seer' | 'resolving'
    const isMyTurn = (me && me.alive && me.role === currentStep);

    if (window.WerewolfApp && window.WerewolfApp.setHudRole) {
      window.WerewolfApp.setHudRole(me ? me.role : null);
    }

    const nightKey = `${currentStep}:${state.night_step_start_time || 0}:${isMyTurn ? '1' : '0'}`;
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
              const valids = state.players.filter(p => p.alive && p.id !== me.last_protected);
              if (valids.length > 0) mySelectedNightTargetId = valids[0].id;
            } else if (currentStep === 'werewolf') {
              const valids = state.players.filter(p => p.alive && p.role !== 'werewolf');
              if (valids.length > 0) mySelectedNightTargetId = valids[0].id;
            } else if (currentStep === 'seer') {
              const valids = state.players.filter(p => p.alive && p.id !== myPlayerId);
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
          if (!p.alive) return;
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
          if (!p.alive) return;
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
          if (!p.alive || p.id === myPlayerId) return;
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
      if (role === 'bodyguard') {
        state.night_actions.protected_id = targetId;
        const me = state.players.find(p => p.id === myPlayerId);
        if (me) me.last_protected = targetId;
      } else if (role === 'werewolf') {
        state.night_actions.wolf_target_id = targetId;
      } else if (role === 'seer') {
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

    if (wolfTarget && wolfTarget.alive) {
      if (state.night_actions.protected_id === wolfTarget.id) {
        victim = null;
      } else {
        wolfTarget.alive = false;
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
      state.phase = 'day_voting';
      state.players.forEach(p => p.vote = null);
      await supabaseClient
        .from('werewolf_rooms')
        .update({
          status: 'day_voting',
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
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
      if (!p.alive || p.id === myPlayerId) return;
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
      if (shotVictim) shotVictim.alive = false;

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
    const alivePlayers = state.players.filter(p => p.alive);
    const remainingVoters = alivePlayers.filter(p => p.vote === null || p.vote === undefined).length;

    const list = document.getElementById('votingTargetList');
    list.innerHTML = '';
    if (hasVoted || !me || !me.alive) {
      mySelectedVoteTargetId = null;
    }

    state.players.forEach(p => {
      if (!p.alive) return;
      const card = createOnlineTargetCard(p, t('tag_vote_execute'));
      if (mySelectedVoteTargetId === p.id && !hasVoted) {
        card.classList.add('selected');
      }
      if (me && me.alive && !hasVoted) {
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
    if (!me || !me.alive) {
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
  }

  let isSubmittingVote = false;

  async function submitVoteOnline(targetId) {
    if (isSubmittingVote) return;
    isSubmittingVote = true;
    try {
      await updateRoomStateAtomically((state, status) => {
        if (status !== 'day_voting') {
          return { abort: 'not_voting' };
        }
        const me = state.players.find(p => p.id === myPlayerId);
        if (me && me.alive && (me.vote === null || me.vote === undefined)) {
          me.vote = targetId;
        }

        const alivePlayers = state.players.filter(p => p.alive);
        const allVoted = alivePlayers.every(p => p.vote !== null && p.vote !== undefined);

        if (allVoted) {
          const voteCounts = {};
          alivePlayers.forEach(p => {
            voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
          });

          let highestTargetId = null;
          let maxVotes = 0;
          Object.keys(voteCounts).forEach(tid => {
            if (voteCounts[tid] > maxVotes) {
              maxVotes = voteCounts[tid];
              highestTargetId = tid;
            }
          });

          const executed = state.players.find(p => p.id === highestTargetId);
          if (executed) {
            executed.alive = false;
            window.WerewolfAudio.play('gavel');
          }

          const isWin = checkOnlineWin(state);
          state.last_vote_result = {
            counts: voteCounts,
            executed: executed ? { id: executed.id, name: executed.name, role: executed.role } : null,
            total_votes: alivePlayers.length,
            result_start_time: Date.now(),
            is_win: isWin
          };
          state.phase = 'day_vote_result';
          return { status: 'day_vote_result', state };
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
    const timerDigits = document.getElementById('voteResultTimerDigits');
    const updateTimer = async () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remain = Math.max(0, 6 - elapsed);
      if (timerDigits) timerDigits.textContent = `${remain}s`;
      if (remain <= 0) {
        clearVoteResultTimer();
        if (isHost && voteResultTransitionedAt !== startTime) {
          voteResultTransitionedAt = startTime;
          await proceedAfterVoteResult();
        }
      }
    };

    const initRemain = Math.max(0, 6 - Math.floor((Date.now() - startTime) / 1000));
    if (timerDigits) timerDigits.textContent = `${initRemain}s`;
    voteResultCountdownTimer = setInterval(updateTimer, 1000);
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
    stopRoomPolling();
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

  function leaveRoom(shouldDelete = true) {
    stopRoomPolling();
    if (nightStepCountdownTimer) {
      clearInterval(nightStepCountdownTimer);
      nightStepCountdownTimer = null;
    }
    if (shouldDelete && isHost && currentRoomCode) {
      deleteCurrentRoom();
    }
    if (activeChannel && supabaseClient) {
      supabaseClient.removeChannel(activeChannel);
      activeChannel = null;
    }
    currentRoomCode = null;
    currentRoomData = null;
    window.WerewolfApp.switchScreen('screenMainMenu');
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
    adjustOnlineRole,
    startOnlineGame,
    leaveRoom
  };
})();
