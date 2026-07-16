# Guides

These guides are organized around the jobs people actually come here to do:
create an account, get funds, open Products, publish a Product, use platform
services, and deploy contracts on the Polkadot Products Devnet.

!!! note "Devnet"
    This is a public developer preview. Devnet tokens have no real value, and
    flows may change as the platform evolves.

## For users

Use these guides when you want to try the Polkadot app or open Products through
the web gateway at [dev-dot.li](https://dev-dot.li).

- [Create an account & get funds](create-account.md) — set up a self-custodial
  account and get the funds needed for Devnet flows.
- [Get & use CASH](get-and-use-cash.md) — understand the balance shown in the
  app and send it to another user.
- [Messaging & calls](messaging-and-calls.md) — chat and call other users.
- [Username & proof of personhood](username-and-personhood.md) — claim a
  People Chain username and establish personhood.
- [Discover & open apps](discover-and-open-apps.md) — find apps in
  [Browse](https://browse.dev-dot.li) and open them by their `.dot` domain.

## For developers

Use these guides when you are building a Product for the app. You will mostly
work with a static web app, the Product SDK, and a few CLIs:

```bash
npm i @parity/product-sdk
npm i -g @parity/polkadot-app-deploy   # deploy CLI (bin: pad)
npm i -g @polkadot-community-foundation/dotns-cli             # DotNS CLI
npm i -g @polkadot-community-foundation/cdm-cli               # contract manifest CLI (bin: cdm)
```

!!! tip "Choosing a network"
    `pad` and `dotns` take `--env <network>`; CDM uses `-n/--name <network>`.
    The concrete preset name is provided by the team operating the network —
    see [Networks & endpoints](../reference/networks.md).

- [Build & publish a dApp](build-and-publish.md) — scaffold an app on the
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

- [Getting started](../getting-started/index.md)
- [Architecture](../architecture/index.md)
- [Reference](../reference/index.md)
- [Polkadot developer docs](https://docs.polkadot.com)
- [Source on GitHub](https://github.com/paritytech)
