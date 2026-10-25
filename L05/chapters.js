// Chapter content, adapted from notes/L05-relations.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L05-1.mp4";
const VIDEO_P2 = "media/L05-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 5,
  title: "Relations",
  tagline: "Pairs, properties and classes",
  lead: "Why rock, paper, scissors has no best move, how to read five properties off a grid of pairs, and how a relation that behaves like “=” cuts a set into classes. Interactive notes on relations, equivalence relations and congruence, where every number was checked by running code.",
  heroDemo: "relMini",
  heroLabel: "A relation as a grid",
  heroCaption: "Row x, column y, shaded when x R y. The diagonal and the mirror in it show four of the five properties.",
  whyTitle: "Why relations",
  whySub: "The language for comparing things: order, equality, “same as”",
  why: [
    ["Just a set of pairs", "A relation on \\(A\\) is a subset of \\(A \\times A\\). Draw it as a grid: row \\(x\\), column \\(y\\)."],
    ["Five properties", "Reflexive, irreflexive, symmetric, antisymmetric, transitive: each a “for all” statement you prove from the definition or break with one counterexample."],
    ["Equal-ish things", "Reflexive + symmetric + transitive = an <b>equivalence relation</b>. Its classes form a partition; congruence mod \\(n\\) is the main example."],
  ],
  ctaTitle: "Ready to draw your first relation?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 5 · Part 1 — Relations and their properties",
    [VIDEO_P2]: "Lecture 5 · Part 2 — Equivalence relations and classes",
  },
};

