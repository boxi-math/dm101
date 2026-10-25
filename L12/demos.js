// Interactive demos for DM101 Lecture 12 (graphs). CODE and OUT come from extras.js, which
// dm101/tools/site_build.py writes from the {.python #name} blocks of notes/L12-graphs.md (checked by
// tools/check.py), so every code panel and output on the page is the one that was run. The JS below recomputes the
// same numbers (degrees, the handshake sum, cliques and independent sets) so that the graph can be changed.

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + (OUT[name] !== undefined ? codeBlock(OUT[name], "out") : "");

const SVGNS = "http://www.w3.org/2000/svg";

// Lecture-only styles (vertex discs, edges, badges).
(() => {
  const css = `
  .dm-fig.gr { max-width: 460px; touch-action: manipulation; }
  .dm-fig .edge { stroke: var(--ink-2); stroke-width: 2.6; fill: none; }
  .dm-fig .edge.A { stroke: var(--teal); stroke-width: 3.6; }
  .dm-fig .edge.B { stroke: var(--amber); stroke-width: 3.6; }
  .dm-fig .edge.HL { stroke: var(--red); stroke-width: 3.6; }
  .dm-fig .edge.ghost { stroke: var(--line); stroke-width: 2; stroke-dasharray: 5 4; }
  .dm-fig .hit { stroke: transparent; stroke-width: 16; fill: none; cursor: pointer; }
  .dm-fig .vx { fill: var(--card); stroke: var(--ink-2); stroke-width: 2; cursor: pointer; }
  .dm-fig .vx.A { fill: var(--teal); stroke: var(--teal); }
  .dm-fig .vx.B { fill: var(--amber); stroke: var(--amber); }
  .dm-fig .vx.HL { fill: var(--red); stroke: var(--red); }
  .dm-fig .vx.DIM { fill: var(--paper); stroke: var(--line); stroke-dasharray: 4 3; }
  .dm-fig .vx.pick { stroke-width: 4; }
  .dm-fig text.vl { font-size: 15px; font-style: italic; fill: var(--ink); dominant-baseline: central; pointer-events: none; }
  .dm-fig text.vl.on { fill: var(--paper); }
  .dm-fig text.badge { font-size: 13px; fill: var(--amber); font-weight: 700; dominant-baseline: central; }
  .dm-fig .tick { fill: var(--red); stroke: none; }
  .dm-ctrl .chip { font-size: 13px; padding: 4px 10px; border-radius: 7px; border: 1px solid var(--line); background: var(--paper); cursor: pointer; }
  .dm-ctrl input.dl { width: 150px; font: inherit; padding: 3px 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); }
  .dm-read .A { color: var(--teal); } .dm-read .B { color: var(--amber); } .dm-read .HL { color: var(--red); }
  `;
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();

function svg(el, w, h, label, cls = "") {
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${h}`);
  s.setAttribute("class", `dm-fig ${cls}`);
  s.setAttribute("role", "img");
  s.setAttribute("aria-label", label);
  el.appendChild(s);
  const add = (tag, attrs, parent = s) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  };
  const text = (x, y, t, cls2 = "ink") => { const n = add("text", { x, y, class: cls2 }); n.textContent = t; return n; };
  const clear = () => { while (s.firstChild) s.removeChild(s.firstChild); };
  return { s, add, text, clear };
}

// ---------- graphs ----------

const key = (u, v) => [u, v].sort().join("");
// The exam graph of the note, drawn in the same place as in the videos.
const EXAM_POS = { a: [-3, 0], b: [-1.4, 1.9], c: [-1.4, -1.9], d: [1.2, 1.9], e: [1.2, -1.9], f: [3.2, 0] };
const EXAM_EDGES = ["ab", "ac", "bc", "bd", "cd", "ce", "de", "ef"];

function examGraph() {
  return { V: Object.keys(EXAM_POS), pos: { ...EXAM_POS }, E: new Set(EXAM_EDGES) };
}

function circleGraph(n, edges, labels) {
  const V = labels || Array.from({ length: n }, (_, i) => String(i + 1));
  const pos = {};
  V.forEach((v, i) => {
    const t = Math.PI / 2 + (2 * Math.PI * i) / n;
    pos[v] = [2.4 * Math.cos(t), 2.1 * Math.sin(t)];
  });
  return { V, pos, E: new Set(edges.map(([u, v]) => key(V[u], V[v]))) };
}

const nbhd = (g, v) => g.V.filter((u) => u !== v && g.E.has(key(u, v)));
const degree = (g, v) => nbhd(g, v).length;

function* subsets(arr, r, start = 0, acc = []) {
  if (acc.length === r) { yield acc.slice(); return; }
  for (let i = start; i < arr.length; i++) { acc.push(arr[i]); yield* subsets(arr, r, i + 1, acc); acc.pop(); }
}
const pairs = (S) => [...subsets(S, 2)];
const isClique = (g, S) => pairs(S).every(([u, v]) => g.E.has(key(u, v)));
const isIndependent = (g, S) => pairs(S).every(([u, v]) => !g.E.has(key(u, v)));

function largest(g, test) {
  for (let r = g.V.length; r >= 1; r--) {
    const found = [...subsets(g.V, r)].filter((S) => test(g, S));
    if (found.length) return { size: r, sets: found };
  }
  return { size: 0, sets: [] };
}

const X = (p) => 230 + 52 * p[0];
const Y = (p) => 150 - 52 * p[1];

// Draws g. opts: vclass(v), eclass(k) ("" = normal, "ghost", "A"...; null = not drawn), onV(v), onE(k), badge(v), ghostEdges.
function drawGraph(f, g, opts = {}) {
  f.clear();
  const edgeKeys = opts.edgeKeys ? opts.edgeKeys() : [...g.E];
  for (const k of edgeKeys) {
    const cls = opts.eclass ? opts.eclass(k) : "";
    if (cls === null) continue;
    const [u, v] = k.split("");
    const a = g.pos[u], b = g.pos[v];
    f.add("line", { x1: X(a), y1: Y(a), x2: X(b), y2: Y(b), class: `edge ${cls}` });
    if (opts.onE) {
      const hit = f.add("line", { x1: X(a), y1: Y(a), x2: X(b), y2: Y(b), class: "hit" });
      hit.addEventListener("click", () => opts.onE(k));
    }
  }
  if (opts.extra) opts.extra(f);
  for (const v of g.V) {
    const p = g.pos[v], cls = opts.vclass ? opts.vclass(v) : "";
    const c = f.add("circle", { cx: X(p), cy: Y(p), r: 17, class: `vx ${cls}` });
    f.text(X(p), Y(p), v, `vl ${/\b(A|B|HL)\b/.test(cls) ? "on" : ""}`);
    if (opts.onV) c.addEventListener("click", () => opts.onV(v));
    if (opts.badge) {
      const len = Math.hypot(p[0], p[1]) || 1;
      f.text(X(p) + (30 * p[0]) / len, Y(p) - (30 * p[1]) / len + (p[1] === 0 ? 0 : 0), String(opts.badge(v)), "badge");
    }
  }
}

// ---------- Hero · the handshake lemma, one edge at a time ----------

function demoHandshakeMini(el) {
  el.innerHTML = `<div class="fig"></div><p class="dm-read"></p>`;
  const g = examGraph();
  const f = svg(el.querySelector(".fig"), 460, 300, "The exam graph; each edge puts a tick at both of its ends", "gr");
  const read = el.querySelector(".dm-read");
  let t = 0;
  const frame = () => {
    const shown = EXAM_EDGES.slice(0, Math.min(t, EXAM_EDGES.length));
    drawGraph(f, g, {
      edgeKeys: () => EXAM_EDGES,
      eclass: (k) => (shown.includes(k) ? (k === shown[shown.length - 1] ? "HL" : "") : "ghost"),
      extra: (fig) => shown.forEach((k) => {
        const [u, v] = k.split("");
        for (const [p, q] of [[g.pos[u], g.pos[v]], [g.pos[v], g.pos[u]]]) {
          const L = Math.hypot(q[0] - p[0], q[1] - p[1]), s = 0.62 / L;
          fig.add("circle", { cx: X([p[0] + (q[0] - p[0]) * s, 0]), cy: Y([0, p[1] + (q[1] - p[1]) * s]), r: 4.5, class: "tick" });
        }
      }),
      badge: (v) => shown.filter((k) => k.includes(v)).length,
    });
    read.innerHTML = `Edges drawn: <b>${shown.length}</b> · ticks (one at each end): <b>${2 * shown.length}</b> · sum of the degrees: <b>${2 * shown.length}</b>`;
  };
  frame();
  setInterval(() => { t = t > EXAM_EDGES.length + 3 ? 0 : t + 1; frame(); }, 900);
}

// ---------- Demo 1 · Degrees and the handshake lemma ----------

function demoDegrees(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <button class="reset">Exam graph</button><button class="empty">No edges</button><button class="full">Complete K₆</button></div>
      <p class="dm-read"></p>`;
  let g = examGraph(), pick = null;
  const f = svg(el.querySelector(".fig"), 460, 300, "An editable graph on six vertices with each vertex's degree", "gr");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    drawGraph(f, g, {
      vclass: (v) => (v === pick ? "A pick" : ""),
      eclass: (k) => (pick && k.includes(pick) ? "A" : ""),
      onV: (v) => {
        if (pick === null) pick = v;
        else if (pick === v) pick = null;
        else { const k = key(pick, v); g.E.has(k) ? g.E.delete(k) : g.E.add(k); pick = null; }
        draw();
      },
      badge: (v) => degree(g, v),
    });
    const d = g.V.map((v) => degree(g, v)), sum = d.reduce((a, b) => a + b, 0);
    const odd = g.V.filter((v) => degree(g, v) % 2 === 1);
    const regular = d.every((x) => x === d[0]);
    read.innerHTML = (pick ? `<span class="A">N(${pick}) = {${nbhd(g, pick).join(", ")}}, d(${pick}) = ${degree(g, pick)}.</span> Click another vertex to add or remove that edge.<br>` : "Click a vertex, then another, to add or remove the edge between them.<br>") +
      `Degrees ${d.join(" + ")} = <b>${sum}</b>; edges |E| = ${g.E.size}, and 2|E| = <b>${2 * g.E.size}</b>. ` +
      `Δ = ${Math.max(...d)}, δ = ${Math.min(...d)}${regular ? ` (the graph is ${d[0]}-regular)` : ""}. ` +
      `Odd degree: ${odd.length ? odd.join(", ") : "none"} — <b>${odd.length}</b> vertices, an even number.`;
  };
  el.querySelector(".reset").onclick = () => { g = examGraph(); pick = null; draw(); };
  el.querySelector(".empty").onclick = () => { g.E.clear(); pick = null; draw(); };
  el.querySelector(".full").onclick = () => { pairs(g.V).forEach(([u, v]) => g.E.add(key(u, v))); pick = null; draw(); };
  draw();
}

// ---------- Demo 2 · Which degree lists belong to a graph? ----------

// Havel–Hakimi: join the vertex of largest remaining degree to the next ones; the list is a degree list exactly when
// this never gets stuck. It also builds one such graph.
function havelHakimi(list) {
  const left = list.map((d, i) => ({ i, d }));
  const edges = [];
  for (;;) {
    left.sort((p, q) => q.d - p.d || p.i - q.i);
    if (!left.length || left[0].d === 0) return { ok: true, edges };
    const top = left.shift();
    if (top.d > left.length) return { ok: false, edges, why: `a vertex still needs ${top.d} new neighbours but only ${left.length} vertices are left` };
    for (let j = 0; j < top.d; j++) {
      if (left[j].d === 0) return { ok: false, edges, why: "a vertex would need a neighbour that already has its full degree" };
      left[j].d--;
      edges.push([top.i, left[j].i]);
    }
  }
}

function demoDegreeList(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>degrees <input class="dl" value="3, 3, 3, 1, 1"></label>
      ${["3,3,3,1,1", "3,3,1,1", "4,4,2,1,1", "3,2,2,2,1", "3,3,3,3,3,3"].map((s) => `<button class="chip" data-s="${s}">${s.replaceAll(",", ", ")}</button>`).join("")}</div>
      <div class="fig"></div><p class="dm-read"></p>`;
  const input = el.querySelector(".dl"), read = el.querySelector(".dm-read");
  const f = svg(el.querySelector(".fig"), 460, 300, "A graph with the given degrees, when one exists", "gr");
  const go = () => {
    f.clear();
    const list = input.value.split(/[\s,]+/).filter(Boolean).map(Number);
    if (!list.length || list.some((x) => !Number.isInteger(x) || x < 0) || list.length > 9) {
      read.innerHTML = "Type up to nine whole numbers, for example <b>3, 3, 1, 1</b>.";
      return;
    }
    const n = list.length, sum = list.reduce((a, b) => a + b, 0);
    let msg = `n = ${n} vertices, sum = <b>${sum}</b>. `;
    if (sum % 2) {
      read.innerHTML = msg + `<span class="HL">The sum is odd, so by the handshake lemma no graph has these degrees</span> (it would need ${sum / 2} edges).`;
      return;
    }
    if (Math.max(...list) > n - 1) {
      read.innerHTML = msg + `The sum is even, but <span class="HL">a degree of ${Math.max(...list)} needs ${Math.max(...list)} other vertices</span>; there are only ${n - 1}.`;
      return;
    }
    const r = havelHakimi(list);
    if (!r.ok) {
      read.innerHTML = msg + `The sum is even, so the handshake lemma allows it — <span class="HL">but no graph exists</span>: ${r.why}. An even sum is necessary, not sufficient.`;
      return;
    }
    const g = circleGraph(n, r.edges);
    drawGraph(f, g, { badge: (v) => degree(g, v), eclass: () => "A" });
    read.innerHTML = msg + `<span class="A">A graph exists</span>: here is one, with ${r.edges.length} = ${sum} / 2 edges (built by joining the vertex of largest remaining degree to the next largest ones).`;
  };
  input.oninput = go;
  el.querySelectorAll(".chip").forEach((b) => { b.onclick = () => { input.value = b.dataset.s.replaceAll(",", ", "); go(); }; });
  go();
}

// ---------- Demo 3 · Spanning and induced subgraphs ----------

function demoSubgraph(el) {
  el.innerHTML = `<div class="fig"></div><div class="dm-ctrl">
      <button class="induce primary">Keep every edge inside (induced)</button><button class="all">All vertices</button><button class="reset">Reset</button></div>
      <p class="dm-read"></p>`;
  const g = examGraph();
  let S = new Set(g.V), keep = new Set(g.E);
  const f = svg(el.querySelector(".fig"), 460, 300, "The exam graph; chosen vertices and kept edges form a subgraph H", "gr");
  const read = el.querySelector(".dm-read");
  const inside = (k) => S.has(k[0]) && S.has(k[1]);
  const draw = () => {
    for (const k of [...keep]) if (!inside(k)) keep.delete(k);
    drawGraph(f, g, {
      vclass: (v) => (S.has(v) ? "A" : "DIM"),
      eclass: (k) => (keep.has(k) ? "A" : "ghost"),
      onV: (v) => { if (S.has(v) && S.size > 1) S.delete(v); else S.add(v); draw(); },
      onE: (k) => { if (!inside(k)) return; keep.has(k) ? keep.delete(k) : keep.add(k); draw(); },
    });
    const missing = [...g.E].filter((k) => inside(k) && !keep.has(k));
    const spanning = S.size === g.V.length;
    read.innerHTML = `Click a vertex to add or drop it; click an edge between chosen vertices to keep or drop it.<br>` +
      `V(H) = {${[...S].sort().join(", ")}}, E(H) = {${[...keep].sort().join(", ") || "∅"}}. ` +
      `<b>${spanning ? "Spanning" : "Not spanning"}</b>${spanning ? " (every vertex kept)" : ` (missing ${g.V.filter((v) => !S.has(v)).join(", ")})`}; ` +
      (missing.length ? `<b class="HL">not induced</b>: ${missing.join(", ")} join two chosen vertices and are missing.` : `<b class="A">induced</b>: this is G[S], every edge of G between the chosen vertices.`) +
      (spanning && !missing.length ? " Spanning and induced: H is G itself." : "");
  };
  el.querySelector(".induce").onclick = () => { g.E.forEach((k) => { if (inside(k)) keep.add(k); }); draw(); };
  el.querySelector(".all").onclick = () => { S = new Set(g.V); draw(); };
  el.querySelector(".reset").onclick = () => { S = new Set(["b", "c", "d", "e"]); keep = new Set(["bc", "de"]); draw(); };
  S = new Set(["b", "c", "d", "e"]);
  keep = new Set(["bc", "de"]);
  draw();
}

// ---------- Demo 4 · Cliques and independent sets ----------

const GRAPHS = {
  exam: () => examGraph(),
  complement: () => {
    const g = examGraph(), E = new Set();
    pairs(g.V).forEach(([u, v]) => { if (!g.E.has(key(u, v))) E.add(key(u, v)); });
    return { ...g, E };
  },
  c5: () => circleGraph(5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]),
  k4: () => circleGraph(4, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]),
  random: () => {
    const n = 7, edges = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.random() < 0.45) edges.push([i, j]);
    return circleGraph(n, edges);
  },
};

function demoCliques(el) {
  el.innerHTML = `<div class="dm-ctrl"><label>graph <select class="which">
        <option value="exam">exam graph G</option><option value="complement">its complement</option><option value="c5">5-cycle C₅</option>
        <option value="k4">complete K₄</option><option value="random">random, 7 vertices</option></select></label></div>
      <div class="fig"></div><div class="dm-ctrl">
      <button class="bigc">Largest clique</button><button class="bigi">Largest independent set</button><button class="clr">Clear</button></div>
      <p class="dm-read"></p>`;
  let g = examGraph(), S = new Set(["c", "f"]), note = "";
  const f = svg(el.querySelector(".fig"), 460, 300, "A graph; the chosen set of vertices is tested for being a clique or an independent set", "gr");
  const read = el.querySelector(".dm-read");
  const draw = () => {
    const T = g.V.filter((v) => S.has(v));
    const clique = isClique(g, T), indep = isIndependent(g, T);
    drawGraph(f, g, {
      vclass: (v) => (S.has(v) ? (clique && T.length > 1 ? "HL" : "B") : ""),
      eclass: (k) => (S.has(k[0]) && S.has(k[1]) ? "HL" : ""),
      onV: (v) => { S.has(v) ? S.delete(v) : S.add(v); note = ""; draw(); },
    });
    const w = largest(g, isClique), a = largest(g, isIndependent);
    let msg = `S = {${T.join(", ") || "∅"}}: `;
    if (!T.length) msg += "click vertices to choose a set.";
    else {
      const parts = [];
      if (clique) {
        const grow = g.V.filter((x) => !S.has(x) && isClique(g, [...T, x]));
        parts.push(`<b class="HL">a clique</b> of size ${T.length}` + (grow.length ? ` (not maximal: add ${grow.join(" or ")})` : ` — maximal${T.length < w.size ? `, <b>but not maximum</b>` : ""}`));
      }
      if (indep) {
        const grow = g.V.filter((x) => !S.has(x) && isIndependent(g, [...T, x]));
        parts.push(`<b class="B">an independent set</b> of size ${T.length}` + (grow.length ? ` (not maximal: add ${grow.join(" or ")})` : ` — maximal${T.length < a.size ? `, <b>but not maximum</b>` : ""}`));
      }
      if (!parts.length) {
        const edge = pairs(T).find(([u, v]) => g.E.has(key(u, v)));
        const non = pairs(T).find(([u, v]) => !g.E.has(key(u, v)));
        parts.push(`neither: ${edge.join("")} is an edge and ${non.join("")} is not`);
      }
      msg += parts.join("; ") + ".";
    }
    read.innerHTML = msg + `<br>For this graph ω = <b>${w.size}</b> and α = <b>${a.size}</b> (found by trying all 2<sup>${g.V.length}</sup> = ${2 ** g.V.length} subsets).` + (note ? `<br>${note}` : "");
  };
  el.querySelector(".which").onchange = (e) => { g = GRAPHS[e.target.value](); S = new Set(); note = ""; draw(); };
  el.querySelector(".bigc").onclick = () => { const w = largest(g, isClique); S = new Set(w.sets[0]); note = `Largest cliques: ${w.sets.map((s) => `{${s.join(", ")}}`).join(", ")}.`; draw(); };
  el.querySelector(".bigi").onclick = () => { const a = largest(g, isIndependent); S = new Set(a.sets[0]); note = `Largest independent sets: ${a.sets.map((s) => `{${s.join(", ")}}`).join(", ")}.`; draw(); };
  el.querySelector(".clr").onclick = () => { S = new Set(); note = ""; draw(); };
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "In the exam graph, what is the degree of e?",
    opts: ["2", "3", "4"], a: 1,
    why: "N(e) = {c, d, f}, so d(e) = 3." },
  { q: "True or false: δ(G) is the largest degree of a vertex of G.",
    opts: ["True", "False"], a: 1,
    why: "δ(G) is the smallest degree and Δ(G) the largest. The weekly summary calls δ the “maximal” degree: a typo." },
  { q: "Can a graph have five vertices with degrees 4, 3, 3, 2, 1?",
    opts: ["Yes", "No: the sum 13 is odd", "Only if it has a loop"], a: 1,
    why: "By the handshake lemma the degrees add up to 2|E|, an even number. Loops are not allowed anyway." },
  { q: "The vertices b, c, d, e with the edges bc and de only: what is this subgraph of the exam graph?",
    opts: ["The induced subgraph on {b, c, d, e}", "A subgraph, but not induced", "A spanning subgraph"], a: 1,
    why: "The induced subgraph keeps every edge between its vertices, here also bd, cd and ce. It is not spanning either: a and f are missing." },
  { q: "{c, f} is independent and no vertex can be added to it. So α(G) is …",
    opts: ["2", "at least 2; in fact 3", "6"], a: 1,
    why: "{c, f} is maximal, not maximum: {a, d, f} is a larger independent set, and α(G) = 3." },
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
  handshakeMini: (el) => demoHandshakeMini(el),
  degrees: (el) => demoDegrees(el),
  degreeList: (el) => demoDegreeList(el),
  subgraph: (el) => demoSubgraph(el),
  cliques: (el) => demoCliques(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
