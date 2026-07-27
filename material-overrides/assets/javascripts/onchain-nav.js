/*
 * On-chain (dotli sandbox) navigation shim — ONLY shipped in the on-chain
 * build variant (mkdocs.onchain.yml → docs.dot). Not present on the GitHub
 * Pages build.
 *
 * Why: the dotli sandbox service worker only serves *navigation* requests
 * whose path starts with its internal prefix `/dotli-app/`
 * (apps/sandbox/src/app-sw.ts). MkDocs is a multi-page app, so a normal link
 * click navigates to e.g. `/architecture/storage/` — not under that prefix —
 * which falls through to the network, reboots the sandbox shell without its
 * `?cid=` contract params, and fails with "Invalid sandbox URL". Sub-resources
 * (CSS/JS/fonts) are unaffected: the SW serves any same-origin non-navigation
 * path from the archive. So we only need to reroute *navigations* through the
 * prefix; the sandbox strips it back out of the URL bar after serving.
 *
 * IMPORTANT: this prefix is dev-dot.li-gateway-specific. Native hosts (the
 * Polkadot app webview) serve the same CAR archive at the ROOT via
 * shouldInterceptRequest with NO service worker; there, prefixing a navigation
 * with /dotli-app/ points at a path the archive doesn't contain → "Not found".
 * So only rewrite when a service worker controls this page — the reliable
 * gateway signal (this very script is SW-served on the gateway, native-served
 * in the app). No SW ⇒ leave navigations untouched.
 */
(function () {
  "use strict";
  var PREFIX = "/dotli-app";

  function gatewayServesViaSW() {
    try {
      return !!(navigator.serviceWorker && navigator.serviceWorker.controller);
    } catch (_) {
      return false;
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      if (!gatewayServesViaSW()) return; // native app host: serve root paths as-is
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      var a = e.target && e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      if (a.hasAttribute("download")) return;
      if (a.target && a.target !== "" && a.target !== "_self") return;

      var raw = a.getAttribute("href");
      if (!raw || raw.charAt(0) === "#") return; // in-page anchor

      var url;
      try {
        url = new URL(raw, location.href);
      } catch (_) {
        return;
      }
      if (url.origin !== location.origin) return; // external
      if (url.pathname === location.pathname) return; // same doc (anchor/query only)
      if (url.pathname === PREFIX || url.pathname.indexOf(PREFIX + "/") === 0) {
        return; // already prefixed
      }

      e.preventDefault();
      location.assign(PREFIX + url.pathname + url.search + url.hash);
    },
    true,
  );
})();
