/* =============================================================================
   Mermaid — self-contained render + click-to-zoom
   -----------------------------------------------------------------------------
   Why this exists: mkdocs-material's built-in Mermaid integration races its own
   async load of mermaid.min.js — on a cold cache it runs the typeset before
   Mermaid is ready and leaves the diagram <div class="mermaid"> EMPTY (no SVG,
   source stripped). That is flaky and was leaving diagrams blank in production.

   So we take rendering into our own hands. The fence emits the source as
   `<pre class="dg-mermaid"><code>…</code></pre>` (a class Material ignores, so it
   never touches or empties it). We load a PINNED Mermaid, render each block
   ourselves once Mermaid is ready, drop the SVG into a `.mermaid` wrapper (so all
   the theme.css styling + per-chain colour classes apply unchanged), and wire a
   full-screen pan/zoom lightbox on each diagram.

   No CDN lock-in on Material's side; the only network fetch is the pinned Mermaid,
   loaded once per page and only if the page actually has a diagram.
   ============================================================================= */
(function () {
  "use strict";

  // Pinned Mermaid — verified to render this repo's diagrams. Bump deliberately.
  var MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.min.js";

  /* ---------------------------------------------------------------- rendering */

  var mermaidLoading = null;

  function loadMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (mermaidLoading) return mermaidLoading;
    mermaidLoading = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = MERMAID_URL;
      s.async = true;
      s.onload = function () { resolve(window.mermaid); };
      s.onerror = function () { reject(new Error("mermaid failed to load")); };
      document.head.appendChild(s);
    });
    return mermaidLoading;
  }

  var seq = 0;

  function renderBlock(pre, mermaid) {
    var code = pre.querySelector("code");
    var src = (code ? code.textContent : pre.textContent) || "";
    if (!src.trim()) return Promise.resolve();
    var id = "dg-mmd-" + (seq++);
    return mermaid
      .render(id, src)
      .then(function (out) {
        var wrap = document.createElement("div");
        wrap.className = "mermaid";
        wrap.innerHTML = out.svg;
        if (out.bindFunctions) out.bindFunctions(wrap);
        pre.replaceWith(wrap);
        wireZoom(wrap);
      })
      .catch(function (err) {
        // Graceful degradation: reveal the source so the info isn't lost.
        pre.classList.add("dg-mermaid--error");
        if (window.console) console.error("mermaid render failed:", err);
      });
  }

  function renderAll() {
    var blocks = document.querySelectorAll("pre.dg-mermaid");
    if (!blocks.length) return;
    loadMermaid()
      .then(function (mermaid) {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose", // allow <br/> in node labels
          theme: "base",
          // Measure with the same font the page renders in, so labels don't clip.
          fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          flowchart: { htmlLabels: true, useMaxWidth: true }
        });
        Array.prototype.forEach.call(blocks, function (pre) { renderBlock(pre, mermaid); });
      })
      .catch(function (err) {
        Array.prototype.forEach.call(blocks, function (pre) {
          pre.classList.add("dg-mermaid--error");
        });
        if (window.console) console.error(err);
      });
  }

  /* ---------------------------------------------------------------- lightbox */

  var BOX_ID = "dg-diagram-lightbox";
  var MIN_SCALE = 0.2;
  var MAX_SCALE = 12;

  var box = null, stage = null, canvas = null;
  var view = { scale: 1, tx: 0, ty: 0 };
  var drag = { active: false, moved: false, x: 0, y: 0 };

  function applyTransform() {
    canvas.style.transform =
      "translate(" + view.tx + "px, " + view.ty + "px) scale(" + view.scale + ")";
  }

  function resetView() { view.scale = 1; view.tx = 0; view.ty = 0; applyTransform(); }

  function zoomAt(factor, cx, cy) {
    var rect = stage.getBoundingClientRect();
    var ox = cx - rect.left - rect.width / 2;
    var oy = cy - rect.top - rect.height / 2;
    var next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale * factor));
    var ratio = next / view.scale;
    view.tx = ox - (ox - view.tx) * ratio;
    view.ty = oy - (oy - view.ty) * ratio;
    view.scale = next;
    applyTransform();
  }

  function zoomCenter(factor) {
    var rect = stage.getBoundingClientRect();
    zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function ensureBox() {
    if (box) return box;
    box = document.createElement("div");
    box.id = BOX_ID;
    box.className = "dg-lightbox";
    box.setAttribute("hidden", "");
    box.innerHTML =
      '<div class="dg-lightbox__stage" role="dialog" aria-modal="true" aria-label="Diagram viewer">' +
      '  <div class="dg-lightbox__canvas"></div>' +
      "</div>" +
      '<div class="dg-lightbox__bar">' +
      '  <button type="button" class="dg-lightbox__btn" data-act="out" title="Zoom out" aria-label="Zoom out">&#8722;</button>' +
      '  <button type="button" class="dg-lightbox__btn" data-act="reset" title="Reset" aria-label="Reset zoom">Reset</button>' +
      '  <button type="button" class="dg-lightbox__btn" data-act="in" title="Zoom in" aria-label="Zoom in">+</button>' +
      '  <button type="button" class="dg-lightbox__btn dg-lightbox__btn--close" data-act="close" title="Close (Esc)" aria-label="Close">&#10005;</button>' +
      "</div>";
    document.body.appendChild(box);
    stage = box.querySelector(".dg-lightbox__stage");
    canvas = box.querySelector(".dg-lightbox__canvas");
    // `md-typeset` so the same theme.css .mermaid rules (per-chain colours,
    // label styling) apply to the cloned diagram inside the lightbox.
    canvas.className += " md-typeset";

    box.querySelector(".dg-lightbox__bar").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "in") zoomCenter(1.3);
      else if (act === "out") zoomCenter(1 / 1.3);
      else if (act === "reset") resetView();
      else if (act === "close") closeBox();
    });

    stage.addEventListener("mousedown", function (e) {
      drag.active = true; drag.moved = false; drag.x = e.clientX; drag.y = e.clientY;
      stage.classList.add("is-dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!drag.active) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true;
      view.tx += dx; view.ty += dy; drag.x = e.clientX; drag.y = e.clientY;
      applyTransform();
    });
    window.addEventListener("mouseup", function (e) {
      if (!drag.active) return;
      drag.active = false;
      stage.classList.remove("is-dragging");
      if (!drag.moved && !e.target.closest("svg")) closeBox();
    });
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });
    stage.addEventListener("dblclick", function (e) { zoomAt(1.6, e.clientX, e.clientY); });
    return box;
  }

  function openBox(svg) {
    ensureBox();
    canvas.innerHTML = "";
    // Wrap in `.mermaid` so theme.css colour classes reach the clone.
    var wrap = document.createElement("div");
    wrap.className = "mermaid";
    var clone = svg.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.maxWidth = "none";
    clone.style.maxHeight = "none";
    wrap.appendChild(clone);
    canvas.appendChild(wrap);
    resetView();
    box.removeAttribute("hidden");
    document.body.classList.add("dg-lightbox-open");
  }

  function closeBox() {
    if (!box) return;
    box.setAttribute("hidden", "");
    document.body.classList.remove("dg-lightbox-open");
    canvas.innerHTML = "";
  }

  document.addEventListener("keydown", function (e) {
    if (box && !box.hasAttribute("hidden")) {
      if (e.key === "Escape") closeBox();
      else if (e.key === "+" || e.key === "=") zoomCenter(1.3);
      else if (e.key === "-") zoomCenter(1 / 1.3);
      else if (e.key === "0") resetView();
    }
  });

  function wireZoom(el) {
    if (el.getAttribute("data-dg-zoomable")) return;
    var svg = el.querySelector("svg");
    if (!svg) return;
    el.setAttribute("data-dg-zoomable", "1");
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Open diagram — click to zoom");
    el.addEventListener("click", function () { openBox(svg); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBox(svg); }
    });
  }

  /* ---------------------------------------------------------------- bootstrap */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }
})();
