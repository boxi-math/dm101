// Interactive demos for DM101 Lecture 4 (quantifiers). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L04-quantifiers.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same facts so that the inputs can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

// Lecture-only styles (grids of cells, chips, a staircase). Colours come from the course palette variables.
(() => {
  const css = `
  .q4-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
  .q4-chip { min-width: 40px; padding: 5px 9px; border-radius: 8px; border: 2px solid var(--line); background: var(--card);
    font: 13px var(--mono); text-align: center; color: var(--ink); }
  .q4-chip.yes { border-color: var(--teal); background: color-mix(in srgb, var(--teal) 16%, var(--card)); }
  .q4-chip.no { border-color: var(--red); background: color-mix(in srgb, var(--red) 14%, var(--card)); }
  .q4-chip.pick { outline: 3px solid var(--amber); outline-offset: 1px; }
  .q4-chip.skip { opacity: 0.35; }
  .q4-lines { display: grid; gap: 4px; margin-top: 8px; font-size: 14px; color: var(--ink-2); }
  .q4-lines .t { color: var(--green); font-weight: 600; } .q4-lines .f { color: var(--red); font-weight: 600; }
  .q4-lines .warn { color: var(--red); }
  .q4-grid { display: grid; gap: 3px; margin: 8px 0; width: max-content; max-width: 100%; }
  .q4-grid .h { font: 12px var(--mono); color: var(--stone); display: flex; align-items: center; justify-content: center; }
  .q4-cell { width: 46px; height: 34px; border-radius: 5px; border: 2px solid var(--line); background: var(--card);
    cursor: pointer; padding: 0; }
  .q4-cell.on { background: var(--teal); border-color: var(--teal); }
  .q4-cell.rowbad { border-color: var(--red); }
  .q4-cell.colgood { border-color: var(--amber); box-shadow: 0 0 0 2px var(--amber); }
  .q4-cell.miss { background: color-mix(in srgb, var(--red) 18%, var(--card)); }
  .q4-mini .q4-cell { cursor: default; }
  .q4-sub { display: grid; gap: 3px; margin: 8px 0; }
  .q4-sub div { font: 11px var(--mono); border-radius: 4px; padding: 4px 1px; text-align: center; border: 1px solid var(--line);
    background: var(--card); color: var(--ink); overflow: hidden; white-space: nowrap; }
  .q4-sub div.empty { color: var(--red); text-decoration: line-through; background: var(--paper-2); }
  .q4-sub div.dim { opacity: 0.25; }
  .q4-wrap { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
  .q4-stair { display: flex; align-items: flex-end; gap: 6px; height: 150px; }
  .q4-stair button { width: 30px; border: none; border-radius: 3px 3px 0 0; cursor: pointer; padding: 0; position: relative; }
  .q4-stair button span { position: absolute; top: -18px; left: 0; right: 0; font: 11px var(--mono); color: var(--ink-2); }
  .q4-stair .lab { font: 11px var(--mono); color: var(--stone); text-align: center; }
  .q4-col { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .k1 { background: color-mix(in srgb, var(--red) 35%, var(--card)) !important; }
  .k2 { background: color-mix(in srgb, var(--amber) 40%, var(--card)) !important; }
  .k3 { background: color-mix(in srgb, var(--green) 35%, var(--card)) !important; }
  .k4 { background: color-mix(in srgb, var(--teal) 35%, var(--card)) !important; }
  .k5 { background: color-mix(in srgb, var(--stone) 40%, var(--card)) !important; }
  .k6 { background: color-mix(in srgb, var(--ink-2) 30%, var(--card)) !important; }
  .q4-stair button.k1 { background: var(--red) !important; } .q4-stair button.k2 { background: var(--amber) !important; }
  .q4-stair button.k3 { background: var(--green) !important; } .q4-stair button.k4 { background: var(--teal) !important; }
  .q4-stair button.k5 { background: var(--stone) !important; } .q4-stair button.k6 { background: var(--ink-2) !important; }
  @media (max-width: 520px) { .q4-cell { width: 38px; height: 30px; } .q4-sub div { font-size: 9px; padding: 4px 0; letter-spacing: -0.2px; } }`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
})();

