/* Larder — Marcus imports one of his mother's handwritten cards (DCCD-1).
   Static prototype: all data is mocked, nothing persists. */

// ---------- Data ----------

const BOX = [
  { t: "Sunday Pot Roast", src: "Typed in", tags: ["Grandma’s"] },
  { t: "Pepper Soup", src: "Typed in", tags: ["Grandma’s"] },
  { t: "Coconut Rice", src: "From a photo", tags: ["Grandma’s"] },
  { t: "Egg Custard Pie", src: "From a photo", tags: ["Grandma’s", "Baking"] },
  { t: "Peach Cobbler", src: "From a web page", tags: ["Magazine clippings", "Baking"] },
  { t: "Braised Short Ribs", src: "From a web page", tags: ["Magazine clippings"] },
  { t: "Chicken & Dumplings", src: "Typed in", tags: [] },
  { t: "Buttermilk Biscuits", src: "From a web page", tags: ["Magazine clippings", "Baking"] },
  { t: "Oxtail Stew", src: "Typed in", tags: [] },
  { t: "Cornbread Dressing", src: "Typed in", tags: ["Holidays"] },
  { t: "Plantain Bread", src: "From a photo", tags: ["Holidays"] },
];

// What's physically written on the card, one entry per ruled line.
const CARD = [
  { text: "Lemon Loaf — Mother’s", cls: "title" },
  { text: "1½ c. flour", cls: "faint" },
  { text: "1 c. sugar" },
  { text: "2 tsp b.p." },
  { text: "¼ tsp salt" },
  { text: "2 eggs, ½ c. milk" },
  { text: "½ c. butter, melted" },
  { text: "rind of 1 lemon" },
  { text: "Mix dry. Beat eggs, milk, butter." },
  { text: "Stir in. Greased loaf pan." },
  { text: "Bake 35° 1 hr.", cls: "faint" },
  { text: "Glaze: juice of lemon + ⅓ c sugar," },
  { text: "pour on while hot." },
];

// What Larder read. `card` points at the ruled line(s) it came from.
const PARSED = {
  ingredients: [
    { id: "i1", card: [1], unsure: true, read: "11 cups flour",
      why: "The mark after the 1 is faint. It could be ½ or a second 1.",
      choices: [
        { v: "1½ cups flour", hint: "Larder’s best guess" },
        { v: "11 cups flour", hint: "as first read" },
      ] },
    { id: "i2", card: [2], read: "1 cup sugar" },
    { id: "i3", card: [3], unsure: true, read: "2 tsp baking powder",
      why: "“b.p.” is shorthand. It usually means baking powder, but Larder can’t be sure.",
      choices: [
        { v: "2 tsp baking powder", hint: "Larder’s best guess" },
        { v: "2 tsp b.p.", hint: "keep it as she wrote it" },
      ] },
    { id: "i4", card: [4], read: "¼ tsp salt" },
    { id: "i5", card: [5], read: "2 eggs" },
    { id: "i6", card: [5], read: "½ cup milk" },
    { id: "i7", card: [6], read: "½ cup butter, melted" },
    { id: "i8", card: [7], read: "Rind of 1 lemon" },
  ],
  steps: [
    { id: "s1", card: [8], read: "Mix dry. Beat eggs, milk, butter." },
    { id: "s2", card: [9], read: "Stir in. Pour into a greased loaf pan." },
    { id: "s3", card: [10], unsure: true, read: "Bake at 35° for 1 hr.",
      why: "No oven bakes at 35°. A digit may have faded.",
      choices: [
        { v: "Bake at 350°F for 1 hr.", hint: "Larder’s best guess" },
        { v: "Bake at 35° for 1 hr.", hint: "as written" },
      ] },
    { id: "s4", card: [11, 12], read: "Glaze: juice of the lemon + ⅓ cup sugar. Pour on while hot." },
  ],
};

const COLLECTIONS = [
  { name: "Grandma’s", cls: "g", mark: "G" },
  { name: "Baking", cls: "b", mark: "B" },
  { name: "Holidays", cls: "h", mark: "H" },
  { name: "Magazine clippings", cls: "m", mark: "M" },
];

