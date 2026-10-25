// Chapter content, adapted from notes/L03-lists-sets.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L03-1.mp4";
const VIDEO_P2 = "media/L03-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 3,
  title: "Lists, Sets and Counting",
  tagline: "Order matters, or it doesn't",
  lead: "Three-letter codes from A, C, G, T, a grid with its diagonal struck out, a power set built from yes/no questions, and set operations shaded on a board of numbers. Interactive notes on counting lists and working with sets, where every number was checked by running code.",
  heroDemo: "gridMini",
  heroLabel: "Lists of length 2 as a grid",
  heroCaption: "Rows: first letter; columns: second letter. 4 · 4 = 16 lists; strike the diagonal and 4 · 3 = 12 have no repeat.",
  whyTitle: "Why lists and sets",
  whySub: "The two ways of collecting objects, and how to count them",
  why: [
    ["Lists: order matters", "\\((\\mathtt A, \\mathtt C) \\ne (\\mathtt C, \\mathtt A)\\). Lists of length \\(k\\) from \\(n\\) objects: \\(n^k\\) with repetition, \\((n)_k = n(n-1)\\cdots(n-k+1)\\) without."],
    ["Sets: only membership", "\\(\\{2, 5\\} = \\{5, 2, 5\\}\\). A set of \\(n\\) elements has \\(2^n\\) subsets: one yes/no answer per element."],
    ["Proofs about sets", "Two sets are equal when each is a subset of the other. Chase an arbitrary element, or check all 8 rows of a membership table."],
  ],
  ctaTitle: "Ready to count?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 3 · Part 1 — Counting lists",
    [VIDEO_P2]: "Lecture 3 · Part 2 — Sets, subsets and set operations",
  },
};

