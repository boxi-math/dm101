// Interactive demos for DM101 Lecture 10 (random variables). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L10-random-variables.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same numbers (exact fractions over the 16 outcomes) so that the pictures can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

const SVGNS = "http://www.w3.org/2000/svg";

(function injectStyle() {
  const css = `
  .dm-fig .gcell { fill-opacity: 0.22; stroke: var(--ink-2); stroke-width: 1; }
  .dm-fig .gcell.none { fill: var(--card); }
  .dm-fig .bar { fill-opacity: 0.55; stroke-width: 1; cursor: pointer; }
  .dm-fig text.val { font-size: 15px; fill: var(--ink); }
  .dm-fig text.small { font-size: 11px; fill: var(--stone); }
  .dm-fig .eline { stroke: var(--amber); stroke-width: 2; stroke-dasharray: 6 4; fill: none; }
  .dm-fig .tline { stroke: var(--red); stroke-width: 1.5; stroke-dasharray: 3 3; fill: none; }
  .l10-table { border-collapse: collapse; margin: 8px auto; font: 13px var(--mono); }
  .l10-table th, .l10-table td { border: 1px solid var(--line); padding: 4px 7px; text-align: center; }
  .l10-table th { color: var(--stone); font-weight: 500; }
  .l10-table td.ok { background: var(--green-soft, #e3f1ea); }
  .l10-table td.bad { background: #f6d9d3; }
  .l10-wrap { overflow-x: auto; max-width: 100%; }
  .l10-row { display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: flex-start; justify-content: center; }
  .l10-row > div { flex: 1 1 240px; max-width: 320px; }
  .dm-ctrl select { max-width: 100%; }
  .dm-ctrl input[type=number] { max-width: 6em; }`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
})();

