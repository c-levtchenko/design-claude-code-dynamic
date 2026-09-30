/* Larder prototype (DCCD-1): Marcus imports one of his mother's handwritten cards.
   Static, mocked data only. One small state machine re-renders #view. */

const TODAY = "23 September 2026";
const MOM = "Mom's cards";
const COLLECTIONS = [MOM, "Sunday", "Weeknight", "Baking"];

// ---------- Mock Box ----------
const BOX = [
  { id: "egusi", name: "Egusi Soup", source: "card", sourceText: "Photo of a handwritten card", collections: [MOM, "Sunday"] },
  { id: "chinchin", name: "Chin Chin", source: "card", sourceText: "Photo of a handwritten card", collections: [MOM, "Baking"] },
  { id: "pepper", name: "Pepper Soup", source: "card", sourceText: "Photo of a handwritten card", collections: [MOM] },
  { id: "shepherd", name: "Shepherd's Pie", source: "web", sourceText: "bbcgoodfood.com", collections: ["Weeknight"] },
  { id: "banana", name: "Banana Bread", source: "clip", sourceText: "Magazine clipping", collections: ["Baking"] },
  { id: "chicken", name: "Lemon Roast Chicken", source: "typed", sourceText: "Typed in", collections: ["Sunday", "Weeknight"] },
  { id: "jambalaya", name: "Chicken Jambalaya", source: "web", sourceText: "cooking.nytimes.com", collections: ["Weeknight"] },
  { id: "pound", name: "Sunday Pound Cake", source: "clip", sourceText: "Magazine clipping", collections: ["Sunday", "Baking"] },
  { id: "fishpie", name: "Fish Pie", source: "web", sourceText: "seriouseats.com", collections: ["Weeknight"] },
];

// ---------- The card, and what Larder read from it ----------
// hand: [before, fragment, after] as written on the card. The fragment is what gets circled.
// unsure: what Larder couldn't read, why, and the fixes it offers. It never guesses silently.
const CARD_LINES = [
  { id: "m1", group: "meta", label: "Title", hand: ["Jollof Rice (Sundays)"], read: "Jollof Rice (Sundays)" },
  { id: "m2", group: "meta", label: "Serves", hand: ["for 6"], read: "6" },

  { id: "i1", group: "ing", hand: ["", "1½", " c. long grain rice"], read: "11/2 cups long-grain rice",
    unsure: { frag: "11/2", reason: "The 1 and the ½ run together, so this could be 1½ cups or 11/2 cups.",
      options: [{ label: "1½ cups", value: "1½ cups long-grain rice" }, { label: "½ cup", value: "½ cup long-grain rice" }] } },
  { id: "i2", group: "ing", hand: ["4 big tomatoes"], read: "4 big tomatoes" },
  { id: "i3", group: "ing", hand: ["2 tatashe (red peppers)"], read: "2 tatashe (red peppers)" },
  { id: "i4", group: "ing", hand: ["1 onion"], read: "1 onion" },
  { id: "i5", group: "ing", hand: ["", "1", " scotch bonnet"], read: "1 scotch bonnet",
    unsure: { frag: "1", reason: "This could be a 1 or a 7. The top stroke is faint.",
      options: [{ label: "1 scotch bonnet", value: "1 scotch bonnet" }, { label: "7 scotch bonnets", value: "7 scotch bonnets" }] } },
  { id: "i6", group: "ing", hand: ["3 tbsp tomato paste"], read: "3 tbsp tomato paste" },
  { id: "i7", group: "ing", hand: ["⅓ c. groundnut oil"], read: "⅓ cup groundnut oil" },
  { id: "i8", group: "ing", hand: ["2 c. chicken stock"], read: "2 cups chicken stock" },
  { id: "i9", group: "ing", hand: ["1 tsp thyme"], read: "1 tsp dried thyme" },
  { id: "i9b", group: "ing", hand: ["1 tsp curry"], read: "1 tsp curry powder" },
  { id: "i10", group: "ing", hand: ["2 bay leaves"], read: "2 bay leaves" },
  { id: "i11", group: "ing", hand: ["salt"], read: "Salt, to taste" },

  { id: "s1", group: "step", hand: ["Blend tomatoes, tatashe, pepper & half the onion."], read: "Blend the tomatoes, tatashe, scotch bonnet and half the onion." },
  { id: "s2", group: "step", hand: ["Fry rest of onion in oil, add paste, fry 5 min."], read: "Fry the rest of the onion in the oil. Add the tomato paste and fry 5 minutes." },
  { id: "s3", group: "step", hand: ["Add blend. Cook down ", "25", " min till oil rises."], smudge: true, read: "Add the blend. Cook down ?? minutes, until the oil rises.",
    unsure: { frag: "??", reason: "A smudge covers the cooking time. Larder won't guess a number here.",
      options: [{ label: "Keep it as “smudged on card”", unreadable: true }] } },
  { id: "s4", group: "step", hand: ["Stock, thyme, curry, bay, then rice. Foil + lid, low 30 min."], read: "Add the stock, thyme, curry and bay leaves, then the rice. Cover with foil and a lid. Cook on low for 30 minutes." },
  { id: "s5", group: "step", hand: ["Don't stir! Let the bottom catch."], read: "Don't stir. Let the bottom catch a little." },

  { id: "n1", group: "note", label: "Note on card", hand: ["Mama, '87"], read: "Signed “Mama, ’87”" },
];

