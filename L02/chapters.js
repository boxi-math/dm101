// Chapter content, adapted from notes/L02-theorems-proofs.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L02-1.mp4";
const VIDEO_P2 = "media/L02-2.mp4";

const LECTURE = {
  number: 2,
  title: "Theorems and Proofs",
  tagline: "If–then, its converse and contrapositive, and truth tables",
  lead: "What makes a statement a theorem, how an if–then statement can break, why the contrapositive is the same statement and the converse is not, and how truth tables turn logic into arithmetic with T and F. Every number on this page was checked by running code.",
  heroDemo: "ttMini",
  heroLabel: "The truth table of x ⇒ y",
  heroCaption: "An if–then statement is false in one row only: x true, y false.",
  whyTitle: "Why proofs",
  whySub: "From examples that agree to statements that are always true",
  why: [
    ["Tests are not proofs", "\\(2^p - 1\\) is prime for \\(p = 2, 3, 5, 7\\) and not for \\(p = 11\\): \\(2047 = 23 \\cdot 89\\). A <b>proof</b> covers every case at once."],
    ["One cell breaks it", "“If \\(A\\) then \\(B\\)” is broken only by a case with \\(A\\) true and \\(B\\) false. The <b>contrapositive</b> is broken by the same case; the <b>converse</b> is not."],
    ["Logic you can compute", "Boolean algebra: two expressions are equal when their <b>truth tables</b> agree in every row, and checking all \\(2^m\\) rows is a proof."],
  ],
  ctaTitle: "Ready to break a promise?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 2 · Part 1 — If–then: converse, contrapositive, counterexample",
    [VIDEO_P2]: "Lecture 2 · Part 2 — Boolean algebra and truth tables",
  },
};