function isPrime(m) {
  if (m < 2n) return false;
  for (let d = 2n; d * d <= m; d++) if (m % d === 0n) return false;
  return true;
}
const mark = (v) => (v ? `<span class="t">true</span>` : `<span class="f">false</span>`);

// ---------- Demo 1 · Every, some, and their negations ----------

const DOMAINS = {
  small: { label: "1, 2, …, 12", items: Array.from({ length: 12 }, (_, i) => ({ show: String(i + 1), v: BigInt(i + 1) })) },
  mers: { label: "2ⁿ − 1, n = 2 … 7", items: [2, 3, 4, 5, 6, 7].map((n) => ({ show: String(2 ** n - 1), v: BigInt(2 ** n - 1) })) },
  odd: { label: "odd numbers 1 … 19", items: Array.from({ length: 10 }, (_, i) => ({ show: String(2 * i + 1), v: BigInt(2 * i + 1) })) },
  sq: { label: "squares 1 … 81", items: Array.from({ length: 9 }, (_, i) => ({ show: String((i + 1) ** 2), v: BigInt((i + 1) ** 2) })) },
};
const PROPS = {
  prime: { label: "is prime", f: isPrime },
  even: { label: "is even", f: (v) => v % 2n === 0n },
  odd: { label: "is odd", f: (v) => v % 2n === 1n },
  three: { label: "is a multiple of 3", f: (v) => v % 3n === 0n },
  small: { label: "is at most 50", f: (v) => v <= 50n },
};

function demoEverySome(el) {
  el.innerHTML = `<div class="dm-ctrl">
      <label>domain A <select class="dom">${Object.entries(DOMAINS).map(([k, d]) => `<option value="${k}">${d.label}</option>`).join("")}</select></label>
      <label>P(x): x <select class="prop">${Object.entries(PROPS).map(([k, p]) => `<option value="${k}">${p.label}</option>`).join("")}</select></label></div>
    <div class="q4-chips"></div><div class="q4-lines"></div>`;
  const dom = el.querySelector(".dom"), prop = el.querySelector(".prop");
  dom.value = "mers";
  const draw = () => {
    const items = DOMAINS[dom.value].items, P = PROPS[prop.value];
    const ok = items.map((it) => P.f(it.v));
    const all = ok.every(Boolean), any = ok.some(Boolean), allNot = ok.every((b) => !b);
    const witness = ok.indexOf(true), counter = ok.indexOf(false);
    el.querySelector(".q4-chips").innerHTML = items.map((it, i) =>
      `<span class="q4-chip ${ok[i] ? "yes" : "no"}${i === counter ? " pick" : ""}">${it.show}</span>`).join("");
    const p = P.label;
    el.querySelector(".q4-lines").innerHTML = [
      `∀x ∈ A, x ${p}: ${mark(all)}${all ? " (checked every element: the domain is finite)" : ` — counterexample <b>${items[counter].show}</b> (outlined)`}`,
      `∃x ∈ A, x ${p}: ${mark(any)}${any ? ` — witness <b>${items[witness].show}</b>` : " — every element fails"}`,
      `¬∀ ≡ ∃x ∈ A, x does not satisfy “${p}”: ${mark(!all)}`,
      `¬∃ ≡ ∀x ∈ A, x does not satisfy “${p}”: ${mark(!any)}`,
      `<span class="${!all && !allNot ? "warn" : ""}">Wrong negation of ∀, “∀x, not P(x)”: ${mark(allNot)}${!all && !allNot ? " — false together with the statement, so it is not its negation" : ""}</span>`,
    ].map((s) => `<div>${s}</div>`).join("");
  };
  dom.onchange = draw;
  prop.onchange = draw;
  draw();
}

// ---------- Demo 2 · Counterexample hunter ----------

