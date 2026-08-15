# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for Lafayette on the Square, a restaurant. Plain HTML/CSS/JS — no framework, no build step, no package.json, no test suite.

## Running it locally

Because content is loaded via `fetch()`, pages must be served over HTTP (not opened as `file://`, which browsers block):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

To test the CMS locally too (`/admin`), also run `npx decap-server` in a separate terminal — Decap CMS auto-detects it when the site is served from localhost and proxies content writes to it instead of git-gateway.

There is no lint/build/test command — changes are verified by loading the pages in a browser.

## Architecture

**Pages are static HTML** (`index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`), but two kinds of content are injected at runtime by JS rather than hardcoded:

- **`js/site-footer.js`** fetches `content/contact.json` on every page and renders: the shared footer (`#site-footer-placeholder`), the top-of-page closure/announcement banner (`#closure-banner-mount`, hidden if `closureNote` is blank, dismissal tracked per-note in `sessionStorage`), and — only on `contact.html` — the address/phone/email/hours/map fields (matched by element IDs like `#contact-address`, `#contact-map`).
- **`js/menu-render.js`** fetches `content/menu.json` and renders the entire menu page (nav pills + category sections + items) into `#menu-nav` / `#menu-categories` on `menu.html`. `js/main.js` then wires up the scroll-spy nav highlighting via `window.setupMenuNavScrollSpy()`, which `menu-render.js` calls once the DOM it needs exists.
- **`js/main.js`** also handles shared chrome unrelated to content: header solidify-on-scroll, mobile nav toggle, and the gallery lightbox — all pure DOM behavior, no fetching.

**Content editing flow (Decap CMS, `admin/config.yml`):** the `/admin` page lets the restaurant owner edit `content/contact.json` and `content/menu.json` through a form UI, backed by Netlify's `git-gateway` on the `main` branch — so a CMS save is really a git commit to `main`, then Netlify auto-redeploys. When editing the shape of either JSON file, update `admin/config.yml`'s matching field list too, or the CMS form will drift from what the JSON/render code actually expects.

**What's data vs. what's markup:** menu items, prices, section structure, contact info, hours, and the closure banner are all CMS-editable JSON. Everything else (hero copy, About page story, Private Dining section, page layout/structure itself) is plain HTML and requires a code change — there's no CMS field for it.

Brand assets (logo, fleur-de-lis dividers, medallions) live in `assets/brand/`; dish photography in `assets/images/` (each shot has `-md` and `-lg` variants for responsive `srcset`).

## Deployment

Hosted on Netlify, deployed from the `main` branch, no build command configured (static passthrough). See `OWNER-GUIDE.md` for the full non-technical walkthrough (GitHub → Netlify → custom domain → Decap CMS Identity/Git Gateway setup) if you need to understand how the owner-facing pieces are wired up.
