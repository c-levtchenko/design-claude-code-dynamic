# DCCD-1 — Design decisions

**Prototype:** `index.html` in this folder. Static HTML/CSS/JS, no build step, no
backend — open `index.html` directly in a browser.

**Persona and job:** Lena Ferreira, the Precision Baker. She's baking Pumpkin Scones
with Chai Glaze for a friend's gathering that needs 12 servings instead of the
recipe's default 8, and she wants exact gram measurements — she has zero tolerance for
rounding ambiguity (`larder-design-partner` skill, Section C9).

**Flow:** Box → Recipe Detail (Pumpkin Scones) → adjust servings and/or units, see the
baking caveat and recalculated quantities → Start Cooking (honest stub, see below).

---

## Reference UI

Carol supplied 4 real screenshots directly in this conversation rather than a live
Mobbin MCP search (her explicit choice when asked). Logged here as the ticket's
required "real reference UI" — these are real product screens, not literal Mobbin
citations, and that distinction matters if anyone revisits this later.

| Reference | What it shows | Decision it shaped |
|---|---|---|
| Blue Apron — Steak Tacos recipe page (servings row with a "with Bistro Steaks ▾" dropdown; "GET COOKING" primary button) | A compact dropdown control living right next to the servings count; a strong, warm primary CTA at the foot of the recipe | The servings control is a pill-shaped `<select>` next to "Serves," not a separate settings panel or a plain +/- stepper. The "Start Cooking" button reuses the same warm, high-contrast CTA treatment and position. |
| Pinterest — pin for the *same* recipe, "Pumpkin Scones with Chai Glaze" (ingredients shown as "2 cups (240g) flour," both units simultaneously) | Dual-unit display shown at once | Considered and **rejected** in favor of a toggle — see Decision 2. The mock data's recipe title matches this pin on purpose, so the reference and the prototype content visibly line up. |
| Blue Apron — step-by-step instructions page (numbered step circles, two-column step+photo layout) | Numbered step badges paired with a photo | Shaped the step list's numbered-circle treatment in Recipe Detail. |
| HelloFresh — instructions page (a distinct "Utensils" list; key ingredients bolded inline within step prose) | A separate Utensils block; bolded ingredient callouts inside step text | Shaped the Utensils rail block and the bolded-ingredient-in-step convention (`<strong>flour</strong>`, etc.) in the step list. |

---

## Decision traced to C13a (already resolved — not re-litigated)

**Q11 — Should scaling be offered on every recipe, or should baking-type recipes show
a caveat (or be excluded)?**

Resolved at the kickoff call: *scaling is offered on every recipe; baking-type recipes
show an inline caveat rather than being blocked or silently scaled.* This prototype is
a direct implementation of that resolution — see the caveat banner that appears when
Lena scales the (baking-type) scone recipe to a non-default serving count, and the two
"Should" business requirements it also serves (C5): scale servings with automatic
quantity conversion, and US customary ⇄ metric unit conversion.

---

## New decisions (Template T2 — not in C13a, logged here for the team)

### Decision 1 — How does a recipe get flagged "baking-type" for the Q11 caveat?

**Options considered:**
1. Silent system judgment — the app decides internally and the user never sees the
   flag; the caveat just appears or doesn't.
2. Fully manual — the user tags every recipe as baking-type themselves, with no
   system help.
3. Hybrid — auto-detect via a leavening-ingredient keyword scan (baking powder,
   baking soda, yeast, cream of tartar), surfaced as a visible, user-editable badge.

**Recommendation:** Option 3, the hybrid. Implemented in the prototype as the
"Baking · auto-detected" chip on the recipe rail — click it and it toggles to "Not
flagged as baking" (and the caveat banner disappears on the next scale, even though
the ingredients still contain baking powder).

**Rationale:** Ties to "Honest precision" (C8) and to the same trust principle behind
Marcus's low-confidence-import review (Q5) — the system can guess, but it must never
guess silently. A hidden judgment call (Option 1) repeats the exact trust failure the
team already ruled out for imports, just in a different feature. Fully manual (Option
2) is safer but adds friction to every single recipe entry for no benefit to Dana or
Marcus, who don't share Lena's stakes here.

**Trade-offs accepted:** the keyword scan will occasionally mis-flag (e.g. a recipe
using "baking soda" as a cleaning reference in a note) — acceptable because the badge
is visible and one click to correct, unlike a silent miscalculation.

**Status:** Decided (for this prototype) — proposed for the team's build, not final
until Priya/Theo sign off.

---

### Decision 2 — Toggle between units, or show both at once (like the Pinterest reference)?

**Options considered:**
1. Show both US and metric simultaneously per ingredient line, as the Pinterest
   reference does ("2 cups (240g) flour").
2. A single toggle (Cups / Grams) that switches the whole ingredient list's display.

**Recommendation:** Option 2, the toggle — built in the prototype as the segmented
control next to the servings selector.

**Rationale:** Showing both units at once looks more complete at a glance, but it
risks implying two independently precise values instead of one converted one — exactly
the kind of false precision "Honest precision" (C8) warns against, and exactly what
would erode Lena's trust fastest, since she's the persona least tolerant of rounding
ambiguity. A single toggle keeps one honest source of truth on screen at a time.

**Trade-offs accepted:** a toggle costs Lena one extra click if she genuinely wants to
cross-check both systems side by side (e.g., converting a US recipe for a European
oven). Judged worth it for the clarity gain on every other read of the screen.

**Status:** Decided (for this prototype) — a real trade-off against the Pinterest
reference, not an oversight of it.

---

### Decision 3 — Rounding behavior for scaled quantities

**Options considered:**
1. Show the raw scaled math (e.g., "0.583 cup"), fully precise but unusable in a
   kitchen.
2. Round silently to a clean number with no indication rounding happened.
3. Round to a practical measure, and disclose once, in plain language, that rounding
   occurred.

**Recommendation:** Option 3. Implemented as: US customary rounds to the nearest
practical kitchen fraction (nearest 1/8, using standard fraction glyphs); metric rounds
to the nearest practical gram (nearest 0.5 g under 10 g, nearest 1 g under 200 g,
nearest 5 g above that). A single disclosure line appears above the ingredient list
whenever the serving count differs from the recipe's default: "Amounts are scaled from
the original 8-serving recipe and rounded to the nearest practical measure — not a raw
multiply."

**Rationale:** A silent round (Option 2) is the same dishonesty "Honest precision"
rules out elsewhere in the brief, just expressed as a number instead of a claim. Fully
raw math (Option 1) is honest but useless at arm's length in a kitchen — it fails the
"Kitchen-proof" principle (C8) even though it never lies. One clear disclosure line,
rather than a rounding mark on every single ingredient row, keeps the screen legible
(restraint) while still being truthful about what happened.

**Status:** Decided (for this prototype).
