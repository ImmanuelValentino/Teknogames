// ====================================================================
// APP.JS - Koordinator Utama & UI Controller untuk Werewolf Game
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  let currentScreenId = 'screenMainMenu';

  function switchScreen(targetScreenId) {
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.add('hidden');
    });
    const target = document.getElementById(targetScreenId);
    if (target) {
      target.classList.remove('hidden');
      currentScreenId = targetScreenId;
    }
  }

  function setHudStatus(text) {
    const el = document.getElementById('hudStatusText');
    if (el) el.textContent = text;
  }

  // Layar Privasi Aman (Privacy Screen)
  function showPrivacyScreen(title, desc, btnText, onConfirmCallback) {
    switchScreen('screenPrivacy');
    document.getElementById('privacyScreenTitle').textContent = title;
    document.getElementById('privacyScreenDesc').textContent = desc;

    const btn = document.getElementById('btnPrivacyConfirm');
    btn.textContent = btnText || 'Buka Layar';
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
        setHudStatus('SETUP OFFLINE');
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
          btnCopyRoomCode.innerHTML = `${window.WerewolfIcons.get('check')} Tersalin!`;
          setTimeout(() => {
            btnCopyRoomCode.innerHTML = `${window.WerewolfIcons.get('copy')} Salin Kode`;
          }, 2000);
        }).catch(() => {
          alert('Kode Room: ' + code);
        });
      };
    }

    // Tombol Keluar Room Online
    const btnLeaveOnlineRoom = document.getElementById('btnLeaveOnlineRoom');
    if (btnLeaveOnlineRoom) {
      btnLeaveOnlineRoom.onclick = () => {
        if (confirm('Apakah kamu yakin ingin keluar dari room ini?')) {
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
  }

  window.WerewolfApp = {
    init: initApp,
    switchScreen,
    setHudStatus,
    showPrivacyScreen
  };

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
