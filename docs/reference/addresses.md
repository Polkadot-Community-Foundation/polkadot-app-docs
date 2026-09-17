# Addresses & registries

Use this page when you need a public identifier for the Polkadot Products
Devnet: a chain ID, asset ID, registry address, or contract address. The tables
below are meant to help you orient quickly, then point you back to the current
source of truth before you build anything around a fixed value.

!!! warning "Every address here is a snapshot"
    Addresses are **network-specific** and change when a network is redeployed.
    Before you hard-code one, read it back from the `devnet` preset in the
    tooling address book, or resolve it on chain.

!!! note
    Only public identifiers appear here: parachain IDs, asset IDs, and contract
    addresses. Account keys, mnemonics, and seeds are never published — the
    platform signs on the device, and operator secrets live outside every source
    repository.

## Key chains and identifiers

The suite runs on the community-operated Paseo network: a relay chain plus a set
of system parachains. Product developers usually start with **Asset Hub (para
1000)** for contracts and assets, **People (para 1004)** for identity, and
**Bulletin (para 1010)** for app bundle storage.

| Chain | Para ID | Role |
| --- | --- | --- |
| Asset Hub | `1000` | Contracts (`pallet-revive`), assets, DotNS gateway |
| People | `1004` | Identity and proof-of-personhood |
| Bulletin | `1010` | Web-app bundle storage |

The product suite itself targets 1000 / 1004 / 1010.

| Field | Value |
| --- | --- |
| EVM chain id (Asset Hub `pallet-revive`) | `420420417` |
| Native token | PAS, 10 decimals |
| SS58 prefix (Devnet) | `42` |
| Web gateway | [dev-dot.li](https://dev-dot.li) |

## Native token and stablecoins

The end-user **CASH** display name maps to a Devnet digital-dollar asset. On
Asset Hub the protected asset ID is `50000413`; the same logical asset can be
represented on the People chain for app-facing CASH flows.

| Asset | Asset Hub u32 id | Decimals | Notes |
| --- | --- | --- | --- |
| pUSD (Digital Dollar / "CASH") | `50000413` | 6 | The main CASH asset used by the Devnet |
| USDt (Tether USD) | `1984` | 6 | |

The native token is PAS with 10 decimals; Devnet tokens carry no
value. You can obtain Devnet funds from the
[Polkadot faucet](https://faucet.polkadot.io).

## On-chain registries

Three registries make the platform's names, contracts, and apps discoverable.
They are deployed per network, so always resolve the address for the environment
you are targeting.

### DotNS (the `.dot` naming system)

DotNS resolves a `.dot` domain to an app bundle and records ownership. For most
developers, the important idea is simple: a name points to content, and the
gateway uses that record to load the app.

| Contract | Devnet address |
| --- | --- |
| DotnsRegistrar (ERC-721) | `0x0E05e0E2576DDD1C339d360Aa634fE52CBa7Ee45` |
| DotnsRegistrarController | `0x77556F42DF5db7f89c2eCD00446041F16781011E` |
| DotnsRegistry | `0x38cf3dE5877a18157f4C1a4e067F84956F582b31` |
| DotnsResolver | `0x57c10bc51bC59B93b6F2C165C62daFa92C34A8a9` |
| DotnsReverseResolver | `0x992c7C87967897b0F9336de640d9f66A5af76f73` |
| DotnsContentResolver | `0x444578659848ba38D1825238f10B8D75522d278f` |
| DotnsPopController | `0xB25510B665ad82291bc1552E94005013a025c42b` |
| DotnsPopResolver | `0xE841BaEaDac51d301BCb82162d3B10918b60D158` |
| PopRules | `0xB991Bc0C5Ff4B4c7f3634bfC74e0E20F74D59554` |
| DotnsNameEscrow | `0xCbf524C2E8ebC43FDE09C9A02632A4Fe03290524` |
| StoreFactory | `0x59aAF46797A549455697B6f046B4dE16b92670fd` |
| Multicall3 | `0x55985d2Cfdac95DD828bd3Aa0e031602a07a9049` |

Some supporting DotNS contracts vary by network and are not reproduced here.
Read them from the `dotns-sdk` address book for the `devnet` preset when you
need them.

See [Naming (DotNS)](../architecture/naming.md) for how these contracts fit
together.

### CDM `ContractRegistry`

The Contract Dependency Manager (CDM) publishes a global package-name registry
for contracts. `cdm install` and app frontends use it to resolve a contract name
to a deployed address and ABI.

| Registry | Address |
| --- | --- |
| `ContractRegistry` (Devnet) | `0x05662b3dbd5dd9f2ff92d67630477e84b0b37c1f` |

Shared system contracts registered in it:

| CDM name | Address |
| --- | --- |
| `@polkadot/contexts` | `0x65317D46e8F62682002F9A769F7Bd8d63f8100Ba` |
| `@polkadot/profiles` | `0xaFa90438a1cBEd95A1fbA380226b27226e36C71B` |
| `@polkadot/threads` | `0x9F8c47b542856ABDa30F665eE4c7071444E39f50` |
| `@mock/reputation` | `0xa92964b3D49953086D01124cE0508932519edaDD` |

These are the kind of values you should resolve from the on-chain
`ContractRegistry` rather than hard-code. See
[Smart contracts & CDM](../architecture/contracts.md).

### Browse `Publisher`

Browse is the app-discovery directory. `Publisher` records which `.dot` apps are
discoverable; display metadata lives in DotNS records.

| Contract | Devnet address |
| --- | --- |
| Publisher | `0xaab42efbe8ea4d4228c3a11e973f94c17b9a0f2c` |

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

An EAS-style attestation suite (`SchemaRegistry` + `AttestationService`) provides
general, permissionless attestations used by Browse compliance badges and other
consumers. Both contracts run on Asset Hub via `pallet-revive`.

The concrete `SchemaRegistry` and `AttestationService` addresses are
network-specific and are not reproduced here — read them from the
[`attestation-protocol`](https://github.com/paritytech/attestation-protocol)
deployment records for the network you target.

## Runtime precompiles

Some capabilities are exposed to contracts at fixed precompile addresses rather
than as deployed contracts:

| Precompile | Address | Purpose |
| --- | --- | --- |
| Personhood | `0x000000000000000000000000000000000a010000` | `personhoodStatus(address, bytes32 context)` → tier + per-app alias |

See [Identity & personhood](../architecture/identity.md) for how this is used by
Product flows.

## How addresses are resolved by tooling

You rarely paste these addresses by hand. CLIs select the `devnet` network
preset (`--env devnet` for `pad` and `dotns`, `-n devnet` for CDM), and that
preset carries the RPC endpoints and the full address book. Apps and
frontends resolve names to addresses at runtime through the registries above.
When you need a value directly, read it from the preset rather than assuming it.

## Sources

- [paseo-network/runtimes](https://github.com/paseo-network/runtimes) — parachains, assets, precompiles
- Contract source: [dotns](https://github.com/paritytech/dotns) · [CDM](https://github.com/paritytech/contract-dependency-manager) · [browse](https://github.com/paritytech/browse) · [attestation-protocol](https://github.com/paritytech/attestation-protocol) · [AccountDataStore](https://github.com/paritytech/polkadot-mobile-datastore-contract-community)
