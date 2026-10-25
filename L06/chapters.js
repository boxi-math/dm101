// Chapter content, adapted from notes/L06-contradiction.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L06-1.mp4";
const VIDEO_P2 = "media/L06-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 6,
  title: "Contradiction and the Smallest Counterexample",
  tagline: "Suppose not, and look for trouble",
  lead: "A balance that can never weigh 100 grams, a statement whose converse fails at 4, fractions that halve for ever, and a claim that is true eleven times before it breaks. Interactive notes on proof by contrapositive, proof by contradiction, the well-ordering principle and proof by smallest counterexample, where every number was checked by running code.",
  heroDemo: "shrinkMini",
  heroLabel: "The least counterexample",
  heroCaption: "Test n = 0, 1, 2, … in order: n² − n + 11 is prime eleven times, and the first failure, n = 11, is the least counterexample.",
  whyTitle: "Why contradiction",
  whySub: "Proving that something cannot happen",
  why: [
    ["A search is not a proof", "A computer tries 10201 pairs and finds no \\(6x + 9y = 100\\). Only a proof covers <b>all</b> infinitely many pairs: suppose one exists, and reach a contradiction."],
    ["Same statement, other door", "\\(A \\Rightarrow B\\) is equivalent to its <b>contrapositive</b> \\(\\neg B \\Rightarrow \\neg A\\), not to its converse. Sometimes the other door is much easier to open."],
    ["The least counterexample", "Every nonempty set of natural numbers has a least element. So a false claim has a <b>smallest</b> counterexample, and that is usually where it breaks."],
  ],
  ctaTitle: "Ready to suppose the opposite?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 6 · Part 1 — Contrapositive and contradiction",
    [VIDEO_P2]: "Lecture 6 · Part 2 — Well-ordering and the smallest counterexample",
  },
};

