// Chapter content, adapted from notes/L09-sample-spaces.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L09-1.mp4";
const VIDEO_P2 = "media/L09-2.mp4";

const LECTURE = {
  number: 9,
  title: "Sample Spaces and Events",
  tagline: "What can happen, and how likely it is",
  lead: "Two dice, thirty-six equally likely rolls, and a tempting wrong answer. Interactive notes on sample spaces, events, the addition rule, conditional probability, independence and Bayes's formula, where every probability is an exact fraction computed by code.",
  heroDemo: "rollsMini",
  heroLabel: "Eleven sums, not equally likely",
  heroCaption: "Random rolls of two dice: the sums pile up like 1, 2, …, 6, …, 1 out of 36, never level at 1/11.",
  whyTitle: "Why sample spaces",
  whySub: "The language every probability argument is written in",
  why: [
    ["Say what can happen", "A <b>sample space</b> \\((S, P)\\) lists the outcomes and gives each one a probability \\(P(s) \\ge 0\\), adding up to 1. Listing the wrong outcomes is the commonest mistake."],
    ["Events are sets", "An <b>event</b> is a set of outcomes; \\(P(A)\\) is a sum. \"And\", \"or\" and \"not\" are \\(\\cap\\), \\(\\cup\\) and the complement."],
    ["Information changes chances", "A <b>conditional probability</b> frames what you know; <b>independent</b> events are the ones a frame cannot change."],
  ],
  ctaTitle: "Ready to roll?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 9 · Part 1 — Sample spaces and events",
    [VIDEO_P2]: "Lecture 9 · Part 2 — Conditional probability and independence",
  },
};

