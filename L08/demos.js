// Interactive demos for DM101 Lecture 8 (functions). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L08-functions.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same things so that the inputs can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

// Lecture-only styles (arrow diagrams, relation grid, bars).
(() => {
  const css = `
.dm-fig .arrow { stroke-width: 2; fill: none; }
.dm-fig .arrow.A { stroke: var(--teal); } .dm-fig .arrow.B { stroke: var(--amber); } .dm-fig .arrow.HL { stroke: var(--red); }
.dm-fig .oval { fill: none; stroke-width: 1.6; }
.dm-fig text.lab { font-size: 13px; fill: var(--ink); }
.dm-fig text.big { font-size: 15px; }
.l8-grid { border-collapse: collapse; margin: 8px 0; font-size: 13px; }
.l8-grid th, .l8-grid td { padding: 3px 6px; text-align: center; }
.l8-grid th { color: var(--ink-2); font-weight: 600; }
.l8-grid input { width: 18px; height: 18px; accent-color: var(--teal); }
.l8-flags { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 0; }
.l8-flag { font-size: 12.5px; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--line); color: var(--ink-2); }
.l8-flag.yes { background: var(--teal); border-color: var(--teal); color: var(--paper); }
.l8-flag.no { text-decoration: line-through; }
.l8-wrap { overflow-x: auto; max-width: 100%; }
.l8-sets td { padding: 2px 4px; }
`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
})();

const SVGNS = "http://www.w3.org/2000/svg";

function svg(el, w, h, label) {
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${h}`);
  s.setAttribute("class", "dm-fig");
  s.setAttribute("role", "img");
  s.setAttribute("aria-label", label);
  s.style.maxWidth = `${w}px`;
  el.appendChild(s);
  const defs = document.createElementNS(SVGNS, "defs");
  s.appendChild(defs);
  for (const [id, color] of [["A", "var(--teal)"], ["B", "var(--amber)"], ["HL", "var(--red)"]]) {
    const m = document.createElementNS(SVGNS, "marker");
    for (const [k, v] of Object.entries({ id: `l8-head-${id}`, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" })) m.setAttribute(k, v);
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", "M0,0 L10,5 L0,10 z");
    p.setAttribute("fill", color);
    m.appendChild(p);
    defs.appendChild(m);
  }
  const add = (tag, attrs, parent = s) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  };
  const text = (x, y, t, cls = "ink") => { const n = add("text", { x, y, class: cls }); n.textContent = t; return n; };
  const clear = () => { while (s.lastChild && s.lastChild !== defs) s.removeChild(s.lastChild); };
  return { s, add, text, clear };
}

// Draw an arrow diagram: left labels, right labels, pairs [i, j] (left i -> right j), with roles per pair.
function arrowDiagram(g, W, H, left, right, pairs, opts = {}) {
  g.clear();
  const lx = W * 0.27, rx = W * 0.73, top = 34, bot = H - 22;
  const ys = (k) => Array.from({ length: k }, (_, i) => (k === 1 ? (top + bot) / 2 : top + (i * (bot - top)) / (k - 1)));
  const ly = ys(left.length), ry = ys(right.length);
  g.add("ellipse", { cx: lx - 18, cy: (top + bot) / 2, rx: 62, ry: (bot - top) / 2 + 18, class: "oval A" });
  g.add("ellipse", { cx: rx + 18, cy: (top + bot) / 2, rx: 62, ry: (bot - top) / 2 + 18, class: "oval B" });
  if (opts.titles) { g.text(lx - 18, 14, opts.titles[0], "lab"); g.text(rx + 18, 14, opts.titles[1], "lab"); }
  const hit = new Map();
  pairs.forEach(([i, j]) => hit.set(j, (hit.get(j) || 0) + 1));
  left.forEach((t, i) => { g.add("circle", { cx: lx, cy: ly[i], r: 4.5, class: "A" }); const n = g.text(lx - 10, ly[i] + 4, t, "lab"); n.style.textAnchor = "end"; });
  right.forEach((t, j) => {
    const c = (hit.get(j) || 0) > 1 ? "HL" : hit.get(j) ? "B" : "DIM";
    g.add("circle", { cx: rx, cy: ry[j], r: c === "DIM" ? 4.5 : 5.5, class: c });
    const n = g.text(rx + 10, ry[j] + 4, t, "lab"); n.style.textAnchor = "start";
  });
  pairs.forEach(([i, j], k) => {
    const role = (opts.roles && opts.roles[k]) || "A";
    const [x0, y0, x1, y1] = opts.reverse ? [rx - 8, ry[j], lx + 8, ly[i]] : [lx + 8, ly[i], rx - 9, ry[j]];
    g.add("line", { x1: x0, y1: y0, x2: x1, y2: y1, class: `arrow ${role}`, "marker-end": `url(#l8-head-${role})` });
  });
}

