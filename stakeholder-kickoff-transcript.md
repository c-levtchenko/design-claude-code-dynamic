# Larder — V1 Kickoff Call (Transcript)

**Attendees:** Priya Nair (Founder/PM), Theo Reyes (Engineer), Ren Okafor (contract
Product Designer, wrapping a 2-week discovery sprint ahead of handoff to the design
team)

**Context:** Ren was brought in for two weeks to do early customer calls and force some
of the open questions in the brief to a decision before the design team starts sketching.
This is the last call before that handoff. Lightly cleaned up for filler words; otherwise
verbatim.

---

**Priya:** Okay, I think everyone's here — let's get through this, I've got a call with
the newsletter person at eleven. Ren, you said you wanted to nail down pricing before you
hand this off, so let's start there. Where'd you land?

**Ren:** One-time purchase. Somewhere around thirty-nine dollars. Not a subscription, not
freemium.

**Priya:** That's what I wanted to hear, honestly, but tell me why — I want the design
team to have the reasoning, not just the number.

**Ren:** Two reasons. One, it's consistent with the thing Marcus actually says in
interviews — "own your recipes." A subscription for your own recipe box is a weird
pitch to a guy who's mad at the cloud already. Two, practically — if pricing gates
features, that's a screen. That's a paywall, an upsell moment, probably a trial countdown.
None of that is in the ten-week budget and none of it makes Dana's ninety seconds any
faster.

**Theo:** I'll take the free win. One caveat, though — if we ever do add sync as a paid
tier down the line, that's a real backend, real infra cost, ongoing. Don't design
anything today that assumes sync exists. It doesn't.

**Priya:** Right, sync stays a "could," full stop, we're not deciding it today. But I do
want an answer on backup, because that's not the same question and Marcus will ask it in
the first five minutes of using this thing.

**Ren:** So — no required account, at all, for anything in core. That part was already
basically decided. The part that wasn't: what "backup" actually means without an account.
What I landed on, after talking to the guy I've been calling my Marcus stand-in — Everything
in the Box exports as actual files. Not a database blob, a folder full of files he can
look at, one per recipe, plain enough that a text editor could open it in a pinch. Point
Larder at a folder, hit export, done. He can put that folder anywhere — Dropbox, a USB
stick, email it to himself, whatever he already trusts.

**Priya:** Say the quote back, the one that made me want this.

**Ren:** "If I can't see the file, I don't believe it exists." That was pretty much
verbatim. He'd inherited his mother's recipe box like three months before we talked, and
he was still visibly relieved just describing a folder full of files to me. Which — I
mean, that's the whole ballgame with him. He's not evaluating features, he's evaluating
whether he's allowed to trust this at all.

**Theo:** That one's easy on my end, for what it's worth. Files on disk, human-readable,
no format lock-in — that's actually less work than inventing our own opaque store.

**Priya:** Good, write that down as decided, both halves — no account required, backup is
a visible export folder. Moving on — imports. This is the one I actually lose sleep over.

**Ren:** So I pushed pretty hard on this with both interview subjects. Dana doesn't care
that much — she just wants it to work. Marcus cares a lot, and the thing that came up
twice, unprompted, was some other app mangling a fraction in an ingredient list and him
not noticing until halfway through cooking.

**Priya:** Yeah, that's the nightmare scenario for me too. That's worse than the app being
slow. That's the app being confidently wrong.

**Ren:** Right, so — the call is: low-confidence import blocks save. It doesn't quietly
save it and hope the banner gets noticed later, it stops you and makes you look at the
line it's unsure about before it counts as saved. High-confidence imports can save
immediately, with a small "auto-saved, tap to review" affordance, dismissible, not in the
way.

**Priya:** I want the confidence line itself visible too, not just a binary "trust me /
don't trust me." Even if it's rough. "We're not sure about this line" is honest. Silence
is not.

**Theo:** No objection, that's a parsing threshold on our side, doesn't change scope.
Only thing I'll flag — this is exactly why bulk import isn't happening in V1. If Marcus
tries to dump two hundred recipe cards in on day one and half of them need manual review,
that's not an import feature anymore, that's a part-time job. One at a time, with a real
review step, or the review step becomes theater.

**Priya:** Agreed, and I want that expectation set on day one, not discovered on recipe
forty. Ren, make sure that's in the handoff notes, not just implied.

**Ren:** It will be. Two more I wanted to close out before I hand this off — Collections,
and the shopping list problem.

**Priya:** Go.

**Ren:** Collections — manual only for V1. No auto-suggested "quick weeknight meals"
smart folder, nothing guessing on the user's behalf. That's a "could," later, if at all —
a miscategorized recipe is exactly the kind of thing that makes Marcus trust the whole app
less, and it doesn't actually save Dana much time over just tagging things herself as she
goes.

**Priya:** Fine by me. And can a recipe live in more than one?

**Ren:** Yes — that was the closer call, but I went with letting a recipe sit in multiple
Collections, not exactly one. Dana's rotation is genuinely messy — a recipe can be
"Weeknight" and "Kid-approved" and "Uses up leftover chicken" all at once, and forcing her
to pick just one of those the way a folder would is going to actively annoy her. Marcus
would probably be fine either way, honestly, he's not the one this decision is for.

