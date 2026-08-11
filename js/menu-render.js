// Renders menu.html entirely from content/menu.json so the restaurant can
// edit the menu through the CMS without touching HTML.

function escHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function renderMenuItem(item) {
  const desc = item.desc ? `<p class="desc">${escHtml(item.desc)}</p>` : "";
  const addons = item.addons ? `<p class="addons">${escHtml(item.addons)}</p>` : "";
  return `
    <div class="menu-item">
      <div class="menu-item-head"><span class="name">${escHtml(item.name)}</span><span class="leader"></span><span class="price">${escHtml(item.price)}</span></div>
      ${desc}
      ${addons}
    </div>`;
}

function renderGroup(group, single) {
  const label = group.label
    ? `<h3 class="eyebrow" style="text-align:center; margin: 2.5rem 0 1.25rem;">${escHtml(group.label)}</h3>`
    : "";
  const items = (group.items || []).map(renderMenuItem).join("");
  return `${label}<div class="menu-list${single ? " single" : ""}">${items}</div>`;
}

function renderCategory(cat) {
  const note = cat.note ? `<p class="menu-note">${escHtml(cat.note)}</p>` : "";
  const groups = (cat.groups || []).map((g) => renderGroup(g, cat.single)).join("");
  return `
    <section class="menu-category" id="${escHtml(cat.id)}">
      <div class="menu-category-head">
        <div class="divider-mark center"><img src="assets/brand/fleur-de-lis-brass.png?v=2" alt=""></div>
        <h2 class="h-md" style="margin-top:0.75rem;">${escHtml(cat.name)}</h2>
        ${note}
      </div>
      ${groups}
    </section>`;
}

const DRINKS_EXTRA = `
  <div class="bubble-callout" style="justify-content:center; margin-top:3rem;">
    <img src="assets/brand/cur-non-bubble.png" alt="A hand-drawn speech bubble reading Cur Non!?">
  </div>
  <h3 class="eyebrow" style="text-align:center; margin: 3rem 0 1.25rem;">Beverages</h3>
  <p class="menu-note" style="max-width:60ch;">Tea &middot; Dr Pepper &middot; Coffee &middot; Starry &middot; Pepsi &middot; Mountain Dew &middot; Diet Pepsi &middot; Lemonade &middot; Diet Dr Pepper</p>
  <p class="menu-note">Add peach, raspberry, blackberry, or lavender syrup — $0.50</p>
`;

async function renderMenu() {
  const navMount = document.getElementById("menu-nav");
  const catMount = document.getElementById("menu-categories");
  if (!catMount) return;

  let data;
  try {
    const res = await fetch("content/menu.json");
    if (!res.ok) throw new Error("bad response");
    data = await res.json();
  } catch (e) {
    catMount.innerHTML = `<p style="text-align:center; padding:4rem 1rem; font-style:italic; opacity:.6;">The menu couldn't be loaded right now — please call us or check our Facebook page. (If you're previewing this site locally by double-clicking the HTML file, run a local server instead — browsers block file:// fetches.)</p>`;
    return;
  }

  const categories = data.categories || [];

  if (navMount) {
    navMount.innerHTML = categories
      .map((c) => `<a href="#${escHtml(c.id)}">${escHtml(c.navLabel || c.name)}</a>`)
      .join("");
  }

  catMount.innerHTML = categories.map(renderCategory).join("");

  const drinksSection = document.getElementById("drinks");
  if (drinksSection) {
    drinksSection.insertAdjacentHTML("beforeend", DRINKS_EXTRA);
  }

  if (window.setupMenuNavScrollSpy) window.setupMenuNavScrollSpy();
}

document.addEventListener("DOMContentLoaded", renderMenu);
