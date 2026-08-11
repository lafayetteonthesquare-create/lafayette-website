# Lafayette on the Square — Website Owner's Guide

This walks through putting the site online at your own domain, and how to
edit it yourself afterward (menu, hours, prices, the closure banner) without
touching any code.

Two free accounts are involved: **GitHub** (stores the website's files) and
**Netlify** (serves the site to visitors, and powers the login for editing).
Create both under the restaurant's own email so you're never dependent on
anyone else to keep the site running.

---

## Part 1 — Put the code on GitHub

1. Go to [github.com](https://github.com) and sign up (free) — use
   `lafayetteonthesquare@gmail.com`.
2. Once logged in, click the **+** in the top right → **New repository**.
   - Name it something like `lafayette-website`.
   - Leave it **Public** or **Private**, either is fine.
   - Do **not** check "Add a README" — this project already has files ready
     to push.
   - Click **Create repository**.
3. GitHub will show you a page with some commands under
   **"…or push an existing repository from the command line."** It'll look
   like this (yours will have your actual repo URL):
   ```
   git remote add origin https://github.com/YOUR-USERNAME/lafayette-website.git
   git branch -M main
   git push -u origin main
   ```
4. Open a terminal in this project folder (`restaurant-website/`) and run
   those three commands. GitHub will ask you to sign in the first time —
   follow its prompts (it'll open a browser window to confirm).

Once that finishes, refresh the GitHub page and you should see all the
website's files there.

---

## Part 2 — Host it on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (free) — again use
   `lafayetteonthesquare@gmail.com`. Choose **"Sign up with GitHub"** if
   offered; it makes the next step easier.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify if asked, then pick the
   `lafayette-website` repository you just created.
4. Leave the build settings blank/default (this site has no build step) and
   click **Deploy**.
5. In a minute or two, Netlify gives you a random URL like
   `random-name-123.netlify.app` — open it and confirm the site loads
   correctly.

---

## Part 3 — Point your domain at it

Wherever you originally bought your domain (GoDaddy, Namecheap, Google
Domains, etc.) — you keep it there. You're just telling it to send visitors
to Netlify.

1. In Netlify: **Site settings → Domain management → Add a domain** and
   type in your domain.
2. Netlify will show you DNS records to add (usually one **A record** and
   one **CNAME** for `www`). Alternatively, Netlify can offer to be your
   domain's nameservers, which is simpler if you're comfortable letting it
   manage DNS entirely — either approach works.
3. Log into your domain registrar's dashboard, find **DNS settings**, and
   add the records Netlify showed you.
4. DNS changes can take anywhere from a few minutes to a few hours to take
   effect. Netlify will show a green checkmark once it sees the domain
   pointing correctly, and will automatically issue a free SSL certificate
   (the padlock in the browser) once that happens.

---

## Part 4 — Turn on the content editor (Decap CMS)

This is what lets you log in at `yourdomain.com/admin` and edit the menu,
hours, and closure banner from a normal web page — no code.

1. In Netlify: **Site configuration → Identity → Enable Identity.**
2. Scroll to **Registration preferences** and set it to **Invite only**
   (so random people can't sign themselves up).
3. Scroll to **Services → Git Gateway → Enable Git Gateway.** This is what
   lets the CMS save changes back to GitHub on your behalf.
4. Go to the **Identity** tab (top nav) → **Invite users** → enter your own
   email (and Matt's, or anyone else who should be able to edit the site).
5. Check that inbox — you'll get an email with a link to set a password.
   Clicking it will land you on the live site and log you in automatically.

From then on, editing the site is just:

1. Go to `yourdomain.com/admin`
2. Log in with the email/password from step 4
3. Edit menu items, prices, hours, or the closure banner
4. Click **Publish** — the live site updates automatically within a minute
   or two (Netlify rebuilds and redeploys it for you)

---

## What's editable through `/admin`

- **Contact & Hours** — address, phone, email, weekly hours, Facebook link,
  reservation note, the Google Maps embed, and the **closure banner**
  (leave that field blank to hide the banner entirely).
- **Menu** — every section, sub-heading, dish, price, description, and
  add-on line. You can add, remove, or reorder items and whole sections.

Anything *not* in that list (the About page's story, the home page's hero
text, the Private Dining section's wording) is regular HTML — ask me (or
any developer) to change that kind of thing, since it's prose rather than
data that changes often. If down the line you want that editable too, it's
a small addition to the CMS config.

---

## Testing locally before any of this is set up

If you ever want to preview changes on your own computer first: this site
uses `fetch()` to load its content, which browsers block when you just
double-click an HTML file. Instead, open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000` in your browser.
