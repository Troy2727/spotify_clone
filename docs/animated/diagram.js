// Animates one approved README diagram in place and returns its GSAP timeline. Nothing in the
// SVG is restyled or moved: zones and boxes fade up, then each arrow draws in document order
// with a glowing packet riding it, its label appears as it lands, and the box it hits glows.
window.SpotifyDiagram = (function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const DRAW = 0.7, STEP = 1.0;

  function animate(svg, total) {
    const tl = gsap.timeline({ paused: true });
    const kids = [...svg.children].filter((el) => !["title", "desc", "defs"].includes(el.tagName));
    const bg = kids.shift().getAttribute("fill"); // full-size background rect
    const n = (el, a) => Number(el.getAttribute(a));
    const isUnderlay = (el) => el.tagName === "rect" && el.getAttribute("fill") === bg;
    const isRule = (el) => el.tagName === "line" && n(el, "y1") === n(el, "y2") && n(el, "x2") - n(el, "x1") > 800;

    // Sort the diagram-design output into the parts that animate differently
    const still = [], nodes = [], edges = [], labels = [], callouts = [], legend = [], bars = [];
    for (let i = 0; i < kids.length; i++) {
      const el = kids[i];
      if (legend.length || isRule(el)) legend.push(el);
      else if (el.tagName === "path" && el.hasAttribute("marker-end")) edges.push(el);
      else if (isUnderlay(el) && n(el, "height") > 16) {
        const box = [el];
        while (kids[i + 1] && !isUnderlay(kids[i + 1]) && kids[i + 1].tagName !== "path" && !isRule(kids[i + 1]) && !kids[i + 1].querySelector("tspan")) box.push(kids[++i]);
        const g = document.createElementNS(SVG_NS, "g");
        el.before(g);
        g.append(...box);
        nodes.push(g);
      } else if (isUnderlay(el) && edges.length) labels.push([el, kids[++i]]);
      else if (el.tagName === "text" && el.querySelector("tspan")) callouts.push(el);
      else if (el.tagName === "rect" && n(el, "width") === 8) bars.push(el); // sequence activations
      else still.push(el); // zones, lifelines, alt frame and their tags
    }

    tl.fromTo(still, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.3);
    nodes.forEach((g, k) => tl.fromTo(g, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.6 + k * 0.15));
    const nodesEnd = 0.6 + nodes.length * 0.15 + 0.5;
    tl.fromTo(bars, { opacity: 0 }, { opacity: 1, duration: 0.4 }, nodesEnd);

    const boxes = nodes.map((g) => ({ g, b: g.getBBox() }));
    function nodeAt(pt) {
      const pad = 10;
      const hits = boxes.filter(({ b }) => pt.x >= b.x - pad && pt.x <= b.x + b.width + pad && pt.y >= b.y - pad && pt.y <= b.y + b.height + pad);
      return hits[0] && hits[0].g;
    }
    function glow(el, color, t) {
      const off = `drop-shadow(0px 0px 0px ${color}00)`, on = `drop-shadow(0px 0px 6px ${color})`;
      tl.fromTo(el, { filter: off }, { filter: on, duration: 0.25, immediateRender: false }, t);
      tl.fromTo(el, { filter: on }, { filter: off, duration: 0.5, immediateRender: false }, t + 0.6);
    }

    const eStart = nodesEnd + 0.4;
    const packets = document.createElementNS(SVG_NS, "g");
    legend[0].before(packets);
    edges.forEach((el, k) => {
      const t = eStart + k * STEP;
      const len = el.getTotalLength();
      const color = el.getAttribute("stroke");
      if (el.hasAttribute("stroke-dasharray")) {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: DRAW }, t);
      } else {
        el.setAttribute("stroke-dasharray", `${len} ${len}`);
        tl.fromTo(el, { attr: { "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": 0 }, duration: DRAW, ease: "power2.inOut" }, t);
      }
      // The arrowhead appears once the line has drawn
      const marker = el.getAttribute("marker-end");
      tl.fromTo(el, { attr: { "marker-end": "none" } }, { attr: { "marker-end": marker }, duration: 0.01 }, t + DRAW);

      const dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("r", 3);
      dot.setAttribute("fill", color);
      dot.style.filter = `drop-shadow(0 0 3px ${color})`;
      packets.appendChild(dot);
      const ride = { p: 0 };
      const place = () => {
        const pt = el.getPointAtLength(ride.p * len);
        dot.setAttribute("cx", pt.x);
        dot.setAttribute("cy", pt.y);
      };
      place();
      tl.fromTo(ride, { p: 0 }, { p: 1, duration: DRAW, ease: "power2.inOut", onUpdate: place }, t);
      tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.1 }, t);
      tl.fromTo(dot, { opacity: 1 }, { opacity: 0, duration: 0.12, immediateRender: false }, t + DRAW - 0.05);
      const target = nodeAt(el.getPointAtLength(len));
      if (target) glow(target, color, t + DRAW - 0.05);
    });
    const edgesEnd = eStart + edges.length * STEP;

    // Each label appears with the arrow it sits closest to
    const samples = edges.map((el) => {
      const len = el.getTotalLength();
      return Array.from({ length: 41 }, (_, i) => el.getPointAtLength((len * i) / 40));
    });
    for (const pair of labels) {
      const b = pair[1].getBBox();
      const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      let best = 0, bestD = Infinity;
      samples.forEach((pts, k) => pts.forEach((p) => {
        const d = Math.hypot(p.x - cx, p.y - cy);
        if (d < bestD) (bestD = d), (best = k);
      }));
      tl.fromTo(pair, { opacity: 0 }, { opacity: 1, duration: 0.4 }, eStart + best * STEP + 0.35);
    }

    tl.fromTo(callouts, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.6 }, edgesEnd + 0.3);
    tl.fromTo(legend, { opacity: 0 }, { opacity: 1, duration: 0.6 }, edgesEnd + 0.8);
    tl.to({}, { duration: Math.max(0, total - tl.duration()) });
    return tl;
  }

  return { animate };
})();
