// Interactive demos for DM101 Lecture 9 (sample spaces and events). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L09-sample-spaces.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same numbers with exact fractions so that the pictures can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

const SVGNS = "http://www.w3.org/2000/svg";

// Lecture-only styles (the shared style.css has .dm-fig colours A / B / HL / DIM).
(() => {
  const css = `
  .dm-fig .gcell { stroke: var(--ink-2); stroke-width: 1; fill: var(--card); }
  .dm-fig .gcell.A { fill: var(--teal); fill-opacity: 0.30; }
  .dm-fig .gcell.B { fill: var(--amber); fill-opacity: 0.38; }
  .dm-fig .gcell.AB { fill: var(--red); fill-opacity: 0.30; }
  .dm-fig .gcell.DIM { fill: var(--line); fill-opacity: 0.55; }
  .dm-fig .gcell.out { fill: var(--paper); opacity: 0.45; }
  .dm-fig .gtext { font-size: 14px; fill: var(--ink); stroke: none; dominant-baseline: middle; }
  .dm-fig .gtext.faint { fill: var(--stone); opacity: 0.45; }
  .dm-fig .ghead { font-size: 12px; fill: var(--stone); stroke: none; dominant-baseline: middle; }
  .dm-fig .ghead.red { fill: var(--red); }
  .dm-fig .ghead.blue { fill: var(--teal); }
  .dm-fig .strike { stroke: var(--red); stroke-width: 1.4; opacity: 0.55; }
  .dm-fig .frame { fill: none; stroke: var(--ink); stroke-width: 3; }
  .dm-fig .bar { stroke: none; }
  .dm-fig .tgt { stroke: var(--red); stroke-width: 1.5; stroke-dasharray: 5 4; fill: none; }
  .dm9-tab { border-collapse: collapse; font: 13px var(--mono); margin: 8px 0; }
  .dm9-tab td, .dm9-tab th { border: 1px solid var(--line); padding: 4px 8px; text-align: center; }
  .dm9-tab th { color: var(--stone); font-weight: 500; }
  .dm9-ok { color: var(--teal); font-weight: 600; }
  .dm9-bad { color: var(--red); font-weight: 600; }
  .dm9-faces { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; margin-top: 8px; }
  .dm9-faces label { display: flex; flex-direction: column; align-items: center; gap: 2px; font: 12px var(--mono); color: var(--stone); }
  .dm9-faces input { width: 100%; max-width: 70px; font: 13px var(--mono); padding: 3px 4px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); text-align: center; }
  `;
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

// ---------- Exact fractions ----------

const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
const frac = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
const fadd = (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const fsub = (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a, b) => frac(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => frac(a.n * b.d, a.d * b.n);
const feq = (a, b) => a.n * b.d === b.n * a.d;
const fstr = (a) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);
const fpar = (a) => (a.d === 1 ? fstr(a) : `(${fstr(a)})`);
// Parse "3/20", "0.15" or "15%" into an exact fraction (null if unreadable).
function parseFrac(t) {
  t = String(t).trim();
  let m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (m && +m[2] > 0) return frac(+m[1], +m[2]);
  m = t.match(/^(-?\d*\.?\d+)\s*(%?)$/);
  if (m) {
    const [i, f = ""] = m[1].split(".");
    const d = 10 ** f.length;
    const n = Math.round(parseFloat(m[1]) * d);
    return frac(n, d * (m[2] ? 100 : 1));
  }
  return null;
}
const tex = (el) => { if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: "\\(", right: "\\)", display: false }] }); };

// ---------- The two-dice grid: events ----------

const PAIRS = [];
for (let r = 1; r <= 6; r++) for (let b = 1; b <= 6; b++) PAIRS.push([r, b]);

const EVENTS = {
  sum7: ["the sum is 7", ([r, b]) => r + b === 7],
  sum8: ["the sum is 8", ([r, b]) => r + b === 8],
  sum10: ["the sum is at least 10", ([r, b]) => r + b >= 10],
  double: ["a double", ([r, b]) => r === b],
  redEven: ["the red die is even", ([r]) => r % 2 === 0],
  blueEven: ["the blue die is even", ([, b]) => b % 2 === 0],
  blue12: ["the blue die is 1 or 2", ([, b]) => b <= 2],
  six: ["at least one six", ([r, b]) => r === 6 || b === 6],
  red6: ["the red die is 6", ([r]) => r === 6],
  bothSix: ["both dice are 6", ([r, b]) => r === 6 && b === 6],
  max4: ["the larger number is 4", ([r, b]) => Math.max(r, b) === 4],
  diff1: ["the numbers differ by 1", ([r, b]) => Math.abs(r - b) === 1],
};
const evOptions = (sel) => Object.entries(EVENTS).map(([k, [t]]) => `<option value="${k}"${k === sel ? " selected" : ""}>${t}</option>`).join("");
const setOf = (key) => new Set(PAIRS.map((p, i) => (EVENTS[key][1](p) ? i : -1)).filter((i) => i >= 0));
const P = (set) => frac(set.size, 36);