const CLAIMS = [
  { label: "2ⁿ − 1 is prime for every n ≥ 2", start: 2, max: 40, test: (n) => isPrime(2n ** BigInt(n) - 1n), show: (n) => `2^${n} − 1 = ${2n ** BigInt(n) - 1n}` },
  { label: "2ᵖ − 1 is prime for every prime p", start: 2, max: 40, only: (n) => isPrime(BigInt(n)), test: (n) => isPrime(2n ** BigInt(n) - 1n), show: (n) => `p = ${n}: 2^${n} − 1 = ${2n ** BigInt(n) - 1n}` },
  { label: "n² + n + 17 is prime for every n ≥ 0", start: 0, max: 60, test: (n) => isPrime(BigInt(n * n + n + 17)), show: (n) => `${n}² + ${n} + 17 = ${n * n + n + 17}` },
  { label: "3 divides n³ − n for every n ≥ 0", start: 0, max: 200, test: (n) => (n ** 3 - n) % 3 === 0, show: (n) => `${n}³ − ${n} = ${n ** 3 - n}`, proof: "Theorem 2 proves it for every integer, with an arbitrary n." },
  { label: "8 divides n² − 1 for every odd n", start: 1, max: 200, only: (n) => n % 2 === 1, test: (n) => (n * n - 1) % 8 === 0, show: (n) => `${n}² − 1 = ${n * n - 1}`, proof: "Exercise 5 proves it: n = 2m + 1 gives n² − 1 = 4m(m + 1)." },
];

function demoHunter(el) {
  el.innerHTML = `<div class="dm-ctrl">
      <label>claim <select class="claim">${CLAIMS.map((c, i) => `<option value="${i}">${c.label}</option>`).join("")}</select></label>
      <label>search up to <input type="range" class="upto" min="5" max="60" value="12"> <b class="uv">12</b></label></div>
    <div class="q4-chips"></div><p class="dm-read"></p>`;
  const sel = el.querySelector(".claim"), upto = el.querySelector(".upto");
  const draw = () => {
    const c = CLAIMS[+sel.value];
    upto.max = c.max;
    if (+upto.value > c.max) upto.value = c.max;
    const N = +upto.value;
    el.querySelector(".uv").textContent = N;
    let found = null;
    const chips = [];
    for (let n = c.start; n <= N; n++) {
      if (c.only && !c.only(n)) continue;
      if (found !== null) { chips.push(`<span class="q4-chip skip" title="not needed">${n}</span>`); continue; }
      const ok = c.test(n);
      if (!ok) found = n;
      chips.push(`<span class="q4-chip ${ok ? "yes" : "no pick"}" title="${c.show(n)}">${n}</span>`);
    }
    el.querySelector(".q4-chips").innerHTML = chips.join("");
    el.querySelector(".dm-read").innerHTML = found !== null
      ? `Counterexample: <b>${c.show(found)}</b> is not ${c.label.includes("divides") ? "divisible" : "prime"}. One counterexample disproves the claim; the later cases (faded) are not needed.`
      : `No counterexample up to ${N}. <b>That is not a proof</b>: there are infinitely many cases.` + (c.proof ? ` ${c.proof}` : " Search further.");
  };
  sel.onchange = () => { upto.value = 12; draw(); };
  upto.oninput = draw;
  draw();
}

// ---------- Demo 3 · Locks and keys (order of quantifiers) ----------

const LOCKS0 = [[0, 1, 0, 0], [1, 0, 1, 0], [0, 0, 1, 0], [0, 1, 0, 1]];  // the note's table: row = lock, column = key

function lockReport(T) {
  const rowsOk = T.map((r) => r.some(Boolean));
  const full = [0, 1, 2, 3].filter((k) => T.every((r) => r[k]));
  return { rowsOk, full, every: rowsOk.every(Boolean), some: full.length > 0 };
}

