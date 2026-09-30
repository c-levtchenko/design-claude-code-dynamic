# Larder: Marcus brings in one of his mother's cards

**Ticket:** DCCD-1, Build an HTML prototype of Larder
**Designer:** Felipe R.
**Open it:** double-click `index.html`. It's plain HTML/CSS/JS with no build step and mocked data.
Press `?` (or the *Design notes* button) on any screen to see which decision and which Mobbin
reference shaped it.

## Persona and job

**Marcus Ibehi, the Home Cook Archivist (secondary persona).** He's 61 and recently inherited
his mother's recipe box of handwritten cards.

> "If I lose one of my mother's recipes to some app, I will never trust software again — and I'll be right not to."

**Job:** get one handwritten card into his Box without anything being quietly misread, and
come away *knowing* it's safe.

## The flow (click-through)

1. **Box:** Marcus's library, with Mom's cards (3) already in it. He clicks **Add recipe**.
2. **Add a recipe:** he picks **From a photo**. Before he adds anything, Larder says it
   takes one card at a time, and why.
3. **Reading your card:** the parsed lines appear one by one next to the photo, and the line
   being read lights up on the card.
4. **Check what Larder read:** three lines are circled in red pencil on the photo, each with a
   plain reason and fixes:
   - `11/2 cups rice`: *1½ cups* or *½ cup*, or type it
   - `1 scotch bonnet`: *1* or *7*, or type it
   - a step with a smudged cooking time: Larder won't guess. Marcus types it or keeps it as
     *"smudged on card"*.

   **Save to Box** stays blocked (by click or ⌘S) until all three are settled. ↑/↓ moves
   between circled lines. Cancel confirms and says nothing is lost.
5. **Saved:** an editorial recipe sheet that is also the print layout. A banner shows the
   plain file on disk, and **Show in Finder** opens the folder with the file's text. He can
   add the recipe to more Collections (Sunday, …). The main action is **Import the next card**,
   with a running count of Mom's cards.
6. **Box again:** the new recipe has a *Just added* chip. Meal Plan, Shopping List and Settings
   open a clear "not in this prototype" screen instead of a broken one.

## Decisions this traces to

| Decision | Where you see it |
|---|---|
| **C13a Q5:** low-confidence imports block save until reviewed, and the confidence is shown *on the specific line* | Review screen: per-line *Not sure* pill, a "Why:" reason, circled region on the photo, disabled Save with a stated count |
| **C13a Q2/Q4:** no account. Backup = human-readable files in a folder the user controls | Sidebar note, saved banner with the file path, Finder view showing the `.md` text |
| **C13a Q7/Q8:** manual Collections, and a recipe can be in several | Collection chips on the saved recipe. Box tabs and sidebar counts update |
| **Kickoff constraint:** unfinished screens fail gracefully before the beta | Stub screens for Meal Plan, Shopping List, Settings, other recipes |
| **New T2 below:** how one-at-a-time import should feel (Q6) | Add screen copy, "Import the next card" loop, running count |

### Design Decision Record (T2)

```
Decision: Q6: what "one card at a time" import should feel like in the UI
Options considered:
  1. Silent single-file picker. Marcus discovers there's no bulk option on his own.
  2. A visible queue of 1, with a "bulk import coming soon" tease.
  3. State the limit up front, as a reason, and make the post-save moment a loop:
     "Import the next card" + a running count of Mom's cards.
Recommendation: 3
Rationale: Marcus (C9) needs to trust each card, and the kickoff kept bulk out of V1 because
  review at scale "becomes a part-time job". Framing one-at-a-time as "each card gets a proper
  look" matches his own bar for trust (C8 principle 1, Trust the archive). The running count
  turns a limit into visible progress through his mother's box. No bulk tease, so we don't
  promise scope we haven't decided.
Trade-offs accepted: slower for someone with 200 cards. Relies on the loop feeling quick,
  which the prototype can't prove. A count of "Mom's cards" assumes he files them in one Collection.
Status: Decided for this prototype. Needs the team's buy-in.
```

**Assumption (not decided, flagged in-product):** photo reading (OCR) needs the internet for
a few seconds, because the kickoff noted OCR costs money per call. The Add screen says so, and
says the recipe and photo stay local afterwards. Theo needs to confirm.

## Mobbin references and what each one shaped

| Reference | What it shaped |
|---|---|
| **Navore / Daily Harvest**: table rows with thumbnails, "Filled / Partially filled" status pills, progress bars, dark olive pill CTA | Review rows with *Not sure* / *You checked* / *You changed this* pills, a save-bar progress that fills as lines are settled, one dark-olive primary action, serif display on a light surface |
| **Miso Mushroom Pasta**: editorial recipe sheet, huge title, two-column ingredients with quantities, numbered two-column steps | The saved recipe sheet and its print layout (quantity-first ingredient grid, numbered steps) |
| **Mnogo Kroshek menu**: underlined text category tabs, bordered card grid, corner tag chip | Box: text tabs for Collections, bordered tiles, the *Just added* corner chip |
| **Spicy Bomb Tuna Gimbab**: desktop browser frame, ingredients arranged one by one around a plate | The desktop window framing, and the "reading your card" moment where lines assemble one by one instead of a spinner |
| **Kale Caesar**: hero image, title with a pencil edit, beige ingredient tiles | A pencil edit on every parsed line (even clear ones), warm neutral surface behind the photo pane |

**Gap, stated honestly:** none of the five references shows the core interaction, which is
extracted data *side by side with its source*, or a save *blocked until items are resolved*.
The two-pane review and the red-pencil circles are my own reasoning from Q5 and Marcus's
mangled-fraction fear. Next step: pull Mobbin references from receipt, invoice or ID scanning
flows to pressure-test them.

## Visual direction

The identity comes from the object in the story, a 1980s index card: a red top rule (used only
for *not sure*), blue ruled lines (used for *you checked* and focus), and ballpoint blue for
handwriting. Type is Young Serif for display and Atkinson Hyperlegible for body text, on an 18px
base because Marcus prefers larger text. The handwritten card is the one bold element, and
everything else stays quiet.

## Still open (left for the team)

Q3 sync, Q9 Pantry, Q12 Cook Mode interruptions, Q13 platform-native chrome (this is
Mac-styled only, so on Windows it would read "Show in File Explorer"), and Q14 messy-hands input.
