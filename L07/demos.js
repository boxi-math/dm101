// Interactive demos for DM101 Lecture 7 (induction). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L07-induction.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same numbers so that the pictures can be changed.

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

// ---------- Demo 1 · Dominoes: base case and step ----------

function demoDominoes(el, opts = {}) {
  const N = 12;
  el.innerHTML = `<div class="fig"></div>${opts.mini ? "" : `<div class="dm-ctrl">
      <label><input type="checkbox" class="base" checked> push the first domino (base case)</label>
      <label>broken link after <select class="gap"><option value="-1">none</option><option value="2">2</option><option value="5">5</option><option value="8">8</option></select></label>
      <button class="primary go">Push</button><button class="reset">Reset</button></div>`}<p class="dm-read"></p>`;
  const W = 600, H = 150, step = 44, x0 = 30;
  const g = svg(el.querySelector(".fig"), W, H, "A row of dominoes numbered 0 to 11");
  let doms = [], timer = null;
  const read = el.querySelector(".dm-read");
  const gapAfter = () => (opts.mini ? -1 : +el.querySelector(".gap").value);
  const draw = () => {
    g.clear();
    doms = [];
    const gap = gapAfter();
    g.add("line", { x1: 10, y1: 110, x2: W - 10, y2: 110, class: "axis" });
    for (let k = 0; k < N; k++) {
      const x = x0 + k * step + (gap >= 0 && k > gap ? 26 : 0);
      doms.push(g.add("rect", { x, y: 40, width: 12, height: 70, rx: 2, class: `domino ${k === 0 ? "B" : "A"}` }));
      g.text(x + 6, 132, String(k));
    }
    read.innerHTML = opts.mini ? "" : "Press <b>Push</b>.";
  };
  const push = () => {
    if (timer) clearInterval(timer);
    draw();
    const base = el.querySelector(".base").checked, gap = gapAfter();
    if (!base) { read.innerHTML = "Nobody pushed domino 0. The step is perfect, but <b>nothing falls</b>: no base case, no proof."; return; }
    let k = 0;
    timer = setInterval(() => {
      if (k < N) doms[k].classList.add("down");
      const stop = k === gap || k === N - 1;
      read.innerHTML = `Fallen: <b>0 … ${k}</b>` + (k === gap ? ` — the link from ${k} to ${k + 1} is broken, so the chain stops. The step must hold for <b>every</b> k.` : (stop ? " — every domino fell: P(n) for every n shown." : ""));
      if (stop) { clearInterval(timer); timer = null; }
      k++;
    }, 260);
  };
  draw();
  if (opts.mini) {
    // One interval drives the loop (app.js stopTimers clears intervals when the page changes): fall, rest, reset.
    let t = 0;
    setInterval(() => {
      if (t < N) doms[t].classList.add("down");
      if (t === N + 6) { draw(); t = -1; }
      t++;
    }, 260);
    return;
  }
  el.querySelector(".go").onclick = push;
  el.querySelector(".reset").onclick = () => { if (timer) clearInterval(timer); draw(); };
  el.querySelector(".gap").onchange = () => { if (timer) clearInterval(timer); draw(); };
  el.querySelector(".base").onchange = () => { if (timer) clearInterval(timer); draw(); };
}

// ---------- Demo 2 · The odd numbers make a square ----------

function demoSquare(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl"><label>n <input type="range" min="1" max="10" value="4" class="n"> <b class="nv">4</b></label></div><p class="dm-read"></p>`;
  const S = 300;
  const g = svg(el.querySelector(".fig"), S, S, "An n by n square of dots; the last L-shaped layer is highlighted");
  const draw = (n) => {
    g.clear();
    const p = (S - 20) / 10, off = (S - n * p) / 2;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const layer = Math.max(r, c) === n - 1 && n > 1;
        g.add("circle", { cx: off + c * p + p / 2, cy: off + r * p + p / 2, r: p * 0.36, class: layer ? "B" : "A" });
      }
    }
    const odds = Array.from({ length: n }, (_, i) => 2 * i + 1);
    const sum = odds.reduce((a, b) => a + b, 0);
    el.querySelector(".nv").textContent = n;
    el.querySelector(".dm-read").innerHTML = `${odds.join(" + ")} = <b>${sum} = ${n}²</b>` +
      (n > 1 ? `<br>New layer (amber): ${n - 1} down the side + ${n - 1} along the bottom + 1 corner = ${2 * n - 1}, the next odd number.` : "<br>Base case: one dot, 1 = 1².");
  };
  const input = el.querySelector(".n");
  input.oninput = () => draw(+input.value);
  draw(4);
}

// ---------- Demo 3 · Stamps: how many base cases? ----------

function payable(a, b, n) {
  for (let y = 0; y * b <= n; y++) if ((n - y * b) % a === 0) return [(n - y * b) / a, y];
  return null;
}
const gcd = (x, y) => (y ? gcd(y, x % y) : x);

