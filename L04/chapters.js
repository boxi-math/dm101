// Chapter content, adapted from notes/L04-quantifiers.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L04-1.mp4";
const VIDEO_P2 = "media/L04-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 4,
  title: "Quantifiers",
  tagline: "For all, there exists, and the order they come in",
  lead: "A pattern that fails at its third case, a key that opens every lock (or doesn't), and an identity proved by counting subsets two ways. Interactive notes on the two quantifiers, how to prove, disprove and negate them, and combinatorial proof, where every number was checked by running code.",
  heroDemo: "locksMini",
  heroLabel: "∀ lock ∃ key versus ∃ key ∀ lock",
  heroCaption: "Every row has a square: every lock has a key. A full column appears only when one key opens every lock.",
  whyTitle: "Why quantifiers",
  whySub: "Almost every statement in mathematics says “for all” or “there exists”",
  why: [
    ["One witness, one counterexample", "A single example proves “there exists”; a single counterexample sinks “for all”: \\(2^4 - 1 = 15\\) is not prime."],
    ["Negation flips them", "“Not every \\(2^n - 1\\) is prime” means “<b>some</b> \\(2^n - 1\\) is not prime”, never “every one is not prime”."],
    ["Order changes meaning", "“Every lock has a key” and “a key opens every lock” use the same words. Only the first is true of our table."],
  ],
  ctaTitle: "Ready to read the small words?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 4 · Part 1 — For all and there exists",
    [VIDEO_P2]: "Lecture 4 · Part 2 — Order of quantifiers, and counting two ways",
  },
};

