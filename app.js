"use strict";
// Joseki Teacher v0.1: plain JS, no build step.
// Content comes from content/joseki/*.sgf (see content/joseki/README.md).

const CONTENT = ["content/joseki/33-invasion.sgf"];
const STORAGE_KEY = "joseki-teacher:v1";
const NEW_CARDS_PER_DAY = 1;              // one new (line, color) card per day
const REVIEW_INTERVALS = [1, 3, 7, 16, 35, 80]; // days, Leitner box 1..6
const OPPONENT_DELAY = 450;               // ms before the opponent's reply

const COLS = "ABCDEFGHJKLMNOPQRST";
// Board view: the upper-right corner, columns K..T (x 9..18), rows 19..10 (y 0..9).
const S = 40, X0 = 9, PAD_L = 20, PAD_T = 52;
const cx = (x) => PAD_L + (x - X0) * S;
const cy = (y) => PAD_T + y * S;
const pointName = (x, y) => COLS[x] + (19 - y);
const colorName = (c) => (c === "B" ? "Black" : "White");
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- dates ----------
const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => fmt(new Date());
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmt(d); };

// ---------- SGF ----------
function parseSgf(t) {
  let i = 0;
  const ws = () => { while (i < t.length && /\s/.test(t[i])) i++; };
  function tree() {
    ws();
    if (t[i] !== "(") throw new Error("SGF: '(' expected at " + i);
    i++; ws();
    let first = null, prev = null;
    while (t[i] === ";") {
      i++; ws();
      const node = { props: {}, children: [] };
      while (/[A-Z]/.test(t[i])) {
        let id = "";
        while (/[A-Z]/.test(t[i])) id += t[i++];
        ws();
        const vals = [];
        while (t[i] === "[") {
          i++;
          let v = "";
          while (t[i] !== "]") { if (t[i] === "\\") i++; v += t[i++]; }
          i++; ws();
          vals.push(v);
        }
        node.props[id] = vals;
      }
      if (prev) prev.children.push(node); else first = node;
      prev = node; ws();
    }
    while (t[i] === "(") { prev.children.push(tree()); ws(); }
    if (t[i] !== ")") throw new Error("SGF: ')' expected at " + i);
    i++;
    return first;
  }
  return tree();
}

function extractLines(root, josekiName) {
  const lines = [];
  (function walk(node, moves) {
    const p = node.props;
    for (const c of ["B", "W"]) {
      if (p[c]) {
        const v = p[c][0];
        moves = [...moves, { color: c, x: v.charCodeAt(0) - 97, y: v.charCodeAt(1) - 97, why: (p.C || [""])[0] }];
      }
    }
    if (!node.children.length && p.JL) {
      lines.push({
        id: p.JL[0],
        name: (p.JN || [josekiName])[0],
        unlockAfter: p.JU ? p.JU[0] : null,
        result: (p.JR || [""])[0],
        moves,
      });
    }
    node.children.forEach((c) => walk(c, moves));
  })(root, []);
  return lines;
}

// ---------- rules (captures) ----------
const key = (x, y) => x + "," + y;
function neighbors(x, y) {
  return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => a >= 0 && a < 19 && b >= 0 && b < 19);
}
function groupAt(board, x, y) {
  const color = board.get(key(x, y));
  const stones = new Set([key(x, y)]), stack = [[x, y]];
  let libs = 0; const seenLib = new Set();
  while (stack.length) {
    const [a, b] = stack.pop();
    for (const [nx, ny] of neighbors(a, b)) {
      const k = key(nx, ny), c = board.get(k);
      if (!c) { if (!seenLib.has(k)) { seenLib.add(k); libs++; } }
      else if (c === color && !stones.has(k)) { stones.add(k); stack.push([nx, ny]); }
    }
  }
  return { stones, libs };
}
function playOn(board, m) {
  board.set(key(m.x, m.y), m.color);
  const opp = m.color === "B" ? "W" : "B";
  for (const [nx, ny] of neighbors(m.x, m.y)) {
    if (board.get(key(nx, ny)) === opp) {
      const g = groupAt(board, nx, ny);
      if (!g.libs) g.stones.forEach((s) => board.delete(s));
    }
  }
}

