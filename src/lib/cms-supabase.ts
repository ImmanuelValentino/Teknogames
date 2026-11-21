/**
 * CMS-SUPABASE.TS
 * Layanan manajemen konten (Content Management System) & indexing ranking game
 * Berbasis REST API Supabase (Tabel: public.cms_settings)
 * Tekno Game Portal - PT Teknotama Prakarsa Mulia
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vblubapxyalrimirwcdi.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_GKrh1MtY42a25ziu_2i7UQ_x_BE5z-b";

const CACHE_KEY_GAME_ORDER = "teknogame_curated_game_order";
const SESSION_AUTH_KEY = "teknogame_cms_auth_token";

/**
 * Mendapatkan cache urutan game dari LocalStorage untuk instant render (0 ms delay)
 */
export function getCachedGameOrder(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CACHE_KEY_GAME_ORDER);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan cache urutan game ke LocalStorage
 */
export function setCachedGameOrder(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY_GAME_ORDER, JSON.stringify(slugs));
  } catch (err) {
    console.error("Gagal menyimpan cache urutan game:", err);
  }
}

/**
 * Mengambil urutan game terkurasi dari Supabase cms_settings
 */
export async function fetchGameOrder(): Promise<string[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_settings?key=eq.game_order&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("Gagal memuat urutan game dari Supabase, status:", res.status);
      return getCachedGameOrder();
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].value)) {
      const order = data[0].value as string[];
      setCachedGameOrder(order);
      return order;
    }
    return getCachedGameOrder();
  } catch (err) {
    console.error("Error fetchGameOrder:", err);
    return getCachedGameOrder();
  }
}

/**
 * Memvalidasi kata sandi admin ke Supabase cms_settings
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== "string") return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_settings?key=eq.admin_password&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return false;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const savedPassword = data[0].value;
      const isValid = savedPassword === password.trim();
      if (isValid && typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_AUTH_KEY, "authenticated");
      }
      return isValid;
    }
    return false;
  } catch (err) {
    console.error("Error verifyAdminPassword:", err);
    return false;
  }
}

/**
 * Cek apakah session admin masih aktif di tab browser
 */
export function isCmsAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_AUTH_KEY) === "authenticated";
}

/**
 * Logout admin
 */
export function logoutCms(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_AUTH_KEY);
}

/**
 * Menyimpan urutan game baru ke Supabase cms_settings
 */
export async function saveGameOrder(slugs: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_settings?key=eq.game_order`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          value: slugs,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText || "Gagal menyimpan ke server Supabase" };
    }

    // Perbarui cache lokal
    setCachedGameOrder(slugs);
    return { success: true };
  } catch (err) {
    console.error("Error saveGameOrder:", err);
    return { success: false, error: err instanceof Error ? err.message : "Kesalahan jaringan" };
  }
}

/**
 * Mengubah kata sandi admin di Supabase
 */
export async function updateAdminPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: "Kata sandi minimal 4 karakter." };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_settings?key=eq.admin_password`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          value: newPassword.trim(),
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText || "Gagal memperbarui kata sandi" };
    }

    return { success: true };
  } catch (err) {
    console.error("Error updateAdminPassword:", err);
    return { success: false, error: err instanceof Error ? err.message : "Kesalahan jaringan" };
  }
}
