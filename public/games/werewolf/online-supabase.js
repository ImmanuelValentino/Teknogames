// ====================================================================
// ONLINE-SUPABASE.JS - Engine Multiplayer Online Berbasis Supabase
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  const ROLE_DEFS = {
    werewolf: {
      name: 'Werewolf',
      team: 'werewolf',
      color: '#ef4444',
      badgeClass: 'role-werewolf',
      desc: 'Bangkit saat malam tiba dan mangsa warga desa bersama kawananmu. Sembunyikan identitasmu saat fajar.'
    },
    villager: {
      name: 'Warga Biasa',
      team: 'villager',
      color: '#38bdf8',
      badgeClass: 'role-villager',
      desc: 'Warga desa tak bersalah. Gunakan deduksi dan insting tajammu saat voting siang untuk membasmi serigala.'
    },
    seer: {
      name: 'Penerawang (Seer)',
      team: 'villager',
      color: '#c084fc',
      badgeClass: 'role-seer',
      desc: 'Setiap malam, terawang satu warga untuk mengungkap apakah ia bagian dari kawanan Werewolf.'
    },
    bodyguard: {
      name: 'Pelindung (Bodyguard)',
      team: 'villager',
      color: '#fbbf24',
      badgeClass: 'role-bodyguard',
      desc: 'Lindungi satu warga dari terkaman malam. Kamu tidak boleh melindungi orang yang sama 2 malam berturut-turut.'
    },
    hunter: {
      name: 'Pemburu (Hunter)',
      team: 'villager',
      color: '#34d399',
      badgeClass: 'role-hunter',
      desc: 'Jika kamu tereliminasi (malam atau siang), kamu berhak menembak mati 1 pemain lain sebelum menghembuskan napas terakhir.'
    }
  };

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
      alert('Tidak dapat terhubung ke server Supabase. Pastikan koneksi internet aktif.');
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
      alert('Gagal membuat room di Supabase: ' + error.message);
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
      alert('Tidak dapat terhubung ke server Supabase. Pastikan koneksi internet aktif.');
      return;
    }

    playerName = playerName.trim() || 'Pemain';
    roomCode = roomCode.trim();

    if (!roomCode || roomCode.length !== 6) {
      alert('Masukkan 6 digit kode room yang valid!');
      return;
    }

    const { data: room, error } = await client
      .from('werewolf_rooms')
      .select('*')
      .eq('room_code', roomCode)
      .single();

    if (error || !room) {
      alert('Room dengan kode ' + roomCode + ' tidak ditemukan atau sudah ditutup.');
      return;
    }

    if (room.status !== 'lobby') {
      alert('Permainan di room ' + roomCode + ' sudah dimulai!');
      return;
    }

    const gameState = room.game_state;
    if (gameState.players.length >= 15) {
      alert('Room ini sudah penuh (maksimal 15 pemain)!');
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

  // ==========================================
  // REALTIME SUBSCRIPTION
  // ==========================================
  function subscribeToRoom(roomCode) {
    const client = initClient();
    if (!client) return;

    if (activeChannel) {
      supabaseClient.removeChannel(activeChannel);
    }

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
            alert('Room telah ditutup atau selesai.');
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
    } else if (status === 'finished') {
      renderOnlineGameOver(state);
    }
  }

  // ==========================================
  // 3. TAMPILAN LOBI ONLINE
  // ==========================================
  function renderLobbyScreen(state) {
    window.WerewolfApp.switchScreen('screenOnlineLobby');
    window.WerewolfApp.setHudStatus(`LOBI: ${state.room_code}`);

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
          <span class="roster-name">${p.name} ${isMe ? '(Kamu)' : ''}</span>
        </div>
        <span class="roster-status-badge ${p.ready ? 'ready' : ''}">
          ${p.is_host ? 'Host' : (p.ready ? 'Siap' : 'Menunggu')}
        </span>
      `;
      rosterList.appendChild(row);
    });

    document.getElementById('onlinePlayerCountBadge').textContent = `${state.players.length} / 15 Pemain`;

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

      guestRoleSummary.innerHTML = `
        <div style="font-size:12px; color:var(--text-muted); line-height:1.6;">
          <strong>Komposisi Peran:</strong> Werewolf (${state.role_config.werewolf}), Warga (${state.role_config.villager}), Seer (${state.role_config.seer}), Bodyguard (${state.role_config.bodyguard}), Hunter (${state.role_config.hunter})<br>
          <em>Menunggu Host memulai permainan...</em>
        </div>
      `;
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
      alert(`Jumlah peran (${totalRoles}) belum sama dengan jumlah pemain (${state.players.length})!`);
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
  function renderOnlineCardPick(state) {
    window.WerewolfApp.switchScreen('screenCardPick');
    window.WerewolfApp.setHudStatus('PILIH KARTU');

    const me = state.players.find(p => p.id === myPlayerId);
    const hasPicked = Boolean(me && me.card_id !== null);

    document.getElementById('cardPickHeaderTitle').textContent = hasPicked ? 'Kartu Peranmu' : 'Pilih 1 Kartu Rahasiamu';
    document.getElementById('cardPickHeaderDesc').textContent = hasPicked
      ? 'Hafalkan peran dan tugasmu. Tekan tombol Siap untuk melanjutkan.'
      : 'Pilih tepat 1 kartu tertutup di bawah ini atau tekan tombol Pilih Acak.';

    const grid = document.getElementById('cardPickGrid');
    grid.innerHTML = '';

    state.cards.forEach((c, idx) => {
      const isTaken = (c.picked_by !== null);
      const isMine = (c.picked_by === myPlayerId);

      const cardEl = document.createElement('div');
      cardEl.className = 'card-pick-item' + (isTaken ? ' taken' : '') + (isMine ? ' flipped' : '');

      cardEl.innerHTML = `
        <div class="card-face card-back">
          <div class="card-back-pattern">${window.WerewolfIcons.get('moon')}</div>
          <div class="card-back-number">KARTU ${idx + 1}</div>
        </div>
        <div class="card-face card-front ${isMine ? ROLE_DEFS[c.role].badgeClass : ''}">
          <div class="card-front-icon">${isMine ? window.WerewolfIcons.get(c.role) : ''}</div>
          <div class="card-front-title">${isMine ? ROLE_DEFS[c.role].name : 'DIAMBIL'}</div>
        </div>
      `;

      if (!hasPicked && !isTaken) {
        cardEl.onclick = () => {
          pickCardAtomically(c.id);
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

      const def = ROLE_DEFS[me.role];
      document.getElementById('revealRoleIcon').innerHTML = window.WerewolfIcons.get(me.role);
      const titleWrap = document.getElementById('revealRoleTitle');
      titleWrap.textContent = def.name;
      titleWrap.style.color = def.color;
      document.getElementById('revealRoleDesc').textContent = def.desc;

      const btnConfirm = document.getElementById('btnConfirmCardPick');
      btnConfirm.textContent = me.ready ? 'Menunggu Pemain Lain...' : 'Saya Siap';
      btnConfirm.disabled = Boolean(me.ready);

      btnConfirm.onclick = async () => {
        window.WerewolfAudio.play('click');
        me.ready = true;
        await syncPlayerReadyState();
      };
    } else {
      btnRandom.classList.remove('hidden');
      roleRevealPanel.classList.add('hidden');
      actionBtns.classList.add('hidden');

      btnRandom.onclick = () => {
        const available = state.cards.filter(c => c.picked_by === null);
        if (available.length === 0) return;
        const randomCard = available[Math.floor(Math.random() * available.length)];
        pickCardAtomically(randomCard.id);
      };
    }
  }

  async function pickCardAtomically(cardId) {
    if (!currentRoomData) return;
    const state = currentRoomData.game_state;
    const card = state.cards.find(c => c.id === cardId);

    // Mencegah race condition jika kartu baru saja diambil orang lain
    if (!card || card.picked_by !== null) {
      alert('Kartu tersebut baru saja diambil oleh pemain lain. Silakan pilih kartu lain!');
      return;
    }

    card.picked_by = myPlayerId;
    const me = state.players.find(p => p.id === myPlayerId);
    if (me) {
      me.card_id = cardId;
      me.role = card.role;
    }

    window.WerewolfAudio.play('flip');

    await supabaseClient
      .from('werewolf_rooms')
      .update({
        game_state: state,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', currentRoomCode);
  }

  async function syncPlayerReadyState() {
    if (!currentRoomData) return;
    const state = currentRoomData.game_state;
    const me = state.players.find(p => p.id === myPlayerId);
    if (me) me.ready = true;

    // Cek apakah semua pemain sudah ready
    const allReady = state.players.every(p => p.ready);
    if (allReady) {
      state.phase = 'night';
      state.night_step = 'bodyguard';
      state.players.forEach(p => p.ready = false);

      await supabaseClient
        .from('werewolf_rooms')
        .update({
          status: 'night',
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
    } else {
      await supabaseClient
        .from('werewolf_rooms')
        .update({
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
    }
  }

  // ==========================================
  // 6. SIKLUS MALAM REALTIME
  // ==========================================
  function renderOnlineNight(state) {
    window.WerewolfApp.switchScreen('screenNightAction');
    window.WerewolfApp.setHudStatus('MALAM HARI');

    const me = state.players.find(p => p.id === myPlayerId);
    const currentStep = state.night_step; // 'bodyguard' | 'werewolf' | 'seer' | 'resolving'

    const waitingBox = document.getElementById('nightWaitingBox');
    const actionBox = document.getElementById('nightActiveActionBox');

    const isMyTurn = (me && me.alive && me.role === currentStep);

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

      iconWrap.innerHTML = window.WerewolfIcons.get(currentStep);
      titleWrap.textContent = ROLE_DEFS[currentStep].name;
      titleWrap.style.color = ROLE_DEFS[currentStep].color;
      seerResultBox.classList.add('hidden');
      teammateWrap.classList.add('hidden');
      targetList.innerHTML = '';
      mySelectedNightTargetId = null;

      if (currentStep === 'bodyguard') {
        promptWrap.textContent = 'Pilih 1 pemain hidup untuk dilindungi malam ini (tidak boleh sama berturut-turut):';
        window.WerewolfAudio.play('shield');

        state.players.forEach(p => {
          if (!p.alive) return;
          const isDisallowed = (p.id === me.last_protected);
          const card = createOnlineTargetCard(p, isDisallowed ? 'Terlindungi Semalam' : 'Lindungi', isDisallowed);

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
        promptWrap.textContent = 'Pilih 1 target mangsa warga untuk dihabisi malam ini:';
        window.WerewolfAudio.play('howl');

        const fellowWolves = state.players.filter(p => p.role === 'werewolf');
        if (fellowWolves.length > 1) {
          teammateWrap.classList.remove('hidden');
          teammateWrap.innerHTML = `<strong>Kawan Serigala:</strong> ${fellowWolves.map(p => p.name).join(', ')}`;
        }

        state.players.forEach(p => {
          if (!p.alive) return;
          const isWolf = (p.role === 'werewolf');
          const card = createOnlineTargetCard(p, isWolf ? 'Sesama Wolf' : 'Mangsa', isWolf);

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
        promptWrap.textContent = 'Pilih 1 pemain hidup untuk diterawang identitasnya:';
        window.WerewolfAudio.play('seer');

        state.players.forEach(p => {
          if (!p.alive || p.id === myPlayerId) return;
          const card = createOnlineTargetCard(p, 'Terawang');
          card.onclick = () => {
            targetList.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            mySelectedNightTargetId = p.id;
            window.WerewolfAudio.play('click');

            const isWolf = (p.role === 'werewolf');
            seerResultBox.classList.remove('hidden');
            seerResultBox.innerHTML = `
              Hasil Penerawangan untuk <strong>${p.name}</strong>:<br>
              <span style="font-size:16px; font-weight:900; color:${isWolf ? 'var(--role-wolf)' : 'var(--role-villager)'};">
                ${isWolf ? 'WEREWOLF !' : 'BUKAN WEREWOLF (Warga)'}
              </span>
            `;
          };
          targetList.appendChild(card);
        });
      }

      btnConfirm.onclick = async () => {
        if (!mySelectedNightTargetId) {
          alert('Kamu harus memilih tepat 1 sasaran!');
          return;
        }
        await submitNightAction(currentStep, mySelectedNightTargetId);
      };
    } else {
      // Layar tunggu
      waitingBox.classList.remove('hidden');
      actionBox.classList.add('hidden');

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
    const state = currentRoomData.game_state;

    if (role === 'bodyguard') {
      state.night_actions.protected_id = targetId;
      const me = state.players.find(p => p.id === myPlayerId);
      if (me) me.last_protected = targetId;
    } else if (role === 'werewolf') {
      state.night_actions.wolf_target_id = targetId;
    } else if (role === 'seer') {
      state.night_actions.seer_target_id = targetId;
    }

    await advanceNightStep();
  }

  async function advanceNightStep() {
    if (!currentRoomData) return;
    const state = currentRoomData.game_state;
    const steps = ['bodyguard', 'werewolf', 'seer'];
    const currentIdx = steps.indexOf(state.night_step);

    if (currentIdx < steps.length - 1) {
      state.night_step = steps[currentIdx + 1];
      await supabaseClient
        .from('werewolf_rooms')
        .update({
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
    } else {
      // Resolusi malam
      resolveNightOnline(state);
    }
  }

  async function resolveNightOnline(state) {
    const wolfTarget = state.players.find(p => p.id === state.night_actions.wolf_target_id);
    let victim = null;

    if (wolfTarget && wolfTarget.alive) {
      if (state.night_actions.protected_id === wolfTarget.id) {
        victim = null; // Selamat
      } else {
        wolfTarget.alive = false;
        victim = wolfTarget;
      }
    }

    state.last_night_victim = victim ? { id: victim.id, name: victim.name, role: victim.role } : null;
    state.phase = 'day_announcement';
    state.night_step = 'bodyguard';
    state.night_actions = { protected_id: null, wolf_target_id: null, seer_target_id: null, hunter_shot_id: null };

    // Cek kemenangan
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

    await supabaseClient
      .from('werewolf_rooms')
      .update({
        status: 'day_announcement',
        game_state: state,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', currentRoomCode);
  }

  // ==========================================
  // 7. SIKLUS SIANG & VOTING ONLINE
  // ==========================================
  function renderOnlineDayAnnouncement(state) {
    window.WerewolfApp.switchScreen('screenDayAnnouncement');
    window.WerewolfApp.setHudStatus('FASE SIANG');
    window.WerewolfAudio.play('bell');

    const newsText = document.getElementById('dayNewsText');
    const hunterPanel = document.getElementById('dayHunterRevengePanel');
    const btnVote = document.getElementById('btnProceedToVoting');
    hunterPanel.classList.add('hidden');

    const victim = state.last_night_victim;
    if (victim) {
      newsText.innerHTML = `
        Kabar duka! <strong style="color:var(--blood-red);">${victim.name}</strong> ditemukan tewas semalam diserang Werewolf.<br>
        Perannya adalah <strong style="color:${ROLE_DEFS[victim.role].color};">[${ROLE_DEFS[victim.role].name}]</strong>.
      `;

      if (victim.role === 'hunter') {
        const isDeadHunterMe = (victim.id === myPlayerId);
        if (isDeadHunterMe) {
          setupOnlineHunterShoot(state);
          return;
        } else {
          newsText.innerHTML += `<br><em>Menunggu tembakan pembalasan Hunter (${victim.name})...</em>`;
        }
      }
    } else {
      newsText.innerHTML = `
        <strong style="color:var(--role-hunter);">Malam yang damai!</strong> Tidak ada korban jiwa semalam berkat penjaga desa.
      `;
    }

    if (isHost) {
      btnVote.classList.remove('hidden');
      btnVote.textContent = 'Mulai Sesi Voting';
      btnVote.onclick = async () => {
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
    } else {
      btnVote.classList.add('hidden');
    }
  }

  function setupOnlineHunterShoot(state) {
    const hunterPanel = document.getElementById('dayHunterRevengePanel');
    hunterPanel.classList.remove('hidden');
    document.getElementById('hunterRevengeName').textContent = myPlayerName;

    const list = document.getElementById('hunterTargetList');
    list.innerHTML = '';
    mySelectedHunterShotId = null;

    state.players.forEach(p => {
      if (!p.alive || p.id === myPlayerId) return;
      const card = createOnlineTargetCard(p, 'Tembak Mati');
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
        alert('Pilih 1 pemain sasaran tembak!');
        return;
      }

      const shotVictim = state.players.find(p => p.id === mySelectedHunterShotId);
      if (shotVictim) shotVictim.alive = false;

      window.WerewolfAudio.play('gunshot');
      hunterPanel.classList.add('hidden');

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
    window.WerewolfApp.switchScreen('screenDayVoting');
    window.WerewolfApp.setHudStatus('VOTING EKSEKUSI');

    const me = state.players.find(p => p.id === myPlayerId);
    const hasVoted = Boolean(me && me.vote !== null);

    const list = document.getElementById('votingTargetList');
    list.innerHTML = '';
    mySelectedVoteTargetId = null;

    state.players.forEach(p => {
      if (!p.alive) return;
      const card = createOnlineTargetCard(p, 'Pilih untuk Digantung');
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
      btnConfirm.textContent = 'Kamu Telah Gugur (Hanya Menonton)';
      btnConfirm.disabled = true;
    } else if (hasVoted) {
      btnConfirm.textContent = 'Suaramu Telah Dikirim (Menunggu Pemain Lain)';
      btnConfirm.disabled = true;
    } else {
      btnConfirm.textContent = 'Kirim Suara Voting';
      btnConfirm.disabled = false;
      btnConfirm.onclick = async () => {
        if (!mySelectedVoteTargetId) {
          alert('Pilih 1 warga tersangka untuk digantung!');
          return;
        }
        me.vote = mySelectedVoteTargetId;
        window.WerewolfAudio.play('click');
        await submitVoteOnline(state);
      };
    }
  }

  async function submitVoteOnline(state) {
    // Cek apakah seluruh pemain hidup sudah vote
    const alivePlayers = state.players.filter(p => p.alive);
    const allVoted = alivePlayers.every(p => p.vote !== null);

    if (allVoted) {
      // Rekap suara
      const voteCounts = {};
      alivePlayers.forEach(p => {
        voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
      });

      let highestTargetId = null;
      let maxVotes = 0;
      Object.keys(voteCounts).forEach(targetId => {
        if (voteCounts[targetId] > maxVotes) {
          maxVotes = voteCounts[targetId];
          highestTargetId = targetId;
        }
      });

      const executed = state.players.find(p => p.id === highestTargetId);
      if (executed) {
        executed.alive = false;
        window.WerewolfAudio.play('gavel');
      }

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

      // Lanjut ke malam berikutnya
      state.phase = 'night';
      state.night_step = 'bodyguard';
      state.players.forEach(p => p.vote = null);

      await supabaseClient
        .from('werewolf_rooms')
        .update({
          status: 'night',
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
    } else {
      await supabaseClient
        .from('werewolf_rooms')
        .update({
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('room_code', currentRoomCode);
    }
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
  function renderOnlineGameOver(state) {
    window.WerewolfApp.switchScreen('screenGameOver');
    window.WerewolfAudio.play('victory');

    const titleEl = document.getElementById('gameOverTitle');
    const descEl = document.getElementById('gameOverDesc');
    const rosterEl = document.getElementById('gameOverRoster');

    if (state.winner === 'villager') {
      titleEl.textContent = 'WARGA DESA MENANG!';
      titleEl.style.color = 'var(--role-villager)';
      descEl.textContent = 'Seluruh kawanan Werewolf telah berhasil dimusnahkan. Fajar damai kembali menyinari desa!';
    } else {
      titleEl.textContent = 'WEREWOLF MENANG!';
      titleEl.style.color = 'var(--role-wolf)';
      descEl.textContent = 'Kawanan Werewolf berhasil menguasai desa sepenuhnya!';
    }

    rosterEl.innerHTML = '';
    state.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'roster-item';
      const def = ROLE_DEFS[p.role] || { name: '?', color: '#fff' };
      row.innerHTML = `
        <div class="roster-name-wrap">
          <span class="roster-name">${p.name} ${p.id === myPlayerId ? '(Kamu)' : ''}</span>
          <span style="font-size:11px; color:${p.alive ? 'var(--role-hunter)' : 'var(--text-muted)'}; font-weight:700;">
            (${p.alive ? 'Selamat' : 'Gugur'})
          </span>
        </div>
        <span class="roster-status-badge" style="color:${def.color}; border:1px solid ${def.color}; background:rgba(0,0,0,0.5);">
          ${def.name}
        </span>
      `;
      rosterEl.appendChild(row);
    });

    // Auto-delete room di Supabase setelah 10 detik atau saat keluar
    if (isHost && currentRoomCode) {
      setTimeout(() => {
        deleteCurrentRoom();
      }, 10000);
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