// ---------- board view ----------
const view = { board: new Map(), last: null, hint: null, wrong: null, numbers: new Map() };

const STONE_BASE = { B: "#1b1b1b", W: "#f1ede4" };
function stone(x, y, color, opacity) {
  const r = S * 0.47;
  return `<g opacity="${opacity}">` +
    `<circle cx="${cx(x)}" cy="${cy(y)}" r="${r}" fill="${STONE_BASE[color]}"` +
    (color === "W" ? ` stroke="#a39a8a" stroke-width="0.8"` : "") + `/>` +
    `<circle cx="${cx(x)}" cy="${cy(y)}" r="${r}" fill="url(#jt-shine-${color}) none"/></g>`;
}

function renderBoard() {
  const svg = $("board");
  const parts = [];
  // Every stone and the board get a solid base color first. The gradients only add shine on top,
  // with a fallback, so a browser that can't resolve them still shows correct colors.
  parts.push(`<defs>
    <linearGradient id="jt-wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e4bf78"/><stop offset="0.5" stop-color="#d8ae62"/><stop offset="1" stop-color="#c99b4f"/>
    </linearGradient>
    <radialGradient id="jt-shine-B" cx="0.35" cy="0.3" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="jt-shine-W" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.65" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#6b6253" stop-opacity="0.3"/>
    </radialGradient>
  </defs>`);
  parts.push(`<rect width="420" height="432" fill="#d8ae62"/>`);
  parts.push(`<rect width="420" height="432" fill="url(#jt-wood) none"/>`);
  // grid: board edges on top (y=0) and right (x=18); lines run off the view to the left and bottom
  for (let x = X0; x <= 18; x++) parts.push(`<line x1="${cx(x)}" y1="${cy(0)}" x2="${cx(x)}" y2="432" stroke="#3b2a17" stroke-width="${x === 18 ? 2 : 1}"/>`);
  for (let y = 0; y <= 9; y++) parts.push(`<line x1="0" y1="${cy(y)}" x2="${cx(18)}" y2="${cy(y)}" stroke="#3b2a17" stroke-width="${y === 0 ? 2 : 1}"/>`);
  for (const [x, y] of [[9, 3], [15, 3], [9, 9], [15, 9]]) parts.push(`<circle cx="${cx(x)}" cy="${cy(y)}" r="3.5" fill="#3b2a17"/>`);
  for (let x = X0; x <= 18; x++) parts.push(`<text x="${cx(x)}" y="22" text-anchor="middle" font-size="13" fill="#5b4326">${COLS[x]}</text>`);
  for (let y = 0; y <= 9; y++) parts.push(`<text x="${cx(18) + 22}" y="${cy(y) + 4.5}" text-anchor="middle" font-size="13" fill="#5b4326">${19 - y}</text>`);
  // stones
  for (const [k, c] of view.board) {
    const [x, y] = k.split(",").map(Number);
    if (x < X0 || y > 9) continue;
    parts.push(`<circle cx="${cx(x) + 1.5}" cy="${cy(y) + 2}" r="${S * 0.47}" fill="rgba(0,0,0,0.3)"/>`);
    parts.push(stone(x, y, c, 1));
  }
  if (view.last) {
    const c = view.board.get(key(view.last.x, view.last.y));
    if (c) parts.push(`<circle cx="${cx(view.last.x)}" cy="${cy(view.last.y)}" r="${S * 0.16}" fill="none" stroke="${c === "B" ? "#f3ece2" : "#202020"}" stroke-width="2.5"/>`);
  }
  if (view.hint) {
    const { x, y, color, strong } = view.hint;
    parts.push(stone(x, y, color, strong ? 0.75 : 0.35));
    if (strong) parts.push(`<circle cx="${cx(x)}" cy="${cy(y)}" r="${S * 0.5}" fill="none" stroke="#7fd36a" stroke-width="3"/>`);
  }
  if (view.wrong) {
    const { x, y } = view.wrong, r = S * 0.28;
    parts.push(`<path d="M${cx(x) - r} ${cy(y) - r}L${cx(x) + r} ${cy(y) + r}M${cx(x) + r} ${cy(y) - r}L${cx(x) - r} ${cy(y) + r}" stroke="#d2402a" stroke-width="5" stroke-linecap="round"/>`);
  }
  svg.innerHTML = parts.join("");
}

