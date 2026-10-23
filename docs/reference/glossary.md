# Glossary

Short definitions of the terms used in these docs, with a link to the page
that covers each one in depth.

## Platform and entry points

### Product

An app published to the Devnet under a `.dot` domain and opened inside the
Polkadot app or the web gateway. These docs say "Product" when they mean the
published, named app, and not a web app in general. See
[App delivery](../architecture/app-delivery.md).

### Polkadot Products Devnet

The public developer preview these docs describe. It runs on the
community-operated Paseo network. Product developers mainly use Asset Hub for
contracts and assets, People for identity, and Bulletin for app bundle storage.

### Polkadot app

The app people use to reach the platform, on mobile and desktop. Products run
inside it, and it handles signing, storage, chain access and identity for the
user. Download links are in [More resources](resources.md).

### dev-dot.li

The web gateway that serves `.dot` apps in an ordinary browser, reachable at
<https://dev-dot.li>. It resolves a `.dot` domain, fetches the app bundle, and
renders it in a sandboxed iframe.

## Naming and discovery

### `.dot` domain

A readable name, such as `calculator.dot`, that points to a deployed app
bundle. For users it works like an app name. For developers it is the name you
register, update and publish with the DotNS tools.

### DotNS

The `.dot` naming system. You use it to register an app name, point that name
at content, or look up where an app is published. See the
[naming architecture](../architecture/naming.md).

### Browse / Publisher

Browse is the app-discovery directory for the Devnet
(<https://browse.dev-dot.li>). Use it to find published Products, or to check
that your own app appears after you list it. Publishing requires ownership of the
`.dot` domain and may require personhood checks.

## Contracts

### PolkaVM / revive

PolkaVM is the contract execution layer on Asset Hub, available through
`pallet-revive`. If your Product needs custom on-chain logic, this is most
likely where your contracts run. See the
[contracts architecture](../architecture/contracts.md).

## Storage and delivery

### Bulletin

The Bulletin chain stores published web-app bundles and contract metadata.
Stored content is addressed by CID. Uploads need a storage authorization: a
deploy account must hold a live one before it can upload, and authorizations
expire and must be refreshed.

### CID

The content identifier of a stored bundle or file. A `.dot` domain resolves to
a CID, and the CID is what the client fetches. See
[App delivery](../architecture/app-delivery.md).

### Statement store

A People-chain store of short signed statements. The app uses it as the transport
for encrypted chat messages and call signalling. See
[Messaging & calls](../architecture/messaging.md).

## Developer SDKs

### Product SDK

`@parity/product-sdk` is the main TypeScript SDK for building Products. It
gives your app the wallet, chain, storage, contract and identity services that
the host provides. It runs inside the Polkadot app or the web gateway, and is
not a standalone wallet. See [Packages & tools](packages.md).

### TrUAPI (host protocol)

TrUAPI is the protocol between a Product and its host (the Polkadot app or the
web gateway). It covers accounts, signing, permissions, storage, chat, payments
and chain access. `@parity/truapi` is the Product-side client, and
`@parity/product-sdk-host` speaks it for you. It replaced the earlier Host API
(`@novasamatech/host-api`). See
[Packages & tools](packages.md#host-protocol-truapi).

### Deploy CLI (`pad`)

`@polkadot-community-foundation/polkadot-app-deploy` (bin: `pad`) is the CLI
that publishes a built static bundle and points a `.dot` domain at it. On this
Devnet, use the `devnet` preset: `pad` and `dotns` take it with
`--env devnet`.

## Identity and personhood

### Proof of personhood

How an account is recognized as a distinct human without revealing who that
human is. It has two tiers, and either can unlock product flows such as app
listing, naming, rewards or rate limits.

- Lite: an attested username. Most users hold this tier.
- Full: a stronger guarantee of one account per human, reached by redeeming an
  invitation. See
  [Username & proof of personhood](../guides/username-and-personhood.md).

### Alias

A per-application pseudonym derived for your account, so an app can recognize a
returning person without learning who they are or linking them across apps. See
[Identity & personhood](../architecture/identity.md).

### People / Asset Hub

Two of the system parachains Products use. Asset Hub hosts contracts, assets
and DotNS. People hosts identity and personhood.

## Accounts and addresses

### SS58

The Substrate address format an account is shown in (Devnet prefix `42`).
Faucets and chain tools take the SS58 address. Contract tooling uses the mapped
EVM `0x…` address instead. See [Addresses & registries](addresses.md).

## Money

### CASH

The name users see for a Devnet digital-dollar asset. Users get CASH inside
the Polkadot app, through in-app flows or rewards, depending on the current
build. See [Get & use CASH](../guides/get-and-use-cash.md).

### PAS

The native token of the underlying Paseo network, used to pay transaction fees
and keep an account alive. It is not CASH. It comes from the faucet: see
[Create an account & get funds](../guides/create-account.md).

### Pocket

The wallet surface in the Polkadot app: the screen holding your balances,
including the CASH card and its top-up button.

### Coinage

The privacy-preserving payment system on the People chain that CASH is spent
through. See [Money (CASH & funding)](../architecture/money.md).

## Learn more

- [Packages & tools](packages.md): what to install
- [Networks & endpoints](networks.md): chains, the `devnet` preset and endpoints
- [More resources](resources.md): apps, downloads and source
