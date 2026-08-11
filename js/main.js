// Lafayette on the Square — shared site behavior

// Menu category pill nav: highlight the active section on scroll.
// Exposed on window because menu.html builds its nav links dynamically
// (from content/menu.json) and calls this itself once they exist.
window.setupMenuNavScrollSpy = function setupMenuNavScrollSpy() {
  const menuNav = document.querySelector(".menu-nav");
  if (!menuNav) return;
  const links = Array.from(menuNav.querySelectorAll("a"));
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  // Solid header once scrolled past the hero (only on pages where header starts transparent)
  if (header && !header.classList.contains("static")) {
    const setSolid = () => {
      if (window.scrollY > 60) header.classList.add("is-solid");
      else header.classList.remove("is-solid");
    };
    setSolid();
    window.addEventListener("scroll", setSolid, { passive: true });
  }

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Gallery lightbox
  const galleryLinks = document.querySelectorAll(".gallery-grid a");
  const lightbox = document.querySelector(".lightbox");
  if (galleryLinks.length && lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    const open = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
    };

    galleryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const img = link.querySelector("img");
        open(link.getAttribute("href"), img ? img.alt : "");
      });
    });
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
    });
  }
});