function svg(el, w, h, label) {
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${h}`);
  s.setAttribute("class", "dm-fig");
  s.setAttribute("role", "img");
  s.setAttribute("aria-label", label);
  s.style.maxWidth = `${w}px`;
  el.appendChild(s);
  const add = (tag, attrs, parent = s) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  };
  const text = (x, y, t, cls = "ink") => { const n = add("text", { x, y, class: cls }); n.textContent = t; return n; };
  const clear = () => { while (s.firstChild) s.removeChild(s.firstChild); };
  return { s, add, text, clear };
}

// ---------- Exact fractions over the 16 outcomes ----------

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (p, q) => {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  return q / g === 1 ? `${p / g}` : `${p / g}/${q / g}`;
};

const OUTCOMES = [];
for (let x = 1; x <= 4; x++) for (let y = 1; y <= 4; y++) OUTCOMES.push([x, y]);

const RVS = {
  max: { label: "M = max(x, y) (the prize)", f: (x, y) => Math.max(x, y) },
  min: { label: "min(x, y)", f: (x, y) => Math.min(x, y) },
  X: { label: "X = x (first die)", f: (x) => x },
  Y: { label: "Y = y (second die)", f: (x, y) => y },
  T: { label: "T = x + y (sum)", f: (x, y) => x + y },
  D: { label: "D = |x − y| (difference)", f: (x, y) => Math.abs(x - y) },
  double: { label: "2X (double the first die)", f: (x) => 2 * x },
  XY: { label: "XY (product)", f: (x, y) => x * y },
  Z: { label: "Z = 1 if x + y is even", f: (x, y) => ((x + y) % 2 === 0 ? 1 : 0) },
};
const rvOptions = (sel) => Object.entries(RVS).map(([k, v]) => `<option value="${k}"${k === sel ? " selected" : ""}>${v.label}</option>`).join("");

function stats(f) {
  const vals = OUTCOMES.map(([x, y]) => f(x, y));
  const counts = {};
  vals.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
  const s1 = vals.reduce((a, b) => a + b, 0), s2 = vals.reduce((a, b) => a + b * b, 0);
  return {
    vals, counts, keys: Object.keys(counts).map(Number).sort((a, b) => a - b),
    E: frac(s1, 16), Ef: s1 / 16, Var: frac(16 * s2 - s1 * s1, 256), EX2: frac(s2, 16),
  };
}

// The 4 x 4 grid of outcomes with values; cells listed in `hl` are highlighted.
function drawGrid(g, ox, oy, size, f, hl = null, role = "A") {
  const p = size / 4;
  for (let x = 1; x <= 4; x++) {
    g.text(ox - 14, oy + (x - 0.5) * p + 4, `x=${x}`, "small");
    g.text(ox + (x - 0.5) * p, oy - 6, `y=${x}`, "small");
  }
  OUTCOMES.forEach(([x, y]) => {
    const v = f(x, y);
    const on = hl === null || hl(x, y, v);
    g.add("rect", { x: ox + (y - 1) * p, y: oy + (x - 1) * p, width: p, height: p, class: `gcell ${on && hl !== null ? role : "none"}` });
    g.text(ox + (y - 0.5) * p, oy + (x - 0.5) * p + 5, String(v), "val");
  });
}

// ---------- Hero: one sample space, many random variables ----------

function demoGridMini(el) {
  el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
  const g = svg(el.querySelector(".fig"), 260, 250, "The 16 outcomes of two four-sided dice with a random variable written in each cell");
  const order = ["max", "T", "min", "D", "XY"];
  let k = 0;
  const draw = () => {
    g.clear();
    const key = order[k % order.length], st = stats(RVS[key].f);
    drawGrid(g, 40, 30, 200, RVS[key].f, (x, y, v) => v === st.keys[st.keys.length - 1], "B");
    el.querySelector(".dm-read").innerHTML = `${RVS[key].label}: <b>E = ${st.E}</b>`;
    k++;
  };
  draw();
  setInterval(draw, 2200);
}

// ---------- Demo 1 · Write a random variable into the grid ----------

function demoRv(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>random variable <select class="rv">${rvOptions("max")}</select></label></div>
    <div class="l10-row"><div class="g1"></div><div class="g2"></div></div><p class="dm-read"></p>`;
  const g1 = svg(el.querySelector(".g1"), 260, 250, "The grid of outcomes with the values of the chosen random variable");
  const g2 = svg(el.querySelector(".g2"), 300, 250, "The distribution of the chosen random variable as bars");
  let pick = null;
  const draw = () => {
    const key = el.querySelector(".rv").value, f = RVS[key].f, st = stats(f);
    g1.clear(); g2.clear();
    drawGrid(g1, 40, 30, 200, f, pick === null ? null : (x, y, v) => v === pick, "B");
    const n = st.keys.length, bw = Math.min(40, 260 / n - 6), maxc = Math.max(...Object.values(st.counts));
    g2.add("line", { x1: 15, y1: 210, x2: 290, y2: 210, class: "axis" });
    st.keys.forEach((v, i) => {
      const c = st.counts[v], h = (c / maxc) * 160, x = 20 + i * (260 / n) + (260 / n - bw) / 2;
      const r = g2.add("rect", { x, y: 210 - h, width: bw, height: h, class: `bar ${v === pick ? "B" : "A"}` });
      r.onclick = () => { pick = pick === v ? null : v; draw(); };
      g2.text(x + bw / 2, 226, String(v));
      g2.text(x + bw / 2, 204 - h, `${c}/16`, "small");
    });
    const dist = st.keys.map((v) => `P(=${v}) = ${frac(st.counts[v], 16)}`).join(", ");
    el.querySelector(".dm-read").innerHTML = `${dist}<br><b>E = ${st.E}</b> · E(X²) = ${st.EX2} · <b>Var = ${st.Var}</b>` +
      (pick !== null ? `<br>The event {= ${pick}} is the ${st.counts[pick]} amber cell${st.counts[pick] > 1 ? "s" : ""}: probability ${frac(st.counts[pick], 16)}.` : "");
  };
  el.querySelector(".rv").onchange = () => { pick = null; draw(); };
  draw();
}

// ---------- Demo 2 · Check every pair ----------