const CHAPTERS = [
  {
    slug: "1-pairs", nav: "Pairs", title: "Relations Are Sets of Pairs",
    subtitle: "Rock, paper, scissors, and a grid for every relation",
    abstract: "“Beats” in rock, paper, scissors is a set of three ordered pairs, and it fails a rule that “taller than” obeys. A relation on a set is any set of pairs, drawn as a grid.",
    tags: ["ordered pairs", "R ⊆ A × A", "matrix"],
    hero: "code:matrix", heroCaption: "The grid of “≤” on {1, 2, 3, 4}",
    sections: [
      { id: "rps", title: "Rock, paper, scissors", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Rock beats scissors, scissors beats paper, and paper beats rock. Write “beats” as a set of pairs (winner, loser):</p>
        ${run("rps")}
        <p>The order inside a pair matters. And compare “beats” with “is taller than”: if Ana is taller than Bo and Bo is taller than Cy, then Ana is taller than Cy. With “beats” that reasoning fails: rock beats scissors and scissors beats paper, yet rock does not beat paper. That is why the game has no best move.</p>
        ${predict("“Taller than” never relates a person to themself, and never goes both ways. Which of these two facts is also true for “beats”?",
          "<p>Both. Nothing beats itself, and no two moves beat each other. The difference is the third rule (transitivity, chapter 2).</p>")}` },
      { id: "pairs", title: "Relations and their grids", html: String.raw`
        ${callout("note", "DEFINITION · RELATION", `<p>A <b>relation</b> \\(R\\) on a set \\(A\\) is a set of ordered pairs of elements of \\(A\\), that is, \\(R \\subseteq A \\times A\\). We write \\(x \\mathrel{R} y\\) when \\((x, y) \\in R\\).</p>`)}
        <p>On \(A = \{1, 2, 3, 4\}\), the relation “\(\le\)” is the set of the ten pairs \((x, y)\) with \(x \le y\):</p>
        ${run("leq")}
        <p><b>The picture.</b> One row for each \(x\), one column for each \(y\); mark the cell when \(x \mathrel{R} y\). This grid is the <b>matrix</b> of the relation:</p>
        ${run("matrix")}
        <p>A second relation: four bus stops \(1, 2, 3, 4\) on one street, and \(x \mathrel{N} y\) when the stops are neighbours, \(|x - y| = 1\):</p>
        ${run("neighbours")}
        <p>Any set of pairs is a relation, even the empty set. With 16 cells, each marked or not, there are \(2^{16}\) relations on a 4-element set:</p>
        ${run("count")}
        ${callout("pitfall", "PITFALL · THE ORDER OF A PAIR MATTERS", `<p>\\((2, 3)\\) and \\((3, 2)\\) are different pairs: \\(2 \\le 3\\) but \\(3 \\not\\le 2\\). In the grid, \\((x, y)\\) is row \\(x\\), column \\(y\\).</p>`)}` },
    ],
    takeaways: [
      "A relation on A is a set of ordered pairs, R ⊆ A × A.",
      "Draw it as a grid: row x, column y.",
      "A 4-element set has 2¹⁶ = 65536 relations.",
    ],
  },
  {
    slug: "2-properties", nav: "Properties", title: "Five Properties",
    subtitle: "The diagonal, the mirror, and two-step paths",
    abstract: "Reflexive and irreflexive live on the diagonal, symmetric and antisymmetric in the mirror, and transitive in the two-step paths. Each is a “for all” statement: prove it from arbitrary elements, or break it with one counterexample.",
    tags: ["reflexive", "symmetric", "transitive"],
    hero: "relation", heroCaption: "Click cells; the five tests update.",
    sections: [
      { id: "defs", title: "The definitions", html: String.raw`
        ${callout("note", "DEFINITION · FIVE PROPERTIES", `<p>Let \\(R\\) be a relation on \\(A\\). \\(R\\) is <b>reflexive</b> if \\(x \\mathrel{R} x\\) for every \\(x\\); <b>irreflexive</b> if \\(x \\not\\mathrel{R} x\\) for every \\(x\\); <b>symmetric</b> if \\(x \\mathrel{R} y\\) implies \\(y \\mathrel{R} x\\); <b>antisymmetric</b> if \\(x \\mathrel{R} y\\) and \\(y \\mathrel{R} x\\) imply \\(x = y\\); <b>transitive</b> if \\(x \\mathrel{R} y\\) and \\(y \\mathrel{R} z\\) imply \\(x \\mathrel{R} z\\) (for all \\(x, y, z \\in A\\)).</p>`)}
        <p><b>On the grid:</b> reflexive = the whole diagonal marked, irreflexive = no diagonal cell marked; symmetric = the grid is its own mirror image in the diagonal; antisymmetric = no two mirror cells off the diagonal are both marked. Transitivity is about paths: whenever there are steps \(x \to y\) and \(y \to z\), the shortcut \(x \to z\) must be there.</p>
        <p>The five tests, word for word as in the definitions:</p>
        ${run("props")}
        <p>Six relations; the columns are reflexive, irreflexive, symmetric, antisymmetric, transitive:</p>
        ${run("table")}
        ${demo("relation", "Demo 1 · Build a relation", "click cells or pick a preset", "Each failed test names its counterexample. Try to make a relation that is symmetric and transitive but not reflexive.")}` },
      { id: "proofs", title: "Proofs and counterexamples", html: String.raw`
        <p>The table checks four elements. To prove a property on all of \(\mathbb Z\), use arbitrary elements. <em>“\(\le\)” is transitive:</em> if \(x \le y\) and \(y \le z\), then \(z - x = (z - y) + (y - x)\) is a sum of two numbers \(\ge 0\), so \(x \le z\). To disprove a property, one counterexample is enough: \(1 \mathrel{N} 2\) and \(2 \mathrel{N} 1\) but not \(1 \mathrel{N} 1\), so the neighbours are not transitive.</p>
        ${callout("pattern", "PATTERN · PROVING AND DISPROVING A PROPERTY", `<ul><li><b>Reflexive:</b> let \\(x \\in A\\) be arbitrary; show \\(x \\mathrel{R} x\\).</li><li><b>Symmetric:</b> let \\(x \\mathrel{R} y\\); show \\(y \\mathrel{R} x\\).</li><li><b>Antisymmetric:</b> let \\(x \\mathrel{R} y\\) and \\(y \\mathrel{R} x\\); show \\(x = y\\).</li><li><b>Transitive:</b> let \\(x \\mathrel{R} y\\) and \\(y \\mathrel{R} z\\); show \\(x \\mathrel{R} z\\).</li><li><b>Disprove:</b> name elements for which the “if” part holds and the “then” part fails.</li></ul>`)}
        ${callout("pitfall", "PITFALL · NOT OPPOSITES", `<p>“Irreflexive” is not “not reflexive”, and “antisymmetric” is not “not symmetric”. \\(\\{(1, 1)\\}\\) on \\(\\{1, 2\\}\\) is neither reflexive nor irreflexive; “\\(=\\)” is both symmetric and antisymmetric; \\(\\{(1, 2), (2, 1), (1, 3)\\}\\) is neither.</p>`)}
        ${run("neither")}
        <p><b>Vacuous cases.</b> An “if …, then …” property holds when the “if” part never happens: \(\{(1, 2)\}\) is transitive, and the empty relation has every property except reflexivity:</p>
        ${run("vacuous")}
        <p>A computer can test all 65536 relations on a 4-element set:</p>
        ${run("census")}
        ${predict("Can a relation be both symmetric and antisymmetric without being “=”?",
          "<p>Yes: the empty relation, or \\(\\{(1, 1)\\}\\) on \\(\\{1, 2\\}\\). Both have no pairs off the diagonal, so both properties hold. (Symmetric and antisymmetric together means: only diagonal cells, any of them.)</p>")}` },
    ],
    takeaways: [
      "Diagonal: reflexive / irreflexive. Mirror: symmetric / antisymmetric. Paths: transitive.",
      "Prove a property from arbitrary elements; disprove it with one counterexample.",
      "The word pairs are not opposites; vacuous cases count.",
    ],
  },
  {
    slug: "3-inverse", nav: "Inverse", title: "The Inverse of a Relation",
    subtitle: "Swap every pair: the mirror image",
    abstract: "R⁻¹ swaps every pair, which mirrors the grid in its diagonal: the inverse of ≤ is ≥, of “beats” is “loses to”. A relation is symmetric exactly when it equals its inverse.",
    tags: ["R⁻¹", "transpose", "R = R⁻¹"],
    hero: "mirror", heroCaption: "Press Mirror to swap every pair.",
    sections: [
      { id: "inverse", title: "Swapping every pair", html: String.raw`
        ${callout("note", "DEFINITION · INVERSE", `<p>The <b>inverse</b> of \\(R\\) is \\(R^{-1} = \\{(y, x) : (x, y) \\in R\\}\\).</p>`)}
        <p>In the grid the inverse is the mirror image in the diagonal. The inverse of “\(\le\)” is “\(\ge\)”:</p>
        ${run("inverse")}
        ${demo("mirror", "Demo 2 · The mirror", "pick a relation, then mirror it", "Symmetric relations (neighbours, same parity, =) do not change.")}
        <p><b>Theorem 1.</b> \(R\) is symmetric if and only if \(R = R^{-1}\).</p>
        <p><em>Proof.</em> (\(\Rightarrow\)) Let \(R\) be symmetric. If \((x, y) \in R\), then \((y, x) \in R\), so \((x, y) \in R^{-1}\): \(R \subseteq R^{-1}\). If \((x, y) \in R^{-1}\), then \((y, x) \in R\), so \((x, y) \in R\) by symmetry: \(R^{-1} \subseteq R\). (\(\Leftarrow\)) If \(R = R^{-1}\) and \(x \mathrel{R} y\), then \((y, x) \in R^{-1} = R\). \(\square\)</p>
        ${run("symInverse")}
        ${predict("If \\(R\\) is transitive, is \\(R^{-1}\\) transitive?", "<p>Yes. If \\(x \\mathrel{R^{-1}} y\\) and \\(y \\mathrel{R^{-1}} z\\), then \\(z \\mathrel{R} y\\) and \\(y \\mathrel{R} x\\), so \\(z \\mathrel{R} x\\), that is \\(x \\mathrel{R^{-1}} z\\). Exercise 4.</p>")}` },
    ],
    takeaways: [
      "R⁻¹ swaps every pair: the grid mirrored in its diagonal.",
      "R is symmetric exactly when R = R⁻¹.",
    ],
  },
  {
    slug: "4-equivalence", nav: "Equivalence", title: "Equivalence Relations and Congruence",
    subtitle: "Relations that behave like “=”",
    abstract: "Reflexive, symmetric and transitive: equality, same parity, same weekday. “Close to” is not one. Congruence mod n is, and the proof checks the three properties one by one.",
    tags: ["equivalence relation", "a ≡ b (mod n)", "weekdays"],
    hero: "code:mod", heroCaption: "Day 0 is a Wednesday: day 100 and day −10",
    sections: [
      { id: "def", title: "Equivalence relations", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION · EQUIVALENCE RELATION", `<p>A relation is an <b>equivalence relation</b> if it is reflexive, symmetric and transitive.</p>`)}
        <p>Examples: equality; same parity; born in the same month; same weekday. Non-examples: “\(\le\)” is not symmetric; the neighbours are not reflexive or transitive.</p>
        ${callout("pitfall", "PITFALL · “CLOSE TO” IS NOT AN EQUIVALENCE RELATION", `<p>“Lives within one kilometre of” is reflexive and symmetric but not transitive: 0.8 km from Ana to Bo and 0.8 km from Bo to Cy can leave Ana and Cy 1.6 km apart.</p>`)}` },
      { id: "mod", title: "Congruence modulo n", html: String.raw`
        ${callout("note", "DEFINITION · CONGRUENCE", `<p>For an integer \\(n \\ge 1\\), \\(a \\equiv b \\pmod n\\) if \\(n \\mid a - b\\), that is, \\(a - b = nk\\) for some integer \\(k\\).</p>`)}
        <p>\(23 \equiv 2 \pmod 7\) since \(21 = 7 \cdot 3\); \(-4 \equiv 2 \pmod 3\) since \(-6 = 3 \cdot (-2)\). Mod 7 is weekday arithmetic: if day 0 is a Wednesday, day 100 is a Friday and day \(-10\) a Sunday.</p>
        ${run("mod")}
        <p><b>Theorem 2.</b> Congruence modulo \(n\) is an equivalence relation on \(\mathbb Z\).</p>
        <p><em>Reflexive:</em> \(a - a = 0 = n \cdot 0\). <em>Symmetric:</em> if \(a - b = nk\), then \(b - a = n(-k)\). <em>Transitive:</em> if \(a - b = nk\) and \(b - c = nm\), then \(a - c = (a - b) + (b - c) = n(k + m)\). \(\square\)</p>
        <p>The transitive step as an identity in all the letters at once:</p>
        ${run("sympyTrans")}
        ${callout("pattern", "PATTERN · PROVING AN EQUIVALENCE RELATION", `<p>Three separate proofs from arbitrary elements: reflexive (one element), symmetric (two), transitive (three). One counterexample to one property shows a relation is <em>not</em> an equivalence relation.</p>`)}` },
    ],
    takeaways: [
      "Equivalence relation = reflexive + symmetric + transitive.",
      "a ≡ b (mod n) means n | a − b; it is an equivalence relation.",
      "“Close to” fails transitivity.",
    ],
  },
  {
    slug: "5-classes", nav: "Classes", title: "Equivalence Classes",
    subtitle: "Everything related to a",
    abstract: "The class [a] collects everything related to a. Mod 3 there are three classes, the columns of 0 … 11 in rows of three. Classes are nonempty, equal or disjoint, and cover the set.",
    tags: ["[a]", "mod 3", "equal or disjoint"],
    hero: "classes", heroCaption: "Change n, a and b.",
    sections: [
      { id: "classes", title: "Classes mod 3", html: String.raw`
        ${callout("note", "DEFINITION · EQUIVALENCE CLASS", `<p>For an equivalence relation \\(R\\) on \\(A\\) and \\(a \\in A\\), the <b>equivalence class</b> of \\(a\\) is \\([a] = \\{x \\in A : x \\mathrel{R} a\\}\\).</p>`)}
        <p>Mod 3: \([0] = \{\dots, -3, 0, 3, 6, \dots\}\), \([1] = \{\dots, -2, 1, 4, 7, \dots\}\), \([2] = \{\dots, -1, 2, 5, 8, \dots\}\). Write \(0, \dots, 11\) in rows of three: each column is a class.</p>
        ${run("classes3")}
        ${demo("classes", "Demo 3 · Classes mod n", "change n; type two numbers", "The outlined column is the class of a. Try a negative a.")}` },
      { id: "theorem", title: "Equal or disjoint", html: String.raw`
        <p><b>Theorem 3.</b> Let \(R\) be an equivalence relation on \(A\). (1) \(a \in [a]\), so no class is empty. (2) If \(a \mathrel{R} b\), then \([a] = [b]\). (3) If \([a] \cap [b] \ne \varnothing\), then \([a] = [b]\). (4) The union of the classes is \(A\).</p>
        <p><em>Proof.</em> (1) Reflexivity. (2) If \(x \in [a]\), then \(x \mathrel{R} a\) and \(a \mathrel{R} b\) give \(x \mathrel{R} b\) by transitivity, so \([a] \subseteq [b]\); by symmetry \(b \mathrel{R} a\), and the same argument gives \([b] \subseteq [a]\). (3) If \(c\) is in both, \(c \mathrel{R} a\) and \(c \mathrel{R} b\); symmetry and transitivity give \(a \mathrel{R} b\); use (2). (4) Every \(a\) lies in \([a]\). \(\square\)</p>
        ${run("classOf")}
        ${callout("pitfall", "PITFALL · DIFFERENT NAMES, SAME CLASS", `<p>“\\([1]\\) and \\([4]\\) are different classes, because \\(1 \\ne 4\\)” is wrong: \\([1] = [4] = \\{1, 4, 7, 10\\}\\) in \\(\\{0, \\dots, 11\\}\\). Check whether \\(a \\mathrel{R} b\\), not whether \\(a = b\\).</p>`)}` },
    ],
    takeaways: [
      "[a] is the set of everything related to a.",
      "Classes are nonempty, equal or disjoint, and cover the set.",
      "[a] = [b] exactly when a R b.",
    ],
  },
  {
    slug: "6-partitions", nav: "Partitions", title: "Partitions, and Equality in Programs",
    subtitle: "Two descriptions of the same thing",
    abstract: "The classes of an equivalence relation form a partition, and every partition gives back an equivalence relation: “in the same part”. A 4-element set has 15 of each. In code, == must be an equivalence relation too.",
    tags: ["partition", "15 = 15", "NaN"],
    hero: "partition", heroCaption: "Click the numbers to regroup them.",
    sections: [
      { id: "partition", title: "Partitions", html: String.raw`
        ${callout("note", "DEFINITION · PARTITION", `<p>A <b>partition</b> of \\(A\\) is a set of nonempty subsets of \\(A\\) (the parts) that are pairwise disjoint and whose union is \\(A\\).</p>`)}
        <p><b>Theorem 4.</b> For a partition \(\mathcal P\) of \(A\), “\(x\) and \(y\) are in the same part” is an equivalence relation whose classes are the parts.</p>
        <p><em>Proof.</em> Reflexive: the parts cover \(A\), so each \(x\) is in some part. Symmetric: clear. Transitive: if \(x, y \in P\) and \(y, z \in Q\), then \(y \in P \cap Q\), so \(P = Q\) (different parts are disjoint) and \(x, z \in P\). \(\square\)</p>
        <p>For \(\{\{1, 4\}, \{2, 3, 6\}, \{5\}\}\) the relation has \(2^2 + 3^2 + 1^2 = 14\) pairs: three blocks on the diagonal.</p>
        ${run("partition")}
        ${demo("partition", "Demo 4 · From a partition to an equivalence relation", "click to move numbers between parts", "Untick the box to list 1 … 6 in order: the blocks break up, but the relation is the same.")}
        <p>The partitions of \(\{1, 2, 3, 4\}\), counted: 15, exactly the number of equivalence relations found among all 65536 relations in chapter 2.</p>
        ${run("partitions")}
        ${predict("How many equivalence relations does a 3-element set have?", "<p>Five, one per partition: \\(\\{1,2,3\\}\\); \\(\\{1\\},\\{2,3\\}\\); \\(\\{2\\},\\{1,3\\}\\); \\(\\{3\\},\\{1,2\\}\\); \\(\\{1\\},\\{2\\},\\{3\\}\\).</p>")}` },
      { id: "code", title: "Equality in programs", html: String.raw`
        ${callout("note", "CS · WHEN == IS NOT AN EQUIVALENCE RELATION", `<p>A Python <code>set</code> or <code>dict</code> sorts keys that compare equal into one place, which only works if <code>==</code> is reflexive, symmetric and transitive. Floating-point NaN is not equal to itself (not reflexive), and equality up to a tolerance, <code>abs(x - y) &lt; 0.1</code>, is not transitive. Hash tables put a key in bucket <code>hash(key) % m</code>: the buckets are the classes mod \\(m\\).</p>`)}
        ${run("floats")}` },
    ],
    takeaways: [
      "Classes of an equivalence relation = a partition, and back.",
      "A 4-element set has 15 partitions and 15 equivalence relations.",
      "Code that groups equal keys needs == to be an equivalence relation.",
    ],
  },
  {
    slug: "7-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and a checklist for reading an AI's claim that a relation is an equivalence relation.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant will happily tell you whether a relation is an equivalence relation, and it is often wrong on transitivity, the property that needs three elements. Check: (1) is each property proved from arbitrary elements, or only shown on an example? (2) for transitivity, was <em>every</em> pair of steps checked? (3) write the relation as a set of pairs and run the five tests; (4) are the classes nonempty, disjoint, and do they cover the set?</p>
        <p>Check (3) on “\(x\) and \(y\) share a prime factor” on \(\{2, \dots, 10\}\): reflexive and symmetric, so it looks like an equivalence relation.</p>
        ${run("aiCheck")}
        <p>2 and 6 share 2, 6 and 3 share 3, but 2 and 3 share nothing: not transitive. A test on a finite set can find the counterexample; only a proof covers an infinite set.</p>` },
    ],
    takeaways: [
      "Diagonal, mirror, paths: read the properties off the grid.",
      "Equivalence relation: prove all three properties.",
      "Classes partition the set; [a] = [b] exactly when a R b.",
    ],
  },
];
