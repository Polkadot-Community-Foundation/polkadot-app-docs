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

  function classify(svg) {
    svg.querySelectorAll("g.node").forEach(function (node) {
      // Respect an explicit class set in the diagram source.
      for (var c = 0; c < CLASSES.length; c++) {
        if (node.classList.contains(CLASSES[c])) return;
      }
      var text = (node.textContent || "").trim();
      if (!text) return;
      for (var i = 0; i < RULES.length; i++) {
        if (RULES[i][0].test(text)) {
          node.classList.add(RULES[i][1]);
          return;
        }
      }
    });
  }

  function scan(root) {
    (root || document).querySelectorAll(".mermaid svg").forEach(classify);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { scan(); });
  } else {
    scan();
  }

  // Mermaid renders asynchronously (and Material may swap page content), so
  // watch for SVGs being inserted and colour them as they appear.
  var mo = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes || [], function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches(".mermaid svg")) {
          classify(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll(".mermaid svg").forEach(classify);
        }
      });
    });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
