# Packages & tools

Which packages to install for a Product project. Your app code needs the
Product SDK, pinned to the version the hosts speak. The CLIs register names
and publish bundles.

## Developer packages

Most projects only need a few direct dependencies:

| Package | Install | Purpose | Bin |
|---------|---------|---------|-----|
| [`@parity/product-sdk`](https://www.npmjs.com/package/@parity/product-sdk) | `npm i @parity/product-sdk@0.39.0` | TypeScript SDK for building apps: multi-chain access, transactions, signing, contract calls, cloud storage, and identity. Pinned: see [Install the SDK version the hosts speak](#install-the-sdk-version-the-hosts-speak). | — |
| [`@polkadot-community-foundation/dotns-cli`](https://www.npmjs.com/package/@polkadot-community-foundation/dotns-cli) | `npm i -g @polkadot-community-foundation/dotns-cli@latest` | CLI for the `.dot` naming system: register names, set content/address records, manage reverse names and stores. | `dotns` |
| [`@polkadot-community-foundation/polkadot-app-deploy`](https://www.npmjs.com/package/@polkadot-community-foundation/polkadot-app-deploy) | `npm i -g @polkadot-community-foundation/polkadot-app-deploy@latest` | Deploy CLI: uploads a built static bundle to Bulletin, and binds it to a `.dot` domain. `pad-bootstrap` (same package) authorizes the Bulletin storage pool. | `pad`, `pad-bootstrap` |

`pad` requires Node 22+. On Node 20 it fails at startup with an
unrelated-looking error, so check `node --version` first.

Install the CLIs at their latest release, and re-run the same command to
upgrade. They carry network presets and contract addresses, and a stale copy is
the usual cause of a command that succeeds while nothing changes on chain. The
Product SDK is the one package to pin, as described below.

Both CLIs select a network preset with `--env`, and for this Devnet it is
`--env devnet`.

## Product SDK family

`@parity/product-sdk` is the main dependency for Product app code. It gives an
app access to wallet, storage, chain, contract and identity services through
the host: the Polkadot app or the web gateway. This is deliberate. Your app
should not manage private keys or build its own wallet layer.

| Package | Purpose |
|---------|---------|
| `@parity/product-sdk` | Main SDK entry point for Product apps. |
| `@parity/product-sdk-chain-client` | Typed access to the Devnet chains. |
| `@parity/product-sdk-descriptors` | Chain descriptors used by the SDK. |
| `@parity/product-sdk-signer` | Host-backed signing, plus development signers for tests. |
| `@parity/product-sdk-contracts` | Contract calls and ABI handling for PolkaVM contracts. |
| `@parity/product-sdk-cloud-storage` | Bulletin-backed content storage helpers. |
| `@parity/product-sdk-host` | Host detection and host-provided services. |

These packages live in the
[Product SDK monorepo](https://github.com/paritytech/product-sdk) and are
versioned separately. `@parity/product-sdk` pins a matching version of each, so
install them through it, not one by one.

### Install the SDK version the hosts speak

Apps talk to their host over TrUAPI. The Devnet hosts speak the TrUAPI version
that Product SDK 0.39.0 speaks, so install exactly that version:

```bash
npm i @parity/product-sdk@0.39.0
```

Newer SDK releases speak a newer TrUAPI that these hosts do not. If you add SDK
packages one by one, use the versions `@parity/product-sdk@0.39.0` depends on.

### Current Devnet chain metadata

The Devnet chains run newer runtimes than the metadata in
`@parity/product-sdk-descriptors`. For typed access to the current pallets,
swap in the Polkadot Community Foundation's build of the same package. Add it
as a dependency and as an override, with the same value in both:

=== "npm"

    ```json
    {
      "dependencies": {
        "@parity/product-sdk-descriptors": "npm:@polkadot-community-foundation/product-sdk-descriptors@0.14.0-pcf.1"
      },
      "overrides": {
        "@parity/product-sdk-descriptors": "npm:@polkadot-community-foundation/product-sdk-descriptors@0.14.0-pcf.1"
      }
    }
    ```

=== "pnpm"

    ```json
    {
      "dependencies": {
        "@parity/product-sdk-descriptors": "npm:@polkadot-community-foundation/product-sdk-descriptors@0.14.0-pcf.1"
      },
      "pnpm": {
        "overrides": {
          "@parity/product-sdk-descriptors": "npm:@polkadot-community-foundation/product-sdk-descriptors@0.14.0-pcf.1"
        }
      }
    }
    ```

Your imports stay the same (`@parity/product-sdk-descriptors/...`), and every
SDK package uses the same copy.

## Host protocol (TrUAPI)

`@parity/product-sdk-host` speaks TrUAPI to the host for you, so apps rarely
import it directly. For end-to-end tests, use the test host in
[`@parity/truapi-host`](https://www.npmjs.com/package/@parity/truapi-host); see
[Test without the real host](../guides/platform-services-sdk.md#test-without-the-real-host).
TrUAPI lives in [trinity-user-agents](https://github.com/paritytech/trinity-user-agents).

`@novasamatech/host-api`, `@novasamatech/host-api-wrapper` and
`@parity/host-api-test-sdk` do not speak the Devnet hosts' current protocol.

## Command-line tools

| CLI | Package | Bin | What it does |
|-----|---------|-----|--------------|
| Deploy | `@polkadot-community-foundation/polkadot-app-deploy` | `pad` | Publishes a built static bundle, stores it on Bulletin, and points a `.dot` domain at it. |
| Storage bootstrap | `@polkadot-community-foundation/polkadot-app-deploy` | `pad-bootstrap` | Authorizes the Bulletin storage pool `pad` uploads with, using an authorizer key. Ships in the same package as `pad`. |
| DotNS | `@polkadot-community-foundation/dotns-cli` | `dotns` | Registers and manages `.dot` domains: `register`, `lookup`, `content`, `primary`, `transfer`, `store`, `pop`, and more. |

A typical deploy binds a built bundle to a name on a chosen network:

```bash
pad ./dist my-app.dot --env devnet
```

The account `pad` deploys with must hold a live Bulletin storage authorization,
because `pad` never authorizes itself. See
[Get storage authorization](../guides/build-and-publish.md#get-storage-authorization).

## Where your app runs

Your Product runs inside the Polkadot app or the web gateway. Download links,
the deployed reference Products and source repositories are in
[More resources](./resources.md).

## Learn more

- Source: [product-sdk](https://github.com/paritytech/product-sdk) · [trinity-user-agents](https://github.com/paritytech/trinity-user-agents) (TrUAPI) · [polkadot-app-deploy](https://github.com/Polkadot-Community-Foundation/polkadot-app-deploy) · [dotns-sdk](https://github.com/Polkadot-Community-Foundation/dotns-sdk)
- [Networks & endpoints](./networks.md): which network these tools target
