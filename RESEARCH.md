# Research: content, sources and tech

Research done on 2026-11-24 for the open questions in [IDEAS.md](IDEAS.md). It covers three things:

1. **The three starting joseki:** which line to teach, checked against modern (AI-era) sources.
2. **Content sources and licenses:** what we can use and how.
3. **Tech:** libraries and what a phone PWA can and can't do.

---

## TL;DR

- **All three starting lines are confirmed** as current joseki in the OGS Joseki Explorer (OJE), which
  checks its entries against professional sources and AI. Two of them are explicitly recommended there
  for double-digit kyu players because they are simple. Exact moves are in section 1.
- **Change for joseki 1:** teach the **simple extension** line of the 3-3 invasion first (6 moves, no
  captures). The famous **double hane** line (13 moves, a cut and a capture) becomes the first
  variation. The old "crawl and hane-connect" ending is outdated since AI, so skip it.
- **Joseki 3 is now concrete:** the small knight approach answered by the **kick** (attach and
  stand), tagged "Joseki: Done · Current · Basic" in OJE.
- **Licenses:** no joseki database has an open license. Write our own SGF files and explanations, and
  use OJE, books and the resigning-in-sente blog as references to check against, not as sources to
  copy from.
- **Tech:** `@sabaki/sgf`, `@sabaki/go-board` and `ts-fsrs` are good fits (all MIT and maintained or
  stable). WGo.js 3 has been alpha since 2021, so skip it.
- **Phone:** **iPhone Safari can't vibrate** (no Vibration API), Android can. That makes "iPhone or
  Android?" a new open question. Install the app to the home screen so its stored progress doesn't
  get cleared.

---

## 1. The three starting joseki

All lines are given in the **upper-right corner, with Black owning the corner** (as on OGS). The app
rotates and mirrors them anyway. Coordinates skip the letter I, as usual.

### Joseki 1: 4-4 point, 3-3 invasion

**Main line: simple extension.** OJE calls it "the simplest of Black's choices". Tags: *Joseki: Done,
Black gets the centre, White gets the corner, Black gets sente*.

| # | Move | Purpose (draft "why") |
| - | ---- | --------------------- |
| 1 | B Q16 | 4-4 point. |
| 2 | W R17 | 3-3 invasion: takes the corner, with just enough room to live. |
| 3 | B R16 | Block on the side you want to build on (here: the right side). |
| 4 | W Q17 | Crawl along the top to get room for a living shape. |
| 5 | B P16 | Simple extension: Black keeps the outside and wants sente. |
| 6 | W O18 | Knight's move slide: White settles in the corner. |

```
   K L M N O P Q R S T
19 . . . . . . . . . .
18 . . . . O . . . . .
17 . . . . . . O O . .
16 . . . . . X X X . .
15 . . . . . . . . . .
```

Result: White lives small in the corner, Black has a wall facing the right side **and sente**. OJE notes
that Black's next move is often on the right side (Q10 or R10), or anywhere else.

SGF: `(;GM[1]SZ[19];B[pd];W[qc];B[qd];W[pc];B[od];W[nb])`

**First variation: double hane.** At move 5, Black hanes instead. OJE: "most often played variation by
professionals nowadays". Tags: *Joseki: Done, Basic, Black gets the corner, White gets the top, White
gets sente*.

| # | Move | Purpose (draft "why") |
| - | ---- | --------------------- |
| 5 | B P17 | Hane: takes away White's room on top. |
| 6 | W P18 | White hanes underneath. |
| 7 | B O18 | Double hane: Black fights to take the corner back. |
| 8 | W O17 | White cuts: atari on P17. |
| 9 | B P16 | Black connects out of atari. |
| 10 | W N18 | Atari on O18. |
| 11 | B Q18 | Black answers with an atari of their own, on P18. |
| 12 | W O19 | White captures one stone: a ponnuki on top. |
| 13 | B R18 | Black ataris the two corner stones and keeps the corner (about 10 points) in gote. |

```
   K L M N O P Q R S T
19 . . . . O . . . . .
18 . . . O . O X X . .
17 . . . . O X O O . .
16 . . . . . X X X . .
15 . . . . . . . . . .
```

