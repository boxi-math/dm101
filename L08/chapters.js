// Chapter content, adapted from notes/L08-functions.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L08-1.mp4";
const VIDEO_P2 = "media/L08-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 8,
  title: "Functions",
  tagline: "One arrow out of every input",
  lead: "Four students, five seats and a seating plan: is it a function, does any seat get two students, is any seat empty, can it be read backwards? Interactive notes on functions, one-to-one and onto, composition, inverses, the pigeonhole principle and the sizes of infinite sets, where every number was checked by running code.",
  heroDemo: "arrowMini",
  heroLabel: "A function as an arrow diagram",
  heroCaption: "Every student sends exactly one arrow. One-to-one: no seat gets two. Onto: no seat is missed.",
  whyTitle: "Why functions",
  whySub: "The language for matching, encoding and counting",
  why: [
    ["One arrow out of every input", "A function \\(f : A \\to B\\) is a set of pairs in which every \\(a \\in A\\) has <b>exactly one</b> partner \\(f(a)\\)."],
    ["Shared outputs, missed outputs", "<b>One-to-one</b>: no output is shared. <b>Onto</b>: no output is missed. Both together, a <b>bijection</b>, is exactly when the arrows can be turned round."],
    ["Counting with functions", "Seven students in six seats must share: the <b>pigeonhole principle</b>. And bijections compare infinite sets: \\(\\mathbb N\\) and \\(\\mathbb Z\\) have the same size, a set and its power set never do."],
  ],
  ctaTitle: "Ready to draw some arrows?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 8 · Part 1 — Functions: one arrow out of every input",
    [VIDEO_P2]: "Lecture 8 · Part 2 — Composition, inverses and the pigeonhole principle",
  },
};

