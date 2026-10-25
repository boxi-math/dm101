// Shared router and page rendering for every lecture site. Routes: #/ (home) and
// #/<chapter slug>. Each lecture supplies LECTURE and CHAPTERS (chapters.js) and DEMOS
// (demos.js); see ../README.md. Copied from peiyuUniversity/aie1001/site/assets/app.js; the course name, credit
// and footer come from course.js (load it first), and maths is typeset by KaTeX when the page loads it.


const main = document.getElementById("main");
const pad = (k) => String(k + 1).padStart(2, "0");
const NUMBER_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
let cleanups = [];

function mountDemos(root) {
  root.querySelectorAll("[data-demo]").forEach((d) => {
    const body = d.querySelector(".demo-body") || d;
    DEMOS[d.dataset.demo](body);
  });
  root.querySelectorAll("[data-video]").forEach((v) => {
    const src = v.dataset.video;
    const tracks = captionsFor(src);
    v.innerHTML = `<video controls preload="metadata" src="${src}">${tracks.map(([lang, label, file], k) =>
      `<track kind="captions" srclang="${lang}" label="${label}" src="${file}"${k === 0 ? " default" : ""}>`).join("")}</video>
      <div class="vcap">${(LECTURE.videos || {})[src] || ""}</div>
      ${tracks.length ? `<details class="transcript"><summary>Transcript</summary><div class="tx"></div></details>` : ""}`;
    const video = v.querySelector("video");
    video.addEventListener("error", () => {
      v.innerHTML = `<div class="missing">The video file is not bundled with this copy of the site.<br>Put it at <code>${src}</code> to play it here.</div>`;
    });
    const tx = v.querySelector(".transcript");
    if (tx) tx.addEventListener("toggle", () => { if (tx.open) loadTranscript(tx.querySelector(".tx"), tracks[0][2], video); });
  });
}

// Caption tracks of a video: CAPTIONS from extras.js (written by la101/tools/site_build.py), [lang, label, file].
function captionsFor(src) {
  return (typeof CAPTIONS !== "undefined" && CAPTIONS[src]) || [];
}

// Transcript: the caption cues joined into sentences; clicking a sentence plays the video from there.
const vttTime = (s) => s.split(":").reduce((a, x) => 60 * a + parseFloat(x), 0);
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
function parseVtt(text) {
  const cues = [];
  for (const block of text.replace(/\r/g, "").split(/\n\s*\n/)) {
    const lines = block.trim().split("\n");
    const k = lines.findIndex((l) => l.includes("-->"));
    if (k < 0) continue;
    cues.push({ t: vttTime(lines[k].split("-->")[0].trim()), text: lines.slice(k + 1).join(" ").trim() });
  }
  const out = [];
  for (const c of cues) {
    const last = out[out.length - 1];
    if (last && !/[.!?:]["”’)]?$/.test(last.text)) last.text += " " + c.text;
    else out.push({ ...c });
  }
  return out;
}
function loadTranscript(box, file, video) {
  if (box.dataset.loaded) return;
  box.dataset.loaded = "1";
  box.textContent = "Loading…";
  fetch(file).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); }).then((text) => {
    const lines = parseVtt(text);
    box.innerHTML = lines.map((l) => `<button type="button" class="tx-line" data-t="${l.t}"><span class="tx-time">${clock(l.t)}</span>${esc(l.text)}</button>`).join("");
    box.querySelectorAll(".tx-line").forEach((b) => b.addEventListener("click", () => {
      video.currentTime = +b.dataset.t;
      video.play().catch(() => {});
    }));
    const btns = [...box.querySelectorAll(".tx-line")];
    video.addEventListener("timeupdate", () => {
      let cur = -1;
      btns.forEach((b, k) => { if (+b.dataset.t <= video.currentTime + 0.05) cur = k; });
      btns.forEach((b, k) => b.classList.toggle("on", k === cur));
    });
  }).catch(() => {
    box.dataset.loaded = "";
    box.innerHTML = `<p class="missing">The transcript needs the site served over http (it reads <code>${esc(file)}</code>).</p>`;
  });
}

