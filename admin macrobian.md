# Macrobian — Admin Doc

Operational reference for running **macrobian.science** (Astro + Keystatic Cloud, deployed on Netlify, repo `Hanshir00/macrobian`). Editing is done through the GitHub web editor and/or Keystatic Cloud; every commit triggers a Netlify rebuild (~1 min).

---

## 1 · Embedding PDFs

The site has a built-in PDF viewer component (`Pdf.astro`), exposed as a `{% pdf %}` block in the Keystatic editor. It renders the PDF inline in an `<iframe>` on desktop and always shows an "Open the PDF" fallback link beneath (because many mobile browsers won't render a PDF inline).

### Step 1 — Put the file in `public/files/`

All PDFs live in `public/files/`. Upload via GitHub:

1. Go to the `public/files/` folder in the repo.
2. **Add file → Upload files** → drag your `.pdf` in → Commit.

A file named `paper.pdf` placed there is served at the URL path **`/files/paper.pdf`**.

```
public/
└── files/
    └── paper.pdf      →  served at  /files/paper.pdf
```

### Step 2 — Embed it in a page

**In the Keystatic editor:** open the page, use the **+** (insert) menu, choose the **PDF viewer** block, and fill in:

- **src** — the path, e.g. `/files/paper.pdf` (always starts with `/files/`)
- **title** — optional label for accessibility
- **height** — viewer height in pixels (default `640`)

**In raw Markdoc** (if editing the `.mdoc` directly), the tag is:

```
{% pdf src="/files/paper.pdf" title="My document" height=640 /%}
```

A live working example already exists in `src/content/pages/method.mdoc`:

```
{% pdf src="/files/sample.pdf" title="Sample document" height=420 /%}
```

### Notes & tuning

- **src must begin with `/files/`** — it's a root-relative path, not the GitHub URL. `/files/foo.pdf`, never `https://github.com/...`.
- **height** is the only sizing knob. Taller documents read better at `720`–`900`; for a short one-pager `420` is fine.
- **Mobile behavior is expected:** the inline frame may be blank on phones; the "Open the PDF in a new tab" link beneath handles that. This is by design, not a bug.
- **Filenames:** avoid spaces and quotes. Use `b3-nad-reference.pdf`, not `B3 NAD (final).pdf`.
- The viewer styling (border, accent link color) follows the site theme automatically — no per-PDF styling needed.

---

## 2 · Where things live (quick map)

| What | Where |
|---|---|
| Page content (editable) | `src/content/` (`.mdoc` files) + Keystatic Cloud editor |
| Landing page layout | `src/pages/index.astro` (own `<head>`, own `<style>`) |
| Inner-page layout / header | `src/layouts/Base.astro` |
| Card component (repository tiles) | `src/components/markdoc/Card.astro` |
| PDF viewer component | `src/components/markdoc/Pdf.astro` |
| Markdoc tag registrations | `markdoc.config.mjs` |
| Global styles + table styling | `src/styles/global.css` |
| Site URL / integrations | `astro.config.mjs` |
| Sitemap reference | `public/robots.txt` |
| PDFs and downloadable files | `public/files/` |
| OG / social preview image | `public/og.png` |
| Favicon (sun mark) | `public/favicon.svg` |
| Build/deploy config + headers | `netlify.toml` |

**Important:** The landing page (`index.astro`) has its **own `<head>` and `<style>`** and does **not** use `Base.astro`. Inner pages use `Base.astro`. A change to the header/brand must often be made in **both** files to be consistent site-wide.

---

## 3 · Site cosmetics — recurring edits

### Brand sun marks (header, hero, spine)

The logo is a counter-rotating sun (long rays spin one way, short rays the other) built from inline SVG, colored via `currentColor`, animated by two shared CSS classes:

```css
.sun__long  { animation: sunSpinCW 24s linear infinite; }
.sun__short { animation: sunSpinCCW 32s linear infinite; }
```

Tuning knobs:
- **Spin speed:** the `24s` / `32s` values (lower = faster). Keeping them different creates the counter-rotating shimmer.
- **Color:** the `color:` property on the containing element (`var(--accent)` = rail red, `var(--ink)` = dark, `#fff` = white).
- **Size:** the `width`/`height` on the container (`.brand__sun`, `.spine__dial`, etc.).
- **Center "M" visibility:** the `opacity` on the `<path>` inside the SVG; delete the path for a pure sun.
- **Warm glow** (behind the M): a `::before` pseudo-element with a `radial-gradient` (yellow→orange→red). Intensity = the gradient alpha values; softness = the `blur()`.

### Mobile vs desktop

The red spine and its sun are **hidden below 900px** via `@media (max-width: 900px)` in `index.astro`. Desktop-only spine elements need no extra mobile handling — they're already hidden on phones.

### Cards (repository tiles) font size

In `src/components/markdoc/Card.astro`: `.card__title` and `.card__desc` `font-size`. Bump both together to scale card text.

### Tables (from the Keystatic editor)

Table styling lives in `src/styles/global.css` under `.page table`. If editor tables ever render as free-floating text again, that CSS block is the fix (borders, padding, zebra striping).

### Renaming brand text

User-facing strings (rail label, footer, spine ticker) live in `src/content/landing/index.json` (live content) with defaults in `src/config/landing.ts`. Do **not** change the word "Aperture" inside `Card.astro` / `Gallery.astro` — there it names a CSS hover effect, not visible text.

---

## 4 · Domain, DNS & SSL

### The site is up but the custom domain won't load

Order of checks:

1. **Is it just your network?** Test the Netlify URL `macrobian.netlify.app` — if that works, the site/build is fine and the problem is the domain layer or your network. Test `macrobian.science` over **cellular data** (WiFi off) and in a fresh browser.
2. **Corporate URL filtering.** Some work networks block **newly registered domains** (< ~30 days old). The Netlify URL passes; the custom domain doesn't. This ages out on its own in a couple of weeks, or ask IT to allowlist `macrobian.science`. Not fixable server-side.
3. **SSL certificate.** Netlify → Domain management → HTTPS. If not showing a valid cert, click **Verify DNS configuration**, then **Renew/Provision certificate**. Wait 10–30 min.

### SSL renewal — how often?

Netlify auto-renews the Let's Encrypt cert (~90-day validity) ~30 days before expiry, silently. Manual renewal is essentially never needed in steady state. The one-time manual renew was a new-domain settling hiccup. It can recur only if you **change DNS records, change the primary domain, or add/remove the www variant** — i.e. tied to changes, not time.

### Removing the "www" requirement (make apex primary)

1. Netlify → Domain management → Domains.
2. `Options` (•••) next to `macrobian.science` → **Set as primary domain**. Netlify auto-redirects `www` → apex.
3. **Keep both** domains listed (don't delete `www` — you want it to redirect, not 404).
4. HTTPS section → **Verify DNS configuration** → renew cert if offered.
5. Confirm `astro.config.mjs` `site:` is `https://macrobian.science` (no www) and `robots.txt` sitemap line matches.
6. Keystatic Cloud → project → Project URLs → Primary URL should be `https://macrobian.science` (apex, no www).

### DNS sanity (Netlify-managed)

Because the domain was bought through Netlify, DNS is managed automatically. Healthy state: name servers are Netlify's (`dnsX.pXX.nsone.net`), apex resolves to Netlify load-balancer IPs, www resolves to the same. External check tools: `whatsmydns.net`, `downforeveryoneorjustme.com`.

---

## 5 · Keystatic Cloud

- Storage mode: `cloud` in production, `local` in dev (`keystatic.config.tsx`, top of file).
- `cloud.project` **must exactly match** the dashboard **Project key**, format `team-slug/project-name` (currently `macrobian-macrobian/macrobian`). A partial/wrong key = white page at `/keystatic`.
- After a domain change, the **Primary URL** in Keystatic Cloud → Project URLs must include the live domain (`https://macrobian.science`), or login fails.
- Admin lives at `macrobian.science/keystatic`.

---

## 6 · Deploy / build

- Trigger: any commit to `main` → Netlify auto-builds.
- Build command: `npm run build` (in `netlify.toml`), publishes `dist/`.
- Dependencies (fonts, sitemap, etc.) are installed by Netlify from `package.json` — no local `npm install` needed for the web-editor workflow.
- If a deploy fails: Netlify → Deploys → click the red deploy → read the log. Most common causes: a stray comma in `package.json`, or a mistyped tag/CSS in an `.astro` file.

---

## 7 · Email (custom domain) — `contact@macrobian.science`

**Architecture:** a dedicated brand **Gmail** is the real inbox. **Forward Email** (forwardemail.net) forwards `contact@macrobian.science` into that Gmail. Optionally, Gmail "Send mail as" lets you *reply from* the domain address.

**Free tier reality (verified June 2026):**
- Free = **receive/forward only**, unlimited aliases + catch-all. Replies from Gmail go out as the *Gmail* address unless you add SMTP.
- Sending/replying **as** the domain (no "via forwardemail.net" tag) needs the **Enhanced plan ($3/mo)** — adds authenticated outbound SMTP + 10GB storage.
- DNS changes can take up to 24–48h to propagate (usually much faster).

### Setup order

**Step 1 — Create the brand Gmail first** (a dedicated Macrobian Google account). This is the inbox everything forwards into, and the login/recovery email for YouTube (Brand Account) + TikTok. Use a real phone number for those platforms' verification — not the forwarding address.

**Step 2 — Register at forwardemail.net** → My Account → Domains → **Add domain** `macrobian.science`.

**Step 3 — Add DNS records in Netlify.** Forward Email's dashboard shows the exact records; enter them in **Netlify → Team dashboard → DNS → macrobian.science → Add record**. You'll add:
- **MX records** → `mx1.forwardemail.net` and `mx2.forwardemail.net` (priority values shown in their wizard). Copy exact host/priority from the Forward Email setup screen.
- **SPF (TXT):** `v=spf1 include:spf.forwardemail.net -all` (if you also send via Gmail/other services, add their includes before `-all`).
- **Verification TXT**, plus **DKIM** and optionally **DMARC** TXT records that Forward Email generates — add those too for deliverability.

> Always copy the literal MX/TXT/DKIM values from the Forward Email dashboard at setup time, not from memory — priorities and DKIM keys are domain-specific.

**Step 4 — Create the alias.** My Account → Domains → `macrobian.science` → **Aliases** → add `contact`, recipient = your brand Gmail. (Or set a **catch-all** so every `*@macrobian.science` forwards in.)

**Step 5 — Test.** Email `contact@macrobian.science` from a *different* account (a self-test in Gmail may not appear due to identical Message-ID). Should arrive in seconds.

### Optional — reply *as* the domain (clean sending needs $3/mo Enhanced)

1. Forward Email → Domains → Settings → **Outbound SMTP Configuration** (verifies domain for sending).
2. Aliases → **Generate Password** next to `contact@macrobian.science`. Copy it.
3. Gmail → Settings → **Accounts and Import → Send mail as → Add another email address**.
4. Name = display name (e.g. "Macrobian"); Email = `contact@macrobian.science`; **uncheck** "Treat as an alias".
5. SMTP Server = `smtp.forwardemail.net`, **Port 465**, username = `contact@macrobian.science`, password = generated password, **SSL**.
6. Add account → enter the verification code Gmail emails you → confirm.

> A legacy free Gmail-SMTP method exists but stamps "via forwardemail.net" on outgoing mail. The $3 SMTP method removes that. Until outbound matters, receive-only on free is fine.

**Servers (reference):** IMAP `imap.forwardemail.net:993` (SSL) · SMTP `smtp.forwardemail.net:465` (SSL/TLS).

---

*Living document — update as new admin procedures are established.*
