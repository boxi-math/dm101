// Chapter content, adapted from notes/L12-graphs.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

// media/ is filled by kit/brand.py --site (branded parts) and dm101/tools/site_build.py (captions).
const VIDEO_P1 = "media/L12-1.mp4";
const VIDEO_P2 = "media/L12-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 12,
  title: "Graphs",
  tagline: "Vertices, edges, degrees, cliques",
  lead: "Six exams and the clashes between them become a graph. Count the degrees and they always add up to twice the number of edges; look for exams that can share a slot and you are looking for an independent set. Interactive notes on graphs, where every number was checked by running code.",
  heroDemo: "handshakeMini",
  heroLabel: "The handshake lemma",
  heroCaption: "Every edge puts a tick at both of its ends, so the degrees add up to twice the number of edges.",
  whyTitle: "Why graphs",
  whySub: "The structure behind networks, timetables and maps",
  why: [
    ["Just two sets", "A graph is a set of vertices \\(V\\) and a set of edges \\(E\\), each edge a pair of vertices. Everything else (degrees, subgraphs, cliques) is defined from that pair."],
    ["A theorem from counting", "The <b>handshake lemma</b>: the degrees add up to \\(2|E|\\). So the degree list \\(3, 3, 3, 1, 1\\) belongs to no graph."],
    ["Questions that are hard", "The largest clique \\(\\omega(G)\\) and the largest independent set \\(\\alpha(G)\\) answer timetable questions, and no fast general method to find them is known."],
  ],
  ctaTitle: "Ready to draw the first graph?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 12 · Part 1 — Graphs, degrees and the handshake lemma",
    [VIDEO_P2]: "Lecture 12 · Part 2 — Subgraphs, cliques and independent sets",
  },
};

