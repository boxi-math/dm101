// Interactive demos for DM101 Lecture 6 (contradiction, well-ordering, smallest counterexample). CODE and OUT come
// from extras.js, which dm101/tools/site_build.py writes from the {.python #name} blocks of
// notes/L06-contradiction.md (checked by tools/check.py), so every code panel and output on the page is the one that
// was run. The JS below recomputes the same numbers so that the inputs can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

// Lecture-only styles (the shared style.css is not edited per lecture).
(() => {
  const css = `
  .l6-cells { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 2px; }
  .l6-cell { min-width: 42px; padding: 4px 4px 3px; border: 1px solid var(--line); border-radius: 7px; background: var(--card); text-align: center; font: 12px var(--mono); color: var(--ink-2); }
  .l6-cell b { display: block; font-size: 13px; color: var(--ink); margin-bottom: 2px; }
  .l6-cell i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 1px; background: var(--teal); font-style: normal; }
  .l6-cell i.bad { background: var(--red); }
  .l6-key { font-size: 12.5px; color: var(--ink-2); margin: 4px 0 0; }
  .l6-key i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--teal); vertical-align: -1px; margin-right: 3px; }
  .l6-key i.bad { background: var(--red); }
  .l6-steps { margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: var(--ink-2); }
  .l6-steps li { margin: 3px 0; }
  .l6-steps li.now { color: var(--ink); font-weight: 600; }
  .l6-steps li.later { opacity: 0.35; }
  .dm-fig.l6fig text { font-size: 17px; }
  .dm-fig.l6fig text.lab { font-size: 19px; font-weight: 600; }
  `;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
})();

// Drawing width: narrower on phones, so that labels stay readable when the SVG is scaled to the screen.
const figW = (el) => (el.clientWidth && el.clientWidth < 480 ? 420 : 640);

const SVGNS = "http://www.w3.org/2000/svg";

function svg(el, w, h, label) {
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${h}`);
  s.setAttribute("class", "dm-fig l6fig");
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

// A number line from lo to hi with every `every`-th label; returns x(n).
function numberLine(g, lo, hi, W, y, every = 1) {
  const pad = 22, u = (W - 2 * pad) / (hi - lo), X = (n) => pad + (n - lo) * u;
  g.add("line", { x1: X(lo) - 6, y1: y, x2: X(hi) + 10, y2: y, class: "axis" });
  for (let n = lo; n <= hi; n++) {
    g.add("line", { x1: X(n), y1: y - 4, x2: X(n), y2: y + 4, class: "axis" });
    if ((n - lo) % every === 0) g.text(X(n), y + 24, String(n));
  }
  return X;
}

const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
const isPrime = (q) => { if (q < 2) return false; for (let d = 2; d * d <= q; d++) if (q % d === 0) return false; return true; };
const mod = (a, n) => ((a % n) + n) % n;

// ---------- Demo 1 · The balance: which amounts can a x + b y reach? ----------

function egcd(a, b) {
  // returns [g, x, y] with a x + b y = g
  if (!b) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}

function demoBalance(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>weights <input type="number" class="a" min="1" max="40" value="6"> g and <input type="number" class="b" min="1" max="40" value="9"> g</label>
      <label>target <input type="number" class="t" min="1" max="300" value="100"> g</label></div><p class="dm-read"></p>`;
  const W = figW(el), H = 96;
  const g = svg(el.querySelector(".fig"), W, H, "Amounts near the target that the balance can weigh");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    g.clear();
    const a = Math.round(+el.querySelector(".a").value), b = Math.round(+el.querySelector(".b").value), T = Math.round(+el.querySelector(".t").value);
    if (!(a >= 1 && b >= 1 && T >= 1)) { read.textContent = "Choose two weights and a target, each at least 1."; return; }
    const d = gcd(a, b), lo = Math.max(0, T - 10), hi = lo + 20;
    const X = numberLine(g, lo, hi, W, 44, 2);
    for (let n = lo; n <= hi; n++) if (n % d === 0) g.add("circle", { cx: X(n), cy: 44, r: 4.5, class: "A" });
    g.add("circle", { cx: X(T), cy: 44, r: 7, class: T % d === 0 ? "B open" : "HL open", "stroke-width": 2.5 });
    if (T % d !== 0) {
      read.innerHTML = `Every amount ${a}x + ${b}y is a multiple of <b>${d}</b> (= gcd(${a}, ${b})): ${a}x + ${b}y = ${d}(${a / d}x + ${b / d}y). ` +
        `The target ${T} is not (${T} = ${d}·${Math.floor(T / d)} + ${T % d}), so <b>no integers x, y work</b>: suppose they did, then ${d} would divide ${T}, a contradiction.`;
      return;
    }
    // a solution: scale the extended-Euclid one, then shift it to make |x| + |y| small
    const [, x0, y0] = egcd(a, b);
    let x = x0 * (T / d), y = y0 * (T / d);
    const sx = b / d, sy = a / d;
    let best = [x, y];
    const k0 = Math.round(-x / sx);
    for (let k = k0 - 3; k <= k0 + 3; k++) {
      const cx = x + k * sx, cy = y - k * sy;
      if (Math.abs(cx) + Math.abs(cy) < Math.abs(best[0]) + Math.abs(best[1])) best = [cx, cy];
    }
    [x, y] = best;
    const side = (n, w) => (n === 0 ? `no ${w}-gram weights` : `${Math.abs(n)} × ${w} g on the ${n > 0 ? "other pan" : "flour's pan"}`);
    read.innerHTML = `Possible: ${a}·(${x}) + ${b}·(${y}) = <b>${a * x + b * y}</b>. That is ${side(x, a)} and ${side(y, b)}. ` +
      `(${T} is a multiple of gcd(${a}, ${b}) = ${d}.)`;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  draw();
}