// ---------- State ----------
const state = {
  screen: "box",
  stubName: "",
  tab: "All",
  query: "",
  addSource: null,
  recipes: BOX.map(r => ({ ...r })),
  lines: [],
  reading: false,
  flagsShown: false,
  activeId: null,
  editingId: null,
  typingId: null,
  current: null,     // the recipe just saved
  imports: 0,
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const view = $("#view");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const slug = s => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const announce = msg => { const l = $("#live"); l.textContent = ""; setTimeout(() => (l.textContent = msg), 30); };

function go(screen, extra = {}) {
  Object.assign(state, { screen }, extra);
  render();
  view.scrollTop = 0;
}

// ---------- Render ----------
function render(focusSel) {
  const screens = { box: renderBox, add: renderAdd, review: renderReview, saved: renderSaved, stub: renderStub };
  view.innerHTML = screens[state.screen]();
  renderNav();
  renderNotes();
  bindScreen();
  if (focusSel) { const el = $(focusSel, view); if (el) el.focus(); }
}

function renderNav() {
  const counts = c => state.recipes.filter(r => r.collections.includes(c)).length;
  $("#nav-collections").innerHTML = COLLECTIONS.map(c =>
    `<li><button class="nav-item" data-nav="col:${esc(c)}"><span>${esc(c)}</span><span class="count">${counts(c)}</span></button></li>`).join("");
  $$(".nav-item").forEach(b => {
    const n = b.dataset.nav;
    let on = false;
    if (state.screen === "box") on = n === "box" && state.tab === "All" || n === `col:${state.tab}`;
    else if (state.screen === "stub") on = n === `stub:${state.stubName}`;
    else on = n === "box";
    on ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current");
  });
}

// 1. Box
function tileArt(r) {
  // Each tile shows the recipe as a miniature of where it came from
  const mini = {
    card: `<div class="mini-card">${esc(r.name)}</div>`,
    web: `<div class="mini-web"><span class="mini-url">${esc(r.sourceText)}</span><span class="mini-web-name">${esc(r.name)}</span></div>`,
    clip: `<div class="mini-clip">${esc(r.name)}</div>`,
    typed: `<div class="mini-typed">${esc(r.name)}</div>`,
  }[r.source];
  return `<div class="tile-art art-${r.source}" aria-hidden="true">${mini}</div>`;
}
function renderBox() {
  const q = state.query.trim().toLowerCase();
  const list = state.recipes
    .filter(r => state.tab === "All" || r.collections.includes(state.tab))
    .filter(r => !q || r.name.toLowerCase().includes(q) || (r.ingredients || []).some(i => i.toLowerCase().includes(q)));
  const tabs = ["All", ...COLLECTIONS];
  return `
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">Your Box</h1>
        <p class="page-sub">${state.recipes.length} recipes, all saved on this computer</p>
      </div>
      <div style="display:flex;gap:12px;align-items:center">
        <input class="search" id="search" type="search" placeholder="Search by title, tag or ingredient" value="${esc(state.query)}" aria-label="Search your Box">
        <button class="btn btn-primary" data-go="add">Add recipe</button>
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${tabs.map(t => `<button class="tab" role="tab" aria-selected="${state.tab === t}" data-tab="${esc(t)}">${esc(t)}</button>`).join("")}
    </div>
    ${list.length ? `<div class="grid">
      ${list.map(r => `
        <button class="tile" data-open="${r.id}">
          ${r.justAdded ? `<span class="chip">Just added</span>` : ""}
          ${tileArt(r)}
          <div class="tile-body">
            <div class="tile-name">${esc(r.name)}</div>
            <div class="tile-source">${esc(r.sourceText)}</div>
          </div>
        </button>`).join("")}
    </div>` : `<p class="page-sub">Nothing in ${state.tab === "All" ? "your Box" : esc(state.tab)} matches “${esc(state.query)}”. Try an ingredient, like rice.</p>`}
  </div>`;
}

// 2. Add recipe
function renderAdd() {
  const momCount = state.recipes.filter(r => r.collections.includes(MOM)).length;
  const loop = state.imports > 0
    ? `<p class="loop-note">Card ${momCount + 1} of Mom's cards. The last one is safely in your Box. The prototype has one sample card, so you'll see it again.</p>` : "";
  const photo = state.addSource === "photo";
  return `
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">Add a recipe</h1>
        <p class="page-sub">Where is this recipe right now?</p>
      </div>
      <button class="btn btn-quiet" data-go="box">Back to your Box</button>
    </div>
    ${loop}
    <div class="sources">
      <button class="source" disabled><strong>Type it in</strong><span>Not built in this prototype</span></button>
      <button class="source" disabled><strong>From a web link</strong><span>Not built in this prototype</span></button>
      <button class="source" data-source="photo" aria-pressed="${photo}"><strong>From a photo</strong><span>A card, a cookbook page or a clipping</span></button>
    </div>
    ${photo ? `
    <div class="drop" id="drop">
      <div>
        <h2>Add one card at a time</h2>
        <p>Each card gets its own careful look before it goes in your Box. It's slower than dropping in a pile, but nothing is saved with a line Larder misread.</p>
        <p class="expect">Reading a photo needs the internet for a few seconds. After that, the recipe and the photo stay on this computer.</p>
        <p style="margin-top:20px"><button class="btn btn-quiet" data-sample>Choose a photo</button> or drop one here</p>
      </div>
      <button class="sample" data-sample aria-label="Use the sample photo: Mama's jollof rice card">
        <span class="mini-card">Jollof Rice (Sundays)</span>
        <span class="sample-label">Use the sample card</span>
      </button>
    </div>` : ""}
  </div>`;
}

// 3 + 4. Reading, then review
function handHTML(l) {
  if (l.hand.length === 1) return esc(l.hand[0]);
  const flag = state.flagsShown && l.unsure ? " is-flag" : "";
  const done = l.status === "checked" ? " is-done" : "";
  const smudge = l.smudge ? `<span class="smudge">${esc(l.hand[1])}</span>` : esc(l.hand[1]);
  return `${esc(l.hand[0])}<span class="ref${flag}${done}" data-ref="${l.id}">${smudge}</span>${esc(l.hand[2])}`;
}
function cardHTML(lines) {
  const by = g => lines.filter(l => l.group === g);
  const wrap = l => `<li data-card-line="${l.id}">${handHTML(l)}</li>`;
  const m = id => lines.find(l => l.id === id);
  return `
  <div class="index-card">
    <h3 data-card-line="m1">${handHTML(m("m1"))} <span style="font-size:30px">${handHTML(m("m2"))}</span></h3>
    <ul>${by("ing").map(wrap).join("")}</ul>
    <ol class="hand-group">${by("step").map(wrap).join("")}</ol>
    <p class="sign" data-card-line="n1">— ${handHTML(m("n1"))}</p>
  </div>`;
}
const PENCIL = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M11.5 2.5l2 2L6 12l-3 1 1-3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

function lineText(l) {
  if (l.status === "unsure") {
    const [a, b] = l.read.split(l.unsure.frag);
    return `${esc(a)}<mark>${esc(l.unsure.frag)}</mark>${esc(b)}`;
  }
  if (l.unreadable) {
    const [a, b] = l.read.split(l.unsure.frag);
    return `${esc(a)}<span class="unreadable">smudged on card</span>${esc(b)}`;
  }
  return esc(l.value);
}

function lineHTML(l, i) {
  const cls = ["line", `is-${l.status}`, state.reading ? "pending" : "", l.id === state.activeId ? "is-active" : ""].join(" ");
  const label = l.label ? `<strong style="min-width:110px;color:var(--muted);font-weight:400">${esc(l.label)}</strong>` : "";
  if (state.editingId === l.id || state.typingId === l.id) {
    const val = state.typingId === l.id ? l.read : l.value;
    return `<li class="${cls}" data-line="${l.id}" data-i="${i}">
      <div class="line-row">${label}
        <form class="type-row" data-type-form="${l.id}">
          <input value="${esc(val)}" aria-label="What the card says" data-type-input>
          <button class="btn btn-primary" style="padding:7px 16px">Use this</button>
          <button type="button" class="btn btn-quiet" style="padding:7px 16px" data-type-cancel>Cancel</button>
        </form>
      </div></li>`;
  }
  let pill = "", fix = "", action = "";
  if (l.status === "unsure") {
    pill = `<span class="pill pill-unsure">Not sure</span>`;
    fix = `<div class="fix">
      <p class="reason">${esc(l.unsure.reason)}</p>
      <div class="choices">
        ${l.unsure.options.map((o, k) => `<button class="choice" data-choose="${l.id}" data-k="${k}">${esc(o.label)}</button>`).join("")}
        <button class="choice" data-type="${l.id}">Type what the card says</button>
      </div></div>`;
  } else if (l.status === "checked") {
    pill = `<span class="pill pill-checked">You checked</span>`;
    action = `<button class="edit-btn undo" data-undo="${l.id}">Change</button>`;
  } else if (l.status === "edited") {
    pill = `<span class="pill pill-checked">You changed this</span>`;
    action = `<button class="edit-btn" data-edit="${l.id}" aria-label="Edit this line">${PENCIL}</button>`;
  } else {
    action = `<button class="edit-btn" data-edit="${l.id}" aria-label="Edit this line">${PENCIL}</button>`;
  }
  return `<li class="${cls}" data-line="${l.id}" data-i="${i}">
    <div class="line-row">${label}<span class="line-text">${lineText(l)}</span>${pill}${action}</div>${fix}</li>`;
}

function remaining() { return state.lines.filter(l => l.status === "unsure").length; }

function renderReview() {
  const lines = state.lines;
  const total = lines.length;
  const left = remaining();
  const flaggedTotal = lines.filter(l => l.unsure).length;
  const done = flaggedTotal - left;
  const ready = !state.reading && left === 0;
  const head = state.reading
    ? `<h1>Reading your card…</h1><p id="reading-count">Larder is reading line 1 of ${total}. You'll check anything it isn't sure about before it's saved.</p>`
    : `<h1>Check what Larder read</h1><p>${flaggedTotal} lines on this card were hard to read. They're circled on the photo. The rest read clearly, and you can still change any of them.</p>
       <p class="kbd-hint"><kbd>↑</kbd> <kbd>↓</kbd> move between circled lines. <kbd>⌘</kbd> <kbd>S</kbd> saves once every line is checked.</p>`;
  const group = (g, title) => `<h2 class="section-label">${title}</h2>
    <ul class="lines">${lines.map((l, i) => l.group === g ? lineHTML(l, i) : "").join("")}</ul>`;
  const status = state.reading ? "Reading the card…"
    : ready ? "Every line is checked. Ready to save."
    : `${left} ${left === 1 ? "line still needs" : "lines still need"} a look`;
  return `
  <div class="review${state.flagsShown && !state.justFlagged ? " no-anim" : ""}">
    <section class="review-photo" aria-label="Your photo">
      ${cardHTML(lines)}
      <p class="photo-caption">Your photo, as it was taken. Click a circled line to jump to it.</p>
    </section>
    <section class="review-main">
      <div class="review-scroll">
        <div class="review-head">${head}</div>
        ${group("meta", "About the recipe")}
        ${group("ing", "Ingredients")}
        ${group("step", "Steps")}
        ${group("note", "Written on the card")}
      </div>
      <div class="savebar">
        <div class="progress">
          <div class="progress-text${ready ? " is-ready" : ""}" id="progress-text">${status}</div>
          <div class="bar" aria-hidden="true"><i style="width:${state.reading ? 0 : flaggedTotal ? (done / flaggedTotal) * 100 : 100}%"></i></div>
        </div>
        <button class="btn btn-quiet" data-cancel>Cancel</button>
        <button class="btn btn-primary" data-save aria-disabled="${!ready}" aria-describedby="progress-text">Save to Box</button>
      </div>
    </section>
  </div>`;
}

// 5. Saved
function splitQty(text) {
  const m = text.match(/^([\d½⅓¼¾⅔\/.\s]+(?:cups?|cup|tbsp|tsp)?)\s+(.*)$/i);
  return m ? [m[1].trim(), m[2]] : ["", text];
}
function stepHTML(l) {
  if (l.unreadable) {
    const [a, b] = l.read.split(l.unsure.frag);
    return `${esc(a)}<span class="unreadable">smudged on card</span>${esc(b)}`;
  }
  return esc(l.value);
}
function renderSaved() {
  const r = state.current;
  const lines = r.lines;
  const momCount = state.recipes.filter(x => x.collections.includes(MOM)).length;
  const inMom = r.collections.includes(MOM);
  const fixed = lines.filter(l => l.unsure).length;
  return `
  <div class="page">
    ${r.justSaved ? `
    <div class="saved-banner" role="status">
      <div>
        <strong>Saved to your Box</strong>
        <p>It's also a plain file on this computer: <span class="path">Documents / Larder / Box / ${esc(r.file)}</span></p>
      </div>
      <button class="btn btn-quiet" data-finder>Show in Finder</button>
    </div>` : ""}
    <article class="sheet">
      <div>
        <h1 class="sheet-title">${esc(r.name)}</h1>
        <div class="sheet-meta">
          <div>Serves ${esc(lines.find(l => l.id === "m2").value)}</div>
          <div>From a photo of Mama's handwritten card, signed ’87</div>
          <div>Checked by you on ${TODAY}. You settled ${fixed} hard-to-read lines.</div>
        </div>
        <div class="sheet-card">
          ${cardHTML(lines)}
          <p class="photo-caption" style="margin-top:14px">The original photo is kept next to the recipe, in the same folder.</p>
        </div>
      </div>
      <div>
        <h2>Ingredients</h2>
        <ul class="ing-grid">
          ${lines.filter(l => l.group === "ing").map(l => { const [q, n] = splitQty(l.value); return `<li><span class="qty">${esc(q)}</span><span>${esc(n)}</span></li>`; }).join("")}
        </ul>
        <h2>Steps</h2>
        <ol class="steps">${lines.filter(l => l.group === "step").map(l => `<li><span>${stepHTML(l)}</span></li>`).join("")}</ol>
        <div class="collections-row" aria-label="Collections">
          <span style="color:var(--muted)">In Collections:</span>
          ${COLLECTIONS.map(c => `<button class="col-chip" data-col="${esc(c)}" aria-pressed="${r.collections.includes(c)}">${r.collections.includes(c) ? "✓ " : "+ "}${esc(c)}</button>`).join("")}
        </div>
      </div>
    </article>
    <div class="saved-actions">
      <button class="btn btn-primary" data-next>Import the next card</button>
      <button class="btn btn-quiet" data-print>Print</button>
      <button class="btn-link" data-go="box">Go to your Box</button>
      ${inMom ? `<span class="count-note">${momCount} of Mom's cards are in your Box now.</span>` : ""}
    </div>
  </div>`;
}

function renderStub() {
  return `<div class="stub">
    <h1>${esc(state.stubName)} isn't in this prototype</h1>
    <p>This prototype covers one flow: bringing one of Mom's handwritten cards into the Box. In the beta, screens that aren't ready look like this instead of breaking.</p>
    <button class="btn btn-primary" data-go="box">Go to your Box</button>
  </div>`;
}

// ---------- Behaviour ----------
function startImport() {
  state.lines = CARD_LINES.map(l => ({ ...l, value: l.read, status: l.unsure ? "unsure" : "clear" }));
  Object.assign(state, { activeId: null, editingId: null, typingId: null, flagsShown: false, justFlagged: false });
  if (reduceMotion) { state.reading = false; state.flagsShown = true; go("review"); return; }
  state.reading = true;
  go("review");
  const total = state.lines.length;
  const rows = $$(".line", view).sort((a, b) => a.dataset.i - b.dataset.i);
  const cardRows = id => $(`[data-card-line="${id}"]`, view);
  rows.forEach((row, i) => setTimeout(() => {
    if (state.screen !== "review" || !state.reading) return;
    row.classList.remove("pending");
    row.classList.add("appear");
    $$(".ref, [data-card-line]", view).forEach(el => el.classList.remove("is-active"));
    const c = cardRows(row.dataset.line); if (c) c.classList.add("is-active");
    const p = $("#reading-count", view);
    if (p) p.textContent = `Larder is reading line ${i + 1} of ${total}. You'll check anything it isn't sure about before it's saved.`;
    if (i === rows.length - 1) setTimeout(finishReading, 450);
  }, 140 * i + 300));
}
function finishReading() {
  if (state.screen !== "review") return;
  Object.assign(state, { reading: false, flagsShown: true, justFlagged: true });
  render();
  state.justFlagged = false;
  announce(`${remaining()} lines need a look before you can save.`);
  focusNextUnsure();
}

