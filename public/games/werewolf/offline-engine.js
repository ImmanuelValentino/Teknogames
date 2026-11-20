// ====================================================================
// OFFLINE-ENGINE.JS - Pass-and-Play (1 HP) Engine untuk Werewolf
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

  // State
  let players = [];
  let roleConfig = { werewolf: 1, villager: 2, seer: 1, bodyguard: 1, hunter: 0 };
  let currentCardPickIndex = 0;
  let offlineCards = [];
  let currentPickedCardId = null;

  // Night State
  let nightQueue = [];
  let currentNightActionIdx = 0;
  let nightDecisions = { protectedId: null, wolfTargetId: null, seerTargetId: null };
  let previousProtectedId = null;
  let selectedNightChoiceId = null;

  // Day & Timer State
  let discussionTimer = null;
  let discussionSeconds = 120;
  let timerRunning = false;
  let hunterPendingVictim = null;
  let selectedVoteTargetId = null;
  let selectedHunterShotId = null;

  function initOfflineGame() {
    loadSavedPlayers();
    renderPlayerInputs();
    updateAutoBalanceRoles();
  }

  function loadSavedPlayers() {
    try {
      const saved = localStorage.getItem('teknogames_werewolf_offline_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          players = parsed.map((p, idx) => ({
            id: idx + 1,
            name: typeof p === 'string' ? p : p.name,
            alive: true,
            role: null
          }));
          return;
        }
      }
    } catch (e) {}

    // Default 5 pemain awal
    players = [
      { id: 1, name: 'Pemain 1', alive: true, role: null },
      { id: 2, name: 'Pemain 2', alive: true, role: null },
      { id: 3, name: 'Pemain 3', alive: true, role: null },
      { id: 4, name: 'Pemain 4', alive: true, role: null },
      { id: 5, name: 'Pemain 5', alive: true, role: null }
    ];
  }

  function savePlayers() {
    try {
      const names = players.map(p => p.name.trim() || `Pemain ${p.id}`);
      localStorage.setItem('teknogames_werewolf_offline_players', JSON.stringify(names));
    } catch (e) {}
  }

  function renderPlayerInputs() {
    const container = document.getElementById('offlinePlayerList');
    if (!container) return;
    container.innerHTML = '';

    players.forEach((p, idx) => {
      const row = document.createElement('div');
      row.className = 'roster-item';
      row.innerHTML = `
        <span style="font-size:12px; font-weight:800; color:var(--text-muted); width:20px;">#${idx + 1}</span>
        <input type="text" class="input-text-dark" style="margin:0 8px; flex:1; padding:8px 10px;" value="${p.name}" data-idx="${idx}" maxlength="15" placeholder="Nama Pemain">
        <button class="btn-icon-hud btn-del-player" data-idx="${idx}" style="width:30px; height:30px; color:#ef4444;" title="Hapus">
          ${window.WerewolfIcons.get('cross')}
        </button>
      `;

      const input = row.querySelector('input');
      input.addEventListener('input', (e) => {
        players[idx].name = e.target.value.trim() || `Pemain ${idx + 1}`;
        savePlayers();
      });

      const delBtn = row.querySelector('.btn-del-player');
      delBtn.addEventListener('click', () => {
        if (players.length <= 5) {
          alert('Minimal 5 pemain untuk bermain Werewolf!');
          return;
        }
        players.splice(idx, 1);
        players.forEach((pl, i) => pl.id = i + 1);
        savePlayers();
        renderPlayerInputs();
        updateAutoBalanceRoles();
      });

      container.appendChild(row);
    });

    const countLabel = document.getElementById('offlinePlayerCountLabel');
    if (countLabel) countLabel.textContent = `${players.length} Pemain`;
  }

  function addPlayer() {
    if (players.length >= 15) {
      alert('Maksimal 15 pemain dalam satu permainan!');
      return;
    }
    const newId = players.length + 1;
    players.push({ id: newId, name: `Pemain ${newId}`, alive: true, role: null });
    savePlayers();
    renderPlayerInputs();
    updateAutoBalanceRoles();
  }

  function updateAutoBalanceRoles() {
    const total = players.length;
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

    roleConfig = {
      werewolf: wolfCount,
      villager: villagerCount,
      seer: seerCount,
      bodyguard: guardCount,
      hunter: hunterCount
    };

    updateRoleConfigUI();
  }

  function updateRoleConfigUI() {
    ['werewolf', 'villager', 'seer', 'bodyguard', 'hunter'].forEach(role => {
      const el = document.getElementById(`offlineRoleCount_${role}`);
      if (el) el.textContent = roleConfig[role] || 0;
    });

    const sum = Object.values(roleConfig).reduce((a, b) => a + b, 0);
    const sumEl = document.getElementById('offlineRoleTotalSum');
    if (sumEl) {
      sumEl.textContent = `${sum} / ${players.length}`;
      sumEl.style.color = (sum === players.length) ? 'var(--role-hunter)' : 'var(--blood-red)';
    }
  }

  function adjustRole(role, delta) {
    const current = roleConfig[role] || 0;
    const nextVal = current + delta;
    if (nextVal < 0) return;
    if (role === 'werewolf' && nextVal < 1) return;

    roleConfig[role] = nextVal;
    updateRoleConfigUI();
  }

  // ==========================================
  // DISTRIBUSI KARTU & PEMILIHAN KARTU OFFLINE
  // ==========================================
  function startCardPickPhase() {
    const sum = Object.values(roleConfig).reduce((a, b) => a + b, 0);
    if (sum !== players.length) {
      alert(`Jumlah total peran (${sum}) harus sama dengan total pemain (${players.length})!`);
      return;
    }

    // Bangun daftar kartu role
    const cardPool = [];
    Object.keys(roleConfig).forEach(role => {
      for (let i = 0; i < roleConfig[role]; i++) {
        cardPool.push(role);
      }
    });

    // Acak kartu (Fisher-Yates)
    for (let i = cardPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPool[i], cardPool[j]] = [cardPool[j], cardPool[i]];
    }

    offlineCards = cardPool.map((role, idx) => ({
      id: idx,
      role: role,
      takenBy: null
    }));

    currentCardPickIndex = 0;
    showPrivacyScreenForCardPick();
  }

  function showPrivacyScreenForCardPick() {
    const currentPlayer = players[currentCardPickIndex];
    window.WerewolfApp.showPrivacyScreen(
      `Giliran: ${currentPlayer.name}`,
      'Pegang HP dan pastikan pemain lain tidak mengintip layar!',
      'Saya Siap, Buka Kartu',
      () => {
        renderCardPickScreenForCurrentPlayer();
      }
    );
  }

  function renderCardPickScreenForCurrentPlayer() {
    const currentPlayer = players[currentCardPickIndex];
    window.WerewolfApp.switchScreen('screenCardPick');
    currentPickedCardId = null;

    document.getElementById('cardPickHeaderTitle').textContent = `Pilih Kartu: ${currentPlayer.name}`;
    document.getElementById('cardPickHeaderDesc').textContent = 'Pilih tepat 1 kartu tertutup di bawah ini atau tekan tombol Pilih Acak.';
    
    const roleRevealPanel = document.getElementById('cardPickRoleReveal');
    const actionBtns = document.getElementById('cardPickActionBtns');
    roleRevealPanel.classList.add('hidden');
    actionBtns.classList.add('hidden');

    const grid = document.getElementById('cardPickGrid');
    grid.innerHTML = '';

    offlineCards.forEach((c, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card-pick-item';
      if (c.takenBy !== null) {
        cardEl.classList.add('taken');
      }

      cardEl.innerHTML = `
        <div class="card-face card-back">
          <div class="card-back-pattern">${window.WerewolfIcons.get('moon')}</div>
          <div class="card-back-number">KARTU ${idx + 1}</div>
        </div>
        <div class="card-face card-front ${ROLE_DEFS[c.role].badgeClass}">
          <div class="card-front-icon">${window.WerewolfIcons.get(c.role)}</div>
          <div class="card-front-title">${ROLE_DEFS[c.role].name}</div>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        if (c.takenBy !== null || currentPickedCardId !== null) return;
        selectCardForCurrentPlayer(c.id, cardEl);
      });

      grid.appendChild(cardEl);
    });

    // Setup tombol Pilih Acak
    const btnRandom = document.getElementById('btnCardPickRandom');
    btnRandom.onclick = () => {
      if (currentPickedCardId !== null) return;
      const availableCards = offlineCards.filter(c => c.takenBy === null);
      if (availableCards.length === 0) return;
      const randomChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
      const cardItems = grid.querySelectorAll('.card-pick-item');
      selectCardForCurrentPlayer(randomChoice.id, cardItems[randomChoice.id]);
    };
  }

  function selectCardForCurrentPlayer(cardId, cardElement) {
    currentPickedCardId = cardId;
    const card = offlineCards.find(c => c.id === cardId);
    card.takenBy = players[currentCardPickIndex].id;
    players[currentCardPickIndex].role = card.role;

    window.WerewolfAudio.play('flip');
    if (cardElement) {
      cardElement.classList.add('flipped');
    }

    // Tampilkan detail peran & tombol konfirmasi tutup kartu
    const roleRevealPanel = document.getElementById('cardPickRoleReveal');
    const roleIconWrap = document.getElementById('revealRoleIcon');
    const roleTitleWrap = document.getElementById('revealRoleTitle');
    const roleDescWrap = document.getElementById('revealRoleDesc');
    const actionBtns = document.getElementById('cardPickActionBtns');

    const def = ROLE_DEFS[card.role];
    roleIconWrap.innerHTML = window.WerewolfIcons.get(card.role);
    roleTitleWrap.textContent = def.name;
    roleTitleWrap.style.color = def.color;
    roleDescWrap.textContent = def.desc;

    roleRevealPanel.classList.remove('hidden');
    actionBtns.classList.remove('hidden');

    const btnConfirm = document.getElementById('btnConfirmCardPick');
    btnConfirm.onclick = () => {
      window.WerewolfAudio.play('click');
      currentCardPickIndex++;
      if (currentCardPickIndex < players.length) {
        showPrivacyScreenForCardPick();
      } else {
        // Semua pemain sudah dapat kartu! Masuk ke Malam Pertama
        window.WerewolfApp.showPrivacyScreen(
          'Semua Kartu Telah Terbagi',
          'Malam pertama segera dimulai. Seluruh warga desa diminta menutup mata!',
          'Mulai Malam Pertama',
          () => {
            startNightCycle();
          }
        );
      }
    };
  }

  // ==========================================
  // SIKLUS MALAM OFFLINE
  // ==========================================
  function startNightCycle() {
    window.WerewolfAudio.play('howl');
    window.WerewolfApp.setHudStatus('MALAM TIBA');
    
    nightDecisions = { protectedId: null, wolfTargetId: null, seerTargetId: null };
    nightQueue = ['bodyguard', 'werewolf', 'seer'];
    currentNightActionIdx = 0;

    runNextNightStep();
  }

  function runNextNightStep() {
    if (currentNightActionIdx >= nightQueue.length) {
      resolveNight();
      return;
    }

    const currentRole = nightQueue[currentNightActionIdx];
    const rolePlayers = players.filter(p => p.role === currentRole && p.alive);

    if (rolePlayers.length === 0) {
      // Role sudah mati atau tidak ada di game ini -> Tampilkan dummy screen jeda singkat
      window.WerewolfApp.showPrivacyScreen(
        `Fase Malam: ${ROLE_DEFS[currentRole].name}`,
        'Malam hening... Angin berhembus melalui celah jendela rumah warga.',
        'Lanjut',
        () => {
          setTimeout(() => {
            currentNightActionIdx++;
            runNextNightStep();
          }, 600);
        }
      );
      return;
    }

    // Role hidup -> Tampilkan privacy screen untuk role tersebut
    const names = rolePlayers.map(p => p.name).join(', ');
    window.WerewolfApp.showPrivacyScreen(
      `Giliran: ${ROLE_DEFS[currentRole].name}`,
      `Pegang HP untuk ${names}. Pastikan pemain lain menutup mata rapat-rapat!`,
      'Buka Aksi Malam',
      () => {
        renderNightActionScreen(currentRole, rolePlayers);
      }
    );
  }

  function renderNightActionScreen(role, rolePlayers) {
    window.WerewolfApp.switchScreen('screenNightAction');
    selectedNightChoiceId = null;

    const iconWrap = document.getElementById('nightRoleIcon');
    const titleWrap = document.getElementById('nightRoleTitle');
    const promptWrap = document.getElementById('nightActionPrompt');
    const targetList = document.getElementById('nightTargetList');
    const teammateWrap = document.getElementById('nightTeammateInfo');
    const seerResultBox = document.getElementById('seerResultBox');
    const btnConfirm = document.getElementById('btnConfirmNightAction');

    iconWrap.innerHTML = window.WerewolfIcons.get(role);
    titleWrap.textContent = ROLE_DEFS[role].name;
    titleWrap.style.color = ROLE_DEFS[role].color;
    seerResultBox.classList.add('hidden');
    teammateWrap.classList.add('hidden');

    targetList.innerHTML = '';

    if (role === 'bodyguard') {
      promptWrap.textContent = 'Pilih 1 pemain hidup untuk dilindungi malam ini (tidak boleh orang yang sama berturut-turut):';
      window.WerewolfAudio.play('shield');

      players.forEach(p => {
        if (!p.alive) return;
        const isDisallowed = (p.id === previousProtectedId);
        const card = createTargetCard(p, isDisallowed ? 'Telah dilindungi semalam' : 'Lindungi', isDisallowed);

        if (!isDisallowed) {
          card.onclick = () => {
            targetList.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedNightChoiceId = p.id;
            window.WerewolfAudio.play('click');
          };
        }
        targetList.appendChild(card);
      });
    } 
    else if (role === 'werewolf') {
      promptWrap.textContent = 'Pilih 1 target mangsa warga untuk dihabisi malam ini:';
      window.WerewolfAudio.play('howl');

      // Tampilkan info sesama Werewolf jika lebih dari 1
      if (rolePlayers.length > 1) {
        teammateWrap.classList.remove('hidden');
        teammateWrap.innerHTML = `<strong>Kawan Serigalamu:</strong> ${rolePlayers.map(p => p.name).join(', ')}`;
      }

      players.forEach(p => {
        if (!p.alive) return;
        const isWolf = (p.role === 'werewolf');
        const card = createTargetCard(p, isWolf ? 'Sesama Werewolf' : 'Mangsa', isWolf);

        if (!isWolf) {
          card.onclick = () => {
            targetList.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedNightChoiceId = p.id;
            window.WerewolfAudio.play('click');
          };
        }
        targetList.appendChild(card);
      });
    } 
    else if (role === 'seer') {
      promptWrap.textContent = 'Pilih 1 pemain hidup untuk diterawang identitas aslinya (hanya 1 kali per malam):';
      window.WerewolfAudio.play('seer');

      players.forEach(p => {
        if (!p.alive || p.role === 'seer') return;
        const card = createTargetCard(p, 'Terawang');
        card.onclick = () => {
          if (selectedNightChoiceId !== null) return; // Batasi hanya tepat 1 kali klik!
          selectedNightChoiceId = p.id;

          // Nonaktifkan seluruh kartu target lain agar Seer tidak bisa mengintip pemain kedua
          targetList.querySelectorAll('.target-card').forEach(c => {
            c.classList.remove('selected');
            c.classList.add('disabled');
            c.onclick = null;
          });
          card.classList.add('selected');
          card.classList.remove('disabled');

          window.WerewolfAudio.play('click');

          // Tampilkan hasil terawang seketika
          const isWolf = (p.role === 'werewolf');
          seerResultBox.classList.remove('hidden');
          seerResultBox.innerHTML = `
            Hasil Penerawangan untuk <strong>${p.name}</strong>:<br>
            <span style="font-size:16px; font-weight:900; color:${isWolf ? 'var(--role-wolf)' : 'var(--role-villager)'};">
              ${isWolf ? 'WEREWOLF !' : 'BUKAN WEREWOLF (Warga Desa)'}
            </span>
            <div style="font-size:11px; color:var(--text-muted); margin-top:6px;">
              Penerawangan selesai untuk malam ini. Klik 'Kunci Aksi Malam Ini' di bawah.
            </div>
          `;
        };
        targetList.appendChild(card);
      });
    }

    btnConfirm.onclick = () => {
      if (selectedNightChoiceId === null) {
        alert('Kamu harus memilih tepat 1 sasaran!');
        return;
      }

      if (role === 'bodyguard') nightDecisions.protectedId = selectedNightChoiceId;
      if (role === 'werewolf') nightDecisions.wolfTargetId = selectedNightChoiceId;
      if (role === 'seer') nightDecisions.seerTargetId = selectedNightChoiceId;

      window.WerewolfAudio.play('click');
      currentNightActionIdx++;

      window.WerewolfApp.showPrivacyScreen(
        'Aksi Telah Disimpan',
        'Tutup mata kembali dan oper perangkat ke giliran berikutnya atau moderator.',
        'Lanjut',
        () => {
          runNextNightStep();
        }
      );
    };
  }

  function createTargetCard(player, tagText, isDisabled = false) {
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

  function resolveNight() {
    previousProtectedId = nightDecisions.protectedId;
    const target = players.find(p => p.id === nightDecisions.wolfTargetId);
    let victim = null;

    if (target && target.alive) {
      if (nightDecisions.protectedId === target.id) {
        victim = null; // Selamat berkat bodyguard!
      } else {
        target.alive = false;
        victim = target;
      }
    }

    startDayCycle(victim);
  }

  // ==========================================
  // SIKLUS SIANG OFFLINE
  // ==========================================
  function startDayCycle(nightVictim) {
    window.WerewolfAudio.play('bell');
    window.WerewolfApp.setHudStatus('FASE SIANG');
    window.WerewolfApp.switchScreen('screenDayAnnouncement');

    const newsText = document.getElementById('dayNewsText');
    const hunterPanel = document.getElementById('dayHunterRevengePanel');
    hunterPanel.classList.add('hidden');

    if (nightVictim) {
      newsText.innerHTML = `
        Kabar duka menyelimuti desa! <strong style="color:var(--blood-red);">${nightVictim.name}</strong> ditemukan tewas semalam diserang Werewolf.<br>
        Perannya adalah <strong style="color:${ROLE_DEFS[nightVictim.role].color};">[${ROLE_DEFS[nightVictim.role].name}]</strong>.
      `;

      if (nightVictim.role === 'hunter') {
        triggerHunterRevenge(nightVictim);
        return;
      }
    } else {
      newsText.innerHTML = `
        <strong style="color:var(--role-hunter);">Malam yang damai!</strong> Tidak ada korban jiwa semalam berkat kesigapan pelindung desa.
      `;
    }

    if (checkWinCondition()) return;

    setupDiscussionTimer();
  }

  function triggerHunterRevenge(hunter) {
    hunterPendingVictim = hunter;
    const panel = document.getElementById('dayHunterRevengePanel');
    panel.classList.remove('hidden');
    document.getElementById('hunterRevengeName').textContent = hunter.name;

    const targetList = document.getElementById('hunterTargetList');
    targetList.innerHTML = '';
    selectedHunterShotId = null;

    players.forEach(p => {
      if (!p.alive) return;
      const card = createTargetCard(p, 'Tembak');
      card.onclick = () => {
        targetList.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedHunterShotId = p.id;
        window.WerewolfAudio.play('click');
      };
      targetList.appendChild(card);
    });

    document.getElementById('btnHunterConfirmShoot').onclick = () => {
      if (selectedHunterShotId === null) {
        alert('Pemburu harus memilih tepat 1 sasaran tembak pembalasan!');
        return;
      }
      const target = players.find(p => p.id === selectedHunterShotId);
      target.alive = false;
      window.WerewolfAudio.play('gunshot');

      alert(`DOR! ${hunter.name} melepaskan tembakan terakhir ke ${target.name}! ${target.name} gugur dan perannya adalah [${ROLE_DEFS[target.role].name}].`);
      panel.classList.add('hidden');

      if (checkWinCondition()) return;
      setupDiscussionTimer();
    };
  }

  function setupDiscussionTimer() {
    const btnStartVote = document.getElementById('btnProceedToVoting');
    btnStartVote.classList.remove('hidden');
    btnStartVote.onclick = () => {
      startVotingPhase();
    };

    // Timer diskusi otomatis
    discussionSeconds = 120;
    updateTimerDigits();
    clearInterval(discussionTimer);
    timerRunning = true;

    discussionTimer = setInterval(() => {
      if (timerRunning) {
        discussionSeconds--;
        updateTimerDigits();
        if (discussionSeconds <= 0) {
          clearInterval(discussionTimer);
          window.WerewolfAudio.play('gavel');
          startVotingPhase();
        }
      }
    }, 1000);

    const btnSkip = document.getElementById('btnSkipDiscussion');
    if (btnSkip) {
      btnSkip.onclick = () => {
        clearInterval(discussionTimer);
        window.WerewolfAudio.play('gavel');
        startVotingPhase();
      };
    }
  }

  function updateTimerDigits() {
    const m = Math.floor(discussionSeconds / 60).toString().padStart(2, '0');
    const s = (discussionSeconds % 60).toString().padStart(2, '0');
    const el = document.getElementById('discussionTimerDigits');
    if (el) el.textContent = `${m}:${s}`;
  }

  function startVotingPhase() {
    clearInterval(discussionTimer);
    window.WerewolfApp.switchScreen('screenDayVoting');
    selectedVoteTargetId = null;

    const list = document.getElementById('votingTargetList');
    list.innerHTML = '';

    players.forEach(p => {
      if (!p.alive) return;
      const card = createTargetCard(p, 'Pilih untuk Digantung');
      card.onclick = () => {
        list.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedVoteTargetId = p.id;
        window.WerewolfAudio.play('click');
      };
      list.appendChild(card);
    });

    document.getElementById('btnConfirmExecution').onclick = () => {
      if (selectedVoteTargetId === null) {
        alert('Pilih 1 warga untuk dieksekusi gantung!');
        return;
      }

      const executed = players.find(p => p.id === selectedVoteTargetId);
      executed.alive = false;
      window.WerewolfAudio.play('gavel');

      alert(`Hasil voting desa memutuskan: ${executed.name} dieksekusi gantung! Perannya adalah [${ROLE_DEFS[executed.role].name}].`);

      if (executed.role === 'hunter') {
        triggerHunterRevenge(executed);
        return;
      }

      if (checkWinCondition()) return;

      // Kembali ke siklus malam
      window.WerewolfApp.showPrivacyScreen(
        'Sidang Desa Telah Selesai',
        'Matahari telah terbenam. Malam kembali tiba menyelimuti desa...',
        'Masuk ke Malam Berikutnya',
        () => {
          startNightCycle();
        }
      );
    };
  }

  // ==========================================
  // CEK KONDISI KEMENANGAN
  // ==========================================
  function checkWinCondition() {
    const wolvesAlive = players.filter(p => p.role === 'werewolf' && p.alive).length;
    const nonWolvesAlive = players.filter(p => p.role !== 'werewolf' && p.alive).length;

    if (wolvesAlive === 0) {
      triggerGameOver('villager');
      return true;
    } else if (wolvesAlive >= nonWolvesAlive) {
      triggerGameOver('werewolf');
      return true;
    }
    return false;
  }

  function triggerGameOver(winner) {
    clearInterval(discussionTimer);
    window.WerewolfAudio.play('victory');
    window.WerewolfApp.switchScreen('screenGameOver');

    const titleEl = document.getElementById('gameOverTitle');
    const descEl = document.getElementById('gameOverDesc');
    const rosterEl = document.getElementById('gameOverRoster');

    if (winner === 'villager') {
      titleEl.textContent = 'WARGA DESA MENANG!';
      titleEl.style.color = 'var(--role-villager)';
      descEl.textContent = 'Seluruh kawanan Werewolf telah berhasil dieliminasi. Kedamaian kembali ke desa!';
    } else {
      titleEl.textContent = 'WEREWOLF MENANG!';
      titleEl.style.color = 'var(--role-wolf)';
      descEl.textContent = 'Kawanan Werewolf berhasil menguasai desa dan menaklukkan para warga!';
    }

    rosterEl.innerHTML = '';
    players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'roster-item';
      const def = ROLE_DEFS[p.role] || { name: '?', color: '#fff' };
      row.innerHTML = `
        <div class="roster-name-wrap">
          <span class="roster-name">${p.name}</span>
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
  }

  window.WerewolfOfflineEngine = {
    init: initOfflineGame,
    addPlayer,
    adjustRole,
    startCardPickPhase
  };
})();
