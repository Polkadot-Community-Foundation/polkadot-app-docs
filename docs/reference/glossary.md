# Glossary

Use this glossary when a term in the docs is blocking your reading. Each entry
answers the same practical question: what does this mean here, and where should
you go next if you need to use it?

Entries are deliberately short. When a term maps to a tool, package, contract,
or guide, the entry points you to the resource that helps you take the next
step.

## Platform and entry points

### Product

An application published to the Devnet under a `.dot` domain and opened inside
the Polkadot app or the web gateway. These docs say "Product" wherever the
published, named artefact is meant rather than a generic web app. See
[App delivery](../architecture/app-delivery.md).

### Polkadot Products Devnet

The public developer preview this documentation describes. It runs on the
community-operated Paseo network, with Product developers mainly using Asset Hub
for contracts and assets, People for identity, and Bulletin for app bundle
storage.

### Polkadot app

The end-user client for the platform, available on mobile and desktop. Apps run
inside it, and the app brokers signing, storage, chain access, and identity on
the user's behalf. Download links are in [More resources](resources.md).

### dev-dot.li

The web gateway that serves `.dot` apps in an ordinary browser, reachable at
<https://dev-dot.li>. It resolves a `.dot` domain, fetches the app bundle, and
renders it in a sandboxed iframe.

## Naming and discovery

### `.dot` domain

A human-readable name, such as `survey.dot`, that maps to a deployed app bundle.
For most users it works like an app name. For developers it is the name you
register, update, and publish through DotNS tooling.

### DotNS

The `.dot` naming system. Use DotNS when you need to register an app name, point
that name at content, or look up where an app is published. See the
[naming architecture](../architecture/naming.md).

- Reference UI: <https://dotns.dev-dot.li>

### Browse / Publisher

Browse is the app-discovery directory for the Devnet
(<https://browse.dev-dot.li>). Use it to find published Products, or to check
that your own app appears after you list it. Publishing requires ownership of the
`.dot` domain and may require personhood checks.

## Contracts

### PolkaVM / revive

PolkaVM is the contract execution layer on Asset Hub, exposed through
`pallet-revive`. If your Product needs custom on-chain logic, this is the
contract environment you will most likely target.

### CDM (Contract Dependency Manager)

The build, deploy, registry, and dependency tool for PolkaVM contracts. Use CDM
when you want to publish a contract package that other Products can resolve by
name. See the [contracts architecture](../architecture/contracts.md).

- CDM Frontend: <https://contracts.dev-dot.li>

## Storage and delivery

### Bulletin

The Bulletin chain stores published web-app bundles and contract metadata.
Uploads require storage authorization, and stored content is addressed by CID.

!!! note
    Because storage is authorization-gated, a deploy account needs a live
    storage authorization before it can upload. Authorizations can expire and
    must be refreshed.

### CID

The content identifier of a stored bundle or file. A `.dot` domain resolves to a
CID, and the CID is what the client actually fetches. See
[App delivery](../architecture/app-delivery.md).

### Statement store

A People-chain store of short signed statements. The app uses it as the transport
for encrypted chat messages and call signalling. See
[Messaging & calls](../architecture/messaging.md).

## Developer SDKs

### Product SDK

`@parity/product-sdk` is the main TypeScript SDK for building Products. It gives
your app access to host-provided wallet, chain, storage, contract, and identity
services. The SDK is designed to run inside the Polkadot app or the web gateway,
not as a standalone wallet. See [Packages & tools](packages.md).

### Host API

`@novasamatech/host-api` is the protocol between a Product and the Polkadot app
host. Use it directly when you need lower-level access to host capabilities such
as accounts, signing, storage, chat, payments, or remote chain access.

### Deploy CLI (`pad`)

`@polkadot-community-foundation/polkadot-app-deploy` (bin: `pad`) is the CLI that publishes a built
static bundle and points a `.dot` domain at it.

!!! tip
    Use the `devnet` preset for this environment. `pad` and `dotns` take it with
    `--env devnet`; CDM uses `-n devnet`.

## Identity and personhood

### Proof of personhood

The mechanism by which an account is recognized as a distinct human without
revealing who they are. It has two tiers, and either can unlock product flows
such as app listing, naming, rewards, or rate limits.

- **Lite** — an attested username; the tier most users hold.
- **Full** — stronger one-account-per-human assurance, reached by redeeming an
  invitation. See
  [Username & proof of personhood](../guides/username-and-personhood.md).

### Alias

A per-application pseudonym derived for your account, so an app can recognize a
returning person without learning who they are or linking them across apps. See
[Identity & personhood](../architecture/identity.md).

### People / Asset Hub

Two of the system parachains the product suite targets. **Asset Hub** hosts
contracts, assets, and DotNS. **People** hosts identity and personhood.

## Accounts and addresses

### SS58

The Substrate address format an account is shown in (Devnet prefix `42`). Faucets
and chain tools take the SS58 address; contract tooling uses the mapped EVM
`0x…` address instead. See [Addresses & registries](addresses.md).

## Money

### CASH

The end-user display name for a Devnet digital-dollar asset. Users can obtain
CASH through in-app flows, rewards, or supporting faucet flows, depending on the
current build.

### PAS

The native token of the underlying Paseo network, used to pay transaction fees
and keep an account alive. It is not CASH, and comes from the faucet — see
[Create an account & get funds](../guides/create-account.md).

### Pocket

The wallet surface in the Polkadot app: the screen holding your balances,
including the CASH card and its top-up button.

### Coinage

The privacy-preserving payment system on the People chain that CASH is spent
through. See [Money (CASH & funding)](../architecture/money.md).

## Learn more

- [Packages & tools](packages.md) — what to install
- [Networks & endpoints](networks.md) — chains, the `devnet` preset, and endpoints
- [More resources](resources.md) — apps, downloads, and source