function focusNextUnsure(fromId) {
  const unsure = state.lines.filter(l => l.status === "unsure");
  if (!unsure.length) { $("[data-save]", view)?.focus(); return; }
  const idx = fromId ? state.lines.findIndex(l => l.id === fromId) : -1;
  const next = unsure.find(l => state.lines.indexOf(l) > idx) || unsure[0];
  setActive(next.id);
  const btn = $(`[data-line="${next.id}"] .choice`, view);
  btn?.focus();
  $(`[data-line="${next.id}"]`, view)?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
}

function setActive(id) {
  state.activeId = id;
  $$(".line", view).forEach(el => el.classList.toggle("is-active", el.dataset.line === id));
  $$(".ref", view).forEach(el => el.classList.toggle("is-active", el.dataset.ref === id));
}

function resolve(id, patch) {
  const l = state.lines.find(x => x.id === id);
  Object.assign(l, patch);
  state.typingId = state.editingId = null;
  render();
  const left = remaining();
  announce(left ? `Checked. ${left} ${left === 1 ? "line" : "lines"} left.` : "Every line is checked. Ready to save.");
  focusNextUnsure(id);
}

function trySave() {
  if (state.reading) return;
  const left = remaining();
  if (left) {
    announce(`${left} ${left === 1 ? "line still needs" : "lines still need"} a look before you can save.`);
    focusNextUnsure();
    return;
  }
  const lines = state.lines.map(l => ({ ...l }));
  const name = lines.find(l => l.id === "m1").value;
  state.recipes.forEach(r => (r.justAdded = false));
  const recipe = {
    id: "new-" + Date.now(), name, source: "card", sourceText: "Photo of a handwritten card",
    collections: [MOM], lines, file: slug(name) + ".md", justAdded: true, justSaved: true,
    ingredients: lines.filter(l => l.group === "ing").map(l => l.value),
  };
  state.recipes.unshift(recipe);
  state.imports++;
  state.current = recipe;
  go("saved");
  announce("Saved to your Box.");
  $("[data-next]", view)?.focus({ preventScroll: true });
  view.scrollTop = 0;
}

