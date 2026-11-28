// ====================================================================
// APP.JS - Koordinator Utama & UI Controller untuk Werewolf Game
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  let currentScreenId = 'screenMainMenu';

  function t(key, vars) {
    return window.WerewolfI18n ? window.WerewolfI18n.t(key, vars) : key;
  }

  let currentHudKey = null;
  let currentHudVars = null;
  let currentHudRole = null;
  let isRoleHidden = false;

  const HUD_ROLE_META = {
    werewolf: { nameKey: 'role_werewolf_name', descKey: 'role_werewolf_desc', color: 'var(--role-wolf)' },
    villager: { nameKey: 'role_villager_name', descKey: 'role_villager_desc', color: 'var(--role-villager)' },
    seer: { nameKey: 'role_seer_name', descKey: 'role_seer_desc', color: 'var(--role-seer)' },
    bodyguard: { nameKey: 'role_bodyguard_name', descKey: 'role_bodyguard_desc', color: 'var(--role-bodyguard)' },
    hunter: { nameKey: 'role_hunter_name', descKey: 'role_hunter_desc', color: 'var(--role-hunter)' }
  };

  function closeRoleModal() {
    const modal = document.getElementById('roleInfoModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }

  function openRoleModal() {
    if (!currentHudRole || !HUD_ROLE_META[currentHudRole]) return;
    const modal = document.getElementById('roleInfoModal');
    const iconEl = document.getElementById('roleModalIcon');
    const titleEl = document.getElementById('roleModalTitle');
    const descEl = document.getElementById('roleModalDesc');
    const toggleBtn = document.getElementById('btnModalToggleRolePrivacy');
    if (!modal) return;

    const meta = HUD_ROLE_META[currentHudRole];
    if (isRoleHidden) {
      if (iconEl && window.WerewolfIcons) {
        iconEl.innerHTML = window.WerewolfIcons.get('eyeOff');
      }
      if (titleEl) {
        titleEl.textContent = t('role_hidden_modal_title');
        titleEl.style.color = 'var(--text-muted)';
      }
      if (descEl) {
        descEl.textContent = t('role_hidden_modal_desc');
      }
      if (toggleBtn) {
        toggleBtn.textContent = t('role_show_btn');
      }
    } else {
      if (iconEl && window.WerewolfIcons) {
        iconEl.innerHTML = window.WerewolfIcons.get(currentHudRole);
      }
      if (titleEl) {
        titleEl.textContent = t(meta.nameKey);
        titleEl.style.color = meta.color;
      }
      if (descEl) {
        descEl.textContent = t(meta.descKey);
      }
      if (toggleBtn) {
        toggleBtn.textContent = t('role_hide_btn');
      }
    }
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function renderHudRoleUI() {
    const badge = document.getElementById('hudMyRoleBadge');
    const iconEl = document.getElementById('hudMyRoleIcon');
    const valEl = document.getElementById('hudMyRoleValue');
    const toggleBtn = document.getElementById('btnToggleRolePrivacy');
    if (!badge || !valEl) return;

    if (!currentHudRole) {
      badge.classList.add('hidden');
      badge.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.classList.add('hidden');
        toggleBtn.style.display = 'none';
      }
      closeRoleModal();
      return;
    }

    const meta = HUD_ROLE_META[currentHudRole];
    if (isRoleHidden) {
      if (iconEl && window.WerewolfIcons) {
        iconEl.innerHTML = window.WerewolfIcons.get('eyeOff');
      }
      valEl.textContent = t('hud_role_hidden');
      valEl.style.color = 'var(--text-muted)';
      if (toggleBtn && window.WerewolfIcons) {
        toggleBtn.innerHTML = window.WerewolfIcons.get('eye');
        toggleBtn.setAttribute('title', t('role_show_hint'));
      }
    } else {
      if (iconEl && window.WerewolfIcons) {
        iconEl.innerHTML = window.WerewolfIcons.get(currentHudRole);
      }
      valEl.textContent = t(meta.nameKey);
      valEl.style.color = meta.color;
      if (toggleBtn && window.WerewolfIcons) {
        toggleBtn.innerHTML = window.WerewolfIcons.get('eyeOff');
        toggleBtn.setAttribute('title', t('role_hide_hint'));
      }
    }

    badge.classList.remove('hidden');
    badge.style.display = 'inline-flex';
    if (toggleBtn) {
      toggleBtn.classList.remove('hidden');
      toggleBtn.style.display = 'inline-flex';
    }
  }

  function toggleRolePrivacy() {
    if (!currentHudRole) return;
    isRoleHidden = !isRoleHidden;
    renderHudRoleUI();
    const modal = document.getElementById('roleInfoModal');
    if (modal && !modal.classList.contains('hidden')) {
      openRoleModal();
    }
  }

  function setHudRole(role) {
    const nextRole = role && HUD_ROLE_META[role] ? role : null;
    if (!nextRole) {
      isRoleHidden = false;
    }
    currentHudRole = nextRole;
    renderHudRoleUI();
  }

  function switchScreen(targetScreenId) {
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.add('hidden');
    });
    const target = document.getElementById(targetScreenId);
    if (target) {
      target.classList.remove('hidden');
      currentScreenId = targetScreenId;
    }
    if (targetScreenId === 'screenMainMenu') {
      setHudStatusKey('hud_main_menu');
      setHudRole(null);
    }
  }

  function setHudStatus(text) {
    currentHudKey = null;
    currentHudVars = null;
    const el = document.getElementById('hudStatusText');
    if (el) el.textContent = text;
  }

  function setHudStatusKey(key, vars) {
    currentHudKey = key;
    currentHudVars = vars || null;
    const el = document.getElementById('hudStatusText');
    if (el) el.textContent = t(key, vars);
  }

  // Layar Privasi Aman (Privacy Screen)
  function showPrivacyScreen(title, desc, btnText, onConfirmCallback) {
    switchScreen('screenPrivacy');
    document.getElementById('privacyScreenTitle').textContent = title;
    document.getElementById('privacyScreenDesc').textContent = desc;

    const btn = document.getElementById('btnPrivacyConfirm');
    btn.textContent = btnText || t('privacy_open_btn');
    btn.onclick = () => {
      window.WerewolfAudio.play('click');
      if (typeof onConfirmCallback === 'function') {
        onConfirmCallback();
      }
    };
  }

  function initApp() {
    // Inisialisasi Audio UI
    window.WerewolfAudio.updateUI();
    const btnAudio = document.getElementById('btnAudioToggle');
    if (btnAudio) {
      btnAudio.onclick = () => {
        window.WerewolfAudio.toggleMute();
      };
    }

    const hudRoleBtn = document.getElementById('hudMyRoleBadge');
    if (hudRoleBtn) {
      hudRoleBtn.onclick = () => {
        window.WerewolfAudio.play('click');
        openRoleModal();
      };
    }
    const btnToggleRolePrivacy = document.getElementById('btnToggleRolePrivacy');
    if (btnToggleRolePrivacy) {
      btnToggleRolePrivacy.onclick = () => {
        window.WerewolfAudio.play('click');
        toggleRolePrivacy();
      };
    }
    const btnModalToggleRolePrivacy = document.getElementById('btnModalToggleRolePrivacy');
    if (btnModalToggleRolePrivacy) {
      btnModalToggleRolePrivacy.onclick = () => {
        window.WerewolfAudio.play('click');
        toggleRolePrivacy();
      };
    }
    const btnCloseRole = document.getElementById('btnCloseRoleModal');
    if (btnCloseRole) {
      btnCloseRole.onclick = () => {
        window.WerewolfAudio.play('click');
        closeRoleModal();
      };
    }
    const roleModal = document.getElementById('roleInfoModal');
    if (roleModal) {
      roleModal.onclick = (e) => {
        if (e.target === roleModal) closeRoleModal();
      };
    }

    // Menu Utama Handlers
    const btnChooseOnline = document.getElementById('btnChooseOnlineMode');
    if (btnChooseOnline) {
      btnChooseOnline.onclick = () => {
        window.WerewolfAudio.play('click');
        switchScreen('screenOnlineAuth');
      };
    }

    const btnChooseOffline = document.getElementById('btnChooseOfflineMode');
    if (btnChooseOffline) {
      btnChooseOffline.onclick = () => {
        window.WerewolfAudio.play('click');
        window.WerewolfOfflineEngine.init();
        switchScreen('screenOfflineSetup');
        setHudStatusKey('hud_offline_setup');
      };
    }

    // Online Auth Screen Handlers
    const btnBackFromOnlineAuth = document.getElementById('btnBackFromOnlineAuth');
    if (btnBackFromOnlineAuth) {
      btnBackFromOnlineAuth.onclick = () => {
        window.WerewolfAudio.play('click');
        switchScreen('screenMainMenu');
      };
    }

    const btnCreateRoomSubmit = document.getElementById('btnCreateRoomSubmit');
    if (btnCreateRoomSubmit) {
      btnCreateRoomSubmit.onclick = () => {
        window.WerewolfAudio.play('click');
        const hostName = document.getElementById('inputHostName').value;
        window.WerewolfOnlineEngine.createRoom(hostName);
      };
    }

    const btnJoinRoomSubmit = document.getElementById('btnJoinRoomSubmit');
    if (btnJoinRoomSubmit) {
      btnJoinRoomSubmit.onclick = () => {
        window.WerewolfAudio.play('click');
        const pName = document.getElementById('inputJoinPlayerName').value;
        const code = document.getElementById('inputJoinRoomCode').value;
        window.WerewolfOnlineEngine.joinRoom(pName, code);
      };
    }

    // Tombol Salin Kode Room
    const btnCopyRoomCode = document.getElementById('btnCopyRoomCode');
    if (btnCopyRoomCode) {
      btnCopyRoomCode.onclick = () => {
        const code = document.getElementById('onlineRoomCodeDisplay').textContent;
        navigator.clipboard.writeText(code).then(() => {
          window.WerewolfAudio.play('click');
          btnCopyRoomCode.innerHTML = `${window.WerewolfIcons.get('check')} ${t('copied_code')}`;
          setTimeout(() => {
            btnCopyRoomCode.innerHTML = `${window.WerewolfIcons.get('copy')} ${t('copy_code')}`;
          }, 2000);
        }).catch(() => {
          alert(t('room_code_alert', { code }));
        });
      };
    }

    // Tombol Keluar Room Online (Lobby & HUD)
    const leaveModal = document.getElementById('leaveRoomConfirmModal');
    const closeLeaveModal = () => {
      if (!leaveModal) return;
      leaveModal.classList.add('hidden');
      leaveModal.style.display = 'none';
    };
    const openLeaveModal = () => {
      if (!leaveModal) {
        window.WerewolfOnlineEngine.leaveRoom(true);
        return;
      }
      leaveModal.classList.remove('hidden');
      leaveModal.style.display = 'flex';
    };

    const btnCancelLeaveRoom = document.getElementById('btnCancelLeaveRoom');
    if (btnCancelLeaveRoom) {
      btnCancelLeaveRoom.onclick = () => {
        window.WerewolfAudio.play('click');
        closeLeaveModal();
      };
    }
    const btnConfirmLeaveRoom = document.getElementById('btnConfirmLeaveRoom');
    if (btnConfirmLeaveRoom) {
      btnConfirmLeaveRoom.onclick = () => {
        window.WerewolfAudio.play('click');
        closeLeaveModal();
        window.WerewolfOnlineEngine.leaveRoom(true);
      };
    }
    if (leaveModal) {
      leaveModal.onclick = (e) => {
        if (e.target === leaveModal) closeLeaveModal();
      };
    }

    const handleLeaveOnlineClick = () => {
      window.WerewolfAudio.play('click');
      openLeaveModal();
    };
    const btnLeaveOnlineRoom = document.getElementById('btnLeaveOnlineRoom');
    if (btnLeaveOnlineRoom) {
      btnLeaveOnlineRoom.onclick = handleLeaveOnlineClick;
    }
    const btnHudLeaveRoom = document.getElementById('btnHudLeaveRoom');
    if (btnHudLeaveRoom) {
      btnHudLeaveRoom.onclick = handleLeaveOnlineClick;
    }

    // Host Mulai Game Online
    const btnStartOnlineGame = document.getElementById('btnStartOnlineGame');
    if (btnStartOnlineGame) {
      btnStartOnlineGame.onclick = () => {
        window.WerewolfAudio.play('howl');
        window.WerewolfOnlineEngine.startOnlineGame();
      };
    }

    // Offline Handlers
    const btnAddOfflinePlayer = document.getElementById('btnAddOfflinePlayer');
    if (btnAddOfflinePlayer) {
      btnAddOfflinePlayer.onclick = () => {
        window.WerewolfAudio.play('click');
        window.WerewolfOfflineEngine.addPlayer();
      };
    }

    const btnStartOfflineGame = document.getElementById('btnStartOfflineGame');
    if (btnStartOfflineGame) {
      btnStartOfflineGame.onclick = () => {
        window.WerewolfAudio.play('click');
        window.WerewolfOfflineEngine.startCardPickPhase();
      };
    }

    const btnBackFromOfflineSetup = document.getElementById('btnBackFromOfflineSetup');
    if (btnBackFromOfflineSetup) {
      btnBackFromOfflineSetup.onclick = () => {
        window.WerewolfAudio.play('click');
        switchScreen('screenMainMenu');
      };
    }

    // Role Adjust Buttons (Offline & Online)
    ['werewolf', 'villager', 'seer', 'bodyguard', 'hunter'].forEach(role => {
      const btnMinusOff = document.getElementById(`btnOfflineRoleMinus_${role}`);
      const btnPlusOff = document.getElementById(`btnOfflineRolePlus_${role}`);
      if (btnMinusOff) btnMinusOff.onclick = () => window.WerewolfOfflineEngine.adjustRole(role, -1);
      if (btnPlusOff) btnPlusOff.onclick = () => window.WerewolfOfflineEngine.adjustRole(role, 1);

      const btnMinusOn = document.getElementById(`btnOnlineRoleMinus_${role}`);
      const btnPlusOn = document.getElementById(`btnOnlineRolePlus_${role}`);
      if (btnMinusOn) btnMinusOn.onclick = () => window.WerewolfOnlineEngine.adjustOnlineRole(role, -1);
      if (btnPlusOn) btnPlusOn.onclick = () => window.WerewolfOnlineEngine.adjustOnlineRole(role, 1);
    });

    const btnMaxMinus = document.getElementById('btnOnlineMaxPlayersMinus');
    const btnMaxPlus = document.getElementById('btnOnlineMaxPlayersPlus');
    if (btnMaxMinus) btnMaxMinus.onclick = () => window.WerewolfOnlineEngine.adjustOnlineMaxPlayers(-1);
    if (btnMaxPlus) btnMaxPlus.onclick = () => window.WerewolfOnlineEngine.adjustOnlineMaxPlayers(1);

    // Game Over Restart / Back to Menu
    const btnRestartGame = document.getElementById('btnRestartGame');
    if (btnRestartGame) {
      btnRestartGame.onclick = () => {
        window.WerewolfAudio.play('click');
        if (window.WerewolfOnlineEngine && window.WerewolfOnlineEngine.isInRoom && window.WerewolfOnlineEngine.isInRoom()) {
          window.WerewolfOnlineEngine.leaveRoom(false);
        } else {
          switchScreen('screenMainMenu');
        }
      };
    }

    // Load initial icons
    document.querySelectorAll('[data-icon]').forEach(el => {
      const iconName = el.getAttribute('data-icon');
      el.innerHTML = window.WerewolfIcons.get(iconName);
    });

    if (window.WerewolfI18n) {
      window.WerewolfI18n.onLangChange(() => {
        if (currentHudKey) {
          const el = document.getElementById('hudStatusText');
          if (el) el.textContent = t(currentHudKey, currentHudVars);
        }
        if (currentHudRole) {
          setHudRole(currentHudRole);
        }
      });
      window.WerewolfI18n.applyLanguage(window.WerewolfI18n.getLang());
    }

    if (window.WerewolfOnlineEngine && window.WerewolfOnlineEngine.restoreSessionOnLoad) {
      window.WerewolfOnlineEngine.restoreSessionOnLoad();
    }
  }

  window.WerewolfApp = {
    init: initApp,
    switchScreen,
    setHudStatus,
    setHudStatusKey,
    setHudRole,
    showPrivacyScreen
  };

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
