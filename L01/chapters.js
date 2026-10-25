// Chapter content, adapted from notes/L01-definitions.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L01-1.mp4";
const VIDEO_P2 = "media/L01-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 1,
  title: "Definitions",
  tagline: "Every word means exactly one thing",
  lead: "Is 1 prime? Is 0 even? Does 0 divide 0? A definition settles each question for good. Interactive notes on what a definition must do, the number sets, divisibility, even and odd, primes and composites, and the first proofs from definitions, where every number was checked by running code.",
  heroDemo: "sorterMini",
  heroLabel: "A definition is a test",
  heroCaption: "Each definition sorts the integers −5 … 14 into yes (coloured) and no (grey). Nothing is left in between.",
  whyTitle: "Why definitions",
  whySub: "The first tool of every proof",
  why: [
    ["No arguments about words", "Whether \\(1\\) is prime or \\(0\\) is even is not a matter of opinion: the definition decides, for every integer, positive, negative or zero."],
    ["Proofs unwrap definitions", "To prove \\(d \\mid a + b\\), write \\(a = dx\\) and \\(b = dy\\), compute \\(a + b = d(x + y)\\), and check that \\(x + y\\) is an integer."],
    ["Code is careful at the edges", "A definition is a predicate. \\(-7\\) is odd in every language, but <code>n % 2 == 1</code> says otherwise in C."],
  ],
  ctaTitle: "Ready to define?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 1 · Part 1 — Definitions and divisibility",
    [VIDEO_P2]: "Lecture 1 · Part 2 — Even, odd and prime",
  },
};

