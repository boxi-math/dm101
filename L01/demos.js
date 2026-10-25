// Interactive demos for DM101 Lecture 1 (definitions). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L01-definitions.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same definitions so that the inputs can be changed.

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
  const size = (w2, h2) => { s.setAttribute("viewBox", `0 0 ${w2} ${h2}`); };
  return { s, add, text, clear, size };
}

// Lecture-only styles (the shared style.css is not ours to edit).
(() => {
  const st = document.createElement("style");
  st.textContent = `
    .dm-fig .hollow { fill: none; stroke: var(--line); stroke-width: 1.4; stroke-dasharray: 3 2; }
    .dm-fig text.small { font-size: 10px; }
    .dm-ctrl input[type="text"] { font: inherit; padding: 3px 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); width: 140px; }
    .dm-sets { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .dm-sets span { padding: 4px 12px; border-radius: 999px; border: 1px solid var(--line); font-size: 14px; color: var(--ink-2); }
    .dm-sets span.in { background: var(--teal); border-color: var(--teal); color: var(--paper); }
  `;
  document.head.appendChild(st);
})();

// ---------- The definitions, as in the note (search for the promised integer) ----------

const divides = (b, a) => (a === 0 ? true : b !== 0 && Number.isInteger(a / b));
const isEven = (a) => divides(2, a);
const isOdd = (a) => Number.isInteger((a - 1) / 2);
const isPrime = (p) => {
  if (p <= 1) return false;
  for (let d = 2; d * d <= p; d++) if (p % d === 0) return false;
  return true;
};
const isComposite = (a) => { for (let b = 2; b < a; b++) if (a % b === 0) return true; return false; };
const isSquare = (n) => Number.isInteger(Math.round(Math.sqrt(n))) && Math.round(Math.sqrt(n)) ** 2 === n;
const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));

const DEFS = {
  even: { label: "even", cat: () => true, test: isEven,
    why: (a) => (isEven(a) ? `${a} = 2 · ${a / 2}` : `${a} = 2 · ${(a - 1) / 2} + 1, not 2c`) },
  odd: { label: "odd", cat: () => true, test: isOdd,
    why: (a) => (isOdd(a) ? `${a} = 2 · ${(a - 1) / 2} + 1` : `${a} = 2 · ${a / 2}, no k fits`) },
  prime: { label: "prime", cat: (a) => a > 0, catText: "positive integers", test: isPrime },
  composite: { label: "composite", cat: (a) => a > 0, catText: "positive integers", test: isComposite },
  square: { label: "perfect square", cat: (a) => a > 0, catText: "positive integers", test: isSquare },
  div: { label: "divisible by b", cat: () => true, test: null },
};

// ---------- Demo 1 · A definition sorts ----------

