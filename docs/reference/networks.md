# Networks & endpoints

This page explains the network shape behind the Polkadot Products Devnet and
collects the public entry points you are likely to use. It is written for two
moments: when you need to know which chain a feature belongs to, and when you
need to find the current endpoint or gateway without digging through source.

!!! note "Endpoints get re-homed"
    Paseo endpoints are community-operated and change over time. The `devnet`
    CLI preset tracks a working set, so prefer it over pasting a URL by hand.

## The Devnet at a glance

The suite runs on the community-operated **Paseo** network. For what each chain
is responsible for, see [The network](../architecture/network.md).

| Parameter | Value |
| --- | --- |
| Contract execution | `pallet-revive` on Asset Hub (PolkaVM / EVM) |
| EVM chain id | `420420417` |
| Native token | PAS, 10 decimals |
| Web gateway | `dev-dot.li` |

## How tools target a network

The CLIs all select a network preset, but CDM uses a different flag name:

```bash
pad ./dist my-app.dot --env devnet      # @polkadot-community-foundation/polkadot-app-deploy
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
the Product surface.

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

--8<-- "faucet.md"

### Storage authorization

Publishing an app writes to the Bulletin Chain, which is **authorization-based**,
not fee-based, and separate from the token faucet above: a deploy account needs
an authorization grant (a byte / transaction quota) before it can upload. Grant
one from the **Faucet** tab of the
[Bulletin Chain Console](https://paritytech.github.io/polkadot-bulletin-chain/)
after selecting the **Products Devnet** network. See
[Get storage authorization](../guides/build-and-publish.md#get-storage-authorization).

### Node RPC endpoints

The `devnet` preset already carries an endpoint for each chain, so the CLIs
connect without configuration. Use the lists below when you need to point a tool
or a browser explorer at a chain directly, or when the endpoint a preset picked
is down.

Paseo is community-operated: each chain is served by several independent
providers, and any single endpoint can go offline or be re-homed. If one fails,
try another in the same list.

!!! tip "`Unable to connect` lines are usually retries"
    The CLIs reconnect transparently, and a run that prints several
    `Unable to connect` lines normally still completes. Only reach for a
    different endpoint if the command actually fails.

**Relay**

- `wss://paseo-rpc.n.dwellir.com`
- `wss://paseo-v2.rpc.turboflakes.io`
- `wss://rpc-paseo.stakeworld.io`
- `wss://rpc.interweb-it.com/paseo`

**Asset Hub (1000)**

- `wss://asset-hub-paseo-rpc.n.dwellir.com`
- `wss://sys.turboflakes.io/asset-hub-paseo`

**People (1004)**

- `wss://people-paseo.rotko.net`
- `wss://people-paseo.gatotech.network`
- `wss://rpc.interweb-it.com/people-paseo`

**Bulletin (1010)**

- `wss://bulletin-paseo.tservices.es:8443`
- `wss://bulletin-paseo-02.tservices.es:9443`
- `wss://bullet.sik.rocks`
- `wss://bullet.tunastaking.eu`

#### Ethereum JSON-RPC

Contract tooling that speaks Ethereum JSON-RPC (Hardhat, `cast`, viem) needs the
ETH-RPC endpoint for Asset Hub rather than a Substrate WebSocket endpoint:

- `https://paseo-assethub-rpc.laissez-faire.trade`

See [Deploy contracts with CDM](../guides/deploy-contracts-cdm.md) for how this
is used.

#### Bulletin IPFS gateways

An app bundle stored on Bulletin is addressed by CID. Serving it over HTTP takes
an IPFS gateway peered to a Bulletin node — the Bulletin RPC endpoints above do
**not** serve `/ipfs/` themselves:

- `https://devnet-ipfs.api.polkadotcommunity.foundation` — operated by the
  Polkadot Community Foundation, and the gateway the deploy tooling defaults to
- `https://bulletin-kubo.tservices.es:9443`

Tools append `/ipfs/<cid>` to these bare origins.

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
