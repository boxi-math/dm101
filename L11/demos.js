// Interactive demos for DM101 Lecture 11 (division and the gcd). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L11-division-gcd.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same numbers (divmod with a non-negative remainder, Euclid, extended Euclid) so that the inputs can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

const SVGNS = "http://www.w3.org/2000/svg";

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

// Lecture-only styles (the shared stylesheet is not edited per lecture).
(() => {
  const st = document.createElement("style");
  st.textContent = `
    .dm-fig .board { fill: var(--teal); fill-opacity: 0.12; stroke: var(--ink-2); stroke-width: 1.5; }
    .dm-fig .gridline { stroke: var(--teal); stroke-width: 1; fill: none; }
    .dm-fig .strip { fill: var(--red); fill-opacity: 0.35; stroke: var(--red); stroke-width: 1; }
    .dm-fig .sq { fill-opacity: 0.45; stroke: var(--paper); stroke-width: 1.2; }
    .dm-fig .tick { stroke: var(--ink-2); stroke-width: 1; }
    .dm-fig .rem { stroke: var(--red); stroke-width: 5; stroke-linecap: round; fill: none; }
    .dm-fig .rod { fill-opacity: 0.55; stroke: var(--paper); stroke-width: 1; }
    .dm-fig .gap { fill: var(--red); fill-opacity: 0.85; }
    .dm-fig .lbl { font-size: 12px; }
    .dm-steps { font-family: var(--mono); font-size: 13.5px; margin: 8px 0 0; line-height: 1.6; color: var(--ink-2); overflow-x: auto; }
    .dm-steps .now { color: var(--ink); font-weight: 600; }
  `;
  document.head.appendChild(st);
})();

// Division with a remainder 0 <= r < b (b > 0), as in Theorem 1 (JS % can be negative).
const divmod = (a, b) => { const r = ((a % b) + b) % b; return [(a - r) / b, r]; };
const gcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
const num = (el, sel, lo, hi, dflt) => {
  const v = Math.round(+el.querySelector(sel).value);
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : dflt;
};

// ---------- Demo 1 · Which squares fit the board? ----------