function demoIndep(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>U <select class="u">${rvOptions("X")}</select></label>
    <label>W <select class="w">${rvOptions("max")}</select></label></div><div class="l10-wrap tbl"></div><p class="dm-read"></p>`;
  const draw = () => {
    const ku = el.querySelector(".u").value, kw = el.querySelector(".w").value;
    const fu = RVS[ku].f, fw = RVS[kw].f, su = stats(fu), sw = stats(fw);
    let html = `<table class="l10-table"><tr><th>U \\ W</th>${sw.keys.map((b) => `<th>${b}</th>`).join("")}</tr>`;
    let bad = null, nbad = 0, total = 0;
    su.keys.forEach((a) => {
      html += `<tr><th>${a}</th>`;
      sw.keys.forEach((b) => {
        const joint = OUTCOMES.filter(([x, y]) => fu(x, y) === a && fw(x, y) === b).length; // in sixteenths
        const ok = 16 * joint === su.counts[a] * sw.counts[b];
        total++;
        if (!ok) { nbad++; if (!bad) bad = [a, b, joint]; }
        html += `<td class="${ok ? "ok" : "bad"}" title="joint ${frac(joint, 16)}, product ${frac(su.counts[a] * sw.counts[b], 256)}">${frac(joint, 16)}<br><small>${frac(su.counts[a] * sw.counts[b], 256)}</small></td>`;
      });
      html += "</tr>";
    });
    el.querySelector(".tbl").innerHTML = html + "</table>";
    el.querySelector(".dm-read").innerHTML = "Each cell: P(U = a and W = b) on top, P(U = a)·P(W = b) below. " + (bad
      ? `<b>Not independent</b>: ${nbad} of ${total} pairs fail; one is enough, e.g. (${bad[0]}, ${bad[1]}): ${frac(bad[2], 16)} ≠ ${frac(su.counts[bad[0]] * sw.counts[bad[1]], 256)}.`
      : `<b>Independent</b>: the product rule holds for all ${total} pairs of values.`);
  };
  el.querySelectorAll("select").forEach((s) => { s.onchange = draw; });
  draw();
}

// ---------- Demo 3 · Level the columns ----------

function demoLevel(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl"><label>random variable <select class="rv">${rvOptions("max")}</select></label>
    <button class="step">Move one block</button><button class="primary go">Even out</button><button class="reset">Reset</button></div><p class="dm-read"></p>`;
  const W = 620, H = 240, base = 200;
  const g = svg(el.querySelector(".fig"), W, H, "Sixteen columns of blocks, one per outcome, being evened out");
  let cols = [], moves = 0, timer = null;
  const unit = () => Math.min(16, 170 / Math.max(...cols, 1));
  const reset = () => {
    if (timer) { clearInterval(timer); timer = null; }
    const f = RVS[el.querySelector(".rv").value].f;
    cols = OUTCOMES.map(([x, y]) => f(x, y));
    moves = 0;
    draw();
  };
  let u = 16;
  const draw = () => {
    g.clear();
    const st = { sum: cols.reduce((a, b) => a + b, 0) };
    const bw = (W - 80) / 16;
    g.add("line", { x1: 20, y1: base, x2: W - 50, y2: base, class: "axis" });
    cols.forEach((h, i) => {
      for (let j = 0; j < h; j++) g.add("rect", { x: 24 + i * bw, y: base - (j + 1) * u, width: bw - 6, height: u - 2, class: "bar A" });
    });
    const e = st.sum / 16, ye = base - e * u;
    g.add("line", { x1: 18, y1: ye, x2: W - 50, y2: ye, class: "eline" });
    g.text(W - 26, ye + 4, `E=${frac(st.sum, 16)}`, "small");
    if (el.querySelector(".rv").value === "max") {
      const yt = base - 3 * u;
      g.add("line", { x1: 18, y1: yt, x2: W - 50, y2: yt, class: "tline" });
      g.text(W - 26, yt + 14, "ticket 3", "small");
    }
    const spread = Math.max(...cols) - Math.min(...cols);
    el.querySelector(".dm-read").innerHTML = `${st.sum} blocks over 16 columns: <b>E = ${frac(st.sum, 16)} = ${(st.sum / 16).toFixed(4).replace(/\.?0+$/, "")}</b>. Moves so far: ${moves}.` +
      (spread <= 1 ? " Evened out: every column is within one block of E." : "");
  };
  const step = () => {
    const hi = cols.indexOf(Math.max(...cols)), lo = cols.indexOf(Math.min(...cols));
    if (cols[hi] - cols[lo] <= 1) return false;
    cols[hi]--; cols[lo]++; moves++;
    draw();
    return true;
  };
  el.querySelector(".rv").onchange = () => { reset(); u = unit(); draw(); };
  el.querySelector(".step").onclick = step;
  el.querySelector(".reset").onclick = () => { reset(); };
  el.querySelector(".go").onclick = () => {
    if (timer) return;
    timer = setInterval(() => { if (!step()) { clearInterval(timer); timer = null; } }, 280);
  };
  reset();
  u = unit();
  draw();
}

// ---------- Demo 4 · Empty buckets (indicators and linearity) ----------

