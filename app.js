const $ = (id) => document.getElementById(id);
const PAGE = 60;
const state = { cat: "hepsi", q: "", shown: PAGE };
const IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const imgUrl = (m, big) => {
  const u = m.i.startsWith("http") ? m.i : IMG + m.i;
  return big ? u.replace(/\/500px-/, "/960px-") : u;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (s) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
const catVar = (c) => `--cc: var(--c-${c})`;
const title = (m) => m.t || m.l;

MUSHROOMS.forEach((m) => { m.s_ = norm(m.t + " " + m.l + " " + m.g); });

function filtered() {
  const q = norm(state.q);
  return MUSHROOMS.filter((m) => (state.cat === "hepsi" || m.c === state.cat) && (!q || m.s_.includes(q)));
}

function cardHTML(m) {
  const C = CATEGORIES[m.c];
  return `<button class="card" data-id="${m.id}" style="${catVar(m.c)}">
    <div class="photo"><span>🍄</span><span class="badge">${C.icon} ${C.label}</span>
      <img src="${imgUrl(m, false)}" alt="${esc(title(m))}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>
    <div class="info"><h3>${esc(title(m))}</h3>${m.t ? `<em>${esc(m.l)}</em>` : `<em>${esc(m.g)} cinsi</em>`}</div>
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
  $("count").textContent = `${list.length} mantar türü listeleniyor`;
  $("grid").innerHTML = list.slice(0, state.shown).map(cardHTML).join("") || `<p class="empty">Sonuç bulunamadı.</p>`;
  bindImages($("grid"));
  $("more").hidden = list.length <= state.shown;
  $("more").textContent = `Daha fazla göster (${list.length - state.shown} tür daha)`;
}

function openModal(id) {
  const m = MUSHROOMS.find((x) => x.id === id); if (!m) return;
  const C = CATEGORIES[m.c];
  const tags = (m.k || []).map((k) => (k === "halusinojen" ? "Psikoaktif" : "Tıbbi kullanım")).join(", ");
  $("modal-body").innerHTML = `
    <div style="${catVar(m.c)}">
      <div class="m-photo"><span>🍄</span><span class="badge">${C.icon} ${C.label}</span>
        <img src="${imgUrl(m, true)}" alt="${esc(title(m))}" referrerpolicy="no-referrer"></div>
      <div class="m-text">
        <h2>${esc(title(m))}</h2><div class="latin">${esc(m.l)}</div>
        <p>${esc(m.d)}</p>
        <dl class="facts glass-inset"><dt>Cins</dt><dd>${esc(m.g)}</dd>
          ${m.h ? `<dt>Yetiştiği yer</dt><dd>${esc(m.h)}</dd>` : ""}${m.s ? `<dt>Mevsim</dt><dd>${esc(m.s)}</dd>` : ""}
          ${tags ? `<dt>Etiketler</dt><dd>${tags}</dd>` : ""}</dl>
        ${m.w ? `<div class="warn"><strong>Dikkat:</strong> ${esc(m.w)}</div>` : ""}
        ${m.x ? `<p class="wiki"><strong>Wikipedia özeti (İngilizce):</strong> ${esc(m.x)}</p>` : ""}
        <div class="m-actions">
          <a class="btn" href="https://en.wikipedia.org/wiki/${encodeURIComponent(m.p)}" target="_blank" rel="noopener">Wikipedia'da aç ↗</a>
          <a class="btn" href="https://tr.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(m.l)}" target="_blank" rel="noopener">Türkçe Wikipedia ↗</a>
        </div>
      </div>
    </div>`;
  bindImages($("modal-body"));
  $("modal").showModal();
  $("modal").scrollTop = 0;
}

// ---- Tema ----
const mq = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (document.documentElement.dataset.theme || (mq.matches ? "dark" : "light")) === "dark";
function paintThemeBtn() { $("theme").textContent = isDark() ? "☀️" : "🌙"; }
$("theme").addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("mk-theme", next); } catch (e) {}
  paintThemeBtn();
});
mq.addEventListener("change", paintThemeBtn);

// ---- Başlat ----
function init() {
  const counts = { hepsi: MUSHROOMS.length };
  MUSHROOMS.forEach((m) => { counts[m.c] = (counts[m.c] || 0) + 1; });
  const tabs = [["hepsi", "Tümü"], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label])];
  $("tabs").innerHTML = tabs.map(([k, l]) =>
    `<button class="btn tab" role="tab" data-cat="${k}" aria-selected="${k === "hepsi"}" style="--dot:${k === "hepsi" ? "var(--accent)" : `var(--c-${k})`}">
      <span class="dot"></span>${l}<span class="n">${counts[k] || 0}</span></button>`).join("");
  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab"); if (!b) return;
    state.cat = b.dataset.cat;
    document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t === b));
    render();
  });
  let t;
  $("search").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 120); });
  $("grid").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openModal(c.dataset.id); });
  $("more").addEventListener("click", () => { state.shown += PAGE; render(false); });
  $("close").addEventListener("click", () => $("modal").close());
  $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) $("modal").close(); });
  paintThemeBtn();
  render();
}
init();
