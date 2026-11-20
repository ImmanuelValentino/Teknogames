-- ====================================================================
-- SUPABASE SCHEMA UNTUK WEREWOLF ONLINE MULTIPLAYER (ROOM KODE 6 DIGIT)
-- TeknoGame Portal - travelista-game
-- ====================================================================

CREATE TABLE IF NOT EXISTS werewolf_rooms (
  room_code VARCHAR(6) PRIMARY KEY,
  status VARCHAR(32) NOT NULL DEFAULT 'lobby',
  game_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_werewolf_rooms_updated_at ON werewolf_rooms(updated_at);
CREATE INDEX IF NOT EXISTS idx_werewolf_rooms_status ON werewolf_rooms(status);

ALTER TABLE werewolf_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon Select Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Select Werewolf Rooms" ON werewolf_rooms
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anon Insert Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Insert Werewolf Rooms" ON werewolf_rooms
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Update Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Update Werewolf Rooms" ON werewolf_rooms
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Delete Werewolf Rooms" ON werewolf_rooms;
CREATE POLICY "Anon Delete Werewolf Rooms" ON werewolf_rooms
  FOR DELETE TO anon, authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'werewolf_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE werewolf_rooms;
  END IF;
END $$;
