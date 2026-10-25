// DM101 course info and footer. Every page loads this before app.js, so app.js has no course name hard-coded.
// Pattern from peiyuAIForAll/site/assets/course.js.

const COURSE = {
  code: "DM101",
  name: "DM101 Discrete Mathematics",
  short: "Discrete Mathematics",
  credit: "培玉智能 · Boxi Yu",
  creditEn: "Peiyu AI · Boxi Yu",
  checked: "Every number and every result in these notes is checked by running code.",
  instructors: `Instructors: <a href="https://www.birmingham.ac.uk/staff/profiles/maths/xia-mingtao" target="_blank" rel="noopener">Mingtao Xia</a> · <a href="https://boxiyu.github.io/" target="_blank" rel="noopener">Boxi Yu</a>`,
  inspired: `Textbook: Scheinerman, <i>Mathematics: A Discrete Introduction</i>. The notes, examples and code are written for this course.`,
  animations: `Animations made with open-source tools from animind-ai (<a href="https://github.com/animind-ai" target="_blank" rel="noopener">https://github.com/animind-ai</a>): rendered with <a href="https://github.com/animind-ai/moxian" target="_blank" rel="noopener">animind-ai/moxian</a>, colours from <a href="https://github.com/animind-ai/palette" target="_blank" rel="noopener">animind-ai/palette</a> (both MIT). Maths typeset with <a href="https://katex.org/" target="_blank" rel="noopener">KaTeX</a> (MIT).`,
  themeKey: "dm101-theme",
};

// The lectures and electives that are live (site/PUBLISHED); app.js links "Lecture N" / "elective EN" only to
// these. Written by dm101/tools/site_build.py: don't edit by hand.
const LIVE = ["L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09", "L10", "L11", "L12"];  // site_build.py, from site/PUBLISHED

// Our own course: Peiyu branding is allowed. Content CC BY-SA 4.0 except the Peiyu name, logo and trademarks
// (see LICENSE-NOTE.md); code MIT. The logo files may go into the published site (user decision 2026-10-20,
// replacing the earlier rule that kept them out); they stay all rights reserved.
function renderFooter(root = "") {
  const f = document.querySelector("footer");
  if (!f) return;
  f.innerHTML = `<div class="wrap">
    <p>${COURSE.name} · ${COURSE.instructors} · ${COURSE.checked}</p>
    <p class="credit">
      <img class="logo-light" src="${root}assets/peiyu-logo.svg" alt="Peiyu AI logo" width="18" height="18">
      <img class="logo-dark" src="${root}assets/peiyu-logo-white.svg" alt="Peiyu AI logo" width="18" height="18">
      <span><b>${COURSE.credit}</b> (${COURSE.creditEn}) · Content licensed
      <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener license">CC BY-SA 4.0</a>
      (the Peiyu name, logo and trademarks excluded, all rights reserved) · Code MIT</span>
    </p>
    <p class="fine">${COURSE.inspired}</p>
    <p class="fine">${COURSE.animations}</p>
  </div>`;
}