// Properties of a relation given as a list of pairs [i, j] on |A| = nA, |B| = nB.
function props(pairs, nA, nB) {
  const outs = Array.from({ length: nA }, () => []);
  const ins = Array.from({ length: nB }, () => []);
  pairs.forEach(([i, j]) => { outs[i].push(j); ins[j].push(i); });
  const total = outs.every((o) => o.length >= 1), single = outs.every((o) => o.length <= 1);
  const fn = total && single;
  const inj = fn && ins.every((x) => x.length <= 1), sur = fn && ins.every((x) => x.length >= 1);
  return { outs, ins, total, single, fn, inj, sur, bij: inj && sur };
}

const flags = (list) => `<div class="l8-flags">${list.map(([t, ok]) => `<span class="l8-flag ${ok ? "yes" : "no"}">${t}</span>`).join("")}</div>`;

// ---------- Hero · a plan cycling through the four questions ----------

function demoArrowMini(el) {
  el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
  const W = 420, H = 210;
  const g = svg(el.querySelector(".fig"), W, H, "An arrow diagram from four students to five seats");
  const S = ["Ana", "Ben", "Cai", "Dev"], T = ["1", "2", "3", "4", "5"];
  const stages = [
    { p: [[0, 1], [1, 4], [2, 1], [3, 3]], t: "Plan P: a function (one arrow out of every student), but seat 2 gets two and seats 1, 3 none." },
    { p: [[0, 1], [1, 4], [1, 0], [2, 1], [3, 3]], r: ["A", "A", "HL", "A", "A"], t: "Ben gets a second seat: not a function." },
    { p: [[0, 2], [1, 4], [2, 0], [3, 3]], t: "Plan P₂: one-to-one (no seat shared), not onto (seat 2 empty)." },
  ];
  let k = 0;
  const show = () => {
    const st = stages[k % stages.length];
    arrowDiagram(g, W, H, S, T, st.p, { roles: st.r });
    el.querySelector(".dm-read").textContent = st.t;
    k++;
  };
  show();
  setInterval(show, 2600);
}

// ---------- Demo 1 · Build a relation (tick pairs) ----------

