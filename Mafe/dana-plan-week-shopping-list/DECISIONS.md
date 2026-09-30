# Larder: Plan the week → Shopping List (DCCD-1)

Prototype: open `index.html` in a browser. No build step, and mocked data with no persistence.
Press **N** or use **Design notes** in the title bar for notes on each screen.
Review shortcuts: `index.html#plan` (week already filled), `#list`, `#sheet`, `#notes`.

A note on the brief's numbering: the open questions live in section **C12**, even though the brief's text calls them "C13". There is no C13a, and none of the questions are resolved there. So this prototype rests on one **new decision logged below (Q10)** and one **explicit assumption (Q9)**.

---

## T4 Flow outline

```
Flow name:   Plan next week, then take the Shopping List to the store
Persona:     Dana Whitfield, the Weeknight Planner (primary)
Trigger:     Wednesday evening. Next week's Meal Plan is empty and she has about 90 seconds.
Steps:
  1. Meal Plan opens on "Next week" with empty nights and an empty state saying how to start.
  2. She drags recipes from "Your rotation" onto Mon to Fri. Clicking a card fills the next
     open night, and "+ Add" opens a picker that searches by name or ingredient,
     filterable by Collection.
  3. "Make shopping list" generates the list, grouped by aisle, with each item showing
     which recipe needs it.
  4. She ticks "already have" on cupboard items and adds "milk" by hand.
  5. "Take it with you" offers three ways: send to phone (plain text through the system
     share menu), print, or copy as text. A preview shows exactly what she'll get.
  6. She sends it to Notes or Messages. Larder confirms, and the Meal Plan shows
     "Shopping list sent to Notes at 5:12 pm".
Decision points: which recipes go on which night; drag, click or search; how to take the list.
Edge cases:  the plan changes after the list was made (the list regenerates, keeps her
             manual items and ticks, says so, and clears the "sent" state so she re-sends);
             a recipe she tries to add twice; units that don't match; an empty list.
Where it can go wrong: she thinks ticks on her phone sync back (the sheet says they don't);
             merged quantities look more precise than they are (units never get converted).
```

---

## T2 Design Decision Record: Q10 🔴 (new, logged here)

```
Decision: Q10. The Shopping List is made on a desktop but needed in a store.
          What's the bridge?
Options considered:
  1. QR code that opens a hosted, read-only list on the phone.
  2. QR code served from the desktop app over the local Wi-Fi.
  3. Plain-text export through the OS share menu (Messages, Mail, Notes, AirDrop),
     plus print and copy.
  4. A companion phone app.
Recommendation: 3. Plain text through the system share menu, with print right next to it.
Rationale:
  - Dana already keeps lists in her phone's notes app (C9). Meet her there instead of
    asking her to adopt anything new.
  - Local-first, with no server and no account (C5 Musts, C7). Theo can build it with
    the OS share APIs and doesn't need a backend.
  - Doesn't pre-empt Q2 (account) or Q3 (sync). Option 1 quietly decides both.
  - Print is already a Must, and a lot of Larder's users still print, so it sits
    alongside as an equal option.
  - Option 2 breaks the moment Dana leaves the house, which is exactly when she needs
    the list. Option 4 is ruled out: no phone app in V1.
Trade-offs accepted:
  - It's a one-way copy. Ticks on the phone don't come back to Larder. The sheet says so
    plainly ("It's a copy, not a sync") so she doesn't find out in the store.
  - Plain text loses aisle styling. Headings are kept as plain lines so it still scans.
  - Windows share targets differ from the Mac ones shown here (Q13 is still open).
Status: Decided
```

## Assumption: Q9 🟡 (assumed for now, not decided)

```
Decision: Q9. Without Pantry, does the list include things already in the cupboard?
Working assumption: yes, list everything. Nothing is silently dropped (C8.1 Trust the
  archive). Staples (oils, spices, soy sauce) go to a "Check the cupboard first" group at
  the bottom. "Already have" strikes an item through and moves it to a collapsed section,
  for this list only. It's left off exports and not remembered next week. Remembering it
  would be Pantry, which is a Could, and that's a separate decision.
Status: Assumed for now
```

## Smaller calls made inside the flow

| Call | Why | Principle |
|---|---|---|
| Different units are shown side by side ("1 cup + 150 g"), never converted | A confident but wrong total is worse than an honest one | C8.3 Honest precision |
| Each list item says which recipe needs it ("for Fajitas, Tacos") | Lets Dana decide in the aisle whether she can skip it | Dana, C9 |
| Rotation is sorted by the Cook Log's last-made date | A sort, not a smart Collection, so Q7 stays untouched | C8.2, Q7 |
| Mon to Fri columns are wider than the weekend | Dana cooks five nights | Dana, C9 |
| Keyboard: arrow keys, Return and Esc in the picker; Cmd-P prints the list; N toggles notes | Should feel like a desktop app, not a web wrapper | C8.5 |
| Mac window chrome only | Q13 is still open; only one platform is shown | Q13 🟢 |

---

## Mobbin references: what shaped what

The three references you sent are **marketing landing pages** (Fode, Wolfood, Wing). They shaped the visual language. They don't include a meal plan board, a picker, a grocery list or a phone handoff, so those interaction patterns come from convention and are labeled that way.

| Reference | What I took | Where it shows up |
|---|---|---|
| **Wing** (plainthing.studio) | Sage outer frame, deep bottle-green surfaces, a warm high-contrast serif display | Window ground `#D5DDCF`, sidebar and title bar `#1F3D2E`, Young Serif for recipe titles, day names and "Groceries" (C8.7 Warm, not sterile) |
| **Wolfood** | Forest green with a blush-cream panel, mustard primary pill next to a quiet secondary pill; FAQ rows with a "+" toggle | Mustard accent `#F0BE45`; one primary pill per screen next to quiet ones; the collapsible "Already have (n)" section |
| **Fode** | "Buy Now" pill with a yellow icon disc; dashed coupon card; small yellow "30 dk." time chip | Primary CTAs ("Make shopping list", "Take it with you"); **the Shopping List as a tear-off ticket** (the one bold element, and what prints); the cook-time chips on recipe cards |

**Deliberately left out of all three:** hero food photography, prices and strikethrough discounts, "Flash sale" badges, "Loved by 2.4m" social proof, and all-caps condensed display type. Larder is personal, not social (C8.6). Nothing should sell while Q1 (pricing) is open. Arm's-length legibility argues against condensed caps.

**Not covered by any reference (convention, still needs a Mobbin pull):**
- Weekly planning board with drag and drop (kanban and calendar conventions)
- Quick-add picker with keyboard navigation (command-menu convention)
- Aisle-grouped grocery list (AnyList, Reminders groceries)
- Share menu and send preview (macOS share sheet convention)

To ground these, pull Mobbin flows for: *meal planning weekly view*, *grocery list grouped by category*, *send to phone / share sheet*, *command palette search*.

---

## T6 Readout (short)

- **What I designed:** Dana's full loop: an empty week, five dinners planned, a list grouped by aisle, cupboard items ticked off, milk added, and the list sent to her phone or printed.
- **Open questions resolved:** Q10, with plain-text share plus print (T2 above).
- **Left open, with the working assumption:** Q9 (list everything, cupboard group, ticks for this list only); Q13 (Mac chrome only); Q7 (the rotation is a sort, not a smart Collection).
- **Next hour:** pull the missing Mobbin flows above, then test the list with a real family's week of recipes to see whether aisle grouping holds up for mixed-unit items.