const CHAPTERS = [
  {
    slug: "1-pattern", nav: "Two words", title: "A Pattern and Two Small Words",
    subtitle: "“For every” against “there is”",
    abstract: "\\(2^n - 1\\) is prime for \\(n = 2\\) and \\(3\\), and not for \\(n = 4\\). One failure sinks a claim about every \\(n\\), and proves a claim about some \\(n\\).",
    tags: ["2ⁿ − 1", "every", "there is"],
    hero: "code:mersenne", heroCaption: "2ⁿ − 1 for n = 2 … 7",
    sections: [
      { id: "mersenne", title: "Is 2ⁿ − 1 always prime?", html: String.raw`
        ${video(VIDEO_P1)}
        <p>The numbers \(2^n - 1\) for \(n = 2, 3, 4, \dots\) begin \(3, 7, 15, 31, 63, 127\). Is \(2^n - 1\) prime for every \(n \ge 2\)?</p>
        ${run("mersenne")}
        <p>No: \(n = 4\) gives \(15 = 3 \cdot 5\). One failure is enough to sink the claim, because the claim was about <em>every</em> \(n \ge 2\). Compare: "there is an \(n \ge 2\) for which \(2^n - 1\) is not prime". That one is true, and \(n = 4\) proves it.</p>
        <p>The two sentences differ in two small words, "every" and "there is". This lecture is about those words: what they mean, how to prove a statement that contains them, how to deny it, and why their order matters.</p>
        ${predict("The claim “\\(2^n - 1\\) is prime for every \\(n \\ge 2\\)” is false. Is “\\(2^n - 1\\) is <em>not</em> prime for every \\(n \\ge 2\\)” therefore true?",
          "<p>No. It is false too: \\(2^2 - 1 = 3\\) is prime. The negation of the claim is “<b>some</b> \\(2^n - 1\\) is not prime” (chapter 4).</p>")}` },
    ],
    takeaways: [
      "One counterexample is enough to sink a claim about every n.",
      "The same counterexample proves a claim about some n.",
    ],
  },
  {
    slug: "2-quantifiers", nav: "∀ and ∃", title: "For All and There Exists",
    subtitle: "The two quantifiers, their domain, and all / any",
    abstract: "\\(\\forall x \\in A,\\ P(x)\\) says every element of \\(A\\) has property \\(P\\); \\(\\exists x \\in A,\\ P(x)\\) says at least one does. On a finite domain they are Python's all and any.",
    tags: ["∀", "∃", "domain", "all / any"],
    hero: "code:allany", heroCaption: "all is ∀, any is ∃",
    sections: [
      { id: "def", title: "The two quantifiers", html: String.raw`
        ${callout("note", "DEFINITION · QUANTIFIERS", `<p>Let \\(A\\) be a set and \\(P(x)\\) a statement about an element \\(x\\) of \\(A\\).</p><ul><li>The <b>universal quantifier</b>: “\\(\\forall x \\in A,\\ P(x)\\)” means “for every element \\(x\\) of \\(A\\), \\(P(x)\\) is true” (for all, for each, for any).</li><li>The <b>existential quantifier</b>: “\\(\\exists x \\in A,\\ P(x)\\)” means “there is at least one element \\(x\\) of \\(A\\) for which \\(P(x)\\) is true” (there exists, for some).</li></ul>`)}
        <p>The set \(A\) is the <b>domain</b>, and it is part of the statement: "\(\exists x \in \mathbb Z,\ 2x = 1\)" is false, "\(\exists x \in \mathbb Q,\ 2x = 1\)" is true. "There exists" means <em>at least</em> one, not exactly one. The letter \(x\) is a placeholder: \(\forall x \in A,\ P(x)\) says the same as \(\forall t \in A,\ P(t)\).</p>` },
      { id: "finite", title: "Finite domains: and, or, all, any", html: String.raw`
        <p>On a finite domain \(A = \{a_1, a_2, a_3\}\), \(\forall x \in A,\ P(x)\) is \(P(a_1) \wedge P(a_2) \wedge P(a_3)\) and \(\exists x \in A,\ P(x)\) is \(P(a_1) \vee P(a_2) \vee P(a_3)\). Python has both, <code>all</code> and <code>any</code>. With \(A = \{1, 4, 7\}\) and \(B = \{3, 6, 9\}\):</p>
        ${run("allany")}
        <p>Every element of \(A\) leaves remainder 1 on division by 3; some element of \(B\) is even (6); not every element of \(B\) is even.</p>
        ${demo("everySome", "Demo 1 · Every, some, and their negations", "pick a domain and a property", "Try “2ⁿ − 1, n = 2 … 7” with “is prime”: the statement ∀ and the wrong negation are both false.")}
        <p>Quantifiers can be stacked. "For every \(x\) in \(A\) there is a \(y\) in \(B\) with \(x + y = 10\)" is \(\forall x \in A,\ \exists y \in B,\ x + y = 10\), read from left to right: first \(x\) is given, then a \(y\) is found for that \(x\).</p>
        ${run("nested")}
        <p>The nested <code>all(any(...))</code> is the statement word for word.</p>` },
    ],
    takeaways: [
      "∀: every element of the domain. ∃: at least one.",
      "The domain is part of the statement.",
      "On a finite domain, ∀ is all (a long “and”), ∃ is any (a long “or”).",
    ],
  },
  {
    slug: "3-proving", nav: "Proving", title: "Proving and Disproving",
    subtitle: "A witness for ∃, an arbitrary element for ∀, a counterexample against ∀",
    abstract: "To prove “there exists”, name a witness and check it: \\(2^4 = 4^2\\). To prove “for all”, take an arbitrary element: \\(3\\) divides \\(n^3 - n\\) for every integer \\(n\\). To disprove “for all”, one counterexample.",
    tags: ["witness", "arbitrary element", "counterexample", "exhaustion"],
    hero: "code:witness", heroCaption: "A witness: 2⁴ = 16 = 4²",
    sections: [
      { id: "exists", title: "Proving an existential statement", html: String.raw`
        <p>To prove \(\exists x \in A,\ P(x)\) it is enough to find <em>one</em> element of \(A\) for which \(P\) holds, and to check it. That element is a <b>witness</b>.</p>
        <p><b>Theorem 1.</b> There exist positive integers \(a \neq b\) with \(a^b = b^a\). <em>Proof.</em> Take \(a = 2\) and \(b = 4\): they are positive integers, \(2 \ne 4\), and \(2^4 = 16 = 4^2\). \(\square\)</p>
        <p>How the witness was found is not part of the proof; checking it is. A search finds it, and finds that it is the only pair with \(a < b < 50\):</p>
        ${run("witness")}
        ${callout("pattern", "PATTERN · PROOF OF AN EXISTENTIAL STATEMENT", `<ol><li><b>Name a witness:</b> “Let \\(x = \\dots\\)”.</li><li><b>Check it is in the domain:</b> \\(x \\in A\\).</li><li><b>Check the property:</b> show \\(P(x)\\).</li></ol>`)}
        ${callout("pitfall", "PITFALL · “I FOUND ONE THAT FAILS, SO THERE IS NONE”", `<p>\\(a = 2, b = 3\\) gives \\(8 \\ne 9\\), and still a witness exists. To disprove \\(\\exists x,\\ P(x)\\) you must show that <em>every</em> element fails: a universal statement.</p>`)}` },
      { id: "forall", title: "Proving a universal statement", html: String.raw`
        <p>To prove \(\forall x \in A,\ P(x)\) on an infinite domain we take an <b>arbitrary</b> element: "let \(x \in A\)", with nothing else assumed, and show \(P(x)\). Since the argument used nothing special about \(x\), it works for every element.</p>
        <p><b>Theorem 2.</b> For every integer \(n\), \(3\) divides \(n^3 - n\).</p>
        <p><em>Proof.</em> Let \(n\) be an arbitrary integer. Dividing by 3 leaves remainder 0, 1 or 2, so \(n = 3q + r\) with \(q\) an integer and \(r \in \{0, 1, 2\}\). Expanding \(n^3 - n\) in each case gives \(3\,(9q^3 - q)\), \(3\,(9q^3 + 9q^2 + 2q)\) and \(3\,(9q^3 + 18q^2 + 11q + 2)\): always \(3\) times an integer. Since \(n\) was arbitrary, the claim holds for every integer. \(\square\)</p>
        <p>sympy checks the three expansions for every \(q\) at once:</p>
        ${run("cases")}
        <p><b>The picture.</b> \(n^3 - n = (n - 1)\,n\,(n + 1)\) is a product of three consecutive integers, and any three consecutive integers contain exactly one multiple of 3. A loop over 2001 values is a sanity check, not a proof:</p>
        ${run("cube")}
        ${callout("pattern", "PATTERN · PROOF OF A UNIVERSAL STATEMENT", `<ol><li><b>Let \\(x\\) be arbitrary:</b> “Let \\(x \\in A\\).” Assume nothing else.</li><li><b>Show \\(P(x)\\)</b> (cases are fine if together they cover all of \\(A\\)).</li><li><b>Conclude:</b> “Since \\(x\\) was arbitrary, \\(P(x)\\) holds for every \\(x \\in A\\).”</li></ol>`)}` },
      { id: "disprove", title: "Counterexamples and finite domains", html: String.raw`
        <p>\(\forall x \in A,\ P(x)\) is false as soon as <em>one</em> element fails: a <b>counterexample</b>. A computer can search for the first one:</p>
        ${run("first")}
        ${demo("hunter", "Demo 2 · Counterexample hunter", "choose a claim, search further", "A search can kill a claim in one step; finding nothing is not a proof.")}
        <p>When the domain is finite and small, checking every element <em>is</em> a proof (proof by exhaustion). "Every two-digit number whose digits add up to 9 is divisible by 9" has nine cases:</p>
        ${run("digits")}
        ${callout("pitfall", "PITFALL · PROOF BY EXAMPLE", `<p>“For \\(n = 5\\), \\(n^3 - n = 120 = 3 \\cdot 40\\), so 3 divides \\(n^3 - n\\) for all \\(n\\)” proves only the case \\(n = 5\\).</p>`)}
        ${predict("To prove ∃ you need one example; to disprove ∀ you need one counterexample. What do you need to <em>disprove</em> a statement ∃?",
          "<p>You must show that every element fails: \\(\\forall x,\\ \\neg P(x)\\), proved with an arbitrary element. Chapter 4.</p>")}` },
    ],
    takeaways: [
      "Prove ∃ with a witness: name it, check it.",
      "Prove ∀ with an arbitrary element; examples are not enough on an infinite domain.",
      "Disprove ∀ with one counterexample.",
    ],
  },
  {
    slug: "4-negation", nav: "Negation", title: "Negating Quantifiers",
    subtitle: "Move “not” inward and flip the quantifier",
    abstract: "\\(\\neg\\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)\\) and \\(\\neg\\exists x\\, P(x) \\equiv \\forall x\\, \\neg P(x)\\). With two quantifiers, flip both.",
    tags: ["¬∀ = ∃¬", "¬∃ = ∀¬", "De Morgan"],
    hero: "code:negate", heroCaption: "not all, any not, all not",
    sections: [
      { id: "rules", title: "The negation rules", html: String.raw`
        ${callout("note", "DEFINITION · NEGATION RULES", `$$\\neg\\,(\\forall x \\in A,\\ P(x)) \\equiv \\exists x \\in A,\\ \\neg P(x), \\qquad \\neg\\,(\\exists x \\in A,\\ P(x)) \\equiv \\forall x \\in A,\\ \\neg P(x).$$`)}
        <p><b>Why.</b> "For all" is false exactly when some element fails; "there exists" is false exactly when every element fails. On a finite domain these are De Morgan's laws from Lecture 2. So: <b>move "not" past the quantifier and flip it</b>; the domain stays.</p>
        ${run("negate")}
        <p>"Not all are prime" and "some is not prime" agree. "All are not prime" is a different statement, and false: 3, 7, 31 and 127 are prime.</p>
        ${callout("pitfall", "PITFALL · NEGATING ONLY THE PROPERTY", `<p>The negation of “every \\(2^n - 1\\) is prime” is not “every \\(2^n - 1\\) is not prime”: both are false. A statement and its negation always have opposite truth values.</p>`)}` },
      { id: "nested", title: "Several quantifiers", html: String.raw`
        <p>Apply the rule once per quantifier, from the outside in:</p>
        $$\neg\,(\forall x \in A,\ \exists y \in B,\ x + y = 10) \equiv \exists x \in A,\ \forall y \in B,\ x + y \neq 10.$$
        <p>"Some \(x\) in \(A\) has no partner in \(B\)." With \(A' = \{2, 3, 5\}\), \(B' = \{5, 7, 9\}\) the statement is false and the negation true, with witness \(x = 2\):</p>
        ${run("nested2")}
        <p>The negation of a universal statement is existential, so it is proved by a witness, and that witness is a counterexample to the original.</p>` },
    ],
    takeaways: [
      "¬∀ ≡ ∃¬ and ¬∃ ≡ ∀¬: move “not” in, flip the quantifier.",
      "A statement and its negation have opposite truth values.",
      "With several quantifiers, flip each one.",
    ],
  },
  {
    slug: "5-order", nav: "Order", title: "The Order of Quantifiers",
    subtitle: "Every lock has a key, or a key opens every lock",
    abstract: "\\(\\forall L\\ \\exists K\\): every row of the table has a square. \\(\\exists K\\ \\forall L\\): some column is full. The second implies the first, not the other way round.",
    tags: ["∀∃ vs ∃∀", "locks and keys", "find the error"],
    hero: "code:locks", heroCaption: "Every row has a square; no column is full",
    sections: [
      { id: "locks", title: "Locks and keys", html: String.raw`
        ${video(VIDEO_P2)}
        <p>Four locks \(L_1, \dots, L_4\) and four keys \(K_1, \dots, K_4\); a square in row \(L\), column \(K\) means "key \(K\) opens lock \(L\)". Two sentences with the same words in a different order:</p>
        <ol><li>"Every lock has a key that opens it": \(\forall L\ \exists K\), \(K\) opens \(L\). <em>Every row has a square.</em></li>
        <li>"There is a key that opens every lock": \(\exists K\ \forall L\), \(K\) opens \(L\). <em>Some column is full.</em></li></ol>
        ${run("locks")}
        ${demo("locks", "Demo 3 · Rows and columns", "click squares; try the master key", "Every row with a square makes sentence 1 true; only a full column makes sentence 2 true.")}
        <p>In sentence 1 the key may depend on the lock. In sentence 2 one key is chosen first and must work for all locks.</p>` },
      { id: "implies", title: "One direction always holds", html: String.raw`
        $$\exists y \in B,\ \forall x \in A,\ P(x, y) \quad\Longrightarrow\quad \forall x \in A,\ \exists y \in B,\ P(x, y).$$
        <p><em>Proof.</em> Let \(y_0\) be a witness of the left side, so \(P(x, y_0)\) for every \(x\). For an arbitrary \(x \in A\), \(y_0\) is a witness of \(\exists y,\ P(x, y)\). \(\square\) The converse is false: the lock table, or over the integers \(\forall x\ \exists y,\ x + y = 0\) (true, \(y = -x\)) against \(\exists y\ \forall x,\ x + y = 0\) (false: for any \(y\), \(x = 1 - y\) gives \(x + y = 1\)).</p>
        ${run("integers")}
        ${callout("pitfall", "PITFALL · CHOOSING y AFTER x", `<p>A “proof” that there is a largest natural number: “Let \\(n \\in \\mathbb N\\). Take \\(m = n + 1\\). Then \\(n \\le m\\).” Here \\(m\\) depends on \\(n\\), so this proves \\(\\forall n\\ \\exists m,\\ n \\le m\\) only. For \\(\\exists m\\ \\forall n\\), \\(m\\) must be named first, and then \\(n = m + 1\\) is a counterexample.</p>`)}
        ${callout("pattern", "PATTERN · READING NESTED QUANTIFIERS", `<p>Read left to right, as a game: an opponent picks each \\(\\forall\\) element, you pick each \\(\\exists\\) element, and each choice may depend only on the choices made <em>before</em> it.</p>`)}` },
    ],
    takeaways: [
      "∃y ∀x implies ∀x ∃y; the converse fails.",
      "In ∀x ∃y the y may depend on x; in ∃y ∀x it may not.",
    ],
  },
  {
    slug: "6-counting", nav: "Counting", title: "Combinatorial Proof",
    subtitle: "One question, two counts",
    abstract: "Both \\(2^n - 1\\) and \\(1 + 2 + \\dots + 2^{n-1}\\) count the nonempty subsets of \\(\\{1, \\dots, n\\}\\): all subsets minus the empty one, or sorted by their largest element.",
    tags: ["2ⁿ − 1 = 1 + 2 + … + 2ⁿ⁻¹", "largest element", "pairs"],
    hero: "code:subsets", heroCaption: "15 nonempty subsets = 1 + 2 + 4 + 8",
    sections: [
      { id: "proof", title: "Theorem 3: 2ⁿ − 1 = 1 + 2 + … + 2ⁿ⁻¹", html: String.raw`
        ${callout("pattern", "PATTERN · COMBINATORIAL PROOF", `<ol><li><b>Ask</b> a counting question.</li><li><b>Show the LHS answers it.</b></li><li><b>Show the RHS answers it</b>, by a different count.</li><li><b>Conclude:</b> they count the same thing, so they are equal.</li></ol><p>Start with the easier side; the other often comes from splitting into cases.</p>`)}
        <p><b>Question:</b> how many nonempty subsets does \(S = \{1, \dots, n\}\) have? <em>LHS.</em> \(2^n\) subsets (Lecture 3), minus the empty set: \(2^n - 1\). <em>RHS.</em> Sort the nonempty subsets by their <b>largest element</b> \(k\): such a subset is \(\{k\}\) together with any subset of \(\{1, \dots, k - 1\}\), so there are \(2^{k-1}\) of them; each nonempty subset is counted once, and the total is \(2^0 + 2^1 + \dots + 2^{n-1}\). <em>Conclusion:</em> both sides count the same set. \(\square\)</p>
        ${run("subsets")}
        ${demo("subsets", "Demo 4 · Count two ways", "drag n, click a column", "Every coloured square is one nonempty subset; the staircase sorts the same squares by their largest element.")}
        ${run("binary")}
        <p>The algebra agrees (sympy sums the geometric series), but the counting proof gives the reason: each term \(2^{k-1}\) <em>is</em> the set of subsets with largest element \(k\).</p>
        ${run("sumcheck")}` },
      { id: "pairs", title: "A second example: pairs", html: String.raw`
        <p>For every \(n \ge 2\), \(1 + 2 + \dots + (n - 1) = \frac{n(n - 1)}{2}\). <b>Question:</b> how many 2-element subsets does \(\{1, \dots, n\}\) have? Sorted by the larger element \(k\), there are \(k - 1\) pairs for each \(k\); counted as lists of two different elements, there are \(n(n - 1)\), each set counted twice.</p>
        ${run("handshake")}
        ${callout("pitfall", "PITFALL · TWO DIFFERENT QUESTIONS", `<p>Both sides must count the <em>same</em> set. Write the question down in one sentence first, and check each side against it.</p>`)}
        ${predict("Strings of length \\(n\\) over \\(\\{0, 1, 2\\}\\) that are not all zeros: sort them by the position of the last nonzero digit. Which identity do you get?",
          "<p>\\(2 \\cdot 3^0 + 2 \\cdot 3^1 + \\dots + 2 \\cdot 3^{n-1} = 3^n - 1\\). Exercise 8.</p>")}` },
    ],
    takeaways: [
      "A combinatorial proof answers one counting question in two ways.",
      "Sorting by a largest element turns a count into a sum.",
    ],
  },
  {
    slug: "7-code", nav: "Code", title: "Quantifiers in Code",
    subtitle: "all, any, short circuits and empty domains",
    abstract: "all and any stop at the first counterexample or witness, are True and False on an empty domain, and obey the negation rules.",
    tags: ["short circuit", "vacuous truth", "specifications"],
    hero: "toc",
    sections: [
      { id: "code", title: "all, any and nested loops", html: String.raw`
        <ul><li><b>Short-circuit evaluation.</b> <code>any(...)</code> stops at the first witness, <code>all(...)</code> at the first counterexample: the proof patterns of chapter 3, run by the computer.</li>
        <li><b>Empty domains.</b> <code>all([])</code> is <code>True</code> and <code>any([])</code> is <code>False</code>: "for every \(x\) in the empty set" has no counterexample, so it is (vacuously) true.</li>
        <li><b>Negation in code</b> is the rule of chapter 4: <code>not all(p(x) for x in A)</code> equals <code>any(not p(x) for x in A)</code>.</li></ul>
        ${callout("note", "CS · QUANTIFIERS IN COMPUTER SCIENCE", `<p>A query such as “customers who bought <em>every</em> product in a category” is a ∀ inside an ∃, and the order matters as with locks and keys. “For every input the program halts within \\(n^2\\) steps” is different from “there is an input that takes \\(n^2\\) steps”. Testing can find a counterexample to “correct for every input”; only a proof establishes it.</p>`)}` },
    ],
    takeaways: [
      "all / any short-circuit at the first counterexample / witness.",
      "∀ over an empty domain is true; ∃ is false.",
    ],
  },
  {
    slug: "8-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and a checklist for reading quantified statements that an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant translates between English and quantifier notation quickly, and can be wrong in a convincing way. Check: (1) does every quantifier have a domain? (2) in a negation, did <em>every</em> quantifier flip? (3) does the negation have the opposite truth value on a small domain (<code>all</code>, <code>any</code>)? (4) in a proof of \(\exists y\ \forall x\), is \(y\) named before \(x\)? (5) in a combinatorial proof, do both sides count the same set?</p>
        <p>Check (3) on "\(\forall x \in \mathbb Z\ \exists y \in \mathbb Z,\ xy = 1\)", which is false:</p>
        ${run("aiCheck")}
        <p>Only \(x = \pm 1\) have a partner. For all of \(\mathbb Z\): \(xy = 1\) forces \(|x| \cdot |y| = 1\), so \(|x| = 1\).</p>` },
    ],
    takeaways: [
      "Witness for ∃, arbitrary element for ∀, one counterexample against ∀.",
      "Negate by flipping every quantifier.",
      "Read nested quantifiers left to right.",
    ],
  },
];