const CHAPTERS = [
  {
    slug: "1-lists", nav: "Lists", title: "Lists and the Multiplication Principle",
    subtitle: "Order matters, repetition is allowed",
    abstract: "How many three-letter codes can a lab make from A, C, G, T? A list is a sequence in a definite order; the multiplication principle counts lists one position at a time.",
    tags: ["codes", "ordered pairs", "multiplication principle"],
    hero: "code:codes", heroCaption: "64 codes, 24 without a repeated letter",
    sections: [
      { id: "codes", title: "How many codes?", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A lab gives each sample a code of three letters from the four DNA bases \(\mathtt A, \mathtt C, \mathtt G, \mathtt T\), such as \(\mathtt{GAT}\) or \(\mathtt{TTA}\). How many codes are there, and how many if no letter may be used twice? Let the computer write them all out:</p>
        ${run("codes")}
        <p>Writing them out works for three letters from four, not for a 6-character password from 62 symbols. This lecture gives the two formulas behind 64 and 24.</p>
        ${predict("Why is the second number \\(4 \\cdot 3 \\cdot 2\\) and not \\(4^3 - 4\\) (all codes minus \\(\\mathtt{AAA}, \\mathtt{CCC}, \\mathtt{GGG}, \\mathtt{TTT}\\))?",
          "<p>Codes like \\(\\mathtt{GAG}\\) repeat a letter too. 40 of the 64 codes have a repeated letter, not 4 (chapter 2).</p>")}` },
      { id: "lists", title: "Lists", html: String.raw`
        ${callout("note", "DEFINITION · LIST", `<p>A <b>list</b> is a finite sequence of objects in a definite order, such as \\((3, 1, 3)\\). Its <b>entries</b> may repeat; its <b>length</b> is the number of entries. The list of length 0 is the <b>empty list</b> \\(()\\). Two lists are equal when they have the same length and the same entry in every position.</p>`)}
        <p>So \((3, 1, 3) \ne (1, 3, 3)\). A list of length 2 is an <b>ordered pair</b>. Python's tuples behave the same way:</p>
        ${run("listEq")}
        ${callout("note", "DEFINITION · MULTIPLICATION PRINCIPLE", `<p>If the first entry can be chosen in \\(a\\) ways and then, whatever it was, the second in \\(b\\) ways, there are \\(a \\cdot b\\) lists of length 2. For longer lists the numbers of choices multiply, as long as the number of choices at each position does not depend on what was chosen before.</p>`)}
        <p><b>The picture.</b> A row for each first entry, a column for each second entry: each cell is one list. Here are the 16 two-letter codes:</p>
        ${run("grid")}
        ${demo("grid", "Demo 1 · Lists as a grid", "change n and k, strike the diagonal", "Each cell is one list of length 2. Without repetition the diagonal goes: n · n − n = n(n − 1).")}
        ${callout("pitfall", "PITFALL · THE NUMBER OF CHOICES MUST NOT CHANGE", `<p>Codes whose second letter comes later in the alphabet: 3 choices after A, 2 after C, 1 after G, none after T. That is \\(3 + 2 + 1 + 0 = 6\\), and no product gives it, because the number of second choices depends on the first.</p>`)}
        ${run("later")}` },
    ],
    takeaways: [
      "A list keeps order and may repeat entries.",
      "Multiply the numbers of choices, when each number does not depend on earlier choices.",
    ],
  },
  {
    slug: "2-counting", nav: "Counting", title: "Counting Lists and Factorials",
    subtitle: "n^k with repetition, (n)_k without",
    abstract: "Two theorems count all lists of length k from n objects, with and without repetition. Factorials count arrangements; 0! = 1 because there is exactly one empty list.",
    tags: ["n^k", "falling factorial", "n!"],
    hero: "code:theorems", heroCaption: "Both theorems against a direct count",
    sections: [
      { id: "theorems", title: "Two theorems", html: String.raw`
        <p><b>Theorem 1.</b> The number of lists of length \(k\) from \(n\) objects, repetition allowed, is \(n^k\). <em>Proof.</em> Each of the \(k\) positions has \(n\) choices whatever the others hold; by the multiplication principle the count is \(n \cdot n \cdots n = n^k\). For \(k = 0\) there is one list, the empty list, and \(n^0 = 1\). \(\square\)</p>
        <p><b>Theorem 2.</b> Without repetition the number is the <b>falling factorial</b></p>
        $$(n)_k = n\,(n - 1) \cdots (n - k + 1) \qquad (k \text{ factors}).$$
        <p><em>Proof.</em> The first entry has \(n\) choices, the second the \(n - 1\) objects not used yet, and so on, until the \(k\)-th has \(n - (k - 1)\). <em>Which</em> objects are left depends on the earlier choices, but <em>how many</em> does not, so the principle applies. \(\square\)</p>
        <p>For \(k > n\) one factor is 0, so \((n)_k = 0\); for \(k = 0\) the empty product is 1. The program checks both theorems for every \(n, k \le 5\) (the proofs cover all of them):</p>
        ${run("theorems")}
        <p>The codes: \(4^3 = 64\), and \((4)_3 = 24\) without a repeated letter. The shortcut \(64 - 4\) misses codes like \(\mathtt{GAG}\):</p>
        ${run("minusFour")}
        ${callout("pattern", "PATTERN · COUNTING BY POSITIONS", `<ol><li>Name the positions.</li><li>Say how many choices each position has once the earlier ones are fixed.</li><li>Check that this number does not depend on <em>which</em> earlier choices were made.</li><li>Multiply. If step 3 fails, split into cases and add.</li></ol>`)}
        <p>Demo 1 (chapter 1) also counts longer lists: pick a length \(k\) and it writes out every list and compares the count with \(n^k\) and \((n)_k\).</p>` },
      { id: "factorials", title: "Factorials", html: String.raw`
        ${callout("note", "DEFINITION · FACTORIAL", `<p>For \\(n \\ge 0\\), \\(n! = (n)_n = n\\,(n - 1) \\cdots 2 \\cdot 1\\), the number of arrangements of \\(n\\) objects, and \\(0! = 1\\).</p>`)}
        <p>\(0! = 1\) because there is exactly one list of length 0. Five books can stand in \(5! = 120\) orders:</p>
        ${run("factorials")}
        <p>For \(0 \le k \le n\), \((n)_k = \dfrac{n!}{(n - k)!}\). A club of 9 electing a president, secretary and treasurer: \((9)_3 = 504\).</p>
        ${run("fallingFact")}
        ${callout("pitfall", "PITFALL · (n)_k IS NOT “CHOOSING k THINGS”", `<p>A committee of three without titles is counted \\(3! = 6\\) times in \\((9)_3\\), once per order. Lists count orders; sets do not.</p>`)}
        ${predict("How many 4-digit PINs have no repeated digit, and how many have at least one repeat?", "<p>\\((10)_4 = 5040\\) without a repeat, so \\(10^4 - 5040 = 4960\\) with one. Exercise 1.</p>")}` },
    ],
    takeaways: [
      "With repetition: n^k lists of length k.",
      "Without: (n)_k = n(n − 1)…(n − k + 1) = n!/(n − k)!.",
      "0! = 1 and (n)_k = 0 for k > n.",
    ],
  },
  {
    slug: "3-sets", nav: "Sets", title: "Sets, Subsets and the Power Set",
    subtitle: "Only membership counts",
    abstract: "A set forgets order and repetition. Element is not subset. A set of n elements has 2ⁿ subsets, because a subset is a list of n yes/no answers.",
    tags: ["∈ and ⊆", "∅", "2ⁿ subsets"],
    hero: "powerset", heroCaption: "Toggle the questions: is a in it? is b?",
    sections: [
      { id: "sets", title: "Sets", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION · SET", `<p>A <b>set</b> is a collection of objects in which order and repetition do not matter; the objects are its <b>elements</b>, \\(x \\in A\\). Sets are equal when they have the same elements. The number of elements of a finite set is its <b>cardinality</b> \\(|A|\\); the <b>empty set</b> \\(\\emptyset\\) has none.</p>`)}
        <p>So \(\{2, 5\} = \{5, 2, 5\}\) and \(|\{2, 5, 5\}| = 2\). Sets can be given by a property, \(\{x \in \mathbb Z : x^2 < 5\} = \{-2, -1, 0, 1, 2\}\):</p>
        ${run("setEq")}
        <p>\(\mathbb N, \mathbb Z, \mathbb Q, \mathbb R\) are infinite. \(\mathbb N, \mathbb Z, \mathbb Q\) can be listed \(a_0, a_1, \dots\) (<b>countably infinite</b>); \(\mathbb R\) cannot (<b>uncountable</b>). Here \(|A|\) is always for a finite set.</p>
        ${callout("pitfall", "PITFALL · ∅ IS NOT {∅}", `<p>\\(|\\emptyset| = 0\\) but \\(|\\{\\emptyset\\}| = 1\\): an empty box, and a box holding an empty box.</p>`)}` },
      { id: "subsets", title: "Subsets and the power set", html: String.raw`
        ${callout("note", "DEFINITION · SUBSET, POWER SET", `<p>\\(A \\subseteq B\\) when every element of \\(A\\) is an element of \\(B\\). The <b>power set</b> \\(2^A\\) is the set of all subsets of \\(A\\).</p>`)}
        <p>\(A \subseteq A\), and \(\emptyset \subseteq A\) for every \(A\) ("if \(x \in \emptyset\) then \(x \in A\)" is vacuously true). With \(B = \{1, 2\}\): \(1 \in B\) and \(\{1\} \subseteq B\), but \(\{1\} \notin B\).</p>
        <p><b>The picture.</b> A subset of \(\{a, b, c\}\) is three yes/no answers: \(\{a, c\} \leftrightarrow (1, 0, 1)\).</p>
        ${run("powerset")}
        <p><b>Theorem 3.</b> If \(|A| = n\), then \(|2^A| = 2^n\). <em>Proof.</em> Name the elements \(a_1, \dots, a_n\) and send a subset \(S\) to the 0/1 list with \(s_i = 1\) exactly when \(a_i \in S\). Different subsets give different lists, and every list comes from a subset. So subsets and 0/1 lists of length \(n\) match one to one, and by Theorem 1 there are \(2^n\) lists. \(\square\)</p>
        ${demo("powerset", "Demo 2 · The power set, one question at a time", "add elements, ask about one")}
        ${run("doubling")}
        ${callout("pattern", "PATTERN · COUNTING BY A CORRESPONDENCE", `<p>Match the objects one to one with lists you can count. Prove both halves: different objects give different lists, and every list comes from some object.</p>`)}
        ${predict("How many subsets of \\(\\{1, \\dots, 6\\}\\) contain 1 but not 2?", "<p>Two positions of the 0/1 list are fixed, four are free: \\(2^4 = 16\\). Exercise 3.</p>")}` },
    ],
    takeaways: [
      "Sets: no order, no repetition; equal when they have the same elements.",
      "x ∈ A is not X ⊆ A; ∅ ⊆ A always.",
      "|2^A| = 2^|A|: a subset is a 0/1 list.",
    ],
  },
  {
    slug: "4-operations", nav: "Operations", title: "Set Operations",
    subtitle: "Union, intersection, difference, product",
    abstract: "On the board of numbers 1 to 10, the even numbers E and the multiples of three T: every operation is a shading. Difference depends on the order; the Cartesian product is a set of lists.",
    tags: ["∪ ∩ −", "Δ", "A × B"],
    hero: "board", heroCaption: "Pick two sets and an operation",
    sections: [
      { id: "ops", title: "Five operations", html: String.raw`
        ${callout("note", "DEFINITION · SET OPERATIONS", `<p>\\(A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}\\); \\(A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}\\); \\(A - B = \\{x : x \\in A,\\ x \\notin B\\}\\); \\(A \\,\\Delta\\, B = (A - B) \\cup (B - A)\\); \\(A \\times B = \\{(a, b) : a \\in A,\\ b \\in B\\}\\). \\(A\\) and \\(B\\) are <b>disjoint</b> when \\(A \\cap B = \\emptyset\\).</p>`)}
        <p>With \(E = \{2, 4, 6, 8, 10\}\) and \(T = \{3, 6, 9\}\):</p>
        ${run("ops")}
        <p>\(|A \cup B| = |A| + |B| - |A \cap B|\): adding \(|E| + |T| = 8\) counts the shared 6 twice. And \(E - T \ne T - E\).</p>
        ${demo("board", "Demo 3 · Operations on a board", "choose A, B and an operation", "The counting rule |A ∪ B| = |A| + |B| − |A ∩ B| is checked for every choice.")}` },
      { id: "product", title: "Cartesian product and laws", html: String.raw`
        <p>A pair \((a, b)\) has \(|A|\) choices for \(a\) and \(|B|\) for \(b\), so \(|A \times B| = |A| \cdot |B|\). The grid of chapter 1 is \(\{\mathtt A, \mathtt C, \mathtt G, \mathtt T\} \times \{\mathtt A, \mathtt C, \mathtt G, \mathtt T\}\).</p>
        ${run("cart")}
        <p><b>Laws.</b> For all sets: commutative \(A \cup B = B \cup A\), \(A \cap B = B \cap A\); associative; \(A \cup \emptyset = A\), \(A \cap \emptyset = \emptyset\); distributive \(A \cap (B \cup C) = (A \cap B) \cup (A \cap C)\) and \(A \cup (B \cap C) = (A \cup B) \cap (A \cup C)\); and <b>De Morgan's laws</b></p>
        $$A - (B \cup C) = (A - B) \cap (A - C), \qquad A - (B \cap C) = (A - B) \cup (A - C).$$` },
    ],
    takeaways: [
      "Union, intersection, difference, symmetric difference are shadings of a board.",
      "|A ∪ B| = |A| + |B| − |A ∩ B|; |A × B| = |A| · |B|.",
      "A − B ≠ B − A in general.",
    ],
  },
  {
    slug: "5-proofs", nav: "Proofs", title: "Proving Two Sets Are Equal",
    subtitle: "Double inclusion and membership tables",
    abstract: "Chase an arbitrary element into the other set, both ways. A membership table with all 8 rows is a proof too; one example never is, and one counterexample kills a false law.",
    tags: ["double inclusion", "De Morgan", "8 rows"],
    hero: "table", heroCaption: "Choose two sides and read the 8 rows",
    sections: [
      { id: "double", title: "Double inclusion", html: String.raw`
        ${callout("pattern", "PATTERN · PROOF BY DOUBLE INCLUSION", `<ol><li><b>X ⊆ Y.</b> Let \\(x \\in X\\) be arbitrary; unpack the definitions until \\(x \\in Y\\).</li><li><b>Y ⊆ X.</b> The same from an arbitrary \\(x \\in Y\\).</li><li><b>Conclude</b> \\(X = Y\\).</li></ol>`)}
        <p><b>Theorem 4 (De Morgan).</b> \(A - (B \cup C) = (A - B) \cap (A - C)\).</p>
        <p><em>(⊆)</em> Let \(x \in A - (B \cup C)\): \(x \in A\) and \(x \notin B \cup C\), so \(x \notin B\) and \(x \notin C\). Hence \(x \in A - B\) and \(x \in A - C\). <em>(⊇)</em> Let \(x \in (A - B) \cap (A - C)\): \(x \in A\), \(x \notin B\), \(x \notin C\), so \(x \notin B \cup C\) and \(x \in A - (B \cup C)\). Each side is a subset of the other. \(\square\)</p>
        <p>On the board with \(A = \{1, \dots, 10\}\), \(B = E\), \(C = T\) both sides are \(\{1, 5, 7\}\) (an example, not a proof):</p>
        ${run("demorganBoard")}
        <p><b>Theorem 5 (distributive).</b> \(A \cap (B \cup C) = (A \cap B) \cup (A \cap C)\). <em>(⊆)</em> If \(x \in A\) and \(x \in B\) or \(C\), then \(x\) is in \(A \cap B\) or in \(A \cap C\). <em>(⊇)</em> Either case gives \(x \in A\) and \(x \in B \cup C\). \(\square\)</p>` },
      { id: "tables", title: "Membership tables", html: String.raw`
        <p>For one element, only three facts matter: is it in \(A\), in \(B\), in \(C\)? That is \(2^3 = 8\) patterns. If both sides agree in all 8 rows, every element is in both or neither, whatever the sets: the table <em>is</em> a proof, like a truth table in Lecture 2.</p>
        ${run("membership")}
        ${run("laws")}
        ${demo("table", "Demo 4 · Membership table", "pick the two sides", "Try the wrong law A − (B ∩ C) = (A − B) ∩ (A − C): two rows disagree, and each gives a counterexample.")}
        ${callout("pitfall", "PITFALL · ONE EXAMPLE IS NOT A PROOF", `<p>A wrong identity can hold for many examples. Prove it by double inclusion or a full membership table.</p>`)}
        <p>The wrong "law" \(A - (B \cap C) = (A - B) \cap (A - C)\) agrees on one careless example; the table finds the rows where it fails, and \(A = \{1, 2\}\), \(B = \{1\}\), \(C = \{2\}\) is a counterexample:</p>
        ${run("wrongLaw")}
        ${callout("note", "CS · SETS AS BITS", `<p>Programs store a subset of \\(\\{a_0, \\dots, a_{n-1}\\}\\) as an integer whose bit \\(i\\) says whether \\(a_i\\) is in it: the 0/1 list of Theorem 3. Union is <code>|</code>, intersection <code>&amp;</code>, symmetric difference <code>^</code>, difference <code>A &amp; ~B</code>, and a loop over \\(0, \\dots, 2^n - 1\\) visits every subset.</p>`)}
        ${run("bits")}` },
    ],
    takeaways: [
      "X = Y: prove X ⊆ Y and Y ⊆ X by chasing an arbitrary element.",
      "A full membership table (all 2³ rows) is a proof.",
      "One counterexample kills a false law.",
    ],
  },
  {
    slug: "6-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's count",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and a checklist for reading counts and set proofs that an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant counts and proves fast, and is often confidently wrong. Check it: (1) shrink the problem and let <code>itertools</code> list everything; (2) is the number of choices at each position really independent of earlier choices? (3) in an element-chasing proof, is every step a definition, and are both inclusions done? (4) check a set identity with the full membership table; (5) with sets of sets, check each \(\in\) and \(\subseteq\) separately.</p>
        <p>Check (1) on a made-up answer: "codes of 3 letters from ACGT with at least one A: \(3 \cdot 4^2 = 48\)".</p>
        ${run("aiCheck")}
        <p>The true count is \(37 = 64 - 27\). The answer 48 counts \(\mathtt{AAG}\) once for each position of an A, so its "choices" do not give different codes.</p>` },
    ],
    takeaways: [
      "Shrink a counting problem and list everything to check a formula.",
      "Check set laws with all 8 rows, never one example.",
    ],
  },
];