// ---------- exercises (EXERCISES from extras.js: statement, hint, full solution as HTML) ----------
function exercisesHTML() {
  if (typeof EXERCISES === "undefined" || !EXERCISES.length) return "";
  return `<ol class="exlist">${EXERCISES.map((e) => `<li class="card exo" id="exercise-${e.n}">
      <div class="exo-head"><b>Exercise ${e.n}</b><span class="stars" title="${{1: "compute or check", 2: "explain or build", 3: "extend or combine"}[e.level.length] || ""}">${e.level}</span>${e.tag ? `<span class="tag">${e.tag}</span>` : ""}</div>
      <div class="exo-q">${e.q}</div>
      ${e.hint ? `<details class="reveal exo-hint"><summary>Hint</summary><div class="exo-body">${e.hint}</div></details>` : ""}
      <details class="reveal exo-sol"><summary>Full solution</summary><div class="exo-body">${e.sol}</div></details>
    </li>`).join("")}</ol>`;
}
// <pre data-code="py|out"> (from the notes) becomes the site's code panel.
function codePanels(root) {
  root.querySelectorAll("pre[data-code]").forEach((p) => {
    const wrap = document.createElement("div");
    wrap.innerHTML = codeBlock(p.textContent, p.dataset.code);
    p.replaceWith(wrap.firstElementChild);
  });
}

// ---------- "Lecture N" and "elective EN" become links to the live pages (COURSE LIVE in course.js) ----------
const LIVE_IDS = new Set(typeof LIVE !== "undefined" ? LIVE : []);
const lectureId = (n) => (/^E/i.test(n) ? n.toUpperCase() : `L${String(+n).padStart(2, "0")}`);
function linkLectures(root) {
  const self = LECTURE.id || `L${String(LECTURE.number).padStart(2, "0")}`;
  const re = /\b(Lectures?|[Ee]lectives?)(\s+)((?:E?\d{1,2})(?:(?:\s*(?:,|and|or|to|–|-)\s*)E?\d{1,2})*)/g;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest("a, pre, code, .katex, button, summary, script, .tx, .exo-head, h1")
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) if (/Lecture|lective/.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue;
    let last = 0, changed = false;
    const frag = document.createDocumentFragment();
    for (const m of text.matchAll(re)) {
      const elective = /lective/.test(m[1]);
      const list = m[3].replace(/(E?\d{1,2})/g, (num) => {
        if (elective !== /^E/.test(num)) return num;
        const id = lectureId(num);
        if (!LIVE_IDS.has(id) || id === self) return num;
        changed = true;
        return `\u0000${id}\u0001${num}\u0002`;
      });
      frag.append(text.slice(last, m.index) + m[1] + m[2]);
      for (const piece of list.split(/(\u0000[^\u0002]*\u0002)/)) {
        const lk = piece.match(/^\u0000([^\u0001]*)\u0001(.*)\u0002$/);
        if (!lk) { frag.append(piece); continue; }
        const a = document.createElement("a");
        a.href = `../${lk[1]}/index.html`;
        a.className = "lec-link";
        a.textContent = lk[2];
        frag.append(a);
      }
      last = m.index + m[0].length;
    }
    if (!changed) continue;
    frag.append(text.slice(last));
    node.replaceWith(frag);
  }
}

// Everything a rendered page needs after its HTML is in place.
function finish(root) {
  codePanels(root);
  mountDemos(root);
  typeset(root);
  linkLectures(root);
}

// Maths: KaTeX's auto-render, if the lecture page loads it (vendored locally, not from a CDN). Not bundled yet.
function typeset(root) {
  if (typeof renderMathInElement === "function") {
    renderMathInElement(root, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }] });
  }
}

function stopTimers() {
  // Demos use setInterval; clear every interval when the page changes.
  const max = setInterval(() => {}, 1000);
  for (let k = 0; k <= max; k++) clearInterval(k);
  cleanups.forEach((f) => f());
  cleanups = [];
}

