# Sanguine — v0.2

A personal repository and wellness site, built with Astro + Keystatic CMS.
Hosted on Netlify. Content edited via the in-site admin at `/keystatic` (or
`/admin`). Site-wide search powered by Pagefind, served instantly from a
static index built into every deploy.

---

## What's new in v2 (versus v1)

| | v1 (Decap) | v2 (Keystatic) |
|---|---|---|
| Editor | `/admin` Decap form | `/keystatic` Keystatic admin |
| Auth | Netlify Identity (deprecated‑ish) | Keystatic Cloud (free up to 3 users) |
| Theme & brand | hardcoded | **editable in admin** (colors, fonts, density, brand text) |
| Page composition | hardcoded templates | **block composition** — drag/drop sections per page |
| Site search | none | **persistent thin bar in header**, Cmd/Ctrl+K |

If you're migrating from v1, see **§ Migrating from v1** below.

---

## Quickstart for new deployments

### 1. Push code to GitHub

Drag-and-drop the project folder into a fresh GitHub repo via github.com.
On Mac, press `Cmd + Shift + .` to reveal hidden files (`.gitignore` etc)
before dragging. On Windows, enable "Show hidden items" in File Explorer
view options.

> **Note:** do not commit `node_modules/`, `dist/`, `.netlify/`, or
> `.keystatic/` — they're in `.gitignore` and Netlify will regenerate them.

### 2. Connect Netlify

1. netlify.com → Add new site → Import from Git → pick the repo
2. Netlify auto-detects Astro. Build command and publish dir come from
   `netlify.toml`. Just hit **Deploy**.
3. First build will take ~2 minutes. The site goes live at a `*.netlify.app`
   URL. Connect your custom domain under **Domain management** later.

### 3. Set up Keystatic Cloud (for editing on the live site)

In dev, Keystatic writes directly to local files. In production, it commits
to GitHub via Keystatic Cloud — their service handles all the OAuth so you
don't have to manage GitHub Apps or API tokens.

