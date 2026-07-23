/* =============================================================================
   Mermaid — click-to-zoom lightbox
   -----------------------------------------------------------------------------
   Makes every rendered Mermaid diagram open in a full-screen overlay you can
   pan (drag) and zoom (wheel / buttons / double-click). Self-contained: no CDN,
   no external library — matches the repo's self-hosted approach.

   The diagram itself is left untouched (colours + layout come from the diagram
   source and theme.css). This only adds an affordance: a zoom cursor + hint on
   the in-page diagram, and an overlay that shows a *clone* of the SVG so the
   original is never moved.

   Robustness mirrors mermaid-chain-colors.js: Mermaid renders asynchronously
   (bundled from a CDN by mkdocs-material) and Material can swap page content, so
   we wire diagrams on load, on a bounded polling loop, and via a
   MutationObserver — whichever sees the SVG first. Wiring is idempotent.
   ============================================================================= */
(function () {
  "use strict";

  var BOX_ID = "dg-diagram-lightbox";
  var MIN_SCALE = 0.2;
  var MAX_SCALE = 12;

  // ---- Lightbox singleton --------------------------------------------------
  var box = null, stage = null, canvas = null;
  var view = { scale: 1, tx: 0, ty: 0 };
  var drag = { active: false, moved: false, x: 0, y: 0 };

  function applyTransform() {
    canvas.style.transform =
      "translate(" + view.tx + "px, " + view.ty + "px) scale(" + view.scale + ")";
  }

  function resetView() {
    view.scale = 1;
    view.tx = 0;
    view.ty = 0;
    applyTransform();
  }

  // Zoom by `factor` keeping the point (cx, cy) — client coordinates — fixed.
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
    var existing = document.getElementById(BOX_ID);
    if (existing) return existing;

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

    // Toolbar
    box.querySelector(".dg-lightbox__bar").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "in") zoomCenter(1.3);
      else if (act === "out") zoomCenter(1 / 1.3);
      else if (act === "reset") resetView();
      else if (act === "close") closeBox();
    });

    // Backdrop click (outside the canvas) closes; drag on canvas pans.
    stage.addEventListener("mousedown", function (e) {
      drag.active = true;
      drag.moved = false;
      drag.x = e.clientX;
      drag.y = e.clientY;
      stage.classList.add("is-dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!drag.active) return;
      var dx = e.clientX - drag.x;
      var dy = e.clientY - drag.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true;
      view.tx += dx;
      view.ty += dy;
      drag.x = e.clientX;
      drag.y = e.clientY;
      applyTransform();
    });
    window.addEventListener("mouseup", function (e) {
      if (!drag.active) return;
      drag.active = false;
      stage.classList.remove("is-dragging");
      // A click (no drag) on the empty stage closes the viewer.
      if (!drag.moved && !e.target.closest("svg")) closeBox();
    });

    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });

    stage.addEventListener("dblclick", function (e) {
      zoomAt(1.6, e.clientX, e.clientY);
    });

    return box;
  }

  function openBox(svg) {
    ensureBox();
    canvas.innerHTML = "";
    var clone = svg.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.maxWidth = "none";
    clone.style.maxHeight = "none";
    canvas.appendChild(clone);
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

  // ---- Wire up each rendered diagram --------------------------------------
  function wire(root) {
    var diagrams = (root || document).querySelectorAll(".mermaid");
    var touched = 0;
    Array.prototype.forEach.call(diagrams, function (el) {
      if (el.getAttribute("data-dg-zoomable")) return; // already wired
      var svg = el.querySelector("svg");
      if (!svg) return; // not rendered yet
      el.setAttribute("data-dg-zoomable", "1");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Open diagram — click to zoom");
      el.addEventListener("click", function () { openBox(svg); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBox(svg);
        }
      });
      touched++;
    });
    return touched;
  }

  function run() { try { return wire(document); } catch (e) { return 0; } }

  // 1) Now / on load.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("load", run);

  // 2) Bounded polling — catches diagrams that render after load.
  var idle = 0, elapsed = 0, STEP = 400, MAX = 15000;
  var timer = setInterval(function () {
    elapsed += STEP;
    if (run() === 0) { idle++; } else { idle = 0; }
    if (idle >= 4 || elapsed >= MAX) clearInterval(timer);
  }, STEP);

  // 3) MutationObserver — re-scan when Mermaid injects SVGs or Material swaps content.
  try {
    var mo = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes || [];
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if ((n.querySelector && n.querySelector("svg, .mermaid")) ||
              (n.tagName && n.tagName.toLowerCase() === "svg")) {
            run();
            return;
          }
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) { /* no-op */ }
})();
