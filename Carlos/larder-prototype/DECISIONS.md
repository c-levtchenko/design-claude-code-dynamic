# DCCD-1 — Design notes for the import-review prototype

**Flow:** Marcus Ibehi imports a recipe from a photo of his mother's handwritten card,
hits a low-confidence line, and has to resolve it before the recipe counts as saved.

**Files:** `index.html`, `styles.css`, `script.js` — open `index.html` directly in a
browser, no build step. Click path: Box → **Add a recipe** → **From a photo** → choose
the mock file → Continue → (auto) processing → Review → click the flagged breadcrumbs
line → correct the quantity → **Confirm this line** → **Save recipe** → Recipe Detail.

---

## Decision this traces to (already resolved — C13a, Q5)

> Low-confidence imports **block save** until reviewed. Only high-confidence imports
> may auto-save (dismissible banner). The confidence line itself should be visible,
> not a binary "trust me / don't."

This is the entire mechanic of the Review screen: nothing is silently accepted. Six of
eight ingredient lines render as quietly confirmed (a plain checkmark — confidence
doesn't need to shout when it's fine). One line — `2/8 cup breadcrumbs` — is the
literal nightmare scenario Marcus described in the kickoff transcript ("some other app
mangling a fraction... him not noticing until halfway through cooking"). It's flagged
amber, sits open for inspection, and the **Save recipe** button stays disabled with a
plain-language reason ("1 line needs a look") until he opens it, compares it against
the actual card, and confirms a value himself. The system never suggests a "correct"
number for him — that would be pretending to a confidence it doesn't have.

## New decision I'm logging (Q6 — still open per C13a)

```
Decision: Q6 — what "one at a time" import should actually feel like in the UI
Options considered:
  1. A queue/tray metaphor — user drops in several photos, Larder works through
     them with a progress count ("2 of 5").
  2. Strictly one photo per pass — the Add-a-photo entry point doesn't accept a
     second file until the first has been reviewed and saved (or cancelled).
Recommendation: Option 2.
Rationale: Ties to design principle 1 (Trust the archive) and to Marcus's watch-out
  specifically. A queue implies momentum — it invites treating review as a checklist
  to clear quickly, which is exactly the "review step becomes theater" failure Theo
  named on the kickoff call. Making it structurally one-at-a-time (no queue UI exists
  to rush toward) sets the expectation Priya asked for "on day one, not discovered on
  recipe forty" — there's no queue counter promising speed that a careful review step
  can't deliver.
Trade-offs accepted: Slower if Marcus ever wants to bring in several cards in one
  sitting — he re-opens "Add a recipe" per photo. Given bulk import is confirmed out
  of V1 specifically because per-photo OCR costs real money (kickoff transcript,
  Theo), this is consistent rather than a new limitation — the UI shouldn't imply a
  batch capability the backend was deliberately not built for.
Status: Decided for this prototype — flagging for the team to ratify or override.
```

---

## Mobbin references — which shaped which decision

Two screenshots were provided this session. Only one was usable; I'm logging both so
the trace is honest rather than implying more sourcing than actually happened.

**Used — komoot, Route Detail page (Web).**
Informed three specific pieces of the **Recipe Detail** screen (the screen Marcus
lands on after his review clears):
- The horizontal **stat-chip row** (komoot's Moderate · 01:00 · 6.00 mi · pace ·
  elevation) → adapted into Larder's servings · prep time · simmer time chips, plus
  one Larder-specific chip ("You reviewed this import") that has no komoot analog —
  it's the trust payoff the whole flow is building toward.
- The **inline-editable title** (name + pencil icon inline, not a separate edit mode)
  → used as-is for the recipe title treatment.
- The **tabbed content area** below the header (Activity Overview / Waypoints / Way
  Types & Surfaces / Route details) → adapted to Ingredients / Steps / Notes.

Explicitly **not** borrowed: komoot's social actions (Like, Comments, Organize group
run) and its public "Visibility: Anyone" field. Larder is personal, not social (design
principle 6) — a saved recipe has no equivalent surface, so none was added.

**Not used — AirOps marketing homepage.**
This was the first screenshot sent. It's a SaaS landing-page hero (announcement bar,
display headline, pill badge, CTA, product video). It doesn't contain any pattern this
flow needed — no review/confirm interaction, no per-field state, and Larder has no
marketing funnel to begin with (it's a desktop app opened straight into the product).
Rather than stretch it to justify a decision it didn't actually inform, it was set
aside per your instruction after I flagged the mismatch.

**No reference — the core review mechanic itself.**
The flagged-line pattern (per-field confidence, blocking save, inline compare-against-
source) has no Mobbin source. It's originated directly from the Q5 decision text and
Marcus's persona watch-outs in the skill brief, not from a screenshot. Noting this
plainly rather than retrofitting a citation.

---

## What's deliberately out of scope here

- Bulk import, Pantry, sync, platform-native chrome differences (Q3/Q9/Q13) — untouched,
  consistent with "still open" status in C13a.
- The **"From a web link"** and **"Type it in"** entries in the Add-a-recipe menu are
  visible (so the IA reads as complete) but not wired to their own screens — this
  ticket is one flow, not the whole Add-Recipe surface.
- Cook Mode — deliberately last in the product per design principle 7; not touched here.
