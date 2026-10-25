// Interactive demos for DM101 Lecture 2 (theorems and proofs). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L02-theorems-proofs.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same tables so that the reader can change the input.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

// Lecture-only styles (the shared style.css is not edited per lecture).
(() => {
  const css = `
  .l02 table.tt { border-collapse: collapse; margin: 8px auto; font: 14px var(--mono); }
  .l02 table.tt th, .l02 table.tt td { border: 1px solid var(--line); padding: 5px 10px; text-align: center; min-width: 30px; }
  .l02 table.tt th { color: var(--ink-2); font-weight: 600; background: var(--paper-2, var(--paper)); }
  .l02 table.tt td.T { background: var(--mark); }
  .l02 table.tt tr.diff td { box-shadow: inset 0 0 0 2px var(--red); }
  .l02 table.tt td.new { animation: l02pop 0.35s ease-out; }
  @keyframes l02pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
  .l02 .grid { display: grid; grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr); gap: 4px; max-width: 520px; margin: 8px auto; font-size: 13.5px; }
  .l02 .grid .hd { color: var(--ink-2); text-align: center; font: 600 13px var(--mono); align-self: end; padding: 2px; }
  .l02 .grid .rh { color: var(--ink-2); font: 600 13px var(--mono); align-self: center; padding-right: 6px; text-align: right; }
  .l02 .grid .gcell { border: 1px solid var(--line); border-radius: 6px; padding: 8px; min-height: 58px; background: var(--card); overflow-wrap: anywhere; font-family: var(--mono); }
  .l02 .grid .gcell .n { display: block; font: 11px var(--mono); color: var(--stone); margin-bottom: 3px; }
  .l02 .grid .gcell.broken { border: 2px solid var(--amber); }
  .l02 .grid .gcell.broken.full { border-color: var(--red); background: var(--red-soft, #f6dcd6); }
  .l02 .exprs { display: grid; gap: 6px; width: 100%; }
  .l02 .exprs label { display: flex; white-space: nowrap; }
  .l02 .exprs input { font: 14px var(--mono); padding: 5px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); flex: 1; min-width: 0; }
  .l02 .presets { display: flex; flex-wrap: wrap; gap: 6px; }
  .l02 .ttwrap { overflow-x: auto; }
  `;
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();

// ---------- Boolean expressions: a small parser (not > and > or > implies > iff) ----------

function parseBool(src) {
  const toks = [];
  const re = /\s*(<->|<=>|->|=>|↔|⇔|→|⇒|¬|!|~|∧|&&?|∨|\|\|?|\(|\)|[A-Za-z]+)/y;
  let m;
  re.lastIndex = 0;
  while (re.lastIndex < src.length) {
    const at = re.lastIndex;
    m = re.exec(src);
    if (!m) {
      if (/^\s*$/.test(src.slice(at))) break;
      throw new Error(`cannot read “${src.slice(at, at + 6)}”`);
    }
    let t = m[1];
    const low = t.toLowerCase();
    if (["<->", "<=>", "↔", "⇔", "iff"].includes(low)) t = "IFF";
    else if (["->", "=>", "→", "⇒", "implies"].includes(low)) t = "IMP";
    else if (["¬", "!", "~", "not"].includes(low)) t = "NOT";
    else if (["∧", "&", "&&", "and"].includes(low)) t = "AND";
    else if (["∨", "|", "||", "or"].includes(low)) t = "OR";
    else if (t === "T" || low === "true") t = "TRUE";
    else if (t === "F" || low === "false") t = "FALSE";
    else if (/^[a-z]$/.test(t)) t = "v:" + t;
    else if (t !== "(" && t !== ")") throw new Error(`unknown word “${t}” (variables are single small letters)`);
    toks.push(t);
  }
  let i = 0;
  const peek = () => toks[i];
  const eat = (t) => { if (toks[i] !== t) throw new Error(toks[i] ? `unexpected “${toks[i].replace("v:", "")}”` : "the expression ends too early"); i++; };
  const vars = new Set();
  const atom = () => {
    const t = peek();
    if (t === "NOT") { i++; const a = atom(); return (e) => !a(e); }
    if (t === "(") { i++; const a = iff(); eat(")"); return a; }
    if (t === "TRUE") { i++; return () => true; }
    if (t === "FALSE") { i++; return () => false; }
    if (t && t.startsWith("v:")) { i++; const v = t.slice(2); vars.add(v); return (e) => e[v]; }
    throw new Error(t ? `unexpected “${t}”` : "the expression ends too early");
  };
  const and = () => { let a = atom(); while (peek() === "AND") { i++; const l = a, r = atom(); a = (e) => l(e) && r(e); } return a; };
  const or = () => { let a = and(); while (peek() === "OR") { i++; const l = a, r = and(); a = (e) => l(e) || r(e); } return a; };
  const imp = () => { const a = or(); if (peek() === "IMP") { i++; const r = imp(); return (e) => !a(e) || r(e); } return a; };
  const iff = () => { let a = imp(); while (peek() === "IFF") { i++; const l = a, r = imp(); a = (e) => l(e) === r(e); } return a; };
  if (!toks.length) throw new Error("empty");
  const f = iff();
  if (i < toks.length) throw new Error(`unexpected “${toks[i].replace("v:", "")}”`);
  return { f, vars };
}

// Every row of the truth table, T before F (the order of itertools.product([True, False], repeat=m)).
function rows(vars) {
  const out = [];
  const m = vars.length;
  for (let k = 0; k < 2 ** m; k++) {
    const e = {};
    vars.forEach((v, j) => { e[v] = ((k >> (m - 1 - j)) & 1) === 0; });
    out.push(e);
  }
  return out;
}
const tf = (b) => (b ? "T" : "F");
const classOf = (vals) => (vals.every(Boolean) ? "tautology" : vals.some(Boolean) ? "contingency" : "contradiction");

// ---------- Hero · the truth table of x ⇒ y, filled row by row ----------

function demoTtMini(el) {
  el.innerHTML = `<div class="l02"><table class="tt"><thead><tr><th>x</th><th>y</th><th>x ⇒ y</th></tr></thead><tbody></tbody></table><p class="dm-read" style="text-align:center"></p></div>`;
  const body = el.querySelector("tbody"), read = el.querySelector(".dm-read");
  const R = rows(["x", "y"]);
  const notes = ["kept: x and y both true", "broken: x true, y false", "x false: vacuously true", "x false: vacuously true"];
  let t = 0;
  const draw = () => {
    const k = t % 8;
    body.innerHTML = R.map((e, j) => `<tr><td>${tf(e.x)}</td><td>${tf(e.y)}</td>${j < k ? `<td class="${!e.x || e.y ? "T" : ""}${j === k - 1 ? " new" : ""}">${tf(!e.x || e.y)}</td>` : "<td></td>"}</tr>`).join("");
    read.innerHTML = k >= 1 && k <= 4 ? `Row ${k}: ${notes[k - 1]}` : k > 4 ? "False in exactly one row." : "&nbsp;";
    t++;
  };
  draw();
  setInterval(draw, 1100);
}

// ---------- Demo 1 · The case grid ----------

function isPrime(m) {
  if (m < 2) return false;
  for (let d = 2; d * d <= m; d++) if (m % d === 0) return false;
  return true;
}

const CLAIMS = [
  { id: "six", label: "6 | n ⇒ 3 | n", A: "6 | n", B: "3 | n", a: (n) => n % 6 === 0, b: (n) => n % 3 === 0, max: 60 },
  { id: "sq", label: "n² even ⇒ n even", A: "n² even", B: "n even", a: (n) => (n * n) % 2 === 0, b: (n) => n % 2 === 0, max: 60 },
  { id: "four", label: "4 | n² ⇒ 4 | n", A: "4 | n²", B: "4 | n", a: (n) => (n * n) % 4 === 0, b: (n) => n % 4 === 0, max: 60 },
  { id: "mers", label: "p prime ⇒ 2ᵖ − 1 prime", A: "p prime", B: "2ᵖ − 1 prime", a: isPrime, b: (n) => isPrime(2 ** n - 1), max: 31 },
  { id: "ten", label: "10 | n ⇒ n even", A: "10 | n", B: "n even", a: (n) => n % 10 === 0, b: (n) => n % 2 === 0, max: 60 },
];

function demoCaseGrid(el) {
  el.innerHTML = `<div class="l02"><div class="dm-ctrl">
      <label>claim <select class="claim">${CLAIMS.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}</select></label>
      <label>view <select class="view"><option value="s">statement A ⇒ B</option><option value="v">converse B ⇒ A</option><option value="c">contrapositive ¬B ⇒ ¬A</option></select></label>
      <label>n = 1 … <input type="range" class="N" min="6" max="60" value="18"> <b class="Nv">18</b></label></div>
      <div class="grid"></div><p class="dm-read"></p></div>`;
  const grid = el.querySelector(".grid"), read = el.querySelector(".dm-read");
  const draw = () => {
    const c = CLAIMS.find((x) => x.id === el.querySelector(".claim").value);
    const input = el.querySelector(".N");
    input.max = c.max;
    const N = Math.min(+input.value, c.max);
    el.querySelector(".Nv").textContent = N;
    const view = el.querySelector(".view").value;
    const cells = [[], [], [], []]; // (A,B), (A,¬B), (¬A,B), (¬A,¬B)
    for (let n = 1; n <= N; n++) cells[(c.a(n) ? 0 : 2) + (c.b(n) ? 0 : 1)].push(n);
    // statement and contrapositive are broken by A ∧ ¬B (cell 1); the converse by B ∧ ¬A (cell 2)
    const broken = view === "v" ? 2 : 1;
    const head = ["", `B: ${c.B}`, `¬B`];
    let h = head.map((t) => `<div class="hd">${t}</div>`).join("");
    ["A: " + c.A, "¬A"].forEach((rl, r) => {
      h += `<div class="rh">${rl}</div>`;
      for (let col = 0; col < 2; col++) {
        const k = 2 * r + col, list = cells[k];
        const cls = k === broken ? ` broken${list.length ? " full" : ""}` : "";
        const shown = list.slice(0, 14).join(", ") + (list.length > 14 ? ", …" : "");
        h += `<div class="gcell${cls}"><span class="n">${list.length} number${list.length === 1 ? "" : "s"}</span>${shown || "—"}</div>`;
      }
    });
    grid.innerHTML = h;
    const name = { s: "The statement", v: "The converse", c: "The contrapositive" }[view];
    const where = broken === 1 ? "A true and B false" : "B true and A false";
    const list = cells[broken];
    read.innerHTML = `${name} is broken only by a case with <b>${where}</b> (the outlined cell). ` +
      (list.length ? `Counterexamples up to ${N}: <b>${list.slice(0, 6).join(", ")}</b>${list.length > 6 ? ", …" : ""}. It is <b>false</b>.`
        : `No such case up to ${N}: consistent with the claim, but only a proof covers every n.`);
  };
  el.querySelectorAll("select, input").forEach((i) => { i.oninput = draw; i.onchange = draw; });
  draw();
}

// ---------- Demo 2 · Compare two expressions by truth table ----------

const PAIRS = [
  ["De Morgan", "!(x & y)", "!x | !y"],
  ["wrong rewrite", "!(x & y)", "!x & !y"],
  ["contrapositive", "x -> y", "!y -> !x"],
  ["converse", "x -> y", "y -> x"],
  ["distributive", "x & (y | z)", "(x & y) | (x & z)"],
  ["modus ponens", "((x -> y) & x) -> y", "T"],
];

function demoTruthTable(el) {
  el.innerHTML = `<div class="l02"><div class="dm-ctrl"><div class="exprs">
      <label>f = <input class="f" value="${PAIRS[0][1]}" spellcheck="false" autocomplete="off"></label>
      <label>g = <input class="g" value="${PAIRS[0][2]}" spellcheck="false" autocomplete="off"></label></div>
      <div class="presets">${PAIRS.map((p, k) => `<button data-k="${k}">${p[0]}</button>`).join("")}</div></div>
      <div class="ttwrap"></div><p class="dm-read"></p></div>`;
  const wrap = el.querySelector(".ttwrap"), read = el.querySelector(".dm-read");
  const fi = el.querySelector(".f"), gi = el.querySelector(".g");
  const draw = () => {
    let F, G;
    try { F = parseBool(fi.value); } catch (e) { wrap.innerHTML = ""; read.textContent = `f: ${e.message}`; return; }
    try { G = parseBool(gi.value); } catch (e) { wrap.innerHTML = ""; read.textContent = `g: ${e.message}`; return; }
    const vars = [...new Set([...F.vars, ...G.vars])].sort();
    if (vars.length > 5) { wrap.innerHTML = ""; read.textContent = "Use at most 5 variables (32 rows)."; return; }
    const R = rows(vars);
    const fv = R.map(F.f), gv = R.map(G.f);
    const diff = R.map((_, j) => fv[j] !== gv[j]);
    wrap.innerHTML = `<table class="tt"><thead><tr>${vars.map((v) => `<th>${v}</th>`).join("")}<th>f</th><th>g</th></tr></thead><tbody>` +
      R.map((e, j) => `<tr class="${diff[j] ? "diff" : ""}">${vars.map((v) => `<td>${tf(e[v])}</td>`).join("")}<td class="${fv[j] ? "T" : ""}">${tf(fv[j])}</td><td class="${gv[j] ? "T" : ""}">${tf(gv[j])}</td></tr>`).join("") +
      "</tbody></table>";
    const nd = diff.filter(Boolean).length;
    read.innerHTML = `${R.length} row${R.length === 1 ? "" : "s"} (2<sup>${vars.length}</sup>), all the cases. ` +
      (nd ? `f and g differ in <b>${nd}</b> row${nd === 1 ? "" : "s"} (outlined): <b>not equal</b>.` : `f and g agree in every row: <b>equal</b> — and this check is a proof.`) +
      `<br>f is a <b>${classOf(fv)}</b>; g is a <b>${classOf(gv)}</b>.`;
  };
  fi.oninput = draw;
  gi.oninput = draw;
  el.querySelectorAll(".presets button").forEach((b) => {
    b.onclick = () => { const p = PAIRS[+b.dataset.k]; fi.value = p[1]; gi.value = p[2]; draw(); };
  });
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Which statement is equivalent to “if n is a multiple of 10, then n is even”?",
    opts: ["If n is even, then n is a multiple of 10", "If n is odd, then n is not a multiple of 10", "If n is not a multiple of 10, then n is odd"], a: 1,
    why: "That is the contrapositive (not B ⇒ not A), broken by the same case as the statement. The first option is the converse, false at n = 4." },
  { q: "Is “if 2 + 2 = 5, then 7 is even” true or false?",
    opts: ["True", "False"], a: 0,
    why: "The hypothesis is false, so the promise cannot be broken: the statement is (vacuously) true." },
  { q: "To disprove “for every n, if A(n) then B(n)”, your example must make…",
    opts: ["A false and B false", "A false and B true", "A true and B false"], a: 2,
    why: "A ⇒ B is broken only when A is true and B is false. For “p prime ⇒ 2ᵖ − 1 prime”, p = 11 works; p = 4 does not (4 is not prime)." },
  { q: "“Theorem: if n² is odd then n is odd. Proof: let n = 2a + 1; then n² = 2(2a² + 2a) + 1 is odd.” What is wrong?",
    opts: ["Nothing", "It proves the converse: it assumes n odd", "The algebra is wrong"], a: 1,
    why: "It starts from the conclusion. The statement is true, but needs its own proof, e.g. by contrapositive: if n is even then n² is even." },
  { q: "Is ¬(x ∨ y) = ¬x ∨ ¬y a law?",
    opts: ["Yes, it is De Morgan's law", "No: at x = T, y = F the sides are F and T"], a: 1,
    why: "De Morgan flips the operation: ¬(x ∨ y) = ¬x ∧ ¬y. Try the pair in Demo 2." },
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
  ttMini: (el) => demoTtMini(el),
  caseGrid: (el) => demoCaseGrid(el),
  truthTable: (el) => demoTruthTable(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