function demoStamps(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>stamps <input type="number" class="a" min="2" max="9" value="4"> and <input type="number" class="b" min="2" max="12" value="5"> cents</label>
      <label><select class="mode"><option value="all">all base cases</option><option value="one">only the first base case</option></select></label></div><p class="dm-read"></p>`;
  const N = 40, W = 640, H = 150, u = (W - 40) / N;
  const g = svg(el.querySelector(".fig"), W, H, "Amounts 1 to 40; the ones that can be paid, and the chains of the induction step");
  const X = (n) => 20 + n * u;
  const draw = () => {
    g.clear();
    let a = Math.round(+el.querySelector(".a").value), b = Math.round(+el.querySelector(".b").value);
    const read = el.querySelector(".dm-read");
    if (!(a >= 2 && b >= 2)) { read.textContent = "Choose two stamp values, each at least 2."; return; }
    if (a > b) [a, b] = [b, a];
    g.add("line", { x1: X(0), y1: 100, x2: X(N) + 8, y2: 100, class: "axis" });
    for (let n = 0; n <= N; n += 5) g.text(X(n), 122, String(n));
    if (gcd(a, b) !== 1) {
      read.innerHTML = `${a} and ${b} have a common factor ${gcd(a, b)}, so no amount that isn't a multiple of ${gcd(a, b)} can ever be paid: there is no "from some point on".`;
      for (let n = 1; n <= N; n++) g.add("circle", { cx: X(n), cy: 100, r: 3.6, class: payable(a, b, n) ? "A" : "HL" });
      return;
    }
    const fail = [];
    for (let n = 1; n <= N * 3; n++) if (!payable(a, b, n)) fail.push(n);
    const c = (fail.length ? fail[fail.length - 1] : 0) + 1;
    const bases = Array.from({ length: a }, (_, i) => c + i);
    const one = el.querySelector(".mode").value === "one";
    const used = one ? bases.slice(0, 1) : bases;
    const reached = new Set();
    used.forEach((s, i) => {
      for (let n = s; n + a <= N; n += a) {
        const x1 = X(n), x2 = X(n + a), h = 18 + 7 * i;
        g.add("path", { d: `M${x1},96 C${x1 + 0.1 * (x2 - x1)},${96 - 1.33 * h} ${x2 - 0.1 * (x2 - x1)},${96 - 1.33 * h} ${x2},96`, class: `arc ${i % 2 ? "B" : "A"} open` });
        reached.add(n + a);
      }
      reached.add(s);
    });
    for (let n = 1; n <= N; n++) {
      const pay = !!payable(a, b, n);
      let cls = pay ? "DIM" : "HL";
      if (n >= c) cls = reached.has(n) ? (bases.includes(n) ? "B" : "A") : "DIM";
      g.add("circle", { cx: X(n), cy: 100, r: bases.includes(n) ? 5 : 3.6, class: cls });
    }
    const missed = [];
    for (let n = c; n <= N; n++) if (!reached.has(n)) missed.push(n);
    read.innerHTML = `Cannot be paid: <b>${fail.join(", ") || "none"}</b>. Every amount from <b>${c}</b> on can. ` +
      `The step adds a ${a}-cent stamp, so it reaches back ${a} cents and needs <b>${a} base cases</b>: ${bases.join(", ")}. ` +
      (one ? `With only ${c}, the chain misses ${missed.slice(0, 8).join(", ")}${missed.length > 8 ? ", …" : ""}.` : "Their chains cover every amount from there on.");
  };
  el.querySelectorAll("input, select").forEach((i) => { i.oninput = draw; i.onchange = draw; });
  draw();
}

// ---------- Demo 4 · Tromino tiling, the inductive step as an algorithm ----------

function trominoes(n, hole) {
  // Same recursion as exercise 7 of the note: place one tromino at the centre, then fill the four quarters.
  const out = [];
  const fill = (top, left, size, h) => {
    if (size === 1) return;
    const half = size / 2, cells = [], holes = [];
    for (const dr of [0, 1]) {
      for (const dc of [0, 1]) {
        const r0 = top + dr * half, c0 = left + dc * half;
        if (r0 <= h[0] && h[0] < r0 + half && c0 <= h[1] && h[1] < c0 + half) holes.push(h);
        else { const ctr = [top + half - 1 + dr, left + half - 1 + dc]; cells.push(ctr); holes.push(ctr); }
      }
    }
    out.push({ cells, size });
    const quarters = [[top, left], [top, left + half], [top + half, left], [top + half, left + half]];
    quarters.forEach(([r0, c0], i) => fill(r0, c0, half, holes[i]));
  };
  fill(0, 0, 2 ** n, hole);
  return out;
}

