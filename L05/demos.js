// Interactive demos for DM101 Lecture 5 (relations). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L05-relations.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same properties so that the relation can be changed.

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
    .dm-fig .rc { fill: var(--card); stroke: var(--ink-2); stroke-width: 1; cursor: pointer; }
    .dm-fig .rc.on { fill: var(--teal); fill-opacity: 0.55; }
    .dm-fig .rc.inv { fill: var(--amber); fill-opacity: 0.55; }
    .dm-fig .rc.diag { stroke: var(--amber); stroke-width: 2.4; }
    .dm-fig .rc.bad { stroke: var(--red); stroke-width: 3; }
    .dm-fig .rh { fill: var(--paper-2); stroke: var(--ink-2); stroke-width: 1; }
    .dm-fig .mirror { stroke: var(--amber); stroke-width: 1.4; stroke-dasharray: 5 4; fill: none; }
    .dm-fig .big { font-size: 15px; }
    .dm-fig .nc { stroke: var(--ink-2); stroke-width: 1; fill-opacity: 0.55; }
    .dm-props { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 6px; margin: 10px 0 0; font-size: 13.5px; }
    .dm-props div { border: 1px solid var(--line); border-radius: 8px; padding: 6px 8px; background: var(--card); color: var(--ink-2); }
    .dm-props div.yes { border-color: var(--green); }
    .dm-props div.yes b { color: var(--green); }
    .dm-props div.no b { color: var(--red); }
    .dm-props small { display: block; color: var(--stone); font-size: 12px; margin-top: 2px; }
    .dm-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
    .dm-chips button { font: 600 15px var(--mono); width: 44px; height: 40px; border-radius: 8px; border: 2px solid var(--line); cursor: pointer; color: var(--ink); }
  `;
  document.head.appendChild(st);
})();

// ---------- Relations on a finite set: the five tests of section 3, with a witness when a test fails ----------

const has = (R, x, y) => R.has(`${x},${y}`);
const pairsOf = (R) => [...R].map((p) => p.split(",").map(Number));

function properties(A, R) {
  const P = pairsOf(R);
  const out = {};
  const noLoop = A.find((x) => !has(R, x, x));
  out.reflexive = noLoop === undefined ? [true, "every x R x"] : [false, `(${noLoop}, ${noLoop}) is missing`];
  const loop = A.find((x) => has(R, x, x));
  out.irreflexive = loop === undefined ? [true, "no x R x"] : [false, `(${loop}, ${loop}) is in R`];
  const asym = P.find(([x, y]) => !has(R, y, x));
  out.symmetric = !asym ? [true, "every pair has its mirror"] : [false, `(${asym[0]}, ${asym[1]}) in R, (${asym[1]}, ${asym[0]}) not`];
  const both = P.find(([x, y]) => x !== y && has(R, y, x));
  out.antisymmetric = !both ? [true, "no mirror pair off the diagonal"] : [false, `(${both[0]}, ${both[1]}) and (${both[1]}, ${both[0]}), ${both[0]} ≠ ${both[1]}`];
  let path = null;
  for (const [x, y] of P) {
    for (const [z, w] of P) if (y === z && !has(R, x, w)) { path = [x, y, w]; break; }
    if (path) break;
  }
  out.transitive = !path ? [true, "every two-step path has its shortcut"] : [false, `${path[0]} R ${path[1]}, ${path[1]} R ${path[2]}, but not ${path[0]} R ${path[2]}`];
  return out;
}

function classesOf(A, R) {
  const seen = new Set(), out = [];
  for (const a of A) {
    if (seen.has(a)) continue;
    const c = A.filter((x) => has(R, x, a));
    c.forEach((x) => seen.add(x));
    out.push(c);
  }
  return out;
}

const relFrom = (A, test) => new Set(A.flatMap((x) => A.filter((y) => test(x, y)).map((y) => `${x},${y}`)));
const SET4 = [1, 2, 3, 4];
const PRESETS = [
  ["x ≤ y", (x, y) => x <= y],
  ["x < y", (x, y) => x < y],
  ["x = y", (x, y) => x === y],
  ["neighbours |x − y| = 1", (x, y) => Math.abs(x - y) === 1],
  ["same parity", (x, y) => (x - y) % 2 === 0],
  ["{(1,2), (2,1), (1,3)}", (x, y) => ["1,2", "2,1", "1,3"].includes(`${x},${y}`)],
  ["only (1,1)", (x, y) => x === 1 && y === 1],
  ["empty", () => false],
];
const PROP_NAMES = ["reflexive", "irreflexive", "symmetric", "antisymmetric", "transitive"];

// Demo 1 (and the hero, and Demo 2 with the mirror): a clickable 4 x 4 grid, row x, column y.
function demoRelation(el, opts = {}) {
  const A = SET4;
  const mini = !!opts.mini, mirrorMode = !!opts.mirror;
  el.innerHTML = `<div class="fig"></div>${mini ? "" : `<div class="dm-ctrl">
      <label>preset <select class="pre">${PRESETS.map(([n], i) => `<option value="${i}">${n}</option>`).join("")}</select></label>
      ${mirrorMode ? `<button class="primary flip">Mirror: show R⁻¹</button>` : ""}<button class="clr">Clear</button></div>`}
      <div class="dm-props"></div><p class="dm-read"></p>`;
  const S = 300, cell = 56, x0 = 50, y0 = 40;
  const g = svg(el.querySelector(".fig"), S, S, "The grid of a relation on {1, 2, 3, 4}: row x, column y, shaded when x R y");
  let R = relFrom(A, PRESETS[mirrorMode ? 0 : 0][1]), name = PRESETS[0][0], flipped = false, k = 0;
  const draw = () => {
    g.clear();
    g.text(x0 - 22, y0 - 12, "x \\ y", "ink");
    A.forEach((v, i) => {
      g.add("rect", { x: x0 + i * cell, y: y0 - 30, width: cell, height: 26, class: "rh" });
      g.text(x0 + i * cell + cell / 2, y0 - 12, String(v), "ink big");
      g.add("rect", { x: x0 - 40, y: y0 + i * cell, width: 36, height: cell, class: "rh" });
      g.text(x0 - 22, y0 + i * cell + cell / 2 + 5, String(v), "ink big");
    });
    const show = flipped ? new Set(pairsOf(R).map(([x, y]) => `${y},${x}`)) : R;
    A.forEach((x, i) => A.forEach((y, j) => {
      const on = show.has(`${x},${y}`);
      const r = g.add("rect", { x: x0 + j * cell, y: y0 + i * cell, width: cell, height: cell,
        class: `rc${on ? (flipped ? " inv" : " on") : ""}${i === j ? " diag" : ""}` });
      if (!mini) r.onclick = () => {
        if (flipped) return;
        const key = `${x},${y}`;
        if (R.has(key)) R.delete(key); else R.add(key);
        name = "your relation";
        draw();
      };
    }));
    if (mirrorMode) g.add("line", { x1: x0, y1: y0, x2: x0 + 4 * cell, y2: y0 + 4 * cell, class: "mirror" });
    const pr = properties(A, R);
    el.querySelector(".dm-props").innerHTML = PROP_NAMES.map((p) =>
      `<div class="${pr[p][0] ? "yes" : "no"}"><b>${pr[p][0] ? "✓" : "✗"} ${p}</b>${mini ? "" : `<small>${pr[p][1]}</small>`}</div>`).join("");
    const eq = pr.reflexive[0] && pr.symmetric[0] && pr.transitive[0];
    const inv = new Set(pairsOf(R).map(([x, y]) => `${y},${x}`));
    const same = inv.size === R.size && [...R].every((p) => inv.has(p));
    let msg = `<b>${name}</b>: ${R.size} pair${R.size === 1 ? "" : "s"}. ` +
      (eq ? `An <b>equivalence relation</b>; classes ${classesOf(A, R).map((c) => `{${c.join(", ")}}`).join(", ")}.` : "Not an equivalence relation.");
    if (mirrorMode) msg += flipped ? `<br>Showing <b>R⁻¹</b> (amber): every pair swapped, the grid mirrored in the diagonal. R = R⁻¹: <b>${same ? "yes" : "no"}</b>, so R is ${same ? "" : "not "}symmetric (Theorem 1).`
      : `<br>Press <b>Mirror</b> to swap every pair.`;
    el.querySelector(".dm-read").innerHTML = mini ? `<b>${name}</b>` : msg;
  };
  if (mini) {
    setInterval(() => { k = (k + 1) % 5; R = relFrom(A, PRESETS[k][1]); name = PRESETS[k][0]; draw(); }, 2600);
  } else {
    const pre = el.querySelector(".pre");
    pre.onchange = () => { const [n, t] = PRESETS[+pre.value]; R = relFrom(A, t); name = n; flipped = false; if (flip) flip.textContent = "Mirror: show R⁻¹"; draw(); };
    el.querySelector(".clr").onclick = () => { R = new Set(); name = "empty"; flipped = false; if (flip) flip.textContent = "Mirror: show R⁻¹"; draw(); };
    const flip = el.querySelector(".flip");
    if (flip) flip.onclick = () => { flipped = !flipped; flip.textContent = flipped ? "Back to R" : "Mirror: show R⁻¹"; draw(); };
  }
  draw();
}

// ---------- Demo 3 · Classes mod n: the numbers in rows of n, one column per class ----------

const mod = (a, n) => ((a % n) + n) % n;
const hue = (r, n) => `hsl(${Math.round((r * 360) / n + 190) % 360}, 55%, 52%)`;

function demoMod(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <label>n <input type="range" min="2" max="9" value="3" class="n"> <b class="nv">3</b></label>
      <label>a <input type="number" class="a" min="-99" max="99" value="-4"></label>
      <label>b <input type="number" class="b" min="-99" max="99" value="2"></label></div><p class="dm-read"></p>`;
  const holder = el.querySelector(".fig");
  const draw = () => {
    holder.innerHTML = "";
    const n = +el.querySelector(".n").value;
    el.querySelector(".nv").textContent = n;
    const num = (sel, d) => { const v = Math.round(+el.querySelector(sel).value); return Number.isFinite(v) ? Math.max(-99, Math.min(99, v)) : d; };
    const a = num(".a", -4), b = num(".b", 2);
    const rows = 4, c = Math.min(52, Math.floor(420 / n)), W = n * c + 20, H = rows * c + 34;
    const g = svg(holder, W, H, `The numbers 0 to ${rows * n - 1} in rows of ${n}; each column is one class mod ${n}`);
    for (let r = 0; r < n; r++) g.text(10 + r * c + c / 2, 16, `[${r}]`, "ink");
    for (let i = 0; i < rows * n; i++) {
      const row = Math.floor(i / n), col = i % n;
      const hit = col === mod(a, n);
      g.add("rect", { x: 10 + col * c, y: 24 + row * c, width: c, height: c, class: "nc", fill: hue(col, n),
        "stroke-width": hit ? 3 : 1, style: hit ? "stroke: var(--ink)" : "" });
      g.text(10 + col * c + c / 2, 24 + row * c + c / 2 + 5, String(i), "ink big");
    }
    const d = a - b, cong = mod(d, n) === 0;
    const list = Array.from({ length: 7 }, (_, j) => mod(a, n) + (j - 2) * n);
    el.querySelector(".dm-read").innerHTML =
      `${a} − ${b < 0 ? `(${b})` : b} = ${d}` + (cong ? ` = ${n} · ${d / n < 0 ? `(${d / n})` : d / n}, so <b>${a} ≡ ${b} (mod ${n})</b>: same class.` : `, not a multiple of ${n}, so ${a} ≢ ${b} (mod ${n}): different classes.`) +
      `<br>The class of ${a} is [${mod(a, n)}] = {…, ${list.join(", ")}, …} (outlined column). The ${n} columns never overlap and together hold every integer: a partition.`;
  };
  el.querySelectorAll("input").forEach((i) => { i.oninput = draw; });
  draw();
}

