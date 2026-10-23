# Addresses & registries

Public identifiers for the Polkadot Products Devnet: chain IDs, asset IDs,
registry addresses and contract addresses. Each section says where to read the
current value before you build anything around it.

!!! warning "Every address here is a snapshot"
    Addresses are network-specific and change when a network is redeployed.
    Before you hard-code one, read it back from the `devnet` preset in the
    tooling address book, or resolve it on chain.

Only public identifiers appear here. Account keys, mnemonics and seeds are
never published: the platform signs on the device, and operator secrets live
outside every source repository.

## Key chains and identifiers

The Devnet runs on the community-operated Paseo network: a relay chain plus a
set of system parachains. Product developers usually start with Asset Hub (para
1000) for contracts and assets, People (para 1004) for identity, and Bulletin
(para 1010) for app bundle storage.

| Chain | Para ID | Role |
| --- | --- | --- |
| Asset Hub | `1000` | Contracts (`pallet-revive`), assets, DotNS gateway |
| People | `1004` | Identity and proof-of-personhood |
| Bulletin | `1010` | Web-app bundle storage |

| Field | Value |
| --- | --- |
| EVM chain id (Asset Hub `pallet-revive`) | `420420417` |
| Native token | PAS, 10 decimals |
| SS58 prefix (Devnet) | `42` |
| Web gateway | [dev-dot.li](https://dev-dot.li) |

## Native token and stablecoins

CASH, the balance users see in the app, is a Devnet digital-dollar asset. On
Asset Hub its asset ID is `50000413`. The same logical asset can be represented
on the People chain for app-facing CASH flows.

| Asset | Asset Hub u32 id | Decimals | Notes |
| --- | --- | --- | --- |
| pUSD (Digital Dollar / "CASH") | `50000413` | 6 | The main CASH asset used by the Devnet |
| USDt (Tether USD) | `1984` | 6 | |

The native token is PAS, with 10 decimals. Devnet tokens carry no value. You
can get Devnet funds from the [Polkadot faucet](https://faucet.polkadot.io).

## On-chain registries

Two registries make the platform's names and apps discoverable. Each network
has its own deployment, so always resolve the address for the network you are
targeting.

### DotNS (the `.dot` naming system)

DotNS records who owns a `.dot` domain and which app bundle it points to. The
gateway reads that record to load the app.

Devnet runs DotNS v1.0.0 (`protocolVersion()` on `DotnsProtocolRegistry`).

| Contract | Devnet address |
| --- | --- |
| DotnsProtocolRegistry | `0xdDF3D3838Ff056F15602fC5a65927f185679C36F` |
| DotnsRegistrar (ERC-721) | `0xc609e0c2DAB4433d55a32FB098Db8788C1956302` |
| DotnsRegistrarController | `0x59dcF8BfFFa7239243785C3fC336D8Bb22312e8c` |
| DotnsRegistry | `0xb052E5EfC5ADEff1f21d48DEfb5169Cb394A1a73` |
| DotnsResolver | `0xFcB74C073a2d14dc65B178Bb873f4dE51318DDC2` |
| DotnsReverseResolver | `0x736e067290AE71f841399575ABfc8b2BAA5Eed7E` |
| DotnsContentResolver | `0x7e75491ecfb04900EB05ee63CABA2B33900aABB5` |
| DotnsPopController | `0xC3a3EdAb753F91488fD84E6134b5b0325dc22452` |
| DotnsPopResolver | `0x398912c9bb03180Ff049f0E034FE2E0024fb8406` |
| PopRules | `0xD5Ee34610F06f7FF4668aB4fabE2393B65a43AE7` |
| DotnsNameEscrow | `0xb50269322010DeeF2afb162c009Caf897971952C` |
| StoreFactory | `0x5Df012daA06cA2602DA153309C2E3A83284Cb879` |
| Multicall3 | `0x92640655c5c7ee7E42F0B5aD68D205a8A767b81C` |

Some supporting DotNS contracts vary by network and are not listed here. Read
them from `DotnsProtocolRegistry` (`get(key)`) or from the `dotns-sdk` address
book for the `devnet` preset when you need them.

See [Naming (DotNS)](../architecture/naming.md) for how these contracts fit
together.

### Browse `Publisher`

Browse is the app-discovery directory. `Publisher` records which `.dot` apps are
discoverable; display metadata lives in DotNS records.

| Contract | Devnet address |
| --- | --- |
| Publisher | `0x8d3CE7Bb2ED68C06306b4C1d5EEe79435AAE0A10` |

Browse also reads attestation-resolver contracts for compliance badges. Those
addresses are network-specific, so read them from the Browse address book for
the network you target. See
[App discovery (Browse)](../architecture/discovery.md).

### Polkadot app `AccountDataStore`

`AccountDataStore` is the contract the Polkadot app uses to back up coinage
installations. Each install stores a small, client-encrypted record under the
account's own address, so restoring the same recovery phrase on a new device can
find coins held by earlier installs. The contract has no owner or admin, and
only the device holding the key can read a record's contents.

| Contract | Devnet address |
| --- | --- |
| AccountDataStore | `0x58c9963308c7735cf72ab633e8a9d892f5ab9e05` |

### Attestation protocol

An EAS-style attestation suite (`SchemaRegistry` + `AttestationService`)
provides general, permissionless attestations, used by Browse compliance badges
and others. Both contracts run on Asset Hub via `pallet-revive`.

The `SchemaRegistry` and `AttestationService` addresses are network-specific
and are not listed here. Read them from the
[`attestation-protocol`](https://github.com/paritytech/attestation-protocol)
deployment records for the network you target.

## Runtime precompiles

Some capabilities are available to contracts at fixed precompile addresses,
not as deployed contracts:

| Precompile | Address | Purpose |
| --- | --- | --- |
| Personhood | `0x000000000000000000000000000000000a010000` | `personhoodStatus(address, bytes32 context)` → tier + per-app alias |

[Identity & personhood](../architecture/identity.md) explains how Products use
it.

## How addresses are resolved by tooling

You rarely paste these addresses by hand. The CLIs select the `devnet` network
preset (`--env devnet`), and that preset carries the RPC endpoints and the full
address book. Apps and frontends resolve names to addresses at runtime through
the registries above. When you need a value directly, read it from the preset
instead of assuming it.

## Sources

- [paseo-network/runtimes](https://github.com/paseo-network/runtimes): parachains, assets, precompiles
- Contract source: [dotns](https://github.com/paritytech/dotns) · [browse](https://github.com/paritytech/browse) · [attestation-protocol](https://github.com/paritytech/attestation-protocol) · [AccountDataStore](https://github.com/paritytech/polkadot-mobile-datastore-contract-community)