// Draw the 6 x 6 grid. cls(i) gives the cell class; out(i) strikes a cell; frame = set of cells to outline.
function drawGrid(g, { cls = () => "", out = () => false, frame = null }) {
  g.clear();
  const c = 44, x0 = 34, y0 = 30;
  g.text(x0 + 3 * c, 12, "blue die", "ghead blue");
  g.text(10, y0 + 3 * c, "red", "ghead red");
  for (let k = 0; k < 6; k++) {
    g.text(x0 + k * c + c / 2, y0 - 9, String(k + 1), "ghead");
    g.text(x0 - 10, y0 + k * c + c / 2, String(k + 1), "ghead");
  }
  PAIRS.forEach(([r, b], i) => {
    const x = x0 + (b - 1) * c, y = y0 + (r - 1) * c;
    const o = out(i);
    g.add("rect", { x, y, width: c, height: c, class: `gcell ${o ? "out" : cls(i)}` });
    g.text(x + c / 2, y + c / 2 + 1, String(r + b), `gtext${o ? " faint" : ""}`);
    if (o) {
      g.add("line", { x1: x + 8, y1: y + 8, x2: x + c - 8, y2: y + c - 8, class: "strike" });
      g.add("line", { x1: x + c - 8, y1: y + 8, x2: x + 8, y2: y + c - 8, class: "strike" });
    }
  });
  if (frame) {
    // Outline the region: draw every cell edge whose neighbour is not in the set.
    let d = "";
    frame.forEach((i) => {
      const [r, b] = PAIRS[i], x = x0 + (b - 1) * c, y = y0 + (r - 1) * c;
      const has = (rr, bb) => rr >= 1 && rr <= 6 && bb >= 1 && bb <= 6 && frame.has((rr - 1) * 6 + (bb - 1));
      if (!has(r - 1, b)) d += `M${x},${y}H${x + c}`;
      if (!has(r + 1, b)) d += `M${x},${y + c}H${x + c}`;
      if (!has(r, b - 1)) d += `M${x},${y}V${y + c}`;
      if (!has(r, b + 1)) d += `M${x + c},${y}V${y + c}`;
    });
    if (d) g.add("path", { d, class: "frame" });
  }
}

// ---------- Hero · 36 000 rolls, one at a time ----------

function demoRollsMini(el) {
  el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
  const W = 520, H = 200;
  const g = svg(el.querySelector(".fig"), W, H, "Frequencies of the sums of two dice against 1/11 and the true probabilities");
  const read = el.querySelector(".dm-read");
  let counts = Array(13).fill(0), n = 0, seed = 9;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const X = (t) => 30 + (t - 2) * 44, base = 170, scale = 700;
  const draw = () => {
    g.clear();
    g.add("line", { x1: 20, y1: base, x2: W - 10, y2: base, class: "axis" });
    const y11 = base - scale / 11 / 4;
    for (let t = 2; t <= 12; t++) {
      const f = n ? counts[t] / n : 0, h = (f * scale) / 4;
      g.add("rect", { x: X(t), y: base - h, width: 30, height: h, class: `bar ${t === 7 ? "B" : "A"}` });
      const p = (6 - Math.abs(t - 7)) / 36;
      g.add("line", { x1: X(t) - 2, y1: base - (p * scale) / 4, x2: X(t) + 32, y2: base - (p * scale) / 4, class: "axis" });
      g.text(X(t) + 15, base + 16, String(t));
    }
    g.add("line", { x1: 20, y1: y11, x2: W - 10, y2: y11, class: "tgt" });
    g.text(W - 30, y11 - 6, "1/11", "ghead red");
    read.innerHTML = `${n} rolls · sum 7 seen ${n ? (counts[7] / n).toFixed(3) : "—"} of the time (true \\(1/6 \\approx 0.167\\), not \\(1/11 \\approx 0.091\\)). Black ticks: the true probabilities.`;
    tex(read);
  };
  draw();
  setInterval(() => {
    for (let k = 0; k < 40; k++) { counts[1 + Math.ceil(rnd() * 6) + Math.ceil(rnd() * 6) - 1]++; n++; }
    if (n >= 6000) { counts = Array(13).fill(0); n = 0; }
    draw();
  }, 120);
}

