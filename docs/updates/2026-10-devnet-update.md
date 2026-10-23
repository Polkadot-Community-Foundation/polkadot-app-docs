---
date: 2026-10-23
short_title: Devnet update, October 2026
summary: The Devnet apps and the web gateway move to a new host protocol, TrUAPI. Users update the app; developers build on Product SDK 0.39.0.
---

# Devnet update: the apps move to TrUAPI

New builds of the Devnet mobile and desktop apps, and the web gateway at
[dev-dot.li](https://dev-dot.li), now talk to the apps they open over a new host
protocol, TrUAPI.

## For users

Update the app. Take the new build from
[Get the app](../reference/resources.md#get-the-app). Older builds cannot run
apps built on the current Product SDK.

## For developers

- Install Product SDK 0.39.0, the version the hosts speak:
  `npm i @parity/product-sdk@0.39.0`. Newer releases speak a newer protocol.
  See [Packages & tools](../reference/packages.md#install-the-sdk-version-the-hosts-speak).
- Use the current Devnet chain metadata, with the descriptors override in
  [Packages & tools](../reference/packages.md#current-devnet-chain-metadata).
- Test with the TrUAPI test host from `@parity/truapi-host`. See
  [Test without the real host](../guides/platform-services-sdk.md#test-without-the-real-host).
- Start new apps from the
  [playground-app-template](https://github.com/Polkadot-Community-Foundation/playground-app-template),
  which is already on Product SDK 0.39.0.

An app built on an older SDK, or directly on `@novasamatech/host-api`, cannot
talk to the new hosts until it moves to 0.39.0. That move includes
`polkadot-api` 3.

## Questions

Ask in the Devnet chat for developers on Matrix:
[#polkadot-products-public](https://matrix.to/#/#polkadot-products-public:matrix.org).