function demoSorter(el, opts = {}) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="fig"></div>${mini ? "" : `<div class="dm-ctrl">
      <label>definition <select class="def">${Object.entries(DEFS).map(([k, d]) => `<option value="${k}">${d.label}</option>`).join("")}</select></label>
      <label class="bwrap">b <input type="number" class="b" value="3" min="-12" max="12"></label>
      <label>from <input type="number" class="lo" value="-5" min="-50" max="80"></label>
      <label>to <input type="number" class="hi" value="14" min="-50" max="99"></label></div>`}<p class="dm-read"></p>`;
  const W = 640, H = 120;
  const g = svg(el.querySelector(".fig"), W, H, "Integers in a row: those the definition accepts are coloured, the rest grey");
  const read = el.querySelector(".dm-read");
  const draw = (key, lo, hi, b) => {
    g.clear();
    const d = DEFS[key];
    const nums = [];
    for (let a = lo; a <= hi && nums.length < 20; a++) nums.push(a);
    const step = (W - 40) / Math.max(nums.length, 1);
    const yes = [], no = [], out = [];
    nums.forEach((a, i) => {
      const x = 20 + step * (i + 0.5);
      let cls;
      if (!d.cat(a)) { cls = "hollow"; out.push(a); }
      else {
        const ok = key === "div" ? divides(b, a) : d.test(a);
        cls = ok ? (key === "odd" ? "B" : "A") : "DIM";
        (ok ? yes : no).push(a);
      }
      g.add("circle", { cx: x, cy: 50, r: Math.min(12, step * 0.36), class: cls });
      g.text(x, 88, String(a), nums.length > 16 ? "ink small" : "ink");
    });
    if (mini) { read.innerHTML = `<b>${d.label}</b>: ${yes.join(", ")}`; return; }
    const name = key === "div" ? `divisible by ${b}` : d.label;
    read.innerHTML = `<b>${name}: yes</b> ${yes.join(", ") || "none"}<br><b>no</b> ${no.join(", ") || "none"}` +
      (out.length ? `<br>Outside the category (${d.catText}): ${out.join(", ")}. The definition does not apply to them, so they are not ${d.label}s.` : "") +
      (key === "div" && b === 0 ? "<br>With b = 0 only a = 0 passes: 0 · c = 0 for every c, so 0 | 0 but 0 ∤ 5." : "") +
      (key === "even" || key === "odd" ? `<br>For example ${nums.filter((a) => a < 0).slice(-1).map(d.why).join("")}.` : "");
  };
  if (mini) {
    const keys = ["even", "odd", "prime", "square"];
    let t = 0;
    draw(keys[0], -5, 14, 3);
    setInterval(() => { t = (t + 1) % keys.length; draw(keys[t], -5, 14, 3); }, 1800);
    return;
  }
  const q = (s) => el.querySelector(s);
  const update = () => {
    const key = q(".def").value;
    q(".bwrap").style.display = key === "div" ? "" : "none";
    let lo = Math.round(+q(".lo").value), hi = Math.round(+q(".hi").value);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo) { read.textContent = "Choose a range with from ≤ to."; g.clear(); return; }
    if (hi - lo > 19) hi = lo + 19;
    draw(key, lo, hi, Math.round(+q(".b").value) || 0);
    if (+q(".hi").value - lo > 19) read.innerHTML += `<br><small>Showing 20 numbers, ${lo} … ${hi}.</small>`;
  };
  el.querySelectorAll("input, select").forEach((i) => { i.oninput = update; i.onchange = update; });
  update();
}

// ---------- Demo 2 · Which sets? ----------

function parseNumber(raw) {
  // Returns {num, den} (exact, den > 0) for integers, fractions, decimals and repeating decimals like 0.(27),
  // or {irr: name} for a few well-known irrationals, or null.
  const s = raw.replace(/\s+/g, "").replace("−", "-");
  if (/^(sqrt\(?2\)?|√2|pi|π|e)$/i.test(s)) return { irr: s };
  let m = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (m) {
    const a = +m[1], b = +m[2];
    if (b === 0) return { zero: true };
    const g0 = gcd(a, b) || 1, sign = b < 0 ? -1 : 1;
    return { num: (sign * a) / g0, den: Math.abs(b) / g0, shown: `${a}/${b}` };
  }
  m = s.match(/^(-?)(\d*)(?:\.(\d*)(?:\((\d+)\))?)?$/);
  if (!m || (m[2] === "" && !m[3] && !m[4])) return null;
  const sign = m[1] ? -1 : 1, I = m[2] || "0", N = m[3] || "", R = m[4] || "";
  let num, den;
  if (R) {
    den = 10 ** N.length * (10 ** R.length - 1);
    num = +(I + N + R) - +(I + N);
  } else {
    den = 10 ** N.length;
    num = +(I + N);
  }
  if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) return null;
  const g0 = gcd(num, den) || 1;
  return { num: (sign * num) / g0, den: den / g0 };
}

function demoSets(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>number <input type="text" class="x" value="-12/4"></label>
      ${["0.375", "-12/4", "4/12", "7", "0.(27)", "sqrt2"].map((v) => `<button class="ex" data-v="${v}">${v}</button>`).join("")}</div>
      <div class="dm-sets"><span data-s="N">ℕ</span><span data-s="Z">ℤ</span><span data-s="Q">ℚ</span><span data-s="R">ℝ</span></div><p class="dm-read"></p>`;
  const read = el.querySelector(".dm-read");
  const mark = (ins) => el.querySelectorAll(".dm-sets span").forEach((sp) => sp.classList.toggle("in", ins.includes(sp.dataset.s)));
  const update = () => {
    const p = parseNumber(el.querySelector(".x").value);
    if (!p) { mark([]); read.textContent = "Type an integer, a fraction a/b, a decimal, a repeating decimal like 0.(27), or sqrt2."; return; }
    if (p.zero) { mark([]); read.innerHTML = "A fraction with 0 at the bottom is not a number: \\(\\mathbb Q\\) asks for \\(b \\neq 0\\)."; renderMath(read); return; }
    if (p.irr) {
      mark(["R"]);
      read.innerHTML = `${p.irr} is a real number but <b>not rational</b>: no fraction of integers equals it (for \\(\\sqrt2\\), Lecture 6 proves it). A decimal on a computer is only an approximation.`;
      renderMath(read);
      return;
    }
    const ins = ["R", "Q"];
    if (p.den === 1) ins.push("Z");
    if (p.den === 1 && p.num >= 0) ins.push("N");
    mark(ins);
    const frac = `\\(\\frac{${p.num}}{${p.den}}\\)`;
    read.innerHTML = p.den === 1
      ? `It equals the integer <b>${p.num}</b> = ${frac}: in \\(\\mathbb Z\\)${p.num >= 0 ? ", and in \\(\\mathbb N\\) (0 counts in this course)" : " but not in \\(\\mathbb N\\) (negative)"}, so also in \\(\\mathbb Q\\) and \\(\\mathbb R\\).`
      : `In lowest terms it is ${frac}: a fraction of integers with nonzero bottom, so it is in \\(\\mathbb Q\\) and \\(\\mathbb R\\), but not an integer.`;
    renderMath(read);
  };
  el.querySelector(".x").oninput = update;
  el.querySelectorAll(".ex").forEach((btn) => { btn.onclick = () => { el.querySelector(".x").value = btn.dataset.v; update(); }; });
  update();
}