const CHAPTERS = [
  {
    slug: "1-questions", nav: "Questions", title: "Is 1 Prime? Is 0 Even?",
    subtitle: "A definition is a test with a yes-or-no answer",
    abstract: "Three questions that a room of people answers in different ways, and the definitions that settle them. Each definition becomes a Python function that searches for the integer it promises.",
    tags: ["1", "0", "test"],
    hero: "code:sorting", heroCaption: "Three definitions run on −3 … 12",
    sections: [
      { id: "sorting", title: "Three tests", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Ask a room of people: Is \(1\) a prime number? Is \(0\) even? Does \(0\) divide \(0\)? You will get different answers, given with confidence. In mathematics every word a statement uses has a <b>definition</b>, and the definition decides.</p>
        <p>A definition is a test. Give it any object of the right kind and it answers <em>yes</em> or <em>no</em>, never "it depends". Here are this lecture's tests as Python functions, run on the integers from \(-3\) to \(12\):</p>
        ${run("sorting")}
        <p>So \(1\) is not prime, \(0\) is even, and (chapter 4) \(0\) divides \(0\). The functions do not use <code>%</code> or <code>/</code>: each one searches for the integer the definition says must exist.</p>
        ${predict("Is \\(-7\\) odd? Write \\(-7\\) in the form \\(2k + 1\\). Which integer \\(k\\) do you need?",
          "<p>\\(k = -4\\): \\(2 \\cdot (-4) + 1 = -7\\). (Not \\(k = -3\\), which gives \\(-5\\).) So \\(-7\\) is odd.</p>")}` },
    ],
    takeaways: [
      "A definition is a test: every object of its kind gets yes or no.",
      "Questions like “is 0 even?” are settled by the definition, not by a vote.",
    ],
  },
  {
    slug: "2-definitions", nav: "Definitions", title: "What a Definition Must Do",
    subtitle: "Category, term, “provided”, defining condition",
    abstract: "A definition splits its whole category into two groups. Its four parts, three attempts that fail, and what this course assumes without definition.",
    tags: ["category", "provided", "unambiguous"],
    hero: "toc",
    sections: [
      { id: "parts", title: "Four parts", html: String.raw`
        <p>A mathematical definition must be <b>unambiguous</b>: for every object it could apply to, it says whether the word applies or not, with nothing left over and nothing in both groups.</p>
        ${callout("note", "DEFINITION · PERFECT SQUARE", `<p>A positive integer \\(n\\) is a <b>perfect square</b> provided there is an integer \\(m\\) such that \\(n = m^2\\).</p>`)}
        <ol><li>The <b>category</b>: the kind of object it applies to ("a positive integer \(n\)").</li>
        <li>The <b>term</b> being defined ("perfect square").</li>
        <li>The word <b>"provided"</b>, which in a definition means "exactly when": the condition can always replace the term, and back.</li>
        <li>The <b>defining condition</b>, written only with words that already have a meaning.</li></ol>
        ${demo("sorter", "Demo 1 · A definition sorts", "choose a definition and a range", "Try “prime” on −5 … 14: the negative numbers, 0 and 1 all land in the “no” group. Try “divisible by b” with b = 0.")}` },
      { id: "fail", title: "Three attempts that fail", html: String.raw`
        <ul><li>"A number is <b>large</b> provided it is much bigger than \(1\)." Is \(50\) large? "Much bigger" has no meaning, so the test has no answer: <em>ambiguous</em>.</li>
        <li>"An integer is <b>prime</b> provided it has no divisors." Every integer has the divisor \(1\), so nothing passes: clear, but <em>wrong</em>.</li>
        <li>"An integer is <b>odd</b> provided it is not even." A fine definition, but <em>not ours</em> (we use \(a = 2k + 1\)). That the two agree is a theorem, and needs a proof.</li></ul>
        ${callout("pitfall", "PITFALL · USING WHAT THE WORD SUGGESTS", `<p>"Odd" suggests "strange", "prime" suggests "important", "divides" suggests school division. In a proof only the defining condition counts: write it out in full, with the integer it promises.</p>`)}
        <p><b>What we assume.</b> The integers, adding, subtracting and multiplying them, the rules of algebra, and the order \(<\), \(\le\). The sum, difference and product of two integers is an integer. We assume <em>nothing</em> about dividing integers: that is the word chapter 4 defines.</p>` },
    ],
    takeaways: [
      "Category, term, “provided”, defining condition.",
      "Unambiguous: every object of the category gets exactly one answer.",
      "Two definitions of one word agree only if a proof says so.",
    ],
  },
  {
    slug: "3-numbers", nav: "Number sets", title: "The Basic Number Sets",
    subtitle: "ℕ, ℤ, ℚ, ℝ",
    abstract: "Natural numbers (with 0 in this course), integers, rational numbers and real numbers, each inside the next. To show a number is rational, write it as a fraction of two integers.",
    tags: ["ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ", "fractions", "0 ∈ ℕ"],
    hero: "code:rationals", heroCaption: "Decimals as fractions of integers",
    sections: [
      { id: "sets", title: "Four sets", html: String.raw`
        <ul><li>\(\mathbb N = \{0, 1, 2, 3, \dots\}\), the <b>natural numbers</b>. In this course \(0 \in \mathbb N\) (some books start at \(1\)).</li>
        <li>\(\mathbb Z = \{\dots, -2, -1, 0, 1, 2, \dots\}\), the <b>integers</b>.</li>
        <li>\(\mathbb Q = \left\{ \frac{a}{b} : a, b \in \mathbb Z,\ b \neq 0 \right\}\), the <b>rational numbers</b>.</li>
        <li>\(\mathbb R\), the <b>real numbers</b>: all the points of the number line.</li></ul>
        <p>\(\mathbb N \subseteq \mathbb Z \subseteq \mathbb Q \subseteq \mathbb R\): an integer \(a\) is rational because \(a = \frac a1\). To show a number is rational, write it as a fraction of two integers; Python's <code>Fraction</code> does it exactly:</p>
        ${run("rationals")}
        <p>The same rational number has many names, \(\frac38 = \frac{6}{16} = \frac{-9}{-24}\); the definition only asks for one. Repeating decimals are rational too:</p>
        ${run("repeating")}
        ${demo("sets", "Demo 2 · Which sets?", "type a number: 0.375, -12/4, 7, 0.(27), sqrt2")}
        <p>\(\sqrt 2\) is real but not rational. The proof needs proof by contradiction (Lecture 6); a computer cannot settle it, because a float is itself a fraction with a power of two at the bottom.</p>
        ${predict("Which of \\(\\mathbb N, \\mathbb Z, \\mathbb Q, \\mathbb R\\) contain \\(-\\frac{12}{4}\\)? And \\(\\frac{4}{12}\\)?",
          "<p>\\(-\\frac{12}{4} = -3\\) is in \\(\\mathbb Z\\), \\(\\mathbb Q\\), \\(\\mathbb R\\) but not \\(\\mathbb N\\). \\(\\frac{4}{12} = \\frac13\\) is in \\(\\mathbb Q\\) and \\(\\mathbb R\\) only.</p>")}` },
    ],
    takeaways: [
      "ℕ starts at 0 in this course.",
      "Rational = a fraction of integers with a nonzero bottom; one way of writing it is enough.",
    ],
  },
  {
    slug: "4-divides", nav: "Divides", title: "Divisibility",
    subtitle: "b | a provided a = bc for some integer c",
    abstract: "The first new definition. 42 dots fill 6 rows; 40 dots don't. Zero and negative numbers, the difference between a sentence and a number, and the first proof from definitions.",
    tags: ["b | a", "rows of dots", "d | a + b"],
    hero: "code:divcheck", heroCaption: "The definition as a search for c",
    sections: [
      { id: "def", title: "The definition", html: String.raw`
        ${callout("note", "DEFINITION · DIVISIBLE", `<p>Let \\(a\\) and \\(b\\) be integers. \\(a\\) is <b>divisible</b> by \\(b\\), written \\(b \\mid a\\), provided there is an integer \\(c\\) such that \\(a = bc\\). We also say \\(b\\) <b>divides</b> \\(a\\), \\(b\\) is a <b>divisor</b> of \\(a\\), \\(a\\) is a <b>multiple</b> of \\(b\\).</p>`)}
        <ul><li>\(6 \mid 42\), because \(42 = 6 \cdot 7\).</li>
        <li>\(7 \mid -56\) with \(c = -8\), and \(-3 \mid 27\) with \(c = -9\): negatives are allowed.</li>
        <li>\(6 \nmid 40\): \(6c = 40\) needs \(c = \frac{20}{3}\), not an integer.</li>
        <li>Every \(b\) divides \(0\) (\(0 = b \cdot 0\)); \(0\) divides only \(0\). So \(0 \mid 0\) is true and \(0 \mid 5\) is false.</li></ul>
        <p>The function <code>divides</code> searches for \(c\) between \(-|a|\) and \(|a|\). That is enough: if \(a \neq 0\) and \(a = bc\), then \(|b| \ge 1\), so \(|c| \le |b|\,|c| = |a|\).</p>
        ${run("divcheck")}
        <p><b>The picture.</b> \(a = bc\) with positive numbers: \(a\) dots in \(b\) rows with \(c\) in every row.</p>
        ${demo("rows", "Demo 3 · Equal rows", "choose a and b", "40 in 6 rows leaves 4 over. Try b = 2: even numbers fill two rows, odd ones leave one dot.")}
        ${run("rows")}
        ${callout("pitfall", "PITFALL · A SENTENCE, NOT A NUMBER", `<p>"\\(3 \\mid 12\\)" is true or false, like "\\(3 < 12\\)"; "\\(12 / 3\\)" is the number \\(4\\). "\\(3 \\mid 12 = 4\\)" mixes the two. Order matters: \\(4 \\mid 20\\) is true, \\(20 \\mid 4\\) is false.</p>`)}` },
      { id: "proof", title: "Theorem 1: d | a and d | b give d | a + b", html: String.raw`
        <p><b>Theorem 1.</b> If \(d \mid a\) and \(d \mid b\), then \(d \mid (a + b)\).</p>
        <p><em>Proof.</em> Assume \(d \mid a\) and \(d \mid b\): there are integers \(x, y\) with \(a = dx\) and \(b = dy\) (two letters, since the quotients need not be equal). We must find an integer \(c\) with \(a + b = dc\). Compute \(a + b = dx + dy = d\,(x + y)\). Let \(c = x + y\), an integer because a sum of integers is an integer. So \(d \mid (a + b)\). \(\square\)</p>
        <p>Picture: \(12 = 3 \cdot 4\) and \(15 = 3 \cdot 5\) side by side make three rows of nine. The same moves give \(d \mid ma + nb\) for all integers \(m, n\); sympy checks the identity for every value at once:</p>
        ${run("sympyComb")}
        ${callout("pattern", "PATTERN · DIRECT PROOF FROM DEFINITIONS", `<ol><li><b>Unwrap.</b> Write each assumption with its definition, a new letter for every integer it promises.</li><li><b>Goal.</b> Write the conclusion with its definition and name what you must find.</li><li><b>Compute.</b> Turn the assumptions into the form the goal needs.</li><li><b>Check and conclude.</b> Check that what you found is an integer.</li></ol>`)}
        ${predict("Is the converse true: if \\(d \\mid (a + b)\\), must \\(d \\mid a\\) and \\(d \\mid b\\)?",
          "<p>No: \\(5 \\mid 2 + 3\\), but \\(5 \\nmid 2\\) and \\(5 \\nmid 3\\).</p>")}` },
    ],
    takeaways: [
      "To show b | a, exhibit the integer c; to show b ∤ a, show none exists.",
      "Every b divides 0; 0 divides only 0.",
      "Unwrap, name the goal, compute, check it is an integer.",
    ],
  },
  {
    slug: "5-evenodd", nav: "Even, odd", title: "Even and Odd",
    subtitle: "a = 2c and a = 2k + 1",
    abstract: "Exact definitions for two old words, applied to zero and negatives. The product of two odd numbers is odd, and no integer is both even and odd.",
    tags: ["0 is even", "odd × odd", "never both"],
    hero: "code:evenodd", heroCaption: "Each integer with its c or k",
    sections: [
      { id: "def", title: "The definitions", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION · EVEN, ODD", `<p>An integer \\(a\\) is <b>even</b> provided \\(2 \\mid a\\), that is, \\(a = 2c\\) for some integer \\(c\\). It is <b>odd</b> provided \\(a = 2k + 1\\) for some integer \\(k\\).</p>`)}
        <p>\(0 = 2 \cdot 0\) is even; \(-14 = 2 \cdot (-7)\) is even; \(13 = 2 \cdot 6 + 1\) is odd; \(-7 = 2 \cdot (-4) + 1\) and \(-5 = 2 \cdot (-3) + 1\) are odd.</p>
        ${run("evenodd")}
        <p>On the number line the even integers are steps of \(2\) from \(0\), the odd ones steps of \(2\) from \(1\), in both directions. With dots: an even number fills two equal rows, an odd number leaves one dot over (Demo 3 with \(b = 2\)).</p>` },
      { id: "product", title: "Theorem 2: odd times odd is odd", html: String.raw`
        <p><em>Proof.</em> Let \(a = 2x + 1\) and \(b = 2y + 1\) with integers \(x, y\). We need an integer \(k\) with \(ab = 2k + 1\):</p>
        $$ab = (2x + 1)(2y + 1) = 4xy + 2x + 2y + 1 = 2\,(2xy + x + y) + 1.$$
        <p>\(k = 2xy + x + y\) is an integer, so \(ab\) is odd. \(\square\) The expansion for every \(x, y\), then \(5 \cdot 7 = 35 = 2 \cdot 17 + 1\):</p>
        ${run("sympyOdd")}
        ${demo("oddProduct", "Demo 4 · Odd times odd", "choose x and y", "The first 2x rows pair up; the last row is 2y + 1 dots: y pairs and one dot over.")}` },
      { id: "never", title: "Theorem 3: never both", html: String.raw`
        <p><em>Proof.</em> Suppose \(a = 2c\) and \(a = 2k + 1\). Then \(2\,(c - k) = 1\): an integer \(j = c - k\) with \(2j = 1\). But if \(j \le 0\) then \(2j \le 0\), and if \(j \ge 1\) then \(2j \ge 2\). Impossible, so no integer is both. \(\square\)</p>
        <p>That every integer is even <em>or</em> odd is also true, but needs the division theorem (Lecture 11). Until then, only a check:</p>
        ${run("bothNeither")}
        ${callout("pitfall", "PITFALL · ONE LETTER FOR TWO NUMBERS", `<p>"Let \\(a = 2k + 1\\) and \\(b = 2k + 1\\)" says \\(a = b\\). Every integer a definition promises gets its own letter.</p>`)}` },
    ],
    takeaways: [
      "0 is even; negative numbers are even or odd by the same definitions.",
      "Odd · odd = 2(2xy + x + y) + 1 is odd.",
      "No integer is both: 2j = 1 has no integer solution.",
    ],
  },
  {
    slug: "6-primes", nav: "Primes", title: "Primes and Composites",
    subtitle: "Only the single-row rectangle",
    abstract: "A prime is a number of dots that only lines up in a single row. 91 looks prime and isn't; 1 is neither prime nor composite; every a ≥ 2 is exactly one of the two.",
    tags: ["12 vs 13", "91 = 7 · 13", "1 is neither"],
    hero: "code:primes50", heroCaption: "Primes, composites and neither, 1 … 50",
    sections: [
      { id: "def", title: "The definitions", html: String.raw`
        ${callout("note", "DEFINITION · PRIME, COMPOSITE", `<p>A positive integer \\(p\\) is <b>prime</b> provided \\(p > 1\\) and its only positive divisors are \\(1\\) and \\(p\\). A positive integer \\(a\\) is <b>composite</b> provided some integer \\(b\\) with \\(1 < b < a\\) has \\(b \\mid a\\).</p>`)}
        ${demo("rects", "Demo 5 · Every rectangle of n dots", "drag n", "13 has only the single row. 12 has six rectangles. 91 hides 7 × 13. And 1?")}
        ${run("rects")}
        <ul><li>\(13\) is prime; \(12\) is composite (\(b = 3\)); \(91 = 7 \cdot 13\) is composite although it looks prime.</li>
        <li>\(1\) is <b>neither</b>: not prime (the definition asks \(p > 1\)), not composite (no \(b\) with \(1 < b < 1\)).</li>
        <li>\(2\) is the only even prime: any even \(a > 2\) has \(b = 2\).</li></ul>
        <p>Why leave \(1\) out? With \(1\) as a prime, factorisation into primes would not be unique: \(6 = 2 \cdot 3 = 1 \cdot 2 \cdot 3\).</p>
        ${run("primes50")}` },
      { id: "iff", title: "Theorem 4: prime or composite", html: String.raw`
        <p><b>Theorem 4.</b> For an integer \(a \ge 2\): \(a\) is composite if and only if \(a\) is not prime.</p>
        <p>(\(\Rightarrow\)) If \(b \mid a\) with \(1 < b < a\), then \(b\) is a positive divisor other than \(1\) and \(a\), so \(a\) is not prime.</p>
        <p>(\(\Leftarrow\)) If \(a > 1\) is not prime, it has a positive divisor \(b \ne 1, a\). From \(a = bc\) with \(a, b > 0\) we get \(c \ge 1\), so \(b \le a\); hence \(1 < b < a\) and \(a\) is composite. \(\square\)</p>
        ${callout("pattern", "PATTERN · IF AND ONLY IF", `<p>"\\(P\\) if and only if \\(Q\\)" is two theorems, \\(P \\Rightarrow Q\\) and \\(Q \\Rightarrow P\\). Prove each with its own direct proof, and label them.</p>`)}
        ${callout("pitfall", "PITFALL · “PRIME” IS NOT “ODD”", `<p>\\(2\\) is prime and even; \\(9, 15, 21, 91\\) are odd and composite; \\(1\\) is odd and neither.</p>`)}` },
    ],
    takeaways: [
      "Prime: p > 1 and only the divisors 1 and p.",
      "1 is neither prime nor composite; every a ≥ 2 is exactly one.",
      "“Looks prime” is not a test: 91 = 7 · 13.",
    ],
  },
  {
    slug: "7-code", nav: "In code", title: "Definitions in Code",
    subtitle: "Where a language and a definition disagree",
    abstract: "-7 % 2 is 1 in Python and −1 in C; 0 % 0 crashes while 0 | 0 is true. A definition is a predicate, and its bugs live at the edges.",
    tags: ["%", "edge cases", "predicates"],
    hero: "code:edge", heroCaption: "Remainders and the definition",
    sections: [
      { id: "edge", title: "Edge cases", html: String.raw`
        ${run("edge")}
        <p>In Python <code>-7 % 2</code> is <code>1</code>; in C, Java and JavaScript the remainder takes the sign of \(a\) and is <code>-1</code> (what <code>math.fmod</code> computes), so the test <code>n % 2 == 1</code> calls \(-7\) not odd. And <code>a % b == 0</code> crashes on \(0 \mid 0\), which the definition says is true. When you turn a definition into code, check \(0\), \(1\) and the negatives by hand.</p>
        ${callout("note", "CS · A DEFINITION IS A PREDICATE", `<p>The category is the input type, "provided" means the function returns exactly the defining condition, and "unambiguous" means it answers for every input and never crashes or hangs. Type checks, database <code>CHECK</code> constraints and input validation are definitions in this sense, and their bugs are at the edges.</p>`)}` },
    ],
    takeaways: [
      "Test definitions in code on 0, 1, negatives and large numbers.",
      "A test can find a bug; it cannot prove there is none.",
    ],
  },
  {
    slug: "8-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and a checklist for an AI assistant's definitions and proofs.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant knows these definitions but may silently use another one (\(\mathbb N\) from \(1\), "odd means not even") and is careless at the edges. Check: (1) which definition did it use? (2) does every promised integer get its own letter? (3) does the proof check that the final \(c\) or \(k\) is an integer? (4) run the code on \(0, 1, -1, -7\) and a large number; (5) test the claim on a range of values.</p>
        <p>Check (4) on a C-style oddness test:</p>
        ${run("aiCheck")}
        <p>Every negative odd number is misclassified, and a test on positive numbers alone would never show it.</p>` },
    ],
    takeaways: [
      "Compare an assistant's definition with ours word for word.",
      "Run code on 0, 1 and negative numbers.",
      "One failing value kills a claim; only a proof establishes it.",
    ],
  },
];