// "Lecture 30" for core lectures; electives set LECTURE.label (e.g. "Elective E1") and LECTURE.id ("E1").
const lectureLabel = () => LECTURE.label || `Lecture ${LECTURE.number}`;

function renderHome() {
  const L = LECTURE;
  document.title = `${L.title} — ${COURSE.code} ${lectureLabel()} Interactive Notes`;
  main.innerHTML = `<div class="wrap">
    <section class="hero">
      <div>
        <span class="pill">${COURSE.name} · ${lectureLabel()}</span>
        <h1>${L.title}<small>${L.tagline}</small></h1>
        <p class="lead">${L.lead}</p>
        <div class="btnrow">
          <a class="btn primary" href="#/${CHAPTERS[0].slug}">Start → Chapter 1 · ${CHAPTERS[0].title}</a>
          <a class="btn" href="#outline">Lecture outline ↓</a>
          <a class="btn" href="#/all">Whole lecture on one page</a>
        </div>
        <p class="meta">${COURSE.instructors ? COURSE.instructors + " · " : ""}${COURSE.checked} · <a href="../index.html">All lectures</a></p>
      </div>
      <div class="card hero-demo">
        <div class="head"><span>${L.heroLabel}</span><button class="cbtn hero-pause">Pause</button></div>
        <div data-demo="${L.heroDemo}"><div class="demo-body"></div></div>
        <div class="caption">${L.heroCaption}</div>
      </div>
    </section>

    <h2 class="section-title">${L.whyTitle}</h2>
    <p class="section-sub">${L.whySub}</p>
    <div class="why">${L.why.map(([h, p]) => `<div class="card"><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>

    <h2 class="section-title" id="outline">${NUMBER_WORDS[CHAPTERS.length] || CHAPTERS.length} chapters</h2>
    <p class="section-sub">In the order of the lecture. Read them in sequence.</p>
    <div class="chapters">${CHAPTERS.map((c, k) => `
      <a class="card chapcard" href="#/${c.slug}">
        <span class="num">${pad(k)}</span><h3>${c.title}</h3><p>${c.subtitle}</p>
        <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <span class="go">Open →</span></a>`).join("")}
    </div>

    <h2 class="section-title">How to use these notes</h2>
    <p class="section-sub">Predict · Run · Investigate · Modify · Make</p>
    <div class="steps">
      <div class="card"><b>STEP 1</b><h3>Read</h3><p>Short sections, each with one idea and the code that goes with it.</p></div>
      <div class="card"><b>STEP 2</b><h3>Predict</h3><p>Answer the amber <b>Predict</b> box before you open the answer.</p></div>
      <div class="card"><b>STEP 3</b><h3>Step through</h3><p>Run each demo one step at a time (← →). Change the inputs and run it again.</p></div>
      <div class="card"><b>STEP 4</b><h3>Practise</h3><p>Finish with the self-check and the exercises in the last chapter.</p></div>
    </div>

    <section class="cta">
      <h2>${L.ctaTitle}</h2>
      <a class="btn primary" href="#/${CHAPTERS[0].slug}">Chapter 1 · ${CHAPTERS[0].title} →</a>
      <p class="meta" style="margin-top:16px">${L.minutes} · best on a laptop for the demos · type the examples into Python (with numpy) yourself</p>
    </section>
  </div>`;
  finish(main);
  // The pause button toggles the hero player by clearing/restarting its timers.
  const btn = main.querySelector(".hero-pause");
  btn.onclick = () => {
    const holder = main.querySelector(`[data-demo="${L.heroDemo}"]`);
    if (btn.textContent === "Pause") { stopTimers(); btn.textContent = "Play"; }
    else { DEMOS[L.heroDemo](holder.querySelector(".demo-body")); btn.textContent = "Pause"; }
  };
}

function heroHTML(c) {
  if (!c.hero) return "";
  if (c.hero === "toc") {
    return `<div class="card hero-demo"><div class="head"><span>The lecture at a glance</span></div>
      ${CHAPTERS.slice(0, -1).map((x, k) => `<a href="#/${x.slug}" style="display:flex;gap:10px;padding:7px 4px;text-decoration:none;color:var(--ink);border-bottom:1px solid var(--line)"><b class="mono" style="color:var(--amber)">${pad(k)}</b><span>${x.title}</span></a>`).join("")}</div>`;
  }
  if (c.hero.startsWith("code:")) {
    return `<div class="card hero-demo"><div class="head"><span>${c.heroCaption}</span></div>${codeBlock(CODE[c.hero.slice(5)])}</div>`;
  }
  return `<div class="card hero-demo"><div data-demo="${c.hero}"><div class="demo-body"></div></div><div class="caption">${c.heroCaption}</div></div>`;
}

function renderChapter(k) {
  const c = CHAPTERS[k];
  document.title = `${c.title} — ${COURSE.code} ${lectureLabel()} · ${LECTURE.title}`;
  const prev = CHAPTERS[k - 1], next = CHAPTERS[k + 1];
  main.innerHTML = `<div class="wrap">
    <section class="chap-hero">
      <div>
        <span class="pill">Chapter ${pad(k)} · ${c.nav}</span>
        <h1>${c.title}</h1>
        <p class="subtitle">${c.subtitle}</p>
        <p class="abstract">${c.abstract}</p>
      </div>
      ${heroHTML(c)}
    </section>
    <div class="chap-body">
      <nav class="toc" aria-label="In this chapter"><b>IN THIS CHAPTER</b>
        ${c.sections.map((s, j) => `<a href="#/${c.slug}/${s.id}" data-sec="${s.id}">§${k + 1}.${j + 1} ${s.title}</a>`).join("")}
        <a class="toc-all" href="#/all">Whole lecture on one page</a>
      </nav>
      <article>
        ${c.sections.map((s, j) => sectionHTML(s, k, j)).join("")}
        <h2 style="font-size:20px">Chapter ${pad(k)} in three lines</h2>
        <div class="takeaways">${c.takeaways.map((t, j) => `<div class="card"><b>${j + 1}</b>${t}</div>`).join("")}</div>
        <div class="pager" style="margin-top:28px">
          ${prev ? `<a class="card" href="#/${prev.slug}"><small>← Previous · ${pad(k - 1)}</small><b>${prev.title}</b></a>` : `<a class="card" href="#/"><small>← Back</small><b>Home</b></a>`}
          ${next ? `<a class="card next" href="#/${next.slug}"><small>Next · ${pad(k + 1)} →</small><b>${next.title}</b></a>` : `<a class="card next" href="#/"><small>Done →</small><b>Back to this lecture&rsquo;s overview</b></a>`}
        </div>
      </article>
    </div>
  </div>`;
  finish(main);
  // Highlight the section in view.
  const links = [...main.querySelectorAll(".toc a")];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.dataset.sec === e.target.id));
    });
  }, { rootMargin: "-80px 0px -65% 0px" });
  main.querySelectorAll("article section").forEach((s) => obs.observe(s));
  cleanups.push(() => obs.disconnect());
}

function sectionHTML(s, k, j) {
  return `<section id="${s.id}"><h2><span class="sec">§${k + 1}.${j + 1}</span>${s.title}</h2>${s.html}${s.id === "exercises" ? exercisesHTML() : ""}</section>`;
}

// The whole lecture on one page (#/all), for reading straight through and for printing.
function renderAll() {
  document.title = `${LECTURE.title} — ${COURSE.code} ${lectureLabel()} (whole lecture)`;
  main.innerHTML = `<div class="wrap all-view">
    <section class="chap-hero" style="grid-template-columns:minmax(0,1fr)">
      <div>
        <span class="pill">${COURSE.name} · ${lectureLabel()} · whole lecture</span>
        <h1>${LECTURE.title}<small>${LECTURE.tagline}</small></h1>
        <p class="lead">${LECTURE.lead}</p>
        <div class="btnrow noprint">
          <button class="btn primary" type="button" id="print">Print or save as PDF</button>
          <a class="btn" href="#/">Lecture overview</a>
        </div>
        <p class="meta noprint">All ${CHAPTERS.length} chapters on one page. In print, every answer, hint and solution is shown and the videos are listed by title.</p>
      </div>
    </section>
    ${CHAPTERS.map((c, k) => `<article class="all-chapter" id="ch-${c.slug}">
      <h2 class="all-title"><span class="sec">Chapter ${pad(k)}</span>${c.title}</h2>
      <p class="subtitle">${c.subtitle}</p>
      ${c.sections.map((s, j) => sectionHTML(s, k, j)).join("")}
      <h3>Chapter ${pad(k)} in three lines</h3>
      <div class="takeaways">${c.takeaways.map((t, j) => `<div class="card"><b>${j + 1}</b>${t}</div>`).join("")}</div>
    </article>`).join("")}
  </div>`;
  finish(main);
  main.querySelector("#print").onclick = () => print();
}

function route() {
  stopTimers();
  const [slug, sec] = location.hash.replace(/^#\/?/, "").split("/");
  const k = CHAPTERS.findIndex((c) => c.slug === slug);
  if (slug === "all") renderAll(); else if (k >= 0) renderChapter(k); else renderHome();
  document.querySelectorAll(".chapnav a").forEach((a) => a.classList.toggle("active", a.dataset.slug === slug));
  const target = sec ? document.getElementById(sec) : null;
  if (target) target.scrollIntoView();
  else if (!location.hash.includes("outline")) window.scrollTo(0, 0);
}

// In-page anchors (#outline, toc links) shouldn't re-render the page.
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  const href = a.getAttribute("href");
  if (href === "#outline") { e.preventDefault(); document.getElementById("outline").scrollIntoView(); return; }
  const m = href.match(/^#\/([^/]+)\/(.+)$/);
  if (m && location.hash.startsWith(`#/${m[1]}`)) {
    e.preventDefault();
    document.getElementById(m[2])?.scrollIntoView();
    history.replaceState(null, "", href);
  }
});