function recipeFile(r) {
  const L = r.lines;
  const fixed = L.filter(l => l.unsure);
  const step = l => (l.unreadable ? l.read.replace(l.unsure.frag, "[smudged on card]") : l.value);
  return `---
title: ${r.name}
serves: ${L.find(l => l.id === "m2").value.replace(/\D/g, "")}
source: Photo of a handwritten card
photo: ${r.file.replace(".md", "-card.jpg")}
collections: [${r.collections.join(", ")}]
saved: 2026-09-23
checked-by-you:
${fixed.map(l => `  - "${step(l)}"`).join("\n")}
---

# ${r.name}

## Ingredients
${L.filter(l => l.group === "ing").map(l => `- ${l.value}`).join("\n")}

## Steps
${L.filter(l => l.group === "step").map((l, i) => `${i + 1}. ${step(l)}`).join("\n")}

Written on the card: ${L.find(l => l.id === "n1").value}
`;
}

function openFinder() {
  const r = state.current;
  const files = state.recipes.flatMap(x => {
    const f = x.file || slug(x.name) + ".md";
    return x.source === "card" ? [[f, x === r], [f.replace(".md", "-card.jpg"), false]] : [[f, x === r]];
  }).sort((a, b) => a[0].localeCompare(b[0]));
  $("#finder-files").innerHTML = files.map(([f, isNew]) =>
    `<li class="${isNew ? "is-new" : ""}"><span>${esc(f)}</span><span>${f.endsWith(".jpg") ? "Photo" : "Text"}</span></li>`).join("");
  $("#finder-preview").textContent = recipeFile(r);
  $("#dlg-finder").showModal();
}

