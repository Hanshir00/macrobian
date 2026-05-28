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

## Adding more later

This is intentionally one page. When you want more (additional pages, a blog,
collections), those get added back as new singletons/collections in
`keystatic.config.tsx` with matching templates — ask and they can be built on
top of this foundation.

## Files

- `keystatic.config.tsx` — the single `landing` singleton (all fields).
- `src/config/landing.ts` — reads the content + theme at build time, with
  defaults; builds the CSS variables and Google Fonts URL.
- `src/pages/index.astro` — the landing layout (self-contained).
- `src/content/landing/index.json` — the saved content.
- `src/styles/global.css` — minimal reset + base.