function drawLocks(el, T, onclick) {
  const R = lockReport(T);
  const g = el.querySelector(".q4-grid");
  g.style.gridTemplateColumns = "28px repeat(4, auto)";
  let h = `<div class="h"></div>` + [1, 2, 3, 4].map((k) => `<div class="h">K${k}</div>`).join("");
  T.forEach((row, i) => {
    h += `<div class="h">L${i + 1}</div>`;
    row.forEach((v, k) => {
      const cls = ["q4-cell", v ? "on" : "", !R.rowsOk[i] ? "rowbad" : "", R.full.includes(k) ? "colgood" : "",
        !R.some && !v && T.findIndex((r) => !r[k]) === i ? "miss" : ""].join(" ");
      h += `<button class="${cls}" data-i="${i}" data-k="${k}" aria-label="key ${k + 1} opens lock ${i + 1}: ${v ? "yes" : "no"}"></button>`;
    });
  });
  g.innerHTML = h;
  if (onclick) g.querySelectorAll("button").forEach((b) => { b.onclick = () => onclick(+b.dataset.i, +b.dataset.k); });
  const bad = R.rowsOk.map((v, i) => (v ? null : `L${i + 1}`)).filter(Boolean);
  el.querySelector(".q4-lines").innerHTML = [
    `“Every lock has a key” (∀L ∃K, every row has a square): ${mark(R.every)}${R.every ? "" : ` — no key for ${bad.join(", ")} (red rows)`}`,
    `“A key opens every lock” (∃K ∀L, a full column): ${mark(R.some)}${R.some ? ` — master key K${R.full[0] + 1} (gold column)` : " — every key misses some lock (pink: the first lock each key misses)"}`,
    R.some && !R.every ? "" : R.some ? `A full column gives every row a square: ∃∀ implies ∀∃.` : R.every ? `True and false: the order of the quantifiers matters.` : "",
  ].filter(Boolean).map((s) => `<div>${s}</div>`).join("");
}

function demoLocks(el) {
  let T = LOCKS0.map((r) => r.slice());
  el.innerHTML = `<div class="q4-grid"></div><div class="dm-ctrl">
      <button class="primary master">Make K4 a master key</button><button class="reset">The note's table</button><button class="clear">Empty</button></div>
    <div class="q4-lines"></div>`;
  const redraw = () => drawLocks(el, T, (i, k) => { T[i][k] = T[i][k] ? 0 : 1; redraw(); });
  el.querySelector(".master").onclick = () => { T.forEach((r) => { r[3] = 1; }); redraw(); };
  el.querySelector(".reset").onclick = () => { T = LOCKS0.map((r) => r.slice()); redraw(); };
  el.querySelector(".clear").onclick = () => { T = LOCKS0.map((r) => r.map(() => 0)); redraw(); };
  redraw();
}

function demoLocksMini(el) {
  // One interval drives the loop (app.js clears intervals when the page changes): the note's table, then key 4
  // becomes a master key, then back.
  el.innerHTML = `<div class="q4-mini"><div class="q4-grid"></div><div class="q4-lines"></div></div>`;
  const box = el.querySelector(".q4-mini");
  let t = 0;
  const show = () => {
    const T = LOCKS0.map((r) => r.slice());
    if (t % 2 === 1) T.forEach((r) => { r[3] = 1; });
    drawLocks(box, T, null);
  };
  show();
  setInterval(() => { t++; show(); }, 2600);
}

// ---------- Demo 4 · Count two ways ----------

