# Sanguine — bare-bones landing

A single landing page in the "Aperture" instrument aesthetic, with every piece
of text and the whole color/font theme editable in Keystatic. Nothing else —
you build the rest from here.

## Stack

- **Astro** (server output; the landing page itself prerenders to static HTML)
- **Keystatic** CMS (Keystatic Cloud — project `sanguinebio/sanguine`)
- **Netlify** hosting

## Editing the page

Go to `/keystatic` (or `/admin`, which redirects there) and sign in with
GitHub. Open **Landing Page**. Everything is here:

- **Brand**: name + version tag, top navigation links.
- **Left rail**: aperture label, diameter, tolerance, revision.
- **Spine**: the vertical red text and the number at its base.
- **Hero**: eyebrow (two parts), the big title, the description, the primary
  button (label + link) and the secondary link (label + link).
- **Footer plate**: left / center / right readouts.
- **Theme (colors & fonts)**: the five colors (two background corners, ink,
  muted, accent red) and the display + mono font choices.

Click **Save** (top-right) — it commits to GitHub, Netlify rebuilds (~1 min),
and your change is live. Hard-refresh (Cmd/Ctrl+Shift+R) to see it.

> The default text frames Sanguine as a clinical "instrument." That's just
> placeholder wording to match the design — rewrite it to fit your actual site.

## Deploying (replacing the old site)

This replaces your previous site entirely. Do a **full replace** of the GitHub
repo contents with these files:

1. In GitHub, delete the old files (or replace the repo contents) and add
   everything from this project.
2. Keystatic Cloud stays the same (still `sanguinebio/sanguine`), so sign-in
   keeps working.
3. Netlify rebuilds automatically — **one deploy** (~15 credits).

Local dev (optional): `npm install` then `npm run dev`. In dev, Keystatic uses
local storage and writes to `src/content/landing/index.json` directly.

## Creating pages

In the Admin, open **Pages → Create**. Give it a title (the slug auto-fills
from the title and becomes the URL — e.g. "Method" → `/method`), add an
optional intro line, and write the body. To show a page in the top nav,
open **Landing Page → Top navigation** and add an item whose link is the
page's slug.

## Site search

A search bar lives in the header on every page — click it or press **⌘K** (Ctrl+K on Windows/Linux). It opens a modal that searches the content of every Page you've created (the landing is excluded, since its words are mostly UI labels).

Search runs entirely client-side from a static index that's generated at deploy time by [Pagefind](https://pagefind.app). No server, no API keys, no extra cost. In local dev it shows a friendly "available after deploy" message because the index doesn't exist until the build runs.

## Inline components (inside a page body)

Inside the body of any page, the **+** menu in the editor inserts these:

- **Callout** — info / tip / warning box with an optional title.
- **Pull quote** — a large styled quote with optional attribution.
- **Figure** — uploaded image with a caption (images upload to
  `public/images/figures/`).
- **Video embed** — paste a YouTube or Vimeo URL; renders an in-page player.
- **Citation** — formatted reference (authors, title, source, year, link).
- **Stats band** — a row of big numbers; insert "Stat" items inside.
- **Card grid** — small linked cards; insert "Card" items inside.

The sample `/method` page demonstrates each one — open it in the Admin to
see exactly how they're inserted, then delete it whenever you're ready.

## Files

- `keystatic.config.tsx` — the single `landing` singleton (all fields).
- `src/config/landing.ts` — reads the content + theme at build time, with
  defaults; builds the CSS variables and Google Fonts URL.
- `src/pages/index.astro` — the landing layout (self-contained).
- `src/content/landing/index.json` — the saved content.
- `src/styles/global.css` — minimal reset + base.