// ---------- Demo 1 · A sample space of your own ----------

function demoSpace(el) {
  const presets = {
    fair: ["1/6", "1/6", "1/6", "1/6", "1/6", "1/6"],
    loaded: ["3/20", "3/20", "3/20", "3/20", "3/20", "1/4"],
    wrong: ["1/5", "1/5", "1/5", "1/5", "1/5", "1/5"],
    negative: ["1/2", "1/2", "1/6", "0", "0", "-1/6"],
  };
  el.innerHTML = `<div class="dm-ctrl"><label>start from <select class="pre">
      <option value="fair">a fair die</option><option value="loaded" selected>the loaded die</option>
      <option value="wrong">each face 1/5</option><option value="negative">a negative value</option></select></label></div>
    <div class="dm9-faces">${[1, 2, 3, 4, 5, 6].map((f) => `<label>P(${f})<input type="text" data-f="${f}"></label>`).join("")}</div>
    <div class="fig"></div><p class="dm-read"></p>`;
  const W = 420, H = 150;
  const g = svg(el.querySelector(".fig"), W, H, "Bars for P(1) to P(6)");
  const inputs = [...el.querySelectorAll(".dm9-faces input")];
  const read = el.querySelector(".dm-read");
  const load = (k) => { presets[k].forEach((v, i) => { inputs[i].value = v; }); draw(); };
  const draw = () => {
    g.clear();
    const ps = inputs.map((i) => parseFrac(i.value));
    g.add("line", { x1: 20, y1: 110, x2: W - 10, y2: 110, class: "axis" });
    ps.forEach((p, i) => {
      const x = 40 + i * 62, v = p ? p.n / p.d : 0, h = Math.min(100, Math.abs(v) * 200);
      g.add("rect", { x, y: v >= 0 ? 110 - h : 110, width: 36, height: h, class: `bar ${v < 0 ? "HL" : i % 2 ? "B" : "A"}` });
      g.text(x + 18, 136, String(i + 1));
    });
    if (ps.some((p) => p === null)) { read.innerHTML = "Type each value as a fraction (3/20), a decimal (0.15) or a percent (15%)."; return; }
    const total = ps.reduce(fadd, frac(0));
    const nonneg = ps.every((p) => p.n >= 0), one = feq(total, frac(1));
    const even = fadd(fadd(ps[1], ps[3]), ps[5]);
    read.innerHTML = `Sum of the values: <b>${fstr(total)}</b>. ` +
      `${nonneg ? "All values ≥ 0" : "<span class='dm9-bad'>Some value is negative</span>"}; ` +
      `${one ? "they add up to 1" : "<span class='dm9-bad'>they do not add up to 1</span>"}. ` +
      (nonneg && one ? `<span class="dm9-ok">This is a sample space.</span> P(even) = P(2) + P(4) + P(6) = <b>${fstr(even)}</b>; ` +
        `P(at most 2) = <b>${fstr(fadd(ps[0], ps[1]))}</b>.` : `<span class="dm9-bad">Not a sample space.</span>`);
  };
  el.querySelector(".pre").onchange = (e) => load(e.target.value);
  inputs.forEach((i) => { i.oninput = draw; });
  load("loaded");
}

// ---------- Demo 2 · Events on the grid ----------

