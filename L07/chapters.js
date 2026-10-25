// Chapter content, adapted from notes/L07-induction.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L07-1.mp4";
const VIDEO_P2 = "media/L07-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 7,
  title: "Mathematical Induction",
  tagline: "From one case to every case",
  lead: "A pattern that holds forty times and then breaks, a square that grows by one odd number at a time, and stamps that only work from twelve cents on. Interactive notes on proof by induction and strong induction, where every number was checked by running code.",
  heroDemo: "dominoMini",
  heroLabel: "The principle of induction",
  heroCaption: "Push the first domino (base case); each one knocks over the next (step). So all of them fall.",
  whyTitle: "Why induction",
  whySub: "The proof technique for statements about every natural number",
  why: [
    ["Cases are not proofs", "\\(n^2 + n + 41\\) is prime for \\(n = 0, \\dots, 39\\) and not at 40. No table of examples proves a statement about <b>all</b> \\(n\\)."],
    ["Two facts reach every n", "A <b>base case</b> and a <b>step</b> from \\(k\\) to \\(k + 1\\): like dominoes, the first falls and each knocks over the next."],
    ["Proofs that are programs", "A proof by (strong) induction is a recursive algorithm: pay \\(n\\) cents by paying \\(n - 4\\), tile a board by tiling its quarters."],
  ],
  ctaTitle: "Ready for the first domino?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 7 · Part 1 — Induction: from one case to every case",
    [VIDEO_P2]: "Lecture 7 · Part 2 — Strong induction",
  },
};

