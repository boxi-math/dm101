// Interactive demos for DM101 Lecture 3 (lists, sets and counting). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L03-lists-sets.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same numbers so that the pictures can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

const SVGNS = "http://www.w3.org/2000/svg";

// Lecture-only styles (the shared style.css has .dm-fig colours A / B / HL / DIM).
(() => {
  const css = `
  .dm-fig .gcell { stroke: var(--ink-2); stroke-width: 1; fill: var(--card); }
  .dm-fig .gcell.A { fill: var(--teal); fill-opacity: 0.28; stroke: var(--ink-2); }
  .dm-fig .gcell.B { fill: var(--amber); fill-opacity: 0.32; stroke: var(--ink-2); }
  .dm-fig .gcell.HL { fill: var(--red); fill-opacity: 0.22; stroke: var(--ink-2); }
  .dm-fig .gcell.DIM { fill: var(--line); fill-opacity: 0.5; stroke: var(--ink-2); }
  .dm-fig .gtext { font-size: 14px; fill: var(--ink); stroke: none; dominant-baseline: middle; }
  .dm-fig .gtext.faint { fill: var(--stone); opacity: 0.5; }
  .dm-fig .ghead { font-size: 12px; fill: var(--stone); stroke: none; dominant-baseline: middle; }
  .dm-fig .strike { stroke: var(--red); stroke-width: 2; }
  .dm-fig .ring { fill: none; stroke: var(--ink); stroke-width: 3; }
  .dm3-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
  .dm3-chips .sub { font: 13px var(--mono); padding: 4px 8px; border-radius: 7px; border: 1px solid var(--line);
    background: var(--card); color: var(--ink); display: inline-flex; flex-direction: column; align-items: center; min-width: 48px; }
  .dm3-chips .sub small { color: var(--stone); font-size: 11px; }
  .dm3-chips .sub.on { background: var(--teal); border-color: var(--teal); color: var(--paper); }
  .dm3-chips .sub.on small { color: var(--paper); }
  .dm3-table { border-collapse: collapse; font: 13px var(--mono); margin: 8px 0; }
  .dm3-table th, .dm3-table td { border: 1px solid var(--line); padding: 3px 9px; text-align: center; }
  .dm3-table th { color: var(--ink-2); font-weight: 600; }
  .dm3-table tr.bad td { background: var(--mark); color: var(--red); font-weight: 700; }
  .dm3-wrap { overflow-x: auto; max-width: 100%; }
  .dm-ctrl select.wide { max-width: 100%; }`;
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
  const text = (x, y, t, cls = "gtext") => { const n = add("text", { x, y, class: cls }); n.textContent = t; return n; };
  const clear = () => { while (s.firstChild) s.removeChild(s.firstChild); };
  return { s, add, text, clear };
}

// Every list of length k from the items (the same as itertools.product).
function lists(items, k) {
  let out = [[]];
  for (let i = 0; i < k; i++) out = out.flatMap((l) => items.map((x) => [...l, x]));
  return out;
}
const falling = (n, k) => { let p = 1; for (let i = 0; i < k; i++) p *= n - i; return p; };

// ---------- Demo 1 · Lists of length 2 as a grid ----------

function drawGrid(g, letters, strike) {
  g.clear();
  const n = letters.length, cell = Math.min(60, 300 / n), x0 = 30, y0 = 26;
  letters.forEach((c, j) => g.text(x0 + j * cell + cell / 2, 13, c, "ghead"));
  letters.forEach((r, i) => {
    g.text(14, y0 + i * cell + cell / 2, r, "ghead");
    letters.forEach((c, j) => {
      const diag = i === j;
      const cls = strike ? (diag ? "" : "A") : "A";
      g.add("rect", { x: x0 + j * cell, y: y0 + i * cell, width: cell, height: cell, class: `gcell ${cls}` });
      g.text(x0 + j * cell + cell / 2, y0 + i * cell + cell / 2, r + c, diag && strike ? "gtext faint" : "gtext");
      if (diag && strike) {
        const a = x0 + j * cell + 6, b = y0 + i * cell + 6, e = cell - 12;
        g.add("line", { x1: a, y1: b, x2: a + e, y2: b + e, class: "strike" });
        g.add("line", { x1: a, y1: b + e, x2: a + e, y2: b, class: "strike" });
      }
    });
  });
}

function demoGrid(el, opts = {}) {
  const LET = ["A", "C", "G", "T", "U", "X"];
  if (opts.mini) {
    el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
    const g = svg(el.querySelector(".fig"), 300, 300, "The 16 two-letter codes from A, C, G, T as a 4 by 4 grid");
    let strike = false;
    const show = () => {
      drawGrid(g, LET.slice(0, 4), strike);
      el.querySelector(".dm-read").innerHTML = strike ? "No repeats: <b>4 · 3 = 12</b>" : "All lists: <b>4 · 4 = 16</b>";
    };
    show();
    setInterval(() => { strike = !strike; show(); }, 2200);
    return;
  }
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>n letters <input type="range" min="2" max="6" value="4" class="n"> <b class="nv">4</b></label>
      <label><input type="checkbox" class="st"> no repeats (strike the diagonal)</label>
      <label>length k <select class="k">${[0, 1, 2, 3, 4, 5, 6].map((k) => `<option${k === 3 ? " selected" : ""}>${k}</option>`).join("")}</select></label></div>
      <p class="dm-read"></p>`;
  const g = svg(el.querySelector(".fig"), 340, 340, "Lists of length 2 as a grid: rows are the first entry, columns the second");
  const draw = () => {
    const n = +el.querySelector(".n").value, strike = el.querySelector(".st").checked, k = +el.querySelector(".k").value;
    const letters = LET.slice(0, n);
    el.querySelector(".nv").textContent = n;
    drawGrid(g, letters, strike);
    const all = lists(letters, k), distinct = all.filter((l) => new Set(l).size === l.length);
    const ex = (arr) => arr.slice(0, 4).map((l) => `(${l.join(", ")})`).join(" ") + (arr.length > 4 ? " …" : "");
    el.querySelector(".dm-read").innerHTML =
      `Grid: ${n} rows × ${n} columns = <b>${n * n}</b> lists of length 2` + (strike ? `; without the diagonal <b>${n} · ${n - 1} = ${n * (n - 1)}</b>.` : ".") +
      `<br>Length ${k}, written out and counted: <b>${all.length}</b> lists = ${n}<sup>${k}</sup>; <b>${distinct.length}</b> without a repeat = (${n})<sub>${k}</sub> = ${falling(n, k)}.` +
      (k > n ? ` (k > n: one factor is 0.)` : "") + (k === 0 ? " (The one list of length 0 is the empty list ().)" : `<br><span class="hint">e.g. ${ex(distinct.length ? distinct : all)}</span>`);
  };
  el.querySelectorAll("input, select").forEach((i) => { i.oninput = draw; i.onchange = draw; });
  draw();
}

// ---------- Demo 2 · The power set, one yes/no question per element ----------

function demoPowerset(el) {
  el.innerHTML = `<div class="dm-ctrl">
      <button class="minus">− element</button><button class="plus primary">+ element</button>
      <span>ask: is it in the subset?</span><span class="asks"></span></div>
      <div class="dm3-chips"></div><p class="dm-read"></p>`;
  const NAMES = ["a", "b", "c", "d", "e"];
  let n = 3, ask = -1;
  const draw = () => {
    const els = NAMES.slice(0, n);
    el.querySelector(".asks").innerHTML = els.map((x, i) => `<button class="q${i === ask ? " primary" : ""}" data-i="${i}">${x}?</button>`).join("");
    el.querySelectorAll(".asks .q").forEach((b) => { b.onclick = () => { ask = ask === +b.dataset.i ? -1 : +b.dataset.i; draw(); }; });
    const subs = lists([0, 1], n);
    el.querySelector(".dm3-chips").innerHTML = subs.map((bits) => {
      const name = "{" + els.filter((_, i) => bits[i]).join(", ") + "}";
      const on = ask >= 0 && bits[ask] === 1;
      return `<span class="sub${on ? " on" : ""}">${name === "{}" ? "∅" : name}<small>${bits.join("")}</small></span>`;
    }).join("");
    const total = subs.length, yes = ask >= 0 ? subs.filter((b) => b[ask]).length : 0;
    el.querySelector(".dm-read").innerHTML = `The set {${els.join(", ")}} has ${n} elements and <b>${total} = 2<sup>${n}</sup></b> subsets: one 0/1 list each.` +
      (ask >= 0 ? `<br>“Is ${els[ask]} in it?” Yes for <b>${yes}</b>, no for <b>${total - yes}</b>: exactly half.` : "<br>Click a question to shade the subsets that answer yes.") +
      (n < 5 ? ` Adding an element doubles the count to ${2 * total}.` : "");
  };
  el.querySelector(".plus").onclick = () => { if (n < 5) { n++; draw(); } };
  el.querySelector(".minus").onclick = () => { if (n > 0) { n--; if (ask >= n) ask = -1; draw(); } };
  draw();
}

// ---------- Demo 3 · Set operations on a board of numbers ----------

const PROPS = {
  even: ["even", (x) => x % 2 === 0],
  odd: ["odd", (x) => x % 2 === 1],
  m3: ["multiples of 3", (x) => x % 3 === 0],
  m4: ["multiples of 4", (x) => x % 4 === 0],
  prime: ["primes", (x) => x > 1 && [...Array(x).keys()].slice(2).every((d) => x % d)],
  square: ["squares", (x) => Number.isInteger(Math.sqrt(x))],
  small: ["at most 6", (x) => x <= 6],
};
const OPS = {
  union: ["A ∪ B", (a, b) => a || b],
  inter: ["A ∩ B", (a, b) => a && b],
  diff: ["A − B", (a, b) => a && !b],
  rdiff: ["B − A", (a, b) => b && !a],
  sym: ["A Δ B", (a, b) => a !== b],
};

function demoBoard(el) {
  const opt = (obj, sel) => Object.entries(obj).map(([k, [name]]) => `<option value="${k}"${k === sel ? " selected" : ""}>${name}</option>`).join("");
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>A <select class="a">${opt(PROPS, "even")}</select></label>
      <label>B <select class="b">${opt(PROPS, "m3")}</select></label>
      <label>show <select class="op">${opt(OPS, "union")}</select></label></div><p class="dm-read"></p>`;
  const N = 10, cols = 5, W = 340, cw = 60, ch = 44, x0 = 20, y0 = 10;
  const g = svg(el.querySelector(".fig"), W, 2 * ch + 20, "The numbers 1 to 10; A and B shaded, the result outlined");
  const draw = () => {
    g.clear();
    const [an, af] = PROPS[el.querySelector(".a").value], [bn, bf] = PROPS[el.querySelector(".b").value];
    const [on, of] = OPS[el.querySelector(".op").value];
    const A = [], B = [], R = [];
    for (let x = 1; x <= N; x++) {
      const a = af(x), b = bf(x), r = of(a, b);
      if (a) A.push(x); if (b) B.push(x); if (r) R.push(x);
      const i = x - 1, cx = x0 + (i % cols) * cw, cy = y0 + Math.floor(i / cols) * ch;
      const cls = a && b ? "HL" : a ? "A" : b ? "B" : "";
      g.add("rect", { x: cx, y: cy, width: cw, height: ch, class: `gcell ${cls}` });
      g.text(cx + cw / 2, cy + ch / 2, String(x));
      if (r) g.add("rect", { x: cx + 4, y: cy + 4, width: cw - 8, height: ch - 8, rx: 6, class: "ring" });
    }
    const both = A.filter((x) => B.includes(x)), uni = [...new Set([...A, ...B])];
    const set = (s) => (s.length ? `{${s.join(", ")}}` : "∅");
    el.querySelector(".dm-read").innerHTML = `A = ${an} = ${set(A)} (teal), B = ${bn} = ${set(B)} (amber), both: red.` +
      `<br><b>${on} = ${set(R)}</b> (outlined), ${R.length} element${R.length === 1 ? "" : "s"}.` +
      `<br>|A ∪ B| = ${uni.length} = |A| + |B| − |A ∩ B| = ${A.length} + ${B.length} − ${both.length}.`;
  };
  el.querySelectorAll("select").forEach((s) => { s.onchange = draw; });
  draw();
}

// ---------- Demo 4 · Membership table for a set identity ----------

const EXPRS = {
  dm1l: ["A − (B ∪ C)", (a, b, c) => a && !(b || c)],
  dm1r: ["(A − B) ∩ (A − C)", (a, b, c) => a && !b && a && !c],
  dm2l: ["A − (B ∩ C)", (a, b, c) => a && !(b && c)],
  dm2r: ["(A − B) ∪ (A − C)", (a, b, c) => (a && !b) || (a && !c)],
  d1l: ["A ∩ (B ∪ C)", (a, b, c) => a && (b || c)],
  d1r: ["(A ∩ B) ∪ (A ∩ C)", (a, b, c) => (a && b) || (a && c)],
  d2l: ["A ∪ (B ∩ C)", (a, b, c) => a || (b && c)],
  d2r: ["(A ∪ B) ∩ (A ∪ C)", (a, b, c) => (a || b) && (a || c)],
  wrong2: ["(A ∪ B) ∩ C", (a, b, c) => (a || b) && c],
};

function demoTable(el) {
  const opt = (sel) => Object.entries(EXPRS).filter(([k]) => !k.startsWith("wrong")).map(([k, [name]]) => `<option value="${k}"${k === sel ? " selected" : ""}>${name}</option>`).join("") +
    `<option value="wrong2"${sel === "wrong2" ? " selected" : ""}>${EXPRS.wrong2[0]}</option>`;
  el.innerHTML = `<div class="dm-ctrl">
      <label>left <select class="l wide">${opt("dm2l")}</select></label>
      <label>right <select class="r wide">${opt("dm1r")}</select></label></div>
      <div class="dm3-wrap"><table class="dm3-table"></table></div><p class="dm-read"></p>`;
  const draw = () => {
    const [ln, lf] = EXPRS[el.querySelector(".l").value], [rn, rf] = EXPRS[el.querySelector(".r").value];
    const rows = lists([0, 1], 3);
    const bad = [];
    el.querySelector(".dm3-table").innerHTML = `<tr><th>x ∈ A</th><th>x ∈ B</th><th>x ∈ C</th><th>left</th><th>right</th></tr>` +
      rows.map(([a, b, c]) => {
        const L = +!!lf(a, b, c), R = +!!rf(a, b, c);
        if (L !== R) bad.push([a, b, c]);
        return `<tr class="${L !== R ? "bad" : ""}"><td>${a}</td><td>${b}</td><td>${c}</td><td>${L}</td><td>${R}</td></tr>`;
      }).join("");
    const where = ([a, b, c]) => `x ${a ? "∈" : "∉"} A, ${b ? "∈" : "∉"} B, ${c ? "∈" : "∉"} C`;
    el.querySelector(".dm-read").innerHTML = bad.length
      ? `<b>Not a law:</b> ${ln} and ${rn} differ in ${bad.length} of 8 rows. A counterexample: sets with one element x where ${where(bad[0])}, e.g. ` +
        `A = ${bad[0][0] ? "{1}" : "∅"}, B = ${bad[0][1] ? "{1}" : "∅"}, C = ${bad[0][2] ? "{1}" : "∅"}.`
      : `<b>A law:</b> ${ln} = ${rn} for all sets. Every element falls into one of these 8 rows, and the two sides agree in each, so the table is a proof.`;
  };
  el.querySelectorAll("select").forEach((s) => { s.onchange = draw; });
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Which pair is equal?",
    opts: ["The lists (1, 2, 2) and (2, 1, 2)", "The sets {1, 2, 2} and {2, 1}", "Both", "Neither"], a: 1,
    why: "Lists are compared position by position, so the lists differ. Sets have the same elements, 1 and 2, so the sets are equal." },
  { q: "What are (5)₂, (5)₅ and (5)₆?",
    opts: ["25, 3125, 15625", "20, 120, 0", "10, 1, 0"], a: 1,
    why: "(5)₂ = 5 · 4 = 20; (5)₅ = 5! = 120; (5)₆ = 0, since six places cannot be filled from five objects without a repeat." },
  { q: "How many subsets does {a, b, c, d} have?",
    opts: ["14", "15", "16"], a: 2,
    why: "2⁴ = 16, counting ∅ and the whole set. 14 forgets both, 15 forgets one of them." },
  { q: "Which statement is false?",
    opts: ["{1} ⊆ {1, 2}", "{1} ∈ {1, 2}", "∅ ⊆ {1, 2}"], a: 1,
    why: "The elements of {1, 2} are the numbers 1 and 2, not the set {1}. {1} is a subset, not an element." },
  { q: "“For finite sets, |A − B| = |A| − |B|.” With E = {2, 4, 6, 8, 10} and T = {3, 6, 9}, what goes wrong?",
    opts: ["Nothing: 5 − 3 = 2 = |E − T|", "|E − T| = 4, not 2: only the shared element 6 is removed", "|E − T| = 3"], a: 1,
    why: "E − T = {2, 4, 8, 10}. The correct rule is |A − B| = |A| − |A ∩ B| = 5 − 1." },
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
  gridMini: (el) => demoGrid(el, { mini: true }),
  grid: (el) => demoGrid(el),
  powerset: (el) => demoPowerset(el),
  board: (el) => demoBoard(el),
  table: (el) => demoTable(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
