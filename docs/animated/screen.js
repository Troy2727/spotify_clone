// Animates one README screenshot into a composition root and returns its GSAP timeline:
// the logo and title appear, the screenshot card rises in, then each callout outlines one
// area with a glowing ring and its label glows in. Adapted from the LiveDocs README screens.
window.SpotifyScreen = (function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const GREEN = "#1db954";
  const GLOW_ON = "drop-shadow(0 0 10px rgba(29, 185, 84, 0.95))";
  const GLOW_OFF = "drop-shadow(0 0 0px rgba(29, 185, 84, 0))";

  function el(tag, attrs, parent) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    parent.appendChild(node);
    return node;
  }

  function html(parent, className, style, inner) {
    const div = document.createElement("div");
    div.className = className;
    Object.assign(div.style, style);
    div.innerHTML = inner;
    parent.appendChild(div);
    return div;
  }

  /** Fade an element in with a glow that settles. */
  function glowIn(tl, targets, at) {
    tl.fromTo(targets, { opacity: 0, y: 6, filter: GLOW_ON }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, at);
    tl.to(targets, { filter: GLOW_OFF, duration: 0.7, ease: "power1.out" }, at + 0.35);
  }

  /**
   * A 1440×900 app screenshot shown at 1280×800 in a card; each callout outlines one area
   * (x, y, w, h in screenshot pixels) and its label glows in at (lx, ly), also in screenshot pixels.
   */
  function screen(root, title, { src, alt, callouts }) {
    root.classList.add("scene");
    const header = html(root, "header", {}, `<img src="../../animated/spotify.png" alt="" /><h1>${title}</h1>`);
    const footer = html(root, "footer", {}, "spotify-clone-jade-pi-29.vercel.app");
    const X = 160, Y = 175, S = 1280 / 1440;
    const card = html(root, "shot", { left: `${X}px`, top: `${Y}px` }, `<img src="${src}" alt="${alt}" />`);
    const svg = el("svg", { class: "rings", viewBox: "0 0 1600 1150" }, root);
    const glow = el("filter", { id: "glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, el("defs", {}, svg));
    el("feGaussianBlur", { stdDeviation: "4", result: "blur" }, glow);
    const merge = el("feMerge", {}, glow);
    el("feMergeNode", { in: "blur" }, merge);
    el("feMergeNode", { in: "SourceGraphic" }, merge);

    const tl = gsap.timeline({ paused: true });
    tl.fromTo([header, footer], { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
    tl.fromTo(card, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" }, 0.4);

    let t = 1.7;
    for (const c of callouts) {
      const ring = el("rect", {
        x: X + c.x * S, y: Y + c.y * S, width: c.w * S, height: c.h * S, rx: 12,
        fill: "none", stroke: GREEN, "stroke-width": 3.5, filter: "url(#glow)",
      }, svg);
      const len = 2 * (c.w + c.h) * S;
      ring.setAttribute("stroke-dasharray", `${len} ${len}`);
      tl.fromTo(ring, { attr: { "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.6, ease: "power1.inOut" }, t);
      const label = html(root, "callout", { left: `${X + c.lx * S}px`, top: `${Y + c.ly * S}px` }, c.label);
      glowIn(tl, label, t + 0.4);
      t += 1.0;
    }
    const total = Number(root.dataset.duration);
    tl.to({}, { duration: Math.max(0, total - tl.duration()) });
    return tl;
  }

  return { screen };
})();