1. Go to [keystatic.cloud](https://keystatic.cloud) → Sign in with GitHub.
2. Create a new team (e.g. `sanguinebio`) and a new project inside it
   (e.g. `sanguine`). Connect the project to this site's GitHub repo when
   prompted.
3. Keystatic Cloud will show a code snippet like:

   ```ts
   cloud: { project: 'TEAM_NAME/PROJECT_NAME' }
   ```

4. Open `keystatic.config.tsx` in your repo (GitHub web UI: click the file,
   then the pencil icon). The `cloud.project` value is already set to
   `sanguinebio/sanguine` — replace it with the exact string Keystatic
   Cloud showed you, then commit. Netlify will auto-redeploy.

5. After the deploy finishes, visit `https://yoursite.com/keystatic`. It
   redirects to GitHub for sign-in (via Keystatic Cloud), then drops you
   into the editor.

> **No environment variables needed.** Keystatic Cloud handles auth on
> their own infrastructure — you don't paste any secrets into Netlify.
>
> **Free tier:** Up to 3 team members per project. For solo use you're
> well under the limit.

> **How dev vs production is decided:** `keystatic.config.tsx` reads
> `import.meta.env.DEV` — `true` during `npm run dev` (local mode, writes
> to disk), `false` during `npm run build` (cloud mode, commits via
> Keystatic Cloud). No manual switching needed.

### 4. Edit content

Visit `/keystatic` (or the convenience redirect `/admin`). Sign in with
GitHub. The left sidebar groups everything:

- **Site**
  - **Theme & Brand** — palette, fonts, density, footer text, social links
  - **Page — Home (Landing)**
  - **Page — Sanguine (Wellness landing)**
  - **Page — Contact**
- **Sanguine — Wellness**
  - Peptides (collection)
  - Nootropics (collection)
- **Repository**
  - Topics, Subtopics, Links

Save = commit to GitHub via Keystatic Cloud → triggers a Netlify deploy → live in ~60 seconds.

---

## Migrating from v1 (Decap → Keystatic)

If you already deployed v1, here's the cleanest path:

1. **Back up your content.** Download or note your current GitHub repo state.
   Your `src/content/` folders (peptides, nootropics, repo-topics, etc.) move
   over unchanged — Keystatic uses the same files in the same shape.

2. **Replace the project files.** In your GitHub repo's web UI, the simplest
   path is:
   - Delete (one by one) every file in the repo *except* `src/content/`.
   - Drag-and-drop the v2 zip contents into the repo.
   - Commit.

3. **Remove old Netlify Identity setup.** In Netlify:
   - Site configuration → Identity → Disable.
   - Delete `public/admin/index.html` and `public/admin/config.yml` if they
     exist (these were Decap files).

4. **Set up Keystatic Cloud** — see step 3 above.

5. **Bookmark the new admin URL:** `https://yoursite.com/keystatic`
   (`/admin` still works as a redirect).

Your content survives intact — the format Decap used (markdown frontmatter,
JSON for repository data) is the same format Keystatic reads.

---

## Daily editing flow

### Edit a page (block composition)

1. `/keystatic` → Site → Page — Home (or Sanguine, or Contact)
2. Each page has a **Blocks** field with drag handles. Add a block (Hero,
   Portal, Section header, Section list, Prose, Quote, Image, Disclaimer,
   Contact info, Spacer, Footnote), reorder them, edit each one's fields.
3. Save → commits → site redeploys → ~60 seconds to go live.

### Add a peptide or nootropic entry

1. `/keystatic` → Sanguine — Wellness → Peptides → New
2. Fill in title, summary, category, body (rich text editor with headings,
   links, lists). Aliases, dates, sort order all optional.
3. Save.

### Add a repository link

1. `/keystatic` → Repository → Links → New
2. Pick the topic (and optionally a subtopic) from a dropdown — they're
   relationship fields populated from your topics/subtopics collections.
3. Title, URL, type (Article / Study / Book / Video / Podcast / Other),
   author, year, description.
4. Save.

### Theme & Brand changes

1. `/keystatic` → Site → Theme & Brand
2. Color hex codes for paper, ink, moss, bark, rule (the 5 base colors —
   everything else computes from these via CSS color-mix).
3. Font dropdowns for display + body. Currently includes Fraunces, Cormorant
   Garamond, EB Garamond, Playfair Display, Crimson Pro, Lora, DM Serif
   Display, Libre Caslon Text, Manrope, DM Sans, Public Sans, Outfit, Plus
   Jakarta Sans, Work Sans, Inter Tight, Nunito Sans. To add more, edit the
   `fontDisplay` / `fontBody` `options` arrays in `keystatic.config.tsx`.
4. Density: compact / normal / spacious — multiplies all spacing values.
5. Save.

---

## Search behavior

The thin search input lives in the sticky header on every page except the
landing page (where it would compete with the hero).

- **Cmd/Ctrl + K** focuses the input from anywhere.
- **Esc** closes the dropdown when the input is focused.
- **Filter chips**: All / Repository / Peptides / Nootropics — narrow
  results by section.
- **Index built at deploy time**: `pagefind --site dist` runs after every
  Astro build and generates `dist/pagefind/`. The first deploy populates the
  index — search shows "Search index not available yet" until then.

What gets indexed: every page wrapped in `<div data-pagefind-body>`. Pages
without that wrapper (and elements marked `data-pagefind-ignore` like
breadcrumbs) are excluded.

---

## Local development (optional)

You can edit GitHub-only and never touch a terminal. But if you want a
preview environment:

```bash
git clone <your-repo-url>
cd sanguine
npm install
npm run dev
```

Open `http://localhost:4321`. The Keystatic admin runs at
`http://localhost:4321/keystatic` in **local mode** — your edits write
directly to disk under `src/content/`. To preview the production behavior
of the search bar specifically, you'll need a full build:

```bash
npm run build
npm run preview
```

The `build` script runs `astro build && pagefind --site dist`, so search
works in preview.

---

## Customization

### Adding a new block type

1. **Define the block schema** in `keystatic.config.tsx` under the
   `pageBlocks` object. Pattern: `myBlock: fields.object({ ... }, { label: 'My Block — short description' })`.
2. **Create the component** at `src/components/blocks/MyBlock.astro`.
   Accept the field values as props.
3. **Register in BlockRenderer** at `src/components/BlockRenderer.astro` —
   add a `case 'myBlock': return <MyBlock {...block.value} />;` line.
4. **Mirror the type** in `src/config/pages.ts` `Block` union for
   type safety.

The block becomes available in every page editor immediately.

### Adding a new collection (e.g. "Books I've read")

1. Add to `keystatic.config.tsx` under `collections`. Set `path:` to where
   files are stored.
2. Mirror the schema in `src/content.config.ts` (Astro content layer).
3. Build a listing page at `src/pages/<your-section>/index.astro` using
   `getCollection('books')` and a detail page at `[slug].astro`.

### Changing fonts or colors beyond the dropdown

Edit `src/styles/tokens.css` for fallbacks, or add new options to the font
selects in `keystatic.config.tsx`. Theme CSS is injected from the singleton
at build time — see `src/config/settings.ts` and `src/layouts/Base.astro`.

---

## Removing Keystatic

If you ever want to drop the CMS layer and edit raw files via GitHub:

```bash
npm run remove-keystatic
```

This removes Keystatic-only files and dependencies. Your content stays
exactly where it is — Keystatic just stops being the editor for it. After
that, switch `astro.config.mjs` from `output: 'server'` to `output: 'static'`
and remove the `@astrojs/netlify` adapter if you also want to drop server
rendering.

---

## File structure (high level)

```
sanguine/
├─ keystatic.config.tsx      ← schema for the entire CMS
├─ astro.config.mjs          ← integrations + output mode
├─ netlify.toml              ← build pipeline + headers
├─ package.json              ← deps + npm run build chains pagefind
├─ src/
│  ├─ content/               ← all editable content (Markdown + JSON)
│  │  ├─ pages/              ← block-composed page singletons
│  │  ├─ settings/site/      ← theme & brand singleton
│  │  ├─ peptides/           ← collection
│  │  ├─ nootropics/         ← collection
│  │  ├─ repo-topics/        ← collection
│  │  ├─ repo-subtopics/     ← collection
│  │  └─ repo-links/         ← collection
│  ├─ content.config.ts      ← Astro content schemas (mirror Keystatic)
│  ├─ config/                ← runtime helpers (settings, pages)
│  ├─ components/blocks/     ← one component per block type
│  ├─ components/search/     ← persistent search bar
│  ├─ layouts/Base.astro     ← injects theme + dynamic fonts
│  ├─ pages/
│  │  ├─ index.astro         ← landing
│  │  ├─ sanguine/           ← wellness arm (block-composed + data-driven)
│  │  └─ repository/         ← data-driven hierarchical archive
│  └─ styles/                ← tokens + global
└─ scripts/
   └─ remove-keystatic.js    ← escape hatch
```

---

## Tech stack

- **Astro 5** — meta-framework, server output mode for the admin routes,
  prerender = true on every public page so they're served as static HTML
- **Keystatic CMS** — schema-defined editor, file-based storage, GitHub
  commits via Keystatic Cloud OAuth in production
- **Pagefind** — static-site search, indexes built into `/pagefind/` at
  deploy time, ~190 KB index for a typical site, fully client-side runtime
- **Netlify** — host, with `@astrojs/netlify` adapter for the few SSR
  routes Keystatic needs

---

## Support

- Site doesn't update after editing → check the Netlify deploys list.
  The Keystatic save → GitHub commit → Netlify deploy chain takes
  ~60 seconds.
- `/keystatic` redirects to GitHub login on production but never returns →
  check that `cloud.project` in `keystatic.config.tsx` matches the team and
  project name in your Keystatic Cloud dashboard exactly.
- Search shows "index not available" → expected until the first deploy
  completes after this version went live.
- Theme changes don't appear → hard refresh (Cmd/Ctrl + Shift + R) to bust
  CSS cache. Netlify caches assets aggressively.
