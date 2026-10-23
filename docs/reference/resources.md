# More resources

App downloads, the reference Products and source repositories.

For what to `npm install` and why, see [Packages & tools](packages.md). For
chains, endpoints and the network preset, see
[Networks & endpoints](networks.md).

## Get the app

The Polkadot app is where people use Products, on mobile and desktop. The web
gateway works in any browser if you only want to look around.

--8<-- "install-app.md"

If an account cannot submit a transaction, it probably needs devnet funds. Get
them from the [faucet](https://faucet.polkadot.io).

## Reference Products to open

These apps run on the Devnet. They are developer-preview examples, not audited
production applications.

--8<-- "reference-apps.md"

## Source repositories

For detail these docs do not cover, go to the source.

**Platform and tooling**

- [product-sdk](https://github.com/paritytech/product-sdk): the Product SDK, also a [Claude Code plugin](https://github.com/paritytech/product-sdk#claude-code-plugin) with [agent skills](https://github.com/paritytech/product-sdk/tree/main/product-sdk/skills)
- [trinity-user-agents](https://github.com/paritytech/trinity-user-agents): TrUAPI, the host protocol client and the host runtime
- [polkadot-app-deploy](https://github.com/Polkadot-Community-Foundation/polkadot-app-deploy): the `pad` deploy CLI
- [dotns](https://github.com/paritytech/dotns) · [dotns-sdk](https://github.com/Polkadot-Community-Foundation/dotns-sdk): naming contracts, CLI and UI
- [browse](https://github.com/paritytech/browse): the discovery directory
- [dotli-community](https://github.com/paritytech/dotli-community): the web gateway
- [paseo-network/runtimes](https://github.com/paseo-network/runtimes): chain runtimes

**Polkadot app clients**

- [Android](https://github.com/Polkadot-Community-Foundation/polkadot-android-community)
  · [iOS](https://github.com/Polkadot-Community-Foundation/polkadot-ios-community)
  · [Desktop](https://github.com/Polkadot-Community-Foundation/polkadot-desktop-community)

**Reference Products**

- [Calculator, Stopwatch, Countdown Timer, Alarm Clock, Chess Clock and Unit Converter](https://github.com/paritytech/browse/tree/main/apps/registry/tests/fixture-projects): the reference apps above
- [playground-app-template](https://github.com/Polkadot-Community-Foundation/playground-app-template): a starter app on the Product SDK

## Protocol background

For the underlying Polkadot protocol, tooling and network concepts, see the
official [Polkadot developer documentation](https://docs.polkadot.com).
