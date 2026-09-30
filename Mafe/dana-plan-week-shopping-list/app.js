/* Larder: Dana plans next week and takes the Shopping List to the store.
   Static prototype for DCCD-1. Mocked data, no persistence. */

// ---------- Data: Dana's Box (a slice of it) ----------
const AISLES = [
  { key: "mine", name: "Added by you" },
  { key: "produce", name: "Produce" },
  { key: "meat", name: "Meat & fish" },
  { key: "dairy", name: "Dairy & eggs" },
  { key: "bakery", name: "Bread & tortillas" },
  { key: "frozen", name: "Frozen" },
  { key: "dry", name: "Tins & dry goods" },
  { key: "cupboard", name: "Check the cupboard first", note: "Usually on hand. Tick off what you already have." },
];

// qty: number, unit: "" for counts. staple → cupboard group (Q9 assumption, see DECISIONS.md)
const RECIPES = [
  { id: "fajitas", title: "Sheet-pan chicken fajitas", short: "Fajitas", mins: 35, serves: 4, lastMade: 6, rotation: true, cols: ["weeknight", "kids"],
    ing: [["chicken thighs", 1.5, "lb", "meat"], ["bell peppers", 3, "", "produce"], ["yellow onion", 1, "", "produce"], ["flour tortillas", 8, "", "bakery"], ["limes", 1, "", "produce"], ["sour cream", 1, "cup", "dairy"], ["chili powder", 2, "tbsp", "cupboard"], ["olive oil", 2, "tbsp", "cupboard"]] },
  { id: "chili", title: "Turkey chili", short: "Chili", mins: 45, serves: 6, lastMade: 13, rotation: true, cols: ["weeknight"],
    ing: [["ground turkey", 1, "lb", "meat"], ["yellow onion", 1, "", "produce"], ["kidney beans", 2, "can", "dry"], ["crushed tomatoes (28 oz)", 1, "can", "dry"], ["cheddar", 1, "cup", "dairy"], ["chili powder", 2, "tbsp", "cupboard"], ["ground cumin", 1, "tsp", "cupboard"]] },
  { id: "orzo", title: "Lemony orzo with peas", short: "Orzo", mins: 25, serves: 4, lastMade: 9, rotation: true, cols: ["weeknight", "kids"],
    ing: [["orzo", 12, "oz", "dry"], ["frozen peas", 2, "cup", "frozen"], ["lemons", 2, "", "produce"], ["parmesan", 50, "g", "dairy"], ["butter", 2, "tbsp", "dairy"], ["garlic", 2, "clove", "produce"]] },
  { id: "salmon", title: "Salmon rice bowls", short: "Salmon bowls", mins: 30, serves: 4, lastMade: 15, rotation: true, cols: ["weeknight"],
    ing: [["salmon fillets", 4, "", "meat"], ["jasmine rice", 2, "cup", "dry"], ["cucumber", 1, "", "produce"], ["avocados", 2, "", "produce"], ["soy sauce", 3, "tbsp", "cupboard"], ["sesame seeds", 1, "tbsp", "cupboard"]] },
  { id: "pizza", title: "Friday pizza night", short: "Pizza", mins: 40, serves: 4, lastMade: 7, rotation: true, cols: ["kids"],
    ing: [["pizza dough", 2, "ball", "bakery"], ["mozzarella", 8, "oz", "dairy"], ["passata", 1, "cup", "dry"], ["basil", 1, "bunch", "produce"], ["pepperoni", 3, "oz", "meat"]] },
  { id: "beef", title: "Beef & broccoli", short: "Beef & broccoli", mins: 30, serves: 4, lastMade: 22, rotation: true, cols: ["weeknight"],
    ing: [["flank steak", 1, "lb", "meat"], ["broccoli", 2, "head", "produce"], ["garlic", 3, "clove", "produce"], ["ginger", 1, "thumb", "produce"], ["jasmine rice", 2, "cup", "dry"], ["soy sauce", 0.25, "cup", "cupboard"]] },
  { id: "tacos", title: "Black bean tacos", short: "Tacos", mins: 20, serves: 4, lastMade: 10, rotation: true, cols: ["weeknight", "kids"], source: "Imported from a UK site",
    ing: [["black beans", 2, "can", "dry"], ["corn tortillas", 12, "", "bakery"], ["avocados", 1, "", "produce"], ["limes", 2, "", "produce"], ["sour cream", 150, "g", "dairy"], ["red onion", 1, "", "produce"]] },
  { id: "soup", title: "Tomato soup & grilled cheese", short: "Soup", mins: 25, serves: 4, lastMade: 28, rotation: true, cols: ["kids"],
    ing: [["crushed tomatoes (28 oz)", 1, "can", "dry"], ["yellow onion", 1, "", "produce"], ["sandwich bread", 1, "loaf", "bakery"], ["cheddar", 8, "oz", "dairy"], ["butter", 3, "tbsp", "dairy"], ["milk", 1, "cup", "dairy"]] },
  // Not in the rotation, reachable through search
  { id: "lasagna", title: "Mom's lasagna", short: "Lasagna", mins: 90, serves: 8, lastMade: 61, cols: [],
    ing: [["lasagna noodles", 1, "box", "dry"], ["ricotta", 15, "oz", "dairy"], ["mozzarella", 16, "oz", "dairy"], ["ground beef", 1, "lb", "meat"], ["passata", 3, "cup", "dry"]] },
  { id: "shakshuka", title: "Shakshuka", short: "Shakshuka", mins: 30, serves: 4, lastMade: 40, cols: ["weeknight"],
    ing: [["eggs", 6, "", "dairy"], ["crushed tomatoes (28 oz)", 1, "can", "dry"], ["bell peppers", 1, "", "produce"], ["yellow onion", 1, "", "produce"], ["feta", 4, "oz", "dairy"], ["ground cumin", 1, "tsp", "cupboard"]] },
  { id: "noodle", title: "Chicken noodle soup", short: "Noodle soup", mins: 50, serves: 6, lastMade: 35, cols: ["kids"],
    ing: [["chicken thighs", 1, "lb", "meat"], ["egg noodles", 8, "oz", "dry"], ["carrots", 3, "", "produce"], ["celery", 3, "stalk", "produce"], ["yellow onion", 1, "", "produce"]] },
];
const byId = Object.fromEntries(RECIPES.map(r => [r.id, r]));
const COLLECTIONS = [{ key: "all", name: "All" }, { key: "weeknight", name: "Weeknight" }, { key: "kids", name: "Kids will eat it" }];

