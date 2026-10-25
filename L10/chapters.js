// Chapter content, adapted from notes/L10-random-variables.md. Code panels and outputs come from the note (run(),
// CODE / OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html and callout bodies use String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L10-1.mp4";
const VIDEO_P2 = "media/L10-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 10,
  title: "Random Variables",
  tagline: "Functions on a sample space, their averages and their spread",
  lead: "Two four-sided dice, a prize equal to the larger number and a ticket that costs three coins. Interactive notes on random variables, independence, expectation, linearity and variance, where every number was checked by running code with exact fractions.",
  heroDemo: "gridMini",
  heroLabel: "One sample space, many random variables",
  heroCaption: "The same sixteen outcomes, with a different function written into the cells each time.",
  whyTitle: "Why random variables",
  whySub: "The numbers we actually ask about when something random happens",
  why: [
    ["A function, not a random number", "A random variable writes a value into every outcome. The randomness is only in which outcome happens."],
    ["Averages without listing", "<b>Linearity</b>, \\(E(X + Y) = E(X) + E(Y)\\), holds for any random variables and turns hard counts into sums of easy ones."],
    ["Spread matters too", "\\(2X\\) and \\(X + Y\\) both average 5; the <b>variance</b> tells them apart (5 against 5/2)."],
  ],
  ctaTitle: "Ready to roll?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 10 · Part 1 — Random variables and independence",
    [VIDEO_P2]: "Lecture 10 · Part 2 — Expectation and variance",
  },
};