function resetBoard() {
  Object.assign(view, { board: new Map(), last: null, hint: null, wrong: null });
  renderBoard();
}
function place(m) {
  playOn(view.board, m);
  view.last = m; view.hint = null; view.wrong = null;
  renderBoard();
}

// ---------- input ----------
let tapResolver = null;
$("board").addEventListener("pointerup", (e) => {
  if (!tapResolver) return;
  const svg = $("board");
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  const x = Math.round((p.x - PAD_L) / S) + X0, y = Math.round((p.y - PAD_T) / S);
  if (x < X0 || x > 18 || y < 0 || y > 9) return;
  const r = tapResolver; tapResolver = null; r({ x, y });
});
const waitTap = () => new Promise((r) => (tapResolver = r));

function setText(html) { $("text").innerHTML = html; }
function waitButton(label, primary = true) {
  return new Promise((resolve) => {
    const b = document.createElement("button");
    b.textContent = label;
    if (primary) b.className = "primary";
    b.onclick = () => { $("actions").innerHTML = ""; resolve(); };
    $("actions").innerHTML = "";
    $("actions").append(b);
  });
}
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const moveLine = (m) => `<b>${colorName(m.color)} ${pointName(m.x, m.y)}</b>: ${esc(m.why)}`;

// ---------- storage ----------
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { cards: {}, newDone: {} }; }
  catch { return { cards: {}, newDone: {} }; }
}
const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

// ---------- training ----------
let lines = [];
let state = loadState();

function unlockedLines() {
  return lines.filter((l) => !l.unlockAfter ||
    ["B", "W"].some((c) => state.cards[`${l.unlockAfter}:${c}`]?.stage === "review"));
}

function buildQueue() {
  const t = today(), q = [];
  const open = unlockedLines();
  for (const l of open) for (const c of ["B", "W"]) {
    const id = `${l.id}:${c}`, card = state.cards[id];
    if (card && card.due <= t) q.push({ id, line: l, color: c });
  }
  let newLeft = NEW_CARDS_PER_DAY - (state.newDone[t] || 0);
  for (const l of open) for (const c of ["B", "W"]) {
    const id = `${l.id}:${c}`;
    if (!state.cards[id] && newLeft > 0) { q.push({ id, line: l, color: c, isNew: true }); newLeft--; }
  }
  return q;
}

// "I want more": the next new card even past today's limit; if every unlocked card is already
// learned, a few extra practice runs (soonest due first) that don't change the review schedule.
function moreQueue() {
  for (const l of unlockedLines()) for (const c of ["B", "W"]) {
    const id = `${l.id}:${c}`;
    if (!state.cards[id]) return [{ id, line: l, color: c, isNew: true }];
  }
  return Object.entries(state.cards)
    .sort((a, b) => a[1].due.localeCompare(b[1].due))
    .slice(0, 3)
    .map(([id]) => {
      const [lineId, color] = id.split(":");
      return { id, line: lines.find((l) => l.id === lineId), color, practice: true, extra: true };
    })
    .filter((i) => i.line);
}

function header(item, stage) {
  $("title").textContent = item.line.name;
  $("subtitle").textContent = `${stage} · you play ${colorName(item.color)}`;
}

async function watch(item) {
  resetBoard();
  header(item, "New line: watch");
  setText(`A new line! First watch it once, move by move.\nYou'll play <b>${colorName(item.color)}</b>.`);
  await waitButton("Show first move");
  for (const [i, m] of item.line.moves.entries()) {
    place(m);
    setText(moveLine(m));
    await waitButton(i < item.line.moves.length - 1 ? "Next" : "Finish");
  }
  setText(`<b>Result:</b> ${esc(item.line.result)}`);
  await waitButton("Now you try");
}