function bindScreen() {
  const s = $("#search", view);
  if (s) s.addEventListener("input", e => {
    state.query = e.target.value;
    render();
    const n = $("#search", view); n.focus(); n.setSelectionRange(n.value.length, n.value.length);
  });

  const typeForm = $("[data-type-form]", view);
  if (typeForm) {
    const input = $("[data-type-input]", typeForm);
    const id = typeForm.dataset.typeForm;
    const l = state.lines.find(x => x.id === id);
    input.focus();
    if (state.typingId === id) {
      const at = l.read.indexOf(l.unsure.frag);
      input.setSelectionRange(at, at + l.unsure.frag.length);
    }
    typeForm.addEventListener("submit", e => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      const patch = state.typingId === id
        ? { value: v, status: "checked", unreadable: false }
        : { value: v, status: v === l.read ? "clear" : "edited" };
      resolve(id, patch);
    });
    input.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); state.typingId = state.editingId = null; render(); } });
  }
}

view.addEventListener("click", e => {
  const t = e.target.closest("button, [data-line], .ref");
  if (!t) return;
  const d = t.dataset;

  if (d.go) return go(d.go, d.go === "box" ? { tab: "All" } : {});
  if (d.tab) return go("box", { tab: d.tab });
  if (d.open) {
    const r = state.recipes.find(x => x.id === d.open);
    if (r.lines) { r.justSaved = false; state.current = r; return go("saved"); }
    return go("stub", { stubName: "Recipe Detail for " + r.name });
  }
  if (d.source) return go("add", { addSource: d.source });
  if ("sample" in d) return startImport();

  if (d.choose) {
    const l = state.lines.find(x => x.id === d.choose);
    const o = l.unsure.options[d.k];
    return resolve(d.choose, o.unreadable ? { status: "checked", unreadable: true } : { status: "checked", value: o.value });
  }
  if (d.type) { state.typingId = d.type; state.editingId = null; return render(); }
  if ("typeCancel" in d) { state.typingId = state.editingId = null; return render(); }
  if (d.edit) { state.editingId = d.edit; state.typingId = null; return render(); }
  if (d.undo) {
    const l = state.lines.find(x => x.id === d.undo);
    Object.assign(l, { status: "unsure", value: l.read, unreadable: false });
    render();
    return focusNextUnsure(state.lines[state.lines.indexOf(l) - 1]?.id);
  }
  if (t.classList.contains("ref")) {
    const id = d.ref;
    setActive(id);
    $(`[data-line="${id}"]`, view)?.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    $(`[data-line="${id}"] .choice, [data-line="${id}"] button`, view)?.focus();
    return;
  }
  if (d.line) return setActive(d.line);

  if ("save" in d) return trySave();
  if ("cancel" in d) return $("#dlg-cancel").showModal();
  if ("finder" in d) return openFinder();
  if ("print" in d) return window.print();
  if ("next" in d) return go("add", { addSource: "photo" });
  if (d.col) {
    const r = state.current;
    r.collections = r.collections.includes(d.col) ? r.collections.filter(c => c !== d.col) : [...r.collections, d.col];
    render(`[data-col="${CSS.escape(d.col)}"]`);
  }
});

