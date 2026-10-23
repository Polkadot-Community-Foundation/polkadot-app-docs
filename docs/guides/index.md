# Guides

Step-by-step guides for the Polkadot Products Devnet.

## For users

For using the Polkadot app, or opening apps through the web gateway at
[dev-dot.li](https://dev-dot.li).

- [Create an account & get funds](create-account.md): set up an account and get
  the funds you need on the Devnet.
- [Back up & restore your account](back-up-your-account.md): save the recovery
  phrase, turn on the cloud backup and restore onto a new device.
- [Get & use CASH](get-and-use-cash.md): top up the balance the app shows and
  send it to another user.
- [Username & proof of personhood](username-and-personhood.md): claim a People
  Chain username and get personhood.
- [Discover & open apps](discover-and-open-apps.md): find apps in
  [Browse](https://browse.dev-dot.li) and open them by their `.dot` domain.
- [Messaging & calls](messaging-and-calls.md): chat with and call other users.

## For developers

For building a Product. You mostly work with a static web app, the Product SDK
and a few CLIs. On this Devnet every CLI takes the `devnet` preset: `pad` and
`dotns` take `--env devnet`, and `cdm` takes `-n devnet`. See
[Networks & endpoints](../reference/networks.md).

- [Build & publish an app](build-and-publish.md): scaffold an app on the
  Product SDK and publish it with the `pad` deploy CLI.
- [Register a .dot domain](register-a-dot-name.md): reserve and configure a
  DotNS name with `@polkadot-community-foundation/dotns-cli`.
- [Deploy & register contracts](deploy-contracts-cdm.md): deploy PolkaVM
  contracts and register them in a CDM manifest with the `cdm` CLI.
- [Use platform services from the SDK](platform-services-sdk.md): call chain,
  contract, cloud storage, identity and signing APIs from `@parity/product-sdk`.
- [List your app in Browse](list-in-browse.md) — make your app discoverable in
  the [Browse](https://browse.dev-dot.li) directory.

New to building here? Start with
[Get started as a developer](../getting-started/developers.md). The
[Architecture](../architecture/index.md) and [Reference](../reference/index.md)
sections have the background and the exact values.