function demoEvents(el) {
  el.innerHTML = `<div class="dm-ctrl">
      <label>A = <select class="a">${evOptions("sum8")}</select></label>
      <label>B = <select class="b">${evOptions("double")}</select></label>
      <label>show <select class="op"><option value="both">A and B</option><option value="and">A ∩ B</option><option value="or">A ∪ B</option>
        <option value="minus">A − B</option><option value="not">complement of A</option></select></label></div>
    <div class="fig"></div><p class="dm-read"></p>`;
  const g = svg(el.querySelector(".fig"), 310, 300, "The 36 rolls of two dice with events A and B shaded");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    const A = setOf(el.querySelector(".a").value), B = setOf(el.querySelector(".b").value), op = el.querySelector(".op").value;
    const inA = (i) => A.has(i), inB = (i) => B.has(i);
    const pick = { and: (i) => inA(i) && inB(i), or: (i) => inA(i) || inB(i), minus: (i) => inA(i) && !inB(i), not: (i) => !inA(i) }[op];
    const cls = op === "both" ? (i) => (inA(i) && inB(i) ? "AB" : inA(i) ? "A" : inB(i) ? "B" : "") : (i) => (pick(i) ? "A" : "");
    const chosen = op === "both" ? null : new Set(PAIRS.map((_, i) => i).filter(pick));
    drawGrid(g, { cls, frame: chosen });
    const AB = new Set([...A].filter((i) => B.has(i))), AuB = new Set([...A, ...B]);
    const lhs = fadd(P(A), P(B)), rhs = fadd(P(AuB), P(AB));
    const names = { and: "A ∩ B", or: "A ∪ B", minus: "A − B", not: "complement of A" };
    read.innerHTML = (chosen ? `${names[op]}: <b>${chosen.size}</b> cells, probability <b>${fstr(P(chosen))}</b>.<br>` : `Blue: only A, amber: only B, red: both.<br>`) +
      `P(A) + P(B) = ${fstr(P(A))} + ${fstr(P(B))} = <b>${fstr(lhs)}</b>; P(A ∪ B) + P(A ∩ B) = ${fstr(P(AuB))} + ${fstr(P(AB))} = <b>${fstr(rhs)}</b>` +
      (feq(lhs, rhs) ? " (equal, Theorem 1)." : ".") +
      (AB.size ? ` A and B overlap in ${AB.size} cell${AB.size > 1 ? "s" : ""}, so P(A ∪ B) &lt; P(A) + P(B).` : " A and B are disjoint, so P(A ∪ B) = P(A) + P(B).");
  };
  el.querySelectorAll("select").forEach((s) => { s.onchange = draw; });
  draw();
}

// ---------- Demo 3 · Condition on a hint ----------

function demoCondition(el) {
  el.innerHTML = `<div class="dm-ctrl">
      <label>given B = <select class="b">${evOptions("sum8")}</select></label>
      <label>chance of A = <select class="a">${evOptions("double")}</select></label>
      <button class="swap">Swap A and B</button></div>
    <div class="fig"></div><p class="dm-read"></p>`;
  const g = svg(el.querySelector(".fig"), 310, 300, "The 36 rolls with the given event framed and the rest struck out");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    const B = setOf(el.querySelector(".b").value), A = setOf(el.querySelector(".a").value);
    const AB = new Set([...A].filter((i) => B.has(i)));
    drawGrid(g, { cls: (i) => (AB.has(i) ? "AB" : B.has(i) ? "A" : ""), out: (i) => !B.has(i), frame: B });
    const pA = P(A), pB = P(B), pAB = P(AB);
    const condA = fdiv(pAB, pB), condB = A.size ? fdiv(pAB, pA) : null;
    const indep = feq(pAB, fmul(pA, pB));
    read.innerHTML = `Inside the frame B: <b>${B.size}</b> cells; of them <b>${AB.size}</b> ${AB.size === 1 ? "is" : "are"} in A (red).<br>` +
      `P(A | B) = P(A ∩ B) / P(B) = ${fpar(pAB)} / ${fpar(pB)} = <b>${fstr(condA)}</b>; without the hint P(A) = <b>${fstr(pA)}</b>.<br>` +
      (condB ? `The other way round, P(B | A) = ${fpar(pAB)} / ${fpar(pA)} = <b>${fstr(condB)}</b>${feq(condA, condB) ? "" : " — a different number"}.<br>` : "") +
      `P(A ∩ B) = ${fstr(pAB)}, P(A)·P(B) = ${fstr(fmul(pA, pB))}: ` +
      (indep ? `<span class="dm9-ok">independent</span> — the hint changes nothing.` :
        `<span class="dm9-bad">not independent</span>${AB.size === 0 ? " — they are disjoint, so knowing B rules A out." : feq(condA, pA) ? "." : condA.n * pA.d > pA.n * condA.d ? " — the hint makes A more likely." : " — the hint makes A less likely."}`);
  };
  el.querySelectorAll("select").forEach((s) => { s.onchange = draw; });
  el.querySelector(".swap").onclick = () => {
    const a = el.querySelector(".a"), b = el.querySelector(".b");
    [a.value, b.value] = [b.value, a.value];
    draw();
  };
  draw();
}

// ---------- Demo 4 · Bayes: turn a conditional probability around ----------

