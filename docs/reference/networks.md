# Networks & endpoints

This page explains the network shape behind the Polkadot Products Devnet and
collects the public entry points you are likely to use. It is written for two
moments: when you need to know which chain a feature belongs to, and when you
need to find the current endpoint or gateway without digging through source.

!!! note "Endpoints get re-homed"
    Treat the [deployments register](#the-deployments-register) as the source of
    truth for concrete addresses and RPC endpoints.

## The Devnet at a glance

The suite runs on the community-operated **Paseo** network. For what each chain
is responsible for, see [The network](../architecture/network.md); the values
below are recorded in the deployments register.

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
dotns ... --env devnet                  # @polkadot-community-foundation/dotns-cli
cdm ...  -n devnet                      # @polkadot-community-foundation/cdm-cli
```

The preset name for this environment is **`devnet`**. A preset bundles the
endpoints and registry addresses a tool needs, which is why using the right
value matters.

!!! tip
    Do not guess a preset name. The wrong preset points at the wrong endpoints
    or contract addresses.

## Parachains and para IDs

Product development targets **Asset Hub (1000)**, **People (1004)**, and
**Bulletin (1010)**. Other system parachains share the relay but are not part of
the Product surface; the full list is in
[Addresses & registries](./addresses.md).

## Public endpoints and gateways

### Web gateway

The web gateway is a client-side resolver that serves `.dot` apps over HTTPS:

- Gateway: [https://dev-dot.li](https://dev-dot.li)
- Any deployed app resolves at `https://<label>.dev-dot.li` (for example
  `https://survey.dev-dot.li`).

### Reference apps and app installs

Deployed reference Products and the Polkadot app download links are listed in
[More resources](./resources.md).

### Faucet

Devnet accounts can be funded from the Polkadot faucet at
[https://faucet.polkadot.io](https://faucet.polkadot.io). The faucet provides
**native tokens** (for transaction fees and account existence) only.

### Storage authorization

Publishing an app writes to the Bulletin Chain, which is **authorization-based**,
not fee-based. A deploy account needs an authorization grant (a byte / transaction
quota) issued by the network's authorizer — it is not obtained from the faucet and
cannot be self-granted. Request it from the network operators, and inspect an
account's grant in the
[Bulletin Chain Console](https://paritytech.github.io/polkadot-bulletin-chain/authorizations).
See [Get storage authorization](../guides/build-and-publish.md#get-storage-authorization).

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

- [The network](../architecture/network.md) — what each chain is responsible for
- [Addresses & registries](./addresses.md) — concrete contract addresses
- [summit-net-deployments](https://github.com/paritytech/summit-net-deployments) — the register