const DAYS = [
  { key: "mon", name: "Monday", abbr: "Mon", date: "Sep 28" },
  { key: "tue", name: "Tuesday", abbr: "Tue", date: "Sep 29" },
  { key: "wed", name: "Wednesday", abbr: "Wed", date: "Sep 30" },
  { key: "thu", name: "Thursday", abbr: "Thu", date: "Oct 1" },
  { key: "fri", name: "Friday", abbr: "Fri", date: "Oct 2" },
  { key: "sat", name: "Saturday", abbr: "Sat", date: "Oct 3", weekend: true },
  { key: "sun", name: "Sunday", abbr: "Sun", date: "Oct 4", weekend: true },
];

// ---------- State ----------
const state = {
  view: "plan",
  plan: Object.fromEntries(DAYS.map(d => [d.key, []])),
  listMadeFrom: null,   // snapshot of the plan the list was made from
  have: new Set(),      // item keys ticked "already have"
  removed: new Set(),   // generated items removed by hand
  mine: [],             // manual items
  hadOpen: false,
  sent: null,           // { target, time }
  method: "phone",
  picker: { day: null, filter: "all", q: "", sel: 0, results: [] },
  notesOpen: false,
};

// ---------- Helpers ----------
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const FR = { 0.25: "¼", 0.5: "½", 0.75: "¾", 0.33: "⅓", 0.67: "⅔" };
function fmtNum(n) {
  const whole = Math.floor(n), frac = Math.round((n - whole) * 100) / 100;
  if (!frac) return String(whole);
  const f = FR[frac];
  return f ? (whole ? whole + f : f) : String(Math.round(n * 10) / 10);
}
const NO_PLURAL = new Set(["lb", "oz", "g", "tbsp", "tsp", ""]);
function fmtQty(n, unit) {
  if (!unit) return fmtNum(n);
  const u = n > 1 && !NO_PLURAL.has(unit) ? (unit === "bunch" ? "bunches" : unit + "s") : unit;
  return `${fmtNum(n)} ${u}`;
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const plannedCount = () => DAYS.reduce((n, d) => n + state.plan[d.key].length, 0);
const planSig = () => JSON.stringify(state.plan);
function nowTime() {
  const d = new Date();
  let h = d.getHours(), m = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}
function plannedOn(id) {
  const d = DAYS.find(d => state.plan[d.key].includes(id));
  return d ? d.abbr : null;
}

// ---------- Meal Plan ----------
function renderBoard() {
  const board = $("#board");
  board.innerHTML = DAYS.map(d => `
    <div class="day${d.weekend ? " is-weekend" : ""}" data-day="${d.key}" aria-label="${d.name} ${d.date}">
      <div class="day-head"><span class="day-name">${d.abbr}</span><span class="day-date">${d.date}</span></div>
      <div class="day-slots">
        ${state.plan[d.key].map(id => {
          const r = byId[id];
          return `<div class="chip${state.justAdded === d.key + id ? " is-new" : ""}" draggable="true" data-id="${id}" data-from="${d.key}">
            <span class="chip-title">${esc(r.title)}</span>
            <span class="chip-meta">${r.mins} min</span>
            <button class="chip-x" data-remove="${id}" data-day="${d.key}" aria-label="Remove ${esc(r.title)} from ${d.name}">×</button>
          </div>`;
        }).join("")}
      </div>
      <button class="day-add" data-add="${d.key}" aria-label="Add a recipe to ${d.name}">+ Add</button>
    </div>`).join("");
  state.justAdded = null;

  const n = plannedCount();
  $("#emptyHint").hidden = n > 0;
  $("#planSummary").innerHTML = n
    ? `<strong>${n} ${n === 1 ? "dinner" : "dinners"}</strong> planned for next week`
    : "No dinners planned yet";
  $("#makeList").disabled = n === 0;

  const stale = state.listMadeFrom && state.listMadeFrom !== planSig();
  $("#makeListLabel").textContent = !state.listMadeFrom ? "Make shopping list" : stale ? "Update shopping list" : "View shopping list";

  const b = $("#planSentBanner");
  if (state.sent && !stale) {
    b.hidden = false;
    b.innerHTML = `<span class="tick">✓</span> Shopping list ${state.sent.target === "Printer" ? "printed" : state.sent.target === "Clipboard" ? "copied" : "sent to " + state.sent.target} at ${state.sent.time} <button data-go="list">Open list</button>`;
  } else b.hidden = true;

  renderRail();
}

function renderRail() {
  const list = RECIPES.filter(r => r.rotation).sort((a, b) => b.lastMade - a.lastMade);
  $("#railList").innerHTML = list.map(r => {
    const on = plannedOn(r.id);
    return `<li><button class="rail-card${on ? " is-planned" : ""}" draggable="true" data-id="${r.id}" aria-label="${esc(r.title)}. Drag to a day, or press to add to the next open night">
      <span><span class="rail-title">${esc(r.title)}</span>
      <span class="rail-meta">${on ? `Planned for ${on}` : `Made ${r.lastMade} days ago`}</span></span>
      <span class="time-chip">${r.mins} min</span>
    </button></li>`;
  }).join("");
}

function addToDay(day, id) {
  if (state.plan[day].includes(id)) { toast(`${byId[id].short} is already on ${DAYS.find(d => d.key === day).name}`); return; }
  state.plan[day].push(id);
  state.justAdded = day + id;
  renderBoard();
}
function removeFromDay(day, id) {
  state.plan[day] = state.plan[day].filter(x => x !== id);
  renderBoard();
}
function nextOpenNight() {
  const d = DAYS.find(d => !d.weekend && state.plan[d.key].length === 0) || DAYS.find(d => state.plan[d.key].length === 0);
  return d ? d.key : "sun";
}

// Drag & drop (rail → day, day → day)
let drag = null;
document.addEventListener("dragstart", e => {
  const el = e.target.closest?.("[draggable=true]");
  if (!el) return;
  drag = { id: el.dataset.id, from: el.dataset.from || null };
  el.classList.add("is-dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", drag.id);
});
document.addEventListener("dragend", e => {
  e.target.classList?.remove("is-dragging");
  document.querySelectorAll(".day.is-over").forEach(d => d.classList.remove("is-over"));
  drag = null;
});
document.addEventListener("dragover", e => {
  const day = e.target.closest?.(".day");
  if (!day || !drag) return;
  e.preventDefault();
  document.querySelectorAll(".day.is-over").forEach(d => d !== day && d.classList.remove("is-over"));
  day.classList.add("is-over");
});
document.addEventListener("drop", e => {
  const day = e.target.closest?.(".day");
  if (!day || !drag) return;
  e.preventDefault();
  const to = day.dataset.day;
  if (drag.from === to) return;
  if (drag.from) state.plan[drag.from] = state.plan[drag.from].filter(x => x !== drag.id);
  addToDay(to, drag.id);
});

// ---------- Picker ----------
function openPicker(day, anchor) {
  const p = state.picker;
  Object.assign(p, { day, q: "", sel: 0, filter: "all" });
  const pk = $("#picker");
  pk.hidden = false;
  $("#pickerFor").textContent = day ? `Adding to ${DAYS.find(d => d.key === day).name}` : `Adding to the next open night`;
  $("#pickerInput").value = "";
  const win = $(".window").getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  let left = a.left - win.left, top = a.bottom - win.top + 6;
  left = Math.min(left, win.width - 372);
  if (top + 470 > win.height) top = Math.max(50, a.top - win.top - 470);
  pk.style.left = left + "px"; pk.style.top = top + "px";
  renderPicker();
  $("#pickerInput").focus();
}
function closePicker() { $("#picker").hidden = true; }

function renderPicker() {
  const p = state.picker, q = p.q.trim().toLowerCase();
  $("#pickerFilters").innerHTML = COLLECTIONS.map(c =>
    `<button class="filter" data-filter="${c.key}" aria-pressed="${p.filter === c.key}">${c.name}</button>`).join("");

  let pool = RECIPES.filter(r => p.filter === "all" || r.cols.includes(p.filter));
  let results = pool.map(r => {
    if (!q) return { r };
    if (r.title.toLowerCase().includes(q)) return { r };
    const hit = r.ing.find(i => i[0].includes(q));
    return hit ? { r, match: hit[0] } : null;
  }).filter(Boolean);
  results.sort((a, b) => (b.r.rotation ? 1 : 0) - (a.r.rotation ? 1 : 0) || a.r.lastMade - b.r.lastMade);
  p.results = results;
  p.sel = Math.min(p.sel, Math.max(0, results.length - 1));

  if (!results.length) {
    $("#pickerList").innerHTML = `<li class="picker-empty">Nothing in your Box matches “${esc(p.q)}”. Try an ingredient, like “beans”.</li>`;
    return;
  }
  let html = "", group = null;
  results.forEach((x, i) => {
    const g = q ? "Matches in your Box" : x.r.rotation ? "Your rotation" : "Everything else in your Box";
    if (g !== group) { html += `<li class="picker-group" role="presentation">${g}</li>`; group = g; }
    const on = plannedOn(x.r.id);
    html += `<li class="pick" role="option" data-pick="${x.r.id}" aria-selected="${i === p.sel}">
      <span><span class="pick-title">${esc(x.r.title)}</span>
      <span class="pick-meta">${x.match ? `Has <span class="pick-match">${esc(x.match)}</span>` : on ? `Already on ${on}` : `Made ${x.r.lastMade} days ago`}</span></span>
      <span class="time-chip">${x.r.mins} min</span></li>`;
  });
  $("#pickerList").innerHTML = html;
  $("#pickerList .pick[aria-selected=true]")?.scrollIntoView({ block: "nearest" });
}
function pick(id) {
  const day = state.picker.day || nextOpenNight();
  closePicker();
  addToDay(day, id);
}

$("#pickerInput").addEventListener("input", e => { state.picker.q = e.target.value; state.picker.sel = 0; renderPicker(); });
$("#pickerInput").addEventListener("keydown", e => {
  const p = state.picker;
  if (e.key === "ArrowDown") { p.sel = Math.min(p.sel + 1, p.results.length - 1); renderPicker(); e.preventDefault(); }
  else if (e.key === "ArrowUp") { p.sel = Math.max(p.sel - 1, 0); renderPicker(); e.preventDefault(); }
  else if (e.key === "Enter" && p.results[p.sel]) { pick(p.results[p.sel].r.id); e.preventDefault(); }
});

// ---------- Shopping List ----------
function buildList() {
  const items = new Map();
  DAYS.forEach(d => state.plan[d.key].forEach(id => {
    const r = byId[id];
    r.ing.forEach(([name, qty, unit, aisle]) => {
      const it = items.get(name) || { key: name, name, aisle, parts: {}, from: [] };
      it.parts[unit] = (it.parts[unit] || 0) + qty;
      if (!it.from.includes(r.short)) it.from.push(r.short);
      items.set(name, it);
    });
  }));
  state.mine.forEach(m => items.set(m.key, m));
  return [...items.values()].filter(i => !state.removed.has(i.key));
}

function qtyHTML(it) {
  if (it.aisle === "mine") return "";
  const parts = Object.entries(it.parts);
  // Honest precision: different units are shown side by side, never silently converted
  const txt = parts.map(([u, n]) => esc(fmtQty(n, u))).join(`<span class="plus">+</span>`);
  const flag = parts.length > 1 ? `<span class="qty-flag">Recipes use different units</span>` : "";
  return `${txt}${flag}`;
}
function qtyText(it) {
  if (it.aisle === "mine") return "";
  return Object.entries(it.parts).map(([u, n]) => fmtQty(n, u)).join(" + ");
}

function renderList() {
  const all = buildList();
  const need = all.filter(i => !state.have.has(i.key));
  const had = all.filter(i => state.have.has(i.key));
  const dinners = plannedCount();

  $("#ticketMeta").textContent = `For Sep 28 to Oct 4, ${dinners} ${dinners === 1 ? "dinner" : "dinners"}, ${need.length} ${need.length === 1 ? "thing" : "things"} to buy`;
  $("#staleNote").hidden = !state.showStale;

  let html = "";
  if (!all.length) {
    html = `<p class="aisle-note" style="padding:16px 0">Your list is empty. Plan a dinner or add something by hand.</p>`;
  }
  AISLES.forEach(a => {
    const rows = need.filter(i => i.aisle === a.key).sort((x, y) => x.name.localeCompare(y.name));
    if (!rows.length) return;
    html += `<section class="aisle${a.key === "cupboard" ? " is-cupboard" : ""}">
      <h2 class="aisle-name">${a.name}<small>${rows.length}</small></h2>
      ${a.note ? `<p class="aisle-note">${a.note}</p>` : ""}
      <ul class="items">${rows.map(itemHTML).join("")}</ul></section>`;
  });
  if (had.length) {
    html += `<section class="had">
      <button class="had-toggle" data-toggle-had aria-expanded="${state.hadOpen}">
        <span>Already have (${had.length})</span><span class="plusminus">${state.hadOpen ? "−" : "+"}</span></button>
      ${state.hadOpen ? `<ul class="items">${had.map(itemHTML).join("")}</ul>
      <p class="had-foot">Ticked here only. Next week's list starts fresh.</p>` : ""}
    </section>`;
  }
  $("#ticketBody").innerHTML = html;
  state.justAddedItem = null;

  $("#planRecap").innerHTML = DAYS.filter(d => state.plan[d.key].length)
    .map(d => `<li><span class="d">${d.abbr}</span><span>${state.plan[d.key].map(id => esc(byId[id].title)).join(", ")}</span></li>`).join("");

  const nl = $("#navListCount");
  nl.hidden = !need.length; nl.textContent = need.length;

  const st = $("#sentStatus");
  if (state.sent) {
    st.hidden = false;
    st.textContent = state.sent.target === "Printer" ? `Printed at ${state.sent.time}.`
      : state.sent.target === "Clipboard" ? `Copied at ${state.sent.time}.`
      : `Sent to ${state.sent.target} at ${state.sent.time}. Change the list and you can send it again.`;
  } else st.hidden = true;
}

function itemHTML(it) {
  const isHad = state.have.has(it.key);
  return `<li class="item${it.aisle === "mine" ? " is-mine" : ""}${state.justAddedItem === it.key ? " is-new" : ""}">
    <button class="have" data-have="${esc(it.key)}" aria-pressed="${isHad}" aria-label="${isHad ? "Put back on the list" : "Already have"} ${esc(it.name)}">✓</button>
    <span><span class="item-name">${esc(cap(it.name))}</span>
      ${it.from?.length ? `<span class="item-from">for ${esc(it.from.join(", "))}</span>` : ""}</span>
    <span class="item-qty">${qtyHTML(it)}</span>
    <button class="item-x" data-rm="${esc(it.key)}" aria-label="Remove ${esc(it.name)} from the list">×</button>
  </li>`;
}

function exportText() {
  const need = buildList().filter(i => !state.have.has(i.key));
  let out = "Groceries, Sep 28 to Oct 4\n";
  AISLES.forEach(a => {
    const rows = need.filter(i => i.aisle === a.key);
    if (!rows.length) return;
    out += `\n${a.key === "cupboard" ? "Check the cupboard" : a.name}\n`;
    rows.forEach(i => { const q = qtyText(i); out += `☐ ${cap(i.name)}${q ? ", " + q : ""}\n`; });
  });
  return { text: out.trim(), count: need.length, need };
}

// ---------- Take-it-with-you sheet ----------
function openSheet() {
  $("#scrim").hidden = false; $("#sheet").hidden = false;
  renderSheet();
  $(`.method[data-method="${state.method}"]`).focus();
}
function closeSheet() {
  $("#scrim").hidden = true; $("#sheet").hidden = true; $("#shareMenu").hidden = true;
  $("#openTakeout").focus();
}
function renderSheet() {
  const { text, count, need } = exportText();
  document.querySelectorAll(".method").forEach(m => {
    const on = m.dataset.method === state.method;
    m.classList.toggle("is-on", on); m.setAttribute("aria-checked", on);
  });
  $("#sheetCount").textContent = `${count} ${count === 1 ? "thing" : "things"} to buy. Items you ticked as "already have" are left off.`;
  $("#shareMenu").hidden = true;

  const groups = AISLES.map(a => [a, need.filter(i => i.aisle === a.key)]).filter(([, r]) => r.length);
  const pv = $("#preview");
  if (state.method === "phone") {
    $("#sheetAction").textContent = "Send to phone";
    pv.innerHTML = `<div><div class="phone"><div class="phone-screen"><div class="phone-bar"></div>
      <div class="phone-app">Notes</div>
      <div class="phone-text"><b>Groceries, Sep 28 to Oct 4</b>
      ${groups.map(([a, rows]) => `<div class="h">${a.key === "cupboard" ? "Check the cupboard" : a.name}</div>${rows.map(i => `<div class="row">${esc(cap(i.name))}${qtyText(i) ? ", " + esc(qtyText(i)) : ""}</div>`).join("")}`).join("")}
      </div></div></div>
      <p class="preview-cap">What arrives on your phone. Plain text, one line per item.</p></div>`;
  } else if (state.method === "print") {
    $("#sheetAction").textContent = "Print list";
    pv.innerHTML = `<div><div class="mini-ticket"><b>Groceries</b><span style="color:#777">Sep 28 to Oct 4</span>
      ${groups.slice(0, 5).map(([a, rows]) => `<div class="h">${a.name}</div>${rows.slice(0, 5).map(i => `<div class="row"><span>${esc(cap(i.name))}</span><span>${esc(qtyText(i))}</span></div>`).join("")}`).join("")}
      <div style="color:#999;margin-top:6px">…</div></div>
      <p class="preview-cap">Prints just the ticket, about 9 cm wide.</p></div>`;
  } else {
    $("#sheetAction").textContent = "Copy text";
    pv.innerHTML = `<div class="textblock">${esc(text)}</div>`;
  }
}

function finishSend(target) {
  state.sent = { target, time: nowTime() };
  closeSheet();
  renderList();
  const msg = target === "Printer" ? "Sent to your printer"
    : target === "Clipboard" ? "Copied. Paste it anywhere"
    : target === "Notes" ? "Sent to Notes. It'll be on your phone once Notes syncs"
    : `Sent to ${target}. Check your phone`;
  toast(msg);
}

$("#sheetAction").addEventListener("click", () => {
  if (state.method === "phone") {
    const m = $("#shareMenu"); m.hidden = !m.hidden;
    if (!m.hidden) m.querySelector("button").focus();
  } else if (state.method === "print") {
    const done = () => { window.removeEventListener("afterprint", done); finishSend("Printer"); };
    window.addEventListener("afterprint", done);
    closeSheet();
    setTimeout(() => window.print(), 60);
  } else {
    const t = exportText().text;
    (navigator.clipboard?.writeText(t) || Promise.reject()).catch(() => {}).finally(() => finishSend("Clipboard"));
  }
});
$("#shareMenu").addEventListener("click", e => {
  const b = e.target.closest("[data-target]"); if (b) finishSend(b.dataset.target);
});

// ---------- Views ----------
function go(view) {
  if (view === "list") {
    if (!plannedCount() && !state.mine.length) { toast("Plan at least one dinner first"); return; }
    const sig = planSig();
    state.showStale = !!state.listMadeFrom && state.listMadeFrom !== sig;
    if (state.showStale) state.sent = null;
    state.listMadeFrom = sig;
    renderList();
  } else {
    state.showStale = false;
    renderBoard();
  }
  state.view = view;
  $("#view-plan").hidden = view !== "plan";
  $("#view-list").hidden = view !== "list";
  $("#navPlan").classList.toggle("is-current", view === "plan");
  $("#navList").classList.toggle("is-current", view === "list");
  closePicker();
  renderNotes();
}

// ---------- Toast ----------
let toastT;
function toast(msg) {
  const t = $("#toast");
  t.hidden = true; void t.offsetWidth;
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 3400);
}

// ---------- Global click routing ----------
document.addEventListener("click", e => {
  const t = e.target;
  const goBtn = t.closest("[data-go]");
  if (goBtn) { go(goBtn.dataset.go); return; }

  const inert = t.closest("[data-inert]");
  if (inert) { toast("Outside this prototype. It covers Meal Plan and Shopping List"); return; }

  const add = t.closest("[data-add]");
  if (add) { openPicker(add.dataset.add, add); return; }

  const rm = t.closest("[data-remove]");
  if (rm) { removeFromDay(rm.dataset.day, rm.dataset.remove); return; }

  const railCard = t.closest(".rail-card");
  if (railCard) {
    const id = railCard.dataset.id;
    if (plannedOn(id)) { toast(`${byId[id].short} is already on ${plannedOn(id)}. Drag it to plan it twice`); return; }
    addToDay(nextOpenNight(), id); return;
  }
  if (t.closest("#railSearch")) { openPicker(null, t.closest("#railSearch")); return; }

  const f = t.closest("[data-filter]");
  if (f) { state.picker.filter = f.dataset.filter; state.picker.sel = 0; renderPicker(); $("#pickerInput").focus(); return; }
  const pk = t.closest("[data-pick]");
  if (pk) { pick(pk.dataset.pick); return; }

  if (!$("#picker").hidden && !t.closest("#picker")) closePicker();

  const have = t.closest("[data-have]");
  if (have) {
    const k = have.dataset.have;
    if (state.have.has(k)) state.have.delete(k); else state.have.add(k);
    renderList(); return;
  }
  const irm = t.closest("[data-rm]");
  if (irm) {
    const k = irm.dataset.rm;
    const mineIdx = state.mine.findIndex(m => m.key === k);
    if (mineIdx > -1) state.mine.splice(mineIdx, 1); else state.removed.add(k);
    renderList(); toast(`Removed ${k}`); return;
  }
  if (t.closest("[data-toggle-had]")) { state.hadOpen = !state.hadOpen; renderList(); return; }

  if (t.closest("#makeList")) { go("list"); return; }
  if (t.closest("#openTakeout")) { openSheet(); return; }
  if (t.closest("#sheetClose") || t === $("#scrim")) { closeSheet(); return; }
  const m = t.closest(".method");
  if (m) { state.method = m.dataset.method; renderSheet(); return; }

  if (t.closest("#notesToggle")) { toggleNotes(); return; }
  if (t.closest("#notesClose")) { toggleNotes(false); return; }
});

$("#addItemForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = $("#addItem").value.trim();
  if (!v) return;
  const key = v.toLowerCase();
  if (!state.mine.some(m => m.key === key)) state.mine.push({ key, name: v.toLowerCase(), aisle: "mine", parts: {}, from: [] });
  state.removed.delete(key); state.have.delete(key);
  state.justAddedItem = key;
  $("#addItem").value = "";
  renderList();
});

document.addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
  if (e.key === "Escape") {
    if (!$("#shareMenu").hidden) { $("#shareMenu").hidden = true; return; }
    if (!$("#sheet").hidden) { closeSheet(); return; }
    if (!$("#picker").hidden) { closePicker(); return; }
    if (state.notesOpen) { toggleNotes(false); return; }
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
    if (state.view !== "list") {
      e.preventDefault();
      if (plannedCount()) { go("list"); setTimeout(() => window.print(), 80); }
      else toast("Plan a dinner first, then print the list");
    }
    return;
  }
  if (!typing && (e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey) toggleNotes();
});

// ---------- Design notes (decisions + Mobbin references) ----------
const NOTES = {
  plan: [
    { h: "The job", p: "Dana, the Weeknight Planner, has about 90 seconds. Planning five dinners should take five drags, not a workflow. She can drag a card, click it to fill the next open night, or press + and type.", refs: [["Persona: Dana", "q"], ["C8.2 Fast over clever", "q"]] },
    { h: "Rotation rail, sorted by longest since made", p: "Dana rotates about 20 trusted recipes. The rail shows those first, ordered by the Cook Log's last-made date. This is a sort, not a smart Collection, so Q7 stays untouched.", refs: [["Convention, not from Mobbin: kanban backlog", "conv"]] },
    { h: "Weekdays wide, weekend narrow", p: "Dana cooks five nights a week. The board gives Mon to Fri more room, but the weekend is still there for the nights she does cook.", refs: [["Persona: Dana", "q"]] },
    { h: "Sage frame, bottle green, cookbook serif", p: "The outer sage frame, deep green chrome and warm serif display come from Wing. Recipe titles are set in Young Serif so the app reads like a cookbook, not a SaaS dashboard.", refs: [["Mobbin: Wing (plainthing.studio)", ""], ["C8.7 Warm, not sterile", "q"]] },
    { h: "Pill CTA with a mustard icon disc", p: "Fode's “Buy Now” pill (dark pill, yellow disc holding the icon) and Wolfood's mustard pill give the one primary action per screen. Everything else is quiet.", refs: [["Mobbin: Fode", ""], ["Mobbin: Wolfood", ""]] },
    { h: "Cook-time chips", p: "Fode's small yellow “30 dk.” time pill became the minutes chip on each recipe card. On a Tuesday, time is the number Dana decides with.", refs: [["Mobbin: Fode", ""]] },
    { h: "Taken out on purpose", p: "Hero food photography, prices, “Flash sale” badges and “Loved by 2.4m” social proof from all three references. Larder is personal, not social (C8.6), and nothing should sell while Q1 pricing is open.", refs: [["Rejected", "conv"]] },
  ],
  list: [
    { h: "The list is a tear-off ticket", p: "Fode's dashed coupon card became the list itself. What Dana sees is exactly what prints (print only shows the ticket). This is the one bold element in the flow.", refs: [["Mobbin: Fode", ""], ["C5 Must: printable", "q"]] },
    { h: "Q9 assumption: no Pantry, so a cupboard group", p: "Every ingredient is listed; nothing is silently dropped. Staples go to “Check the cupboard first” at the bottom, and “already have” strikes an item through for this list only. Larder won't remember it, because that would be Pantry, which is a Could.", refs: [["Q9, assumed for now", "q"]] },
    { h: "Different units stay separate", p: "“1 cup + 150 g” sour cream is shown as is, with a note, never converted into a number that looks confident. A wrong total in the store is worse than an honest sum.", refs: [["C8.3 Honest precision", "q"]] },
    { h: "Each item says which recipe needs it", p: "“for Fajitas, Tacos” lets Dana decide in the store whether she can skip something.", refs: [["Persona: Dana", "q"]] },
    { h: "Collapsible “Already have”", p: "Wolfood's FAQ rows with a + toggle became the collapsed “Already have” section: out of the way, but one click to undo.", refs: [["Mobbin: Wolfood", ""]] },
    { h: "Aisle grouping", p: "Grouped by where things sit in a store, not by recipe. None of the references show a grocery list, so this comes from convention (AnyList, Reminders groceries) and still needs a Mobbin pull.", refs: [["Convention, not from Mobbin", "conv"]] },
  ],
  sheet: [
    { h: "Q10 decision: plain text to the phone, plus print", p: "Dana already keeps lists in her phone's notes app. Larder sends plain text to Messages, Mail or Notes through the system share menu. No server, no account and no sync: it fits the local-first build (C7) and doesn't pre-empt Q2 or Q3.", refs: [["Q10, decided (T2)", "q"]] },
    { h: "Rejected: QR code to a hosted list", p: "It needs a server Theo doesn't have and implies sync, which is a Could. A QR code served over local Wi-Fi breaks the moment Dana leaves the house.", refs: [["C7 Constraints", "q"]] },
    { h: "Said out loud: it's a copy", p: "“Your ticks on the phone won't come back to Larder.” This is honest about the limit instead of letting her find out in the store.", refs: [["C8.3 Honest precision", "q"]] },
    { h: "Preview before sending", p: "The right-hand pane shows exactly what lands on the phone or paper. None of the references cover a handoff screen; the share menu follows macOS convention (Windows is Q13).", refs: [["Convention, not from Mobbin", "conv"], ["Q13 open", "q"]] },
  ],
};
function renderNotes() {
  if (!state.notesOpen) return;
  const key = !$("#sheet").hidden ? "sheet" : state.view;
  const title = { plan: "Meal Plan", list: "Shopping List", sheet: "Take it with you" }[key];
  $("#notesBody").innerHTML = `<p class="scope">Notes for: ${title}. Full records are in DECISIONS.md.</p>` +
    NOTES[key].map(n => `<div class="note"><h3>${esc(n.h)}</h3><p>${esc(n.p)}</p>
      ${n.refs.map(([r, c]) => `<span class="ref ${c}">${esc(r)}</span>`).join("")}</div>`).join("");
}
function toggleNotes(force) {
  state.notesOpen = typeof force === "boolean" ? force : !state.notesOpen;
  $("#notes").hidden = !state.notesOpen;
  $("#notesToggle").setAttribute("aria-pressed", state.notesOpen);
  renderNotes();
}
// keep notes in sync when the sheet opens/closes
new MutationObserver(renderNotes).observe($("#sheet"), { attributes: true, attributeFilter: ["hidden"] });

// ---------- Boot ----------
renderBoard();

// Review shortcuts: open index.html#list or #sheet to jump into a filled flow
(function demo() {
  const h = location.hash.slice(1);
  if (!["plan", "list", "sheet", "notes"].includes(h)) return;
  Object.assign(state.plan, { mon: ["fajitas"], tue: ["orzo"], wed: ["chili"], thu: ["tacos"], fri: ["pizza"] });
  renderBoard();
  if (h === "list" || h === "sheet" || h === "notes") {
    go("list");
    state.have.add("olive oil"); state.mine.push({ key: "milk", name: "milk", aisle: "mine", parts: {}, from: [] });
    renderList();
  }
  if (h === "sheet") openSheet();
  if (h === "notes") toggleNotes(true);
})();