// Design notes — lettered pins shown on screen when "Design notes" is on.
const REFS = [
  { k: "A", title: "The Rewards card became the title block",
    from: "Tripadvisor › Explore — “Rewards” card",
    body: "A white card with a heading, then rows that each pair an icon tile with one plain fact. Here the rows say where the recipe came from and how sure Larder is about it, so Source and Parse Confidence sit right under the title.",
    ties: "C4 Source · C8 Honest precision" },
  { k: "B", title: "Changed: unsure lines are amber, not lime",
    from: "Tripadvisor › Explore — lime offer tiles",
    body: "In this style lime means good news (an offer, a reward). Using it for “please check this” would send the opposite signal, so lime marks lines that are checked and amber is kept for the lines that need Marcus’s eyes.",
    ties: "C13a Q5 (block save) · C8 Honest precision" },
  { k: "C", title: "The selected tab gets a filled pill",
    from: "Tripadvisor › Explore — selected “Explore” item in the tab bar",
    body: "The import stepper uses the same soft filled pill for where Marcus is now, plus a number or a check, so it reads without relying on colour. Text stays at 16px or larger, because Marcus prefers larger text.",
    ties: "C9 Marcus" },
  { k: "D", title: "Thin-outlined pill for values you can change",
    from: "Tripadvisor › Explore — search field",
    body: "Serves and time share one outlined pill and are edited in place. When the card doesn’t give a value, it says “Not on the card” instead of making up a number.",
    ties: "C8 Honest precision" },
  { k: "E", title: "Icon tiles became the Collection picker",
    from: "Tripadvisor › Explore — Rewards row tiles",
    body: "Each Collection is a tile you can toggle, and you can pick several, because a recipe can belong to more than one Collection. Nothing starts selected, because Collections are manual-only.",
    ties: "C13a Q7 (manual) · Q8 (tag model)" },
  { k: "F", title: "The floating tab bar, turned into a sidebar",
    from: "Tripadvisor › Explore — frosted bottom tab bar",
    body: "Same frosted panel, line icons, and filled pill for the current item. But Larder is desktop-only, so it’s a sidebar that’s always visible, not a bar along the bottom.",
    ties: "C8 Desktop-native · C5 Won’t: phone app" },
  { k: "G", title: "Not used: full-bleed photo deals",
    from: "Tripadvisor › Explore — “Discover Travel Deals” photo cards",
    body: "The only photograph on the review screen is his mother’s card, and it’s the warmest thing on the page. The archive is personal, not a catalog.",
    ties: "C8 Personal, not social · Warm, not sterile" },
  { k: "I", title: "The promo strip became a status strip",
    from: "Tripadvisor › Explore — “Up to $200 off” banner",
    body: "Same full-width strip, but it states what’s true rather than selling anything. Amber while lines are left to check, lime once they’re done, and lime again after the card is saved.",
    ties: "C13a Q1 (nothing to sell) · Q5" },
  { k: "H", title: "Backup is a folder you can see",
    from: "No reference. From the kickoff decision.",
    body: "After saving, the recipe’s next step toward being safe is spelled out: it isn’t in the backup folder yet, and exporting shows the actual files, including the original card photo.",
    ties: "C13a Q2 / Q4" },
  { k: "Q6", title: "Logged decision: one card at a time",
    from: "New decision record. See NOTES.md.",
    body: "The photo step says up front that cards go in one by one. After saving, “Add the next card” is the main action and there’s a quiet count, but no progress bar toward 200.",
    ties: "C12 Q6 (was open)" },
  { k: "X", title: "No reference yet: side-by-side review and blocked save",
    from: "The shared screenshots didn’t cover review or verification patterns.",
    body: "Designed from the Q5 decision and C8 principles. Worth sourcing document-scan review and blocking-validation references on Mobbin before DCCD-2.",
    ties: "C13a Q5" },
];

// ---------- State ----------

