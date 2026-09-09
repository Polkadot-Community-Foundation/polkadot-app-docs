// Product manifest for `@polkadot-community-foundation/polkadot-app-deploy` (pad).
// pad discovers this file by name, walking up from the build directory it is
// given (`site-onchain`), and publishes the manifest alongside the content:
// displayName/description/icon as the `manifest` text record on docs.dot, plus
// the `app.docs.dot` executable subname the Polkadot app clients open. The icon
// is the Products Devnet mark from polkadot-app-brand-assets (variants/devnet).
//
// Plain object on purpose: importing `defineConfig` from the CLI package fails
// when the CLI is installed globally.
export default {
  domain: "docs.dot",
  displayName: "Polkadot App Docs",
  description:
    "Developer and user documentation for the Polkadot Products Devnet and the Polkadot app: architecture, guides, reference, and update notes.",
  icon: { path: "./product-icon.png", format: "png" },
  executables: [
    {
      kind: "app",
      path: "./site-onchain",
      appVersion: [0, 1, 0],
    },
  ],
};
