// Shared site footer — injected on every page. Contact details (address,
// phone, hours, etc.) live in content/contact.json so they can be edited
// through the CMS without touching HTML. This fetches that file once and
// renders both the footer and (if present) the Contact page fields.

async function loadContact() {
  try {
    const res = await fetch("content/contact.json");
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (e) {
    // Local file:// preview or a network hiccup — fall back to empty so
    // every field below shows its honest "coming soon" state instead of
    // silently breaking.
    return {};
  }
}

function renderFooter(contact) {
  const target = document.getElementById("site-footer-placeholder");
  if (!target) return;

  const year = new Date().getFullYear();

  const addressHtml = contact.address
    ? `<p>${contact.address}</p>`
    : `<p style="opacity:.6; font-style:italic;">Address coming soon</p>`;

  const phoneHtml = contact.phone
    ? `<p><a href="tel:${contact.phone.replace(/[^\d+]/g, "")}">${contact.phone}</a></p>`
    : `<p style="opacity:.6; font-style:italic;">Phone coming soon</p>`;

  const emailHtml = contact.email
    ? `<p><a href="mailto:${contact.email}">${contact.email}</a></p>`
    : "";

  const hoursHtml = contact.hours && contact.hours.length
    ? `<table class="hours-table">${contact.hours
        .map((h) => `<tr><td>${h.days}</td><td>${h.time}</td></tr>`)
        .join("")}</table>`
    : `<p style="opacity:.6; font-style:italic;">Hours coming soon</p>`;

  const socialLinks = [
    contact.facebook
      ? `<a href="${contact.facebook}" aria-label="Lafayette on Facebook" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08z"/></svg></a>`
      : "",
    contact.instagram
      ? `<a href="${contact.instagram}" aria-label="Lafayette on Instagram" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>`
      : "",
  ].join("");

  target.innerHTML = `
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <a class="brand-mark" href="index.html" style="margin-bottom:1rem; display:inline-flex;">
            <img src="assets/brand/logo-real.png" alt="" style="width:30px;height:30px;">
            <span class="wordmark">Lafayette<small>On&nbsp;The&nbsp;Square</small></span>
          </a>
          <p style="max-width:34ch; margin-top:.75rem;">An elevated Southern &amp; Creole kitchen and bar. &ldquo;Cur Non?&rdquo;</p>
        </div>
        <div>
          <h4>Visit</h4>
          ${addressHtml}
          ${phoneHtml}
          ${emailHtml}
        </div>
        <div>
          <h4>Hours</h4>
          ${hoursHtml}
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} Lafayette on the Square. All rights reserved.</p>
        <div class="footer-social">${socialLinks}</div>
      </div>
    </div>
  `;
}

function renderContactPage(contact) {
  const addressEl = document.getElementById("contact-address");
  if (!addressEl) return; // not the contact page

  addressEl.innerHTML = contact.address
    ? contact.address.replace(/, /g, ",<br>")
    : `<span style="opacity:.6; font-style:italic;">Address coming soon</span>`;

  const phoneEl = document.getElementById("contact-phone");
  phoneEl.innerHTML = contact.phone
    ? `<a href="tel:${contact.phone.replace(/[^\d+]/g, "")}">${contact.phone}</a>`
    : `<span style="opacity:.6; font-style:italic;">Phone coming soon</span>`;

  const emailEl = document.getElementById("contact-email");
  if (emailEl) {
    emailEl.innerHTML = contact.email
      ? `<a href="mailto:${contact.email}">${contact.email}</a>`
      : `<span style="opacity:.6; font-style:italic;">Email coming soon</span>`;
  }

  const hoursEl = document.getElementById("contact-hours");
  hoursEl.innerHTML = contact.hours && contact.hours.length
    ? contact.hours.map((h) => `<tr><td>${h.days}</td><td>${h.time}</td></tr>`).join("")
    : `<tr><td colspan="2" style="opacity:.6; font-style:italic;">Hours coming soon</td></tr>`;

  const resEl = document.getElementById("contact-reservation");
  if (resEl) {
    resEl.innerHTML = contact.reservationNote
      ? contact.reservationNote
      : `<span style="opacity:.6; font-style:italic;">Reservation details coming soon</span>`;
  }

  const mapEl = document.getElementById("contact-map");
  if (mapEl) {
    if (contact.mapEmbedSrc) {
      mapEl.outerHTML = `<iframe class="map-frame" id="contact-map" src="${contact.mapEmbedSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map to Lafayette on the Square"></iframe>`;
    } else {
      mapEl.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-style:italic; opacity:.6; text-align:center; padding:1rem;">Map will appear here once we have an address</div>`;
    }
  }
}

function renderClosureBanner(contact) {
  const mount = document.getElementById("closure-banner-mount");
  if (!mount) return;
  const note = (contact.closureNote || "").trim();
  if (!note || sessionStorage.getItem("closureBannerDismissed") === note) {
    mount.innerHTML = "";
    return;
  }
  mount.innerHTML = `
    <div class="closure-banner">
      <div class="wrap">
        <p>${note}</p>
        <button class="dismiss" aria-label="Dismiss">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>
  `;
  mount.querySelector(".dismiss").addEventListener("click", () => {
    sessionStorage.setItem("closureBannerDismissed", note);
    mount.innerHTML = "";
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const contact = await loadContact();
  renderClosureBanner(contact);
  renderFooter(contact);
  renderContactPage(contact);
});