function demoTiles(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>board <input type="number" class="a" min="4" max="120" value="84"> × <input type="number" class="b" min="4" max="60" value="30"></label>
      <label>square side <input type="range" class="s" min="1" max="30" value="5"> <b class="sv">5</b></label></div>
      <p class="dm-read"></p>`;
  const W = 600, H = 260;
  const g = svg(el.querySelector(".fig"), W, H, "A board cut into squares; the strips left over are shown in red");
  const draw = () => {
    g.clear();
    const a = num(el, ".a", 4, 120, 84), b = num(el, ".b", 4, 60, 30);
    const sIn = el.querySelector(".s");
    sIn.max = Math.min(a, b);
    const s = Math.min(+sIn.value, a, b);
    el.querySelector(".sv").textContent = s;
    const u = Math.min((W - 20) / a, (H - 20) / b), x0 = (W - a * u) / 2, y0 = (H - b * u) / 2;
    g.add("rect", { x: x0, y: y0, width: a * u, height: b * u, class: "board" });
    const [qa, ra] = divmod(a, s), [qb, rb] = divmod(b, s);
    for (let i = 1; i <= qa; i++) g.add("line", { x1: x0 + i * s * u, y1: y0, x2: x0 + i * s * u, y2: y0 + qb * s * u, class: "gridline" });
    for (let j = 1; j <= qb; j++) g.add("line", { x1: x0, y1: y0 + j * s * u, x2: x0 + qa * s * u, y2: y0 + j * s * u, class: "gridline" });
    if (ra) g.add("rect", { x: x0 + qa * s * u, y: y0, width: ra * u, height: b * u, class: "strip" });
    if (rb) g.add("rect", { x: x0, y: y0 + qb * s * u, width: qa * s * u, height: rb * u, class: "strip" });
    const common = [];
    for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) common.push(d);
    const fits = !ra && !rb;
    el.querySelector(".dm-read").innerHTML =
      `Along: ${a} = ${qa} · ${s} + <b>${ra}</b>. Across: ${b} = ${qb} · ${s} + <b>${rb}</b>. ` +
      (fits ? `<b>It fits:</b> ${qa} × ${qb} = ${qa * qb} squares.` : `A strip is left over (red): side ${s} does not divide both.`) +
      `<br>Sides that fit: ${common.join(", ")}. The largest is <b>gcd(${a}, ${b}) = ${gcd(a, b)}</b>.`;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  draw();
}

// ---------- Demo 2 · Division on the number line ----------

function demoDivide(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>a <input type="range" class="a" min="-40" max="40" value="26"> <b class="av">26</b></label>
      <label>b <input type="range" class="b" min="1" max="12" value="7"> <b class="bv">7</b></label></div>
      <p class="dm-read"></p>`;
  const W = 640, H = 150, Y = 96;
  const g = svg(el.querySelector(".fig"), W, H, "Jumps of length b from 0 up to a; the piece left over is the remainder");
  const draw = () => {
    g.clear();
    const a = +el.querySelector(".a").value, b = +el.querySelector(".b").value;
    el.querySelector(".av").textContent = a;
    el.querySelector(".bv").textContent = b;
    const [q, r] = divmod(a, b);
    const lo = Math.min(0, q * b) - 2, hi = Math.max(0, a, q * b) + 2;
    const u = (W - 40) / (hi - lo), X = (n) => 20 + (n - lo) * u;
    g.add("line", { x1: X(lo), y1: Y, x2: X(hi), y2: Y, class: "axis" });
    for (let n = lo; n <= hi; n++) {
      const big = n % 5 === 0;
      g.add("line", { x1: X(n), y1: Y - (big ? 6 : 3), x2: X(n), y2: Y + (big ? 6 : 3), class: "tick" });
      if (big) g.text(X(n), Y + 22, String(n));
    }
    const dir = q >= 0 ? 1 : -1;
    for (let k = 0; k < Math.abs(q); k++) {
      const x1 = X(dir * k * b), x2 = X(dir * (k + 1) * b), h = Math.min(46, 10 + 3 * b);
      g.add("path", { d: `M${x1},${Y - 2} C${x1 + 0.15 * (x2 - x1)},${Y - 1.33 * h} ${x2 - 0.15 * (x2 - x1)},${Y - 1.33 * h} ${x2},${Y - 2}`, class: "arc A open" });
    }
    if (r) g.add("line", { x1: X(q * b), y1: Y, x2: X(a), y2: Y, class: "rem" });
    g.add("circle", { cx: X(q * b), cy: Y, r: 4, class: "A" });
    g.add("circle", { cx: X(a), cy: Y, r: 5, class: "B" });
    let msg = `${a} = (${q}) · ${b} + <b>${r}</b>, and 0 ≤ ${r} < ${b}: quotient <b>${q}</b>, remainder <b>${r}</b>` +
      ` (${Math.abs(q)} jump${Math.abs(q) === 1 ? "" : "s"} of ${b}${q < 0 ? " to the left" : ""}, then ${r} to the right).`;
    if (a < 0 && r) {
      const qt = Math.trunc(a / b), rt = a - qt * b;
      msg += `<br>Truncating towards zero (C, Java) gives ${a} = (${qt}) · ${b} + (${rt}): true, but ${rt} &lt; 0 is not a remainder.`;
    }
    el.querySelector(".dm-read").innerHTML = msg;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  draw();
}

// ---------- Demo 3 · Euclid: cut off the largest squares ----------

function euclidSquares(a, b) {
  // One entry per division: the squares cut off (x, y, side) and the line "big = q · small + r".
  const steps = [];
  let x = 0, y = 0, w = a, h = b;
  while (w > 0 && h > 0) {
    const big = Math.max(w, h), small = Math.min(w, h), q = Math.floor(big / small), r = big - q * small;
    const sq = [];
    for (let i = 0; i < q; i++) sq.push(w >= h ? [x + i * small, y, small] : [x, y + i * small, small]);
    steps.push({ sq, big, small, q, r });
    if (w >= h) { x += q * small; w = r; } else { y += q * small; h = r; }
  }
  return steps;
}

const STEP_COLORS = ["A", "B", "T3", "T4"];

function drawSquares(g, a, b, steps, k, W, H) {
  g.clear();
  const u = Math.min((W - 20) / a, (H - 20) / b), x0 = (W - a * u) / 2, y0 = (H - b * u) / 2;
  g.add("rect", { x: x0, y: y0, width: a * u, height: b * u, class: "board" });
  steps.slice(0, k).forEach((st, i) => {
    const cls = i === steps.length - 1 ? "HL" : STEP_COLORS[i % STEP_COLORS.length];
    st.sq.forEach(([sx, sy, side]) => {
      g.add("rect", { x: x0 + sx * u, y: y0 + sy * u, width: side * u, height: side * u, class: `sq ${cls}` });
      if (side * u > 26) g.text(x0 + (sx + side / 2) * u, y0 + (sy + side / 2) * u + 4, String(side), "ink lbl");
    });
  });
}

function demoEuclid(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>a <input type="number" class="a" min="1" max="400" value="84"></label>
      <label>b <input type="number" class="b" min="1" max="400" value="30"></label>
      <button class="back">←</button><button class="primary next">Step →</button><button class="play">Play</button><button class="reset">Reset</button></div>
      <div class="dm-steps"></div><p class="dm-read"></p>`;
  const W = 600, H = 260;
  const g = svg(el.querySelector(".fig"), W, H, "A rectangle a by b; Euclid's algorithm cuts off the largest squares");
  let a = 84, b = 30, steps = [], k = 0, timer = null;
  const draw = () => {
    drawSquares(g, a, b, steps, k, W, H);
    el.querySelector(".dm-steps").innerHTML = steps.slice(0, k)
      .map((st, i) => `<div class="${i === k - 1 ? "now" : ""}">${st.big} = ${st.q} · ${st.small} + ${st.r}</div>`).join("");
    const g0 = gcd(a, b);
    el.querySelector(".dm-read").innerHTML = k === 0
      ? `Press <b>Step</b> to cut off the largest squares of the ${a} × ${b} rectangle.`
      : k < steps.length
        ? `${steps[k - 1].q} square${steps[k - 1].q > 1 ? "s" : ""} of side ${steps[k - 1].small}; what is left is ${steps[k - 1].small} by ${steps[k - 1].r}. Same common divisors as before (Lemma 2).`
        : `Remainder 0: the last squares fit exactly. <b>gcd(${a}, ${b}) = ${g0}</b>, the last nonzero remainder, after ${steps.length} division${steps.length > 1 ? "s" : ""}.`;
  };
  const restart = () => {
    if (timer) clearInterval(timer);
    timer = null;
    a = num(el, ".a", 1, 400, 84);
    b = num(el, ".b", 1, 400, 30);
    steps = euclidSquares(a, b);
    k = 0;
    draw();
  };
  el.querySelectorAll("input").forEach((i) => { i.onchange = restart; });
  el.querySelector(".next").onclick = () => { if (k < steps.length) { k++; draw(); } };
  el.querySelector(".back").onclick = () => { if (k > 0) { k--; draw(); } };
  el.querySelector(".reset").onclick = () => { if (timer) clearInterval(timer); timer = null; k = 0; draw(); };
  el.querySelector(".play").onclick = () => {
    if (timer) { clearInterval(timer); timer = null; return; }
    if (k >= steps.length) k = 0;
    timer = setInterval(() => { if (k >= steps.length) { clearInterval(timer); timer = null; return; } k++; draw(); }, 700);
  };
  restart();
}

function demoEuclidMini(el) {
  // Hero: the 84 x 30 board, one division per tick, then a rest and a restart (one interval; app.js clears it).
  el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
  const W = 600, H = 240, a = 84, b = 30, steps = euclidSquares(a, b);
  const g = svg(el.querySelector(".fig"), W, H, "The 84 by 30 board cut into squares of 30, 30, 24 and four of 6");
  const read = el.querySelector(".dm-read");
  let t = 0;
  const show = () => {
    const k = Math.min(t, steps.length);
    drawSquares(g, a, b, steps, k, W, H);
    read.innerHTML = k ? steps.slice(0, k).map((st) => `${st.big} = ${st.q} · ${st.small} + ${st.r}`).join(" &nbsp;·&nbsp; ") +
      (k === steps.length ? " &nbsp;→&nbsp; <b>gcd = 6</b>" : "") : "84 × 30";
  };
  show();
  setInterval(() => { t = t > steps.length + 2 ? 0 : t + 1; show(); }, 1100);
}

// ---------- Demo 4 · Bézout: rods forward and back ----------

function extEuclid(a, b) {
  // Same loop as the note's ext_euclid: rows (r, x, y) with r = a*x + b*y.
  const rows = [[a, 1, 0], [b, 0, 1]];
  while (rows[rows.length - 1][0] !== 0) {
    const [r0, x0, y0] = rows[rows.length - 2], [r1, x1, y1] = rows[rows.length - 1];
    const q = Math.floor(r0 / r1);
    rows.push([r0 - q * r1, x0 - q * x1, y0 - q * y1]);
  }
  return rows;
}

function demoBezout(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>rods <input type="number" class="a" min="1" max="200" value="84"> and <input type="number" class="b" min="1" max="200" value="30"> cm</label>
      <button class="other">another pair</button><button class="reset">first pair</button></div>
      <div class="dm-steps"></div><p class="dm-read"></p>`;
  const W = 620, H = 150;
  const g = svg(el.querySelector(".fig"), W, H, "Copies of one rod laid forward, copies of the other below; the difference is the gcd");
  let t = 0;
  const draw = () => {
    g.clear();
    const a = num(el, ".a", 1, 200, 84), b = num(el, ".b", 1, 200, 30);
    const rows = extEuclid(a, b), [gg, x1, y1] = rows[rows.length - 2];
    const x = x1 + t * (b / gg), y = y1 - t * (a / gg);
    // Top row: the rod with the positive coefficient; bottom row: the other one.
    const parts = [[a, x, "B"], [b, y, "A"]];
    const pos = parts.filter((p) => p[1] > 0), neg = parts.filter((p) => p[1] < 0);
    const P = pos.reduce((s, p) => s + p[0] * p[1], 0), N = neg.reduce((s, p) => s - p[0] * p[1], 0);
    const u = (W - 40) / Math.max(P, N, 1), X = (n) => 20 + n * u;
    const row = (list, y0) => {
      let at = 0;
      list.forEach(([len, c, cls]) => {
        for (let i = 0; i < Math.abs(c); i++) {
          g.add("rect", { x: X(at), y: y0, width: len * u, height: 26, class: `rod ${cls}` });
          if (len * u > 26) g.text(X(at + len / 2), y0 + 17, String(len), "ink lbl");
          at += len;
        }
      });
    };
    row(pos, 22);
    row(neg, 62);
    g.add("rect", { x: X(N), y: 54, width: Math.max(2, (P - N) * u), height: 6, class: "gap" });
    g.text(Math.min(W - 80, Math.max(80, X((N + P) / 2))), 116, `difference ${P - N}`);
    el.querySelector(".dm-steps").innerHTML = "<div>r = a·x + b·y</div>" + rows.slice(0, -1).map(([r, xx, yy], i) =>
      `<div class="${i === rows.length - 2 ? "now" : ""}">${r} = ${a}·(${xx}) + ${b}·(${yy})</div>`).join("");
    el.querySelector(".dm-read").innerHTML =
      `<b>${a} · (${x}) + ${b} · (${y}) = ${a * x + b * y} = gcd(${a}, ${b})</b>. ` +
      (t ? `This is the first pair shifted ${t} time${Math.abs(t) > 1 ? "s" : ""}: x + ${b / gg}, y − ${a / gg}.` : "From the last nonzero row of the extended algorithm.") +
      (gg === 1 ? ` Since it is 1, ${a} and ${b} are relatively prime.` : "");
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = () => { t = 0; draw(); }; });
  el.querySelector(".other").onclick = () => { t = t >= 2 ? -2 : t + 1; draw(); };
  el.querySelector(".reset").onclick = () => { t = 0; draw(); };
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "What are the quotient and remainder of −50 divided by 8?",
    opts: ["q = −6, r = −2", "q = −7, r = 6", "q = −6, r = 2"], a: 1,
    why: "−50 = (−7) · 8 + 6 and 0 ≤ 6 < 8. The pair (−6, −2) satisfies the equation but −2 is not a remainder." },
  { q: "True or false: gcd(a, b) = gcd(b, a − b) for all integers a, b with b ≠ 0.",
    opts: ["True", "False"], a: 0,
    why: "Lemma 2 holds for any integer q, not only the quotient; with q = 1, a = 1 · b + (a − b)." },
  { q: "84 · 2 + 30 · (−5) = 18. What does this tell you about gcd(84, 30)?",
    opts: ["It is 18, by Bézout", "It divides 18", "Nothing at all"], a: 1,
    why: "The gcd divides 84 and 30, so it divides every 84x + 30y, here 18. It is 6; 18 does not even divide 84." },
  { q: "Are 91 and 65 relatively prime?",
    opts: ["Yes", "No, both are divisible by 13"], a: 1,
    why: "91 = 7 · 13 and 65 = 5 · 13, so gcd(91, 65) = 13." },
  { q: "Euclid's algorithm on 84 and 30 ends with 24 = 4 · 6 + 0. What is the gcd?",
    opts: ["0, the last remainder", "4, the last quotient", "6, the last nonzero remainder"], a: 2,
    why: "Each line keeps the gcd: gcd(84, 30) = gcd(30, 24) = gcd(24, 6) = gcd(6, 0) = 6." },
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
  euclidMini: (el) => demoEuclidMini(el),
  tiles: (el) => demoTiles(el),
  divide: (el) => demoDivide(el),
  euclid: (el) => demoEuclid(el),
  bezout: (el) => demoBezout(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
