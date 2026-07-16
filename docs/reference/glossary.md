# Glossary

Use this glossary when a term in the docs is blocking your reading. Each entry
answers the same practical question: what does this mean here, and where should
you go next if you need to use it?

Entries are deliberately short. When a term maps to a tool, package, contract,
or guide, the entry points you to the resource that helps you take the next
step.

## Platform and entry points

### Polkadot Products Devnet

The public developer preview this documentation describes. It runs on the
community-operated Paseo network, with Product developers mainly using Asset Hub
for contracts and assets, People for identity, and Bulletin for app bundle
storage.

!!! note
    Devnet tokens carry no monetary value, and behaviour may change between
    preview iterations.

### Polkadot app

The end-user client for the platform, available on mobile and desktop. Apps run
inside it, and the app brokers signing, storage, chain access, and identity on
the user's behalf. Installs:

- Android APK: <https://get.polkadotcommunity.foundation/android/latest.apk>
- iOS TestFlight: <https://testflight.apple.com/join/VvC8SHVE>
- Desktop: <https://polkadotcommunity.foundation/desktop/>

### dot.li

The web gateway that serves `.dot` apps in an ordinary browser. On this Devnet
it is reachable at <https://dev-dot.li>. The gateway resolves a `.dot` domain,
fetches the app bundle, and renders it in a sandboxed iframe.

## Naming and discovery

### `.dot` domain

A human-readable name, such as `survey.dot`, that maps to a deployed app bundle.
For most users it works like an app name. For developers it is the name you
register, update, and publish through DotNS tooling.

### DotNS

The `.dot` naming system. Use DotNS when you need to register an app name, point
that name at content, or look up where an app is published. See the
[naming architecture](../architecture/naming.md).

- DotNS CLI: `npm i -g @polkadot-community-foundation/dotns-cli`
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

- CDM CLI: `npm i -g @polkadot-community-foundation/cdm-cli` (bin: `cdm`)
- CDM env library: `npm i @polkadot-community-foundation/cdm-env`
- CDM Frontend: <https://contracts.dev-dot.li>

## Storage and delivery

### Bulletin

The Bulletin chain stores published web-app bundles and contract metadata.
Uploads require storage authorization, and stored content is addressed by CID.

!!! note
    Because storage is authorization-gated, a deploy account needs a live
    storage authorization before it can upload. Authorizations can expire and
    must be refreshed.

## Developer SDKs

### Product SDK

`@parity/product-sdk` is the main TypeScript SDK for building Products. It gives
your app access to host-provided wallet, chain, storage, contract, and identity
services. The SDK is designed to run inside the Polkadot app or the web gateway,
not as a standalone wallet.

```bash
npm i @parity/product-sdk
```

### Host API

`@novasamatech/host-api` is the protocol between a Product and the Polkadot app
host. Use it directly when you need lower-level access to host capabilities such
as accounts, signing, storage, chat, payments, or remote chain access.

```bash
npm i @novasamatech/host-api
```

### Deploy CLI (`pad`)

`@parity/polkadot-app-deploy` (bin: `pad`) is the CLI that publishes a built
static bundle and points a `.dot` domain at it.

```bash
npm i -g @parity/polkadot-app-deploy
```

!!! tip
    Use the `devnet` preset for this environment. `pad` and `dotns` take it with
    `--env devnet`; CDM uses `-n devnet`.

## Identity and personhood

### Proof of personhood

The mechanism by which an account is recognized as a distinct human without
revealing who they are. Lite and Full tiers can unlock product flows such as app
listing, naming, rewards, or rate limits.

### People / Asset Hub

Two of the system parachains the product suite targets. **Asset Hub** hosts
contracts, assets, and DotNS. **People** hosts identity and personhood.

## Money

### CASH

The end-user display name for a Devnet digital-dollar asset. Users can obtain
CASH through in-app flows, rewards, or supporting faucet flows, depending on the
current build.

!!! warning
    CASH is a Devnet asset with no real-world value.

## Learn more

- Product SDK: <https://www.npmjs.com/package/@parity/product-sdk>
- Host API: <https://www.npmjs.com/package/@novasamatech/host-api>
- Deploy CLI: <https://www.npmjs.com/package/@parity/polkadot-app-deploy>
- DotNS CLI: <https://www.npmjs.com/package/@polkadot-community-foundation/dotns-cli>
- CDM CLI: <https://www.npmjs.com/package/@polkadot-community-foundation/cdm-cli>
- Chain runtimes (paseo-network): <https://github.com/paseo-network/runtimes>
- Official Polkadot developer docs: <https://docs.polkadot.com>