function demoSubsets(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>n <input type="range" class="n" min="1" max="6" value="4"> <b class="nv">4</b></label></div>
    <div class="q4-wrap"><div class="q4-sub"></div><div class="q4-stair"></div></div><p class="dm-read"></p>`;
  let pick = 0;
  const draw = () => {
    const n = +el.querySelector(".n").value;
    el.querySelector(".nv").textContent = n;
    const per = n <= 4 ? Math.min(4, 2 ** n) : 8;
    const sub = el.querySelector(".q4-sub");
    sub.style.gridTemplateColumns = `repeat(${per}, minmax(0, ${n <= 4 ? 58 : 44}px))`;
    let h = "";
    for (let i = 0; i < 2 ** n; i++) {
      const elems = [];
      for (let j = 0; j < n; j++) if ((i >> j) & 1) elems.push(j + 1);
      const k = elems.length ? elems[elems.length - 1] : 0;
      const cls = k === 0 ? "empty" : `k${k}${pick && pick !== k ? " dim" : ""}`;
      h += `<div class="${cls}" title="largest element ${k || "none"}">${k === 0 ? "∅" : n >= 5 ? elems.join("") : `{${elems.join(",")}}`}</div>`;
    }
    sub.innerHTML = h;
    const unit = 120 / 2 ** (n - 1);
    el.querySelector(".q4-stair").innerHTML = Array.from({ length: n }, (_, i) => {
      const k = i + 1;
      return `<div class="q4-col"><button class="k${k}" style="height:${Math.max(3, unit * 2 ** i)}px;opacity:${pick && pick !== k ? 0.3 : 1}" data-k="${k}" aria-label="largest element ${k}: ${2 ** i} subsets"><span>${2 ** i}</span></button><div class="lab">k=${k}</div></div>`;
    }).join("");
    el.querySelectorAll(".q4-stair button").forEach((b) => { b.onclick = () => { pick = pick === +b.dataset.k ? 0 : +b.dataset.k; draw(); }; });
    const terms = Array.from({ length: n }, (_, i) => 2 ** i);
    el.querySelector(".dm-read").innerHTML = `Left: 2<sup>${n}</sup> − 1 = ${2 ** n} − 1 = <b>${2 ** n - 1}</b> nonempty subset${n === 1 ? "" : "s"} (∅ struck). ` +
      `Right: sorted by largest element, ${terms.join(" + ")} = <b>${terms.reduce((a, b) => a + b, 0)}</b>.` +
      (n >= 5 ? " (Short labels: 124 is {1, 2, 4}.)" : "") +
      (pick ? `<br>Largest element ${pick}: {${pick}} together with any subset of {1, …, ${pick - 1}}${pick === 1 ? " (only ∅)" : ""}, so 2<sup>${pick - 1}</sup> = ${2 ** (pick - 1)} subsets.` : " Click a column to see its subsets.");
  };
  el.querySelector(".n").oninput = () => { pick = 0; draw(); };
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "What is the negation of “every lock has a key that opens it”?",
    opts: ["Every lock has a key that does not open it", "Some lock is opened by no key", "No key opens every lock"], a: 1,
    why: "¬(∀L ∃K, K opens L) ≡ ∃L ∀K, K does not open L: some lock that every key fails to open." },
  { q: "Which implication always holds?",
    opts: ["∃y ∀x P(x, y)  ⇒  ∀x ∃y P(x, y)", "∀x ∃y P(x, y)  ⇒  ∃y ∀x P(x, y)", "Both"], a: 0,
    why: "One y that works for all x works for each x. The converse fails: the lock table, or x + y = 0 over the integers." },
  { q: "Is “n = 3 works” a complete proof that there is an integer n with n² = n + 6?",
    opts: ["Yes: 3² = 9 = 3 + 6 is a witness", "No: you must also find −2", "No: you must check every integer"], a: 0,
    why: "An existential statement needs one checked witness. (−2 is a second one, not needed.)" },
  { q: "To disprove “there exists x in A with P(x)”, you need…",
    opts: ["one example where P fails", "to show P fails for every x in A", "two examples where P fails"], a: 1,
    why: "¬∃x P(x) ≡ ∀x ¬P(x): a universal statement, proved with an arbitrary element." },
  { q: "“Not every 2ⁿ − 1 (n ≥ 2) is prime. So 2ⁿ − 1 is never prime.” What is wrong?",
    opts: ["Nothing", "It negates only the property: “not every” means “some is not”, and 2² − 1 = 3 is prime", "2ⁿ − 1 is prime for every n"], a: 1,
    why: "The negation of ∀ is ∃¬ (n = 4 gives 15). “Never prime” is a different statement, and false." },
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
  locksMini: (el) => demoLocksMini(el),
  everySome: (el) => demoEverySome(el),
  hunter: (el) => demoHunter(el),
  locks: (el) => demoLocks(el),
  subsets: (el) => demoSubsets(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
