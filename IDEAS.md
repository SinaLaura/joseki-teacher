# Ideas: how to build Joseki Teacher

This is a brainstorm. The decisions in section 0 are settled. Everything else is still open.

---

## 0. Decisions so far

From the interview on 2026-11-24:

| Topic                | Decision                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| Audience             | Just me: a personal tool                                                       |
| Level                | 25k–15k: simple explanations, main lines first                                 |
| Device               | Phone first                                                                    |
| Language             | English                                                                        |
| First joseki         | 4-4 3-3 invasion · 4-4 low approach + knight's move · 3-4 small knight approach |
| Prior knowledge      | None: every new line starts with a walkthrough                                 |
| Session length       | About 5 minutes a day                                                          |
| Board look           | Classic wood: kaya-style wood, slate and shell stones                          |
| Wrong move reaction  | **Mixed at random** (see 1.3)                                                  |
| Motivation           | **No gamification**: no streaks, XP or badges, just "done for today"           |
| Building             | Planning only for now, no code yet                                             |

---

## 1. What the app should do

### 1.1 The daily session (core loop)

```
Open app
  → "Today: 6 reviews · 1 new line · about 5 min"   [Start]
  → Board shows a corner position, "Black to play"
  → Tap the next move
       ✓ correct  → soft stone click, opponent replies automatically, continue
       ✗ wrong    → one of several reactions (see 1.3), line comes back for review sooner
  → Line finished → short result summary ("Black: corner territory · White: outside wall")
  → Next line
  → Session done → "Done for today. See you tomorrow."
```

You don't need to configure anything or rate yourself ("Was this easy or hard?"). The app grades
you from what you actually did:

| What happened                      | Grade |
| ---------------------------------- | ----- |
| Every move right on the first try  | Good  |
| Right, but slow or with a hint     | Hard  |
| Any wrong move                     | Again |
| Fast and right many times in a row | Easy  |

**A 5-minute budget:** one line takes about 20–40 seconds to play, so one session holds roughly
6–10 lines. New lines are added only when the reviews leave room. For example, at most one new line
every 2 days, paused automatically when reviews would push the session past 5 minutes.

### 1.2 What is a "card"?

There are three options:

- **A: Single move.** Position → next move. This is simple but feels choppy and loses the flow of
  the sequence.
- **B: Whole joseki.** You play the full sequence from memory. This is too coarse, because one
  mistake fails everything.
- **C: Line (recommended).** One path through the joseki tree, such as "3-3 invasion, main line".
  You play your color's moves and the app plays the opponent's. The **line** is what gets scheduled,
  and the app also keeps **statistics for each move**, so it knows *which* move in a line is weak and
  can practice that spot.

On top of that:

- **Play both colors.** Each line becomes two cards: "play as Black" and "play as White". You need
  to know a joseki from both sides.
- **Random orientation.** The corner is rotated and mirrored at random (8 symmetries) and appears in
  any of the 4 corners. You learn the *shape*, not the coordinates.

### 1.3 Wrong moves: a random mix of reactions

After a wrong move, the app picks one of these reactions at random, to keep practice from getting
monotonous:

| Reaction             | What happens                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Show + explain**   | The correct move appears with its one-line *why*, and the line continues.                       |
| **Retry with hint**  | "Not quite, try again." 1–2 more tries, with a hint (highlighted area) after the first miss, then the answer. |
| **Restart the line** | The correct move is shown, then you replay the whole line from the beginning.                   |

- Grading is the same whichever reaction comes up: any wrong move counts as **Again**. The
  randomness changes the *experience*, not the schedule.
- Tunable later: the weights (e.g. 50 / 30 / 20), or rules such as "never restart in a very long
  line".

### 1.4 Learning stages for each line

Because there's no prior knowledge, every new line goes through all the stages:

1. **Watch.** An animated walkthrough of the line, one sentence for each move. You tap to go to the
   next move, at your own pace.
2. **Guided.** You play it with hints, such as a highlighted area or a faint "ghost stone".
3. **Recall.** You play it with no hints.
4. **Review.** The line enters the spaced-repetition schedule and is mixed with other joseki,
   colors and orientations.
5. **Mastered.** It shows up only rarely.

### 1.5 Help for the 25k–15k level

- **Plain-English explanations.** One sentence for each move, two at most, and no jargon without
  explanation.
- **Tap-to-define glossary.** Terms like *approach, pincer, slide, extension, hane, base,
  influence, tenuki* are underlined. Tapping one shows a one-line definition and a mini diagram.
- **Result summary at the end of each line.** It says who got what (for example corner territory
  against an outside wall) and why that's a fair trade. That's the core idea of joseki.
- **Show only the main line** plus at most 1–2 very common variations for each joseki at first.
  Trick plays, "slightly worse" nuances and old-style lines can wait.

---

