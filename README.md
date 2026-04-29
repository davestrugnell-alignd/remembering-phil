# Remembering Phil

A dignified memorial website for Phil, built with Vite + React, Supabase, and Cloudinary.

## Features

- **Slideshow** — Ken Burns photo slideshow on the home page hero
- **Memory wall** — visitors submit written tributes; approved entries appear publicly
- **Gallery** — visitors upload photos and video testimonials directly to Cloudinary; approved media appears in the gallery

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env`:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → `anon` `public` key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → upper-right cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary dashboard → Settings → Upload → Upload presets → create an **unsigned** preset |

### 3. Create Supabase tables

Open your Supabase project's **SQL editor** and run:

```sql
-- Memories submitted by visitors
CREATE TABLE memories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  message     text        NOT NULL,
  approved    boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a memory"
  ON memories FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Approved memories are visible"
  ON memories FOR SELECT TO anon USING (approved = true);

-- Media uploaded by visitors
CREATE TABLE media_uploads (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text,
  caption         text,
  cloudinary_url  text        NOT NULL,
  resource_type   text        NOT NULL,
  approved        boolean     DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a media upload"
  ON media_uploads FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Approved uploads are visible"
  ON media_uploads FOR SELECT TO anon USING (approved = true);
```

### 4. Add slideshow photos

Drop JPEG or PNG files into `public/photos/`, then list their filenames in `src/components/Slideshow.jsx`:

```js
const PHOTOS = [
  'photo-1.jpg',
  'photo-2.jpg',
  // ...
]
```

### 5. Personalise

Open `src/pages/Home.jsx` and update the `PERSON` object with Phil's name, dates, and a quote.

### 6. Start the dev server

```bash
npm run dev
```

---

## Moderation

Submissions are hidden until approved. To approve entries:

1. Open your Supabase project → **Table editor**
2. Find the row in `memories` or `media_uploads`
3. Set `approved = true`

Or run SQL: `UPDATE memories SET approved = true WHERE id = '<uuid>';`

---

## Project structure

```
src/
  components/
    Nav.jsx           — sticky top navigation
    Slideshow.jsx     — Ken Burns photo carousel
    MemoryWall.jsx    — grid of approved tributes
    MemoryForm.jsx    — tribute submission form
    UploadForm.jsx    — Cloudinary direct upload with progress
    UploadGallery.jsx — approved photos/videos grid
  lib/
    supabase.js       — Supabase client
    cloudinary.js     — Cloudinary upload helper + validation
  pages/
    Home.jsx          — hero with slideshow (route: /)
    Memories.jsx      — memory wall + form (route: /memories)
    Gallery.jsx       — upload form + gallery (route: /gallery)
  App.jsx             — routes
  main.jsx            — entry point
  index.css           — global styles and CSS variables
public/
  photos/             — static slideshow images
```

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host — just ensure the `VITE_*` env vars are set in your hosting dashboard.
