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

## Principles

- **Daily, but small.** One session takes about 5 minutes, and there's a cap on new material per day.
- **Low effort.** You open the app and press start. You don't plan what to study or rate yourself,
  because the app sees how you did.
- **High effect over time.** Spaced repetition builds knowledge that lasts.
- **Looks nice.** A calm, beautiful board with good stones and good sound. It should be a pleasure to open.
- **Understanding over rote memory.** Every move has a one-line explanation of its purpose.

## Start small

The first version covers **one or two of the most common joseki** and nothing else:

1. **4-4 point (hoshi): 3-3 invasion.** This is probably the most frequent joseki in modern
   (post-AI) play, at every level.
2. **4-4 point: low approach, knight's move response.** This classic joseki teaches the basic
   ideas of approach, base and extension.

Both start from the 4-4 point, which is the most common opening move today, so a learner only needs
to deal with one corner type at first.

More joseki come later, one at a time (see [IDEAS.md](IDEAS.md)).

## Variations

A joseki is a **tree** of moves, not a single line. At many points there are several reasonable
moves, and the opponent can deviate. The plan:

- Learn the **main line** first.
- When the main line is solid, **unlock the most common variations**, a bit like a skill tree.
- Accept **every correct joseki move**. When there are several good moves, the app doesn't count
  the other good ones as wrong.
- Later, add **common mistakes and how to punish them**, plus **context**: when to choose which
  variation, such as which side to block from or what to do when a ladder works.

## Status

🌱 Idea stage. See [IDEAS.md](IDEAS.md) for the brainstorm on how to build it.
