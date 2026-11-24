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

    // Tombol Keluar Room Online
    const btnLeaveOnlineRoom = document.getElementById('btnLeaveOnlineRoom');
    if (btnLeaveOnlineRoom) {
      btnLeaveOnlineRoom.onclick = () => {
        if (confirm(t('confirm_leave_room'))) {
          window.WerewolfOnlineEngine.leaveRoom(true);
        }
      };
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

    // Game Over Restart / Back to Menu
    const btnRestartGame = document.getElementById('btnRestartGame');
    if (btnRestartGame) {
      btnRestartGame.onclick = () => {
        window.WerewolfAudio.play('click');
        switchScreen('screenMainMenu');
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
      });
      window.WerewolfI18n.applyLanguage(window.WerewolfI18n.getLang());
    }
  }

  window.WerewolfApp = {
    init: initApp,
    switchScreen,
    setHudStatus,
    setHudStatusKey,
    showPrivacyScreen
  };

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