## 2. Variations and the joseki tree

This is where joseki learning gets interesting, and where most apps or books get overwhelming.

### Data model: a tree

- Each joseki is a **tree of moves**. SGF supports variations natively, so SGF is a good format to
  write and store them.
- Each node (move) carries:
  - a **comment**: the one-line "why"
  - a **status**: `joseki` / `playable` / `slightly worse` / `mistake` / `trick play`
  - **tags**: `main-line`, `common`, `rare`, `ladder-dependent`, `modern`, `old-style`, ...
  - a **popularity** value, to decide what to unlock first

### Unlocking variations: progressive disclosure

- At the start, only the **main line** is active.
- When a line reaches *Review* status, the **most common deviation** from it unlocks.
- A plain **joseki map** shows the tree and which branches you've learned. It's an overview, not a
  game element.

### Several correct answers

At many nodes there is more than one good move. Rules:

- Never mark a valid joseki move as wrong.
- If you play a valid move that's different from the one being drilled, the app says *"Also joseki!
  Today we're practicing the other one"*, shows it, and continues. Alternatively it switches to your
  branch if that branch is unlocked.
- "Playable but not best" moves get a soft response, not a big red X.

### Kinds of variation to cover over time

- **Your choice.** "Which side do I block from?" in the 3-3 invasion, or the different answers to an
  approach: knight's move, one-space jump, attach-and-extend, pincers.
- **The opponent deviates.** "White doesn't follow the main line. What now?"
- **Tenuki.** Knowing when you can play elsewhere. Tenuki (play elsewhere) is offered as a valid
  answer.
- **Mistakes and how to punish them.** "Your opponent plays this common amateur mistake. Punish it!"
  These are very practical at 25k–15k, because opponents at that level often leave joseki.
- **Trick plays (hamete).** Recognize them and answer them safely. This comes later.
- **Context.** Small whole-board positions where the *right* variation depends on the surroundings:
  nearby stones, direction of play, ladders. This also comes much later.

---

## 3. Starting content

Keep it really small at first. That's the whole point. The joseki are introduced **one after
another**: the next one starts only when the previous main line has reached *Review*.

Exact moves and sources are in [RESEARCH.md](RESEARCH.md). The app-ready file for joseki 1 is
[content/joseki/33-invasion.sgf](content/joseki/33-invasion.sgf) (see [content/joseki](content/joseki/README.md)).

**Joseki 1: 4-4 point, 3-3 invasion**
- Main line: the **simple extension** (6 moves, Black gets the outside and sente)
- First variation: the **double hane** (Black takes the corner back, White gets a ponnuki and sente)
- Then: the **push** (White pushes instead of sliding; same result idea as the main line)

**Joseki 2: 4-4 point, low approach → knight's move response**
- Main line (the approaching side settles with a slide and a two-space extension)
- Later: one other common answer to the approach (e.g. the one-space jump), or White's modern
  attachment instead of the slide

**Joseki 3: 3-4 point, small knight approach**
- Main line: the **kick** (attach and stand), then extensions on both sides
- Later: the knight's move answer

That's about 3 main lines at the start and about 6 lines with the first variations. With both
colors and random orientation, it's enough for many weeks of daily 5-minute sessions.

**Checked (2026-11-24):** all three main lines are current joseki in the OGS Joseki Explorer. No
source has an open content license, so we write our own SGF and explanations and use the sources only
to check against. Details in [RESEARCH.md](RESEARCH.md).

### Later expansions (rough order)

1. More answers to the 4-4 approach (one-space jump, attach-and-extend, a simple pincer)
2. More 3-4 point joseki (e.g. the one-space high approach)
3. 3-3 point basics
4. Common mistakes and how to punish them, for all learned joseki
5. Joseki in context (whole-board decisions)

---

## 4. Look and feel

- **Board: classic wood.** A warm, kaya-style wood texture with fine dark lines, slate-and-shell
  stones (slight sheen, subtle grain on the white stones) and soft drop shadows.
- **Zoomed corner view:** show only the relevant corner (about a 10×10 crop), so stones are big
  and easy to tap on a phone. You can zoom out to the full board.
- **Sound and haptics:** a satisfying wooden stone click and a light vibration on placement. A gentle
  "tock" for right and a soft shake for wrong. No harsh buzzer.
- **Animations:** stones "drop" onto the board, the opponent's reply follows after a short natural
  delay, and correct moves glow briefly.
- **Typography:** minimal text. Explanations are one sentence, two at most.
- **Dark mode** for the surrounding UI, with the board staying wood.
- **Mood:** calm and focused, without any gamified clutter.

---

## 5. Motivation without gamification

**Decided:** no streaks, XP, levels or badges.