const state = {
  view: "box",
  resolved: {},        // id -> final text
  editing: null,       // id of line being hand-edited
  focus: null,         // id of parsed line under the pointer/focus
  collections: new Set(),
  serves: "",
  keepPhoto: true,
  title: "Lemon Loaf — Mother’s",
  saved: false,
  exported: false,
  added: 0,
};

const $ = (s, el = document) => el.querySelector(s);
const view = $("#view");
const allLines = () => [...PARSED.ingredients, ...PARSED.steps];
const unsureLines = () => allLines().filter(l => l.unsure);
const openCount = () => unsureLines().filter(l => !(l.id in state.resolved)).length;
const finalText = l => state.resolved[l.id] ?? l.read;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Views ----------

const svg = d => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON = {
  camera: svg('<path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4z"/><circle cx="12" cy="13" r="3.2"/>'),
  alert:  svg('<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.5M12 17.2v.3"/>'),
  check:  svg('<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.7 2.7L16 9.6"/>'),
  folder: svg('<path d="M3.5 7V18.5h17V8.5h-9L9.5 6h-6z"/>'),
  cards:  svg('<rect x="7" y="4" width="13" height="11" rx="1.5"/><path d="M4 8v11h13"/>'),
  globe:  svg('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>'),
};
const tile = (icon, cls = "") => `<span class="tile ${cls}" aria-hidden="true">${ICON[icon]}</span>`;
const rowItem = (icon, cls, main, sub = "") =>
  `<li class="row-item">${tile(icon, cls)}<span><strong>${main}</strong>${sub ? `<span class="sub">${sub}</span>` : ""}</span></li>`;

function stepper(current, strip = "") {
  const steps = ["Photo", "Reading", "Review", "Saved"];
  const i = steps.indexOf(current);
  return `<div class="stickyhead"><nav class="stepper" aria-label="Import progress" data-ref="C"><ol>${
    steps.map((s, n) => `<li class="${n < i ? "done" : n === i ? "current" : ""}" ${n === i ? 'aria-current="step"' : ""}>${s}</li>`).join("")
  }</ol></nav>${strip}</div>`;
}

function cardHTML(lit = []) {
  return `<div class="card" aria-hidden="true">${
    CARD.map((l, i) => {
      const hl = lit.find(x => x.i === i);
      return `<div class="card-line ${l.cls || ""} ${hl ? "hl" : ""} ${hl && hl.ok ? "ok" : ""}">${esc(l.text)}</div>`;
    }).join("")
  }</div>`;
}