**Priya:** Noted, that's a real trade-off, make sure that's written down as a trade-off
and not just a fact.

**Ren:** It will be. Last one — shopping list. This has been bugging me the whole two
weeks, because the honest answer is Dana is standing in a grocery store with no laptop and
we don't have a phone app.

**Theo:** And we're not getting one in ten weeks, so.

**Ren:** Right, so I stopped trying to invent a clever bridge. Print's already a Must for
the recipe layout, so leaning on it for the shopping list too is basically free, and it's
honestly how a lot of these users already operate — Dana said she still prints things
sometimes. Plus a plain "copy as text" action next to it, so she can paste the list into
Notes or text it to herself in ten seconds before she leaves the house. No sync, no
account, no new infrastructure.

**Theo:** That one costs me nothing, it's just a text formatter.

**Priya:** I like that it's boring. Boring is good on this one. Okay — I had one more on
my list that isn't from your interviews, Ren, it's from Lena. Scaling and baking.

**Ren:** Yeah, I saw that in the brief. My take — don't take scaling away from her, that's
the whole reason she's using this over a cookbook. But when a recipe is baking-type, or
we detect leavening in the ingredient list, show a real caveat inline — something like
"scaling may affect rise and bake time" — instead of just quietly doing the multiplication
and pretending it's chemistry-safe.

**Priya:** That's consistent with the honesty thing we keep saying out loud and not
always doing. I'll take that.

**Theo:** Detecting "leavening" is doable, it's just a keyword match against the
ingredient list, nothing fancy. Won't be perfect, but it doesn't need to be, it just needs
to fire the caveat often enough to be honest.

**Priya:** Good. Okay, before we run out of time — two things from my side that aren't
decisions, just context the design team needs. One: I told the newsletter person we'd
have fifty of her subscribers in a private beta. That's two weeks before our internal
ten-week target, not after. So there's a real date under this, not just a vibe.

**Theo:** Which also means: whatever's not done by beta needs to fail gracefully, not just
be missing. If Collections aren't done, fine, but don't let the nav point at a broken
screen.

**Priya:** Right. Second thing — Theo, tell them the OCR thing, I don't want that getting
lost.

**Theo:** Yeah — so, everything else in this app is offline, runs on the user's machine,
costs us nothing per use. Photo import is the one exception — every scan goes out to a
third-party OCR service and that costs real money, per call, every time. It's not huge
per-user, but it's not zero, and it's the reason I was pushing back on bulk import earlier
too — if someone queues two hundred photos, that's two hundred paid calls at once with no
warning. If we ever do go freemium down the line, that's probably where a cap shows up
first. Not deciding that today, just — don't design like photo import is free, because on
our end it isn't.

**Priya:** Good, that's useful context even though it's not a decision yet. Okay, I think
that's everything I wanted locked before you hand this off, Ren. Anything you want to flag
that's still open?

**Ren:** A few, on purpose — I didn't want to hand off a brief with nothing left to
decide, that's not useful to anyone. Sync's still open, we said that already. Bulk import
— we know it's not in V1, but not exactly what "one at a time" should feel like in the UI,
that's still a real design question. Pantry's untouched. Cook Mode and what happens when
Dana gets interrupted mid-step — genuinely didn't have time to get to it, and honestly I
think it deserves more than the two weeks I had anyway. Same with whether Mac and Windows
get real platform-native chrome or one UI skinned twice. And nothing beyond mouse and
keyboard for messy-hands scenarios — didn't rule it out, just didn't decide it.

**Priya:** Good, I'd rather they inherit six real open questions than zero. Okay — everyone
write your part of this up as an actual decision record, not just something we remember we
said on a call. I don't want to have this exact conversation again in week six.

**Theo:** Agreed.

**Ren:** On it — handoff notes will have all of this, one line per decision, plus the six
still open.

**Priya:** Great. Thanks, Ren. Good two weeks.

---

## Decisions recap (for quick reference)

| # | Decision |
|---|---|
| Q1 | One-time purchase (~$39). No subscription, no freemium gate on core features. |
| Q2 / Q4 | No account required, ever. Backup = export the Box as human-readable files into a user-controlled folder. |
| Q5 | Low-confidence imports block save until reviewed. Only high-confidence imports may auto-save (dismissible banner). |
| Q7 / Q8 | Collections are manual-only for V1. A recipe can belong to multiple Collections (tag model, not folders). |
| Q10 | Print + "copy as text" are the V1 shopping-list bridge to the store. No phone app, no sync required. |
| Q11 | Scaling is offered on every recipe; baking-type recipes show an inline caveat rather than being blocked or silently scaled. |

**New context (not decisions, but real constraints):** a private beta of ~50 newsletter
subscribers is promised 2 weeks before the internal V1 target; unfinished features must
fail gracefully by then. Photo-import OCR costs real money per call even though the rest
of the app is offline — a driving reason bulk import stays out of V1.

**Still open, on purpose:** Q3 (sync), Q6 (what "one at a time" import should feel like in
the UI), Q9 (Pantry), Q12 (Cook Mode + interruption/battery), Q13 (platform-native chrome
vs. one UI skinned twice), Q14 (kitchen accommodations beyond mouse/trackpad).