// ---------- Demo 2 · Statement, contrapositive, converse ----------

const STATEMENTS = [
  { label: "multiple of 6 ⇒ even", A: (n) => n % 6 === 0, B: (n) => n % 2 === 0, nA: "n is not a multiple of 6", nB: "n is odd" },
  { label: "n > 3 ⇒ n² > 9", A: (n) => n > 3, B: (n) => n * n > 9, nA: "n ≤ 3", nB: "n² ≤ 9" },
  { label: "n² − 6n + 5 even ⇒ n odd", A: (n) => mod(n * n - 6 * n + 5, 2) === 0, B: (n) => mod(n, 2) === 1, nA: "n² − 6n + 5 is odd", nB: "n is even" },
  { label: "5n + 3 even ⇒ n odd", A: (n) => mod(5 * n + 3, 2) === 0, B: (n) => mod(n, 2) === 1, nA: "5n + 3 is odd", nB: "n is even" },
  { label: "n² > 9 ⇒ n > 3 (false)", A: (n) => n * n > 9, B: (n) => n > 3, nA: "n² ≤ 9", nB: "n ≤ 3" },
];

function demoImplication(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>statement <select class="st">${STATEMENTS.map((s, i) => `<option value="${i}">${s.label}</option>`).join("")}</select></label>
      <label>n from <input type="number" class="lo" min="-30" max="0" value="-8"> to <input type="number" class="hi" min="1" max="40" value="12"></label></div>
      <p class="l6-key">Each card is one n; dots: <i></i>holds, <i class="bad"></i>fails — for the statement, its contrapositive and its converse, in that order.</p>
      <div class="l6-cells"></div><p class="dm-read"></p>`;
  const cells = el.querySelector(".l6-cells"), read = el.querySelector(".dm-read");
  const imp = (p, q) => !p || q;
  const draw = () => {
    const s = STATEMENTS[+el.querySelector(".st").value];
    let lo = Math.round(+el.querySelector(".lo").value), hi = Math.round(+el.querySelector(".hi").value);
    if (!(lo <= hi) || hi - lo > 70) { read.textContent = "Choose a range of at most 70 numbers."; cells.innerHTML = ""; return; }
    const fail = { s: [], c: [], v: [] };
    cells.innerHTML = "";
    for (let n = lo; n <= hi; n++) {
      const a = s.A(n), b = s.B(n);
      const st = imp(a, b), co = imp(!b, !a), cv = imp(b, a);
      if (!st) fail.s.push(n);
      if (!co) fail.c.push(n);
      if (!cv) fail.v.push(n);
      cells.insertAdjacentHTML("beforeend", `<div class="l6-cell" title="A: ${a}, B: ${b}"><b>${n}</b><i class="${st ? "" : "bad"}"></i><i class="${co ? "" : "bad"}"></i><i class="${cv ? "" : "bad"}"></i></div>`);
    }
    const list = (xs) => (xs.length ? xs.join(", ") : "none");
    read.innerHTML = `Contrapositive: “if ${s.nB}, then ${s.nA}”.<br>Statement fails at: <b>${list(fail.s)}</b>. Contrapositive fails at: <b>${list(fail.c)}</b>` +
      (fail.s.join() === fail.c.join() ? " — the same n, always." : ".") + `<br>Converse fails at: <b>${list(fail.v)}</b>` +
      (fail.v.length && !fail.s.length ? " — a true statement with a false converse." : ".");
  };
  el.querySelectorAll("input, select").forEach((i) => { i.oninput = draw; i.onchange = draw; });
  draw();
}

// ---------- Demo 3 · Hunting for the least element ----------

function multOrder(d) {
  // least n >= 1 with d | 2^n - 1 (d odd), or null
  if (d % 2 === 0) return null;
  let p = 1;
  for (let n = 1; n <= 200; n++) { p = (p * 2) % d; if (p === 1 % d) return n; }
  return null;
}

function demoLeast(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>set <select class="set">
        <option value="sq">{ n ∈ ℕ : n² > K }</option>
        <option value="ord">{ n ≥ 1 : K divides 2ⁿ − 1 }</option>
        <option value="mul">{ multiples of 7 greater than K }</option>
        <option value="empty">{ n ∈ ℕ : n² < 0 } (empty)</option>
        <option value="int">the integers ℤ</option>
        <option value="rat">the positive rationals</option></select></label>
      <label class="kl">K <input type="range" class="k" min="1" max="99" value="50"> <b class="kv">50</b></label></div><p class="dm-read"></p>`;
  const W = figW(el), H = 100;
  const g = svg(el.querySelector(".fig"), W, H, "A set on the number line and its least element");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    g.clear();
    const set = el.querySelector(".set").value;
    const k = +el.querySelector(".k").value;
    el.querySelector(".kv").textContent = k;
    el.querySelector(".kl").style.visibility = ["sq", "ord", "mul"].includes(set) ? "visible" : "hidden";
    if (set === "rat") {
      const X = (v) => 22 + v * (W - 44);
      g.add("line", { x1: 16, y1: 50, x2: W - 12, y2: 50, class: "axis" });
      g.text(X(0), 76, "0"); g.text(X(1), 76, "1");
      g.add("line", { x1: X(1), y1: 46, x2: X(1), y2: 54, class: "axis" });
      g.add("line", { x1: X(0), y1: 46, x2: X(0), y2: 54, class: "axis" });
      for (let j = 1; j <= 8; j++) g.add("circle", { cx: X(1 / 2 ** j), cy: 50, r: 4, class: j === 8 ? "HL" : "A" });
      read.innerHTML = "Candidates 1/2, 1/4, 1/8, …, 1/256: whichever you call the least, <b>half of it is smaller and still a positive rational</b>. No least element (Theorem 3).";
      return;
    }
    if (set === "int") {
      const X = numberLine(g, -10, 10, W, 50, 2);
      for (let n = -10; n <= 10; n++) g.add("circle", { cx: X(n), cy: 50, r: 4, class: "A" });
      g.text(X(-10) - 2, 30, "← …", "lab");
      read.innerHTML = "Below any integer m there is m − 1, so the hunt runs off to the left for ever: <b>ℤ has no least element</b>. Well-ordering is about natural numbers.";
      return;
    }
    let members = [], least = null, note = "";
    if (set === "sq") { for (let n = 0; n <= 20; n++) if (n * n > k) members.push(n); least = members[0] ?? null; note = least === null ? "" : `${least - 1}² = ${(least - 1) ** 2} ≤ ${k} < ${least * least} = ${least}²`; }
    if (set === "ord") {
      const o = k % 2 ? multOrder(k) : null;
      if (o !== null) { for (let n = o; n <= 20; n += o) members.push(n); least = o; note = `2<sup>${o}</sup> − 1 = ${2 ** o - 1} = ${k} · ${(2 ** o - 1) / k}`; }
      else { read.innerHTML = `${k} is even and 2ⁿ − 1 is odd, so this set is <b>empty</b>: no least element, and a search for one would never stop. The principle needs a <b>nonempty</b> set.`; numberLine(g, 0, 20, W, 50, 2); return; }
    }
    if (set === "mul") { for (let n = 7 * (Math.floor(k / 7) + 1); n <= 7 * (Math.floor(k / 7) + 1) + 140; n += 7) members.push(n); least = members[0]; note = `${least} = 7 · ${least / 7}, and ${least - 7} ≤ ${k}`; }
    if (set === "empty") { numberLine(g, 0, 20, W, 50, 2); read.innerHTML = "No natural number has a negative square: the set is <b>empty</b>, so it has no least element, and checking 0, 1, 2, … would never stop. That is why the principle says nonempty."; return; }
    const lo = least === null ? 0 : Math.max(0, least - 10), hi = lo + 20;
    const X = numberLine(g, lo, hi, W, 50, 2);
    members.filter((n) => n >= lo && n <= hi).forEach((n) => g.add("circle", { cx: X(n), cy: 50, r: n === least ? 7 : 4.5, class: n === least ? "HL" : "A" }));
    read.innerHTML = least === null ? "Nothing in view." : `Checking ${set === "ord" ? "1, 2, 3, …" : lo === 0 ? "0, 1, 2, …" : "upwards"} in order, the first member is <b>${least}</b>: the least element (${note}).`;
  };
  el.querySelector(".k").oninput = draw;
  el.querySelector(".set").onchange = () => {
    const k = el.querySelector(".k");
    if (el.querySelector(".set").value === "ord" && +k.value % 2 === 0) k.value = 7;  // start on a nonempty case
    draw();
  };
  draw();
}

