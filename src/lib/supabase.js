import { createClient } from '@supabase/supabase-js'

/*
  ── Supabase SQL Setup ─────────────────────────────────────────────────────
  Run the following in your Supabase project's SQL editor:

  -- Memories submitted by visitors
  CREATE TABLE memories (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text        NOT NULL,
    message     text        NOT NULL,
    approved    boolean     DEFAULT false,
    created_at  timestamptz DEFAULT now()
  );

  -- Enable Row Level Security
  ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

  -- Visitors can insert new memories (moderation happens in dashboard)
  CREATE POLICY "Anyone can submit a memory"
    ON memories FOR INSERT TO anon WITH CHECK (true);

  -- Only approved memories are publicly readable
  CREATE POLICY "Approved memories are visible"
    ON memories FOR SELECT TO anon USING (approved = true);

  ─────────────────────────────────────────────────────────────────────────

  -- Media uploaded by visitors
  CREATE TABLE media_uploads (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            text,
    caption         text,
    cloudinary_url  text        NOT NULL,
    resource_type   text        NOT NULL,  -- 'image' | 'video'
    approved        boolean     DEFAULT false,
    created_at      timestamptz DEFAULT now()
  );

  ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Anyone can submit a media upload"
    ON media_uploads FOR INSERT TO anon WITH CHECK (true);

  CREATE POLICY "Approved uploads are visible"
    ON media_uploads FOR SELECT TO anon USING (approved = true);
  ─────────────────────────────────────────────────────────────────────────
*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] Missing env vars. Copy .env.example to .env and fill in your project credentials.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