view.addEventListener("mouseover", e => {
  if (state.screen !== "review" || state.reading) return;
  const ref = e.target.closest(".ref, [data-line]");
  if (ref) setActive(ref.dataset.ref || ref.dataset.line);
});
view.addEventListener("focusin", e => {
  if (state.screen !== "review") return;
  const row = e.target.closest("[data-line]");
  if (row) setActive(row.dataset.line);
});

// Sidebar
$(".sidebar").addEventListener("click", e => {
  const b = e.target.closest("[data-nav]");
  if (!b) return;
  if (state.screen === "review" && !state.reading) return $("#dlg-cancel").showModal();
  const n = b.dataset.nav;
  if (n === "box") go("box", { tab: "All" });
  else if (n.startsWith("col:")) go("box", { tab: n.slice(4) });
  else go("stub", { stubName: n.slice(5) });
});

// Dialogs
$("#dlg-cancel").addEventListener("click", e => {
  if (e.target.closest("[data-keep]")) $("#dlg-cancel").close();
  if (e.target.closest("[data-close]")) { $("#dlg-cancel").close(); state.reading = false; go("box", { tab: "All" }); }
});
$("#dlg-finder").addEventListener("click", e => { if (e.target.closest("[data-close]")) $("#dlg-finder").close(); });

