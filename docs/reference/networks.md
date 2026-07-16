# Networks & endpoints

This page explains the network shape behind the Polkadot Products Devnet and
collects the public entry points you are likely to use. It is written for two
moments: when you need to know which chain a feature belongs to, and when you
need to find the current endpoint or gateway without digging through source.

!!! note
    This is a public developer preview. Devnet tokens have no real value, flows
    may still change, and endpoints can be re-homed. Treat the
    [deployments register](#the-deployments-register) as the source of truth for
    concrete addresses and RPC endpoints, and never paste secrets (mnemonics,
    seed phrases, private keys) into any tool or page.

## The Devnet at a glance

The Polkadot Products Devnet is a public developer preview that runs on the
community-operated **Paseo** network: a Paseo relay chain plus a set of system
parachains. Applications are built against three of those chains — **Asset Hub**,
**People**, and **Bulletin**. End users reach deployed apps through the Polkadot
app (mobile and desktop) or the web gateway at
[https://dev-dot.li](https://dev-dot.li).

The values below are recorded in the deployments register.

| Parameter | Value |
| --- | --- |
| Contract execution | `pallet-revive` on Asset Hub (PolkaVM / EVM) |
| EVM chain id | `420420417` |
| Native token | PAS, 10 decimals |
| Web gateway | `dev-dot.li` |

## How tools target a network

The CLIs all select a network preset, but CDM uses a different flag name:

```bash
pad ./dist my-app.dot --env devnet      # @parity/polkadot-app-deploy
dotns ... --env devnet                  # @parity/dotns-cli
cdm ...  -n devnet                      # @polkadot-community-foundation/cdm-cli
```

The preset name for this environment is **`devnet`**. A preset bundles the
endpoints and registry addresses a tool needs, which is why using the right
value matters.

!!! tip
    Do not guess a preset name. The wrong preset points at the wrong endpoints
    or contract addresses.

## Parachains and para IDs

The product suite mainly targets three parachains:

| Chain | Para ID | Role for app developers |
| --- | --- | --- |
| Asset Hub | 1000 | Contracts (`pallet-revive`, PolkaVM/EVM), assets, DotNS gateway |
| People | 1004 | Identity and proof-of-personhood |
| Bulletin | 1010 | Web-app content storage (auth-gated, no token cost) |

Other system parachains exist on the same relay, but they are not part of the
main Product development surface. If you are building an app, start with Asset
Hub, People, and Bulletin.

## Public endpoints and gateways

### Web gateway

The web gateway is a client-side resolver that serves `.dot` apps over HTTPS:

- Gateway: [https://dev-dot.li](https://dev-dot.li)
- Any deployed app resolves at `https://<label>.dev-dot.li` (for example
  `https://survey.dev-dot.li`).

### Reference apps

These first-party apps run on the Devnet and are useful for exploring the
platform:

| App | URL |
| --- | --- |
| Browse (app directory) | [https://browse.dev-dot.li](https://browse.dev-dot.li) |
| DotNS UI | [https://dotns.dev-dot.li](https://dotns.dev-dot.li) |
| CDM Frontend | [https://contracts.dev-dot.li](https://contracts.dev-dot.li) |
| Playground template | [https://playground-template.dev-dot.li](https://playground-template.dev-dot.li) |
| Simple Survey | [https://survey.dev-dot.li](https://survey.dev-dot.li) |

### App installs

To use the Devnet as an end user, install the Polkadot app:

| Platform | Link |
| --- | --- |
| Android (Google Play) | [play.google.com/store/apps/details?id=io.pcf.polkadotapp](https://play.google.com/store/apps/details?id=io.pcf.polkadotapp) |
| Android (APK) | [get.polkadotcommunity.foundation/android/latest.apk](https://get.polkadotcommunity.foundation/android/latest.apk) |
| iOS (TestFlight) | [testflight.apple.com/join/VvC8SHVE](https://testflight.apple.com/join/VvC8SHVE) |
| Desktop | [polkadotcommunity.foundation/desktop/](https://polkadotcommunity.foundation/desktop/) |

### Faucet

Devnet accounts can be funded from the Polkadot faucet at
[https://faucet.polkadot.io](https://faucet.polkadot.io). Some Devnet builds also
auto-fund newly created accounts, so you may not need the faucet for a first run.

### Node RPC endpoints

RPC, ETH-RPC, and IPFS-gateway endpoints can change over time, so this page does
not hard-code them. The current values are recorded in the deployments register
alongside the genesis hashes for each chain. Read them from there when you need
to configure a tool or debug a network issue.

## The deployments register

Concrete addresses, endpoints, genesis hashes, stablecoin asset IDs, and app CIDs
are recorded in the
[`summit-net-deployments`](https://github.com/paritytech/summit-net-deployments)
register, not in this documentation:

- `DEVNET.md` records the current public **Devnet**: para IDs, genesis
  hashes, RPC / ETH-RPC / IPFS endpoints, the gateway, stablecoin asset IDs, and
  live DotNS, CDM, and app addresses.
- `README.md` records the now-decommissioned **Summit** network (EVM chain id
  `420420417`, token SUM at 10 decimals, RPC
  `wss://summit-asset-hub-rpc.polkadot.io`), kept for historical reference.

For a curated list of the contract and registry addresses, see the
[Addresses & registries](./addresses.md) reference page.

## Source of the runtimes

The Paseo relay and system parachain runtimes live in
[`paseo-network/runtimes`](https://github.com/paseo-network/runtimes). Use that
repository when you need to verify chain-level details such as para IDs, pallets,
precompiles, or runtime constants.

## Learn more

- [Network architecture](../architecture/network.md)
- [Packages & tools](./packages.md)
- [Addresses & registries](./addresses.md)
- [paseo-network/runtimes — chain runtimes](https://github.com/paseo-network/runtimes)
- [summit-net-deployments — deployments register](https://github.com/paritytech/summit-net-deployments)
- [Polkadot developer documentation](https://docs.polkadot.com)
- [Web gateway (public developer preview)](https://dev-dot.li)
