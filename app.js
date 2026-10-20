const $ = (id) => document.getElementById(id);
const PAGE = 60;
const IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
};
const state = {
  cat: "hepsi", q: "", letter: "", shown: PAGE,
  lang: store.get("mk-lang") || ((navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en"),
};
const T = () => I18N[state.lang];
const isTr = () => state.lang === "tr";

const imgUrl = (m, big) => {
  const u = m.i.startsWith("http") ? m.i : IMG + m.i;
  return big ? u.replace(/\/500px-/, "/960px-") : u;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (s) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
const catVar = (c) => `--cc: var(--c-${c})`;

// Dile göre alanlar (İngilizce alan yoksa Latince / Türkçe'ye düşer)
const title = (m) => (isTr() ? m.t : m.n) || m.l;
// Yerel (Türkçe/İngilizce) adı olmayan türlerde başlık Latince adıdır: italik gösterilir
const isLatinTitle = (m) => !(isTr() ? m.t : m.n);
const titleHTML = (m) => (isLatinTitle(m) ? `<i class="latin-name">${esc(m.l)}</i>` : esc(title(m)));
const subtitle = (m) => ((isTr() ? m.t : m.n) ? m.l : T().genus_sub(m.g));
const desc = (m) => (isTr() ? m.d : m.de) || m.d;
const habitat = (m) => (isTr() ? m.h : m.he);
const season = (m) => (isTr() ? m.s : m.se);
const warning = (m) => (isTr() ? m.w : m.we);

MUSHROOMS.forEach((m) => { m.s_ = norm([m.t, m.n, m.l, m.g].filter(Boolean).join(" ")); });

const CAT_ORDER = ["yenilebilir", "sartli", "zehirli", "olumcul", "halusinojen"];
const localName = (m) => (isTr() ? m.t : m.n) || "";
// Harf: yerel (Türkçe/İngilizce) adın ilk harfi; Latince adı olmayanlar harf filtresine girmez
function letterOf(m) {
  const n = localName(m).trim(); if (!n) return "";
  const c = n[0].toLocaleUpperCase(isTr() ? "tr" : "en");
  return /\p{L}/u.test(c) ? c : "";
}
function filtered(ignoreLetter = false) {
  const q = norm(state.q);
  const list = MUSHROOMS.filter((m) => (state.cat === "hepsi" || m.c === state.cat) && (!q || m.s_.includes(q)) &&
    (ignoreLetter || !state.letter || (state.letter === "#" ? !localName(m) : letterOf(m) === state.letter)));
  // Her kategoride alfabetik sıra (görünen ada göre, Türkçe harf sırasıyla)
  const col = new Intl.Collator(isTr() ? "tr" : "en", { sensitivity: "base" });
  return list.sort((x, y) => CAT_ORDER.indexOf(x.c) - CAT_ORDER.indexOf(y.c) || col.compare(title(x), title(y)));
}

function cardHTML(m) {
  const icon = CATEGORIES[m.c].icon;
  return `<button class="card" data-id="${m.id}" style="${catVar(m.c)}">
    <div class="photo"><span>🍄</span><span class="badge">${icon} ${T().cat[m.c]}</span>
      <img src="${imgUrl(m, false)}" alt="${esc(title(m))}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>
    <div class="info"><h3>${titleHTML(m)}</h3><em>${isLatinTitle(m) ? esc(T().genus_sub(m.g)) : esc(subtitle(m))}</em></div>
  </button>`;
}

function bindImages(root) {
  root.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth) img.classList.add("ok");
    else {
      img.onload = () => img.classList.add("ok");
      // Wikimedia yoğunlukta hata verebilir: 2 kez gecikmeli yeniden dene, olmazsa 🍄 kalsın
      img.onerror = () => {
        const n = +(img.dataset.retry || 0);
        if (n >= 2) return img.remove();
        img.dataset.retry = n + 1;
        const src = img.src.split("#")[0];
        setTimeout(() => { img.src = src + "#r" + (n + 1); }, 1500 * (n + 1));
      };
    }
  });
}

function render(reset = true) {
  const list = filtered();
  if (reset) state.shown = PAGE;
  $("count").textContent = T().count(list.length);
  let html = "", prev = null;
  for (const m of list.slice(0, state.shown)) {
    if (state.cat === "hepsi" && m.c !== prev) { html += `<h2 class="cat-head" style="${catVar(m.c)}"><span class="dot"></span>${T().cat[m.c]}</h2>`; prev = m.c; }
    html += cardHTML(m);
  }
  $("grid").innerHTML = html || `<p class="empty">${T().empty}</p>`;
  bindImages($("grid"));
  $("more").hidden = list.length <= state.shown;
  $("more").textContent = T().more(list.length - state.shown);
  paintLetters();
}