const CHAPTERS = [
  {
    slug: "1-variables", nav: "Variables", title: "A Random Variable Is a Function",
    subtitle: "Values on outcomes, events and distributions",
    abstract: "A game with two four-sided dice. The prize is a rule that turns each outcome into a number: a random variable. Its values cut the sample space into events, and their probabilities are its distribution.",
    tags: ["two dice", "X : S → V", "distribution"],
    hero: "code:game", heroCaption: "The prize max(x, y) in each of the 16 cells",
    sections: [
      { id: "game", title: "A game with two four-sided dice", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A four-sided die shows \(1, 2, 3\) or \(4\), each with probability \(\frac14\). At a school fair you roll two of them and win as many coins as the <b>larger</b> of the two numbers. A ticket costs \(3\) coins. Is the game fair? The sample space has 16 equally likely outcomes \((x, y)\); the prize is a number attached to each one (row \(x\), column \(y\)):</p>
        ${run("game")}
        ${predict("Is the average prize less than, equal to, or more than the ticket price of 3 coins? Look at the grid and guess.",
          "<p>A little more: \\(E(M) = \\frac{25}{8} = 3.125\\) (chapter 3). Seven cells pay 4 and only four cells pay less than 3.</p>")}` },
      { id: "function", title: "Random variables and their distributions", html: String.raw`
        ${callout("note", "DEFINITION · RANDOM VARIABLE", String.raw`<p>Let \((S, P)\) be a sample space and \(V\) a set. A <b>random variable</b> is a function \(X : S \to V\). When \(V \subseteq \mathbb R\) it is <b>real-valued</b>.</p>`)}
        <p>On the two dice, the prize \(M(x, y) = \max(x, y)\), the first die \(X(x, y) = x\), the second die \(Y(x, y) = y\) and the sum \(T(x, y) = x + y\) are all random variables: each writes a different number into the same cell. Nothing about the function is random; the randomness is in which outcome happens. Values need not be numbers ("win" / "lose" is fine), but only real values can be added and averaged.</p>
        <p>For each value \(a\), \(\{X = a\} = \{s \in S : X(s) = a\}\) is an event, and the list of the probabilities \(P(X = a)\) is the <b>distribution</b> of \(X\). For real values, \(\{X < a\}\) is an event too.</p>
        ${run("dist")}
        <p>The prize is 4 in 7 cells, so \(P(M = 4) = \frac{7}{16}\); the counts \(1, 3, 5, 7\) are the odd numbers, one L-shaped layer of the grid each. The sum has the tent shape \(1, 2, 3, 4, 3, 2, 1\) (sixteenths).</p>
        ${demo("rv", "Demo 1 · Write a random variable into the grid", "pick a function", "Each choice is a different function on the same 16 outcomes. Click a value in the bars to see its event.")}
        ${callout("pitfall", "PITFALL · “A RANDOM VARIABLE IS A RANDOM NUMBER”", String.raw`<p>It is a <em>function</em> \(S \to V\), fixed before anything happens. The outcome \((1, 4)\) gives \(M = 4\) and \(T = 5\) at the same time.</p>`)}` },
    ],
    takeaways: [
      "A random variable is a function X : S → V.",
      "Its values define events {X = a}; their probabilities form the distribution.",
    ],
  },
  {
    slug: "2-independence", nav: "Independence", title: "Independent Random Variables",
    subtitle: "Every pair of values, or one counterexample",
    abstract: "Two random variables are independent when the product rule holds for every pair of values. The two dice are; the first die and the prize are not; and one pair that happens to work proves nothing.",
    tags: ["product rule", "all pairs", "one counterexample"],
    hero: "code:indep", heroCaption: "X, Y independent; X, M not",
    sections: [
      { id: "def", title: "The definition, and the two dice", html: String.raw`
        ${callout("note", "DEFINITION · INDEPENDENT RANDOM VARIABLES", String.raw`<p>\(X\) and \(Y\) on the same sample space are <b>independent</b> if \(P(X = a \text{ and } Y = b) = P(X = a)\,P(Y = b)\) for <b>all</b> values \(a\) and \(b\).</p>`)}
        <p><b>Theorem 1.</b> The first die \(X\) and the second die \(Y\) are independent. <em>Proof.</em> For \(a, b \in \{1, 2, 3, 4\}\), the event \(\{X = a \text{ and } Y = b\}\) is the single outcome \((a, b)\), probability \(\frac1{16}\); \(\{X = a\}\) is row \(a\) and \(\{Y = b\}\) is column \(b\), four cells each, so the product is \(\frac14 \cdot \frac14 = \frac1{16}\). For other values both sides are 0. \(\square\)</p>
        <p>The first die and the prize are different: once the first die shows 4, the prize is 4.</p>
        ${run("indep")}
        <p>\(P(X = 4 \text{ and } M = 4) = \frac14\), but \(P(X = 4)\,P(M = 4) = \frac{7}{64}\): not independent.</p>
        ${callout("pattern", "PATTERN · PROVING AND REFUTING INDEPENDENCE", String.raw`<p>To prove independence, show the product rule for <b>every</b> pair of values. To refute it, <b>one</b> pair where it fails is enough.</p>`)}` },
      { id: "onepair", title: "One pair is not enough", html: String.raw`
        <p>The first die \(X\) and the sum \(T\) agree with the product rule at \((1, 5)\) and fail at \((1, 2)\):</p>
        ${run("onepair")}
        ${callout("pitfall", "PITFALL · CHECKING ONE PAIR", String.raw`<p>"\(P(X = 1, T = 5) = P(X = 1)P(T = 5)\), so \(X\) and \(T\) are independent" is wrong. Independence is a statement about <em>all</em> pairs.</p>`)}
        <p>Independence can also hold where it does not look likely. Let \(Z = 1\) if \(x + y\) is even and \(0\) if odd:</p>
        ${run("parity")}
        <p>Whatever the first die shows, exactly two of the four second numbers make the sum even, so \(X\) and \(Z\) are independent (exercise 5).</p>
        ${demo("indep", "Demo 2 · Check every pair", "pick two random variables", "Green cells: the product rule holds for that pair of values. One red cell is enough to refute independence.")}
        ${predict("Are the larger number \\(M\\) and the smaller number \\(\\min(x, y)\\) independent? Find one pair of values that settles it.",
          "<p>No. \\(P(\\min = 4 \\text{ and } M = 1) = 0\\) (the minimum cannot exceed the maximum), but \\(P(\\min = 4)\\,P(M = 1) = \\frac1{16} \\cdot \\frac1{16} \\ne 0\\).</p>")}` },
    ],
    takeaways: [
      "Independent: P(X = a, Y = b) = P(X = a) P(Y = b) for all a, b.",
      "Prove with every pair; refute with one.",
    ],
  },
  {
    slug: "3-expectation", nav: "Expectation", title: "Expectation",
    subtitle: "The level the columns reach when evened out",
    abstract: "The expectation weights each outcome's value by its probability. For the prize it is 25/8, a little more than the ticket. Grouping the outcomes by value gives the same number from the distribution alone.",
    tags: ["E(X)", "25/8", "by values"],
    hero: "level", heroCaption: "Even out the sixteen prizes",
    sections: [
      { id: "def", title: "The average prize", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION · EXPECTATION", String.raw`<p>For a real-valued random variable \(X\) on \((S, P)\), the <b>expectation</b> (expected value) is \(E(X) = \sum_{s \in S} X(s)\,P(s)\).</p>`)}
        ${run("expect")}
        <p>\(E(M) = \frac{50}{16} = \frac{25}{8} = 3.125\). Over many games the player wins about \(\frac18\) coin per game more than the ticket costs.</p>
        <p><b>The picture.</b> Stand the sixteen prizes up as columns of blocks. When the outcomes are equally likely, \(E(M)\) is the level the columns reach if blocks are moved from tall columns to short ones: 50 blocks over 16 columns.</p>
        ${demo("level", "Demo 3 · Level the columns", "pick a random variable, then even out", "Each step moves one block from the tallest column to the shortest. The dashed line is E; the red line is the ticket price.")}` },
      { id: "values", title: "Grouping by values", html: String.raw`
        <p><b>Theorem 2.</b> \(E(X) = \sum_a a\,P(X = a)\), the sum over the values of \(X\).</p>
        <p><em>Proof.</em> Every outcome lies in exactly one event \(\{X = a\}\), the one with \(a = X(s)\). Grouping the sum by those events,</p>
        $$E(X) = \sum_{s} X(s)P(s) = \sum_a \sum_{s : X(s) = a} a\,P(s) = \sum_a a\,P(X = a). \qquad \square$$
        ${run("grouped")}
        <p>For the prize: \(1 \cdot \frac1{16} + 2 \cdot \frac3{16} + 3 \cdot \frac5{16} + 4 \cdot \frac7{16} = \frac{50}{16}\). Only the distribution matters.</p>` },
    ],
    takeaways: [
      "E(X) = Σ X(s) P(s) = Σ a P(X = a).",
      "With equally likely outcomes, E is the plain average of the values.",
    ],
  },
  {
    slug: "4-linearity", nav: "Linearity", title: "Linearity of Expectation",
    subtitle: "Always true, no independence needed",
    abstract: "E(X + Y) = E(X) + E(Y) and E(cX) = c E(X), for any random variables. It gives E(min) = 15/8 from E(max) without a table, and with indicator variables it counts expected sizes without finding a distribution.",
    tags: ["E(X + Y)", "indicators", "unseen faces"],
    hero: "code:unseen", heroCaption: "4 · (3/4)⁴ = 81/64 faces never seen",
    sections: [
      { id: "theorem", title: "The theorem", html: String.raw`
        <p><b>Theorem 3.</b> \(E(X + Y) = E(X) + E(Y)\) and \(E(cX) = c\,E(X)\), so \(E(aX + bY) = aE(X) + bE(Y)\).</p>
        <p><em>Proof.</em> \(E(X + Y) = \sum_s (X(s) + Y(s))P(s) = \sum_s X(s)P(s) + \sum_s Y(s)P(s)\), and \(E(cX) = \sum_s c\,X(s)P(s) = c\,E(X)\). \(\square\) The proof never uses independence.</p>
        <p>One die has \(E(X) = \frac52\), so \(E(T) = 5\) with no table. And \(\max + \min = x + y\) in every cell, so \(E(\min) = 5 - \frac{25}{8} = \frac{15}{8}\), although min and max are dependent:</p>
        ${run("linear")}` },
      { id: "indicators", title: "Counting with indicators", html: String.raw`
        <p>The <b>indicator</b> of an event \(A\) is \(1_A(s) = 1\) if \(s \in A\) and \(0\) otherwise; \(E(1_A) = P(A)\). Roll one four-sided die four times: the number \(N\) of faces never seen is \(I_1 + I_2 + I_3 + I_4\), where \(I_j\) says "face \(j\) never appears". Each \(E(I_j) = (\frac34)^4\), so \(E(N) = 4(\frac34)^4 = \frac{81}{64}\):</p>
        ${run("unseen")}
        ${callout("pattern", "PATTERN · COUNTING WITH INDICATORS", String.raw`<p>Write the count as a sum of indicators, find each \(E(I_j) = P(A_j)\), and add by linearity. No independence, no distribution needed.</p>`)}
        ${callout("pitfall", "PITFALL · “LINEARITY NEEDS INDEPENDENCE”", String.raw`<p>It does not: the unseen-face indicators are dependent, and so are min and max. The rule that needs independence is the one for products.</p>`)}
        ${demo("buckets", "Demo 4 · Empty buckets", "change keys and buckets, then simulate", "The formula m(1 − 1/m)ⁿ comes from indicators and linearity; the simulation throws keys at random.")}` },
    ],
    takeaways: [
      "E(aX + bY) = aE(X) + bE(Y) for any X, Y.",
      "E(1_A) = P(A); a count is a sum of indicators.",
    ],
  },
  {
    slug: "5-products", nav: "Products", title: "Products of Independent Random Variables",
    subtitle: "E(XY) = E(X)E(Y), but only with independence",
    abstract: "For independent X and Y the expectation of the product is the product of the expectations. Without independence it fails, most often for X times X; and the converse is false.",
    tags: ["E(XY)", "E(X²) ≠ E(X)²", "converse"],
    hero: "code:products", heroCaption: "25/4 for X·Y, 15/2 for X·X",
    sections: [
      { id: "theorem", title: "The product rule", html: String.raw`
        <p><b>Theorem 4.</b> If \(X\) and \(Y\) are independent, then \(E(XY) = E(X)\,E(Y)\).</p>
        <p><em>Proof.</em> Group the outcomes by the pair of values \((a, b)\):</p>
        $$E(XY) = \sum_{a, b} ab\,P(X{=}a, Y{=}b) = \sum_{a, b} ab\,P(X{=}a)P(Y{=}b) = \Big(\sum_a a\,P(X{=}a)\Big)\Big(\sum_b b\,P(Y{=}b)\Big) = E(X)E(Y).$$
        <p>The second step is independence. \(\square\)</p>
        ${run("products")}
        <p>\(X\) is not independent of itself: \(E(X^2) = \frac{15}{2}\), not \(\frac{25}{4}\).</p>
        ${callout("pitfall", "PITFALL · THE CONVERSE IS FALSE", String.raw`<p>Let \(U = x - y\) and \(W = x + y\). Then \(E(UW) = E(X^2) - E(Y^2) = 0 = E(U)E(W)\), but \(U = 3\) forces \(W = 5\): not independent.</p>`)}
        ${run("converse")}` },
    ],
    takeaways: [
      "Independent ⇒ E(XY) = E(X)E(Y).",
      "Not the other way round, and not without independence.",
    ],
  },
  {
    slug: "6-variance", nav: "Variance", title: "Variance",
    subtitle: "How far a random variable tends to be from its mean",
    abstract: "Var(X) = E[(X − E(X))²] = E(X²) − E(X)². Doubling one die and adding two dice both average 5, with variances 5 and 5/2. The CS link: expected empty buckets in a hash table.",
    tags: ["Var(X)", "E(X²) − E(X)²", "hashing"],
    hero: "code:spread", heroCaption: "Same mean 5, variances 5 and 5/2",
    sections: [
      { id: "def", title: "Definition and the shortcut", html: String.raw`
        ${callout("note", "DEFINITION · VARIANCE", String.raw`<p>With \(\mu = E(X)\), the <b>variance</b> is \(\mathrm{Var}(X) = E\big[(X - \mu)^2\big] = \sum_s (X(s) - \mu)^2 P(s)\). It is \(\ge 0\), and \(0\) exactly when \(X(s) = \mu\) for every outcome with \(P(s) > 0\).</p>`)}
        <p><b>Theorem 5.</b> \(\mathrm{Var}(X) = E(X^2) - E(X)^2\). <em>Proof.</em> \((X - \mu)^2 = X^2 - 2\mu X + \mu^2\); by linearity the expectation is \(E(X^2) - 2\mu^2 + \mu^2 = E(X^2) - \mu^2\). \(\square\) sympy checks it for any three values and any probabilities:</p>
        ${run("varIdentity")}
        ${run("variance")}
        <p>One die: \(\frac{15}{2} - \frac{25}{4} = \frac54\). The prize: \(\frac{55}{64}\). A flat 3-coin prize: \(0\).</p>` },
      { id: "spread", title: "Same expectation, different spread", html: String.raw`
        <p>Doubling one die, \(2X\), and adding two dice, \(X + Y\), both have expectation 5. But \(2X\) takes only \(2, 4, 6, 8\), while \(X + Y\) has the tent with 5 most likely:</p>
        ${run("spread")}
        <p>\(\mathrm{Var}(2X) = 4\,\mathrm{Var}(X) = 5\) (exercise 7) and \(\mathrm{Var}(X + Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) = \frac52\) (exercise 3, needs independence). Use Demo 1 to compare the two distributions.</p>
        ${callout("pitfall", "PITFALL · E(X²) IS NOT E(X)²", String.raw`<p>For one die they are \(\frac{15}{2}\) and \(\frac{25}{4}\); the difference is the variance, so always \(E(X^2) \ge E(X)^2\).</p>`)}
        ${callout("note", "CS · LINEARITY IN ALGORITHMS: HASHING", String.raw`<p>\(n\) keys go into \(m\) buckets, each bucket equally likely and the keys independent. Bucket \(j\) stays empty with probability \((1 - \frac1m)^n\), so by indicators the expected number of empty buckets is \(m(1 - \frac1m)^n\): about \(3.49\) for \(n = m = 10\). Expected collisions and the expected running time of randomized quicksort are computed the same way.</p>`)}
        ${run("hashing")}` },
    ],
    takeaways: [
      "Var(X) = E[(X − μ)²] = E(X²) − E(X)² ≥ 0.",
      "Equal expectations can hide different spreads.",
    ],
  },
  {
    slug: "7-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, seven exercises with hints and full solutions, and a checklist for reading an expectation computed by an AI.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant computes expectations quickly and explains them confidently. Check: (1) is the random variable a function on a stated sample space, with probabilities adding to 1? (2) is independence proved for <em>every</em> pair? (3) is \(E(XY) = E(X)E(Y)\) used only for independent variables? (4) is linearity used freely? (5) recompute by listing the outcomes with exact fractions.</p>
        <p>Check (5) on a claim of the kind an assistant can make: "\(E(\max \cdot \min) = E(\max)\,E(\min) = \frac{375}{64}\)".</p>
        ${run("aiCheck")}
        <p>The true value is \(\frac{25}{4}\): \(\max \cdot \min = xy\), and \(X\), \(Y\) <em>are</em> independent.</p>` },
    ],
    takeaways: [
      "Linearity always; the product rule only with independence.",
      "Prove independence for every pair; refute with one.",
      "Recompute with exact fractions over all outcomes.",
    ],
  },
];