function demoArrows(el) {
  const S = ["Ana", "Ben", "Cai", "Dev", "Eli"];
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>students <select class="na"><option>3</option><option selected>4</option><option>5</option></select></label>
      <label>seats <select class="nb"><option>3</option><option>4</option><option selected>5</option></select></label>
      <button class="preset" data-p="P">plan P</button><button class="preset" data-p="Q1">Q₁</button><button class="preset" data-p="Q2">Q₂</button><button class="preset" data-p="P2">P₂</button></div>
      <div class="l8-wrap"><table class="l8-grid"></table></div><div class="flagbox"></div><p class="dm-read"></p>`;
  const W = 420, H = 230;
  const g = svg(el.querySelector(".fig"), W, H, "Arrow diagram of the ticked pairs");
  const PRE = {
    P: [[0, 1], [1, 4], [2, 1], [3, 3]],
    Q1: [[0, 1], [1, 4], [1, 0], [2, 1], [3, 3]],
    Q2: [[0, 1], [1, 4], [2, 1]],
    P2: [[0, 2], [1, 4], [2, 0], [3, 3]],
  };
  let nA = 4, nB = 5, on = new Set(PRE.P.map(([i, j]) => `${i},${j}`));
  const table = el.querySelector(".l8-grid");
  const build = () => {
    table.innerHTML = `<tr><th></th>${Array.from({ length: nB }, (_, j) => `<th>${j + 1}</th>`).join("")}</tr>` +
      S.slice(0, nA).map((s, i) => `<tr><th>${s}</th>${Array.from({ length: nB }, (_, j) =>
        `<td><input type="checkbox" data-k="${i},${j}" ${on.has(`${i},${j}`) ? "checked" : ""} aria-label="${s} in seat ${j + 1}"></td>`).join("")}</tr>`).join("");
    table.querySelectorAll("input").forEach((c) => { c.onchange = () => { if (c.checked) on.add(c.dataset.k); else on.delete(c.dataset.k); draw(); }; });
    draw();
  };
  const draw = () => {
    const pairs = [...on].map((k) => k.split(",").map(Number)).filter(([i, j]) => i < nA && j < nB);
    const pr = props(pairs, nA, nB);
    const roles = pairs.map(([i]) => (pr.outs[i].length > 1 ? "HL" : "A"));
    arrowDiagram(g, W, H, S.slice(0, nA), Array.from({ length: nB }, (_, j) => String(j + 1)), pairs, { roles, titles: ["students", "seats"] });
    el.querySelector(".flagbox").innerHTML = flags([["function", pr.fn], ["one-to-one", pr.inj], ["onto", pr.sur], ["bijection", pr.bij]]);
    const why = [];
    pr.outs.forEach((o, i) => { if (o.length === 0) why.push(`${S[i]} has no seat`); if (o.length > 1) why.push(`${S[i]} has ${o.length} seats`); });
    let txt;
    if (!pr.fn) txt = `Not a function from the students: ${why.join(", ")}.`;
    else {
      const im = [...new Set(pairs.map(([, j]) => j + 1))].sort((a, b) => a - b);
      const shared = pr.ins.map((x, j) => (x.length > 1 ? j + 1 : null)).filter((x) => x !== null);
      const empty = pr.ins.map((x, j) => (x.length === 0 ? j + 1 : null)).filter((x) => x !== null);
      txt = `A function. Image {${im.join(", ")}}, codomain {1, …, ${nB}}.` +
        (shared.length ? ` Shared: seat ${shared.join(", ")} (not one-to-one).` : " No seat shared.") +
        (empty.length ? ` Empty: ${empty.join(", ")} (not onto).` : " No seat empty.") +
        (pr.bij ? " <b>A bijection: turning the arrows round gives the inverse.</b>" : "");
    }
    el.querySelector(".dm-read").innerHTML = txt;
  };
  el.querySelector(".na").onchange = (e) => { nA = +e.target.value; build(); };
  el.querySelector(".nb").onchange = (e) => { nB = +e.target.value; build(); };
  el.querySelectorAll(".preset").forEach((b) => {
    b.onclick = () => {
      nA = 4; nB = 5; el.querySelector(".na").value = "4"; el.querySelector(".nb").value = "5";
      on = new Set(PRE[b.dataset.p].map(([i, j]) => `${i},${j}`));
      build();
    };
  });
  build();
}

// ---------- Demo 2 · Test a rule on a window ----------

const RULES = {
  "3n + 2": (n) => 3 * n + 2,
  "|n|": (n) => Math.abs(n),
  "5 − 2n": (n) => 5 - 2 * n,
  "n²": (n) => n * n,
  "7 − n": (n) => 7 - n,
  "n + 3 (n even), n − 3 (n odd)": (n) => (((n % 2) + 2) % 2 === 0 ? n + 3 : n - 3),
};

function demoRule(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>rule <select class="r">${Object.keys(RULES).map((k) => `<option>${k}</option>`).join("")}</select></label>
      <label>codomain <select class="cod"><option value="Z">ℤ</option><option value="N">ℕ</option></select></label></div><p class="dm-read"></p>`;
  const W = 640, H = 170;
  const g = svg(el.querySelector(".fig"), W, H, "Inputs −4 to 4 and their outputs on a number line");
  const lo = -8, hi = 8, X = (v) => 30 + ((v - lo) * (W - 60)) / (hi - lo);
  const draw = () => {
    g.clear();
    const f = RULES[el.querySelector(".r").value], cod = el.querySelector(".cod").value;
    const ins = []; for (let n = -4; n <= 4; n++) ins.push(n);
    g.add("line", { x1: X(-4), y1: 40, x2: X(4), y2: 40, class: "axis" });
    g.add("line", { x1: X(lo), y1: 130, x2: X(hi), y2: 130, class: "axis" });
    g.text(14, 44, "n"); g.text(14, 134, "f(n)");
    const hits = new Map();
    ins.forEach((n) => { const v = f(n); hits.set(v, [...(hits.get(v) || []), n]); });
    for (let v = lo; v <= hi; v++) {
      const allowed = cod === "Z" || v >= 0;
      const h = hits.get(v);
      g.add("circle", { cx: X(v), cy: 130, r: h ? 5 : 3.5, class: !allowed ? "DIM" : h ? (h.length > 1 ? "HL" : "B") : "DIM" });
      if (v % 2 === 0) g.text(X(v), 152, String(v));
    }
    ins.forEach((n) => {
      const v = f(n);
      g.add("circle", { cx: X(n), cy: 40, r: 4.5, class: "A" });
      g.text(X(n), 26, String(n));
      if (v >= lo && v <= hi) g.add("line", { x1: X(n), y1: 46, x2: X(v), y2: 122, class: `arrow ${hits.get(v).length > 1 ? "HL" : "A"}`, "marker-end": `url(#l8-head-${hits.get(v).length > 1 ? "HL" : "A"})` });
    });
    const outside = ins.filter((n) => f(n) < lo || f(n) > hi).map((n) => `${n} ↦ ${f(n)}`);
    const bad = cod === "N" ? ins.filter((n) => f(n) < 0) : [];
    const shared = [...hits.entries()].filter(([, a]) => a.length > 1).map(([v, a]) => `${a.join(" and ")} ↦ ${v}`);
    const lowHi = cod === "N" ? [0, 4] : [-4, 4];
    const missed = []; for (let v = lowHi[0]; v <= lowHi[1]; v++) if (!ins.some((n) => f(n) === v)) missed.push(v);
    el.querySelector(".dm-read").innerHTML =
      (bad.length ? `<b>Not a function into ℕ</b>: ${bad.map((n) => `f(${n}) = ${f(n)}`).join(", ")} is negative. ` : "") +
      (shared.length ? `Shared outputs: ${shared.join("; ")}, so <b>not one-to-one</b>. ` : "No shared output among n = −4 … 4. ") +
      (missed.length ? `Missed in ${lowHi[0]} … ${lowHi[1]} (from these inputs): ${missed.join(", ")}. ` : "") +
      (outside.length ? `Off the picture: ${outside.join(", ")}. ` : "") +
      `A window can refute a property; only a proof establishes it.`;
  };
  el.querySelectorAll("select").forEach((s) => { s.onchange = draw; });
  draw();
}