// Keyboard: desktop-native shortcuts
document.addEventListener("keydown", e => {
  const typing = e.target.matches("input, textarea");
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && state.screen === "review") {
    e.preventDefault();
    return trySave();
  }
  if (typing || document.querySelector("dialog[open]")) return;
  if (e.key === "?") return toggleNotes();
  if (e.key === "Escape" && !$("#notes").hidden) return toggleNotes(false);
  if (state.screen === "review" && !state.reading && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
    const unsure = state.lines.filter(l => l.status === "unsure");
    if (!unsure.length) return;
    e.preventDefault();
    const cur = unsure.findIndex(l => l.id === state.activeId);
    const next = unsure[(cur + (e.key === "ArrowDown" ? 1 : -1) + unsure.length) % unsure.length];
    setActive(next.id);
    $(`[data-line="${next.id}"] .choice`, view)?.focus();
    $(`[data-line="${next.id}"]`, view)?.scrollIntoView({ block: "nearest" });
  }
});

// ---------- Design notes: which decision and which Mobbin reference shaped each screen ----------
const NOTES = {
  box: [
    ["decision", "Collections are tags, not folders (C13a Q7/Q8)", "Egusi Soup sits in both Mom's cards and Sunday. The sidebar and the tabs are two views of the same tags."],
    ["mobbin", "Mnogo Kroshek menu", "Underlined text tabs for Collections instead of pills, a bordered card grid, and a corner chip used only for “Just added”."],
    ["decision", "Backup in plain words (C13a Q2/Q4)", "The sidebar says where the recipes live, as files. There's no account and no sync jargon."],
    ["decision", "Fail gracefully (kickoff constraint)", "Meal Plan, Shopping List and Settings open a clear “not in this prototype” screen instead of a broken one."],
  ],
  add: [
    ["decision", "New T2: how “one at a time” feels (Q6)", "The limit is stated before the first photo, as a reason (a careful look per card), not found out at card #40. After each save, “Import the next card” loops back here with a running count."],
    ["decision", "Assumption: photo reading is online", "OCR costs money per call (kickoff), so it probably runs on a server. Larder says so up front, and says the recipe stays local afterwards. Needs Theo to confirm."],
    ["gap", "No Mobbin reference", "None of the five references covers choosing an import source. This layout is my own call."],
  ],
  review: [
    ["decision", "Low confidence blocks save (C13a Q5)", "Save to Box stays disabled until every circled line is settled. The bar says how many are left, so the block always has a stated reason."],
    ["decision", "Confidence on the exact line (Q5, added precision)", "Each uncertain line names what's uncertain (“could be a 1 or a 7”) and offers fixes. For the smudged time, Larder won't offer a number. Marcus can type it or keep it as “smudged on card”, which keeps the card's own history."],
    ["mobbin", "Navore / Daily Harvest", "Rows with a status pill (Not sure / You checked) and a progress bar that fills as lines are settled. The dark olive pill button is the only primary action."],
    ["mobbin", "Spicy Bomb Tuna Gimbab", "While the card is read, lines appear one by one next to the photo and the current line lights up on the card. The wait shows what's happening instead of a spinner."],
    ["mobbin", "Kale Caesar", "A pencil edit on every line, including the ones Larder read clearly. Marcus can still correct anything."],
    ["gap", "Missing reference: side-by-side review", "None of the references shows extracted data next to its source, or a save blocked until items are resolved. The two-pane layout and the red-pencil circles are my own reasoning from Q5 and Marcus's fear of mangled fractions. Worth finding a Mobbin reference for (receipt or ID scanning flows)."],
    ["decision", "Kitchen-proof, desktop-native", "18px base type for Marcus. ↑/↓ moves between circled lines, ⌘S saves. Cancel confirms and says nothing is lost."],
  ],
  saved: [
    ["mobbin", "Miso Mushroom Pasta", "An editorial sheet: large title, ingredients in two columns with the quantity first, numbered steps in two columns. The same layout is the print view (a Must)."],
    ["decision", "Backup you can see (C13a Q2/Q4)", "“Show in Finder” opens the folder and the plain-text file, including which lines Marcus checked. “If I can't see the file, I don't believe it exists.”"],
    ["decision", "Multiple Collections (C13a Q8)", "Mom's cards is pre-selected because that's where he started. Sunday and the others are one click away."],
    ["decision", "New T2: the next-card loop (Q6)", "The main action is “Import the next card”, with a running count of Mom's cards. One at a time feels like progress, not a limitation."],
  ],
  stub: [
    ["decision", "Fail gracefully (kickoff constraint)", "Theo: “don't let the nav point at a broken screen.” Unbuilt screens say what they are and offer a way back."],
  ],
};
function renderNotes() {
  const tagText = { decision: "Decision", mobbin: "Mobbin reference", gap: "Reference gap" };
  $("#notes-body").innerHTML = (NOTES[state.screen] || []).map(([t, h, p]) =>
    `<div class="note"><span class="tag tag-${t}">${tagText[t]}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("");
}
function toggleNotes(force) {
  const n = $("#notes");
  const open = force ?? n.hidden;
  n.hidden = !open;
  $("#notes-toggle").setAttribute("aria-expanded", open);
}
$("#notes-toggle").addEventListener("click", () => toggleNotes());
$("#notes-close").addEventListener("click", () => toggleNotes(false));

render();