// ---- Alfabetik katalog ----
function buildLetters() {
  const col = new Intl.Collator(isTr() ? "tr" : "en");
  const base = MUSHROOMS.filter((m) => state.cat === "hepsi" || m.c === state.cat);
  const counts = {}; let latin = 0;
  base.forEach((m) => { const l = letterOf(m); if (l) counts[l] = (counts[l] || 0) + 1; else latin++; });
  const all = [...new Set(MUSHROOMS.map(letterOf).filter(Boolean))].sort(col.compare);
  $("letters").innerHTML =
    `<button class="btn chip" data-letter="" aria-pressed="false">${T().az_all}</button>` +
    all.map((l) => `<button class="btn chip" data-letter="${l}" aria-pressed="false" ${counts[l] ? "" : "disabled"} title="${counts[l] || 0}">${l}</button>`).join("") +
    `<button class="btn chip latin" data-letter="#" aria-pressed="false" ${latin ? "" : "disabled"} title="${latin}">${T().az_latin}</button>`;
  paintLetters();
}
function paintLetters() {
  document.querySelectorAll("#letters .chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.letter === state.letter));
}

let openId = null;
function openModal(id) {
  const m = MUSHROOMS.find((x) => x.id === id); if (!m) return;
  openId = id;
  const t = T();
  const tags = (m.k || []).map((k) => t.tag[k]).join(", ");
  const h = habitat(m), s = season(m), w = warning(m);
  $("modal-body").innerHTML = `
    <div style="${catVar(m.c)}">
      <div class="m-photo"><span>🍄</span><span class="badge">${CATEGORIES[m.c].icon} ${t.cat[m.c]}</span>
        <img src="${imgUrl(m, true)}" alt="${esc(title(m))}" referrerpolicy="no-referrer"></div>
      <div class="m-text">
        <h2>${titleHTML(m)}</h2>${isLatinTitle(m) ? "" : `<div class="latin">${esc(m.l)}</div>`}
        <p>${esc(desc(m))}</p>
        <dl class="facts glass-inset"><dt>${t.genus}</dt><dd>${esc(m.g)}</dd>
          ${h ? `<dt>${t.habitat}</dt><dd>${esc(h)}${m.hg ? `<span class="auto">${t.hab_note}</span>` : ""}</dd>` : ""}${s ? `<dt>${t.season}</dt><dd>${esc(s)}</dd>` : ""}
          ${tags ? `<dt>${t.tags}</dt><dd>${tags}</dd>` : ""}</dl>
        ${w ? `<div class="warn"><strong>${t.warn}</strong> ${esc(w)}</div>` : ""}
        ${m.src && isTr() ? `<p class="wiki">${t.src}</p>` : ""}
        ${m.ms ? `<p class="wiki">${t.ms_note}</p>` : ""}
        ${m.x ? `<p class="wiki"><strong>${t.wiki_sum}</strong> ${esc(m.x)}</p>` : ""}
        <div class="m-actions">
          <a class="btn" href="https://en.wikipedia.org/wiki/${encodeURIComponent(m.p)}" target="_blank" rel="noopener">${t.wiki_en}</a>
          ${m.ms ? `<a class="btn" href="https://mantarliyasam.com/${m.ms}" target="_blank" rel="noopener">${t.ms_link}</a>` : ""}
          ${isTr() ? `<a class="btn" href="https://tr.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(m.l)}" target="_blank" rel="noopener">${t.wiki_tr}</a>` : ""}
        </div>
      </div>
    </div>`;
  bindImages($("modal-body"));
  if (!$("modal").open) $("modal").showModal();
  $("modal").scrollTop = 0;
}

// ---- Tema ----
const mq = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (document.documentElement.dataset.theme || (mq.matches ? "dark" : "light")) === "dark";
function paintThemeBtn() { $("theme").textContent = isDark() ? "☀️" : "🌙"; }
$("theme").addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  store.set("mk-theme", next);
  paintThemeBtn();
});
mq.addEventListener("change", paintThemeBtn);

// ---- Dil ----
function applyLang() {
  const t = T();
  document.documentElement.lang = state.lang;
  document.title = t.title;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t[el.dataset.i18n]; });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t[el.dataset.i18nHtml]; });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t[el.dataset.i18nPh]; });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t[el.dataset.i18nAria]); });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t[el.dataset.i18nTitle]; });
  $("lang").textContent = isTr() ? "EN" : "TR";
  buildTabs();
  state.letter = "";
  buildLetters();
}
function buildTabs() {
  const counts = { hepsi: MUSHROOMS.length };
  MUSHROOMS.forEach((m) => { counts[m.c] = (counts[m.c] || 0) + 1; });
  const tabs = [["hepsi", T().all], ...Object.keys(CATEGORIES).map((k) => [k, T().cat[k]])];
  $("tabs").innerHTML = tabs.map(([k, l]) =>
    `<button class="btn tab" role="tab" data-cat="${k}" aria-selected="${k === state.cat}" style="--dot:${k === "hepsi" ? "var(--accent)" : `var(--c-${k})`}">
      <span class="dot"></span>${l}<span class="n">${counts[k] || 0}</span></button>`).join("");
}
$("lang").addEventListener("click", () => {
  state.lang = isTr() ? "en" : "tr";
  store.set("mk-lang", state.lang);
  applyLang();
  render(false);
  if ($("modal").open && openId) openModal(openId);
});

// ---- Başlat ----
function init() {
  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab"); if (!b) return;
    state.cat = b.dataset.cat;
    document.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", x === b));
    if (state.letter && state.letter !== "#" && !filtered(true).some((m) => letterOf(m) === state.letter)) state.letter = "";
    buildLetters(); render();
  });
  let timer;
  $("search").addEventListener("input", (e) => { clearTimeout(timer); timer = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 120); });
  $("grid").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openModal(c.dataset.id); });
  $("letters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b || b.disabled) return;
    state.letter = b.dataset.letter === state.letter ? "" : b.dataset.letter;
    render();
  });
  $("more").addEventListener("click", () => { state.shown += PAGE; render(false); });
  $("close").addEventListener("click", () => $("modal").close());
  $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) $("modal").close(); });
  paintThemeBtn();
  applyLang();
  render();
}
init();