const CHAPTERS = [
  {
    slug: "1-timetable", nav: "Timetable", title: "Exams That Cannot Share a Slot",
    subtitle: "Where a graph comes from",
    abstract: "Four students' timetables create clashes between six exams. Drawn as dots and lines, the clashes are a graph, and two timetable questions become graph questions.",
    tags: ["exam timetable", "clashes", "dots and lines"],
    hero: "code:conflicts", heroCaption: "Six exams, eight clashing pairs",
    sections: [
      { id: "exams", title: "Six exams, four students", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A college must timetable six exams: <b>a</b>lgebra, <b>b</b>iology, <b>c</b>hemistry, <b>d</b>ata science, <b>e</b>conomics and <b>f</b>rench. Two exams cannot be held at the same time if some student takes both. Student 1 takes a, b and c; student 2 takes b and d; student 3 takes c, d and e; student 4 takes e and f. Each student creates a clash between every two of their exams:</p>
        ${run("conflicts")}
        <p>Draw each exam as a dot and each clash as a line between two dots: that picture is a <b>graph</b>. Two questions run through the lecture: what is the largest set of exams that can share one slot (no two in conflict)? And what is the largest set of exams that all conflict with each other (they need different slots)?</p>
        ${predict("Draw the six dots and eight lines. Can you find four exams that could share one slot? Three exams that all conflict with each other?",
          "<p>Three exams that all conflict: \\(a, b, c\\) (also \\(b, c, d\\) and \\(c, d, e\\)). Four exams that can share a slot: no. The largest set with no clash is \\(\\{a, d, f\\}\\), and chapter 5 proves that four is impossible.</p>")}` },
    ],
    takeaways: [
      "Objects and a symmetric relation between them (clash / no clash) form a graph.",
      "Timetable questions become questions about sets of vertices.",
    ],
  },
  {
    slug: "2-graphs", nav: "Graphs", title: "Graphs",
    subtitle: "The definition, and what it rules out",
    abstract: "A graph is a pair (V, E) of a vertex set and a set of 2-element subsets. No loops, no multiple edges, and the drawing is only a picture.",
    tags: ["G = (V, E)", "order and size", "simple graph"],
    hero: "toc",
    sections: [
      { id: "def", title: "The definition", html: String.raw`
        ${callout("note", "DEFINITION · GRAPH", `<p>A <b>graph</b> is a pair \\(G = (V, E)\\), where \\(V\\) is a nonempty finite set and \\(E\\) is a set of 2-element subsets of \\(V\\). Elements of \\(V\\) are <b>vertices</b>, elements of \\(E\\) are <b>edges</b>. The <b>order</b> is \\(n = |V|\\), the <b>size</b> is \\(m = |E|\\).</p>`)}
        <p>The exam graph has \(V = \{a, b, c, d, e, f\}\) and \(E = \{ab, ac, bc, bd, cd, ce, de, ef\}\), so \(n = 6\) and \(m = 8\). The edge \(\{u, v\}\) is written \(uv\); \(uv\) and \(vu\) are the same edge.</p>` },
      { id: "simple", title: "No loops, no multiple edges", html: String.raw`
        <p>A <b>loop</b> would be \(\{v, v\} = \{v\}\), a set with one element, so it is not an edge. A second line between \(u\) and \(v\) would be the same set \(\{u, v\}\) again, and \(E\) is a set: it holds each pair once. Such graphs are called <b>simple graphs</b>; in this course every graph is simple.</p>
        <p><b>A graph is not its drawing.</b> Moving the dots or bending the lines gives another drawing of the same graph, as long as the same pairs are joined.</p>
        <p>Each edge is one of the \(\binom{n}{2}\) pairs of vertices, so \(0 \le m \le \binom{n}{2} = \frac{n(n-1)}{2}\). The graph with every pair as an edge is the <b>complete graph</b> \(K_n\); the exam graph uses \(8\) of the \(15\) possible pairs.</p>` },
    ],
    takeaways: [
      "G = (V, E): vertices, and edges that are 2-element subsets.",
      "No loops, no multiple edges (simple graphs).",
      "Two drawings with the same vertex and edge sets are the same graph.",
    ],
  },
  {
    slug: "3-degrees", nav: "Degrees", title: "Neighbours and Degrees",
    subtitle: "N(v), d(v), Δ(G) and δ(G)",
    abstract: "The neighbourhood of a vertex is the set of vertices joined to it; the degree is its size. The maximum degree is Δ, the minimum is δ.",
    tags: ["N(v)", "d(v) = |N(v)|", "Δ and δ", "regular"],
    hero: "code:degrees", heroCaption: "Every neighbourhood and degree of the exam graph",
    sections: [
      { id: "nbhd", title: "Neighbourhoods and degrees", html: String.raw`
        ${callout("note", "DEFINITION · NEIGHBOURHOOD AND DEGREE", `<p>\\(u\\) is <b>adjacent</b> to \\(v\\), written \\(u \\sim v\\), when \\(uv \\in E\\). The <b>neighbourhood</b> of \\(v\\) is \\(N(v) = \\{u \\in V : u \\sim v\\}\\). The <b>degree</b> \\(d(v)\\) is the number of edges with endpoint \\(v\\); since there are no loops or multiple edges, \\(d(v) = |N(v)|\\).</p>`)}
        ${run("degrees")}
        <p>So \(N(c) = \{a, b, d, e\}\) and \(d(c) = 4\); French clashes only with economics, \(d(f) = 1\).</p>` },
      { id: "maxmin", title: "Maximum and minimum degree", html: String.raw`
        ${callout("note", "DEFINITION · Δ, δ, REGULAR", `<p>\\(\\Delta(G) = \\max_v d(v)\\) is the <b>maximum degree</b>, \\(\\delta(G) = \\min_v d(v)\\) the <b>minimum degree</b>. \\(G\\) is <b>\\(r\\)-regular</b> when every vertex has degree \\(r\\).</p>`)}
        ${callout("pitfall", "ERRATUM · δ IS THE MINIMUM", `<p>The weekly summary defines both \\(\\Delta(G)\\) and \\(\\delta(G)\\) as the <em>maximal</em> degree. That is a typo for \\(\\delta\\): the small delta is the minimum.</p>`)}
        ${run("maxmin")}
        <p>\(\Delta(G) = 4\) at \(c\) and \(\delta(G) = 1\) at \(f\); the graph is not regular. \(K_4\) is 3-regular and the 5-cycle \(C_5\) is 2-regular:</p>
        ${run("regular")}
        ${demo("degrees", "Demo 1 · Degrees, and their sum", "click two vertices to toggle an edge", "Every edge you add raises two degrees by one, so the sum always goes up by 2.")}` },
    ],
    takeaways: [
      "d(v) = |N(v)|: the number of neighbours.",
      "Δ(G) is the largest degree, δ(G) the smallest.",
    ],
  },
  {
    slug: "4-handshake", nav: "Handshake", title: "The Handshake Lemma",
    subtitle: "Counting one set in two ways",
    abstract: "The degrees of every graph add up to twice the number of edges. So the odd-degree vertices come in an even number, and some degree lists belong to no graph.",
    tags: ["Σ d(v) = 2|E|", "double counting", "odd degrees"],
    hero: "handshakeMini", heroCaption: "Each edge: two ticks, one at each end.",
    sections: [
      { id: "lemma", title: "Theorem 1: the handshake lemma", html: String.raw`
        <p>The degrees of the exam graph are \(2, 3, 4, 3, 3, 1\); they add up to \(16\), twice the number of edges:</p>
        ${run("handshakeG")}
        <p><b>Theorem 1.</b> In every graph \(G = (V, E)\), $$\sum_{v \in V} d(v) = 2\,|E|.$$</p>
        <p><em>Proof.</em> Count the set \(P = \{(v, e) : v \in V,\ e \in E,\ v \in e\}\) in two ways. <em>By vertices:</em> a fixed \(v\) is in \(d(v)\) pairs, so \(|P| = \sum_v d(v)\). <em>By edges:</em> a fixed edge \(e = uw\) gives exactly the two pairs \((u, e)\) and \((w, e)\), because an edge is a 2-element set; so \(|P| = 2|E|\). Both counts are \(|P|\). \(\square\)</p>
        ${callout("pattern", "PATTERN · COUNT IT TWO WAYS", `<p>To prove two expressions equal, find one set and count it in two ways, one giving each expression. Here: pairs (vertex, edge at that vertex). The same pattern proved \\(2^n - 1 = 1 + 2 + \\dots + 2^{n-1}\\) in Lecture 4.</p>`)}
        ${run("pairs")}
        ${callout("pitfall", "PITFALL · “THE DEGREES ADD UP TO THE NUMBER OF EDGES”", `<p>They add up to <em>twice</em> that: each edge is counted once at each of its two ends. For the exam graph, 16 and not 8.</p>`)}` },
      { id: "odd", title: "Odd degrees, impossible lists", html: String.raw`
        <p><b>Corollary 2.</b> In every graph the number of vertices of odd degree is even. <em>Proof.</em> \(\sum_v d(v) = 2|E|\) is even, and the even degrees add up to an even number, so the odd degrees add up to an even number too; a sum of odd numbers is even exactly when it has an even number of terms. \(\square\) In the exam graph: \(b, d, e, f\).</p>
        <p>So no graph has the degrees \(3, 3, 3, 1, 1\): the sum \(11\) is odd. A search over all \(1024\) graphs on five vertices agrees:</p>
        ${run("nolist")}
        <p>An \(r\)-regular graph on \(n\) vertices has \(nr/2\) edges, so there is no 3-regular graph on 7 vertices (\(21\) is odd):</p>
        ${run("regedges")}
        ${demo("degreeList", "Demo 2 · Is it a degree list?", "type degrees or pick one", "An odd sum is ruled out at once. 3, 3, 1, 1 has an even sum and still fails: even is necessary, not sufficient.")}` },
    ],
    takeaways: [
      "Σ d(v) = 2|E| in every graph (count (vertex, edge) pairs two ways).",
      "The number of odd-degree vertices is even.",
      "An even degree sum is necessary for a degree list, not sufficient.",
    ],
  },
  {
    slug: "5-subgraphs", nav: "Subgraphs", title: "Subgraphs",
    subtitle: "Spanning and induced",
    abstract: "A subgraph keeps some vertices and some edges. Spanning keeps every vertex; induced keeps every edge between the vertices it chose.",
    tags: ["subgraph", "spanning", "induced G[S]"],
    hero: "code:induced", heroCaption: "H₁ spanning, G[{b, c, d, e}] induced, H₃ neither",
    sections: [
      { id: "kinds", title: "Three kinds of subgraph", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION · SUBGRAPHS", `<p>\\(H\\) is a <b>subgraph</b> of \\(G\\) when \\(V(H) \\subseteq V(G)\\) and \\(E(H) \\subseteq E(G)\\). It is <b>spanning</b> when \\(V(H) = V(G)\\). For nonempty \\(S \\subseteq V(G)\\), the <b>induced subgraph</b> \\(G[S]\\) has vertex set \\(S\\) and every edge of \\(G\\) with both ends in \\(S\\): \\(E(G[S]) = \\{xy \\in E(G) : x, y \\in S\\}\\).</p>`)}
        <p>\(H_1\): all six vertices, edges \(ab, bd, cd, ce, ef\) — spanning, not induced. \(H_2 = G[\{b, c, d, e\}]\), edges \(bc, bd, cd, ce, de\) — induced, not spanning. \(H_3\): vertices \(b, c, d, e\), edges \(bc, de\) only — neither.</p>
        ${run("induced")}
        ${demo("subgraph", "Demo 3 · Build a subgraph", "click vertices and edges", "Start from H₃ and press “Keep every edge inside”: you get G[{b, c, d, e}].")}
        ${callout("pitfall", "PITFALL · “ANY SUBGRAPH ON THESE VERTICES IS THE INDUCED ONE”", `<p>\\(H_3\\) has the vertices \\(b, c, d, e\\) but misses \\(bd\\), \\(cd\\) and \\(ce\\). For each set \\(S\\) there are many subgraphs with vertex set \\(S\\), but only one induced subgraph.</p>`)}` },
      { id: "count", title: "Counting subgraphs", html: String.raw`
        <p>A spanning subgraph is a choice of a subset of \(E\): \(2^m\) of them. An induced subgraph is a choice of a nonempty subset of \(V\): \(2^n - 1\).</p>
        ${run("countsub")}
        ${predict("A subgraph of \\(G\\) is both spanning and induced. What can it be?", "<p>Only \\(G\\) itself: spanning means all the vertices, and induced then means all the edges between them, which is all of \\(E\\).</p>")}` },
    ],
    takeaways: [
      "Subgraph: some vertices, some edges between them.",
      "Spanning keeps all vertices; induced keeps all edges between the chosen vertices.",
    ],
  },
  {
    slug: "6-cliques", nav: "Cliques", title: "Cliques and Independent Sets",
    subtitle: "ω(G), α(G), and proofs in two halves",
    abstract: "A clique has every pair adjacent, an independent set no pair. In the exam graph both largest sizes are 3, which answers the timetable.",
    tags: ["clique ω", "independent set α", "maximal vs maximum", "complement"],
    hero: "code:largest", heroCaption: "Every subset tried: ω(G) = 3, α(G) = 3",
    sections: [
      { id: "defs", title: "Definitions, and the search", html: String.raw`
        ${callout("note", "DEFINITION · CLIQUE AND INDEPENDENT SET", `<p>\\(S \\subseteq V\\) is a <b>clique</b> when every two distinct vertices of \\(S\\) are adjacent, an <b>independent set</b> when no two are. \\(\\omega(G)\\), the <b>clique number</b>, is the size of a largest clique; \\(\\alpha(G)\\), the <b>independence number</b>, the size of a largest independent set.</p>`)}
        ${run("largest")}
        <p>\(\omega(G) = 3\) (the triangles \(abc\), \(bcd\), \(cde\)) and \(\alpha(G) = 3\), with the single largest independent set \(\{a, d, f\}\).</p>` },
      { id: "proof", title: "Proposition 3: two halves", html: String.raw`
        ${callout("pattern", "PATTERN · PROVING α(G) = k (OR ω(G) = k)", `<ol><li><b>\\(\\ge k\\):</b> show one set of size \\(k\\). One example is enough.</li><li><b>\\(\\le k\\):</b> show that <em>no</em> set of size \\(k + 1\\) works: an argument (or a complete search), never an example.</li></ol>`)}
        <p><em>\(\alpha(G) \ge 3\):</em> \(\{a, d, f\}\) is independent. <em>\(\alpha(G) \le 3\):</em> let \(S\) be independent. If \(c \in S\), no neighbour of \(c\) is in \(S\), so \(S \subseteq \{c, f\}\). If \(c \notin S\), split \(a, b, d, e, f\) into \(\{a, b\}\), \(\{d, e\}\), \(\{f\}\); the first two are edges, so \(S\) has at most one vertex from each: \(|S| \le 3\).</p>
        <p><em>\(\omega(G) \ge 3\):</em> \(\{a, b, c\}\) is a clique. <em>\(\omega(G) \le 3\):</em> in a clique of four every vertex has degree at least \(3\); only \(b, c, d, e\) do, and \(b \not\sim e\). \(\square\)</p>
        ${callout("pitfall", "PITFALL · MAXIMAL IS NOT MAXIMUM", `<p>\\(\\{c, f\\}\\) is independent and nothing can be added to it (every other vertex is a neighbour of \\(c\\) or \\(f\\)): it is <b>maximal</b>. But it is not <b>maximum</b>: \\(\\alpha(G) = 3\\). A greedy search that stops when stuck finds a maximal set.</p>`)}
        ${run("maximal")}
        ${demo("cliques", "Demo 4 · Cliques and independent sets", "click vertices; try other graphs", "Start with {c, f}: maximal, but not maximum. On C₅ both ω and α are 2.")}` },
      { id: "complement", title: "Complements and subgraphs", html: String.raw`
        <p>The <b>complement</b> \(\overline G\) has the same vertices, and \(uv\) is an edge of \(\overline G\) exactly when it is not an edge of \(G\).</p>
        <p><b>Theorem 4.</b> \(S\) is a clique of \(G\) if and only if it is independent in \(\overline G\); so \(\omega(G) = \alpha(\overline G)\) and \(\alpha(G) = \omega(\overline G)\). <em>Proof.</em> For distinct \(u, v \in S\): \(uv \in E\) exactly when \(uv \notin \overline E\). So "every pair is an edge of \(G\)" and "no pair is an edge of \(\overline G\)" say the same thing. \(\square\)</p>
        ${run("complement")}
        <p><b>Theorem 5.</b> If \(H\) is a subgraph of \(G\), then \(\omega(H) \le \omega(G)\); if \(H\) is spanning, also \(\alpha(H) \ge \alpha(G)\). <em>Proof.</em> A clique of \(H\) has its edges in \(E(H) \subseteq E(G)\), so it is a clique of \(G\). An independent set of \(G\) is a set of vertices of a spanning \(H\), and an edge of \(H\) inside it would be an edge of \(G\). \(\square\)</p>
        ${run("monotone")}` },
      { id: "answer", title: "The timetable, answered", html: String.raw`
        <p>The largest set of exams that can share a slot is \(\{a, d, f\}\). The clique \(\{a, b, c\}\) needs three different slots, so at least \(3\) slots; three are enough:</p>
        ${run("slots")}` },
    ],
    takeaways: [
      "Clique: every pair adjacent; independent set: no pair.",
      "α(G) = k needs an example of size k and a reason nothing larger exists.",
      "Maximal (cannot grow) is not maximum (largest).",
      "ω(G) = α(Ḡ).",
    ],
  },
  {
    slug: "7-programs", nav: "Programs", title: "Graphs in Programs",
    subtitle: "Adjacency lists, matrices, and hard questions",
    abstract: "Programs store a graph as adjacency lists or an adjacency matrix. Degrees are easy; the largest clique is believed to be hard.",
    tags: ["adjacency matrix", "adjacency list", "NP-complete"],
    hero: "code:storage", heroCaption: "Row sums are degrees; the ones add up to 2m",
    sections: [
      { id: "storage", title: "Lists and matrices", html: String.raw`
        <p>An <b>adjacency list</b> maps each vertex to \(N(v)\); an <b>adjacency matrix</b> has \(A_{uv} = 1\) when \(u \sim v\).</p>
        ${run("storage")}
        <p>The matrix is symmetric with a zero diagonal (no loops), each row sum is a degree, and the ones add up to \(2m = 16\): the handshake lemma, read off the matrix.</p>
        ${callout("note", "CS · GRAPHS EVERYWHERE", `<p>Road maps, networks, web links and package dependencies are graphs. A matrix takes \\(n^2\\) entries, a list about \\(n + 2m\\). Degrees take one pass; but no known algorithm finds \\(\\omega(G)\\) or \\(\\alpha(G)\\) for every graph much faster than trying exponentially many subsets. The clique problem is one of the classic <b>NP-complete</b> problems; timetabling and register allocation lead to it.</p>`)}
        ${run("growth")}
        <p>For 60 exams, about \(10^{18}\) subsets: more than thirty years at a billion per second.</p>` },
    ],
    takeaways: [
      "Adjacency list or matrix; the matrix shows the handshake lemma.",
      "Brute force over subsets grows like 2ⁿ.",
    ],
  },
  {
    slug: "8-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, seven exercises with hints and full solutions, and a checklist for graph answers that an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Give the assistant the graph as a list of edges, then check: (1) do the degrees add up to twice the number of edges? (2) is \(\delta\) the smallest degree and \(\Delta\) the largest? (3) for \(\omega\) and \(\alpha\), is there an example <em>and</em> a reason nothing larger exists? (4) does an "induced" subgraph keep every edge between its vertices? (5) run the search of chapter 6 on the same list.</p>
        <p>The degrees \(4, 4, 2, 1, 1\) have an even sum, so an assistant may say a graph exists. The search says no:</p>
        ${run("aiCheck")}
        <p>Both vertices of degree 4 are joined to every other vertex, so every other vertex has degree at least 2.</p>` },
    ],
    takeaways: [
      "Check the degree sum, δ vs Δ, and both halves of every ω / α claim.",
      "A computer search can refute a claim about one graph; a proof covers all graphs.",
    ],
  },
];
