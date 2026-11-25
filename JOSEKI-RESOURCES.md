# Joseki resources: where to look before adding the next joseki

A reading list to come back to when deciding which joseki to add next. Collected from web searches on
2026-11-25. For licenses and the rule "write our own SGF and explanations", see
[RESEARCH.md, section 2](RESEARCH.md#2-content-sources-and-licenses). Nothing here has been checked
move by move yet.

## Already in the app or planned

| Joseki | State |
| ------ | ----- |
| 4-4 point: 3-3 invasion | Done: [content/joseki/33-invasion.sgf](content/joseki/33-invasion.sgf) |
| 4-4 point: low approach, knight's move response | Planned, moves in [RESEARCH.md](RESEARCH.md#joseki-2-4-4-point-low-approach-knights-move-response) |
| 3-4 point: small knight approach, the kick | Planned, moves in [RESEARCH.md](RESEARCH.md#joseki-3-3-4-point-small-knight-approach) |

## Candidates for later

A starting list, roughly in the order a 25k–15k player meets them. Check each against OJE before
writing it.

- **4-4 point, low approach, the attach (instead of the knight's move):** very common in modern play.
- **4-4 point, high approach (5-4 / 6-4):** the other common approach to the star point.
- **3-4 point, high approach (5-4):** the second standard approach to the 3-4 point.
- **3-4 point, small knight approach, attach and draw back:** see the note in
  [RESEARCH.md](RESEARCH.md#note-on-the-3-4-attach-and-draw-back).
- **3-4 point, pincers:** only after the basics; resigning-in-sente's "Dr. Dodge" article explains how
  to avoid them simply.
- **3-3 point:** GoBase's beginner set covers it, but it's rare in kyu games.

## Beginner reading (to choose lines and understand the "why")

| Resource | What it is | Notes |
| -------- | ---------- | ----- |
| [GoBase: basic joseki](https://gobase.org/studying/joseki/basic) | About 25 variations for the 3-3, 3-4 and 4-4 points, sorted by corner point ([4-4](https://gobase.org/studying/joseki/basic/?pat=4%2C4), [3-4](https://gobase.org/studying/joseki/basic/?pat=4%2C3)). | Good checklist for "the beginner package". Older, pre-AI content: check lines against OJE. |
| [AllAboutGo: An Introduction to Joseki](https://allaboutgo.com/lessons/intermediate/lesson-4-joseki-introduction.html) | Move-by-move lesson on the 4-4 low approach and the 3-3 invasion. | Useful as a model for short, plain explanations. |
| [OGS forum: Joseki basics (19x19 for beginners, part 4)](https://forums.online-go.com/t/19x19-for-beginners-series-part-4-joseki-basics/31713) | Friendly beginner overview. | Background. |
| [OGS forum: Learning joseki, when and how?](https://forums.online-go.com/t/learning-joseki-when-to-learn-and-how/15679/41) | Discussion on how much joseki a kyu player needs. | Helps decide the order. |
| [resigning-in-sente: 3-4 approaches, the 4-4 attachment](https://resigning-in-sente.github.io/joseki/34/2021/08/03/44-attach) | KataGo-checked article for kyu players. | More articles listed in [RESEARCH.md](RESEARCH.md#sources). All rights reserved: don't copy text. |
| *38 Basic Joseki* (Kosugi and Davies) | Classic book covering the 3-3, 3-4 and 4-4 points. | Buy or borrow it. The copies found online aren't clearly legitimate. Pre-AI, so some lines are outdated. |
| [Wikipedia: Jōseki](https://en.wikipedia.org/wiki/J%C5%8Dseki), [Go opening](https://en.wikipedia.org/wiki/Go_opening) | General background on the corner points and standard approaches. | CC BY-SA 4.0. |

## Databases and data files

| Resource | What it is | License |
| -------- | ---------- | ------- |
| [OGS Joseki Explorer](https://online-go.com/joseki) | Curated, AI-checked joseki tree. | No content license. Main reference for checking (see RESEARCH.md). |
| [Josekipedia](https://www.josekipedia.com) | Community joseki wiki. | Rights go to Josekipedia only. Reference only. |
| Kogo's Joseki Dictionary | One large SGF file with many joseki, long passed around for free. | Not checked. Pre-AI. Reference only until a license is found. |
| [GNU Go pattern files](https://sources.debian.org/src/gnugo-dv/3.1.27-1/patterns/fuseki.db/) | Joseki and fuseki patterns used by the GNU Go engine. | GPL. Old and engine-oriented, not teaching material. |
| [Joe's Go Database](https://pjreddie.com/projects/jgdb/) | 500,000+ pro and top amateur games in SGF. | Not checked. Could show how often a line is actually played. |
| [Sensei's Library: link collection](https://senseis.xmp.net/?Internet), [BGA software catalogue](https://britgo.org/node/998) | Lists of more Go resources. | Starting points for finding more. |

## How to pick the next joseki

1. Is it something a 25k–15k player meets in most games? (Approaches to the 4-4 and 3-4 points first.)
2. Is it current in OJE (tagged "Joseki: Done", ideally "Basic")?
3. Is the main line short and simple, with no tricky fights?
4. Then write our own SGF and explanations, following [content/joseki/README.md](content/joseki/README.md).