// ---------- Demo 3 · Compose two rules ----------

const FUNS = {
  "n + 1": { f: (n) => n + 1, inv: (n) => n - 1, invT: "n − 1" },
  "2n": { f: (n) => 2 * n, inv: null },
  "3n + 2": { f: (n) => 3 * n + 2, inv: null },
  "7 − n": { f: (n) => 7 - n, inv: (n) => 7 - n, invT: "7 − n" },
  "n²": { f: (n) => n * n, inv: null },
  "|n|": { f: (n) => Math.abs(n), inv: null },
};

function demoCompose(el) {
  const opts = Object.keys(FUNS).map((k) => `<option>${k}</option>`).join("");
  el.innerHTML = `<div class="dm-ctrl">
      <label>f(n) = <select class="f">${opts}</select></label>
      <label>g(n) = <select class="g">${opts}</select></label>
      <label>x <input type="range" class="x" min="-5" max="5" value="4"> <b class="xv">4</b></label></div>
      <div class="fig"></div><p class="dm-read"></p>`;
  el.querySelector(".g").value = "2n";
  const W = 560, H = 150;
  const g = svg(el.querySelector(".fig"), W, H, "x, then f(x), then g(f(x)); and x, then g(x), then f(g(x))");
  const box = (x, y, t, cls) => { g.add("rect", { x: x - 42, y: y - 16, width: 84, height: 30, rx: 8, class: `${cls} open`, "stroke-width": 1.6 }); g.text(x, y + 5, t, "lab big"); };
  const arr = (x0, x1, y, t, role) => { g.add("line", { x1: x0 + 44, y1: y, x2: x1 - 46, y2: y, class: `arrow ${role}`, "marker-end": `url(#l8-head-${role})` }); g.text((x0 + x1) / 2, y - 8, t, "lab"); };
  const draw = () => {
    g.clear();
    const fk = el.querySelector(".f").value, gk = el.querySelector(".g").value, x = +el.querySelector(".x").value;
    el.querySelector(".xv").textContent = x;
    const F = FUNS[fk].f, G = FUNS[gk].f;
    const xs = [70, 280, 490];
    box(xs[0], 40, `x = ${x}`, "A"); arr(xs[0], xs[1], 40, "f", "A"); box(xs[1], 40, String(F(x)), "A"); arr(xs[1], xs[2], 40, "g", "B"); box(xs[2], 40, String(G(F(x))), "HL");
    box(xs[0], 115, `x = ${x}`, "A"); arr(xs[0], xs[1], 115, "g", "B"); box(xs[1], 115, String(G(x)), "B"); arr(xs[1], xs[2], 115, "f", "A"); box(xs[2], 115, String(F(G(x))), "HL");
    const same = G(F(x)) === F(G(x));
    const inv = FUNS[fk].inv;
    el.querySelector(".dm-read").innerHTML = `(g ∘ f)(${x}) = g(${F(x)}) = <b>${G(F(x))}</b>; (f ∘ g)(${x}) = f(${G(x)}) = <b>${F(G(x))}</b>` +
      (same ? " — equal at this x (try another x before concluding anything)." : " — different: the order matters.") +
      (inv ? `<br>f(n) = ${fk} is a bijection of ℤ with inverse f⁻¹(n) = ${FUNS[fk].invT}: f⁻¹(f(${x})) = f⁻¹(${F(x)}) = ${inv(F(x))}.` : `<br>f(n) = ${fk} is not a bijection of ℤ, so it has no inverse function on ℤ.`);
  };
  el.querySelectorAll("select, input").forEach((i) => { i.oninput = draw; i.onchange = draw; });
  draw();
}

