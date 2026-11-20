// ====================================================================
// AUDIO.JS - Web Audio API Synthesizer untuk Werewolf Game
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  let audioCtx = null;
  let isMuted = localStorage.getItem('teknogames_werewolf_muted') === 'true';

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const t = audioCtx.currentTime;

      if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.05);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      } 
      else if (type === 'flip') {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      } 
      else if (type === 'howl') {
        // Lolongan serigala bernada glissando
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.linearRampToValueAtTime(420, t + 0.6);
        osc.frequency.linearRampToValueAtTime(340, t + 1.2);
        osc.frequency.linearRampToValueAtTime(180, t + 2.0);

        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.4);
        g.gain.linearRampToValueAtTime(0.18, t + 1.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + 2.1);

        // Lowpass filter agar lebih atmosferik
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);

        osc.connect(filter);
        filter.connect(g);
        g.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 2.1);
      } 
      else if (type === 'bell') {
        // Dentang lonceng fajar desa
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          g.gain.setValueAtTime(0.22, t + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 1.4);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 1.5);
        });
      } 
      else if (type === 'seer') {
        // Nada mistis terawang
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.1);
          g.gain.setValueAtTime(0.18, t + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.8);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(t + idx * 0.1);
          osc.stop(t + idx * 0.1 + 0.85);
        });
      } 
      else if (type === 'shield') {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(330, t + 0.15);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      } 
      else if (type === 'gunshot') {
        // Suara tembakan pemburu
        const bufferSize = audioCtx.sampleRate * 0.4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        noise.connect(g);
        g.connect(audioCtx.destination);
        noise.start(t);
      } 
      else if (type === 'gavel') {
        // Palu eksekusi
        [150, 100].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, t + i * 0.18);
          g.gain.setValueAtTime(0.28, t + i * 0.18);
          g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.18 + 0.15);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(t + i * 0.18);
          osc.stop(t + i * 0.18 + 0.16);
        });
      } 
      else if (type === 'victory') {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.15);
          g.gain.setValueAtTime(0.22, t + idx * 0.15);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.15 + 0.7);
          osc.connect(g);
          g.connect(audioCtx.destination);
          osc.start(t + idx * 0.15);
          osc.stop(t + idx * 0.15 + 0.75);
        });
      }
    } catch (e) {
      console.warn('Audio playback notice:', e);
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('teknogames_werewolf_muted', String(isMuted));
    updateAudioBtnUI();
    return isMuted;
  }

  function updateAudioBtnUI() {
    const btn = document.getElementById('btnAudioToggle');
    if (!btn) return;
    const iconName = isMuted ? 'audioOff' : 'audioOn';
    if (window.WerewolfIcons) {
      btn.innerHTML = window.WerewolfIcons.get(iconName);
    }
  }

  window.WerewolfAudio = {
    init: initAudio,
    play: playSound,
    toggleMute: toggleMute,
    isMuted: () => isMuted,
    updateUI: updateAudioBtnUI
  };
})();
