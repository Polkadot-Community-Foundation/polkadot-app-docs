# Networks & endpoints

Which chain does what on the Polkadot Products Devnet, and the public endpoints
and gateways you are likely to need.

## The Devnet at a glance

The Devnet runs on the community-operated Paseo network.
[The network](../architecture/network.md) explains what each chain is
responsible for.

| Parameter | Value |
| --- | --- |
| Contract execution | `pallet-revive` on Asset Hub (PolkaVM / EVM) |
| EVM chain id | `420420417` |
| Native token | PAS, 10 decimals |
| Web gateway | `dev-dot.li` |

## How tools pick a network

All the CLIs take a network preset, but `cdm` uses a different flag name:

```bash
pad ./dist my-app.dot --env devnet      # @polkadot-community-foundation/polkadot-app-deploy
dotns ... --env devnet                  # @polkadot-community-foundation/dotns-cli
cdm ...  -n devnet                      # @polkadot-community-foundation/cdm-cli
```

For this Devnet the preset is `devnet`. A preset bundles the endpoints and
registry addresses a tool needs, so a wrong preset points the tool at the wrong
endpoints or contract addresses. Don't guess the name.

## Parachains and para IDs

Product development targets Asset Hub (1000), People (1004) and Bulletin
(1010). Other system parachains share the relay but are not part of the Product
surface.

## Public endpoints and gateways

### Web gateway

The web gateway is a client-side resolver that serves `.dot` apps over HTTPS:

- Gateway: [https://dev-dot.li](https://dev-dot.li)
- Any deployed app resolves at `https://<label>.dev-dot.li` (for example
  `https://calculator.dev-dot.li`).

### Reference apps and app installs

The deployed reference Products and the Polkadot app download links are in
[More resources](./resources.md).

### Faucet

--8<-- "faucet.md"

### Storage authorization

Publishing an app writes to the Bulletin Chain, which works by authorization,
not by fees. This is separate from the token faucet above: a deploy account
needs an authorization grant (a byte and transaction quota) before it can
upload. Grant one from the Faucet tab of the
[Bulletin Chain Console](https://paritytech.github.io/polkadot-bulletin-chain/)
after selecting the **Products Devnet** network. See
[Get storage authorization](../guides/build-and-publish.md#get-storage-authorization).

### Node RPC endpoints

The `devnet` preset already has an endpoint for each chain, so the CLIs connect
without any setup. Use the lists below when you need to point a tool or a
browser-based explorer at a chain directly, or when the endpoint a preset
picked is down.

Paseo is community-operated. Each chain is served by several independent
providers, and any single endpoint can go offline or move. If one fails, try
another from the same list. The `devnet` preset tracks a working set, so prefer
it over pasting a URL by hand.

The CLIs reconnect on their own. A run that prints several `Unable to connect`
lines normally still completes, so only switch endpoints if the command
fails.

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
- `wss://bullet.sik.rocks`
- `wss://bullet.tunastaking.eu`

#### Ethereum JSON-RPC

Contract tooling that speaks Ethereum JSON-RPC (Hardhat, `cast`, viem) needs
the ETH-RPC endpoint for Asset Hub, not a Substrate WebSocket endpoint:

- `https://eth-rpc-testnet.polkadot.io`

[Deploy & register contracts](../guides/deploy-contracts-cdm.md) covers
contract deployment.

#### Bulletin IPFS gateways

An app bundle stored on Bulletin is addressed by CID. Serving it over HTTP
takes an IPFS gateway peered to a Bulletin node. The Bulletin RPC endpoints
above do not serve `/ipfs/` themselves.

- `https://devnet-ipfs.api.polkadotcommunity.foundation`: operated by the
  Polkadot Community Foundation, and the gateway the deploy tooling uses by
  default

Tools append `/ipfs/<cid>` to this bare origin.

Contract and registry addresses are in
[Addresses & registries](./addresses.md).

## Source of the runtimes

The Paseo relay and system parachain runtimes live in
[`paseo-network/runtimes`](https://github.com/paseo-network/runtimes). Go there
to check chain-level details such as para IDs, pallets, precompiles or runtime
constants.

## Learn more

- [The network](../architecture/network.md): what each chain is responsible for
- [Addresses & registries](./addresses.md): contract addresses