const Views = {
  box() {
    const items = [...BOX];
    if (state.saved) items.unshift({ t: state.title, src: "From a photo", tags: [...state.collections], isNew: true });
    return `<section class="page">
      <div class="box-head">
        <div>
          <h1>Your Box</h1>
          <p class="muted">${items.length} recipes, all on this computer.</p>
        </div>
        <button class="btn primary" data-action="add">Add recipe <kbd>⌘N</kbd></button>
      </div>
      <div class="search" aria-hidden="true">${ICON.search}Search by title, tag, or ingredient</div>
      <div class="grid">${items.map(r => `
        <article class="rcard ${r.isNew ? "new" : ""}" ${r.isNew ? 'data-action="open-saved" tabindex="0" role="button"' : ""}>
          ${r.isNew ? '<span class="new-mark">Just added</span>' : ""}
          <h3>${esc(r.t)}</h3>
          <span class="src">${r.src}</span>
          <div class="tags">${r.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </article>`).join("")}
      </div>
    </section>`;
  },

  source() {
    return `${stepper("Photo")}
    <section class="page">
      <h1>Add a recipe</h1>
      <p class="muted">Where is this one coming from?</p>
      <div class="sources" role="group" aria-label="Recipe source">
        <button class="source" aria-disabled="true" data-action="not-here"><strong>Type it in</strong><span>Title, ingredients, and steps by hand.</span></button>
        <button class="source" aria-disabled="true" data-action="not-here"><strong>From a web page</strong><span>Paste a link and Larder reads the recipe.</span></button>
        <button class="source" data-action="pick-photo" aria-pressed="true"><strong>From a photo</strong><span>A recipe card, a cookbook page, a clipping.</span></button>
      </div>

      <div class="drop">
        <div>
          <h2>Choose a photo of the card</h2>
          <p class="muted small">Drag it here, or pick one from Pictures.</p>
          <ul>
            <li><button class="file" data-action="use-photo">
              <span class="thumb" aria-hidden="true"></span>
              <span><span class="fname">IMG_2231.jpg</span><span class="fmeta">Pictures · today, 10:14 am</span></span>
            </button></li>
            <li><button class="file" data-action="use-photo">
              <span class="thumb" aria-hidden="true"></span>
              <span><span class="fname">IMG_2232.jpg</span><span class="fmeta">Pictures · today, 10:15 am</span></span>
            </button></li>
          </ul>
        </div>
        <ul class="promise rows" data-ref="Q6">
          ${rowItem("cards", "", "One card at a time.", "Larder reads each card, then shows you anything it isn’t sure about. Nothing is saved to your Box until you’ve checked it.")}
          ${rowItem("globe", "pale", "Reading needs the internet.", "Everything else in Larder works offline.")}
        </ul>
      </div>
    </section>`;
  },

  reading() {
    return `${stepper("Reading")}
    <section class="page reading">
      <div class="photo scan" data-ref="G">${cardHTML()}</div>
      <div>
        <h1>Reading the card</h1>
        <ol class="checklist" id="checklist">
          <li class="active">Straightening the photo</li>
          <li>Reading the handwriting</li>
          <li>Matching amounts to ingredients</li>
        </ol>
        <p class="note-online">The original photo stays on this computer, and it’s kept with the recipe.</p>
        <button class="btn quiet" data-action="cancel-read">Cancel</button>
      </div>
    </section>`;
  },

  review() {
    const open = openCount();
    const lit = [];
    const f = allLines().find(l => l.id === state.focus);
    if (f) f.card.forEach(i => lit.push({ i, ok: !f.unsure || f.id in state.resolved }));

    const lineHTML = l => {
      const card = l.card.map(i => CARD[i].text).join(" ");
      if (!l.unsure) {
        return `<li class="line ${state.focus === l.id ? "focus" : ""}" data-line="${l.id}" tabindex="0">
          <span class="txt">${esc(l.read)}</span><span class="sure">Sure</span></li>`;
      }
      const done = l.id in state.resolved;
      if (done && state.editing !== l.id) {
        return `<li class="line unsure resolved ${state.focus === l.id ? "focus" : ""}" data-line="${l.id}" tabindex="0">
          <div class="unsure-head"><strong>Checked by you</strong></div>
          <div class="resolved-row"><span class="txt">${esc(state.resolved[l.id])}</span>
          <button class="linkish" data-action="reopen" data-id="${l.id}">Change</button></div></li>`;
      }
      return `<li class="line unsure ${state.focus === l.id ? "focus" : ""}" data-line="${l.id}" tabindex="0" data-ref="B" id="line-${l.id}">
        <div class="unsure-head"><strong>Not sure. Please check this line</strong></div>
        <p class="oncard">On the card: <span class="handsnip">${esc(card)}</span></p>
        <p class="why">${esc(l.why)}</p>
        <div class="choices" role="group" aria-label="What does the card say?">
          ${l.choices.map(c => `<button class="choice" data-action="choose" data-id="${l.id}" data-v="${esc(c.v)}" aria-pressed="${state.resolved[l.id] === c.v}">${esc(c.v)}<span class="hint">${c.hint}</span></button>`).join("")}
          <button class="choice" data-action="edit" data-id="${l.id}">Type it myself</button>
        </div>
        ${state.editing === l.id ? `<div class="edit-row">
          <input id="edit-${l.id}" value="${esc(finalText(l))}" aria-label="Type the line as it should read">
          <button class="btn primary" data-action="save-edit" data-id="${l.id}">Use this</button></div>` : ""}
      </li>`;
    };

    const nUnsure = unsureLines().length;
    const strip = open
      ? `<div class="strip warn" data-ref="I" role="status">Nothing is saved to your Box until every unsure line is checked</div>`
      : `<div class="strip" data-ref="I" role="status">Every line checked. This card is ready to save.</div>`;
    return `${stepper("Review", strip)}
    <section class="review">
      <div class="review-left">
        <div class="photo" data-ref="G">${cardHTML(lit)}</div>
        <p class="photo-cap">IMG_2231.jpg. Point at any line to see where it came from on the card.</p>
      </div>

      <div>
        <div class="titleblock" data-ref="A">
          <label for="title">Title, as written on the card</label>
          <input class="title-input" id="title" value="${esc(state.title)}">
          <ul class="rows">
            ${rowItem("camera", "pale", "From a photo of a handwritten card", "IMG_2231.jpg")}
            ${rowItem("alert", "amber", "Parse Confidence: low", `${nUnsure} of ${allLines().length} lines unsure`)}
          </ul>
        </div>

        <div class="metapill" data-ref="D">
          <div><small>Serves</small>${state.serves
            ? `<button class="val" data-action="serves">${esc(state.serves)}</button>`
            : `<button class="val empty" data-action="serves">Not on the card</button>`}</div>
          <div><small>Bake time</small><button class="val" data-action="noop">1 hr</button></div>
        </div>

        <div class="section-h"><h2>Ingredients</h2><span class="muted small">${PARSED.ingredients.length} lines</span></div>
        <ul class="lines">${PARSED.ingredients.map(lineHTML).join("")}</ul>

        <div class="section-h"><h2>Steps</h2><span class="muted small">${PARSED.steps.length} steps</span></div>
        <ul class="lines">${PARSED.steps.map(lineHTML).join("")}</ul>

        <div class="section-h"><h2>Collections</h2><span class="muted small">Optional. Pick any, or none.</span></div>
        <div class="collections" data-ref="E">
          ${COLLECTIONS.map(c => `<button class="coll" data-action="coll" data-name="${esc(c.name)}" aria-pressed="${state.collections.has(c.name)}">
            <span class="disc ${c.cls}" aria-hidden="true">${c.mark}</span><span>${esc(c.name)}</span></button>`).join("")}
          <button class="coll" data-action="noop"><span class="disc n" aria-hidden="true">+</span><span>New Collection</span></button>
        </div>

        <label class="keep">
          <input type="checkbox" data-action="keep" ${state.keepPhoto ? "checked" : ""}>
          <span><strong>Keep the card photo with this recipe</strong><br><span class="muted small">It’s included when you export your Box, next to the recipe file.</span></span>
        </label>
      </div>
    </section>

    <div class="actionbar">
      <button class="btn quiet" data-action="discard">Discard this read</button>
      <span class="status ${open ? "left" : "clear"}" id="status">${open
        ? `${open} ${open === 1 ? "line" : "lines"} left to check before saving`
        : "All lines checked"}</span>
      <button class="btn primary" data-action="save" aria-disabled="${open > 0}" id="save-btn">Save to Box <kbd>⌘↩</kbd></button>
    </div>`;
  },

  saved() {
    const changed = unsureLines().filter(l => state.resolved[l.id] !== l.read).length;
    const lineOut = l => `${esc(finalText(l))}${l.unsure ? `<span class="corrected">checked by you</span>` : ""}`;
    return `${stepper("Saved", `<div class="strip" data-ref="I" role="status">Saved to your Box, exactly as you checked it</div>`)}
    <section class="page detail">
      <div>
        <div class="titleblock" data-ref="A">
          <h1>${esc(state.title)}</h1>
          <ul class="rows">
            ${rowItem("camera", "pale", "From a photo of a handwritten card", "IMG_2231.jpg")}
            ${rowItem("check", "", `You checked ${unsureLines().length} lines${changed ? `, changed ${changed}` : ""}`, "Nothing else was altered")}
          </ul>
        </div>
        <div class="metapill" data-ref="D">
          <div><small>Serves</small><span class="val ${state.serves ? "" : "empty"}" style="text-decoration:none">${state.serves ? esc(state.serves) : "Not on the card"}</span></div>
          <div><small>Bake time</small><span>1 hr</span></div>
          <div><small>Collections</small><span>${state.collections.size ? [...state.collections].map(esc).join(", ") : "None yet"}</span></div>
        </div>

        <div class="cols">
          <div><div class="section-h"><h2>Ingredients</h2></div>
            <ul class="ing">${PARSED.ingredients.map(l => `<li>${lineOut(l)}</li>`).join("")}</ul></div>
          <div><div class="section-h"><h2>Steps</h2></div>
            <ol class="steps">${PARSED.steps.map(l => `<li>${lineOut(l)}</li>`).join("")}</ol></div>
        </div>

        <div class="detail-actions">
          <button class="btn primary" data-action="not-here">Start Cook Mode</button>
          <button class="btn" data-action="not-here">Print</button>
          <button class="btn quiet" data-action="go-box">Back to Box</button>
        </div>
      </div>

      <aside class="rail">
        ${state.keepPhoto ? `<div class="panel"><h3>The original card</h3><p>Kept with the recipe, exactly as photographed.</p><div class="photo">${cardHTML()}</div></div>` : ""}

        <div class="panel" data-ref="H" id="backup-panel">${backupPanel()}</div>

        <div class="panel next-card" data-ref="Q6">
          <div class="panel-head">${tile("cards")}<p class="tally">${state.added} ${state.added === 1 ? "card" : "cards"} added from photos today</p></div>
          <p>Ready for the next one? Each card gets the same careful read.</p>
          <button class="btn" data-action="next-card">Add the next card</button>
        </div>
      </aside>
    </section>`;
  },
};

function backupPanel() {
  if (!state.exported) {
    return `<div class="panel-head">${tile("folder", "amber")}<h3>Not in your backup yet</h3></div>
      <p>Your Box was last exported on Sep 20 to <strong>Documents › Larder backup</strong>. This recipe was added after that.</p>
      <button class="btn primary" data-action="export">Export now</button>`;
  }
  const slug = state.title.replace(/[—–]/g, "-").replace(/[^\w\s’'-]/g, "").trim();
  return `<div class="panel-head">${tile("folder")}<h3>Backed up</h3></div>
    <p>Exported just now. These are ordinary files you can open, copy, or move anywhere.</p>
    <ul class="files">
      <li class="folder">Larder backup</li>
      <li class="indent fresh">${esc(slug)}.txt</li>
      ${state.keepPhoto ? `<li class="indent fresh">${esc(slug)} (original card).jpg</li>` : ""}
      <li class="indent">Sunday Pot Roast.txt</li>
      <li class="indent">Pepper Soup.txt</li>
      <li class="indent muted more">…and ${BOX.length - 2} more</li>
    </ul>
    <button class="linkish" data-action="noop">Show in Finder</button>`;
}

// ---------- Render ----------

function render(opts = {}) {
  const scroll = view.scrollTop;
  view.innerHTML = Views[state.view]();
  $("#box-count").textContent = BOX.length + (state.saved ? 1 : 0);
  // Keep sidebar Collection counts honest once the new card is saved into them.
  document.querySelectorAll(".nav-item.sub").forEach(a => {
    const name = a.firstElementChild.textContent;
    const n = BOX.filter(r => r.tags.includes(name)).length + (state.saved && state.collections.has(name) ? 1 : 0);
    a.querySelector(".count").textContent = n;
  });
  document.querySelectorAll(".nav-item").forEach(a => a.removeAttribute("aria-current"));
  $('.nav-item[data-action="go-box"]').setAttribute("aria-current", "page");
  if (opts.keepScroll) view.scrollTop = scroll; else view.scrollTop = 0;
  if (state.view === "reading") runReading();
  markNotesOnscreen();
}

function go(v) { state.view = v; render(); view.focus({ preventScroll: true }); }

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2400);
}

let readingTimers = [];
function runReading() {
  readingTimers.forEach(clearTimeout);
  const step = reduceMotion ? 350 : 1100;
  const items = () => [...document.querySelectorAll("#checklist li")];
  [1, 2, 3].forEach(n => readingTimers.push(setTimeout(() => {
    if (state.view !== "reading") return;
    items().forEach((li, i) => { li.className = i < n ? "done" : i === n ? "active" : ""; });
    if (n === 3) readingTimers.push(setTimeout(() => state.view === "reading" && go("review"), step * 0.6));
  }, step * n)));
}

function resetImport() {
  Object.assign(state, { resolved: {}, editing: null, focus: null, collections: new Set(), serves: "", keepPhoto: true, title: "Lemon Loaf — Mother’s" });
}

function modal(html) {
  $("#modal-root").innerHTML = `<div class="scrim" data-action="close-modal"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-h">${html}</div></div>`;
  $("#modal-root .dialog button:last-child")?.focus();
}
function closeModal() { $("#modal-root").innerHTML = ""; }

function trySave() {
  const open = openCount();
  if (open) {
    const next = unsureLines().find(l => !(l.id in state.resolved));
    const el = $(`#line-${next.id}`);
    el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    el?.focus({ preventScroll: true });
    state.focus = next.id;
    highlightCard();
    toast(`Check ${open === 1 ? "this line" : `these ${open} lines`} first. Then you can save.`);
    return;
  }
  state.saved = true;
  state.added += 1;
  go("saved");
  toast("Saved to your Box");
}

// Update only the card highlight on hover, so the list doesn't re-render under the pointer.
function highlightCard() {
  const f = allLines().find(l => l.id === state.focus);
  document.querySelectorAll(".review-left .card-line").forEach((el, i) => {
    const on = f && f.card.includes(i);
    el.classList.toggle("hl", !!on);
    el.classList.toggle("ok", !!on && (!f.unsure || f.id in state.resolved));
  });
  document.querySelectorAll(".line").forEach(el => el.classList.toggle("focus", el.dataset.line === state.focus));
}

// ---------- Events ----------

document.addEventListener("click", e => {
  const t = e.target.closest("[data-action]");
  if (!t) return;
  const a = t.dataset.action;
  if (t.tagName === "A") e.preventDefault();

  switch (a) {
    case "go-box": closeModal(); go("box"); break;
    case "add": resetImport(); go("source"); break;
    case "pick-photo": break;
    case "use-photo": go("reading"); break;
    case "cancel-read": readingTimers.forEach(clearTimeout); go("source"); break;
    case "not-here": toast("Not part of this prototype’s flow"); break;
    case "noop": break;

    case "choose":
      state.resolved[t.dataset.id] = t.dataset.v;
      state.editing = null;
      render({ keepScroll: true });
      break;
    case "edit":
      state.editing = t.dataset.id;
      render({ keepScroll: true });
      $(`#edit-${t.dataset.id}`)?.focus();
      break;
    case "save-edit": {
      const v = $(`#edit-${t.dataset.id}`).value.trim();
      if (!v) return;
      state.resolved[t.dataset.id] = v;
      state.editing = null;
      render({ keepScroll: true });
      break;
    }
    case "reopen":
      delete state.resolved[t.dataset.id];
      render({ keepScroll: true });
      break;
    case "serves": {
      const v = prompt("Serves how many? Leave blank if the card doesn’t say.", state.serves);
      if (v !== null) { state.serves = v.trim(); render({ keepScroll: true }); }
      break;
    }
    case "coll": {
      const n = t.dataset.name;
      state.collections.has(n) ? state.collections.delete(n) : state.collections.add(n);
      t.setAttribute("aria-pressed", state.collections.has(n));
      break;
    }
    case "keep": state.keepPhoto = t.checked; break;
    case "save": trySave(); break;

    case "discard":
      modal(`<h2 id="dlg-h">Discard this read?</h2>
        <p>What Larder read from the card will be thrown away. Your photo, IMG_2231.jpg, stays in Pictures. Nothing in your Box changes.</p>
        <div class="row"><button class="btn quiet" data-action="close-modal">Keep reviewing</button>
        <button class="btn primary" data-action="confirm-discard">Discard the read</button></div>`);
      break;
    case "close-modal":
      if (e.target === t || t.tagName === "BUTTON") closeModal();
      break;
    case "confirm-discard": closeModal(); resetImport(); go("box"); toast("Read discarded. Your photo is still in Pictures."); break;

    case "open-saved": go("saved"); break;
    case "export":
      state.exported = true;
      $("#backup-panel").innerHTML = backupPanel();
      $("#backup-status").classList.add("fresh");
      $("#backup-line").innerHTML = `Exported just now to <em>Documents › Larder backup</em>`;
      toast("Exported 12 recipes to Larder backup");
      break;
    case "next-card":
      resetImport(); go("source");
      toast("The first card is saved. Choose the next photo.");
      break;
  }
});

document.addEventListener("input", e => {
  if (e.target.id === "title") state.title = e.target.value;
});

document.addEventListener("pointerover", e => {
  if (state.view !== "review") return;
  const li = e.target.closest("[data-line]");
  const id = li ? li.dataset.line : null;
  if (id !== state.focus && li) { state.focus = id; highlightCard(); }
});
document.addEventListener("focusin", e => {
  if (state.view !== "review") return;
  const li = e.target.closest("[data-line]");
  if (li && li.dataset.line !== state.focus) { state.focus = li.dataset.line; highlightCard(); }
});

document.addEventListener("keydown", e => {
  const mod = e.metaKey || e.ctrlKey;
  if (e.key === "Escape" && $("#modal-root").innerHTML) closeModal();
  else if (mod && e.key.toLowerCase() === "n") { e.preventDefault(); resetImport(); go("source"); }
  else if (mod && e.key === "Enter" && state.view === "review") { e.preventDefault(); trySave(); }
  else if (e.key === "Enter" && e.target.matches(".rcard[data-action]")) go("saved");
  else if (e.key === "Enter" && e.target.id?.startsWith("edit-")) $(`[data-action="save-edit"][data-id="${e.target.id.slice(5)}"]`)?.click();
});

// ---------- Design notes ----------

const notesBtn = $("#notes-toggle");
const notes = $("#notes");
$("#notes-list").innerHTML = REFS.map(r => `<li data-letter="${r.k}" data-k="${r.k}">
  <b>${esc(r.title)}</b><span class="from">${esc(r.from)}</span>${esc(r.body)}<span class="ties">${esc(r.ties)}</span></li>`).join("");

function markNotesOnscreen() {
  const on = new Set([...document.querySelectorAll("#view [data-ref], .sidebar[data-ref]")].map(el => el.dataset.ref));
  if (state.view === "review") on.add("X");
  document.querySelectorAll("#notes-list li").forEach(li => li.classList.toggle("onscreen", on.has(li.dataset.k)));
}

notesBtn.addEventListener("click", () => {
  const on = notesBtn.getAttribute("aria-pressed") !== "true";
  notesBtn.setAttribute("aria-pressed", on);
  notes.hidden = !on;
  document.body.classList.toggle("notes-on", on);
  markNotesOnscreen();
});

// Jump straight to a step for reviews and screenshots: index.html#review, #saved, …
const jump = location.hash.slice(1);
if (jump === "saved" || jump === "exported" || jump === "checked") {
  unsureLines().forEach(l => { state.resolved[l.id] = l.choices[0].v; });
  state.collections.add("Grandma’s").add("Baking");
  if (jump !== "checked") { state.saved = true; state.added = 1; state.exported = jump === "exported"; }
}
state.view = { source: "source", reading: "reading", review: "review", checked: "review", saved: "saved", exported: "saved" }[jump] || "box";
if (state.exported) {
  $("#backup-status").classList.add("fresh");
  $("#backup-line").innerHTML = `Exported just now to <em>Documents › Larder backup</em>`;
}
render();