// Plays through a line. Returns true if every move was right on the first try.
async function drill(item, stage, guided) {
  resetBoard();
  header(item, stage);
  let mistakes = 0;
  setText(guided
    ? `Play the line with help: the faint stone shows the move.`
    : `Play the line from memory.`);
  for (const [i, m] of item.line.moves.entries()) {
    if (m.color !== item.color) {
      await sleep(OPPONENT_DELAY);
      place(m);
      setText(moveLine(m) + (i < item.line.moves.length - 1 ? `\n\nYour move.` : ""));
      continue;
    }
    if (guided) { view.hint = { x: m.x, y: m.y, color: m.color }; renderBoard(); }
    for (;;) {
      const p = await waitTap();
      if (view.board.has(key(p.x, p.y))) continue;
      if (p.x === m.x && p.y === m.y) {
        place(m);
        setText(`<span class="ok">✓</span> ` + moveLine(m));
        break;
      }
      mistakes++;
      view.wrong = p;
      view.hint = { x: m.x, y: m.y, color: m.color, strong: true };
      renderBoard();
      setText(`<span class="bad">✗ Not quite.</span> The joseki move is ${pointName(m.x, m.y)}.\n` + moveLine(m));
      await waitButton("Continue");
      place(m);
      break;
    }
  }
  await sleep(300);
  setText(`<b>Result:</b> ${esc(item.line.result)}\n\n` +
    (mistakes ? `<span class="bad">${mistakes} mistake${mistakes > 1 ? "s" : ""}.</span> This line comes back soon.`
              : `<span class="ok">Perfect.</span>`));
  await waitButton("Next");
  return mistakes === 0;
}

async function runItem(item) {
  const t = today();
  if (item.practice) return drill(item, item.extra ? "Extra practice" : "Once more", false);
  if (item.isNew) {
    await watch(item);
    await drill(item, "New line: guided", true);
    state.cards[item.id] = { stage: "recall", box: 0, due: addDays(1) };
    state.newDone = { [t]: (state.newDone[t] || 0) + 1 }; // only today's count matters
    saveState();
    return true;
  }
  const card = state.cards[item.id];
  const ok = await drill(item, card.stage === "recall" ? "Recall" : "Review", false);
  if (ok) {
    card.stage = "review";
    card.box = Math.min(card.box + 1, REVIEW_INTERVALS.length);
    card.due = addDays(REVIEW_INTERVALS[card.box - 1]);
  } else {
    card.box = card.stage === "review" ? 1 : 0;
    card.due = addDays(1);
  }
  saveState();
  return ok;
}

async function session(queue) {
  $("home").hidden = true; $("train").hidden = false;
  while (queue.length) {
    const item = queue.shift();
    const ok = await runItem(item);
    if (!ok && !item.practice) queue.push({ ...item, isNew: false, practice: true });
  }
  showHome();
}

function showHome() {
  $("train").hidden = true; $("home").hidden = false;
  const q = buildQueue();
  const reviews = q.filter((i) => !i.isNew).length, fresh = q.length - reviews;
  if (!q.length) {
    $("summary").textContent = "Done for today.\nSee you tomorrow.";
    $("start").hidden = true;
    const more = moreQueue();
    $("more").hidden = !more.length;
    $("more").textContent = more.some((i) => i.isNew) ? "I want more: learn a new line" : "I want more: extra practice";
    return;
  }
  const parts = [];
  if (reviews) parts.push(`${reviews} review${reviews > 1 ? "s" : ""}`);
  if (fresh) parts.push(`${fresh} new line${fresh > 1 ? "s" : ""}`);
  $("summary").textContent = `Today: ${parts.join(" · ")}\nabout ${Math.max(1, q.length * (fresh ? 2 : 1))} min`;
  $("start").hidden = false;
  $("more").hidden = true;
}

$("start").onclick = () => session(buildQueue());
$("more").onclick = () => session(moreQueue());

async function init() {
  if (new URLSearchParams(location.search).has("reset")) {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    history.replaceState(null, "", location.pathname);
  }
  for (const url of CONTENT) {
    const text = await (await fetch(url)).text();
    const root = parseSgf(text);
    lines.push(...extractLines(root, (root.props.GN || [""])[0]));
  }
  resetBoard();
  showHome();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
}
init().catch((e) => { $("summary").textContent = "Could not load: " + e.message; });
