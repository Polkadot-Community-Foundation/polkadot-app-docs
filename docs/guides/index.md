# Guides

These guides are organized around the jobs developers actually come here to do:
build and publish a Product, register a `.dot` domain, use platform services,
and deploy contracts on the Polkadot Products Devnet.

## For developers

Use these guides when you are building a Product for the app. You will mostly
work with a static web app, the Product SDK, and a few CLIs:

!!! tip "Choosing a network"
    This Devnet is the `devnet` preset: `pad` and `dotns` take `--env devnet`,
    CDM takes `-n devnet`. See [Networks & endpoints](../reference/networks.md).

- [Build & Publish Applications](build-and-publish.md) — scaffold an app on the
  Product SDK and publish it with the `pad` deploy CLI.
- [Register a .dot domain](register-a-dot-name.md) — reserve and configure a
  DotNS name with the `@polkadot-community-foundation/dotns-cli`.
- [Deploy & register contracts](deploy-contracts-cdm.md) — deploy PolkaVM
  contracts and register them in a CDM manifest with the `cdm` CLI.
- [Use platform services from the SDK](platform-services-sdk.md) — call chain,
  contract, cloud-storage, identity, and signing APIs from
  `@parity/product-sdk`.
- [List your app in Browse](list-in-browse.md) — make your app discoverable in
  the [Browse](https://browse.dev-dot.li) directory.

## Learn more

- [Getting started for developers](../getting-started/developers.md)
- [Architecture](../architecture/index.md)
- [Reference](../reference/index.md)