document.querySelector(".brand-text").innerHTML = `<b>${LECTURE.title} · ${LECTURE.id || `L${String(LECTURE.number).padStart(2, "0")}`}</b><span>${COURSE.name}</span>`;
document.getElementById("chapnav").innerHTML = CHAPTERS.map((c, k) =>
  `<a href="#/${c.slug}" data-slug="${c.slug}"><span>${pad(k)}</span>${c.nav}</a>`).join("");

// Theme toggle: remembers the choice when storage is available.
const themeBtn = document.getElementById("theme");
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  themeBtn.textContent = dark ? "☀" : "☾";
}
try { applyTheme(localStorage.getItem(COURSE.themeKey)); } catch { applyTheme(null); }
themeBtn.onclick = () => {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const t = dark ? "light" : "dark";
  applyTheme(t);
  try { localStorage.setItem(COURSE.themeKey, t); } catch { /* storage unavailable */ }
};

// Reading progress bar.
const bar = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = h > 0 ? `${(100 * scrollY) / h}%` : "0";
}, { passive: true });

// Way back to the course home (all lectures), at the left of the top bar on every lecture page.
const homeLink = document.createElement("a");
homeLink.className = "homelink";
homeLink.href = "../index.html";
homeLink.title = "All lectures";
homeLink.innerHTML = `<span aria-hidden="true">←</span><span class="homelink-text">All lectures</span>`;
document.querySelector(".topbar").prepend(homeLink);

// Printing shows every hidden answer, hint and solution; the page is restored afterwards.
let printOpened = [];
addEventListener("beforeprint", () => {
  printOpened = [...document.querySelectorAll("main details:not([open]):not(.transcript)")];
  printOpened.forEach((d) => { d.open = true; });
});
addEventListener("afterprint", () => { printOpened.forEach((d) => { d.open = false; }); printOpened = []; });

renderFooter("../");
addEventListener("hashchange", route);
route();