function demoBuckets(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>keys n <input type="number" class="n" min="1" max="60" value="10"></label>
    <label>buckets m <input type="number" class="m" min="2" max="20" value="10"></label>
    <button class="primary throw">Throw once</button><button class="sim">Simulate 2000 times</button></div>
    <div class="fig"></div><p class="dm-read"></p>`;
  const W = 600, H = 150;
  const g = svg(el.querySelector(".fig"), W, H, "Buckets with the keys thrown into them; empty buckets are marked");
  let last = null, simAvg = null;
  const params = () => [Math.max(1, Math.min(60, Math.round(+el.querySelector(".n").value) || 1)),
    Math.max(2, Math.min(20, Math.round(+el.querySelector(".m").value) || 2))];
  const throwKeys = (n, m) => { const b = new Array(m).fill(0); for (let i = 0; i < n; i++) b[Math.floor(Math.random() * m)]++; return b; };
  const draw = () => {
    const [n, m] = params();
    g.clear();
    const bw = (W - 20) / m;
    for (let j = 0; j < m; j++) {
      const c = last ? last[j] : 0;
      g.add("rect", { x: 10 + j * bw + 2, y: 20, width: bw - 4, height: 100, class: `gcell ${last && c === 0 ? "HL" : "none"}` });
      g.text(10 + j * bw + bw / 2, 76, last ? String(c) : "", "val");
      g.text(10 + j * bw + bw / 2, 138, String(j + 1), "small");
    }
    const expect = m * Math.pow(1 - 1 / m, n);
    const empty = last ? last.filter((c) => c === 0).length : null;
    el.querySelector(".dm-read").innerHTML = `Formula by indicators: m(1 − 1/m)<sup>n</sup> = <b>${expect.toFixed(4)}</b> empty buckets on average.` +
      (empty !== null ? ` This throw: <b>${empty}</b> empty (red).` : "") +
      (simAvg !== null ? ` Average over 2000 throws: <b>${simAvg.toFixed(3)}</b>.` : "");
  };
  el.querySelector(".throw").onclick = () => { const [n, m] = params(); last = throwKeys(n, m); draw(); };
  el.querySelector(".sim").onclick = () => {
    const [n, m] = params();
    let tot = 0;
    for (let t = 0; t < 2000; t++) tot += throwKeys(n, m).filter((c) => c === 0).length;
    simAvg = tot / 2000;
    draw();
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = () => { last = null; simAvg = null; draw(); }; });
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "For the outcome (1, 4) of two four-sided dice, the larger number is 4 and the sum is 5. How can one outcome have two values?",
    opts: ["The outcome is random", "M and T are two different functions on the same sample space", "One of them must be wrong"], a: 1,
    why: "A random variable is a function S → V. max(1, 4) = 4 and 1 + 4 = 5 are two functions evaluated at the same outcome." },
  { q: "P(X = 1 and T = 5) = P(X = 1)·P(T = 5) = 1/16. Are the first die X and the sum T independent?",
    opts: ["Yes", "No: the rule fails at (1, 2)", "Cannot tell"], a: 1,
    why: "At (1, 2): P(X = 1 and T = 2) = 1/16 but P(X = 1)P(T = 2) = 1/64. Independence needs every pair; one failure refutes it." },
  { q: "Which rule needs X and Y to be independent?",
    opts: ["E(X + Y) = E(X) + E(Y)", "E(XY) = E(X)E(Y)", "E(3X) = 3E(X)"], a: 1,
    why: "Linearity holds for all random variables; the product rule needs independence (it fails for X·X)." },
  { q: "Find the error: “For one four-sided die, E(X²) = E(X)·E(X) = 25/4.”",
    opts: ["Nothing is wrong", "X is not independent of itself; E(X²) = 15/2", "E(X) is 3, not 5/2"], a: 1,
    why: "E(X²) = (1 + 4 + 9 + 16)/4 = 15/2. The difference 15/2 − 25/4 = 5/4 is the variance." },
  { q: "A random variable has Var(X) = 0. What follows?",
    opts: ["E(X) = 0", "X equals E(X) on every outcome with positive probability", "X is independent of every Y"], a: 1,
    why: "The variance is a sum of squares times probabilities; it is 0 only if every term is 0." },
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
  gridMini: (el) => demoGridMini(el),
  rv: (el) => demoRv(el),
  indep: (el) => demoIndep(el),
  level: (el) => demoLevel(el),
  buckets: (el) => demoBuckets(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