const CHAPTERS = [
  {
    slug: "1-functions", nav: "Functions", title: "A Function Is a Set of Pairs",
    subtitle: "Seating plans, domain, codomain and image",
    abstract: "A seating plan for four students and five seats raises four questions. The first one, every student gets exactly one seat, is the definition of a function.",
    tags: ["seating plan", "relation", "domain", "image"],
    hero: "arrows", heroCaption: "Tick the pairs of a relation from students to seats.",
    sections: [
      { id: "plans", title: "Seating plans", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Four students, Ana, Ben, Cai and Dev, come to a room with five seats. A seating plan is a list of pairs (student, seat):</p>
        $$P = \{(\text{Ana}, 2),\ (\text{Ben}, 5),\ (\text{Cai}, 2),\ (\text{Dev}, 4)\}.$$
        <p>Four questions about any plan: (1) does every student get exactly one seat? (2) does any seat get two students? (3) is any seat left empty? (4) can the plan be read backwards, "who sits in seat 2?", with one answer for every seat?</p>
        ${run("plan")}
        <p>Question 1: yes. Ana and Cai share seat 2, seats 1 and 3 are empty, and "who sits in seat 2?" has two answers. The four questions have names: <b>function</b>, <b>one-to-one</b>, <b>onto</b>, and <b>bijection</b> (an <b>inverse</b> exists).</p>
        ${predict("Seven students come to a room with six seats. Can every student get a seat of their own?", "<p>No: six seats hold at most six students alone, so some seat gets two. That is the pigeonhole principle of chapter 5.</p>")}` },
      { id: "pairs", title: "The definition", html: String.raw`
        ${callout("note", "DEFINITION · FUNCTION", `<p>A relation \\(f \\subseteq A \\times B\\) is a <b>function</b> if \\((a, b_1) \\in f\\) and \\((a, b_2) \\in f\\) imply \\(b_1 = b_2\\); we write \\(f(a) = b\\). Its <b>domain</b> is the set of first elements, its <b>image</b> \\(\\operatorname{im} f = \\{f(a)\\}\\). \\(f : A \\to B\\) means \\(\\operatorname{dom} f = A\\) and \\(\\operatorname{im} f \\subseteq B\\); \\(B\\) is the <b>codomain</b>.</p>`)}
        <p>So \(f : A \to B\) asks two things of the arrows: <b>every</b> element of \(A\) has an arrow leaving it, and <b>none</b> has two. Two plans that fail: \(Q_1 = P \cup \{(\text{Ben}, 1)\}\) gives Ben two seats; \(Q_2 = P \setminus \{(\text{Dev}, 4)\}\) leaves Dev without one.</p>
        ${run("isfunc")}
        ${demo("arrows", "Demo 1 · Build a relation", "tick pairs (student, seat)", "Give Ben a second seat, or untick Dev's: the verdict changes. Then make a plan that is one-to-one.")}
        <p>Functions on numbers are sets of pairs too. \(n \mapsto n^2\) is a function on \(\mathbb Z\); the relation "\(y^2 = x\)" is not, since it contains \((4, 2)\) and \((4, -2)\).</p>
        ${run("squares")}
        <p>There are \(|B|^{|A|}\) functions from a finite set \(A\) to a finite set \(B\): \(5^4 = 625\) seating plans.</p>
        ${run("countplans")}
        ${callout("pitfall", "PITFALL · IMAGE IS NOT CODOMAIN", `<p>For \\(P\\) the codomain is all five seats; the image is \\(\\{2, 4, 5\\}\\). "Onto" (next chapter) depends on the codomain.</p>`)}` },
    ],
    takeaways: [
      "f : A → B: every a ∈ A has exactly one partner f(a) ∈ B.",
      "The image is what f reaches; the codomain is where it may land.",
      "There are |B|^|A| functions from A to B.",
    ],
  },
  {
    slug: "2-injective", nav: "One-to-one, onto", title: "One-to-One and Onto",
    subtitle: "No output shared, no output missed",
    abstract: "Definitions with their quantifiers, the proof templates, and two functions on the integers: 3n + 2 is one-to-one and not onto, |n| is onto and not one-to-one.",
    tags: ["injective", "surjective", "3n + 2", "|n|"],
    hero: "code:threen", heroCaption: "Which b are hit by 3n + 2?",
    sections: [
      { id: "defs", title: "The definitions", html: String.raw`
        ${callout("note", "DEFINITION · ONE-TO-ONE, ONTO", `<p>\\(f : A \\to B\\) is <b>one-to-one</b> (injective) if \\(f(a) = f(a')\\) implies \\(a = a'\\): every \\(b\\) has <b>at most one</b> \\(a\\) with \\(f(a) = b\\). It is <b>onto</b> (surjective) if for every \\(b \\in B\\) there is <b>at least one</b> \\(a\\) with \\(f(a) = b\\).</p>`)}
        <p>In the arrow picture: one-to-one means no element of \(B\) receives two arrows; onto means every element of \(B\) receives at least one.</p>
        ${run("injsurj")}
        ${callout("pattern", "PATTERN · PROVING ONE-TO-ONE AND ONTO", `<ul><li><b>One-to-one:</b> assume \\(f(a) = f(a')\\), show \\(a = a'\\).</li><li><b>Onto:</b> take any \\(b \\in B\\), solve \\(f(a) = b\\) for \\(a\\), check that \\(a\\) <b>is in \\(A\\)</b> and \\(f(a) = b\\).</li><li><b>Not one-to-one:</b> two inputs \\(a \\ne a'\\) with the same output.</li><li><b>Not onto:</b> one \\(b\\) and a proof that nothing maps to it.</li></ul>`)}` },
      { id: "thm1", title: "Theorem 1: 3n + 2 on the integers", html: String.raw`
        <p><b>Theorem 1.</b> \(f : \mathbb Z \to \mathbb Z\), \(f(n) = 3n + 2\), is one-to-one and not onto.</p>
        <p><em>One-to-one.</em> If \(3n + 2 = 3n' + 2\), subtract 2 and divide by 3: \(n = n'\). <em>Not onto.</em> \(f(n) = 0\) would need \(n = -\tfrac23\), not an integer. \(\square\)</p>
        ${run("threen")}` },
      { id: "thm2", title: "Theorem 2: |n| from the integers to the naturals", html: String.raw`
        <p><b>Theorem 2.</b> \(g : \mathbb Z \to \mathbb N\), \(g(n) = |n|\), is onto and not one-to-one. <em>Onto:</em> for \(m \in \mathbb N\), \(g(m) = m\). <em>Not one-to-one:</em> \(g(3) = g(-3)\). \(\square\)</p>
        ${run("absval")}
        ${callout("pitfall", "PITFALL · “ONE-TO-ONE MEANS EACH INPUT HAS ONE OUTPUT”", `<p>That is the definition of a <em>function</em>. One-to-one is about outputs: none comes from two inputs. \\(|n|\\) gives each input one output and is still not one-to-one.</p>`)}
        ${demo("rule", "Demo 2 · Test a rule on a window", "pick a rule and a codomain", "A window can only refute: 3n + 2 misses 0 in any window, but proving one-to-one needs the algebra.")}
        ${predict("\\(x \\mapsto 3x + 2\\) is not onto as a map \\(\\mathbb Z \\to \\mathbb Z\\). Is it onto as a map \\(\\mathbb Q \\to \\mathbb Q\\)?", "<p>Yes: for any rational \\(y\\), \\(x = \\frac{y - 2}{3}\\) is rational and \\(3x + 2 = y\\). Same rule, different sets (chapter 3).</p>")}` },
    ],
    takeaways: [
      "One-to-one: f(a) = f(a′) ⇒ a = a′. Onto: every b is reached.",
      "In an onto proof, check that the a you found is in the domain.",
      "Disprove either property with one concrete example.",
    ],
  },
  {
    slug: "3-bijections", nav: "Bijections", title: "Bijections and Counting",
    subtitle: "Exactly one arrow into every element",
    abstract: "3x + 2 is a bijection of the rationals. Counting all plans for small sets shows the pattern behind the pigeonhole principle.",
    tags: ["bijection", "3x + 2 on Q", "counting"],
    hero: "code:countkinds", heroCaption: "Functions, one-to-one, onto: counted",
    sections: [
      { id: "bij", title: "Theorem 3: 3x + 2 on the rationals", html: String.raw`
        ${callout("note", "DEFINITION · BIJECTION", `<p>A function that is one-to-one and onto: every \\(b \\in B\\) has <b>exactly one</b> \\(a\\) with \\(f(a) = b\\).</p>`)}
        <p><b>Theorem 3.</b> \(h : \mathbb Q \to \mathbb Q\), \(h(x) = 3x + 2\), is a bijection. <em>One-to-one</em> as in Theorem 1. <em>Onto:</em> for \(y \in \mathbb Q\) put \(x = \frac{y - 2}{3}\); it is rational and \(h(x) = y\). \(\square\)</p>
        ${run("bijQ")}` },
      { id: "count", title: "Counting plans", html: String.raw`
        <p>How many of the 625 plans for four students and five seats are one-to-one, and how many onto? And for four students and three tables?</p>
        ${run("countkinds")}
        <p>\(120 = (5)_4\) one-to-one plans and none onto; with three tables none is one-to-one and 36 are onto; three students and three tables give \(3! = 6\) bijections. A one-to-one \(f : A \to B\) needs \(|A| \le |B|\), an onto one \(|A| \ge |B|\).</p>` },
    ],
    takeaways: [
      "Bijection = one-to-one + onto: exactly one arrow into every b.",
      "Whether a rule is onto depends on the domain and codomain.",
      "Finite sets: one-to-one needs |A| ≤ |B|, onto needs |A| ≥ |B|.",
    ],
  },
  {
    slug: "4-compose", nav: "Compose, invert", title: "Composition and Inverses",
    subtitle: "Follow two arrows; turn the arrows round",
    abstract: "Students to seats to rows: g ∘ f means first f, then g. Order matters, composition keeps one-to-one and onto, and only a bijection can be reversed.",
    tags: ["g ∘ f", "associative", "f⁻¹", "identity"],
    hero: "compose", heroCaption: "g(f(x)) and f(g(x)) side by side.",
    sections: [
      { id: "comp", title: "Composition", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION · COMPOSITION", `<p>For \\(f : A \\to B\\) and \\(g : B \\to C\\), \\((g \\circ f)(a) = g(f(a))\\). Read right to left: <b>first \\(f\\), then \\(g\\)</b>.</p>`)}
        <p>Seats 1 and 2 are at the front, 3, 4, 5 at the back: \(r\) sends seats to rows, and \(r \circ P\) sends students to rows.</p>
        ${run("rows")}
        <p><b>Order matters.</b> With \(f(n) = n + 1\), \(g(n) = 2n\): \((g \circ f)(n) = 2n + 2\) but \((f \circ g)(n) = 2n + 1\).</p>
        ${run("order")}
        ${demo("compose", "Demo 3 · Compose two rules", "choose f, g and x", "Try n + 1 and 2n at x = 4: 10 and 9. Then pick a bijection and see its inverse undo it.")}
        <p><b>Associative law.</b> \((h \circ g) \circ f = h \circ (g \circ f)\): both send \(a\) to \(h(g(f(a)))\).</p>
        <p><b>Theorem 4.</b> If \(f\) and \(g\) are one-to-one, so is \(g \circ f\); if both are onto, so is \(g \circ f\); so bijections compose to bijections. <em>Proof of the first:</em> \(g(f(a)) = g(f(a'))\) gives \(f(a) = f(a')\) (g one-to-one), then \(a = a'\) (f one-to-one). <em>Second:</em> for \(c \in C\) take \(b\) with \(g(b) = c\), then \(a\) with \(f(a) = b\). \(\square\)</p>
        ${run("compcheck")}
        ${callout("pitfall", "PITFALL · THE CONVERSE IS FALSE", `<p>\\(g \\circ f\\) one-to-one does not make \\(g\\) one-to-one: \\(A = \\{1\\}\\), \\(B = \\{1, 2\\}\\), \\(C = \\{1\\}\\), \\(f(1) = 1\\), \\(g(1) = g(2) = 1\\). (Exercise 5.)</p>`)}` },
      { id: "inv", title: "Inverse functions", html: String.raw`
        ${callout("note", "DEFINITION · INVERSE", `<p>\\(f^{-1} = \\{(b, a) : (a, b) \\in f\\}\\), every arrow turned round. \\(\\mathrm{id}_A(a) = a\\).</p>`)}
        <p><b>Theorem 5.</b> \(f^{-1}\) is a function \(B \to A\) if and only if \(f\) is a bijection; then \(f^{-1} \circ f = \mathrm{id}_A\) and \(f \circ f^{-1} = \mathrm{id}_B\). Onto gives every \(b\) an arrow back; one-to-one makes it only one.</p>
        ${run("invplan")}
        <p>For \(h(x) = 3x + 2\) on \(\mathbb Q\): \(h^{-1}(y) = \frac{y - 2}{3}\), undo the last step first.</p>
        ${run("invh")}
        ${callout("pitfall", "PITFALL · \\(f^{-1}(y)\\) IS NOT \\(1/f(y)\\)", `<p>\\(h^{-1}(5) = 1\\) because \\(h(1) = 5\\), while \\(1/h(5) = 1/17\\). The \\(-1\\) means undo.</p>`)}` },
    ],
    takeaways: [
      "g ∘ f: first f, then g. Not commutative, but associative.",
      "Compositions of one-to-one (onto) functions are one-to-one (onto).",
      "Only a bijection has an inverse function; check it by composing both ways.",
    ],
  },
  {
    slug: "5-pigeonhole", nav: "Pigeonhole", title: "The Pigeonhole Principle",
    subtitle: "More objects than boxes",
    abstract: "Seven students in six seats, thirty trays in seven ovens, six integers and five remainders: some box always gets at least ⌈p/h⌉.",
    tags: ["⌈p/h⌉", "ovens", "remainders"],
    hero: "pigeon", heroCaption: "p objects in h boxes",
    sections: [
      { id: "basic", title: "Theorems 6 and 7", html: String.raw`
        <p><b>Theorem 6.</b> If \(|A| > |B|\) (finite), no \(f : A \to B\) is one-to-one. <em>Proof by contrapositive:</em> a one-to-one \(f\) gives \(|A|\) different values in \(B\), so \(|A| \le |B|\). \(\square\)</p>
        <p><b>Theorem 7.</b> \(p\) objects in \(h\) boxes put at least \(\lceil p/h \rceil\) into some box. <em>Proof by contradiction:</em> if every box held at most \(\lceil p/h \rceil - 1 < p/h\), the total would be less than \(p\). \(\square\)</p>
        <p>Thirty trays in seven ovens: some oven bakes at least \(\lceil 30/7 \rceil = 5\), and \(5 + 5 + 4 + 4 + 4 + 4 + 4 = 30\) shows 5 is the best bound.</p>
        ${run("ovens")}
        ${demo("pigeon", "Demo 4 · Pigeons and holes", "set p and h, then deal", "However you deal them, the fullest box never drops below ⌈p/h⌉.")}` },
      { id: "mod5", title: "Six integers, five remainders", html: String.raw`
        <p>Among any six integers two differ by a multiple of 5: the boxes are the remainders 0–4.</p>
        ${run("mod5")}
        ${callout("pattern", "PATTERN · PROOF BY PIGEONHOLE", `<p>(1) Name the objects and the boxes. (2) Count both, check \\(p > h\\) or compute \\(\\lceil p/h \\rceil\\). (3) Some box holds two (or \\(\\lceil p/h \\rceil\\)). (4) Say what that means for the problem.</p>`)}
        ${callout("pitfall", "PITFALL · “EVERY OVEN BAKES AT LEAST 5”", `<p>The principle is about <em>some</em> box. All 30 trays could go into one oven.</p>`)}` },
    ],
    takeaways: [
      "More objects than boxes: some box gets two.",
      "p objects, h boxes: some box gets at least ⌈p/h⌉.",
      "Name the objects and the boxes before you count.",
    ],
  },
  {
    slug: "6-infinite", nav: "Infinite sets", title: "Sizes of Infinite Sets",
    subtitle: "Same size means a bijection",
    abstract: "The even numbers and the integers have as many elements as ℕ; no set has as many as its power set (Cantor). Plus hashing, compression and ciphers.",
    tags: ["countable", "ℕ ↔ ℤ", "Cantor"],
    hero: "cantor", heroCaption: "Cantor's set D is never f(a).",
    sections: [
      { id: "count", title: "Countable sets", html: String.raw`
        <p>\(A\) and \(B\) have the <b>same cardinality</b> if there is a bijection \(A \to B\). \(n \mapsto 2n\) matches \(\mathbb N\) with the even numbers, a proper part of it. Listing \(\mathbb Z\) as \(0, -1, 1, -2, 2, \dots\) is a bijection \(z : \mathbb N \to \mathbb Z\) (exercise 8): \(\mathbb Z\) is <b>countably infinite</b>.</p>
        ${run("zlist")}` },
      { id: "cantor", title: "Theorem 8: Cantor", html: String.raw`
        <p><b>Theorem 8.</b> No \(f : A \to 2^A\) is onto. <em>Proof.</em> Let \(D = \{a \in A : a \notin f(a)\}\). If \(D = f(d)\), then \(d \in D \iff d \notin f(d) = D\), a contradiction. \(\square\)</p>
        ${demo("cantor", "Demo 5 · Cantor's diagonal set", "choose f(1), f(2), f(3)", "Whatever you choose, D differs from f(a) at a itself.")}
        ${run("cantor")}
        <p>The proof never uses finiteness, so \(\mathbb N\) and \(2^{\mathbb N}\) have different sizes; \(\mathbb R\) is uncountable by a diagonal argument of the same kind.</p>
        ${callout("note", "CS · HASHING, COMPRESSION, CIPHERS", `<p>A hash into \\(2^{16}\\) values cannot be one-to-one on all strings, so collisions are certain. No lossless compressor shortens every file: \\(2^n\\) files of \\(n\\) bits, only \\(2^n - 1\\) shorter ones. A cipher must be a bijection so that decryption exists: shift by 3, undo by shifting 23.</p>`)}
        ${run("cs")}` },
    ],
    takeaways: [
      "Same size = a bijection, for infinite sets too.",
      "ℕ, the even numbers and ℤ are all countably infinite.",
      "Cantor: A and its power set never have the same size.",
    ],
  },
  {
    slug: "7-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and how to check an AI's inverse with one line of sympy.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}
        ${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant can decide whether a function is one-to-one, write the proof and find an inverse. Check: (1) are the domain and codomain stated, and does the onto proof check that its \(a\) is in the domain? (2) compose a claimed inverse both ways and simplify with sympy; (3) is every "not" backed by a concrete counterexample? (4) in a pigeonhole proof, are the objects and boxes named and counted, and is the conclusion "some box"?</p>
        <p>Check (2) on an answer of the kind an assistant can give, \(q^{-1}(y) = \frac{3y - 1}{y - 2}\) for \(q(x) = \frac{2x + 1}{x - 3}\):</p>
        ${run("aiCheck")}
        <p>The wrong answer composes to \(\frac{5x + 6}{7}\), not \(x\); the right one, \(\frac{3y + 1}{y - 2}\), gives \(x\) and \(y\) back.</p>` },
    ],
    takeaways: [
      "Function, one-to-one, onto, bijection: check each against its definition.",
      "Compose a claimed inverse both ways.",
      "Pigeonhole conclusions are about some box, never every box.",
    ],
  },
];
