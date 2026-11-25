// Joseki – a tiny, dependency-free runtime: a template with {{bindings}}, <sc-if> and <sc-for>,
// rendered from Component.renderVals() and patched into the live DOM (so CSS animations keep running).
const UNLOCK_ALL = true; // set to false to unlock the joseki one after another
const STORE = 'joseki.learned';

class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; this._render = null; }
  setState(p) {
    Object.assign(this.state, typeof p === 'function' ? p(this.state) : p);
    if (p && p.learned) { try { localStorage.setItem(STORE, JSON.stringify(this.state.learned)); } catch (e) { /* private mode */ } }
    if (this._render) this._render();
  }
}

const MUST = /\{\{\s*([\w.$]+)\s*\}\}/g;
const ONE = /^\s*\{\{\s*([\w.$]+)\s*\}\}\s*$/;
const get = (scope, path) => { let v = scope; for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; } return v; };
const interp = (str, scope) => str.replace(MUST, (m, p) => { const v = get(scope, p); return v == null || v === false ? '' : String(v); });

function build(node, scope, parent, path, inLoop) {
  if (node.nodeType === 3) { parent.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
  if (node.nodeType !== 1) return;
  const tag = node.tagName.toLowerCase();
  if (tag === 'sc-if') {
    if (get(scope, node.getAttribute('value').match(ONE)[1])) node.childNodes.forEach((c, i) => build(c, scope, parent, path + '.' + i, inLoop));
    return;
  }
  if (tag === 'sc-for') {
    const list = get(scope, node.getAttribute('list').match(ONE)[1]) || [], as = node.getAttribute('as');
    list.forEach((item, n) => { const sc = Object.create(scope); sc[as] = item; node.childNodes.forEach((c, i) => build(c, sc, parent, path + '.' + i, true)); });
    return;
  }
  const el = document.createElement(tag);
  let ident = '';
  for (const a of node.attributes) {
    if (/^on/i.test(a.name) && ONE.test(a.value)) { const fn = get(scope, a.value.match(ONE)[1]); el[a.name.toLowerCase()] = typeof fn === 'function' ? fn : null; continue; }
    const v = interp(a.value, scope);
    el.setAttribute(a.name, v);
    if (a.name === 'style' || a.name === 'aria-label') ident += v;
  }
  el.__k = inLoop ? path + '#' + ident : path;
  node.childNodes.forEach((c, i) => build(c, scope, el, path + '.' + i, false));
  parent.appendChild(el);
}

function patch(o, n) {
  if (o.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
  for (const a of n.attributes) if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value);
  for (const a of [...o.attributes]) if (!n.hasAttribute(a.name)) o.removeAttribute(a.name);
  o.onclick = n.onclick;
  morphChildren(o, n);
}

function morphChildren(oldP, newP) {
  const olds = [...oldP.childNodes], byKey = new Map(), texts = [];
  olds.forEach(o => { if (o.__k !== undefined) { if (!byKey.has(o.__k)) byKey.set(o.__k, []); byKey.get(o.__k).push(o); } else if (o.nodeType === 3) texts.push(o); });
  let ti = 0;
  const result = [...newP.childNodes].map(n => {
    let m = null;
    if (n.__k !== undefined) { const arr = byKey.get(n.__k); if (arr && arr.length) m = arr.shift(); }
    else if (n.nodeType === 3 && ti < texts.length) m = texts[ti++];
    if (m) { patch(m, n); return m; }
    return n;
  });
  const keep = new Set(result);
  olds.forEach(o => { if (!keep.has(o)) o.remove(); });
  let ref = oldP.firstChild;
  result.forEach(nd => { if (nd === ref) ref = ref.nextSibling; else oldP.insertBefore(nd, ref); });
}

function mount(root, Comp) {
  const comp = new Comp({}), tpl = document.getElementById('tpl');
  if (location.search.includes('reset')) { try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ } }
  try { const saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (saved) comp.state.learned = saved; } catch (e) { /* ignore */ }
  const draw = () => {
    const vals = comp.renderVals(), tmp = document.createElement('div');
    tpl.content.childNodes.forEach((n, i) => build(n, vals, tmp, String(i), false));
    morphChildren(root, tmp);
  };
  comp._render = draw;
  draw();
}

const MIN_H = 660; // the tallest screen needs about this much room (in design pixels)
function fit() {
  const el = document.getElementById('fit');
  const iw = window.innerWidth, ih = window.innerHeight;
  const s = Math.min(iw / 390, ih / MIN_H, 2.4);
  el.style.height = (ih / s).toFixed(1) + 'px';
  el.style.transform = 'translate(' + ((iw - 390 * s) / 2).toFixed(1) + 'px,0) scale(' + s.toFixed(4) + ')';
}


