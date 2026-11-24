# Ideas: how to build Joseki Teacher

This is a brainstorm. Nothing here is final.

---

## 1. What the app should do

### The daily session (core loop)

```
Open app
  → "Today: 9 reviews · 1 new line · about 5 min"   [Start]
  → Board shows a corner position, "Black to play"
  → Tap the next move
       ✓ correct  → soft stone click, opponent replies automatically, continue
       ✗ wrong    → gentle shake, correct move shown + one-line "why", line marked for early review
  → Line finished → next line
  → Session done → summary: "8/10 perfect · streak 12 days · 3-3 invasion: 70 % mastered"
```

You don't need to configure anything or rate yourself ("Was this easy or hard?"). The app grades
you from what you actually did:

| What happened                      | Grade |
| ---------------------------------- | ----- |
| Every move right on the first try  | Good  |
| Right, but slow or with a hint     | Hard  |
| Any wrong move                     | Again |
| Fast and right many times in a row | Easy  |

### What is a "card"?

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

### Learning stages for each line (like vocabulary)

1. **Watch.** An animated walkthrough of the line, one sentence for each move.
2. **Guided.** You play it with hints, such as a highlighted area or a faint "ghost stone".
3. **Recall.** You play it with no hints.
4. **Review.** The line enters the spaced-repetition schedule and is mixed with other joseki,
   colors and orientations.
5. **Mastered.** It shows up only rarely.

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
- This grows into a **skill tree view**, a map of the joseki where branches light up as you learn
  them. That's also good for motivation.

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
  These are fun and very practical.
- **Trick plays (hamete).** Recognize them and answer them safely.
- **Context.** Later there will be small whole-board positions where the *right* variation depends on
  the surroundings: a working ladder, nearby stones, direction of play. This is the step from
  "memorizing joseki" to "using joseki".

---

## 3. Starting content (v1)

Keep it really small at first. That's the whole point.

**Joseki 1: 4-4 point, 3-3 invasion**
- Main line
- Branch: blocking from the other side
- One or two common follow-ups

**Joseki 2: 4-4 point, low approach → knight's move response**
- Main line (the approaching side settles with a slide and extension)
- Later: other answers to the approach (one-space jump, attach-and-extend, a pincer)

That's about 6–10 lines total. With both colors and random orientation, it's enough for several
weeks of daily practice.

**Open task:** check every line against a reliable, modern source before it goes into the app.
Options include AI-era joseki dictionaries such as the OGS Joseki Explorer, Sensei's Library, and
KataGo analysis. Check content licenses before reusing anything. Some older joseki are considered
outdated since AI, so mark them (`old-style`) or skip them.

### Later expansions (rough order)

1. More answers to the 4-4 approach (pincers, high approach)
2. 3-4 point (komoku): small knight approach and its common answers
3. 3-4 point: one-space high approach
4. 3-3 point basics
5. 5-3 / 5-4 points (niche)
6. Joseki in context (whole-board decisions)

---

## 4. Look and feel

- **Board:** clean and calm. A light wood texture or a modern flat style (both available as themes),
  slate-and-shell stones with soft shadows.
- **Zoomed corner view:** show only the relevant corner (about a 10×10 crop), so stones are big
  and easy to tap on a phone. You can zoom out to the full board.
- **Sound and haptics:** a satisfying, quiet stone click and a light vibration on placement. A
  gentle "tock" for right and a soft shake for wrong. No harsh buzzer.
- **Animations:** stones "drop" onto the board, the opponent's reply follows after a short natural
  delay, and correct moves glow briefly.
- **Typography:** minimal text. Explanations are one sentence, two at most.
- **Dark mode** from the start.
- **Mood:** calm, focused, a little Japanese-inspired, with no gamified clutter.

---

## 5. Motivation without stress

- **Small daily goal:** about 5 minutes or 10 cards. Finishing should feel easy.
- **Limit new material** (for example, 1–2 new lines per day) so reviews never pile up.
- **Streaks**, kept gentle: freeze days, no guilt-tripping.
- **A collection to fill:** a "joseki map" where learned lines light up, plus mastery % for each
  joseki.
- **One optional daily reminder** at a time the user picks.

---

## 6. Tech ideas

### Platform

- **Start as a PWA** (Progressive Web App). It's installable on iOS, Android and desktop, works
  offline, and needs only one codebase. It's the fastest way to something usable.
- Go native (or use Capacitor, Flutter or React Native) later, only if the PWA isn't good enough,
  for example for notifications on iOS.

### Possible stack

- **TypeScript + Vite** + a light UI framework (React, Preact or Svelte)
- **Board rendering:** SVG for crisp output at any size and easy animation. Options to evaluate:
  - Write a small custom SVG board. A single zoomed corner is simple, and the look stays fully under
    our control.
  - Or use existing libraries: `@sabaki/shudan` (Go board component), `@sabaki/go-board` (rules,
    captures), `@sabaki/sgf` (SGF parsing), or WGo.js.
- **Spaced repetition:** start with simple **Leitner boxes**, then move to **FSRS** (the modern
  algorithm used in Anki; `ts-fsrs` is a TypeScript implementation).
- **Storage:** local-first in IndexedDB, with no account needed. Optional sync later.
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
```

---

## 7. Roadmap draft

**v0.1: "it works"**
- One joseki (3-3 invasion), main line + 1–2 branches
- Play-through drill: auto opponent moves, right/wrong feedback, one-line explanations
- Both colors
- Leitner-box scheduling, a "Today" screen, a streak counter
- PWA, local storage

**v0.2: "it feels good"**
- Second joseki (low approach, knight's move response)
- Random orientation and corner
- Polished board, sounds, animations, dark mode
- Watch and guided stages for new lines

**v0.3: "variations"**
- Unlock system and joseki map (skill tree view)
- Accept several correct answers
- "Punish the mistake" cards
- Switch to FSRS

**Later / maybe**
- 3-4 point joseki
- Joseki-in-context whole-board puzzles
- Import your own games (SGF, or from OGS) and see where *you* left joseki
- KataGo-backed explanations ("why is this move bad?")
- Optional account and sync
- Shared community decks (like Anki decks)

---

## 8. Open questions

- **Target level?** For example around 20k–5k. This decides how much explanation each move needs and
  which variations count as "common".
- **Language?** English only, or German as well?
- **Mobile-first?** Probably yes, since daily habits happen on the phone.
- **Content source and license:** where exactly do the joseki trees come from, and who checks them?
- **Name?** "Joseki Teacher" works. Other options: "Daily Joseki", "Joseki Garden", "Corner Kata".
- **Free explore mode?** Should you be able to browse the whole tree freely, or only through the
  learning flow? (Probably both: learn in the flow, browse in a separate "Library".)
