# Reference

Use this section when you need a concrete value, package name, endpoint, or
definition while working with the Polkadot Products Devnet. The pages here are
intentionally compact: they point you to the current source of truth without
turning every reference lookup into an implementation tour.

!!! note "Devnet"
    This is a public developer preview. Devnet tokens have no real value, and
    endpoints, addresses, and flows may change as the platform evolves. Never
    print or commit secrets.

## What is here

- [Networks & endpoints](networks.md) — the Devnet chains, public entry points,
  and where to find current RPC and gateway values.
- [Packages & tools](packages.md) — the SDKs and CLIs you install when building
  Products.
- [Addresses & registries](addresses.md) — the on-chain registries, asset IDs,
  and contract addresses that are useful to developers.
- [Glossary](glossary.md) — short definitions for the terms used across the
  docs.
- [More resources](resources.md) — app installs, reference apps, source
  repositories, npm packages, and official Polkadot documentation.

## Quick reference

### Packages

```bash
# Libraries used by Products
npm i @parity/product-sdk
npm i @novasamatech/host-api
npm i @polkadot-community-foundation/cdm-env

# Command-line tools
npm i -g @parity/polkadot-app-deploy
npm i -g @polkadot-community-foundation/dotns-cli
npm i -g @polkadot-community-foundation/cdm-cli
```

!!! tip "Choosing a network"
    Use `devnet` as the network preset. `pad` and `dotns` use `--env devnet`;
    CDM uses `-n devnet`.

### Entry points

- Polkadot app as a direct [Android APK](https://get.polkadotcommunity.foundation/android/latest.apk)
- [iOS TestFlight](https://testflight.apple.com/join/VvC8SHVE)
- [Desktop app](https://polkadotcommunity.foundation/desktop/)
- Web gateway: [dev-dot.li](https://dev-dot.li)
- [Faucet](https://faucet.polkadot.io) — top up a Devnet account

### Reference apps

| App | URL |
| --- | --- |
| Browse (app directory) | <https://browse.dev-dot.li> |
| DotNS UI | <https://dotns.dev-dot.li> |
| CDM Frontend | <https://contracts.dev-dot.li> |
| Playground template | <https://playground-template.dev-dot.li> |
| Playground | <https://playground.dev-dot.li> |
| Simple Survey | <https://survey.dev-dot.li> |
| Mercado (marketplace) | <https://mercado.dev-dot.li> |
| localdot (local marketplace) | <https://localmarket.dev-dot.li> |

## Learn more

- [Getting started](../getting-started/index.md)
- [Architecture](../architecture/index.md)
- [Guides](../guides/index.md)
- [Polkadot developer docs](https://docs.polkadot.com)
- [Source repositories](resources.md#source-repositories)
