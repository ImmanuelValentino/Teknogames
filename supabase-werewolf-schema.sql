-- ====================================================================
-- SUPABASE SCHEMA UNTUK WEREWOLF ONLINE MULTIPLAYER (ROOM KODE 6 DIGIT)
-- TeknoGame Portal - travelista-game
-- ====================================================================

-- 1. Buat Tabel werewolf_rooms jika belum ada
CREATE TABLE IF NOT EXISTS werewolf_rooms (
  room_code VARCHAR(6) PRIMARY KEY,
  status VARCHAR(32) NOT NULL DEFAULT 'lobby', -- lobby, card_pick, night, day_announcement, day_discussion, day_voting, finished
  game_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index untuk mengoptimalkan performa query status & garbage collection
CREATE INDEX IF NOT EXISTS idx_werewolf_rooms_updated_at ON werewolf_rooms(updated_at);
CREATE INDEX IF NOT EXISTS idx_werewolf_rooms_status ON werewolf_rooms(status);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE werewolf_rooms ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies untuk Akses Anonim / Publik yang Aman (Temporary Rooms)
-- Policy 1: SELECT (Semua pemain dapat membaca status room tempat mereka bergabung)
DROP POLICY IF EXISTS "Anon Select Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Select Werewolf Rooms" ON werewolf_rooms
  FOR SELECT TO anon, authenticated
  USING (true);

-- Policy 2: INSERT (Semua pemain/host dapat membuat room baru dengan kode 6 digit)
DROP POLICY IF EXISTS "Anon Insert Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Insert Werewolf Rooms" ON werewolf_rooms
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy 3: UPDATE (Pemain dan Host dapat mengirimkan aksi giliran/status ke room)
DROP POLICY IF EXISTS "Anon Update Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Update Werewolf Rooms" ON werewolf_rooms
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 4: DELETE (Auto-cleanup saat Game Over dan Garbage Collection room kedaluwarsa)
DROP POLICY IF EXISTS "Anon Delete Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Delete Werewolf Rooms" ON werewolf_rooms
  FOR DELETE TO anon, authenticated
  USING (true);

-- 5. Aktifkan Replikasi Realtime pada Tabel werewolf_rooms
-- Pastikan tabel masuk ke dalam publikasi realtime Supabase
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'werewolf_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE werewolf_rooms;
  END IF;
END $$;
