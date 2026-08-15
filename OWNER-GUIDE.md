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

## Part 3 — Point your already-purchased domain at it

Wherever you originally bought the domain (GoDaddy, Namecheap, Google
Domains, etc.) — you keep it there and keep paying that renewal as normal.
You're not moving or re-buying anything; you're just telling it to send
visitors to Netlify.

### Step 1: Add the domain in Netlify

1. Open your site in Netlify, then in the left sidebar click
   **Domain management**.
2. Click **Add a domain**.
3. It'll ask if you've already registered the domain — choose **"Add a
   domain you already own"** (not "Buy a new domain") and type it in
   (e.g. `lafayetteonthesquare.com`).

### Step 2: Choose how DNS is managed

Netlify will ask you to pick one of two paths. Either works fine for a site
this size — pick whichever sounds more comfortable:

**Option A — Let Netlify manage DNS (simplest, recommended)**

Netlify will show you **4 nameserver values** (something like
`dns1.p0x.nsone.net`, `dns2.p0x.nsone.net`, etc. — copy the *exact* ones
Netlify shows you, they're unique to your account).

1. Log into wherever you bought the domain, and find its **nameserver /
   DNS management settings**:
   - **GoDaddy:** My Products → Domain → DNS → Nameservers → Change → Enter my own nameservers
   - **Namecheap:** Domain List → Manage → Nameservers → Custom DNS
   - **Google Domains / Squarespace Domains:** DNS → Name servers → Use custom name servers
2. Replace whatever nameservers are listed with the 4 Netlify gave you.
3. Save. This can take a few hours (sometimes up to a day) to fully take
   effect. Once it does, Netlify manages everything automatically —
   including issuing the free SSL certificate (the padlock in the browser).

**Option B — Keep DNS at your current registrar, just add records**

Better if that registrar is already handling other things for this domain
(like email) that you don't want to disturb.

1. Netlify will show you the specific DNS records to add — typically an
   **A record** (or ALIAS/ANAME) for the bare domain and a **CNAME** for
   `www`. Use the *exact* values shown on your screen, not values from
   any other guide — they can change.
2. Log into your registrar, find **DNS settings** (sometimes called "DNS
   Management" or "Advanced DNS"), and add each record exactly as shown.
3. Save. Same as above — allow a few hours for it to propagate, and
   Netlify will show a green checkmark plus issue SSL automatically once
   it sees the domain pointing correctly.

### Step 3: Confirm it worked

Visit your domain in a browser (may take a bit after DNS propagates) and
confirm the site loads with `https://` and a padlock icon. If Netlify's
Domain management page still shows a warning after a day, double-check the
exact values against what's currently in your registrar's DNS settings —
a typo there is the most common snag.

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