function demoBayes(el) {
  const presets = { spam: ["1/5", "3/10", "1/50"], chips: ["1/200", "99/100", "3/100"] };
  el.innerHTML = `<div class="dm-ctrl"><label>example <select class="pre"><option value="spam">spam and "prize"</option><option value="chips">faulty chips (exercise 7)</option></select></label></div>
    <div class="dm-ctrl"><label>P(B) <input type="text" class="pb"></label><label>P(A | B) <input type="text" class="pab"></label>
      <label>P(A | not B) <input type="text" class="pan"></label></div>
    <div class="tab"></div><p class="dm-read"></p>`;
  const read = el.querySelector(".dm-read"), tab = el.querySelector(".tab");
  const names = { spam: ["spam", "other", "prize", "no prize"], chips: ["faulty", "good", "flagged", "not flagged"] };
  const draw = () => {
    const nm = names[el.querySelector(".pre").value];
    const pb = parseFrac(el.querySelector(".pb").value), pab = parseFrac(el.querySelector(".pab").value), pan = parseFrac(el.querySelector(".pan").value);
    const okp = (p) => p && p.n >= 0 && p.n <= p.d;
    if (![pb, pab, pan].every(okp) || pb.n === 0 || pb.n === pb.d) { tab.innerHTML = ""; read.innerHTML = "Each value must be a probability between 0 and 1, and P(B) strictly between 0 and 1."; return; }
    const nb = fsub(frac(1), pb);
    const c = [fmul(pb, pab), fmul(pb, fsub(frac(1), pab)), fmul(nb, pan), fmul(nb, fsub(frac(1), pan))];
    const pA = fadd(c[0], c[2]);
    tab.innerHTML = `<table class="dm9-tab"><tr><th></th><th>${nm[2]} (A)</th><th>${nm[3]}</th><th>total</th></tr>
      <tr><th>${nm[0]} (B)</th><td><b>${fstr(c[0])}</b></td><td>${fstr(c[1])}</td><td>${fstr(pb)}</td></tr>
      <tr><th>${nm[1]}</th><td><b>${fstr(c[2])}</b></td><td>${fstr(c[3])}</td><td>${fstr(nb)}</td></tr>
      <tr><th>total</th><td><b>${fstr(pA)}</b></td><td>${fstr(fsub(frac(1), pA))}</td><td>1</td></tr></table>`;
    if (pA.n === 0) { read.innerHTML = "P(A) = 0, so P(B | A) is not defined."; return; }
    const post = fdiv(c[0], pA);
    read.innerHTML = `Total probability: P(A) = ${fstr(c[0])} + ${fstr(c[2])} = <b>${fstr(pA)}</b>.<br>` +
      `Bayes: P(B | A) = ${fpar(c[0])} / ${fpar(pA)} = <b>${fstr(post)}</b> ≈ <b>${(post.n / post.d).toFixed(3)}</b>, ` +
      `compared with P(B) = ${fstr(pb)} before seeing A and P(A | B) = ${fstr(pab)} the other way round.`;
  };
  const load = (k) => { const [a, b, c] = presets[k]; el.querySelector(".pb").value = a; el.querySelector(".pab").value = b; el.querySelector(".pan").value = c; draw(); };
  el.querySelector(".pre").onchange = (e) => load(e.target.value);
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  load("spam");
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Is S = {a, b, c} with P(a) = 1/2, P(b) = 1/2, P(c) = 0 a sample space?",
    opts: ["Yes", "No: an outcome cannot have probability 0", "No: the values must all be equal"], a: 0,
    why: "Both rules hold: every value is ≥ 0 and they add up to 1. An outcome may have probability 0." },
  { q: "Two fair dice. What is the probability that the larger of the two numbers is at most 2?",
    opts: ["1/3", "1/9", "2/11"], a: 1,
    why: "Both numbers must be 1 or 2: 4 of the 36 cells, 4/36 = 1/9." },
  { q: "A and B are disjoint. Which is right?",
    opts: ["P(A ∪ B) = P(A) + P(B)", "P(A ∩ B) = P(A)·P(B)", "P(A ∪ B) = P(A)·P(B)"], a: 0,
    why: "P(A ∩ B) = P(∅) = 0, so Theorem 1 gives P(A ∪ B) = P(A) + P(B) (Corollary 2(a))." },
  { q: "Are “the red die is even” and “the blue die is even” independent?",
    opts: ["Yes", "No, they overlap", "No, they are disjoint"], a: 0,
    why: "Both even is 3 · 3 = 9 cells: 9/36 = 1/4 = 1/2 · 1/2. Overlapping is not the same as dependent." },
  { q: "D = a double, E = the sum is 8. Which is larger?",
    opts: ["P(D | E)", "P(E | D)", "They are equal"], a: 0,
    why: "P(D | E) = (1/36)/(5/36) = 1/5 and P(E | D) = (1/36)/(6/36) = 1/6: same overlap, different frame." },
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
  rollsMini: (el) => demoRollsMini(el),
  space: (el) => demoSpace(el),
  events: (el) => demoEvents(el),
  condition: (el) => demoCondition(el),
  bayes: (el) => demoBayes(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
