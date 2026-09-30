# Larder: card import prototype (DCCD-1)

**Persona:** Marcus Ibehi, the Home Cook Archivist.
**Job:** get one of his mother's handwritten cards into his Box without Larder quietly changing it.
**Open it:** `index.html` in a browser. No build step. To jump to a step, add `#source`, `#reading`, `#review`, `#checked`, `#saved` or `#exported` to the URL.

## Flow

1. **Box.** Choose **Add recipe** (⌘N).
2. **Photo.** Choose **From a photo**, then pick a card. The panel says up front that cards go in one at a time.
3. **Reading.** A checklist shows each step as Larder reads the card, instead of a spinner.
4. **Review.** The card is on the left and what Larder read is on the right. Pointing at a line lights up where it came from on the card. Three lines are unsure, and **Save to Box** stays blocked until Marcus checks each one.
5. **Saved.** The recipe shows which lines Marcus checked, keeps the original card photo, and says plainly that it isn't in the backup yet. **Export now** lists the actual files. **Add the next card** leads straight into the next import.

## Decisions this traces to

| # | Status | How it shows up |
|---|---|---|
| Q5 | Decided at kickoff (C13a) | Low Parse Confidence blocks saving. Save stays disabled and shows how many lines are left. Pressing it anyway scrolls to the next unchecked line. |
| Q2 / Q4 | Decided at kickoff | Backup means readable files in a folder Marcus picks. The saved screen lists the `.txt` and the card `.jpg` by name. |
| Q7 / Q8 | Decided at kickoff | The Collection picker allows several choices and starts with none selected. |
| Q1 | Decided at kickoff | Nothing on these screens sells anything. The reference's promo strip was reused to state status, not to sell. |
| **Q6** | **Logged here (new)** | See the decision record below. |

## Design Decision Record: Q6, how one-at-a-time import should feel

**Decision:** Bulk import is out of V1, as confirmed at kickoff. This record covers how one-at-a-time import should feel to Marcus.

**Options considered:**
1. **Say nothing and let him find out.** Least work, but he discovers the limit around card #40 and feels misled. That breaks "Trust the archive."
2. **A progress target** ("12 of 200 cards"). Motivating, but it turns an unhurried review into a quota and pushes him to rush the step that protects the Trust guardrail.
3. **Say it up front, then make the next card easy to reach (recommended).** The photo step says "One card at a time" before he starts. After saving, **Add the next card** is the main action, next to a plain count ("1 card added from photos today") with no target.

**Recommendation:** Option 3.

**Rationale:** Marcus gets anxious about irreversible actions and needs a review step that doesn't rush him (C9). A quota works against that. Stating the limit on day one follows the brief's own note on Q6. The one-card pace also matches the per-call OCR cost that keeps bulk import out of V1 (C13a).

**Trade-offs accepted:** Getting through 200+ cards will feel slow, and nothing on screen pretends otherwise. The count only covers today, so there's no view of his overall progress. A later "cards from photos" filter in the Box could fill that gap without adding a quota.

**Status:** Decided for this prototype. Open for the team to challenge.

## Assumptions (not decisions)

- **Online reading.** Reading handwriting needs an internet connection, and the copy says so. This follows from OCR costing money per call. What Marcus sees when he's offline isn't designed yet.
- **Unsure lines.** Which lines count as unsure is mocked: a faint mark, a shorthand, and an impossible oven temperature.
- **Serves.** When the card doesn't give a serving count, the field says "Not on the card" instead of guessing (Honest precision).

## Visual reference

The UI follows Tripadvisor's iOS Explore screen (`mobbin-tripadvisor-explore.png`). It replaces the earlier Blue Apron Menu reference, which is still in the folder.

**Borrowed:**
- Heavy sans headlines in deep forest green (Figtree).
- White cards with a heading and rows that pair a lime icon tile with a fact. This became the title block and the backup panel.
- The thin-outlined pill search, used for search and for the Serves / time pill.
- The full-width promo strip, reused as a status strip.
- The frosted tab bar's filled pill for the current item, used in the sidebar and the stepper.

**Changed on purpose:**
- **Amber for unsure lines.** In this style lime means good news, so lime now marks lines that are checked, and amber is kept for lines that still need checking.
- **Sidebar instead of a bottom tab bar.** Larder is desktop-only.
- **No full-bleed photo deals.** The only photo on the page is the card itself.

**Trade-off to watch:** this style is cleaner and brighter than C8's "Warm, not sterile." Most of the warmth now comes from the handwritten card, so it's worth checking with Marcus-type users whether the app still feels like somewhere to keep family recipes.

## Reference gaps

The side-by-side review and the blocked Save were designed from Q5 and C8, not from either reference. Before DCCD-2, it's worth pulling document-scan review screens (Adobe Scan, Genius Scan) and form validation that blocks submission (Stripe onboarding) from Mobbin.
