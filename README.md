# Joseki Teacher

**A beautiful, low-effort daily joseki trainer for Go. It works like a vocabulary app.**

> A few minutes a day. Little effort. A big effect over time.

---

## The idea

Joseki are the standard move sequences in the corners of a Go board. Most players learn them from
books or videos, half-remember them, and forget them a few weeks later. In games they then play a
sequence that's *almost* right and lose the corner.

Vocabulary trainers such as Anki and Duolingo solved this problem for language learning with
**spaced repetition**: you get short daily sessions, see each item again just before you'd forget
it, and build up long-term memory with very little effort.

**Joseki Teacher applies the same principle to joseki:**

1. The app shows a corner position.
2. You play the next move.
3. The app tells you right away whether it was correct and plays the opponent's reply.
4. A short *why* explains each move, so you understand the joseki and don't just memorize it.
5. The app schedules each sequence for review, earlier if you struggled and later if it was easy.

## Who it's for (for now)

A **personal tool**, built for one player:

- **Level:** about 25k–15k. Explanations are simple and use plain English, and the content covers
  main lines plus only the most common variations.
- **Device:** phone first, with a zoomed corner view, big stones and one-thumb use.
- **Language:** English.
- **Starting point:** no prior joseki knowledge. Every new sequence is first shown, then practiced
  with help, then recalled.

It can grow into something for others later, but it doesn't have to.

## Principles

- **Daily, but small.** One session takes about 5 minutes.
- **Low effort.** You open the app and press start. You don't plan what to study or rate yourself,
  because the app sees how you did.
- **High effect over time.** Spaced repetition builds knowledge that lasts.
- **No pressure.** No streaks, XP or badges. There's just today's session and a quiet "done for
  today".
- **Looks nice.** A classic wooden board, slate and shell stones, a soft stone sound. It should be a
  pleasure to open.
- **Understanding over rote memory.** Every move has a one-line explanation of its purpose.

## Start small

The first version covers **three of the most common joseki**, introduced one after another:

1. **4-4 point (hoshi): 3-3 invasion.** This is probably the most frequent joseki in modern
   play, at every level.
2. **4-4 point: low approach, knight's move response.** A classic that teaches the basic ideas
   of approach, base and extension.
3. **3-4 point (komoku): small knight approach.** This is the most common joseki from the other
   main corner point.

Each one starts with only its main line. More joseki come much later (see [IDEAS.md](IDEAS.md)).

## Variations

A joseki is a **tree** of moves, not a single line. At many points there are several reasonable
moves, and the opponent can deviate. The plan:

- Learn the **main line** first.
- When the main line is solid, **unlock the most common variations**, one at a time.
- Accept **every correct joseki move**. When there are several good moves, the app doesn't count
  the other good ones as wrong.
- Later, add **common mistakes and how to punish them**, plus **context**: when to choose which
  variation, such as which side to block from.

## Status

🌱 **v0.2: new design.** The app was rebuilt from scratch in a hand-drawn pencil style, as if a sensei
with a gift for drawing were explaining it to you on a sheet of paper. Every joseki goes through four
steps: **Try, Watch, Decide, Transfer**. Transfer uses random corners and roles (and sometimes both
colors) and needs 10 points to pass. Wrong moves are crossed out in red pencil. Progress is saved on the
device.

It covers two joseki so far (3-3 invasion and low approach). It's a plain HTML/CSS/JS web app with no
build step and no libraries, and works as an installable PWA on a phone.

**Try it locally:** run `python3 -m http.server` in this folder and open http://localhost:8000.
Add `?reset` to the URL to wipe your progress. To unlock the joseki one after another, set
`UNLOCK_ALL` to `false` at the top of `app.js`.

See [IDEAS.md](IDEAS.md) for the plan, [RESEARCH.md](RESEARCH.md) for the checked joseki lines, and
[content/joseki](content/joseki/README.md) for the content format of the earlier version.