const CHAPTERS = [
  {
    slug: "1-claims", nav: "Claims", title: "Three Claims and a Computer",
    subtitle: "What a theorem is, and what a proof must do",
    abstract: "Three if–then claims about whole numbers, tested by computer from 1 to 100. One fails at once; two pass every test. Passing tests does not make them theorems: a proof does.",
    tags: ["theorem", "proof", "tests"],
    hero: "code:threeClaims", heroCaption: "Where each claim fails, n = 1 … 100",
    sections: [
      { id: "claims", title: "Three claims", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Here are three claims about positive integers \(n\): (1) if \(n\) is a multiple of 6, then \(n\) is a multiple of 3; (2) if \(n\) is a multiple of 3, then \(n\) is a multiple of 6; (3) if \(n^2\) is even, then \(n\) is even. A short program tests each for \(n = 1, \dots, 100\) and lists where it fails:</p>
        ${run("threeClaims")}
        <p>Claim 2 is dead: \(3\) is a multiple of 3 and not of 6. Claims 1 and 3 survived a hundred tests, but a hundred tests are not a hundred percent.</p>
        <p>A <b>theorem</b> is a statement that has been shown to be true, always, with no exceptions. A <b>proof</b> is the argument that shows it: a chain of steps, each following from the definitions, from what we assumed, or from results proved before. A proof covers every case at once, including the cases no computer will ever reach.</p>
        ${predict("Claim 1 says “multiple of 6” is enough to be a “multiple of 3”. Is “multiple of 3” enough to be a “multiple of 6”?",
          "<p>No: \\(3, 9, 15, \\dots\\) are multiples of 3 and not of 6. So claim 1 can be true while claim 2, its converse, is false (chapter 3).</p>")}` },
    ],
    takeaways: [
      "A theorem is true in every case; a proof shows why.",
      "Tests can refute a claim, never prove a claim about infinitely many cases.",
    ],
  },
  {
    slug: "2-ifthen", nav: "If–then", title: "If–Then Statements and Direct Proof",
    subtitle: "Hypothesis, conclusion, and the one case that breaks the promise",
    abstract: "“If A then B” makes a promise about the cases where A holds. It is broken only by A true and B false. A direct proof shows that case never happens.",
    tags: ["A ⇒ B", "sufficient, necessary", "direct proof"],
    hero: "caseGrid", heroCaption: "Sort numbers by A and B: the claim is the empty cell.",
    sections: [
      { id: "promise", title: "The case grid", html: String.raw`
        <p>Most theorems have the form “if \(A\), then \(B\)”, written \(A \Rightarrow B\). \(A\) is the <b>hypothesis</b>, \(B\) the <b>conclusion</b>. We also say \(A\) is <b>sufficient</b> for \(B\), and \(B\) is <b>necessary</b> for \(A\).</p>
        <p>The statement is broken by a case where \(A\) is true and \(B\) is false, and by nothing else. Sort \(n = 1, \dots, 18\) for claim 1 (\(A\): \(6 \mid n\), \(B\): \(3 \mid n\)) into the four cases:</p>
        ${run("caseGrid")}
        <p>The cell “\(A\) and not \(B\)” is empty. That empty cell is exactly what the claim says.</p>
        ${demo("caseGrid", "Demo 1 · The case grid", "pick a claim and a view", "Switch to “converse”: a different cell must be empty. Switch to “contrapositive”: the same cell as the statement.")}` },
      { id: "direct", title: "Direct proofs", html: String.raw`
        ${callout("pattern", "PATTERN · DIRECT PROOF OF A ⇒ B", `<p>Assume \\(A\\). Write out what \\(A\\) means by its definition. Use algebra and results already proved to reach what \\(B\\) means by its definition. Conclude \\(B\\).</p>`)}
        <p><b>Theorem 1.</b> For every integer \(n\), if \(6 \mid n\) then \(3 \mid n\). <em>Proof.</em> Assume \(n = 6a\) for an integer \(a\). Then \(n = 3 \cdot (2a)\), and \(2a\) is an integer, so \(3 \mid n\). \(\square\)</p>
        <p><b>Theorem 2.</b> If \(n\) is odd then \(n^2\) is odd. <em>Proof.</em> Assume \(n = 2a + 1\). Then</p>
        $$n^2 = (2a + 1)^2 = 4a^2 + 4a + 1 = 2\,(2a^2 + 2a) + 1,$$
        <p>and \(2a^2 + 2a\) is an integer, so \(n^2\) is odd. \(\square\) The algebra, checked for every \(a\) at once:</p>
        ${run("sympyOdd")}
        <p><b>Theorem 3.</b> If \(a \mid b\) and \(b \mid c\), then \(a \mid c\). <em>Proof.</em> \(b = as\) and \(c = bt\), so \(c = a(st)\). \(\square\) With \(3 \mid 12\) and \(12 \mid 60\) the new quotient is \(st = 4 \cdot 5\):</p>
        ${run("transitive")}
        ${callout("pitfall", "PITFALL · CHECKING THE CONCLUSION FIRST", `<p>A direct proof starts from the hypothesis. Starting from "\\(n^2\\) is odd, so \\(n^2 = 2m + 1\\)…" runs the argument backwards and proves a different statement (the converse).</p>`)}` },
    ],
    takeaways: [
      "A ⇒ B is broken only by a case with A true and B false.",
      "Direct proof: assume A, unfold definitions, reach B.",
    ],
  },
  {
    slug: "3-contra", nav: "Contrapositive", title: "Converse, Contrapositive, If and Only If",
    subtitle: "Which rewordings say the same thing",
    abstract: "The contrapositive ¬B ⇒ ¬A is broken by the same case as A ⇒ B, so it is equivalent. The converse B ⇒ A is broken by a different case. An “if and only if” needs both directions.",
    tags: ["converse", "contrapositive", "A ⇔ B"],
    hero: "code:contraCheck", heroCaption: "statement, contrapositive, converse on n = 1 … 100",
    sections: [
      { id: "contra", title: "Converse and contrapositive", html: String.raw`
        <p>From \(A \Rightarrow B\) we build the <b>converse</b> \(B \Rightarrow A\) and the <b>contrapositive</b> \(\neg B \Rightarrow \neg A\). The contrapositive is broken by “not \(B\) and not (not \(A\))”, which is “\(A\) and not \(B\)”: <b>the same case</b> as the statement. So they are true together and false together: <b>logically equivalent</b>. The converse is broken by “\(B\) and not \(A\)”, a different cell.</p>
        ${run("contraCheck")}
        ${callout("pattern", "PATTERN · PROOF BY CONTRAPOSITIVE", `<p>To prove \\(A \\Rightarrow B\\), assume \\(\\neg B\\) and prove \\(\\neg A\\) directly.</p>`)}
        <p><b>Theorem 4.</b> If \(n^2\) is even then \(n\) is even. <em>Proof.</em> The contrapositive is “if \(n\) is odd then \(n^2\) is odd”, which is Theorem 2. \(\square\) A direct attempt gets stuck: from \(n^2 = 2m\) there is no easy way to write \(n\) as twice something.</p>
        ${predict("“If it is raining, the street is wet.” Write the converse and the contrapositive. Which one would you trust?",
          "<p>Converse: “if the street is wet, it is raining” (no: a street cleaner may have passed). Contrapositive: “if the street is not wet, it is not raining”, equivalent to the statement.</p>")}` },
      { id: "iff", title: "If and only if", html: String.raw`
        <p>“\(A\) if and only if \(B\)”, \(A \Leftrightarrow B\), means both \(A \Rightarrow B\) and \(B \Rightarrow A\): \(A\) is <b>necessary and sufficient</b> for \(B\). In the case grid, <em>both</em> off-diagonal cells must be empty.</p>
        ${callout("pattern", "PATTERN · PROOF OF A ⇔ B", `<p>Two proofs. (⇒) Assume \\(A\\), prove \\(B\\). (⇐) Assume \\(B\\), prove \\(A\\). Either may be direct or by contrapositive.</p>`)}
        <p><b>Theorem 5.</b> \(n\) is even if and only if \(n^2\) is even. (⇒) \(n = 2a\) gives \(n^2 = 2\,(2a^2)\). (⇐) is Theorem 4. \(\square\)</p>
        ${run("iffTable")}
        ${callout("pitfall", "PITFALL · PROVING ONE DIRECTION", `<p>An “if and only if” needs two arguments. Proving only the easy direction leaves half of the theorem unproved.</p>`)}` },
    ],
    takeaways: [
      "Contrapositive: equivalent. Converse: a different statement.",
      "A ⇔ B: prove A ⇒ B and B ⇒ A.",
    ],
  },
  {
    slug: "4-counter", nav: "Counterexamples", title: "Counterexamples",
    subtitle: "One case kills a claim, if it is the right kind of case",
    abstract: "2ᵖ − 1 is prime for p = 2, 3, 5, 7 and not for p = 11. A counterexample makes the hypothesis true and the conclusion false; p = 4 does neither.",
    tags: ["2ᵖ − 1", "6 | 36", "x² > 4"],
    hero: "code:mersenne", heroCaption: "2ᵖ − 1 for the first five primes",
    sections: [
      { id: "kill", title: "One case is enough", html: String.raw`
        <p>To show that “for every \(n\), if \(A\) then \(B\)” is <b>false</b>, one <b>counterexample</b> is enough: a value where \(A\) is true and \(B\) is false.</p>
        <p><b>Claim.</b> If \(p\) is prime, then \(2^p - 1\) is prime.</p>
        ${run("mersenne")}
        <p>\(p = 11\) is prime and \(2^{11} - 1 = 2047 = 23 \cdot 89\) is not: the claim is false. <b>Claim.</b> If \(a \mid bc\) then \(a \mid b\) or \(a \mid c\). Try \(a = 6\), \(b = 4\), \(c = 9\):</p>
        ${run("divCounter")}
        <p>For an “if and only if” one failed direction is enough. “\(x^2 > 4\) if and only if \(x > 2\)”: (⇐) is true, but (⇒) fails at \(x = -3\).</p>
        ${run("squareCounter")}` },
      { id: "notone", title: "What is not a counterexample", html: String.raw`
        ${callout("pitfall", "PITFALL · A CASE WHERE THE HYPOTHESIS IS FALSE", `<p>For “if \\(p\\) is prime then \\(2^p - 1\\) is prime”, \\(p = 4\\) gives \\(15\\), not prime, but \\(4\\) is not prime either, so the statement promised nothing about it. A counterexample must make the hypothesis <b>true</b> and the conclusion <b>false</b>.</p>`)}
        ${run("notCounter")}
        <p>In Demo 1, choose “p prime ⇒ 2ᵖ − 1 prime”: the value 4 lands in the cell “not \(A\), not \(B\)”, which breaks nothing; 11 lands in the broken cell.</p>
        ${predict("“Every odd number greater than 1 is prime.” Find the smallest counterexample. Is 2 a counterexample?",
          "<p>\\(9 = 3 \\cdot 3\\) is the smallest. \\(2\\) is not a counterexample: it is not odd, so the hypothesis is false.</p>")}` },
    ],
    takeaways: [
      "One counterexample disproves a claim.",
      "It must make the hypothesis true and the conclusion false.",
    ],
  },
  {
    slug: "5-boolean", nav: "Boolean algebra", title: "Boolean Algebra and Its Laws",
    subtitle: "Arithmetic with T and F",
    abstract: "Five operations on TRUE and FALSE, truth tables that list every case, and laws such as De Morgan's, each proved by checking every row.",
    tags: ["∧ ∨ ¬ ⇒ ⇔", "truth tables", "De Morgan"],
    hero: "truthTable", heroCaption: "Type two expressions; the table compares them in every row.",
    sections: [
      { id: "ops", title: "Truth tables", html: String.raw`
        ${video(VIDEO_P2)}
        <p>Boolean algebra computes with two values, T and F. \(x \wedge y\) (and) is true when both are; \(x \vee y\) (or) when at least one is (inclusive); \(\neg x\) (not) flips the value; \(x \Rightarrow y\) is false only when \(x\) is true and \(y\) is false; \(x \Leftrightarrow y\) is true exactly when they have the same value.</p>
        ${run("truthTable")}
        <p>The \(\Rightarrow\) column is the case grid of chapter 2 written as a table. The rows with \(x\) false are true: “If you score at least 90 on the final, you get an A” is broken only by a student who scores 90 or more and does not get an A. A student who scores 70 cannot break it; the promise is <b>vacuously true</b> there.</p>
        ${predict("Is “if 2 + 2 = 5, then 7 is even” true or false?", "<p>True: the hypothesis is false, so the promise cannot be broken.</p>")}` },
      { id: "laws", title: "Laws, and why a truth table is a proof", html: String.raw`
        <p>Two Boolean expressions are <b>equal</b> (logically equivalent) when they have the same value in every row. The laws: commutative, associative, identity (\(x \wedge \mathrm T = x\), \(x \vee \mathrm F = x\)), idempotent, distributive, complement (\(x \wedge \neg x = \mathrm F\), \(x \vee \neg x = \mathrm T\)), double negative, and De Morgan's:</p>
        $$\neg(x \wedge y) = \neg x \vee \neg y, \qquad \neg(x \vee y) = \neg x \wedge \neg y.$$
        ${callout("pattern", "PATTERN · PROOF BY TRUTH TABLE", `<p>List every combination of values of the variables (\\(2^m\\) rows for \\(m\\) variables) and check that both expressions agree in each row. The rows are <em>all</em> the cases, so this is a complete proof.</p>`)}
        ${run("laws")}
        ${demo("truthTable", "Demo 2 · Compare two expressions", "type or pick a pair", "Use ! or ¬ for not, &amp; for and, | for or, -&gt; for implies, &lt;-&gt; for if and only if, T and F for constants.")}
        <p>The contrapositive is a law too, the converse is not, and an implication can be written without the arrow:</p>
        ${run("impLaws")}
        <p>\(\neg(x \Rightarrow y) = x \wedge \neg y\): the negation of an if–then statement is “\(A\) and not \(B\)”, which is exactly what a counterexample shows.</p>
        ${callout("pitfall", "PITFALL · “NOT” DOES NOT SIMPLY DISTRIBUTE", `<p>\\(\\neg(x \\wedge y)\\) is <em>not</em> \\(\\neg x \\wedge \\neg y\\): they differ when exactly one of \\(x, y\\) is true. De Morgan flips \\(\\wedge\\) to \\(\\vee\\).</p>`)}
        ${run("deMorganWrong")}` },
    ],
    takeaways: [
      "Equal means: the same value in every row.",
      "Checking all 2ᵐ rows is a proof.",
      "¬ flips ∧ into ∨ and ∨ into ∧ (De Morgan).",
    ],
  },
  {
    slug: "6-classify", nav: "Classify", title: "Tautology, Contradiction, Contingency",
    subtitle: "Reading the last column, and Boolean algebra in code",
    abstract: "Every expression is always true, always false, or sometimes each. Modus ponens is a tautology; “a statement implies its converse” is not. And every if in a program is a Boolean expression.",
    tags: ["tautology", "contradiction", "SAT"],
    hero: "code:classify", heroCaption: "Five expressions, classified by their truth tables",
    sections: [
      { id: "classes", title: "Three classes", html: String.raw`
        ${callout("note", "DEFINITION", `<p>A <b>tautology</b> is true in every row. A <b>contradiction</b> is false in every row. A <b>contingency</b> is true in some rows and false in others.</p>`)}
        ${run("classify")}
        <p>\(x \vee \neg x\) is a tautology and \(x \wedge \neg x\) a contradiction; \(x \Rightarrow \neg x\) is a contingency. \(((x \Rightarrow y) \wedge x) \Rightarrow y\) is a tautology: the rule every direct proof uses. \((x \Rightarrow y) \Rightarrow (y \Rightarrow x)\), “a statement implies its converse”, is a contingency: it fails when \(x\) is false and \(y\) true. Two expressions \(f\), \(g\) are equal exactly when \(f \Leftrightarrow g\) is a tautology.</p>` },
      { id: "code", title: "Boolean algebra in code", html: String.raw`
        ${callout("note", "CS · CONDITIONS, EXHAUSTIVE TESTS AND SAT", `<p>Every <code>if</code> tests a Boolean expression, and the laws rewrite it safely: <code>not (logged_in and is_admin)</code> is <code>not logged_in or not is_admin</code>. A condition in \\(m\\) variables has only \\(2^m\\) cases, so it can be <b>tested exhaustively</b>, which is a proof. For many variables \\(2^m\\) explodes: deciding whether a big expression is ever true is the <b>SAT problem</b>, the classic hard problem of complexity theory.</p>`)}
        ${run("condition")}` },
    ],
    takeaways: [
      "Tautology: always T. Contradiction: always F. Contingency: both.",
      "f = g exactly when f ⇔ g is a tautology.",
    ],
  },
  {
    slug: "7-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's proof",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and a checklist for reading a proof that an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant writes proofs fluently, and a fluent proof of the wrong statement is easy to miss. Check: (1) does the proof start from the hypothesis, or from the conclusion (the converse)? (2) does an “if and only if” have two arguments? (3) does each counterexample make the hypothesis true and the conclusion false? (4) recompute every truth table with all \(2^m\) rows; (5) test integer claims on the first few hundred values.</p>
        <p>Check (3) on “give a counterexample to: if \(n^2 + n + 1\) is prime then \(n\) is prime”. An assistant may offer \(n = 3\), but 3 is prime, so it is no counterexample. The search finds the real ones:</p>
        ${run("aiCheck")}
        <p>And \((x \Rightarrow y) \vee (y \Rightarrow x)\) is indeed a tautology:</p>
        ${run("aiTaut")}` },
    ],
    takeaways: [
      "Start from the hypothesis; for ⇔ prove both directions.",
      "A counterexample: hypothesis true, conclusion false.",
      "A full truth table is a proof; a table of integers is not.",
    ],
  },
];