const CHAPTERS = [
  {
    slug: "1-balance", nav: "Balance", title: "A Balance That Cannot Weigh 100 Grams",
    subtitle: "Why a search is not enough",
    abstract: "With 6-gram and 9-gram weights on either pan, a balance weighs 6x + 9y grams. A program tries ten thousand pairs and never hits 100. Is 100 impossible, or did it not look far enough?",
    tags: ["6x + 9y", "search", "multiples of 3"],
    hero: "code:balance", heroCaption: "Every pair with |x|, |y| ≤ 50",
    sections: [
      { id: "balance", title: "Weights on either pan", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A kitchen balance comes with two kinds of weights, 6 grams and 9 grams, as many as you like, and a weight may go on either pan. With the flour on the left, a weight on the right balances its own mass of flour; next to the flour it counts negative. So if \(x\) and \(y\) are the net numbers of 6-gram and 9-gram weights on the right, the balance weighs exactly \(6x + 9y\) grams. Are there integers \(x\) and \(y\) with \(6x + 9y = 100\)?</p>
        ${run("balance")}
        <p>No pair in that range works, and every amount the balance can weigh is a multiple of 3: 99 grams or 102 grams, never 100. But the search covered \(101 \cdot 101 = 10201\) pairs out of infinitely many. A search cannot settle the question; a proof can (chapter 3), and it starts by supposing that such a pair <em>does</em> exist.</p>
        ${demo("balance", "Demo 1 · The balance", "change the weights and the target", "Try 6 and 10 for 100 (possible), or 4 and 6 for 15 (impossible).")}
        ${predict("What is it about \\(6x + 9y\\) that makes 100 impossible? Write a sentence that would convince a friend for <em>every</em> pair of integers.",
          "<p>\\(6x + 9y = 3(2x + 3y)\\) is always a multiple of 3, and 100 is not. Chapter 3 turns this sentence into a proof by contradiction.</p>")}` },
    ],
    takeaways: [
      "A search over finitely many cases can never rule out every case.",
      "Every amount 6x + 9y is a multiple of 3; that is the idea of the proof.",
    ],
  },
  {
    slug: "2-contrapositive", nav: "Contrapositive", title: "Proof by Contrapositive",
    subtitle: "If not B, then not A",
    abstract: "An if–then statement and its contrapositive have the same truth table; the converse does not. Proving the contrapositive is sometimes far easier, as for “if n² − 6n + 5 is even, then n is odd”.",
    tags: ["truth table", "contrapositive", "converse"],
    hero: "code:truth", heroCaption: "Three statements built from A and B",
    sections: [
      { id: "table", title: "Converse and contrapositive", html: String.raw`
        <p>From "if \(A\), then \(B\)" (written \(A \Rightarrow B\)) we build the <b>converse</b> "if \(B\), then \(A\)" and the <b>contrapositive</b> "if not \(B\), then not \(A\)" (\(\neg B \Rightarrow \neg A\)). An implication is false in exactly one case: \(A\) true and \(B\) false.</p>
        ${run("truth")}
        <p>The columns for \(A \Rightarrow B\) and \(\neg B \Rightarrow \neg A\) agree in every row: they are <b>logically equivalent</b>, so proving one proves the other. The converse differs in rows 2 and 3: it is a different statement.</p>
        ${callout("pattern", "PATTERN · PROOF BY CONTRAPOSITIVE", `<ol><li>Say that you will prove "if not \\(B\\), then not \\(A\\)".</li><li><b>Assume</b> not \\(B\\).</li><li>Deduce not \\(A\\).</li><li><b>Conclude</b>: the contrapositive is equivalent to \\(A \\Rightarrow B\\), so the statement is proved.</li></ol>`)}` },
      { id: "theorem1", title: "Theorem 1: an even value means n is odd", html: String.raw`
        <p><b>Theorem 1.</b> Let \(n\) be an integer. If \(n^2 - 6n + 5\) is even, then \(n\) is odd.</p>
        <p>A direct proof would start from "\(n^2 - 6n + 5 = 2m\)", which says little about \(n\). The contrapositive starts from a simple fact about \(n\).</p>
        <p><em>Proof.</em> We prove: if \(n\) is even, then \(n^2 - 6n + 5\) is odd. Assume \(n = 2a\) for an integer \(a\). Then</p>
        $$n^2 - 6n + 5 = 4a^2 - 12a + 5 = 2\,(2a^2 - 6a + 2) + 1,$$
        <p>and \(2a^2 - 6a + 2\) is an integer, so the value is odd. That proves the contrapositive, and so the theorem. \(\square\)</p>
        ${run("sympyContra")}
        <p>A sanity check of the theorem itself (the \(n\) from \(-10\) to \(10\) with an even value are all odd):</p>
        ${run("sanityContra")}` },
      { id: "converse", title: "The converse is a different statement", html: String.raw`
        ${callout("pitfall", "PITFALL · THE CONVERSE IS NOT THE CONTRAPOSITIVE", `<p>"If \\(n\\) is a multiple of 6, then \\(n\\) is even" is true, and so is its contrapositive "if \\(n\\) is odd, then \\(n\\) is not a multiple of 6". But the converse, "if \\(n\\) is even, then \\(n\\) is a multiple of 6", is false: \\(n = 4\\). Proving the converse proves nothing about the original statement.</p>`)}
        ${run("converse")}
        ${demo("implication", "Demo 2 · Statement, contrapositive, converse", "pick a statement", "The statement and its contrapositive always fail at the same n; the converse has failures of its own.")}
        ${predict("Write the contrapositive and the converse of “if \\(n > 3\\), then \\(n^2 > 9\\)” for integers \\(n\\). Which are true?",
          "<p>Contrapositive: if \\(n^2 \\le 9\\), then \\(n \\le 3\\) (true, like the statement). Converse: if \\(n^2 > 9\\), then \\(n > 3\\) (false: \\(n = -4\\)). Exercise 2.</p>")}` },
    ],
    takeaways: [
      "A ⇒ B and ¬B ⇒ ¬A are logically equivalent; B ⇒ A is not.",
      "Prove the contrapositive when “not B” is the easier starting point.",
      "A true statement can have a false converse (multiple of 6 ⇒ even; 4).",
    ],
  },
  {
    slug: "3-contradiction", nav: "Contradiction", title: "Proof by Contradiction",
    subtitle: "Suppose not B, and reach a statement and its negation",
    abstract: "The template, why it is valid, and the proof that the balance can never weigh 100 grams: 6x + 9y = 100 would make 3 divide 100.",
    tags: ["template", "6x + 9y = 100", "negation"],
    hero: "code:div100", heroCaption: "100 lies between 99 and 102",
    sections: [
      { id: "template", title: "The template", html: String.raw`
        ${callout("pattern", "PATTERN · PROOF BY CONTRADICTION", `<p>Theorem: if \\(A\\), then \\(B\\).</p><ol><li><b>Assume</b> the conditions in \\(A\\).</li><li><b>Suppose, to the contrary,</b> that \\(B\\) is false (negated correctly).</li><li><b>Argue</b> until some statement and its negation are both true (\\(\\rightarrow\\leftarrow\\)).</li><li><b>Conclude</b> that \\(B\\) is true.</li></ol>`)}
        <p><b>Why it is valid.</b> Steps 1–3 show that "\(A\) and not \(B\)" implies something false, so "\(A\) and not \(B\)" never happens, which is exactly what "if \(A\), then \(B\)" says:</p>
        ${run("contraTable")}` },
      { id: "theorem2", title: "Theorem 2: the balance, settled", html: String.raw`
        <p><b>Theorem 2.</b> There are no integers \(x\) and \(y\) with \(6x + 9y = 100\).</p>
        <p>Its negation, which step 2 assumes, is "there <em>are</em> integers \(x\) and \(y\) with \(6x + 9y = 100\)".</p>
        <p><em>Proof.</em> Suppose, to the contrary, that \(x\) and \(y\) are integers with \(6x + 9y = 100\). Then</p>
        $$100 = 6x + 9y = 3\,(2x + 3y),$$
        <p>and \(2x + 3y\) is an integer, so \(3 \mid 100\). But \(3 \cdot 33 = 99 < 100 < 102 = 3 \cdot 34\): 100 lies strictly between two consecutive multiples of 3, so \(3 \nmid 100\). Both cannot hold, a contradiction. So no such integers exist. \(\square\)</p>
        ${run("div100")}
        <p>The search of chapter 1 was a sanity check over ten thousand pairs; the proof covers every pair, because it never looked at particular values of \(x\) and \(y\).</p>
        ${callout("pitfall", "PITFALL · CONTRADICTION WITH WHAT?", `<p>The proof must end with a statement <em>and its negation</em> (\\(3 \\mid 100\\) and \\(3 \\nmid 100\\)), not with something merely surprising. If the contradiction you reach is "not \\(A\\)", you have written a contrapositive proof: say so, and write it that way.</p>`)}
        ${predict("To prove “there is no largest natural number” by contradiction, what do you suppose, and what is the contradiction?",
          "<p>Suppose there is a largest natural number \\(L\\). Then \\(L + 1\\) is a natural number larger than \\(L\\): a contradiction.</p>")}` },
    ],
    takeaways: [
      "Contradiction: assume A, suppose not B, reach Q and not Q.",
      "Negate carefully: “there are no x, y” becomes “there are x, y”.",
      "A proof covers infinitely many cases at once; a search does not.",
    ],
  },
  {
    slug: "4-well-ordering", nav: "Well-ordering", title: "No Smallest Positive Rational, and Well-Ordering",
    subtitle: "Every nonempty set of natural numbers has a least element",
    abstract: "Halving shows there is no smallest positive rational. The natural numbers are different: every nonempty set of them has a least element, and there is no endless descent.",
    tags: ["r / 2", "least element", "endless descent"],
    hero: "code:least", heroCaption: "Least elements found by checking 0, 1, 2, … in order",
    sections: [
      { id: "rationals", title: "Theorem 3: no smallest positive rational", html: String.raw`
        ${video(VIDEO_P2)}
        <p><b>Theorem 3.</b> There is no smallest positive rational number.</p>
        <p><em>Proof.</em> Suppose, to the contrary, that \(r = p/q\) is the smallest positive rational. Then \(r/2 = p/(2q)\) is rational, \(r/2 > 0\), and \(r/2 < r\) because \(r - r/2 = r/2 > 0\). So \(r/2\) is a positive rational below the smallest one: a contradiction. \(\square\)</p>
        ${run("halve")}` },
      { id: "principle", title: "The well-ordering principle", html: String.raw`
        ${callout("note", "DEFINITION · WELL-ORDERING PRINCIPLE", `<p>Every nonempty set of natural numbers has a least element.</p>`)}
        <p>Here \(\mathbb N = \{0, 1, 2, \dots\}\). A <b>least element</b> of \(S\) is an \(m \in S\) with \(m \le s\) for every \(s \in S\). For example \(\{n \in \mathbb N : n^2 > 50\}\) has least element \(8\), and \(\{n \ge 1 : 7 \mid 2^n - 1\}\) has least element \(3\):</p>
        ${run("least")}
        <p>The search stops only because the set has a member; on an empty set it would run for ever. Where the principle does not apply: the empty set (no element at all), the integers (below \(m\) is \(m - 1\)), the positive rationals (Theorem 3), and sets such as \(\{1, \tfrac12, \tfrac14, \dots\}\). It does apply to any nonempty set of integers that are all \(\ge c\).</p>
        ${demo("least", "Demo 3 · Hunting for the least element", "pick a set", "For the positive rationals and the integers the hunt never ends: every candidate has a smaller one.")}
        <p><b>Why believe it?</b> If \(S\) has a member \(s\), check \(0, 1, \dots, s\) in order: the first member you meet is the least, after at most \(s + 1\) checks. Formally it is a basic property of \(\mathbb N\), equivalent to the principle of induction (Lecture 7 proves induction from it).</p>
        <p><b>No endless descent.</b> There is no infinite sequence \(a_0 > a_1 > a_2 > \dots\) of natural numbers: its set of terms would have a least element \(a_j\), but \(a_{j+1} < a_j\). Any strictly decreasing run stops:</p>
        ${run("descent")}
        ${predict("Which have a least element: the even numbers greater than 1000; \\(\\{1/n : n \\ge 1\\}\\); the negative integers; \\(\\{n \\in \\mathbb N : n^2 > 200\\}\\)?",
          "<p>Yes (1002); no; no; yes (15, since \\(14^2 = 196\\) and \\(15^2 = 225\\)).</p>")}` },
    ],
    takeaways: [
      "There is no smallest positive rational: halve it.",
      "Every nonempty set of natural numbers has a least element.",
      "No endless descent in ℕ: a strictly decreasing run of naturals stops.",
    ],
  },
  {
    slug: "5-smallest-counterexample", nav: "Counterexample", title: "Proof by Smallest Counterexample",
    subtitle: "Take the least one that fails, and show it cannot fail",
    abstract: "If a claim about natural numbers failed, it would fail at a smallest m. Everything below m works, which is usually enough for a contradiction: 3 divides n³ + 2n, and every n ≥ 2 has a prime divisor. And a “proof” that forgot to check the start.",
    tags: ["3 | n³ + 2n", "prime divisor", "2ⁿ ≥ n + 2"],
    hero: "code:fails", heroCaption: "The counterexamples of 2ⁿ ≥ n + 2",
    sections: [
      { id: "template", title: "The template", html: String.raw`
        ${callout("pattern", "PATTERN · PROOF BY SMALLEST COUNTEREXAMPLE", `<p>Theorem: \\(P(n)\\) for every integer \\(n \\ge c\\).</p><ol><li><b>Suppose, to the contrary,</b> that the set \\(C\\) of counterexamples (\\(n \\ge c\\) with \\(P(n)\\) false) is not empty.</li><li><b>Take the least one:</b> by well-ordering, \\(C\\) has a least element \\(m\\).</li><li><b>Use that it is least:</b> \\(P(n)\\) holds for \\(c \\le n < m\\). Before using \\(m - 1\\), check \\(P(c)\\), so that \\(m \\ne c\\).</li><li><b>Reach a contradiction:</b> \\(P(m)\\) holds after all, or a smaller counterexample exists.</li><li><b>Conclude:</b> \\(C\\) is empty, so \\(P(n)\\) holds for every \\(n \\ge c\\).</li></ol>`)}` },
      { id: "theorem4", title: "Theorem 4: 3 divides n³ + 2n", html: String.raw`
        <p><b>Theorem 4.</b> For every \(n \in \mathbb N\), \(3 \mid n^3 + 2n\).</p>
        ${run("cubes")}
        <p><em>Proof.</em> Suppose, to the contrary, that some \(n\) fails, and let \(m\) be the least. Then \(m \ne 0\), since \(0 = 3 \cdot 0\). So \(m - 1 \in \mathbb N\) is smaller and not a counterexample: \((m-1)^3 + 2(m-1) = 3q\). Expanding,</p>
        $$m^3 + 2m = \bigl[(m-1)^3 + 2(m-1)\bigr] + 3\,(m^2 - m + 1) = 3\,(q + m^2 - m + 1),$$
        <p>so \(m\) is not a counterexample after all: a contradiction. \(\square\)</p>
        ${run("sympyCube")}
        <p>Check \(0\), then get from \(m - 1\) to \(m\): a base case and a step. A smallest-counterexample proof and a proof by induction (Lecture 7) are two ways to write the same argument.</p>` },
      { id: "theorem5", title: "Theorem 5: every n ≥ 2 has a prime divisor", html: String.raw`
        <p>Draw \(n\) dots in a rectangle. If \(n\) is not prime it is an \(a \times b\) rectangle with both sides at least 2 (\(15 = 3 \times 5\)), and each side is smaller than \(n\). A prime \(p\) only makes the \(1 \times p\) row.</p>
        <p><em>Proof.</em> Suppose some integer \(n \ge 2\) has no prime divisor, and let \(m\) be the least. Then \(m\) is not prime (a prime divides itself), so \(m\) has a divisor \(a\) with \(1 < a < m\). As \(2 \le a < m\), \(a\) is not a counterexample: some prime \(p\) divides \(a\). Then \(p \mid a\) and \(a \mid m\) give \(p \mid m\): a contradiction. \(\square\)</p>
        ${run("primeDiv")}` },
      { id: "error", title: "Find the error: forgetting the bottom", html: String.raw`
        <p><b>Claim.</b> For every \(n \in \mathbb N\), \(2^n \ge n + 2\). <em>"Proof."</em> Let \(m\) be the least counterexample. Then \(m - 1\) works, \(2^{m-1} \ge m + 1\), so</p>
        $$2^m = 2 \cdot 2^{m-1} \ge 2\,(m + 1) = 2m + 2 \ge m + 2,$$
        <p>and \(m\) works: a contradiction?</p>
        ${run("fails")}
        <p>The least counterexample is \(m = 0\), and \(0 - 1\) is not a natural number: the "proof" used a case that does not exist. Step 3 asks for exactly this check, and here it fails, \(2^0 = 1 < 2\). From \(c = 2\) on the same chain is a correct proof:</p>
        ${run("fixed")}
        ${callout("pitfall", "PITFALL · FORGETTING THE BOTTOM", `<p>"Let \\(m\\) be the least counterexample; then \\(m - 1\\) works" assumes \\(m - 1 \\ge c\\). Rule out \\(m = c\\) first, by checking \\(P(c)\\). It is the base case of induction under another name.</p>`)}
        ${demo("descentProof", "Demo 4 · Watch a smallest-counterexample proof", "pick a claim, then step", "For 3 | n³ + 2n the red point can never stay red; for 2ⁿ ≥ n + 2 it lands on 0, where there is no m − 1.")}` },
    ],
    takeaways: [
      "Take the least counterexample m; everything below m works.",
      "Show m works too (or find a smaller failure): contradiction.",
      "Check the starting value before you use m − 1.",
    ],
  },
  {
    slug: "6-programs", nav: "Programs", title: "Smallest Counterexamples in Programs",
    subtitle: "Shrinking failed tests, and loops that must stop",
    abstract: "Property-based testing shrinks a failing input to a minimal one; on the natural numbers that is the least counterexample. And a loop whose natural-number counter keeps decreasing must stop.",
    tags: ["shrinking", "termination", "n² − n + 11"],
    hero: "code:shrink", heroCaption: "The first failure of n² − n + 11 is prime",
    sections: [
      { id: "shrink", title: "Shrinking and termination", html: String.raw`
        ${callout("note", "CS · SHRINKING IN PROPERTY-BASED TESTING", `<p>A property-based testing library such as Hypothesis for Python runs a test on many generated inputs and, when one fails, shrinks it and reports the <em>minimal failing test case</em>: the simplest input that still breaks the property. On the natural numbers that is literally the least counterexample, which exists by well-ordering as soon as one failing input does. <b>Termination:</b> a loop whose counter is a natural number that strictly decreases every pass must stop (no endless descent); this is how one proves Euclid's algorithm halts (Lecture 11).</p>`)}
        <p>A tiny shrinker tests \(0, 1, 2, \dots\) in order and returns the first failure. It kills "\(n^2 - n + 11\) is prime for every \(n\)":</p>
        ${run("shrink")}
        <p>Eleven values are prime, and then \(11^2 - 11 + 11 = 121 = 11^2\). The other way round, <code>None</code> only means "no counterexample below the limit", never "no counterexample":</p>
        ${run("shrinkNone")}
        <p>The search returns <code>None</code> for Theorem 4 because the theorem is true, but only the proof says so.</p>` },
    ],
    takeaways: [
      "Testing tools report the smallest failing input: a least counterexample.",
      "A decreasing natural-number counter proves a loop terminates.",
    ],
  },
  {
    slug: "7-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's proof",
    abstract: "Five quick questions, seven exercises with hints and full solutions, and a checklist for reading a proof by contradiction that an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}
        ${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant writes proofs by contradiction fluently, and a fluent wrong proof is easy to miss. Check: (1) is the negation right ("some \(n\) fails", not "every \(n\) fails")? (2) does the contradiction pair a statement with its negation? (3) if it ends with "not \(A\)", is it a contrapositive in disguise? (4) is well-ordering applied to a nonempty set of natural numbers, never to integers or rationals? (5) is the starting value checked before \(m - 1\) is used? (6) search for the least counterexample yourself.</p>
        <p>Check (6) on a made-up claim of the kind an assistant can produce from a few cases, "\(n^2 + n + 1\) is prime for every \(n \ge 1\)":</p>
        ${run("aiCheck")}
        <p>The least counterexample is \(n = 4\): \(21 = 3 \cdot 7\). One line of search kills a claim; no amount of search proves one.</p>` },
    ],
    takeaways: [
      "Negate carefully; end with a statement and its negation.",
      "Well-ordering only for nonempty sets of natural numbers.",
      "A search can refute a claim; only a proof covers every n.",
    ],
  },
];
