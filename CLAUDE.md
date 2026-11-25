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
- **Board:** crooked pencil lines with uneven pressure; where the board continues they stop at slightly different lengths,
  the pencil lifting off. Real edges are a firm stroke running a little past the corner. The star point is a soft pencil dot.
- **Wrong move:** draw the stone, wait a moment, strike it through with one red stroke from bottom left to top right, then
  fade it out. On the second miss the right spot is then sketched lightly (thin outline, light hatching).
- **Progress thread:** one pencil thread with the stage names above it. Try, Learn and Pick are small tangles, Train
  has three (all tangles the same size, Train's centred under the word). Not reached: pale tangle; reached or skipped: bold tangle; done (stage finished, corner clean): web at once.
  The spider moves only on the player's (Black's) moves and draws a thin dark line behind her. After "Done" she walks
  out to the right, and the end screen shows her rappelling down above "Well spun." No color coding, little text, no
  gamification words ("Passed!", "unlocked").
- **Decide answer spots** stay the soft grey discs.
- **Play screens:** "Menu" small at the top left, the joseki name below it as the page title (header X), then the larger thread.
- **Menu:** each joseki is one tappable row (no Start/Review words). On the right: a hand-drawn circle with a green check when
  done; only the next open joseki gets an empty circle with a tilted handwritten "to do".
- **Spider (Ankabuti mascot):** classic curved legs with staggered lengths, a friendly face. The start screen of each
  joseki has a sketch with spiders that tells the joseki as a little picture.
- **Layout:** the board must not move when the text above it needs more or fewer lines (the text area has a fixed height).
  The app fills the whole screen with no border and is as large as the phone allows.

## Not built yet

Spaced repetition (Leitner boxes), variations, and unlocking
the joseki one after another (`UNLOCK_ALL` in `tools/runtime.js`).