const CHAPTERS = [
  {
    slug: "1-pattern", nav: "Patterns", title: "A Pattern That Breaks",
    subtitle: "Why checking cases is not enough",
    abstract: "Forty cases in a row can all agree and the forty-first can still fail. A second pattern, sums of odd numbers, looks just as convincing; this lecture turns it into a proof.",
    tags: ["n² + n + 41", "odd numbers", "counterexample"],
    hero: "code:n40", heroCaption: "40² + 40 + 41 = 41 · 41",
    sections: [
      { id: "forty", title: "Forty out of forty", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Take the numbers \(n^2 + n + 41\) for \(n = 0, 1, 2, \dots\): \(41, 43, 47, 53, 61, 71, \dots\) Each one is prime. Check the first forty with a short program:</p>
        ${run("primes40")}
        <p>Forty cases out of forty. It is tempting to say "it is always prime". But at \(n = 40\):</p>
        ${run("n40")}
        <p>\(40^2 + 40 + 41 = 40 \cdot 41 + 41 = 41 \cdot 41\). The pattern held forty times and then broke. No number of checked cases proves a statement about <em>all</em> natural numbers, because there are always more cases than we checked.</p>` },
      { id: "odds", title: "Sums of odd numbers", html: String.raw`
        <p>Here is a second pattern. Add up the first few odd numbers:</p>
        ${run("odds")}
        <p>The sums are \(1, 4, 9, 16, 25, 36\): the squares. Does the sum of the first \(n\) odd numbers always equal \(n^2\)? After the first example, a table is not enough.</p>
        ${predict("If you already knew that the first \\(k\\) odd numbers add up to \\(k^2\\), how would you get the sum of the first \\(k + 1\\) odd numbers without adding them all again?",
          "<p>Add the next odd number, \\(2k + 1\\): \\(k^2 + (2k + 1) = (k + 1)^2\\). That one idea is the inductive step of chapter 2.</p>")}` },
    ],
    takeaways: [
      "A pattern checked for many n can still fail for the next one.",
      "Only a proof covers every natural number.",
    ],
  },
  {
    slug: "2-principle", nav: "Principle", title: "The Principle and the Four-Step Template",
    subtitle: "Base case, hypothesis, step, conclusion",
    abstract: "Why a base case and a step from k to k + 1 reach every natural number, the template every proof by induction follows, and the first proof: the odd numbers make a square.",
    tags: ["dominoes", "well-ordering", "1 + 3 + … + (2n − 1) = n²"],
    hero: "toc",
    sections: [
      { id: "dominoes", title: "Dominoes", html: String.raw`
        <p>Imagine an endless row of dominoes, one for each natural number \(0, 1, 2, \dots\) Two facts make all of them fall: the first domino falls, and whenever a domino falls it knocks over the next one. Neither is enough alone.</p>
        ${demo("dominoes", "Demo 1 · Base case and step", "switch them off one at a time", "Untick the base case: nothing moves. Break the link after 5: the chain stops at 5.")}
        ${callout("note", "DEFINITION · PRINCIPLE OF MATHEMATICAL INDUCTION", `<p>Let \\(A\\) be a set of natural numbers. If (1) \\(0 \\in A\\), and (2) for every \\(k \\in \\mathbb N\\), if \\(k \\in A\\) then \\(k + 1 \\in A\\), then \\(A = \\mathbb N\\).</p>`)}
        <p>Usually \(A\) is the set of \(n\) for which a statement \(P(n)\) is true, so "\(A = \mathbb N\)" means "\(P(n)\) is true for every natural number \(n\)".</p>
        <p><b>Why it is true.</b> Suppose (1) and (2) hold but \(A \neq \mathbb N\). The numbers <em>not</em> in \(A\) form a nonempty set, so by the well-ordering principle (Lecture 6) there is a least one, \(m\). It is not \(0\), since \(0 \in A\). So \(m - 1\) is a natural number, and it is in \(A\) because \(m\) was the least number outside. Now (2) with \(k = m - 1\) gives \(m \in A\): a contradiction. A smallest counterexample would be knocked over by the case just before it.</p>` },
      { id: "template", title: "The four-step template", html: String.raw`
        ${callout("pattern", "PATTERN · PROOF BY INDUCTION", `<ol><li><b>Base case.</b> Show that \\(P(c)\\) is true.</li><li><b>Inductive hypothesis.</b> Let \\(k \\ge c\\) be arbitrary and assume \\(P(k)\\).</li><li><b>Inductive step.</b> Using the hypothesis, show \\(P(k + 1)\\).</li><li><b>Conclusion.</b> By induction, \\(P(n)\\) holds for every \\(n \\ge c\\).</li></ol>`)}
        <p>The start does not have to be \(0\). Step 2 is the only place where we <em>assume</em> something, and what we assume is \(P(k)\) for one arbitrary \(k\), never \(P(k + 1)\).</p>` },
      { id: "odds", title: "Theorem 1: the odd numbers make a square", html: String.raw`
        <p><b>Theorem 1.</b> For every integer \(n \ge 1\), \(1 + 3 + 5 + \dots + (2n - 1) = n^2\).</p>
        <p><em>Base case.</em> For \(n = 1\) the sum is \(1 = 1^2\). <em>Inductive hypothesis.</em> Let \(k \ge 1\) and assume \(1 + 3 + \dots + (2k - 1) = k^2\). <em>Inductive step.</em> The next odd number is \(2(k + 1) - 1 = 2k + 1\), so</p>
        $$1 + 3 + \dots + (2k - 1) + (2k + 1) = k^2 + (2k + 1) = (k + 1)^2.$$
        <p><em>Conclusion.</em> By induction, the formula holds for every \(n \ge 1\). \(\square\)</p>
        <p>The one piece of algebra is an identity in \(k\); sympy expands it for every \(k\) at once:</p>
        ${run("sympyOdd")}
        <p><b>The picture.</b> \(k^2\) is a \(k\)-by-\(k\) square of dots. The next odd number \(2k + 1\) is an L-shaped layer: \(k\) dots down the side, \(k\) along the bottom and one in the corner. The old square is the hypothesis; the new layer is the step.</p>
        ${demo("square", "Demo 2 · One odd number, one layer", "drag n")}
        ${run("layers")}
        ${callout("pitfall", "PITFALL · WRITING THE STEP BACKWARDS", `<p>Starting from "\\(1 + \\dots + (2k + 1) = (k + 1)^2\\)", simplifying both sides and ending with "\\(k^2 = k^2\\), true" shows only that the goal <em>implies</em> something true, which proves nothing. Start from the left side of \\(P(k + 1)\\), use the hypothesis, and arrive at the right side.</p>`)}` },
    ],
    takeaways: [
      "Base case + step from k to k + 1 = every n ≥ c.",
      "The principle follows from well-ordering: no smallest counterexample.",
      "Assume P(k) for one arbitrary k; prove P(k + 1) from it.",
    ],
  },
  {
    slug: "3-more", nav: "More proofs", title: "Inequalities and Divisibility",
    subtitle: "Where the base case goes, and how the hypothesis is used",
    abstract: "2ⁿ > n² only from n = 5 on, so that is where the base case goes. And 4 divides 5ⁿ − 1, with the quotient growing from m to 5m + 1.",
    tags: ["2ⁿ > n²", "4 | 5ⁿ − 1", "starting at c"],
    hero: "code:table2n", heroCaption: "2ⁿ against n² for n = 0 … 8",
    sections: [
      { id: "ineq", title: "Theorem 2: 2ⁿ > n² for n ≥ 5", html: String.raw`
        <p>First look at small \(n\); the statement is false for some of them, which is why the theorem starts at \(5\):</p>
        ${run("table2n")}
        <p><em>Base case:</em> \(2^5 = 32 > 25\). <em>Hypothesis:</em> \(2^k > k^2\) for some \(k \ge 5\). <em>Step:</em></p>
        $$2^{k+1} = 2 \cdot 2^k > 2k^2 = k^2 + k^2 \ge k^2 + 5k > k^2 + 2k + 1 = (k + 1)^2,$$
        <p>using \(k^2 \ge 5k\) (since \(k \ge 5\)) and \(5k > 2k + 1\). The step needs \(k \ge 5\); it would not work from \(k = 2\). A sanity check of the two facts (the proof is what covers every \(k\)):</p>
        ${run("sanity2n")}` },
      { id: "div", title: "Theorem 3: 4 divides 5ⁿ − 1", html: String.raw`
        <p><em>Base case:</em> \(5^0 - 1 = 0 = 4 \cdot 0\). <em>Hypothesis:</em> \(5^k - 1 = 4m\) for an integer \(m\). <em>Step:</em></p>
        $$5^{k+1} - 1 = 5\,(5^k - 1) + 4 = 5 \cdot 4m + 4 = 4\,(5m + 1).$$
        <p>The step tells how the quotient grows, from \(m\) to \(5m + 1\). The program follows the quotients and compares them with direct division:</p>
        ${run("quotients")}
        ${predict("Where would the base case of \\(n! > 2^n\\) go?", "<p>At \\(n = 4\\): \\(4! = 24 > 16\\), while \\(3! = 6 < 8\\). See exercise 3.</p>")}` },
    ],
    takeaways: [
      "Put the base case where the statement starts being true, and check the step works from there.",
      "In divisibility proofs, the step shows how the quotient changes.",
    ],
  },
  {
    slug: "4-broken", nav: "Broken proofs", title: "Two Ways an Induction Breaks",
    subtitle: "A missing base case, and a step that fails once",
    abstract: "A perfect step for a false claim (n² + n is odd), and a step that works for every k except k = 1 (all cats have the same colour).",
    tags: ["n² + n", "cats", "every k ≥ c"],
    hero: "dominoes", heroCaption: "Untick the base case, or break one link.",
    sections: [
      { id: "nobase", title: "A correct step is not enough", html: String.raw`
        <p><b>Claim.</b> For every \(n \in \mathbb N\), \(n^2 + n\) is odd. <em>"Step."</em> If \(k^2 + k\) is odd, then \((k + 1)^2 + (k + 1) = (k^2 + k) + 2(k + 1)\) is odd plus even, which is odd. Every line is correct:</p>
        ${run("oddStep")}
        <p>Yet the claim is false for every \(n\):</p>
        ${run("alwaysEven")}
        <p>\(n^2 + n = n(n + 1)\) is a product of two consecutive integers, so it is always even. What is missing is the <b>base case</b>: \(0^2 + 0 = 0\) is not odd. The chain is perfect, but the first domino never falls.</p>
        ${callout("pitfall", "PITFALL · “THE BASE CASE IS OBVIOUS, SKIP IT”", `<p>It is the half of the proof that connects the chain to something true. Without it you have shown only "if the statement ever holds, it keeps holding", which a false statement can satisfy.</p>`)}` },
      { id: "cats", title: "A step that fails once", html: String.raw`
        <p><b>Claim.</b> In any group of \(n \ge 1\) cats, all the cats have the same colour. <em>"Proof."</em> One cat has one colour. For \(k + 1\) cats \(c_1, \dots, c_{k+1}\): the first \(k\) match by the hypothesis, the last \(k\) match too, and the cats in the middle belong to both groups, so all match.</p>
        <p>The step quietly needs a cat in the middle. The groups \(\{c_1, \dots, c_k\}\) and \(\{c_2, \dots, c_{k+1}\}\) share \(k - 1\) cats:</p>
        ${run("cats")}
        <p>At \(k = 1\) they share none, so nothing ties the two colours together. The step is valid for every \(k \ge 2\) but not for \(k = 1\), and that one broken link is enough. The inductive step must hold for <b>every</b> \(k \ge c\), including the very first one.</p>` },
    ],
    takeaways: [
      "No base case: a correct step can 'prove' a false statement.",
      "The step must work for every k ≥ c, starting with k = c.",
    ],
  },
  {
    slug: "5-strong", nav: "Strong", title: "Strong Induction",
    subtitle: "When the step reaches further back",
    abstract: "With 4-cent and 5-cent stamps, every amount from 12 on can be paid. The step goes back four cents, so the proof needs four base cases. Prime factorisation needs every smaller case.",
    tags: ["stamps", "four base cases", "prime factors"],
    hero: "code:pay", heroCaption: "The proof as a recursive program",
    sections: [
      { id: "stamps", title: "Stamps of 4 and 5 cents", html: String.raw`
        ${video(VIDEO_P2)}
        <p>A post office sells only 4-cent and 5-cent stamps. Which amounts can be paid exactly? Search all small amounts:</p>
        ${run("stamps")}
        <p>Only \(1, 2, 3, 6, 7, 11\) fail below 30. To pay \(k + 1\) cents, knowing how to pay \(k\) does not help (there is no 1-cent stamp), but knowing how to pay \(k - 3\) does: add a 4-cent stamp. The step reaches back four cents.</p>
        ${callout("note", "DEFINITION · PRINCIPLE OF STRONG INDUCTION", `<p>Let \\(A\\) be a set of natural numbers. If \\(0 \\in A\\), and for every \\(k\\), \\(0, 1, \\dots, k \\in A\\) implies \\(k + 1 \\in A\\), then \\(A = \\mathbb N\\).</p>`)}
        ${callout("pattern", "PATTERN · PROOF BY STRONG INDUCTION", `<ol><li><b>Base cases.</b> \\(P(c), \\dots, P(c + d)\\): as many as the step reaches back.</li><li><b>Hypothesis.</b> Let \\(k \\ge c + d\\); assume \\(P(n)\\) for every \\(c \\le n \\le k\\).</li><li><b>Step.</b> Prove \\(P(k + 1)\\).</li><li><b>Conclusion.</b> \\(P(n)\\) for every \\(n \\ge c\\).</li></ol>`)}
        <p><b>Theorem 4.</b> Every amount \(n \ge 12\) can be paid. <em>Base cases:</em> \(12 = 3 \cdot 4\), \(13 = 2 \cdot 4 + 5\), \(14 = 4 + 2 \cdot 5\), \(15 = 3 \cdot 5\). <em>Hypothesis:</em> \(k \ge 15\) and every amount from 12 to \(k\) can be paid. <em>Step:</em> \(k - 3\) is between 12 and \(k\), so it can be paid; one more 4-cent stamp pays \(k + 1\). \(\square\)</p>
        <p>Why four base cases? The step uses \(k - 3 \ge 12\), which needs \(k \ge 15\). With one base case the chain from 12 reaches only 16, 20, 24, …</p>
        ${demo("stamps", "Demo 3 · How many base cases?", "change the stamps", "Switch to “only the first base case” to see the gaps; try 3 and 5, or 5 and 7.")}
        <p>The proof is also an algorithm: to pay \(n\) cents, pay \(n - 4\) and add a stamp, until a base case is reached.</p>
        ${run("pay")}` },
      { id: "primes", title: "Theorem 5: products of primes", html: String.raw`
        <p><b>Theorem 5.</b> Every integer \(n \ge 2\) is a prime or a product of primes. <em>Base case:</em> 2 is prime. <em>Hypothesis:</em> every integer from 2 to \(k\) is. <em>Step:</em> if \(k + 1\) is not prime, \(k + 1 = ab\) with \(2 \le a, b \le k\); both are products of primes by the hypothesis, so \(k + 1\) is too. \(\square\)</p>
        <p>Ordinary induction would be useless here: \(k\) and \(k + 1\) share no factor greater than 1. The step needs smaller cases anywhere below. Again the proof is a recursive program:</p>
        ${run("factor")}
        ${predict("For 3-cent and 5-cent stamps, which amounts can't be paid, and how many base cases does the proof need?", "<p>\\(1, 2, 4, 7\\) can't; every \\(n \\ge 8\\) can. Three base cases, \\(8, 9, 10\\), because the step adds a 3-cent stamp to \\(k - 2\\). Exercise 5.</p>")}` },
    ],
    takeaways: [
      "Strong induction assumes every case from c to k.",
      "Check as many base cases as the step reaches back.",
      "Use it when the step needs unknown smaller cases (factors).",
    ],
  },
  {
    slug: "6-programs", nav: "Programs", title: "Induction and Programs",
    subtitle: "Loop invariants and recursion",
    abstract: "A loop invariant is proved by induction, and a recursive function is correct for the same reasons a proof by strong induction is. The tromino tiling shows both at once.",
    tags: ["loop invariant", "recursion", "trominoes"],
    hero: "code:loop", heroCaption: "After pass i, total = i²",
    sections: [
      { id: "loops", title: "A loop invariant", html: String.raw`
        <p>This loop adds the first \(n\) odd numbers; the <code>assert</code> states a <b>loop invariant</b>: after the \(i\)-th pass, <code>total</code> equals \(i^2\).</p>
        ${run("loop")}
        <p>Why it holds is Theorem 1: true after the first pass (base case), and if true after pass \(i\), then after pass \(i + 1\) the total is \(i^2 + (2i + 1) = (i + 1)^2\) (step).</p>
        ${callout("note", "CS · RECURSION IS STRONG INDUCTION", `<p>A recursive function is correct when its base cases are right and each call is right <em>assuming</em> the calls it makes on smaller inputs are right: the two parts of a proof by strong induction. It stops for the same reason: inputs cannot shrink forever.</p>`)}` },
      { id: "tromino", title: "Tiling a board, one quarter at a time", html: String.raw`
        <p>Exercise 7 proves that a \(2^n \times 2^n\) board with one square removed can be covered by L-trominoes. The step cuts the board into four quarters, places one tromino at the centre so that every quarter has exactly one square missing, and uses the hypothesis on each quarter. Step through the proof:</p>
        ${demo("tromino", "Demo 4 · The inductive step as an algorithm", "click a square, then step", "The red tromino is the step at the top level; each 2 × 2 block at the bottom is a base case.")}` },
    ],
    takeaways: [
      "Loop invariants are proved by induction on the number of passes.",
      "Recursion is strong induction: base cases plus smaller calls.",
    ],
  },
  {
    slug: "7-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's proof",
    abstract: "Five quick questions, seven exercises with hints and full solutions, and a checklist for reading a proof by induction that an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant can write a proof by induction in seconds, and it will look right. Check it: (1) is the base case checked at the right starting value? (2) does the step go from \(P(k)\) to \(P(k + 1)\), not backwards? (3) does it hold for <em>every</em> \(k \ge c\), including the first? (4) is the algebra right (expand it with sympy)? (5) test the statement for the first few hundred \(n\).</p>
        <p>Check (5) on a made-up claim of the kind an assistant can produce, "\(2^n \ge n^2\) for all \(n \ge 0\)":</p>
        ${run("aiCheck")}
        <p>One failure, at \(n = 3\), and the claim is dead. A test can kill a claim in one line; only a proof can establish it.</p>` },
    ],
    takeaways: [
      "Base case, hypothesis, step, conclusion: check every one.",
      "Strong induction: as many base cases as the step reaches back.",
      "A computer test can refute a claim; only a proof covers every n.",
    ],
  },
];