function demoTromino(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>board <select class="n"><option value="1">2 × 2</option><option value="2">4 × 4</option><option value="3" selected>8 × 8</option></select></label>
      <button class="back">←</button><button class="primary next">Step →</button><button class="play">Play</button><button class="reset">Reset</button></div>
      <p class="dm-read"></p>`;
  const S = 320;
  const g = svg(el.querySelector(".fig"), S, S, "A board with one square removed, tiled by L-trominoes");
  const colors = ["A", "B", "T3", "T4"];
  let n = 3, hole = [1, 5], tiles = [], k = 0, timer = null;
  const read = el.querySelector(".dm-read");
  const draw = () => {
    g.clear();
    const size = 2 ** n, p = S / size;
    const owner = {};
    tiles.slice(0, k).forEach((t, i) => t.cells.forEach(([r, c]) => { owner[`${r},${c}`] = i; }));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isHole = r === hole[0] && c === hole[1];
        const i = owner[`${r},${c}`];
        const cls = isHole ? "hole" : i === undefined ? "DIM" : tiles[i].color;
        const cell = g.add("rect", { x: c * p, y: r * p, width: p, height: p, class: `cell ${cls}` });
        cell.style.cursor = "pointer";
        cell.onclick = () => { if (timer) clearInterval(timer); timer = null; hole = [r, c]; restart(); };
      }
    }
    const total = (4 ** n - 1) / 3;
    read.innerHTML = k === 0
      ? `Click any square to remove it. The board needs <b>${total}</b> trominoes, (4<sup>${n}</sup> − 1) / 3.`
      : `Tromino ${k} of ${total}` + (tiles[k - 1].size > 2 ? ` — placed at the centre of the ${tiles[k - 1].size} × ${tiles[k - 1].size} block, one square in each quarter without the hole (red at the top level)` : " — fills a 2 × 2 block with one square missing (the base case)") + (k === total ? ". <b>Done: every square covered exactly once.</b>" : ".");
  };
  const restart = () => {
    tiles = trominoes(n, hole);
    // Colour so that touching trominoes differ (greedy, four colours); the top-level step tromino is red.
    const at = {};
    tiles.forEach((t, i) => t.cells.forEach(([r, c]) => { at[`${r},${c}`] = i; }));
    tiles.forEach((t, i) => {
      if (t.size === 2 ** n && n > 1) { t.color = "HL"; return; }
      const near = new Set();
      t.cells.forEach(([r, c]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
        const j = at[`${r + dr},${c + dc}`];
        if (j !== undefined && j < i) near.add(tiles[j].color);
      }));
      t.color = colors.find((col) => !near.has(col)) || colors[0];
    });
    k = 0;
    draw();
  };
  el.querySelector(".n").onchange = (e) => { n = +e.target.value; hole = [0, 2 ** n - 1]; restart(); };
  el.querySelector(".next").onclick = () => { if (k < tiles.length) { k++; draw(); } };
  el.querySelector(".back").onclick = () => { if (k > 0) { k--; draw(); } };
  el.querySelector(".reset").onclick = () => { if (timer) clearInterval(timer); timer = null; k = 0; draw(); };
  el.querySelector(".play").onclick = () => {
    if (timer) { clearInterval(timer); timer = null; return; }
    if (k >= tiles.length) k = 0;
    timer = setInterval(() => { if (k >= tiles.length) { clearInterval(timer); timer = null; return; } k++; draw(); }, 350);
  };
  restart();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "In the domino picture, what does the inductive step say?",
    opts: ["The first domino falls", "Every falling domino knocks over the next one", "All the dominoes fall"], a: 1,
    why: "The base case pushes the first domino; the step says each one knocks over the next. Together they give the conclusion: all fall." },
  { q: "The step for “n² + n is odd” is correct: (k+1)² + (k+1) = (k² + k) + 2(k + 1). What is wrong with the claim?",
    opts: ["Nothing, it is proved", "The base case fails: 0² + 0 = 0 is even", "The step should use k − 1"], a: 1,
    why: "A correct step with a false base case proves nothing. In fact n² + n = n(n + 1) is always even." },
  { q: "True or false: a statement checked by computer for every n up to one million is true for every n.",
    opts: ["True", "False"], a: 1,
    why: "n² + n + 41 is prime for n = 0, …, 39 and not at n = 40. A test can only refute a claim." },
  { q: "Where does the “all cats have the same colour” step break?",
    opts: ["At k = 1: the groups {c₁} and {c₂} share no cat", "At k = 2", "It never breaks; the base case fails"], a: 0,
    why: "The two groups of k cats share k − 1 cats, which is 0 when k = 1. One broken link stops the chain." },
  { q: "The stamp step pays k + 1 as (k − 3) + 4. How many base cases does the proof from 12 on need?",
    opts: ["One: 12", "Two: 12 and 13", "Four: 12, 13, 14, 15"], a: 2,
    why: "k − 3 must be at least 12, so the step starts at k = 15; the amounts 12 to 15 are checked by hand." },
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
  dominoMini: (el) => demoDominoes(el, { mini: true }),
  dominoes: (el) => demoDominoes(el),
  square: (el) => demoSquare(el),
  stamps: (el) => demoStamps(el),
  tromino: (el) => demoTromino(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