function renderMath(node) {
  if (window.renderMathInElement) {
    renderMathInElement(node, { delimiters: [{ left: "\\(", right: "\\)", display: false }], throwOnError: false });
  }
}

// ---------- Demo 3 · Equal rows ----------

function demoRows(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>a <input type="range" class="a" min="1" max="60" value="40"> <b class="av">40</b></label>
      <label>b rows <input type="range" class="b" min="1" max="12" value="6"> <b class="bv">6</b></label></div><p class="dm-read"></p>`;
  const W = 620, P = 26;
  const g = svg(el.querySelector(".fig"), W, 330, "a dots laid out in b equal rows, with the leftover dots highlighted");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    const a = +el.querySelector(".a").value, b = +el.querySelector(".b").value;
    el.querySelector(".av").textContent = a;
    el.querySelector(".bv").textContent = b;
    g.clear();
    const q = Math.floor(a / b), r = a - b * q;
    const cols = q + (r ? 1 : 0);
    const p = Math.min(P, (W - 20) / Math.max(cols, 1));
    const H = Math.max(80, b * p + 20);
    g.size(W, H);
    g.s.style.maxWidth = `${W}px`;
    for (let i = 0; i < b; i++) {
      for (let j = 0; j < cols; j++) {
        const cx = 10 + j * p + p / 2, cy = 10 + i * p + p / 2;
        if (j < q) g.add("circle", { cx, cy, r: p * 0.36, class: "A" });
        else if (i < r) g.add("circle", { cx, cy, r: p * 0.36, class: "HL" });
        else g.add("circle", { cx, cy, r: p * 0.3, class: "hollow" });
      }
    }
    if (r === 0) {
      read.innerHTML = `${a} = ${b} · <b>${q}</b>, and ${q} is an integer: <b>${b} | ${a}</b>. ${b} rows of ${q}.` +
        (b === 2 ? " Two equal rows: " + a + " is <b>even</b>." : "");
    } else {
      const g0 = gcd(a, b);
      read.innerHTML = `${b} full rows of ${q} use ${b * q} dots; <b>${r} left over</b> (red), ${b - r} ${b - r === 1 ? "place" : "places"} empty. ` +
        `${b} · c = ${a} needs c = ${a / g0}/${b / g0}, not an integer: <b>${b} ∤ ${a}</b>.` +
        (b === 2 ? ` Two rows and one dot over: ${a} = 2 · ${q} + 1 is <b>odd</b>.` : "");
    }
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  draw();
}

// ---------- Demo 4 · Odd times odd ----------

function demoOddProduct(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>x <input type="range" class="x" min="0" max="6" value="2"> <b class="xv">2</b></label>
      <label>y <input type="range" class="y" min="0" max="6" value="3"> <b class="yv">3</b></label></div><p class="dm-read"></p>`;
  const W = 420, P = 26;
  const g = svg(el.querySelector(".fig"), W, 360, "A (2x+1) by (2y+1) rectangle of dots: all pair up except one");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    const x = +el.querySelector(".x").value, y = +el.querySelector(".y").value;
    el.querySelector(".xv").textContent = x;
    el.querySelector(".yv").textContent = y;
    const R = 2 * x + 1, C = 2 * y + 1;
    g.clear();
    const p = Math.min(P, (W - 20) / C);
    g.size(W, R * p + 20);
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        const lone = i === R - 1 && j === C - 1;
        const cls = lone ? "HL" : i < R - 1 ? "B" : "A";
        g.add("circle", { cx: 10 + j * p + p / 2, cy: 10 + i * p + p / 2, r: p * 0.36, class: cls });
      }
    }
    const k = 2 * x * y + x + y;
    read.innerHTML = `(2·${x} + 1)(2·${y} + 1) = ${R} · ${C} = <b>${R * C}</b>. The first ${2 * x} rows (amber) hold ${2 * x * C} dots, which pair up; ` +
      `the last row has ${y} pairs (teal) and <b>one dot over</b> (red). So ${R * C} = 2 · ${k} + 1 with k = 2xy + x + y = ${k}: odd.`;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  draw();
}

