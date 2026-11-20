// ====================================================================
// CONFIG.JS - Konfigurasi Supabase Client untuk Werewolf Online
// TeknoGame Portal - travelista-game
// ====================================================================

(function() {
  'use strict';

  // Default credentials
  const DEFAULT_SUPABASE_URL = 'https://vblubapxyalrimirwcdi.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_GKrh1MtY42a25ziu_2i7UQ_x_BE5z-b';

  const STORAGE_KEY_URL = 'teknogames_supabase_url';
  const STORAGE_KEY_ANON = 'teknogames_supabase_anon_key';

  function getUrlParam(key) {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get(key) || '';
    } catch (e) {
      return '';
    }
  }

  function getSupabaseConfig() {
    // 1. Cek parameter URL jika ada
    const urlFromParam = getUrlParam('supabase_url');
    const keyFromParam = getUrlParam('supabase_key');
    if (urlFromParam && keyFromParam) {
      return { url: urlFromParam, anonKey: keyFromParam };
    }

    // 2. Cek window environment (dari .env / Next.js)
    if (window.NEXT_PUBLIC_SUPABASE_URL && window.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        url: window.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: window.NEXT_PUBLIC_SUPABASE_ANON_KEY
      };
    }

    // 3. Gunakan kredensial default dari environment
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_ANON_KEY
    };
  }

  function saveSupabaseConfig(url, anonKey) {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  }

  function isSupabaseConfigured() {
    const cfg = getSupabaseConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('http') && cfg.anonKey.length > 20);
  }

  window.WerewolfConfig = {
    getSupabaseConfig,
    saveSupabaseConfig,
    isSupabaseConfigured
  };
})();