const CHAPTERS = [
  {
    slug: "1-dice", nav: "Two dice", title: "Two Dice and a Wrong Answer",
    subtitle: "Eleven sums are not equally likely",
    abstract: "\"The sum of two dice is one of eleven values, so each has probability 1/11.\" Counting the 36 rolls shows why that is wrong, and why we need to say exactly what the outcomes are.",
    tags: ["two dice", "36 pairs", "1/11 is wrong"],
    hero: "code:sums", heroCaption: "Pairs for each sum 2 … 12",
    sections: [
      { id: "count", title: "Count the pairs", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Roll a red die and a blue die and add the two numbers. What is the chance that the sum is \(7\)? A reasonable-sounding answer: "the sum is one of \(2, 3, \dots, 12\), eleven results, so \(1/11\)." Test it by counting. A roll is a pair (red, blue): \(6 \cdot 6 = 36\) pairs, all equally likely for fair dice.</p>
        ${run("sums")}
        <p>A sum of \(7\) comes from six pairs, so its probability is \(6/36 = 1/6\); a sum of \(12\) only from \((6, 6)\): \(1/36\). The eleven sums are <b>not equally likely</b>, and \(1/11\) is wrong for every one of them. A simulation agrees:</p>
        ${run("simulate")}
        ${predict("The eleven sums can still form a sample space, if each sum gets the right probability. What probability should the sum 8 get?",
          String.raw`<p>Five pairs have sum 8: \((2,6), (3,5), (4,4), (5,3), (6,2)\). So \(P(8) = 5/36\). See chapter 2.</p>`)}` },
    ],
    takeaways: [
      "Listing the possible results is not enough: say how likely each one is.",
      "Count with outcomes you have a reason to believe equally likely (the 36 pairs).",
    ],
  },
  {
    slug: "2-space", nav: "Sample space", title: "Sample Spaces",
    subtitle: "A set of outcomes and a probability for each",
    abstract: "The definition of a sample space (S, P), uniform and non-uniform examples, and how to check that a proposed P is one.",
    tags: ["(S, P)", "uniform", "loaded die"],
    hero: "toc",
    sections: [
      { id: "def", title: "The definition", html: String.raw`
        ${callout("note", "DEFINITION · SAMPLE SPACE", String.raw`<p>A sample space is a pair \((S, P)\) where \(S\) is a nonempty finite set and \(P : S \to \mathbb R\) is a function with (1) \(P(s) \ge 0\) for every \(s \in S\) and (2) \(\sum_{s \in S} P(s) = 1\). The elements of \(S\) are the <b>outcomes</b>.</p>`)}
        <p>The set says <em>what can happen</em>; the function says <em>how likely</em> each outcome is. Examples: a fair coin, \(P(H) = P(T) = \frac12\); a fair die, \(P(s) = \frac16\); a loaded die with \(P(6) = \frac14\) and \(P(1) = \dots = P(5) = \frac{3}{20}\); two dice, 36 pairs of probability \(\frac1{36}\); the sums \(2, \dots, 12\), with \(P(t)\) = (pairs with sum \(t\))/36. When every outcome has the same probability \(1/|S|\), the sample space is <b>uniform</b>.</p>
        ${run("isSpace")}
        <p>The sums with \(P(8) = 5/36\) are a good sample space. Giving each face \(\frac15\) is not: the values add up to \(\frac65\).</p>
        ${demo("space", "Demo 1 · A sample space of your own", "type six probabilities", "Try the presets, then make your own loaded die. Fractions, decimals and percents all work.")}
        ${callout("pitfall", "PITFALL · “LIST THE RESULTS, THEN DIVIDE BY HOW MANY”", String.raw`<p>That works only for a uniform sample space. \(P(t) = \frac1{11}\) for each sum satisfies the definition, but it is the wrong model of two fair dice. The definition checks that \(P\) is <em>a</em> probability; it cannot tell you whether it describes the dice.</p>`)}` },
    ],
    takeaways: [
      "A sample space is (S, P): outcomes, and probabilities ≥ 0 that add up to 1.",
      "Uniform means every outcome has probability 1/|S|; then probability is counting.",
    ],
  },
  {
    slug: "3-events", nav: "Events", title: "Events and How to Combine Them",
    subtitle: "Sets of outcomes, and, or, but not, not",
    abstract: "An event is a subset A of S with P(A) = the sum of P(a) over a in A. Intersection, union, difference and complement are 'and', 'or', 'but not' and 'not'.",
    tags: ["P(A) = Σ P(a)", "∩ ∪ − complement", "disjoint"],
    hero: "events", heroCaption: "Shade two events; pick an operation.",
    sections: [
      { id: "events", title: "Events", html: String.raw`
        ${callout("note", "DEFINITION · EVENT", String.raw`<p>Let \((S, P)\) be a sample space. An <b>event</b> is a subset \(A \subseteq S\), and its probability is $$P(A) = \sum_{a \in A} P(a).$$</p>`)}
        <p>\(P(\{s\}) = P(s)\), \(P(\emptyset) = 0\), \(P(S) = 1\), and \(0 \le P(A) \le 1\). On the grid of two dice (red = row, blue = column): \(E\) = "the sum is 8" is five cells on an anti-diagonal; \(D\) = "a double" is the six cells of the main diagonal.</p>
        ${run("events")}
        <p>In a uniform space \(P(A) = |A|/|S|\). Elsewhere we really add: for the loaded die, \(P(\text{even}) = \frac3{20} + \frac3{20} + \frac14 = \frac{11}{20}\).</p>
        ${run("loadedEven")}` },
      { id: "ops", title: "And, or, but not, not", html: String.raw`
        <p>\(A \cap B\): both occur. \(A \cup B\): at least one occurs. \(A - B\): \(A\) but not \(B\). \(\overline A = S - A\): \(A\) does not occur. Events with \(A \cap B = \emptyset\) are <b>disjoint</b>: "a double" and "the sum is 7" cannot happen together.</p>
        ${run("ops")}
        ${demo("events", "Demo 2 · Events on the grid", "choose A, B and an operation", "Theorem 1 (next chapter) is checked live under the grid.")}` },
    ],
    takeaways: [
      "An event is a set of outcomes; its probability is the sum over its outcomes.",
      "∩, ∪, − and complement mean and, or, but not, not.",
    ],
  },
  {
    slug: "4-adding", nav: "Adding", title: "Adding Probabilities",
    subtitle: "P(A) + P(B) = P(A ∪ B) + P(A ∩ B)",
    abstract: "The overlap of two events is counted twice when their probabilities are added. Theorem 1 puts it back; its consequences are the rule for disjoint events, the union bound and the complement rule.",
    tags: ["Theorem 1", "union bound", "complement rule"],
    hero: "code:oneSix", heroCaption: "At least one six: 11/36, not 1/3",
    sections: [
      { id: "thm1", title: "Theorem 1", html: String.raw`
        <p>\(P(E \cup D) = \frac{10}{36}\) but \(P(E) + P(D) = \frac{11}{36}\): the cell \((4,4)\) is in both and is counted twice.</p>
        <p><b>Theorem 1.</b> For events \(A\), \(B\): \(P(A) + P(B) = P(A \cup B) + P(A \cap B)\).</p>
        <p><em>Proof.</em> \(A \cup B\) is the union of three pieces that do not overlap: \(A - B\), \(A \cap B\), \(B - A\). Since \(P\) of an event is a sum over its outcomes, \(P(A \cup B) = P(A - B) + P(A \cap B) + P(B - A)\). Likewise \(P(A) = P(A - B) + P(A \cap B)\) and \(P(B) = P(B - A) + P(A \cap B)\). Adding the last two gives \(P(A \cup B) + P(A \cap B)\). \(\square\)</p>
        ${callout("pattern", "PATTERN · PROVING A PROBABILITY RULE FROM THE DEFINITION", String.raw`<ol><li>Cut the events into pieces that do not overlap.</li><li>Write each probability as the sum of its pieces (allowed because \(P(A)\) is a sum over outcomes).</li><li>Compare the two sides piece by piece.</li></ol>`)}
        ${run("thm1")}` },
      { id: "cor", title: "Consequences", html: String.raw`
        <p><b>Corollary 2.</b> (a) If \(A \cap B = \emptyset\), then \(P(A \cup B) = P(A) + P(B)\). (b) \(P(A \cup B) \le P(A) + P(B)\) (the <b>union bound</b>). (c) \(P(\overline A) = 1 - P(A)\).</p>
        <p><em>Proof.</em> (a) \(P(\emptyset) = 0\) in Theorem 1. (b) \(P(A \cap B) \ge 0\). (c) \(A\) and \(\overline A\) are disjoint with union \(S\), so \(P(A) + P(\overline A) = P(S) = 1\). \(\square\)</p>
        <p>The complement is often the short way: no six is \(5 \cdot 5 = 25\) pairs, so \(P(\text{at least one six}) = 1 - \frac{25}{36} = \frac{11}{36}\).</p>
        ${run("oneSix")}
        ${callout("pitfall", "PITFALL · FIND THE ERROR: “1/6 + 1/6 = 1/3”", String.raw`<p>Red six and blue six overlap in \((6,6)\), which the sum counts twice: \(\frac{12}{36} - \frac1{36} = \frac{11}{36}\). Adding is right only for disjoint events; otherwise it is the union bound. With six dice the same mistake gives "a six for sure".</p>`)}` },
    ],
    takeaways: [
      "P(A) + P(B) = P(A ∪ B) + P(A ∩ B): the overlap is counted twice.",
      "Disjoint events add; in general the sum is only an upper bound.",
      "P(not A) = 1 − P(A) is often the short way.",
    ],
  },
  {
    slug: "5-conditional", nav: "Conditional", title: "Conditional Probability",
    subtitle: "Frame what you know, and rescale",
    abstract: "Given that the sum is 8, a double has probability 1/5, not 1/6. P(A | B) = P(A ∩ B)/P(B), and it is not P(B | A).",
    tags: ["P(A | B)", "frame and rescale", "not P(B | A)"],
    hero: "condition", heroCaption: "Frame B, strike the rest, count inside.",
    sections: [
      { id: "def", title: "Given that the sum is 8", html: String.raw`
        ${video(VIDEO_P2)}
        <p>A friend rolls, hides the dice and says "the sum is 8". Only the five cells of \(E\) remain, still equally likely, and one of them is a double. So the chance of a double is now \(\frac15\).</p>
        ${callout("note", "DEFINITION · CONDITIONAL PROBABILITY", String.raw`<p>Let \(A, B\) be events with \(P(B) \neq 0\). The conditional probability of \(A\) given \(B\) is $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$</p>`)}
        <p>Keep the outcomes in \(B\) and divide by \(P(B)\) so that what is left adds up to 1 again: \(P(\,\cdot \mid B)\) is a new sample space on \(B\).</p>
        ${run("cond")}
        ${callout("pattern", "PATTERN · COMPUTING P(A | B) BY HAND", String.raw`<ol><li>Frame \(B\): everything outside is gone.</li><li>Inside the frame, find \(A \cap B\).</li><li>Divide \(P(A \cap B)\) by \(P(B)\); in a uniform space, \(|A \cap B| / |B|\).</li></ol>`)}
        ${demo("condition", "Demo 3 · Condition on a hint", "choose the hint B and the event A", "Press Swap: P(D | E) = 1/5 but P(E | D) = 1/6.")}
        ${callout("pitfall", "PITFALL · P(A | B) IS NOT P(B | A)", String.raw`<p>Both divide the same overlap \(P(A \cap B)\), by different events. Given the queen of hearts, the card is a heart with probability 1; given a heart, it is the queen of hearts with probability \(\frac1{13}\).</p>`)}
        <p>Multiplying the definition out gives the <b>product rule</b> \(P(A \cap B) = P(A \mid B)\,P(B)\).</p>` },
    ],
    takeaways: [
      "P(A | B) = P(A ∩ B) / P(B): frame B and rescale.",
      "Always say which event is given: P(A | B) and P(B | A) differ.",
    ],
  },
  {
    slug: "6-independence", nav: "Independence", title: "Independence",
    subtitle: "When the hint changes nothing",
    abstract: "Red die even and sum 7 are independent; red die even and sum 8 are not; a double and sum 7 are disjoint, and that makes them dependent.",
    tags: ["P(A ∩ B) = P(A)P(B)", "Theorem 3", "disjoint ≠ independent"],
    hero: "code:indep", heroCaption: "Three pairs of events on the grid",
    sections: [
      { id: "def", title: "The definition", html: String.raw`
        <p>Let \(R\) = "the red die is even" and \(T\) = "the sum is 7". Inside the 18 cells of \(R\), 3 have sum 7: \(P(T \mid R) = \frac3{18} = \frac16 = P(T)\). The hint tells nothing.</p>
        ${callout("note", "DEFINITION · INDEPENDENT EVENTS", String.raw`<p>Events \(A\) and \(B\) are <b>independent</b> when \(P(A \cap B) = P(A) \cdot P(B)\).</p>`)}
        <p><b>Theorem 3.</b> If \(P(B) \neq 0\), then \(A\) and \(B\) are independent if and only if \(P(A \mid B) = P(A)\).</p>
        <p><em>Proof.</em> (\(\Rightarrow\)) \(P(A \mid B) = \frac{P(A)P(B)}{P(B)} = P(A)\). (\(\Leftarrow\)) multiply \(\frac{P(A \cap B)}{P(B)} = P(A)\) by \(P(B)\). \(\square\)</p>
        ${run("indep")}
        <p>\(R\) and \(T\) are independent. \(R\) and \(E\) (sum 8) are not: \(P(E \mid R) = \frac16 > \frac{5}{36}\). \(D\) and \(T\) are disjoint, so \(P(D \cap T) = 0 \neq \frac1{36}\).</p>
        ${callout("pitfall", "PITFALL · DISJOINT IS NOT INDEPENDENT", String.raw`<p>If \(A \cap B = \emptyset\) and \(P(A), P(B) > 0\), then \(P(A \cap B) = 0 < P(A)P(B)\): never independent. Disjoint events exclude each other, the strongest kind of dependence.</p>`)}
        ${predict("Is “the red die is even” independent of “the blue die is even”?", String.raw`<p>Yes: both even is \(3 \cdot 3 = 9\) cells, \(\frac9{36} = \frac14 = \frac12 \cdot \frac12\). Try it in Demo 3.</p>`)}` },
    ],
    takeaways: [
      "Independent: P(A ∩ B) = P(A) P(B), the same as P(A | B) = P(A) when P(B) ≠ 0.",
      "Disjoint events of positive probability are dependent.",
    ],
  },
  {
    slug: "7-bayes", nav: "Bayes", title: "Total Probability, Bayes, and Hashing",
    subtitle: "Turning a conditional probability around",
    abstract: "One email in five is spam; 'prize' appears in 3/10 of spam and 1/50 of other mail. Given 'prize', the chance of spam is 15/19. And the union bound sizes a hash table.",
    tags: ["total probability", "Bayes", "union bound"],
    hero: "bayes", heroCaption: "Change the base rate and watch the answer move.",
    sections: [
      { id: "bayes", title: "A spam filter", html: String.raw`
        <p>Model the email as a sample space of four outcomes: spam or not (\(B\)), and contains "prize" or not (\(A\)). The product rule gives \(\frac{3}{50}\), \(\frac{7}{50}\), \(\frac{2}{125}\), \(\frac{98}{125}\).</p>
        <p><b>Theorem 4 (total probability).</b> If \(0 < P(B) < 1\), then \(P(A) = P(A \cap B) + P(A \cap \overline B) = P(A \mid B)P(B) + P(A \mid \overline B)P(\overline B)\). <em>Proof.</em> \(A\) is the disjoint union of \(A \cap B\) and \(A \cap \overline B\); then the product rule. \(\square\)</p>
        <p><b>Theorem 5 (Bayes's formula).</b> If also \(P(A) \neq 0\),</p>
        $$P(B \mid A) = \frac{P(A \mid B)\,P(B)}{P(A \mid B)\,P(B) + P(A \mid \overline B)\,P(\overline B)}.$$
        <p><em>Proof.</em> \(P(B \mid A) = P(A \cap B)/P(A)\); write the top with the product rule and the bottom with Theorem 4. \(\square\)</p>
        ${run("bayes")}
        <p>"Prize" raises the chance of spam from \(\frac15\) to \(\frac{15}{19} \approx 0.79\).</p>
        ${demo("bayes", "Demo 4 · Bayes's formula", "change the three inputs", "Switch to the faulty chips: a test that is right 99% of the time still gives mostly false alarms.")}
        ${callout("pitfall", "PITFALL · FORGETTING THE BASE RATE", String.raw`<p>"Prize appears in 30% of spam, so an email with prize is 30% likely to be spam" confuses \(P(A \mid B)\) with \(P(B \mid A)\). The answer depends on \(P(B)\).</p>`)}` },
      { id: "hash", title: "Hashing and the union bound", html: String.raw`
        ${callout("note", "CS · HASHING AND THE UNION BOUND", String.raw`<p>Put \(n\) keys into \(m\) slots, each uniformly and independently. Two given keys collide with probability \(\frac1m\); "some collision" is the union of \(\binom n2\) such events, so \(P(\text{some collision}) \le \binom n2 \frac1m\). With 20 keys and 10 000 slots, at most \(0.019\).</p>`)}
        ${run("hashing")}
        <p>For 20 keys the bound is within one percent of the exact value. For 23 birthdays the exact value is already above one half, and the bound, \(0.69\), is no longer close: with many pairs the collision events overlap.</p>` },
    ],
    takeaways: [
      "Total probability: split A by B and not B.",
      "Bayes turns P(A | B) into P(B | A); the base rate P(B) matters.",
      "The union bound is an easy upper bound, good when the events rarely overlap.",
    ],
  },
  {
    slug: "8-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and a checklist for probability answers an AI wrote.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or prove, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant answers probability questions fluently, and adding overlapping events or swapping a conditional is easy in fluent prose. Check: (1) is the sample space stated, and are its outcomes really equally likely? (2) is a sum of probabilities taken only over disjoint events? (3) in a conditional probability, which event is given? (4) recompute with exact fractions over an explicit sample space.</p>
        <p>Check (4) on a typical slip, "at least one six with three dice is \(3 \cdot \frac16 = \frac12\)":</p>
        ${run("aiCheck")}
        <p>The right value is \(1 - (\frac56)^3 = \frac{91}{216} \approx 0.42\): the three events overlap, and \(3 \cdot \frac16\) is only the union bound.</p>` },
    ],
    takeaways: [
      "State the sample space; add only over disjoint events.",
      "Say which event is given in every conditional probability.",
      "Check answers with exact fractions over the outcomes.",
    ],
  },
];