// ---------- Demo 5 · Every rectangle of n dots ----------

function demoRects(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>n <input type="range" class="n" min="1" max="100" value="12"> <b class="nv">12</b></label>
      ${[1, 12, 13, 91].map((v) => `<button class="ex" data-v="${v}">${v}</button>`).join("")}</div><p class="dm-read"></p>`;
  const W = 620;
  const g = svg(el.querySelector(".fig"), W, 200, "Every way to lay out n dots as a rectangle with b rows and c columns, b ≤ c");
  const read = el.querySelector(".dm-read");
  const input = el.querySelector(".n");
  const draw = () => {
    const n = +input.value;
    el.querySelector(".nv").textContent = n;
    g.clear();
    const pairs = [];
    for (let b = 1; b * b <= n; b++) if (n % b === 0) pairs.push([b, n / b]);
    let y = 8;
    pairs.forEach(([b, c]) => {
      const p = Math.min(16, (W - 90) / c);
      const cls = b === 1 ? (isPrime(n) ? "HL" : "DIM") : "B";
      g.text(30, y + (b * p) / 2 + 4, `${b} × ${c}`);
      for (let i = 0; i < b; i++) {
        for (let j = 0; j < c; j++) g.add("circle", { cx: 70 + j * p + p / 2, cy: y + i * p + p / 2, r: Math.max(1.2, p * 0.36), class: cls });
      }
      y += b * p + 12;
    });
    g.size(W, y);
    const divs = [];
    for (let d = 1; d <= n; d++) if (n % d === 0) divs.push(d);
    let verdict;
    if (n === 1) verdict = "<b>1 is neither</b>: not prime (the definition asks p > 1) and not composite (no b with 1 < b < 1).";
    else if (isPrime(n)) verdict = `Only the single row: <b>${n} is prime</b>.`;
    else {
      const b = divs[1];
      verdict = `b = ${b} has 1 < ${b} < ${n} and ${b} | ${n}: <b>${n} is composite</b>` + (n % 2 && n % 3 && n % 5 ? " (odd, not a multiple of 3 or 5, and still composite)." : ".");
    }
    read.innerHTML = `Positive divisors of ${n}: ${divs.join(", ")}. ${verdict}`;
  };
  input.oninput = draw;
  el.querySelectorAll(".ex").forEach((btn) => { btn.onclick = () => { input.value = btn.dataset.v; draw(); }; });
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Which of these is true by our definitions?",
    opts: ["0 is not even", "0 | 0 is true", "0 | 7 is true"], a: 1,
    why: "0 = 0 · 0, so 0 | 0. But 0 · c = 0 ≠ 7 for every c, so 0 ∤ 7. And 0 = 2 · 0 is even." },
  { q: "“5 | 35” is …",
    opts: ["the number 7", "a sentence, and it is true", "a sentence, and it is false"], a: 1,
    why: "b | a is a statement: 35 = 5 · 7, so it is true. The number 7 is 35 / 5." },
  { q: "“91 is prime, because it is odd and not divisible by 3 or 5.” What is wrong?",
    opts: ["Nothing", "91 = 7 · 13, so it is composite", "91 is even"], a: 1,
    why: "Being odd and avoiding 3 and 5 is not the definition of prime. 7 | 91 with 1 < 7 < 91." },
  { q: "Is “a number is small provided it is less than most numbers” a good definition?",
    opts: ["Yes", "No: no category, and the condition is ambiguous"], a: 1,
    why: "“Number” of which kind? And “most numbers” has no meaning for an infinite set, so the test cannot be run." },
  { q: "Which statement is true?",
    opts: ["Every rational number is an integer", "Every integer is a rational number", "Both"], a: 1,
    why: "a = a/1, so every integer is rational. 1/2 is rational and not an integer." },
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
  sorterMini: (el) => demoSorter(el, { mini: true }),
  sorter: (el) => demoSorter(el),
  sets: (el) => demoSets(el),
  rows: (el) => demoRows(el),
  oddProduct: (el) => demoOddProduct(el),
  rects: (el) => demoRects(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