// ---------- Demo 4 · Pigeons and holes ----------

function demoPigeon(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>objects p <input type="range" class="p" min="1" max="40" value="30"> <b class="pv">30</b></label>
      <label>boxes h <input type="range" class="h" min="1" max="10" value="7"> <b class="hv">7</b></label>
      <button class="primary even">Deal evenly</button><button class="rand">Deal at random</button></div><p class="dm-read"></p>`;
  const W = 520, H = 200;
  const g = svg(el.querySelector(".fig"), W, H, "Boxes with the number of objects in each");
  let counts = [];
  const read = () => [+el.querySelector(".p").value, +el.querySelector(".h").value];
  const draw = () => {
    g.clear();
    const [p, h] = read();
    el.querySelector(".pv").textContent = p; el.querySelector(".hv").textContent = h;
    const c = Math.ceil(p / h), mx = Math.max(...counts), top = Math.max(mx, c, 1);
    const bw = Math.min(46, (W - 40) / h - 8), unit = (H - 50) / top;
    const yl = H - 24 - c * unit;
    counts.forEach((v, i) => {
      const x = 20 + i * (bw + 8);
      g.add("rect", { x, y: H - 24 - v * unit, width: bw, height: v * unit, class: v >= c ? "HL" : "A", opacity: 0.8 });
      g.text(x + bw / 2, H - 28 - v * unit, String(v));
      g.text(x + bw / 2, H - 8, String(i + 1));
    });
    g.add("line", { x1: 14, y1: yl, x2: W - 70, y2: yl, class: "axis", "stroke-dasharray": "5 4" });
    const t = g.text(W - 66, yl + 4, `⌈p/h⌉ = ${c}`, "lab"); t.style.textAnchor = "start";
    el.querySelector(".dm-read").innerHTML = `${p} objects in ${h} boxes: some box must hold at least ⌈${p}/${h}⌉ = <b>${c}</b>. This deal: fullest box <b>${mx}</b>, emptiest ${Math.min(...counts)}.` +
      (p > h ? "" : " (With p ≤ h nobody has to share, and the bound is 1.)");
  };
  const even = () => { const [p, h] = read(); counts = Array.from({ length: h }, (_, i) => Math.floor(p / h) + (i < p % h ? 1 : 0)); draw(); };
  const rand = () => { const [p, h] = read(); counts = Array(h).fill(0); for (let k = 0; k < p; k++) counts[Math.floor(Math.random() * h)]++; draw(); };
  el.querySelectorAll("input").forEach((i) => { i.oninput = even; });
  el.querySelector(".even").onclick = even;
  el.querySelector(".rand").onclick = rand;
  even();
}

// ---------- Demo 5 · Cantor's diagonal set ----------

function demoCantor(el) {
  const A = [1, 2, 3];
  el.innerHTML = `<p class="hint" style="margin-top:0">Tick which elements each f(a) contains (a subset of A = {1, 2, 3}).</p>
    <div class="l8-wrap"><table class="l8-grid l8-sets"></table></div><p class="dm-read"></p>`;
  const f = { 1: new Set([1, 2]), 2: new Set([3]), 3: new Set([1, 3]) };
  const table = el.querySelector("table");
  const fmt = (s) => `{${[...s].sort().join(", ")}}`;
  const draw = () => {
    table.innerHTML = `<tr><th>a</th>${A.map((b) => `<th>${b} ∈ f(a)?</th>`).join("")}<th>a ∈ D?</th></tr>` +
      A.map((a) => `<tr><th>${a}</th>${A.map((b) => `<td style="${a === b ? "background:var(--paper-2)" : ""}"><input type="checkbox" data-a="${a}" data-b="${b}" ${f[a].has(b) ? "checked" : ""} aria-label="${b} in f(${a})"></td>`).join("")}<td>${f[a].has(a) ? "no" : "<b>yes</b>"}</td></tr>`).join("");
    table.querySelectorAll("input").forEach((c) => {
      c.onchange = () => { const a = +c.dataset.a, b = +c.dataset.b; if (c.checked) f[a].add(b); else f[a].delete(b); draw(); };
    });
    const D = new Set(A.filter((a) => !f[a].has(a)));
    const hits = A.filter((a) => fmt(f[a]) === fmt(D));
    el.querySelector(".dm-read").innerHTML = `f(1) = ${fmt(f[1])}, f(2) = ${fmt(f[2])}, f(3) = ${fmt(f[3])}. ` +
      `D = {a : a ∉ f(a)} = <b>${fmt(D)}</b>, read off the shaded diagonal and flipped. ` +
      (hits.length ? "Impossible: D equals some f(a)." : `D is none of the f(a): it differs from f(a) at a itself. So f is not onto 2<sup>A</sup>.`);
  };
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Is {(1, x), (2, y), (2, z), (3, x)} a function from {1, 2, 3} to {x, y, z}?",
    opts: ["Yes", "No: 2 has two outputs", "No: z is used"], a: 1,
    why: "A function gives each input exactly one output; 2 has y and z." },
  { q: "f : ℤ → ℤ, f(n) = n². Which is true?",
    opts: ["One-to-one and onto", "One-to-one, not onto", "Neither one-to-one nor onto"], a: 2,
    why: "f(2) = f(−2) = 4, and 3 is not a square." },
  { q: "True or false: “f is one-to-one” means “each input has exactly one output”.",
    opts: ["True", "False"], a: 1,
    why: "That is what every function does. One-to-one says no output comes from two inputs." },
  { q: "f(n) = n + 1, g(n) = 2n. What is (g ∘ f)(4)?",
    opts: ["9", "10", "16"], a: 1,
    why: "First f: 5. Then g: 10. (f ∘ g)(4) = f(8) = 9." },
  { q: "30 trays are baked in 7 ovens. What does the pigeonhole principle guarantee?",
    opts: ["Every oven bakes at least 5", "Some oven bakes at least 5", "Some oven bakes exactly 5"], a: 1,
    why: "⌈30/7⌉ = 5 for some oven; all 30 could even go into one oven." },
];

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((q, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${q.q}</p>
      <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${q.why}</div></div>`).join("") +
    `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const q = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[q.a].classList.add("right");
        if (j !== q.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  arrowMini: (el) => demoArrowMini(el),
  arrows: (el) => demoArrows(el),
  rule: (el) => demoRule(el),
  compose: (el) => demoCompose(el),
  pigeon: (el) => demoPigeon(el),
  cantor: (el) => demoCantor(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
