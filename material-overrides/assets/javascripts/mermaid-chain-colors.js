/* =============================================================================
   Mermaid — automatic per-chain colouring
   -----------------------------------------------------------------------------
   Applies the shared chain/actor colour classes (relayNode, assethubNode, …)
   to EVERY Mermaid diagram in the docs automatically, by matching each node's
   label text against a keyword table. No per-diagram edits required — the
   colours themselves live in theme.css (the --dg-* tokens + .<name>Node rules).

   Override: if a node already has an explicit `class ... someNode` in the
   diagram source, it is respected and left untouched. To tune globally, edit
   the RULES table below (order = priority, first match wins).

   Robustness: Mermaid renders asynchronously (bundled from a CDN by
   mkdocs-material) and may finish well after page load, so we colour on load,
   on a bounded polling loop, and via a MutationObserver — whichever sees the
   nodes first. Colouring is idempotent.
   ============================================================================= */
(function () {
  var RULES = [
    [/pallet-?revive|asset\s*hub|\bcontract|\bcdm\b|precompile/i, "assethubNode"],
    [/bulletin|\bbundle\b|\bcid\b|content\s*storage/i, "bulletinNode"],
    [/dotns|\.dot\b|\bnaming\b|resolver|contenthash/i, "dotnsNode"],
    [/gateway|dev-dot\.li|\bbrowse\b|directory/i, "gatewayNode"],
    [/people|identity|personhood|coinage|\bcash\b|username/i, "peopleNode"],
    [/relay|root of trust/i, "relayNode"],
    [/developer|\bauthor\b|publisher|\bbuild\b/i, "developerNode"],
    [/\buser\b|wallet|\bapp user\b/i, "userNode"]
  ];
  var CLASSES = [
    "relayNode", "assethubNode", "peopleNode", "bulletinNode",
    "developerNode", "dotnsNode", "gatewayNode", "userNode"
  ];

  function hasChainClass(node) {
    for (var c = 0; c < CLASSES.length; c++) {
      if (node.classList.contains(CLASSES[c])) return true;
    }
    return false;
  }

  // Colour every not-yet-coloured Mermaid node found under `root`. Returns the
  // number of nodes newly coloured (used to stop the polling loop early).
  function classifyNodes(root) {
    var nodes = (root || document).querySelectorAll(".mermaid g.node");
    var touched = 0;
    Array.prototype.forEach.call(nodes, function (node) {
      if (hasChainClass(node)) return; // respect explicit class / already done
      var text = (node.textContent || "").trim();
      if (!text) return;
      for (var i = 0; i < RULES.length; i++) {
        if (RULES[i][0].test(text)) {
          node.classList.add(RULES[i][1]);
          touched++;
          return;
        }
      }
    });
    return touched;
  }

  function run() { try { return classifyNodes(document); } catch (e) { return 0; } }

  // 1) Try now / on load.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("load", run);

  // 2) Bounded polling — catches diagrams that render after load. Stops once a
  //    few consecutive passes find nothing new (or after ~15s).
  var idleRounds = 0, elapsed = 0, STEP = 400, MAX = 15000;
  var timer = setInterval(function () {
    elapsed += STEP;
    var n = run();
    if (n === 0) { idleRounds++; } else { idleRounds = 0; }
    if (idleRounds >= 4 || elapsed >= MAX) clearInterval(timer);
  }, STEP);

  // 3) MutationObserver — re-scan whenever new SVG content is inserted (Material
  //    swaps content on instant navigation; Mermaid injects the SVG late).
  try {
    var mo = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes || [];
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (node.querySelector && node.querySelector("svg, .mermaid")) { run(); return; }
          if (node.tagName && node.tagName.toLowerCase() === "svg") { run(); return; }
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) { /* no-op */ }
})();