// ---------- Demo 4 · A smallest-counterexample proof, step by step ----------

const CLAIMS = [
  { label: "3 divides n³ + 2n (n ≥ 0)", c: 0, P: (n) => (n ** 3 + 2 * n) % 3 === 0,
    start: "0³ + 2·0 = 0 = 3 · 0",
    step: (m) => { const p = (m - 1) ** 3 + 2 * (m - 1), g = 3 * (m * m - m + 1); return `(m − 1)³ + 2(m − 1) = ${p} = 3 · ${p / 3}, and m³ + 2m = ${p} + 3·(${m * m - m + 1}) = ${p + g} = 3 · ${(p + g) / 3}`; } },
  { label: "5 divides n⁵ − n (n ≥ 0)", c: 0, P: (n) => (n ** 5 - n) % 5 === 0,
    start: "0⁵ − 0 = 0 = 5 · 0",
    step: (m) => { const p = (m - 1) ** 5 - (m - 1), g = 5 * m ** 4 - 10 * m ** 3 + 10 * m * m - 5 * m; return `(m − 1)⁵ − (m − 1) = ${p} = 5 · ${p / 5}, and m⁵ − m = ${p} + ${g} = ${p + g} = 5 · ${(p + g) / 5}`; } },
  { label: "2ⁿ ≥ n + 2 for n ≥ 2", c: 2, P: (n) => 2 ** n >= n + 2,
    start: "2² = 4 ≥ 4",
    step: (m) => `2<sup>m−1</sup> = ${2 ** (m - 1)} ≥ m + 1 = ${m + 1}, so 2<sup>m</sup> = ${2 ** m} ≥ 2m + 2 = ${2 * m + 2} ≥ m + 2 = ${m + 2}` },
  { label: "2ⁿ ≥ n + 2 for every n ≥ 0 (false)", c: 0, P: (n) => 2 ** n >= n + 2, start: null, step: null },
  { label: "n² − n + 11 is prime (false)", c: 0, P: (n) => isPrime(n * n - n + 11), start: "0² − 0 + 11 = 11 is prime", step: null },
];

