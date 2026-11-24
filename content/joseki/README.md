# Joseki content

One SGF file per joseki. The SGF tree is the joseki tree, and each leaf is one **line** the app drills.
The move sequences are checked against the OGS Joseki Explorer and the resigning-in-sente blog (see
[RESEARCH.md](../../RESEARCH.md)). The explanations are written by us, because no joseki source has an
open license.

| File | Joseki | Lines |
| ---- | ------ | ----- |
| [33-invasion.sgf](33-invasion.sgf) | 4-4 point: 3-3 invasion | knight's move, double hane, push |

## Format

- **Frame:** upper-right corner, with Black owning the 4-4 point at Q16. The app rotates, mirrors and
  recolors the lines itself.
- **Standard SGF properties:** `GN` names the joseki, `SO` gives the sources, and `C` holds the "why"
  for each move: plain English, one or two sentences, for 25k–15k.
- **Custom properties.** None of these exist in the SGF standard, so other SGF tools ignore them.

  | Property | Where | Meaning |
  | -------- | ----- | ------- |
  | `JS` | every move | Status: `joseki`, `playable`, `slightly-worse`, `mistake` or `trick` |
  | `JT` | every move | Tags, comma-separated: `main-line`, `variation`, `block-direction`, … |
  | `JL` | leaf | Line id, e.g. `33-knight` |
  | `JN` | leaf | Line name shown in the app |
  | `JU` | leaf | Unlock after: the line that must reach *Review* before this one appears |
  | `JR` | leaf | Result summary shown at the end of the line: who gets what, and who has sente |

## 3-3 invasion: lesson plan

Every line starts the same way: Black Q16, White invades at R17, Black blocks at R16, White crawls at
Q17. Black then chooses.

### Line 1: knight's move (main line, learned first)

Six moves, no fighting. White lives small, and Black gets a wall **and sente**.

```
    K  L  M  N  O  P  Q  R  S  T
19  .  .  .  .  .  .  .  .  .  .
18  .  .  .  .  ○6 .  .  .  .  .
17  .  .  .  .  .  .  ○4 ○2 .  .
16  .  .  .  .  .  ●5 ●1 ●3 .  .
15  .  .  .  .  .  .  .  .  .  .
```

### Line 2: double hane (unlocks after line 1)

Black hanes at P17 instead of extending and fights for the corner. Black takes the corner in
**gote**, and White gets a ponnuki on top **and sente**. This line has a cut, ataris and a capture.
(Move 7, at O18, is captured by move 12.)

```
    K  L  M  N  O  P  Q  R  S  T
19  .  .  .  .  ○12.  .  .  .  .
18  .  .  .  ○10.  ○6 ●11●13.  .
17  .  .  .  .  ○8 ●5 ○4 ○2 .  .
16  .  .  .  .  .  ●9 ●1 ●3 .  .
15  .  .  .  .  .  .  .  .  .  .
```

### Line 3: push (unlocks after line 2)

After Black's extension, White pushes at P17 instead of sliding. The result is the same idea as line 1.
The push is taught last because the knight's move is the simpler, all-purpose choice.

```
    K  L  M  N  O  P  Q  R  S  T
19  .  .  .  .  .  .  .  .  .  .
18  .  .  .  .  ○8 .  .  .  .  .
17  .  .  .  .  ●7 ○6 ○4 ○2 .  .
16  .  .  .  .  .  ●5 ●1 ●3 .  .
15  .  .  .  .  .  .  .  .  .  .
```

### Not included (on purpose)

- **The flying knife** (Black O17 after White Q17): OJE calls it "the most complicated joseki
  currently played".
- **The old crawl-and-hane-connect ending:** outdated since AI.
- **Blocking from the other side:** it's the same shape mirrored, and random orientation already
  covers it. Which side to block from becomes a "context" card later. The rule: block on the side you
  want to build on.

### Glossary terms these lines need

atari · block · capture · crawl · cut · extend · gote · hane · knight's move · liberty · ponnuki ·
push · sente · slide · aji

## How it was checked

1. **Sequences:** the Research session confirmed each one move for move in the OGS Joseki Explorer
   (every move tagged *IDEAL*) and in the resigning-in-sente SGF files, translated into this frame.
2. **Legality:** each line was replayed with capture logic. The ataris and the single capture in the
   double hane happen exactly where the comments say.
3. **File:** the SGF was parsed with the `sgfmill` library, and every leaf was compared with the
   checked sequence. Every move has a `C` comment and a `JS` status.

Not checked: longer follow-ups (e.g. White S17 or O16 later in the double hane), and ko lines.
