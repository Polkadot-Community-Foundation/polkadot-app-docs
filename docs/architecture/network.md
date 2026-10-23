# The network

The Polkadot Products Devnet runs on the community-operated Paseo network: a
Paseo relay chain plus a set of system parachains. Apps are built against three
of those chains: Asset Hub, People and Bulletin. This page shows what each chain
does, and how they work together when a Product is deployed and opened.

## Topology

The relay chain is the root of trust. Product flows mostly touch three system
parachains: Asset Hub for contracts and assets, People for identity and money
flows, and Bulletin for web-app bundle storage.

```mermaid
graph TD
  Relay["Paseo relay chain"]
  AH["Asset Hub (para 1000)<br/>contracts / assets / DotNS"]
  People["People (para 1004)<br/>identity + proof-of-personhood"]
  Bulletin["Bulletin (para 1010)<br/>transaction storage (web bundles)"]
  Relay --> AH
  Relay --> People
  Relay --> Bulletin
  People -->|identity and CASH signals| AH
  AH -.->|contenthash points to bundle CID| Bulletin

  %% Per-chain colour — palette lives in diagrams.css (.relayNode etc.)
  classDef relayNode stroke-width:1px;
  classDef assethubNode stroke-width:1px;
  classDef peopleNode stroke-width:1px;
  classDef bulletinNode stroke-width:1px;
  class Relay relayNode
  class AH assethubNode
  class People peopleNode
  class Bulletin bulletinNode
```

| Chain | Para ID | Role |
| --- | --- | --- |
| Relay | — | Root of trust; anchors the system parachains |
| Asset Hub | 1000 | Contracts (PolkaVM/EVM), assets, DotNS gateway |
| People | 1004 | Identity and proof-of-personhood |
| Bulletin | 1010 | Web-app content storage |

## Asset Hub <span class="dg-chip" style="--chip:var(--dg-assethub)">para 1000</span>

Asset Hub is the main chain for Product developers. It runs the contracts,
assets and naming that deployed apps use.

<div class="dg-cards" markdown="1">
<div class="dg-card" markdown="1">
**pallet-revive**
The PolkaVM smart-contract environment. DotNS and application contracts run here.
</div>
<div class="dg-card" markdown="1">
**Assets + ERC-20 precompiles**
On-chain assets available to contracts through ERC-20-style precompiles, so contracts can read and transfer supported assets without dealing with Substrate storage.
</div>
<div class="dg-card" markdown="1">
**DotNS gateway**
Connects `.dot` domains to the contract environment. See [Naming](./naming.md) for how names resolve to app bundles.
</div>
<div class="dg-card" markdown="1">
**Personhood precompile**
Contracts read a user's personhood tier through a precompile, without calling the identity backend.
</div>
</div>

## People <span class="dg-chip" style="--chip:var(--dg-people)">para 1004</span>

The People chain holds identity, proof-of-personhood and Coinage state.
Usernames are attested here, personhood status is recorded here, and CASH is
held and sent here through Coinage.

## Bulletin <span class="dg-chip" style="--chip:var(--dg-bulletin)">para 1010</span>

The Bulletin chain stores published web-app bundles that the gateway serves.

Bulletin uploads work by authorization, not by fees. Instead of charging
tokens per upload, an authorizer (Root, sibling parachains, or registered
authorizers) decides who can store data. That is why publishing an app bundle
does not cost devnet tokens.

## The deployments register

Addresses, endpoints and CIDs are network-specific. They change when a network
is redeployed, so nothing in the platform hard-codes them. Instead, each
command-line tool selects a network preset (`--env devnet` for `pad` and
`dotns`), and the preset carries the endpoints and address book for that
network.

The addresses themselves are in
[Addresses & registries](../reference/addresses.md).

## Deploy and serve flow

Here is how the three chains work together over an app's life:

```mermaid
graph LR
  Dev["App developer"]
  Revive["pallet-revive on Asset Hub<br/>(PolkaVM/EVM contract)"]
  DotNS["DotNS<br/>.dot domain + resolver"]
  Store["Bulletin transaction storage<br/>(auth-gated, CID)"]
  GW["Gateway dev-dot.li"]
  User["Polkadot app / web user"]
  Dev -->|deploy contract| Revive
  Dev -->|reserve name| DotNS
  Dev -->|upload web bundle| Store
  DotNS -->|contenthash = CID| Store
  GW -->|resolve .dot -> CID| DotNS
  User -->|https://label.dev-dot.li| GW
  User -->|contract calls| Revive

  %% Per-chain colour — palette lives in diagrams.css (.relayNode etc.)
  classDef developerNode stroke-width:1px;
  classDef assethubNode stroke-width:1px;
  classDef dotnsNode stroke-width:1px;
  classDef bulletinNode stroke-width:1px;
  classDef gatewayNode stroke-width:1px;
  classDef userNode stroke-width:1px;
  class Dev developerNode
  class Revive assethubNode
  class DotNS dotnsNode
  class Store bulletinNode
  class GW gatewayNode
  class User userNode
```

A developer deploys contracts to Asset Hub through `pallet-revive`, reserves a
`.dot` name through the DotNS gateway and uploads the web bundle to Bulletin.
The name's contenthash resolver is bound to the bundle's CID, and the gateway
at [https://dev-dot.li](https://dev-dot.li) serves the app at
`https://<label>.dev-dot.li`. The [contracts](./contracts.md) and
[naming](./naming.md) pages, and the [developer guides](../guides/index.md),
go into more detail.

## Learn more

- [paseo-network/runtimes](https://github.com/paseo-network/runtimes): the chain runtimes
- [pallet-revive](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/revive): the PolkaVM contract environment
