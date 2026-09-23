// Larder — recipe scaling prototype (DCCD-1)
// Persona: Lena Ferreira, the Precision Baker.
// Decision traced: Q11 (C13a) — scaling is offered on every recipe; baking-type
// recipes show an inline caveat rather than being blocked or silently scaled.
// New decisions (logged in DECISIONS.md): how "baking-type" gets flagged, unit
// toggle vs. simultaneous display, and rounding behavior for scaled quantities.

(function () {
  "use strict";

  /* ---------------------------------------------------------------- */
  /* Line-drawn recipe icons (no external image assets)                */
  /* ---------------------------------------------------------------- */

  const ICONS = {
    scone: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 20 L82 78 L18 78 Z" />
      <path d="M30 78 Q50 62 70 78" />
      <path d="M38 40 Q50 30 62 40" stroke-dasharray="1 6" />
    </svg>`,
    sourdough: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="50" cy="55" rx="34" ry="24" />
      <path d="M30 45 Q50 35 70 45" />
      <path d="M26 58 Q50 48 74 58" />
      <path d="M34 68 Q50 60 66 68" />
    </svg>`,
    cookies: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="32" />
      <circle cx="40" cy="42" r="3" fill="currentColor" stroke="none" />
      <circle cx="60" cy="46" r="3" fill="currentColor" stroke="none" />
      <circle cx="48" cy="62" r="3" fill="currentColor" stroke="none" />
      <circle cx="64" cy="60" r="3" fill="currentColor" stroke="none" />
    </svg>`,
    croissant: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 62 Q30 22 62 24 Q88 26 84 52 Q68 46 58 58 Q70 62 74 76 Q46 84 18 62 Z" />
      <path d="M32 52 Q42 44 50 50" />
      <path d="M40 64 Q50 58 58 64" />
    </svg>`,
  };

  /* ---------------------------------------------------------------- */
  /* Data (mocked — no backend, per ticket scope)                      */
  /* ---------------------------------------------------------------- */

  const BOX_RECIPES = [
    { id: "scones", title: "Pumpkin Scones with Chai Glaze", time: "45 min", tag: "Baking", icon: "scone" },
    { id: "sourdough", title: "Sourdough Loaf", time: "26 hr (mostly waiting)", tag: "Baking", icon: "sourdough" },
    { id: "cookies", title: "Brown Butter Chocolate Chip Cookies", time: "35 min", tag: "Baking", icon: "cookies" },
    { id: "croissants", title: "Weekend Almond Croissants", time: "3 hr", tag: "Baking", icon: "croissant" },
  ];

  // Fractions used when rounding US-customary quantities to a practical measure.
  const FRACTIONS = [
    { value: 0, label: "" },
    { value: 1 / 8, label: "⅛" },
    { value: 1 / 4, label: "¼" },
    { value: 1 / 3, label: "⅓" },
    { value: 3 / 8, label: "⅜" },
    { value: 1 / 2, label: "½" },
    { value: 5 / 8, label: "⅝" },
    { value: 2 / 3, label: "⅔" },
    { value: 3 / 4, label: "¾" },
    { value: 7 / 8, label: "⅞" },
  ];

  const SCONE_RECIPE = {
    id: "scones",
    title: "Pumpkin Scones with Chai Glaze",
    subtitle: "A weekend-baking recipe — flaky scones with a spiced chai glaze.",
    time: "45 min total · 15 min active",
    baseServings: 8,
    servingOptions: [6, 8, 10, 12, 16],
    isBakingType: true,
    icon: "scone",
    source: "Saved from a link · reviewed and confirmed",
    utensils: ["Large mixing bowl", "Pastry cutter (or fork)", "Whisk", "Baking sheet", "Parchment paper"],
    ingredients: [
      { name: "all-purpose flour", us: { amount: 2, unit: "cup" }, grams: 250, leavening: false },
      { name: "granulated sugar", us: { amount: 1 / 3, unit: "cup" }, grams: 65, leavening: false },
      { name: "baking powder", us: { amount: 1, unit: "Tbsp" }, grams: 12, leavening: true },
      { name: "fine salt", us: { amount: 3 / 4, unit: "tsp" }, grams: 4.5, leavening: false },
      { name: "pumpkin pie spice", us: { amount: 1, unit: "tsp" }, grams: 2, leavening: false },
      { name: "unsalted butter, cold and cubed", us: { amount: 1 / 2, unit: "cup" }, grams: 115, leavening: false },
      { name: "pumpkin puree", us: { amount: 1 / 2, unit: "cup" }, grams: 120, leavening: false },
      { name: "heavy cream", us: { amount: 1 / 4, unit: "cup" }, grams: 60, leavening: false },
      { name: "large egg", us: { amount: 1, unit: "egg" }, grams: 50, leavening: false },
      { name: "vanilla extract", us: { amount: 1, unit: "tsp" }, grams: 5, leavening: false },
      { name: "powdered sugar (for glaze)", us: { amount: 1, unit: "cup" }, grams: 120, leavening: false },
      { name: "milk (for glaze)", us: { amount: 2, unit: "Tbsp" }, grams: 30, leavening: false },
      { name: "chai spice blend (for glaze)", us: { amount: 1 / 2, unit: "tsp" }, grams: 1, leavening: false },
    ],
    steps: [
      "Preheat the oven to 400°F (200°C). Line a baking sheet with parchment paper.",
      "Whisk together the <strong>flour</strong>, <strong>sugar</strong>, <strong>baking powder</strong>, <strong>salt</strong>, and <strong>pumpkin pie spice</strong> in a large bowl.",
      "Cut the cold <strong>butter</strong> into the dry mix with a pastry cutter (or fork) until it resembles coarse crumbs.",
      "In a separate bowl, whisk the <strong>pumpkin puree</strong>, <strong>heavy cream</strong>, <strong>egg</strong>, and <strong>vanilla</strong> together, then fold into the dry ingredients until just combined.",
      "Turn the dough onto a floured surface, pat into a circle, and cut into {{wedges}} wedges.",
      "Bake 18–20 minutes until golden. Cool slightly, then whisk the <strong>powdered sugar</strong>, <strong>milk</strong>, and <strong>chai spice blend</strong> and drizzle over the scones.",
    ],
  };

  /* ---------------------------------------------------------------- */
  /* Scaling + unit conversion math                                    */
  /* ---------------------------------------------------------------- */

  function snapToFraction(amount) {
    const whole = Math.floor(amount);
    const remainder = amount - whole;
    let closest = FRACTIONS[0];
    let smallestDiff = Infinity;
    for (const f of FRACTIONS) {
      const diff = Math.abs(f.value - remainder);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closest = f;
      }
    }
    let displayWhole = whole;
    let displayFraction = closest.label;
    // Snapping remainder to 1 (i.e. nearest fraction rounds up to the next whole number).
    if (closest.value === 0 && smallestDiff > 0 && remainder > 0.9375) {
      displayWhole += 1;
      displayFraction = "";
    }
    if (displayWhole === 0 && displayFraction === "") return "0";
    if (displayWhole === 0) return displayFraction;
    if (displayFraction === "") return String(displayWhole);
    return displayWhole + " " + displayFraction;
  }

  function roundGrams(grams) {
    if (grams < 10) return Math.round(grams * 2) / 2; // nearest 0.5 g
    if (grams < 200) return Math.round(grams); // nearest 1 g
    return Math.round(grams / 5) * 5; // nearest 5 g
  }

  function formatGrams(grams) {
    const rounded = roundGrams(grams);
    const isWhole = Number.isInteger(rounded);
    return (isWhole ? rounded : rounded.toFixed(1)) + " g";
  }

  function pluralizeUnit(unit, amount) {
    if (unit === "egg") return amount === 1 ? "egg" : "eggs";
    return unit;
  }

  /* ---------------------------------------------------------------- */
  /* Rendering: Box                                                    */
  /* ---------------------------------------------------------------- */

  function renderBox() {
    const grid = document.getElementById("recipe-grid");
    grid.innerHTML = BOX_RECIPES.map(
      (r) => `
      <a class="recipe-card" href="#/recipe/${r.id}">
        <span class="thumb">${ICONS[r.icon]}</span>
        <span class="card-body">
          <h2>${r.title}</h2>
          <span class="meta">${r.time} &middot; ${r.tag}</span>
        </span>
      </a>`
    ).join("");
  }

  /* ---------------------------------------------------------------- */
  /* Rendering: Recipe Detail                                          */
  /* ---------------------------------------------------------------- */

  let bakingTypeOverride = null; // null = use recipe default; true/false = user override

  function isFlaggedBaking(recipe) {
    return bakingTypeOverride === null ? recipe.isBakingType : bakingTypeOverride;
  }

  function renderDetail() {
    const recipe = SCONE_RECIPE;

    document.getElementById("detail-photo").innerHTML = ICONS[recipe.icon];
    document.getElementById("detail-title").textContent = recipe.title;
    document.getElementById("detail-subtitle").textContent = recipe.subtitle + " " + recipe.time;
    document.getElementById("source-note").textContent = recipe.source;

    const utensilList = document.getElementById("utensil-list");
    utensilList.innerHTML = recipe.utensils.map((u) => `<li>${u}</li>`).join("");

    const select = document.getElementById("servings-select");
    select.innerHTML = recipe.servingOptions
      .map((n) => `<option value="${n}" ${n === recipe.baseServings ? "selected" : ""}>${n} scones</option>`)
      .join("");

    updateTypeBadge(recipe);
    renderScaledContent(recipe);

    select.addEventListener("change", () => renderScaledContent(recipe));
    document.querySelectorAll('input[name="units"]').forEach((input) => {
      input.addEventListener("change", () => renderScaledContent(recipe));
    });
  }

  function updateTypeBadge(recipe) {
    const badge = document.getElementById("type-badge");
    const label = document.getElementById("type-badge-label");
    const flagged = isFlaggedBaking(recipe);
    badge.dataset.active = String(flagged);
    badge.setAttribute("aria-pressed", String(flagged));
    label.textContent =
      bakingTypeOverride === null
        ? flagged
          ? "Baking · auto-detected"
          : "Not flagged as baking"
        : flagged
        ? "Baking · you flagged this"
        : "Not baking · you flagged this";
  }

  function renderScaledContent(recipe) {
    const servings = Number(document.getElementById("servings-select").value);
    const unit = document.querySelector('input[name="units"]:checked').value;
    const factor = servings / recipe.baseServings;
    const scaled = factor !== 1;

    const noteEl = document.getElementById("scale-note");
    noteEl.dataset.visible = String(scaled);

    const caveat = document.getElementById("caveat-banner");
    caveat.dataset.visible = String(scaled && isFlaggedBaking(recipe));

    const list = document.getElementById("ingredient-list");
    list.innerHTML = recipe.ingredients
      .map((ing) => {
        let qtyLabel;
        if (unit === "metric") {
          qtyLabel = formatGrams(ing.grams * factor);
        } else {
          const scaledAmount = ing.us.amount * factor;
          const unitLabel = pluralizeUnit(ing.us.unit, scaledAmount);
          qtyLabel = `${snapToFraction(scaledAmount)} ${unitLabel}`;
        }
        return `<li><span class="ingredient-qty">${qtyLabel}</span><span>${ing.name}</span></li>`;
      })
      .join("");

    const wedges = Math.max(4, Math.round(8 * factor));
    const stepList = document.getElementById("step-list");
    stepList.innerHTML = recipe.steps
      .map((s) => `<li><p>${s.replace("{{wedges}}", String(wedges))}</p></li>`)
      .join("");
  }

  /* ---------------------------------------------------------------- */
  /* View routing                                                      */
  /* ---------------------------------------------------------------- */

  const VIEWS = {
    box: document.getElementById("view-box"),
    detail: document.getElementById("view-detail"),
    stub: document.getElementById("view-stub"),
  };

  function showView(name) {
    Object.values(VIEWS).forEach((el) => (el.hidden = true));
    VIEWS[name].hidden = false;
    window.scrollTo(0, 0);
  }

  function showStub({ title, message, backHref, backLabel }) {
    document.getElementById("stub-title").textContent = title;
    document.getElementById("stub-message").textContent = message;
    const back = document.getElementById("stub-back");
    back.href = backHref;
    back.textContent = "← " + backLabel;
    showView("stub");
  }

  function route() {
    const hash = window.location.hash || "#/box";

    if (hash.startsWith("#/recipe/")) {
      const id = hash.replace("#/recipe/", "");
      if (id === "scones") {
        bakingTypeOverride = null;
        renderDetail();
        showView("detail");
        document.title = "Larder — " + SCONE_RECIPE.title;
        return;
      }
      const stubRecipe = BOX_RECIPES.find((r) => r.id === id);
      showStub({
        title: (stubRecipe ? stubRecipe.title : "This recipe") + " isn't built in this prototype",
        message:
          "DCCD-1 covers one complete flow — Lena scaling the Pumpkin Scones recipe — not full coverage of the Box. This card exists to show a realistic library, not as a working screen.",
        backHref: "#/box",
        backLabel: "Back to Box",
      });
      document.title = "Larder — Box";
      return;
    }
    if (hash === "#/cook-mode") {
      showStub({
        title: "Cook Mode isn't in this prototype",
        message:
          "This flow ends here on purpose. Cook Mode is the hardest screen in Larder — full-screen, arm's-length, messy-hands — and the larder-design-partner skill calls for designing it last, once earlier screens have taught us the content model. This button is a real link in the information architecture, not a dead end, but the screen behind it is deliberately out of scope for DCCD-1.",
        backHref: "#/recipe/scones",
        backLabel: "Back to recipe",
      });
      document.title = "Larder — Cook Mode";
      return;
    }
    renderBox();
    showView("box");
    document.title = "Larder — Box";
  }

  document.getElementById("type-badge").addEventListener("click", () => {
    bakingTypeOverride = !isFlaggedBaking(SCONE_RECIPE);
    updateTypeBadge(SCONE_RECIPE);
    renderScaledContent(SCONE_RECIPE);
  });

  window.addEventListener("hashchange", route);
  route();
})();
