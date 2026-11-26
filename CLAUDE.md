# Joseki Teacher: notes for Claude

A daily Go joseki trainer that works like a vocabulary trainer, for one player (about 25k–15k). Phone first.
The owner usually writes in German. **All text in the app is English.**

## How the project is organized

- `design/Main.dc.html` is the source of the app: template, styles and logic. It is the same file as
  `project/Refined.dc.html` in the Claude design artifact "Joseki – Sketch style" (page "Refined", version 3), with
  `row` defaulting to `thread`. The canvas boards pass props (`variant`, `row`, `start-at`, `demo`) to show screens.
- `python3 tools/build.py` generates `index.html`, `app.js` and `style.css` from it. **Never edit those three by
  hand.** Change the design file, run the script, commit.
- Every push to `main` is published to GitHub Pages by `.github/workflows/pages.yml`
  (https://sinalaura.github.io/joseki-teacher/). The workflow writes `version.js` with the run number and the Berlin time.
- Test with `python3 -m http.server` and add `?reset` to wipe saved progress.

## Always

- **Say the version after every change to the app.** The owner checks the label at the bottom of the app
  ("v12 · 25.11. 12:30") to see how current the deployed version is. State the run number once it is deployed.
- Unless asked otherwise, work on a branch, open a pull request and merge it. A deployment can fail
  now and then; re-run it and tell the owner.
- No Claude session links in commit messages or pull request descriptions.

## Idea

Every joseki goes through four steps: **Try** (play it, get corrected), **Learn** (watch the moves with a short
explanation each), **Pick** (pick the right move from three), **Train** (random corners and roles, sometimes both colors;
pass with 3 clean corners, then "Done" or "One more corner"; after a mistake the Learn explanations come back for the rest
of that corner and the next one, until a clean corner). Try, Learn and Pick can be skipped by tapping a later stage. The player always sees themselves as Black; colors are swapped when
practicing the white side. Only real, very common joseki. Check every sequence against a source (see
`RESEARCH.md`) before it goes in. Use proper Go terms (star point, invade, block, extend, hane, ...) and very little text.

**Text rules (from the owner):** usually no text when the board speaks for itself; small hints are fine ("Crawl along the
edge."); never ask questions like "Black's move?", say whose turn it is as a statement ("Black's turn.") and only when no
other sentence is shown; text about what just happened is in the past tense and one short sentence ("White invaded at
3-3."); always use Go terms and phrases so the player learns them; no gamification or scolding ("No point for this
corner."). **Ask the owner before adding any new text to the app.**

**Colors in texts:** every joseki text (`fp`, `tc`, `tb`, `tw`, `ex`, `tryP`, Pick `p`) names the *real* colors of the
sequence (Black = corner owner). Never write them from the swapped view. When the stones are shown swapped (practising
White alone), the app swaps the words Black/White itself (`say()` in `renderVals`). A both-colors Train corner is never
swapped (`mkSched` never sets `white` and `both` together), so the real colors are on the board and in the text.
**Train texts after a mistake:** each joseki has `go` (one instruction per move, no colour: "Take the 3-3 point.") and
`did` (the same move in the past tense: "Black took the 3-3 point."), both derived from the Learn text `ex`. Playing one
colour: the opponent's last move (`did`) on one line, then your move (`go`). Playing both colours: only `go`; the first two
moves name the colour once ("Approach low as White.", "Extend low to the other side as Black."). Every new joseki needs
both arrays. The owner keeps all these texts in the Sheet "Train instructions – joseki texts"
(https://claude.ai/artifact/Lg2gJ7zz8HZkKPbGNTZBkP): keep it and the design file in step.
**Every sequence starts with only the first stone** (Try, Learn and every Train corner). Moves of the colour the player
isn't playing are played automatically after a short pause.
**Pick asks only Black's moves:** one question after each of White's moves except the last (two in a 6-move joseki, three in an 8-move one), real colors, never swapped.
Each question plays step by step (state `ph`): "White is thinking …", then White's move drops in, then the three answer
spots. **In every joseki, the first question says "How should Black respond?" once White's first stone is down** (only
there, never on the second question). No other text in Pick except the mistake messages. After an answer the next
question starts by itself with "White is thinking …" (no Next button). After the last answer White plays the joseki's
last move (again after "White is thinking …"), then the button "Good." ends Pick.

**Train freely** (the second menu page): once two joseki are done, a dog-ear at the bottom right of the menu turns the
page (a dog-ear at the top left turns back). Heading "Train freely with the joseki you know.", line "Tick the ones to
train.", the finished joseki with pencil tick boxes (empty at first, remembered in `joseki.mix`), "Start" once two are
ticked. Each corner: a random ticked joseki gives the first stone, random corner and side (the player always sees
themselves as Black), never both colours. Every ticked joseki in both mirror images is a line; any move that continues a
line fitting all stones so far is right, and the computer picks at random among the lines still possible
(`mixLines`). The board is as large as the largest ticked joseki needs. No title, no thread, no stage line, no hints
what to play: only the opponent's last move (`did`), plus "How do you want to respond?" on the player's first move. A
wrong move says "That's not one of your joseki."; the second miss sketches a spot as usual. When the joseki is
finished, the board shrinks to the top, then "Which joseki was it?" and the spider sketches of the ticked joseki (as
large as possible, two per row); a wrong pick is struck through in red, the right one gets a green tick (every ticked
joseki that matches the moves counts). Then "Next corner"; "Menu" at the top left leads back to the Train freely page.

## Look: a sensei with a gift for drawing explains it on a sheet of paper

The whole app is drawn in pencil, and all of the following came from the owner's feedback.

- **Pencil, not ink.** Grey-blue graphite (about `#4b4f6e`, light `#c9ccd9`), never saturated purple. Paper background
  `#f8f4e9` with a little grain. Red pen (`#c4513f`) is only for mistakes.
- **Hand drawn, not tidy.** Uneven pressure: lines get thicker and thinner, a bit stronger and weaker. Lines are slightly
  crooked and sloppy, but not wavy like a snake and not ruler-straight. "Too tidy" is a fault. Imperfect does not mean
  broken: shapes stay complete and clear.
- **Text stays easy to read.** Handwriting font (Patrick Hand) for headings and prompts, Nunito for small text.
- **Nothing unnecessary.** No extra outlines, move numbers, arrows, letters, pulsing or bouncing. Add a marking only when
  it teaches something. Where the board continues, the drawing simply fades out like on paper.
- **Buttons are words.** Handwritten word with a sloppy, slanted double underline close to the text, no box, no arrow.
  On the intro screens the stage name itself is the button. "Menu" is a quiet single underline.
- **Stones:** wobbly double outline. Black is the pencil color, filled, no hatching or inner ring. Faces are switched off for
  now (`stoneFaces()`, keep the code): when on, they are imperfect (scribbled eyes or `^^`, uneven mouth), and after a
  mistake the previous stone gets a flat `:I` mouth.
- **Board:** as many lines as the joseki needs, with at least one empty line between its outermost stone (or Pick spot) and the open side; always drawn at the same size, so more lines means smaller stones (`gridN()`). Crooked pencil lines with uneven pressure; where the board continues they stop at slightly different lengths,
  the pencil lifting off. Real edges are a firm stroke running a little past the corner. The star point is a soft pencil dot.
- **Wrong move:** draw the stone, wait a moment, strike it through with one red stroke from bottom left to top right, then
  fade it out. On the second miss the right spot is sketched lightly (thin outline, light hatching, drawn in after the strike;
  "Try the sketched spot."). It has no colour on purpose; the grey disc is only for the Pick answer spots.
- **Progress thread:** one pencil thread with the stage names above it. Try, Learn and Pick are small tangles, Train
  has three (all tangles the same size). The four words stand at even distances; Train's three tangles are spread out to
  near the right edge, where the thread ends. Not reached: pale tangle; reached or skipped: bold tangle; done (stage finished, corner clean): web at once.
  The spider moves only on the player's (Black's) moves and draws a thin dark line behind her. After "Done" she walks
  out to the right, and the end screen shows her rappelling down above "Well spun." No color coding, little text, no
  gamification words ("Passed!", "unlocked").
- **Pick answer spots** stay the soft grey discs, each with a small, slightly tilted handwritten "?".
- **Stage start:** no separate intro screen. The play screen shows the board pale and, in the prompt area, the stage
  word large and the rest of the sentence on the same line ("**Try** to find the joseki.", "**Learn** how it's played.",
  "**Pick** the right move.", "**Train** until it sticks."); the board is hidden meanwhile. After 2.5 s, or a tap anywhere,
  the board fades in and the stage starts. Learn starts with the first stone already played and its explanation.
- **First Try prompt of every joseki:** the joseki's `tryW` line in the present tense on its own line, then its hint
  (e.g. "White approaches Black's corner. / Extend low to the other side."). Every new joseki needs a `tryW` that fits on
  one line. The end of Try says "That's it!".
- **Long titles:** a joseki name that needs two lines pushes the board down; never shorten common names.
- **The spider always hangs right on her string**, wherever she hangs (menu, end screen). When fixing something in one
  place, check every other place where the same thing appears.
- **Play screens:** "Menu" small at the top left, the joseki name below it as the page title (header X), then the larger thread.
- **Menu:** each joseki is one tappable row (no Start/Review words). On the right: a hand-drawn circle with a green check when
  done; only the next open joseki gets an empty circle with a tilted handwritten "to do".
- **Spider (Ankabuti mascot):** classic curved legs with staggered lengths, a friendly face. The start screen of each
  joseki has a sketch with spiders that tells the joseki as a little picture. Keep those spiders as they are (cute, light
  bodies, dark faces); Black's spider has a light grey-blue body (`#c9ccd9`), White's a white one. Black is the corner owner,
  White the one who approaches or invades, matching the description text. No arrowheads.
- **Layout:** the board must not move when the text above it needs more or fewer lines (the text area has a fixed height).
  The app fills the whole screen with no border and is as large as the phone allows.

## Working between the canvas and the repo

Only one place is current at a time. Before switching from the canvas to the repo (or Claude Code), ship the canvas state;
before designing in the canvas again, copy `design/Main.dc.html` back to `project/Refined.dc.html` first.
**Before every ship from the canvas:** compare `design/Main.dc.html` on `main` with the last version shipped from the canvas.
If it has changes that didn't come from the canvas, stop and ask the owner instead of overwriting them.

## Open

- (nothing open right now)

## Not built yet

Spaced repetition (Leitner boxes), variations, and unlocking
the joseki one after another (`UNLOCK_ALL` in `tools/runtime.js`).
