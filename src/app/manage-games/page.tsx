"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  Key,
  ShieldCheck,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { INITIAL_GAMES } from "@/lib/games-data";
import { Game } from "@/types/game";
import {
  fetchGameOrder,
  getCachedGameOrder,
  verifyAdminPassword,
  saveGameOrder,
  updateAdminPassword,
  isCmsAuthenticated,
  logoutCms,
} from "@/lib/cms-supabase";

export default function ManageGamesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Data Game & Urutan
  const [games, setGames] = useState<Game[]>([]);
  const [initialSlugs, setInitialSlugs] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Status Aksi
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modal Ganti Password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // Drag and Drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Inisialisasi Auth & Urutan Game
  useEffect(() => {
    if (isCmsAuthenticated()) {
      setIsAuthenticated(true);
      loadGameList();
    }
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadGameList = async () => {
    // 1. Ambil urutan dari cache dulu atau Supabase
    let order = getCachedGameOrder();
    if (!order || order.length === 0) {
      order = await fetchGameOrder();
    }

    // 2. Susun urutan game berdasarkan array slug
    const gameMap = new Map<string, Game>();
    INITIAL_GAMES.forEach((g) => gameMap.set(g.slug, g));

    const orderedList: Game[] = [];
    const usedSlugs = new Set<string>();

    if (Array.isArray(order) && order.length > 0) {
      order.forEach((slug) => {
        const game = gameMap.get(slug);
        if (game) {
          orderedList.push(game);
          usedSlugs.add(slug);
        }
      });
    }

    // Sisanya yang belum masuk urutan dimasukkan di belakang
    INITIAL_GAMES.forEach((g) => {
      if (!usedSlugs.has(g.slug)) {
        orderedList.push(g);
      }
    });

    setGames(orderedList);
    const slugs = orderedList.map((g) => g.slug);
    setInitialSlugs(slugs);
    setHasUnsavedChanges(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError("Harap masukkan kata sandi rahasia.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const isValid = await verifyAdminPassword(passwordInput);
      if (isValid) {
        setIsAuthenticated(true);
        setPasswordInput("");
        await loadGameList();
      } else {
        setAuthError("Kata sandi salah. Silakan coba lagi.");
      }
    } catch {
      setAuthError("Terjadi gangguan koneksi ke server Supabase.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logoutCms();
    setIsAuthenticated(false);
    setGames([]);
    setHasUnsavedChanges(false);
  };

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const copyList = [...games];
    const draggedItemContent = copyList[dragItem.current];
    copyList.splice(dragItem.current, 1);
    copyList.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;

    setGames(copyList);
    setHasUnsavedChanges(true);
  };

  // Tombol Geser 1 Posisi (Up/Down)
  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= games.length) return;

    const copyList = [...games];
    const temp = copyList[index];
    copyList[index] = copyList[targetIndex];
    copyList[targetIndex] = temp;

    setGames(copyList);
    setHasUnsavedChanges(true);
  };

  // Shortcut: Jadikan Langsung Top 1
  const makeTopOne = (index: number) => {
    if (index === 0) return;
    const copyList = [...games];
    const item = copyList.splice(index, 1)[0];
    copyList.unshift(item);

    setGames(copyList);
    setHasUnsavedChanges(true);
    showToast(`"${item.title}" dinaikkan menjadi Top 1. Jangan lupa klik Terapkan Urutan!`);
  };

  // Reset ke urutan bawaan awal INITIAL_GAMES
  const handleResetToDefault = () => {
    const defaultList = [...INITIAL_GAMES];
    setGames(defaultList);
    setHasUnsavedChanges(true);
    showToast("Urutan dikembalikan ke bawaan sistem. Klik Terapkan Urutan untuk menyimpan.");
  };

  // Simpan Urutan ke Supabase
  const handleSaveOrder = async () => {
    setIsSaving(true);
    const currentSlugs = games.map((g) => g.slug);
    const res = await saveGameOrder(currentSlugs);

    setIsSaving(false);
    if (res.success) {
      setInitialSlugs(currentSlugs);
      setHasUnsavedChanges(false);
      showToast("Urutan game berhasil diterapkan dan aktif di Beranda!");
    } else {
      showToast(res.error || "Gagal menyimpan urutan game.", "error");
    }
  };

  // Ganti Password Admin
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      showToast("Kata sandi minimal 4 karakter.", "error");
      return;
    }

    setPasswordChangeLoading(true);
    const res = await updateAdminPassword(newPasswordInput);
    setPasswordChangeLoading(false);

    if (res.success) {
      setShowPasswordModal(false);
      setNewPasswordInput("");
      showToast("Kata sandi admin berhasil diperbarui di Supabase!");
    } else {
      showToast(res.error || "Gagal memperbarui kata sandi.", "error");
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: FORM LOGIN ADMIN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-gradient-to-b from-[#260e13] to-[#17080b] border border-rose-900/40 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <Lock className="w-8 h-8" strokeWidth={2.2} />
            </div>
            <h1 className="font-heading text-2xl font-black text-white tracking-tight">
              CMS Indexing Game
            </h1>
            <p className="text-xs text-rose-200/70 mt-1.5">
              Masukkan kata sandi rahasia untuk mengelola urutan game
            </p>
          </div>

          {authError && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-200/80 mb-2">
                Kata Sandi Rahasia
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Ketik kata sandi..."
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-950/50 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{authLoading ? "Memverifikasi..." : "Masuk ke Panel CMS"}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Tekno Game</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DASHBOARD CMS DRAG & DROP
  // -------------------------------------------------------------
  const topOneGame = games[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-fade-in ${
            toastMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-200"
              : "border-rose-500/40 bg-rose-950/90 text-rose-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/50 px-3 py-1 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
              Admin CMS Indexing
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manajemen Urutan & Ranking Game
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Tentukan game Top 1 sampai urutan terakhir. Game nomor urut #1 akan otomatis menjadi kartu utama di Hero Banner Beranda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <span>Buka Web Utama</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ganti Sandi</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-900/50 bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Top 1 Live Highlight Box */}
      {topOneGame && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#26130b] to-[#1c0c0f] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                  TOP 1 SELEKSI UTAMA
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Hero Homepage
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                {topOneGame.title}
              </h3>
              <p className="text-xs text-slate-300">
                Kategori: <span className="capitalize font-semibold text-white">{topOneGame.category}</span> — Tampil paling depan di Beranda.
              </p>
            </div>
          </div>

          <div className="relative w-20 h-14 sm:w-28 sm:h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/40">
            {topOneGame.thumbnailUrl ? (
              <Image
                src={topOneGame.thumbnailUrl}
                alt={topOneGame.title}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                No Thumb
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Bar (Save & Reset) */}
      <div className="sticky top-20 z-30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1a0a0d]/90 p-3 sm:p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-300">
            Total Game: <strong className="text-white">{games.length}</strong>
          </span>
          {hasUnsavedChanges ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 animate-pulse">
              Ada perubahan belum disimpan
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              Urutan tersinkronisasi
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleSaveOrder}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-950/60 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Menerapkan..." : "Terapkan Urutan"}</span>
          </button>
        </div>
      </div>

      {/* List Permainan (Drag and Drop List) */}
      <div className="space-y-2.5">
        {games.map((game, index) => {
          const isTop1 = index === 0;
          const isTop2 = index === 1;

          return (
            <div
              key={game.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`group flex items-center justify-between gap-3 rounded-2xl border p-3 sm:p-4 transition-all duration-150 cursor-grab active:cursor-grabbing ${
                isTop1
                  ? "border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-[#220e12] shadow-md shadow-amber-950/20"
                  : isTop2
                  ? "border-purple-500/30 bg-gradient-to-r from-purple-950/20 to-[#1e0d11]"
                  : "border-white/10 bg-[#1c0c0f] hover:border-white/20 hover:bg-[#251014]"
              }`}
            >
              {/* Sisi Kiri: Drag Handle + Badge Nomor + Info Game */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Drag Handle */}
                <div className="text-slate-500 group-hover:text-rose-400 transition-colors shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Badge Nomor Urut */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 ${
                    isTop1
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                      : isTop2
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0">
                  {game.thumbnailUrl ? (
                    <Image
                      src={game.thumbnailUrl}
                      alt={game.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                      Thumb
                    </div>
                  )}
                </div>

                {/* Info Game */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-sm sm:text-base font-bold text-white truncate">
                      {game.title}
                    </h4>
                    {isTop1 && (
                      <span className="hidden sm:inline-block rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300">
                        Top 1 Hero
                      </span>
                    )}
                    {isTop2 && (
                      <span className="hidden sm:inline-block rounded-md bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-purple-300">
                        Top 2 Hero
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="capitalize font-medium text-slate-300">
                      {game.category}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      /play/{game.slug}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sisi Kanan: Tombol Reorder Cepat (Up, Down, Top 1) */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {!isTop1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      makeTopOne(index);
                    }}
                    title="Jadikan Game Top 1"
                    className="hidden md:inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Jadikan Top 1</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, "up");
                  }}
                  title="Pindah Naik"
                  className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={index === games.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, "down");
                  }}
                  title="Pindah Turun"
                  className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Ubah Kata Sandi */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#230e13] p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              Ubah Kata Sandi Admin
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Kata sandi baru akan langsung disimpan ke Supabase database.
            </p>

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <input
                type="text"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi baru..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordChangeLoading}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
                >
                  {passwordChangeLoading ? "Menyimpan..." : "Simpan Sandi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
