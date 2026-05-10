# Sanguine

A repository of inquiry. A practice of vitality.

This is the source for the Sanguine website — a personal repository of literature and research, paired with practical guidance on peptides, nootropics, and contact details. Built with [Astro](https://astro.build/), edited via [Decap CMS](https://decapcms.org/), hosted on Netlify, and stored in GitHub.

---

## Table of contents

1. [How the site is structured](#how-the-site-is-structured)
2. [First-time setup](#first-time-setup)
3. [Deploying to Netlify](#deploying-to-netlify)
4. [Setting up the CMS at `/admin`](#setting-up-the-cms-at-admin)
5. [Day-to-day editing](#day-to-day-editing)
6. [Tuning the design](#tuning-the-design)
7. [Local development](#local-development)
8. [What goes where](#what-goes-where)

---

## How the site is structured

The landing page splits into two paths:

- **Repository** — a hierarchical archive: Topics → Subtopics → Links to articles, studies, books, videos.
- **Sanguine** — three subpages: **Peptides**, **Nootropics**, and **Contact**.

Every piece of content is a markdown or JSON file inside `src/content/`. The Decap CMS at `/admin` is a visual editor for those files — when you save in the CMS, it commits a file to GitHub and Netlify rebuilds the site.

---

## First-time setup

You need three accounts:

1. **GitHub** (free) — stores the code.
2. **Netlify** (free tier is enough) — hosts the site, manages the domain, handles CMS auth.
3. *(Optional)* **A domain registrar** — or buy through Netlify directly.

### Push this project to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:YOUR-USERNAME/sanguine.git
git push -u origin main
```

If you don't already have a GitHub repo, create one at <https://github.com/new> first.

---

## Deploying to Netlify

1. Go to <https://app.netlify.com/start>, click **Import from Git**, choose your `sanguine` repo.
2. Build settings should auto-detect from `netlify.toml`. If asked, set:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Click **Deploy**. You'll get a `*.netlify.app` URL.
4. To attach your real domain: **Domain settings → Add a domain → Buy a domain** (or **Add domain you already own**).
5. After the domain resolves, update two places in this codebase:
   - `astro.config.mjs` → `site:` field
   - `src/config/site.ts` → `url:` field
   - `public/admin/config.yml` → `site_url`, `display_url`, `logo_url`
   - `public/robots.txt` → sitemap URL
   - Commit and push. Netlify rebuilds.

---

## Setting up the CMS at `/admin`

Decap uses **Netlify Identity** + **Git Gateway** for authentication. Without this, `/admin` will load but you can't save changes.

1. In Netlify, open your site → **Site configuration → Identity → Enable Identity**.
2. **Identity → Registration preferences → Invite only** (so only you can edit).
3. **Identity → Services → Git Gateway → Enable Git Gateway**.
4. **Identity → Invite users** → invite your own email. Accept the invite from your inbox; this sets your password.
5. Add the Identity widget to the admin page. Edit `public/admin/index.html` and add this snippet immediately before the closing `</body>` tag:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

Also add this snippet to the bottom of `<body>` in `src/layouts/Base.astro` (only if you want a "Log in" button site-wide — optional):

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

6. Visit `https://YOUR-DOMAIN/admin/` and log in. You'll see all collections.

---

## Day-to-day editing

### Add a peptide or nootropic

- Go to `/admin`
- Open **Peptides** (or **Nootropics**) → **New Peptide**
- Fill in title, summary, body. Save.
- Decap commits the markdown file. Netlify rebuilds in ~30 seconds.

### Add a repository entry

The repository has three building blocks: **Topics**, **Subtopics**, **Links**.

- A **Topic** is a top-level category (e.g. *Humanities*).
- A **Subtopic** lives under a topic (e.g. *Ray Peat*). Optional.
- A **Link** is the actual entry — points to an external URL. Belongs to a Topic, optionally also a Subtopic.

Workflow:

1. If the topic doesn't exist yet, create it under **Repository · Topics**.
2. *(Optional)* Create a **Repository · Subtopic** under that topic.
3. Create a **Repository · Link** and pick its topic (and optional subtopic) from the dropdown.

URL structure:

- `/repository/` — list of topics
- `/repository/[topic]/` — subtopics + direct links under that topic
- `/repository/[topic]/[subtopic]/` — links under that subtopic

---

## Tuning the design

Everything visual lives in two places:

- **`src/styles/tokens.css`** — colors, fonts, spacing, shadows, motion. Change one variable, the whole site shifts. The palette is named so it reads as a story (paper, ink, moss, bark).
- **`src/config/site.ts`** — brand name, tagline, social links, navigation labels.

Want a different palette? Change `--c-paper`, `--c-ink`, `--c-moss`, `--c-bark`. Done.

Want different typography? Change `--f-display` and `--f-body`. The Google Fonts URL in `src/layouts/Base.astro` will need to match.

---

## Local development

```bash
npm install
npm run dev
```

Site runs at `http://localhost:4321`.

To preview the CMS locally without auth (so you can test content edits before deploying):

```bash
# in one terminal:
npm run dev

# in another terminal:
npx decap-server
```

Then visit `http://localhost:4321/admin/#/?local_backend=true`.

---

## What goes where

```
sanguine/
├── astro.config.mjs            # Astro build config
├── netlify.toml                # Netlify deploy config
├── package.json                # dependencies
├── public/
│   ├── admin/
│   │   ├── index.html          # CMS shell
│   │   └── config.yml          # CMS collections
│   ├── favicon.svg
│   ├── images/
│   │   └── uploads/            # CMS-uploaded images land here
│   └── robots.txt
└── src/
    ├── config/
    │   └── site.ts             # ← edit brand info here
    ├── styles/
    │   ├── tokens.css          # ← edit design tokens here
    │   └── global.css
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── PageHeader.astro
    │   └── EntryCard.astro
    ├── layouts/
    │   └── Base.astro          # page shell
    ├── content/
    │   ├── config.ts           # collection schemas
    │   ├── peptides/           # one .md per peptide
    │   ├── nootropics/         # one .md per nootropic
    │   ├── repo-topics/        # one .json per topic
    │   ├── repo-subtopics/     # one .json per subtopic
    │   └── repo-links/         # one .json per link
    └── pages/
        ├── index.astro                   # landing
        ├── repository/
        │   ├── index.astro               # topics list
        │   └── [topic]/
        │       ├── index.astro           # subtopics + direct links
        │       └── [subtopic].astro      # links under subtopic
        └── sanguine/
            ├── index.astro               # Sanguine landing
            ├── peptides/
            │   ├── index.astro
            │   └── [slug].astro
            ├── nootropics/
            │   ├── index.astro
            │   └── [slug].astro
            └── contact.astro
```

---

## License

Personal project. Code is not licensed for reuse without permission.