function demoDescentProof(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>claim <select class="cl">${CLAIMS.map((c, i) => `<option value="${i}">${c.label}</option>`).join("")}</select></label>
      <label class="ml">suppose the least counterexample is m = <input type="range" class="m" min="1" max="12" value="7"> <b class="mv">7</b></label>
      <button class="back">←</button><button class="primary next">Step →</button></div>
      <ol class="l6-steps"><li>Suppose the claim fails somewhere.</li><li>Take the least counterexample m.</li><li>Below m everything works; check the start.</li><li>Reach a contradiction.</li><li>Conclude.</li></ol>
      <p class="dm-read"></p>`;
  const W = figW(el), H = 100;
  const g = svg(el.querySelector(".fig"), W, H, "Counterexamples on the number line during a proof by smallest counterexample");
  const read = el.querySelector(".dm-read");
  let step = 0;
  const draw = () => {
    g.clear();
    const cl = CLAIMS[+el.querySelector(".cl").value];
    // For a false claim the least counterexample is real: find it. For a true one, m is a supposition (slider).
    let real = null;
    for (let n = cl.c; n < 400; n++) if (!cl.P(n)) { real = n; break; }
    const slider = el.querySelector(".m");
    slider.min = String(cl.c + 1);
    el.querySelector(".ml").style.visibility = real === null ? "visible" : "hidden";
    const m = real === null ? Math.max(+slider.value, cl.c + 1) : real;
    el.querySelector(".mv").textContent = m;
    const X = numberLine(g, 0, 14, W, 56, 1);
    el.querySelectorAll(".l6-steps li").forEach((li, i) => { li.className = i === step ? "now" : i > step ? "later" : ""; });
    if (step >= 0) g.add("circle", { cx: X(Math.min(m, 14)), cy: 56, r: 7, class: step >= 3 && real === null ? "A" : "HL" });
    if (step >= 1) g.text(X(Math.min(m, 14)), 34, "m", "lab");
    if (step >= 2) for (let n = cl.c; n < m && n <= 14; n++) g.add("circle", { cx: X(n), cy: 56, r: 4.5, class: "A" });
    if (step >= 2 && cl.c > 0) for (let n = 0; n < cl.c; n++) g.add("circle", { cx: X(n), cy: 56, r: 3.5, class: "DIM" });
    const msgs = [];
    msgs[0] = real === null ? `Suppose some n ≥ ${cl.c} fails. (In fact none does; we argue as if one did.)` : `This claim really fails: the first failure is at n = ${real}.`;
    msgs[1] = real === null ? `By well-ordering the counterexamples have a least element; say it is <b>m = ${m}</b> (move the slider: the argument is the same for every m).` : `The least counterexample is <b>m = ${real}</b>.`;
    if (real === null) {
      msgs[2] = `Every n from ${cl.c} to m − 1 = ${m - 1} works. The start: ${cl.start}, so m ≠ ${cl.c} and m − 1 is in range.`;
      msgs[3] = `${cl.step(m)}. So m works after all: <b>contradiction</b>.`;
      msgs[4] = `No counterexample exists: the claim holds for every n ≥ ${cl.c}. (The same lines work for any m, which is why this is a proof and the slider is not.)`;
    } else if (cl.start === null) {
      msgs[2] = `The start: 2⁰ = 1 < 2, so <b>m = 0 is the counterexample</b> and m − 1 = −1 is not a natural number. The “proof” of the notes used m − 1 here: that is its error.`;
      msgs[3] = "No contradiction can be reached: the step from m − 1 to m has nothing to start from.";
      msgs[4] = "The claim is false (it fails at 0 and 1). From n = 2 on it is true: pick the third claim.";
    } else {
      const v = (n) => n * n - n + 11;
      msgs[2] = `${cl.start}, and n = 1, …, ${m - 1} all give primes (the last: ${v(m - 1)}).`;
      msgs[3] = `But m = ${m} gives ${v(m)} = 11 · 11, not prime. Nothing turns “m − 1 works” into “m works”, so there is no contradiction.`;
      msgs[4] = "The claim is false; its least counterexample is 11. A smallest-counterexample proof only succeeds when the step from smaller cases really works.";
    }
    read.innerHTML = msgs[step];
  };
  el.querySelector(".next").onclick = () => { if (step < 4) { step++; draw(); } };
  el.querySelector(".back").onclick = () => { if (step > 0) { step--; draw(); } };
  el.querySelector(".cl").onchange = () => { step = 0; draw(); };
  el.querySelector(".m").oninput = draw;
  draw();
}

// ---------- Hero · the shrinker finds the least counterexample of n² − n + 11 ----------

function demoShrinkMini(el) {
  el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
  const W = 600, H = 100, N = 14;
  const g = svg(el.querySelector(".fig"), W, H, "Testing n = 0, 1, 2, … until n² − n + 11 is not prime");
  const read = el.querySelector(".dm-read");
  let X;
  const base = () => { g.clear(); X = numberLine(g, 0, N, W, 56, 1); read.innerHTML = "Testing n² − n + 11 …"; };
  base();
  // One interval drives the loop (app.js stops intervals when the page changes): test, pause, reset.
  let t = 0;
  setInterval(() => {
    if (t <= 11) {
      const v = t * t - t + 11, ok = isPrime(v);
      g.add("circle", { cx: X(t), cy: 56, r: ok ? 4.5 : 7, class: ok ? "A" : "HL" });
      read.innerHTML = ok ? `n = ${t}: ${v} is prime` : `n = ${t}: ${v} = 11 · 11 — <b>the least counterexample</b>`;
    }
    if (t === 18) { base(); t = -1; }
    t++;
  }, 420);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Which statement is equivalent to “if n is a multiple of 10, then n is even”?",
    opts: ["If n is even, then n is a multiple of 10", "If n is odd, then n is not a multiple of 10", "If n is not a multiple of 10, then n is odd"], a: 1,
    why: "That is the contrapositive (not B ⇒ not A). The first is the converse, false at n = 2; the third negates both parts without swapping them, and fails at n = 2 too." },
  { q: "True or false: if “if A, then B” is true, then “if B, then A” is true.",
    opts: ["True", "False"], a: 1,
    why: "“If n is a multiple of 6, then n is even” is true; its converse fails at n = 4." },
  { q: "Which of these sets has a least element?",
    opts: ["The negative integers", "The positive rationals", "{ n ∈ ℕ : n² > 200 }"], a: 2,
    why: "Its least element is 15 (14² = 196, 15² = 225). The other two have no least element: below every candidate there is a smaller one." },
  { q: "To prove “there is no largest natural number” by contradiction, what do you suppose?",
    opts: ["Every natural number is large", "There is a largest natural number L", "There is no smallest natural number"], a: 1,
    why: "Then L + 1 is a natural number larger than L, a contradiction." },
  { q: "“Let m be the least counterexample to 2ⁿ ≥ n + 2 (n ∈ ℕ); then m − 1 works, so …” What is wrong?",
    opts: ["Nothing, the claim is true", "The least counterexample is m = 0, and m − 1 is not a natural number", "Well-ordering does not apply to ℕ"], a: 1,
    why: "2⁰ = 1 < 2: the claim fails at 0 (and at 1). The start must be checked before m − 1 is used." },
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
  shrinkMini: (el) => demoShrinkMini(el),
  balance: (el) => demoBalance(el),
  implication: (el) => demoImplication(el),
  least: (el) => demoLeast(el),
  descentProof: (el) => demoDescentProof(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