SGF: `(;GM[1]SZ[19];B[pd];W[qc];B[qd];W[pc];B[oc];W[ob];B[nb];W[nc];B[od];W[mb];B[pb];W[na];B[qb])`

This line needs ataris and a capture, so the board logic must handle captures from the start (see 3.1).

**Skip (outdated):** the old ending where Black extends after White's second-line hane, White crawls,
and White then plays the hane-connect on the other side. AI shows the hane-connect is a bad exchange
for White: it's sente, but it gives Black a thick tiger's mouth. White should play elsewhere instead
(resigning-in-sente, *The 3-3 Invasion 1*). It "has largely disappeared from high-level opening play".

**Later:** the "push" line and the "flying knife" (OJE calls the latter "the most complicated joseki
currently played", so not for us). "Blocking from the other side" is the same shape mirrored, so the
random orientation already covers it. The real lesson there is *which* side to block on: block on the
side you want to build on. That belongs in the later "context" cards.

### Joseki 2: 4-4 point, low approach, knight's move response

**Main line: slide and two-space extension**, as planned. Tags: *Basic, Position is settled, Black gets
the top, White gets the right*. Black ends in sente.

| # | Move | Purpose (draft "why") |
| - | ---- | --------------------- |
| 1 | B Q16 | 4-4 point. |
| 2 | W R14 | Knight's approach: White starts claiming the right side. |
| 3 | B O17 | Knight's move: Black secures the top side and part of the corner. |
| 4 | W S16 | Slide under Black: takes corner points and starts a base. |
| 5 | B R17 | Block: Black protects the corner. |
| 6 | W R11 | Two-space extension: White now has a base on the right side. |

```
   K L M N O P Q R S T
17 . . . . X . . X . .
16 . . . . . . X . O .
15 . . . . . . . . . .
14 . . . . . . . O . .
13 . . . . . . . . . .
12 . . . . . . . . . .
11 . . . . . . . O . .
```

SGF: `(;GM[1]SZ[19];B[pd];W[qf];B[nc];W[rd];B[qc];W[qi])`

**AI-era note (keep this honest in the app):** OJE says this used to be "the most common joseki" and
"virtually disappeared in professional play" after AI, but "for double-digit kyu players, this can
still be a good choice", and the slide is "recommended … for double-digit kyu players because it's
simple". In modern pro play, after Black's knight's move White usually **plays elsewhere** or
**attaches at R16**. resigning-in-sente agrees that the attachment is AI's early-game favorite, and that
for kyu players "there is usually no significant difference".

**First variation candidates:** White's attachment at R16 (the modern choice), or Black ignoring the
slide (AI's favorite in the very early game, but harder to understand).

### Joseki 3: 3-4 point, small knight approach

**Main line: the kick (attach and stand).** OJE: "AlphaGo reintroduced this move to get the corner in
sente." Tags on the final position: *Joseki: Done, Current, Basic, Black gets the corner and right, White
gets the top, Black gets sente*. OJE also notes that "AI concurs … this sequence indeed leads to an
equal result for both players".

| # | Move | Purpose (draft "why") |
| - | ---- | --------------------- |
| 1 | B R16 | 3-4 point. |
| 2 | W P17 | Small knight approach. |
| 3 | B Q17 | Kick: attach to make White decide right away and secure the corner. |
| 4 | W P16 | Stand: White blocks Black's hane at P16, which would give Black good shape. |
| 5 | B R14 | Extend: Black takes the corner and the right side. |
| 6 | W L17 | Three-space extension: White settles on the top side. |

```
   K L M N O P Q R S T
17 . O . . . O X . . .
16 . . . . . O . X . .
15 . . . . . . . . . .
14 . . . . . . . X . .
```

SGF: `(;GM[1]SZ[19];B[qd];W[oc];B[pc];W[od];B[qf];W[kc])`

**Why this answer:** OJE says that before AlphaGo a pincer was expected, but "AI and current
professionals prefer 'backing off' with Q15 or Q14 or kicking at Q17". The pincer lines are the
complicated ones (see resigning-in-sente, *Dr. Dodge*), so we avoid them. The kick is the only one of
the three that leads to a complete, settled sequence. With the other two, White often just plays
elsewhere.

**First variation candidates:** the knight's move answer **Q14** ("a quiet response … tenuki is quite
popular"), or White's extension at **L16** instead of L17.

### Note on the 3-4 attach-and-draw-back

The famous "attach and draw back" joseki that many beginner books teach answers the **high** approach
(one-space high, at the 4-5 point), not the small knight approach. resigning-in-sente calls it
"beloved by amateurs for its simplicity", and says it "stands up very well to AI analysis". It's a
good candidate for "More 3-4 point joseki" in the later expansions.

---

## 2. Content sources and licenses

**Key point:** a sequence of moves is a fact that anyone can write down. Comments, explanations and
diagrams are someone's writing and are protected. (This is a general rule of thumb, not legal advice.)
So the plan is: **write our own SGF files and our own one-line explanations**, and check each line
against the references below. Add a `SO[...]` (source) property to each SGF to note what we checked it
against.

| Source | What it is | License / terms found | How to use it |
| ------ | ---------- | --------------------- | ------------- |
| **OGS Joseki Explorer (OJE)**, [online-go.com/joseki](https://online-go.com/joseki) | Curated joseki tree. Edit access is by application only. A position counts as joseki only with a professional source ("use in AI-only play alone is not enough"), and mistakes must be validated by AI. Categories: IDEAL / GOOD / TRICK / QUESTION / MISTAKE, plus tags such as "Joseki: Done" or "Basic". | **No content license stated.** OGS's terms page only loads with JavaScript, so it couldn't be read. Code is **AGPL-3.0**. | **Main reference for checking.** Its categories map well onto our `status` field. There is a public but undocumented read endpoint, `https://online-go.com/oje/position?id=<node>&mode=0`, which I used for this research with a few polite requests. Don't bulk-copy it into the app. If we want its data later, ask OGS (the wiki names GreenAsJade and anoek). |
| **resigning-in-sente** blog | KataGo-checked articles for kyu players. Diagrams are embedded SGF (besogo). | "© 2025. All rights reserved." | Great for understanding *why*. Don't copy its text. |
| **Sensei's Library** | Big Go wiki. | **Not checked:** the site blocks automated access (HTTP 403). | Check its copyright page in a browser if we ever want to quote it. |
| **Josekipedia** | Older joseki wiki, still online. | Contributors grant rights **only to Josekipedia**. There's no open license for others. | Reference only. |
| **Wikipedia** | General background. | CC BY-SA 4.0. | Background only. |
| **KataGo** | Strong open-source Go AI. | Code MIT. Networks have their own license. | **Not run here:** downloads from GitHub and katagotraining.org are blocked in this environment. OJE's AI validation covers us for now. Running KaTrain or Lizzie locally is the easy way to check new lines later. |

---

## 3. Tech

### 3.1 Libraries (checked on npm, 2026-11-24)

| Package | Version / last release | License | Verdict |
| ------- | ---------------------- | ------- | ------- |
| `@sabaki/sgf` | 3.5.0 · Jul 2026 | MIT | **Use** for SGF parsing in the build step. Custom properties work. |
| `@sabaki/go-board` | 1.4.3 · Sep 2021 | MIT | **Use** for legal moves and captures. Small and stable rather than abandoned. Captures are needed for the double hane line. |
| `@sabaki/shudan` | 1.8.0 · Jul 2026 | MIT | Possible board component. Needs Preact 8 or 10 (React only through `preact/compat`). For the custom wood look and the zoomed corner, a **small custom SVG board** is probably still simpler, as IDEAS.md suggests. |
| `ts-fsrs` | 6.0.1 · Nov 2026 | MIT | **Use** when switching to FSRS (FSRS-6). Its dev tooling asks for Node ≥ 24. |
| `wgo` (WGo.js 3) | 3.0.0-alpha.10 · May 2021 | MIT | **Skip:** still alpha after 5 years. |
| `besogo` | 0.0.2-alpha | MIT | Not for the app, but a handy **editor for writing the SGF trees** (resigning-in-sente uses it). |

### 3.2 What a phone PWA can and can't do

| Feature | iPhone (Safari / home-screen app) | Android (Chrome) | Consequence |
| ------- | --------------------------------- | ---------------- | ----------- |
| **Vibration** (`navigator.vibrate`) | **Not supported** (caniuse, up to iOS 27.2) | Supported | On iPhone, the "light vibration" from section 4 of IDEAS.md isn't possible in a PWA. There are rumoured workarounds (Safari's `<input switch>` haptic) but I couldn't verify them, so test on a real device. Otherwise lean on sound and animation, or go native later. |
| **Keeping progress** (IndexedDB) | In plain Safari, data can be cleared after 7 days of Safari use without visiting the site. Home-screen apps have their own counter, and WebKit says it doesn't expect them to lose data. `navigator.storage.persist()` works from iOS 17 and is granted by heuristics, such as being a home-screen app. | Works. `persist()` is supported. | **Install to the home screen**, call `persist()`, and add a small **export/import backup** button. |
| **Daily reminder** (Web Push) | Since iOS 16.4, **home-screen apps only**, with permission asked from a tap | Works | Push needs a server to send the message, which conflicts with "no server". The reminder is off by default anyway, so leave it for later. |
| **Stone sounds** (Web Audio) | Audio must be unlocked by a user tap | Same | Easy: create or resume the `AudioContext` when the user taps **Start**. Check how the iPhone silent switch behaves on a real device. |

---

## 4. New or changed open questions

- ~~**iPhone or Android?**~~ **Android** (decided 2026-11-24), so vibration works.
- ~~**Joseki 1 order**~~ **Yes:** simple extension first, double hane as the first variation.
- ~~**Joseki 2 honesty note**~~ **Yes:** teach the slide, with one sentence in the app.
- **OJE data:** stay reference-only (recommended for a personal tool), or ask OGS for permission to
  reuse their tree later?

---

## Sources

- OGS Joseki Explorer: [online-go.com/joseki](https://online-go.com/joseki) (positions read via its
  public endpoint), [OJE wiki](https://github.com/online-go/online-go.com/wiki/OGS-Joseki-Explorer),
  [editing guidelines](https://github.com/online-go/online-go.com/wiki/Adding-and-Editing-OGS-Joseki),
  [launch announcement](https://forums.online-go.com/t/the-ogs-joseki-dictionary-is-live/22818),
  [repository license](https://github.com/online-go/online-go.com/blob/main/LICENSE)
- resigning-in-sente:
  [3-3 invasion intro](https://resigning-in-sente.github.io/joseki/44/2021/02/21/44-33-invasion-1-intro/),
  [double hane](https://resigning-in-sente.github.io/joseki/44/2021/02/21/44-33-invasion-2-1-double-hane/),
  [4-4 low approach: slide or attach](https://resigning-in-sente.github.io/joseki/44/2021/02/18/44-low-slide-attach/),
  [attach-draw back intro](https://resigning-in-sente.github.io/joseki/34/2021/07/20/34-attach-drawback-1-intro/),
  [Dr. Dodge (3-4 pincers)](https://resigning-in-sente.github.io/joseki/34/2021/07/09/34-pincer-avoid/),
  [3-4 approaches: the 4-4 attachment](https://resigning-in-sente.github.io/joseki/34/2021/08/03/44-attach/)
- Josekipedia: [contributing and copyright policy](https://www.josekipedia.com/info/contributing.php)
- [Jōseki on Wikipedia](https://en.wikipedia.org/wiki/J%C5%8Dseki)
- Phone platform: [caniuse: Vibration](https://caniuse.com/vibration),
  [MDN: navigator.vibrate](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate),
  [WebKit: storage policy (2023)](https://webkit.org/blog/14403/updates-to-storage-policy/),
  [WebKit: 7-day storage cap (2020)](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/),
  [WebKit: Web Push on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/),
  [MDN: Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- npm registry (`npm view`) for package versions, licenses and release dates
