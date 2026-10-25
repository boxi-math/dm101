// Chapter content, adapted from notes/L11-division-gcd.md. Code panels and outputs come from the note (run(), CODE /
// OUT in extras.js). Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX.
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L11-1.mp4";
const VIDEO_P2 = "media/L11-2.mp4";

const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);

const LECTURE = {
  number: 11,
  title: "Division and the GCD",
  tagline: "Remainders, common divisors and Euclid's algorithm",
  lead: "A board of 84 by 30 centimetres cut into the largest equal squares, a remainder that must never be negative, and the oldest algorithm still in daily use. Interactive notes on the division theorem, the greatest common divisor, Euclid's algorithm and Bézout's identity, where every number was checked by running code.",
  heroDemo: "euclidMini",
  heroLabel: "Euclid's algorithm as a picture",
  heroCaption: "Cut the largest squares off an 84 × 30 board, then off what is left: 30, 30, 24, then four squares of 6. The last square is the gcd.",
  whyTitle: "Why the gcd",
  whySub: "Divisibility, made fast and checkable",
  why: [
    ["Remainders are exact", "For \\(b > 0\\) there is exactly one pair \\(q, r\\) with \\(a = qb + r\\) and \\(0 \\le r < b\\), also for negative \\(a\\)."],
    ["A fast algorithm", "Euclid's algorithm finds \\(\\gcd(10403, 9991) = 103\\) in three divisions, without factoring either number."],
    ["A certificate", "Bézout: \\(\\gcd(a, b) = ax + by\\). The line \\(35 \\cdot (-1) + 18 \\cdot 2 = 1\\) proves that 35 and 18 share no factor."],
  ],
  ctaTitle: "Ready to divide?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 11 · Part 1 — Division with remainder, and the gcd",
    [VIDEO_P2]: "Lecture 11 · Part 2 — Euclid's algorithm and Bézout's identity",
  },
};

