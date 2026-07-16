# Addresses & registries

Use this page when you need a public identifier for the Polkadot Products
Devnet: a chain ID, asset ID, registry address, or contract address. The tables
below are meant to help you orient quickly, then point you back to the current
source of truth before you build anything around a fixed value.

!!! warning
    This is a public developer preview. Devnet tokens have no real value, and
    every address on this page is **network-specific** and may change when a
    network is redeployed. Treat the concrete addresses here as a snapshot of the
    current Devnet (gateway [dev-dot.li](https://dev-dot.li)); before you
    hard-code anything, read it back from the deployments register or from the
    tooling address book for the network you are targeting.

!!! note
    Only public identifiers appear here: parachain IDs, asset IDs, and contract
    addresses. Account keys, mnemonics, and seeds are never published — the
    platform signs on the device, and operator secrets live outside every source
    repository.

## The deployments register (authoritative)

The authoritative list of live addresses, CIDs, genesis hashes, RPC endpoints,
and `.dot` names is the
[`summit-net-deployments`](https://github.com/paritytech/summit-net-deployments)
register:

- **`DEVNET.md`** records the current Devnet — parachains
  1000 / 1004 / 1010, genesis hashes, RPC/ETH-RPC/IPFS endpoints, stablecoin
  asset IDs, and the live contract and app addresses reproduced below.
- **`README.md`** records the now-decommissioned Summit network, retained for
  historical reference.

When the register and this page disagree, the register wins.

## Key chains and identifiers

The suite runs on the community-operated Paseo network: a relay chain plus a set
of system parachains. Product developers usually start with **Asset Hub (para
1000)** for contracts and assets, **People (para 1004)** for identity, and
**Bulletin (para 1010)** for app bundle storage.

| Chain | Para ID | Role |
| --- | --- | --- |
| Asset Hub | `1000` | Contracts (`pallet-revive`), assets, DotNS gateway |
| Collectives | `1001` | Governance collectives |
| Bridge Hub | `1002` | Bridging |
| People | `1004` | Identity and proof-of-personhood |
| Coretime (Broker) | `1005` | Coretime |
| Bulletin | `1010` | Web-app bundle storage |
| PAssetHub | `1111` | Interim Asset Hub + contracts |

The product suite itself targets 1000 / 1004 / 1010.

| Field | Value |
| --- | --- |
| EVM chain id (Asset Hub `pallet-revive`) | `420420417` |
| Native token | PAS, 10 decimals |
| SS58 prefix (Devnet) | `42` |
| Web gateway | [dev-dot.li](https://dev-dot.li) |

The network fields above are taken from the deployments register.

## Native token and stablecoins

The end-user **CASH** display name maps to a Devnet digital-dollar asset. On
Asset Hub the protected asset ID is `50000413`; the same logical asset can be
represented on the People chain for app-facing CASH flows.

| Asset | Asset Hub u32 id | Decimals | Notes |
| --- | --- | --- | --- |
| pUSD (Digital Dollar / "CASH") | `50000413` | 6 | The main CASH asset used by the Devnet |
| USDt (Tether USD) | `1984` | 6 | |

Asset IDs and People-chain representations are recorded in the register's
`DEVNET.md`. The native token is PAS with 10 decimals; Devnet tokens carry no
value. You can obtain Devnet funds from the
[Polkadot faucet](https://faucet.polkadot.io), and some builds also auto-fund new
accounts.

## On-chain registries

Three registries make the platform's names, contracts, and apps discoverable.
They are deployed per network, so always resolve the address for the environment
you are targeting.

### DotNS (the `.dot` naming system)

DotNS resolves a `.dot` name to an app bundle and records ownership. For most
developers, the important idea is simple: a name points to content, and the
gateway uses that record to load the app.

| Contract | Devnet address |
| --- | --- |
| DotnsRegistrar (ERC-721) | `0x7f0dF075cc8B7FE7218E90fFC5a553450dB120F3` |
| DotnsRegistrarController | `0x45fDEa4Ad7b8607Fc22DBC3DBE3cD8b350F8bede` |
| DotnsRegistry | `0x527b08a640b527a3dae0C4BE04D7344E430B6E50` |
| DotnsResolver | `0xC28796526Bf3E9295f09655a1001F30f77AfCF0D` |
| DotnsReverseResolver | `0xfd2594FcF920B38A970011C486e1E3041563147F` |
| DotnsContentResolver | `0x326bdE29315199c814B1c58b431D84D16EA5cE41` |
| DotnsPopController | `0x1884819F6747576883805Cb2b7BB68d29484d1b0` |
| DotnsPopResolver | `0x92Fd4195Be40A266d2914FB64C63cC50715dB1D8` |
| PopRules | `0x2181a14081fF2D4477BAA8FB1aEB4C9c44F5F2b0` |
| DotnsNameEscrow | `0xfEdBe7a7F32017F6bCAA3109bE2EaC7D59E319E5` |
| StoreFactory | `0xD81DC23FAa69B311C1FC553Ea63798772e7D253D` |
| Multicall3 | `0x929EdB8d61461c29d07deC834ef747EbFDcf0B74` |

Some supporting DotNS contracts vary by network and are not reproduced here.
Read them from the register or the `dotns-sdk` address book when you need them.

See [Naming (DotNS)](../architecture/naming.md) for how these contracts fit
together.

### CDM `ContractRegistry`

The Contract Dependency Manager (CDM) publishes a global package-name registry
for contracts. `cdm install` and app frontends use it to resolve a contract name
to a deployed address and ABI.

| Registry | Address |
| --- | --- |
| `ContractRegistry` (Devnet) | `0x59b0245778917af55224e5f8fb55f7f8d452619f` |

Shared system contracts registered in it:

| CDM name | Address |
| --- | --- |
| `@polkadot/contexts` | `0x9B935075094D7176Afc7e33C5B183109B86B1b6A` |
| `@polkadot/profiles` | `0x99dAFFC69479297C30815e3a27746f81632dfea1` |
| `@polkadot/threads` | `0xFa1AB6B6aCBb056F5D9952EEDC5C67F1F3162f3A` |
| `@mock/reputation` | `0x94a9099379EeA0C5093F93E9934a7f6605E7922f` |

These are the kind of values you should read back from the on-chain registry or
the deployments register rather than hard-code. See
[Smart contracts & CDM](../architecture/contracts.md).

### Browse `Publisher`

Browse is the app-discovery directory. `Publisher` records which `.dot` apps are
discoverable; display metadata lives in DotNS records.

| Contract | Devnet address |
| --- | --- |
| Publisher | `0xaab42efbe8ea4d4228c3a11e973f94c17b9a0f2c` |

Browse also reads attestation-resolver contracts for compliance badges. Those
addresses are network-specific, so read them from the register or the Browse
address book for the network you target. See
[App discovery (Browse)](../architecture/discovery.md).

### Attestation protocol

An EAS-style attestation suite (`SchemaRegistry` + `AttestationService`) provides
general, permissionless attestations used by Browse compliance badges and other
consumers. Both contracts run on Asset Hub via `pallet-revive`.

The concrete `SchemaRegistry` and `AttestationService` addresses are
network-specific and are not reproduced here — read them from the register's
`DEVNET.md` or from the
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
When you need a value directly, read it from the deployments
register rather than assuming it.

## Sources

- Deployments register (authoritative): <https://github.com/paritytech/summit-net-deployments>
- Chain runtimes (parachains, assets, precompiles): <https://github.com/paseo-network/runtimes>
- DotNS contracts and SDK: <https://github.com/paritytech/dotns> · <https://github.com/paritytech/dotns-sdk>
- CDM (`ContractRegistry`): <https://github.com/paritytech/contract-dependency-manager>
- Browse (`Publisher`): <https://github.com/paritytech/browse>
- Attestation protocol: <https://github.com/paritytech/attestation-protocol>
- Devnet faucet: <https://faucet.polkadot.io>
- Polkadot developer documentation: <https://docs.polkadot.com>