// ---------- Demo 4 · A partition gives an equivalence relation ----------

function bell(n) {
  // Number of partitions of an n-element set (row by row of the Bell triangle).
  let row = [1];
  for (let i = 1; i < n; i++) {
    const next = [row[row.length - 1]];
    for (const v of row) next.push(next[next.length - 1] + v);
    row = next;
  }
  return row[row.length - 1];
}

function demoPartition(el) {
  const N = 6, COLORS = ["var(--teal)", "var(--amber)", "var(--red)", "var(--green)"];
  let part = [0, 1, 1, 0, 2, 1]; // {1,4}, {2,3,6}, {5}: section 7 of the note
  el.innerHTML = `<p class="dm-read" style="margin-top:0">Click a number to move it to the next part.</p><div class="dm-chips"></div>
    <div class="fig"></div><div class="dm-ctrl"><label><input type="checkbox" class="sort" checked> list the elements part by part</label></div><p class="dm-read out"></p>`;
  const chips = el.querySelector(".dm-chips"), holder = el.querySelector(".fig");
  const draw = () => {
    chips.innerHTML = "";
    for (let i = 0; i < N; i++) {
      const b = document.createElement("button");
      b.textContent = i + 1;
      b.style.background = `color-mix(in srgb, ${COLORS[part[i]]} 35%, var(--card))`;
      b.style.borderColor = COLORS[part[i]];
      b.onclick = () => { part[i] = (part[i] + 1) % COLORS.length; draw(); };
      chips.appendChild(b);
    }
    const used = [...new Set(part)].sort();
    const parts = used.map((p) => part.map((q, i) => (q === p ? i + 1 : 0)).filter(Boolean));
    const order = el.querySelector(".sort").checked ? parts.flat() : Array.from({ length: N }, (_, i) => i + 1);
    holder.innerHTML = "";
    const c = 40, x0 = 30, y0 = 28, S = x0 + N * c + 4;
    const g = svg(holder, S, S, "The grid of the relation 'in the same part'");
    let pairs = 0;
    order.forEach((v, i) => {
      g.text(x0 + i * c + c / 2, y0 - 9, String(v), "ink big");
      g.text(x0 - 14, y0 + i * c + c / 2 + 5, String(v), "ink big");
    });
    order.forEach((x, i) => order.forEach((y, j) => {
      const same = part[x - 1] === part[y - 1];
      if (same) pairs++;
      g.add("rect", { x: x0 + j * c, y: y0 + i * c, width: c, height: c, class: "nc",
        fill: same ? COLORS[part[x - 1]] : "var(--card)" });
    }));
    const sq = parts.map((p) => p.length);
    el.querySelector(".out").innerHTML = `Parts: ${parts.map((p) => `{${p.join(", ")}}`).join(", ")}. ` +
      `"Same part" has <b>${sq.map((s) => `${s}²`).join(" + ")} = ${pairs}</b> pairs; it is reflexive, symmetric and transitive, and its classes are the parts. ` +
      `A set with ${N} elements has ${bell(N)} partitions (4 elements: ${bell(4)}), one for each equivalence relation.`;
  };
  el.querySelector(".sort").onchange = draw;
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "In rock, paper, scissors, which properties does “beats” have?",
    opts: ["Reflexive and transitive", "Irreflexive and antisymmetric only", "Symmetric and transitive"], a: 1,
    why: "Nothing beats itself and no two moves beat each other; rock beats scissors and scissors beats paper, but rock does not beat paper, so it is not transitive." },
  { q: "A grid on {1, 2, 3} has its whole diagonal marked and is its own mirror image. Which property can the grid NOT show at a glance?",
    opts: ["Reflexive", "Symmetric", "Transitive"], a: 2,
    why: "Diagonal → reflexive, mirror → symmetric. Transitivity needs every two-step path x R y, y R z to be checked for its shortcut x R z." },
  { q: "True or false: a relation that is not symmetric is antisymmetric.",
    opts: ["True", "False"], a: 1,
    why: "{(1,2), (2,1), (1,3)} on {1, 2, 3} is neither: (1,3) has no mirror, and (1,2), (2,1) are a mirror pair." },
  { q: "Which class of congruence mod 5 contains −3?",
    opts: ["[2]", "[3]", "[−3], a class of its own"], a: 0,
    why: "−3 − 2 = −5 = 5 · (−1), so −3 ≡ 2 (mod 5)." },
  { q: "“[2] and [5] mod 3 are different classes, because 2 ≠ 5.” Is that right?",
    opts: ["Yes", "No: 2 ≡ 5 (mod 3), so [2] = [5]"], a: 1,
    why: "A class has many names. Two names give the same class exactly when the elements are related (Theorem 3)." },
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
  relMini: (el) => demoRelation(el, { mini: true }),
  relation: (el) => demoRelation(el),
  mirror: (el) => demoRelation(el, { mirror: true }),
  classes: (el) => demoMod(el),
  partition: (el) => demoPartition(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