- After the session: **"Done for today."** Nothing more.
- Instead of game mechanics, the app relies on:
  - **Short sessions.** About 5 minutes is easy to keep doing.
  - **Visible progress, kept factual.** The joseki map shows which lines you know. It's information,
    not a reward.
  - **Small amounts of new material**, so reviews never pile up and opening the app never feels like
    a chore.
- Maybe: one optional daily reminder at a time you pick. It's off by default.

---

## 6. Tech ideas (for when it's time to build)

### Platform

- **Phone first, as a PWA** (Progressive Web App). It's installable on the home screen, works
  offline, needs only one codebase, and needs no app store, which is fine for a personal tool.
- Go native (or use Capacitor, Flutter or React Native) later, only if the PWA isn't good enough,
  for example for notifications on iOS.

### Possible stack

- **TypeScript + Vite** + a light UI framework (React, Preact or Svelte)
- **Board rendering:** SVG for crisp output at any size and easy animation. Options to evaluate:
  - Write a small custom SVG board. A single zoomed corner is simple, and the wood look stays fully
    under our control.
  - Or use existing libraries: `@sabaki/shudan` (Go board component), `@sabaki/go-board` (rules,
    captures), `@sabaki/sgf` (SGF parsing), or WGo.js.
- **Spaced repetition:** start with simple **Leitner boxes**, then move to **FSRS** (the modern
  algorithm used in Anki; `ts-fsrs` is a TypeScript implementation).
- **Storage:** local-first in IndexedDB, with no account and no server.
- **Content:** one SGF file per joseki in the repo (`content/joseki/*.sgf`). A build step turns it
  into JSON for the app. Custom SGF properties hold status and tags.

### Data model sketch

```ts
type Color = "B" | "W";
type Point = { x: number; y: number };   // in normalized corner coordinates

interface JosekiNode {
  id: string;
  move: Point | "tenuki";
  color: Color;
  status: "joseki" | "playable" | "slightly-worse" | "mistake" | "trick";
  comment: string;           // the one-line "why"
  tags: string[];
  popularity: number;        // 0..1, used to order unlocks
  children: string[];
}

interface Joseki {
  id: string;                // "hoshi-33-invasion"
  name: string;              // "4-4 point: 3-3 invasion"
  rootId: string;
  nodes: Record<string, JosekiNode>;
  resultSummary: string;     // "Black: outside wall · White: corner territory"
}

interface Line {
  id: string;
  josekiId: string;
  path: string[];            // node ids from root to leaf
  unlockAfter?: string;      // line id that must reach "review" first
}

interface Card {             // what gets scheduled
  lineId: string;
  playAs: Color;
  stage: "new" | "watch" | "guided" | "recall" | "review" | "mastered";
  due: string;               // ISO date
  // FSRS fields later: stability, difficulty, reps, lapses ...
}

interface MoveStat {         // per-move weakness tracking
  nodeId: string;
  playAs: Color;
  attempts: number;
  errors: number;
}

type MistakeReaction = "show-explain" | "retry-hint" | "restart-line";
```

---

## 7. Roadmap draft

**v0.1: "it works"**
- Joseki 1 (3-3 invasion), main line only
- Watch → guided → recall stages
- Play-through drill: auto opponent moves, right/wrong feedback, one-line explanations
- Both colors
- Leitner-box scheduling, a "Today" screen, "done for today"
- PWA on the phone, local storage

**v0.2: "it feels good"**
- Classic wood board, stone sounds, haptics, animations
- Random orientation and corner
- Random mix of mistake reactions (show / retry / restart)
- Glossary taps and result summaries
- Joseki 2 (low approach, knight's move response)

**v0.3: "it grows"**
- Joseki 3 (3-4 small knight approach)
- First variations + unlock system + joseki map
- Accept several correct answers
- Switch to FSRS

**Later / maybe**
- More joseki (see 3, "Later expansions")
- "Punish the mistake" cards
- Joseki-in-context whole-board puzzles
- Import your own games (SGF) and see where you left joseki
- KataGo-backed explanations ("why is this move bad?")

---

## 8. Open questions

- ~~**Content source and license**~~ Answered in [RESEARCH.md](RESEARCH.md): write our own SGF and
  check it against the OGS Joseki Explorer.
- **iPhone or Android?** iPhone Safari has no vibration API, so haptics only work on Android in a
  PWA (see [RESEARCH.md](RESEARCH.md), 3.2).
- **Mistake reaction weights:** equal thirds, or weighted (e.g. more "show + explain" for newer
  lines)?
- **Where do you play?** OGS, Fox, KGS or in person? This matters for a possible "import my games"
  feature later.
- **New-line pace:** is "at most one new line every 2 days" right, or faster or slower?
- **Free explore mode?** Should you be able to browse the whole tree freely in a separate "Library",
  besides the learning flow?
- **Name?** "Joseki Teacher" works. Other options: "Daily Joseki", "Joseki Garden", "Corner Kata".