const CHAPTERS = [
  {
    slug: "1-board", nav: "The board", title: "Cutting a Board into Squares",
    subtitle: "The question this lecture answers",
    abstract: "An 84 × 30 board, cut into equal squares with nothing left over: the side must divide both numbers. And two measuring rods of 84 and 30 cm turn out to measure exactly 6 cm.",
    tags: ["common divisor", "tiles", "rods"],
    hero: "code:board", heroCaption: "Square sides that fit both edges",
    sections: [
      { id: "board", title: "The largest square", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A workshop has a board \(84\) cm long and \(30\) cm wide. It wants to cut the whole board into equal squares, as large as possible, with nothing left over. A square of side \(s\) fits along the long edge when \(s\) divides \(84\), and along the short edge when \(s\) divides \(30\).</p>
        ${run("board")}
        <p>Squares of side \(6\) work, \(70\) of them. A side of \(5\) divides \(30\), but along the long edge sixteen squares use \(80\) cm and leave a strip \(4\) cm wide: \(84 = 16 \cdot 5 + 4\). A side of \(12\) fails on the short edge: \(30 = 2 \cdot 12 + 6\). A strip that is left over is always a remainder.</p>
        ${demo("tiles", "Demo 1 · Which squares fit?", "change the board and the square", "Try side 5 and side 12 on the 84 × 30 board; then find the largest side that leaves no strip.")}` },
      { id: "rods", title: "Two rods", html: String.raw`
        <p>The workshop also has two measuring rods, \(84\) cm and \(30\) cm, with no marks on them. Lay three \(30\) cm rods end to end next to one \(84\) cm rod: the difference is \(6\) cm.</p>
        ${run("rods")}
        <p>The largest common square and the shortest length the rods can measure are the same number. Chapter 5 shows that this is no accident.</p>
        ${predict("With rods of 84 cm and 30 cm, can you measure 4 cm? Can you measure 12 cm?", "<p>12 cm yes (\\(2 \\cdot 6\\)), 4 cm no: the lengths the rods can measure are exactly the multiples of \\(\\gcd(84, 30) = 6\\). Exercise 8 proves it.</p>")}` },
    ],
    takeaways: [
      "A square tiles an a × b board exactly when its side divides both a and b.",
      "The strip a tile leaves over is a remainder.",
    ],
  },
  {
    slug: "2-division", nav: "Division", title: "Division with Remainder",
    subtitle: "The division theorem, and why the remainder is unique",
    abstract: "Jump in steps of b as far as you can without passing a: the jumps are q, the piece left is r. The proof takes r as the least element of a set (well-ordering); uniqueness is one line.",
    tags: ["a = qb + r", "0 ≤ r < b", "well-ordering"],
    hero: "divide", heroCaption: "Change a and b; watch q and r.",
    sections: [
      { id: "theorem", title: "The division theorem", html: String.raw`
        ${callout("note", "THEOREM 1 · DIVISION THEOREM", `<p>Let \\(a, b \\in \\mathbb Z\\) with \\(b > 0\\). There exist integers \\(q\\) and \\(r\\) with \\(a = qb + r\\) and \\(0 \\le r < b\\). Moreover, there is only one such pair \\((q, r)\\): the <b>quotient</b> and the <b>remainder</b>, \\(r = a \\bmod b\\).</p>`)}
        <p><b>The picture.</b> Jump from \(0\) in steps of \(b\) as long as you do not pass \(a\). The number of jumps is \(q\), the piece from \(qb\) to \(a\) is \(r\). Equally, start at \(a\) and jump back in steps of \(b\), staying at \(0\) or above: \(26, 19, 12, 5\). The last number reached is \(r\).</p>
        ${run("backjumps")}
        ${demo("divide", "Demo 2 · Division on the number line", "drag a and b", "Make a negative: the jumps go left, past a, and the remainder is still measured to the right.")}` },
      { id: "proof", title: "The proof", html: String.raw`
        <p><em>Existence.</em> Let \(S = \{\, a - qb : q \in \mathbb Z,\ a - qb \ge 0 \,\}\). It is a set of natural numbers, and not empty: \(q = -|a|\) gives \(a + |a|\,b \ge 0\). By well-ordering it has a least element \(r = a - qb\). If \(r \ge b\), then \(r - b = a - (q + 1)b \ge 0\) is in \(S\) and smaller than \(r\): impossible. So \(0 \le r < b\).</p>
        <p><em>Uniqueness.</em> If \(a = qb + r = q'b + r'\) with both remainders in \([0, b)\), then \((q - q')\,b = r' - r\). The right side lies strictly between \(-b\) and \(b\); the only multiple of \(b\) there is \(0\). So \(r = r'\) and \(q = q'\). \(\square\)</p>
        ${callout("pattern", "PATTERN · EXISTENCE AND UNIQUENESS", `<p>To prove "there is exactly one": <b>existence</b> (produce one, here as the least element of a set) and <b>uniqueness</b> (assume two, show they are equal).</p>`)}
        <p>Python's <code>divmod</code> follows the theorem whenever \(b > 0\); a brute-force search finds exactly one pair each time (a sanity check, not a proof):</p>
        ${run("divcheck")}` },
      { id: "negative", title: "Negative a", html: String.raw`
        ${callout("pitfall", "PITFALL · A NEGATIVE REMAINDER", `<p>\\(-26 = (-3) \\cdot 7 - 5\\) is true, but \\(-5\\) is not a remainder. Go one jump further: \\(-26 = (-4) \\cdot 7 + 2\\), with \\(0 \\le 2 < 7\\). C and Java truncate towards zero and give \\(-3, -5\\); Python gives \\(-4, 2\\).</p>`)}
        ${run("truncate")}
        ${predict("What are the quotient and the remainder of 7 divided by 100?", "<p>\\(7 = 0 \\cdot 100 + 7\\): quotient \\(0\\), remainder \\(7\\). Exercise 1.</p>")}` },
    ],
    takeaways: [
      "For b > 0: exactly one q and r with a = qb + r and 0 ≤ r < b.",
      "Existence by well-ordering; uniqueness by assuming two.",
      "For negative a the remainder is still at least 0.",
    ],
  },
  {
    slug: "3-gcd", nav: "The gcd", title: "The Greatest Common Divisor",
    subtitle: "The definition, and two slow methods",
    abstract: "The gcd of a and b (not both 0) is the common divisor that is at least every other one. Listing divisors and factoring into primes both find it, and both are slow for big numbers.",
    tags: ["definition", "list divisors", "prime factors"],
    hero: "code:divisors", heroCaption: "Divisors of 84 and of 30",
    sections: [
      { id: "def", title: "Definition", html: String.raw`
        ${callout("note", "DEFINITION · GREATEST COMMON DIVISOR", `<p>Let \\(a, b \\in \\mathbb Z\\), not both \\(0\\). An integer \\(d = \\gcd(a, b)\\) provided that (1) \\(d\\) is a common divisor of \\(a\\) and \\(b\\), and (2) if \\(e\\) is any common divisor of \\(a\\) and \\(b\\), then \\(e \\le d\\).</p>`)}
        <p>Why "not both \(0\)"? Every integer divides \(0\), so \(0\) and \(0\) have common divisors as large as you like, and no greatest one. If \(a \ne 0\), every common divisor lies between \(-|a|\) and \(|a|\): finitely many, and \(1\) is always one of them.</p>
        <p><b>Method 1: list the divisors.</b></p>
        ${run("divisors")}
        <p>Signs do not matter, and \(\gcd(a, 0) = |a|\). Python's <code>math.gcd</code> returns \(0\) for \(\gcd(0, 0)\), a library convention, not a value of our definition:</p>
        ${run("gcdsigns")}
        ${callout("pitfall", "PITFALL · TOO MUCH IN THE DEFINITION", `<p>The definition says every common divisor is <em>at most</em> \\(d\\). That every common divisor <em>divides</em> \\(d\\) is a theorem (chapter 5), proved with Bézout.</p>`)}` },
      { id: "primes", title: "Method 2: prime factorisation", html: String.raw`
        <p>\(84 = 2^2 \cdot 3 \cdot 7\) and \(30 = 2 \cdot 3 \cdot 5\). The gcd takes every shared prime with the smaller exponent: \(2 \cdot 3 = 6\).</p>
        ${run("factorgcd")}
        <p>Both methods are slow for big numbers: nobody knows a fast way to factor. For \(10403\) and \(9991\), trial division tries about a hundred numbers each:</p>
        ${run("bigfactor")}
        ${predict("\\(\\gcd(2^5 \\cdot 3^2 \\cdot 7,\\; 2^3 \\cdot 5 \\cdot 7^2)\\)?", "<p>Shared primes 2 and 7, smaller exponents 3 and 1: \\(2^3 \\cdot 7 = 56\\).</p>")}
        ${run("predictfactor")}` },
    ],
    takeaways: [
      "gcd(a, b): the largest common divisor; a and b not both 0.",
      "By primes: each shared prime with the smaller exponent.",
      "Listing and factoring are slow for large numbers.",
    ],
  },
  {
    slug: "4-euclid", nav: "Euclid", title: "Euclid's Algorithm",
    subtitle: "Dividing does not change the common divisors",
    abstract: "If a = qb + r, the pairs a, b and b, r have the same common divisors. Repeat until the remainder is 0: the last nonzero remainder is the gcd. On the board: cut off the largest squares, again and again.",
    tags: ["gcd(a, b) = gcd(b, r)", "last nonzero remainder", "loop invariant"],
    hero: "euclid", heroCaption: "Step through the squares.",
    sections: [
      { id: "lemma", title: "The key lemma", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "LEMMA 2", `<p>If \\(a = qb + r\\) (any integers), then \\(a, b\\) and \\(b, r\\) have exactly the same common divisors. In particular, if \\(b \\ne 0\\), \\(\\gcd(a, b) = \\gcd(b, r)\\).</p>`)}
        <p><em>Proof.</em> (\(\subseteq\)) If \(e \mid a\) and \(e \mid b\), say \(a = es\), \(b = et\), then \(r = a - qb = e\,(s - qt)\), so \(e \mid r\). (\(\supseteq\)) If \(e \mid b\) and \(e \mid r\), say \(b = et\), \(r = eu\), then \(a = qb + r = e\,(qt + u)\), so \(e \mid a\). Same sets, same greatest element. \(\square\)</p>
        ${callout("pattern", "PATTERN · TWO SETS ARE EQUAL", `<p>Take an arbitrary element of \\(X\\), show it is in \\(Y\\); then the other way round.</p>`)}
        ${run("lemma")}` },
      { id: "algorithm", title: "The algorithm", html: String.raw`
        <p>Divide, then replace \((a, b)\) by \((b, r)\), until the remainder is \(0\):</p>
        $$84 = 2 \cdot 30 + 24, \qquad 30 = 1 \cdot 24 + 6, \qquad 24 = 4 \cdot 6 + 0.$$
        <p>So \(\gcd(84, 30) = \gcd(30, 24) = \gcd(24, 6) = \gcd(6, 0) = 6\), the <b>last nonzero remainder</b>. On the board: two squares of side 30, one of side 24, then four of side 6, which fit exactly.</p>
        ${demo("euclid", "Demo 3 · Cut off the largest squares", "choose a and b, then step", "Each division is one colour of squares; the last colour is the gcd. Try 55 and 34: every quotient is 1 but the last.")}
        ${run("euclid")}
        <p>The pair from chapter 3 takes three divisions, with no factoring:</p>
        ${run("euclidbig")}
        <p><b>Why it is correct.</b> <em>It stops:</em> each new remainder is smaller than the last and not negative, and natural numbers cannot decrease forever (well-ordering). <em>It returns the gcd:</em> by Lemma 2 the gcd does not change from one pass to the next (a <b>loop invariant</b>), and at the end \(\gcd(a, 0) = a\).</p>` },
      { id: "fast", title: "How fast?", html: String.raw`
        ${callout("note", "CS · THE OLDEST ALGORITHM IN DAILY USE", `<p><code>math.gcd</code> and <code>Fraction</code> run this loop. Every two divisions at least halve the remainder (exercise 7), so the number of steps grows like the number of <em>digits</em>. The slowest pairs are consecutive Fibonacci numbers.</p>`)}
        ${run("fast")}
        ${predict("How many divisions for \\(\\gcd(55, 34)\\)?", "<p>Eight: every quotient is 1 until the last, which is 2.</p>")}
        ${run("fib")}` },
    ],
    takeaways: [
      "gcd(a, b) = gcd(b, r): dividing keeps the common divisors.",
      "The gcd is the last nonzero remainder.",
      "Steps grow like the number of digits, not like the numbers.",
    ],
  },
  {
    slug: "5-bezout", nav: "Bézout", title: "Bézout's Identity",
    subtitle: "The gcd as ax + by, and relatively prime numbers",
    abstract: "Run Euclid backwards: 6 = 3 · 30 − 1 · 84, the rods of chapter 1. In general gcd(a, b) = ax + by, the smallest positive such value. It proves that every common divisor divides the gcd, and gives a one-line certificate that two numbers are relatively prime.",
    tags: ["6 = 3·30 − 84", "ax + by", "relatively prime"],
    hero: "bezout", heroCaption: "Rods forward and back",
    sections: [
      { id: "back", title: "Running Euclid backwards", html: String.raw`
        <p>\(6 = 30 - 1 \cdot 24\) and \(24 = 84 - 2 \cdot 30\), so</p>
        $$6 = 30 - 1 \cdot (84 - 2 \cdot 30) = 3 \cdot 30 - 1 \cdot 84 = 84 \cdot (-1) + 30 \cdot 3.$$
        ${callout("note", "THEOREM 3 · BÉZOUT'S IDENTITY", `<p>Let \\(a, b \\in \\mathbb Z\\), not both \\(0\\). There exist integers \\(x, y\\) with \\(\\gcd(a, b) = ax + by\\). In fact \\(\\gcd(a, b)\\) is the smallest positive integer of this form.</p>`)}
        <p><em>Proof.</em> Let \(d = ax_0 + by_0\) be the least element of \(S = \{ax + by > 0\}\) (not empty: \(a^2 + b^2 > 0\); well-ordering). Divide: \(a = qd + r\), \(0 \le r < d\). Then \(r = a(1 - qx_0) + b(-qy_0)\) is of the form \(ax + by\); if \(r > 0\) it would be a smaller element of \(S\). So \(r = 0\) and \(d \mid a\); likewise \(d \mid b\). Any common divisor \(e\) divides \(ax_0 + by_0 = d\), so \(e \le d\). Hence \(d = \gcd(a, b)\). \(\square\)</p>
        ${run("extended")}
        ${demo("bezout", "Demo 4 · Rods forward and back", "choose two rods", "Press “another pair” to add b/g to x and subtract a/g from y: the coefficients are not unique.")}
        ${run("notunique")}
        ${callout("pitfall", "PITFALL · THE CONVERSE IS FALSE", `<p>\\(84 \\cdot 2 + 30 \\cdot (-5) = 18\\), but \\(18\\) is not the gcd; it does not even divide \\(84\\). Every \\(ax + by\\) is a <em>multiple</em> of the gcd. Only for \\(1\\) does the converse hold.</p>`)}
        ${run("converse")}` },
      { id: "coprime", title: "Common divisors and relatively prime numbers", html: String.raw`
        ${callout("note", "COROLLARY 4", `<p>If \\(e \\mid a\\) and \\(e \\mid b\\), then \\(e \\mid \\gcd(a, b)\\). <em>Proof:</em> \\(\\gcd(a, b) = ax + by = e\\,(sx + ty)\\).</p>`)}
        ${callout("note", "DEFINITION · RELATIVELY PRIME", `<p>\\(a\\) and \\(b\\) are <b>relatively prime</b> if \\(\\gcd(a, b) = 1\\).</p>`)}
        <p><b>Theorem 5.</b> \(a\) and \(b\) (not both 0) are relatively prime if and only if \(ax + by = 1\) has an integer solution. (\(\Rightarrow\)) Bézout. (\(\Leftarrow\)) The gcd divides \(ax + by = 1\), so it is \(1\). \(\square\)</p>
        ${run("coprime")}
        <p>\(35 \cdot (-1) + 18 \cdot 2 = 1\) is a certificate anyone can check with one multiplication. \(91 = 7 \cdot 13\) and \(65 = 5 \cdot 13\) are not relatively prime.</p>
        ${predict("Are \\(n\\) and \\(n + 1\\) always relatively prime?", "<p>Yes: \\(n \\cdot (-1) + (n + 1) \\cdot 1 = 1\\). Exercise 4.</p>")}` },
    ],
    takeaways: [
      "Back-substitution writes the gcd as ax + by; x, y are not unique.",
      "Every common divisor divides the gcd.",
      "gcd(a, b) = 1 exactly when ax + by = 1 has a solution.",
    ],
  },
  {
    slug: "6-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, eight exercises with hints and full solutions, and how to check Bézout coefficients an AI gives you.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant will run Euclid's algorithm and produce Bézout coefficients instantly. They are easy to check: (1) multiply out \(ax + by\); it must equal the claimed gcd. (2) Check the gcd divides both numbers. (3) In a uniqueness proof, find where \(0 \le r < b\) is used. (4) If it says the coefficients are unique, add \(b/g\) to \(x\) and subtract \(a/g\) from \(y\).</p>
        ${run("aicheck")}
        <p>A claimed pair passes check (1) only if \(4620x + 1078y\) is exactly \(154\).</p>` },
    ],
    takeaways: [
      "Remainders: 0 ≤ r < b, also for negative a.",
      "Euclid: the last nonzero remainder; run it back for ax + by.",
      "Check an answer by multiplying it out.",
    ],
  },
];
