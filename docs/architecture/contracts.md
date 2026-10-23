# Smart contracts

Smart contracts on the Polkadot Products Devnet run on PolkaVM (PVM) through
`pallet-revive` on Asset Hub. They are PolkaVM bytecode with Solidity-style
ABIs.

## Where contracts run

`pallet-revive` is the smart-contract environment on Asset Hub (para 1000).
DotNS and application contracts run there. The EVM chain id is `420420417`, and
contract tooling that speaks Ethereum JSON-RPC (Hardhat, `cast`, viem) uses the
ETH-RPC endpoint listed in
[Networks & endpoints](../reference/networks.md#ethereum-json-rpc).

Contracts can also read platform state through precompiles at fixed addresses.
The personhood precompile returns an account's personhood tier and a per-app
alias (see [Identity & personhood](identity.md)), and ERC-20-style precompiles
let contracts read and transfer supported assets.

An account has to be mapped to its EVM address before it can sign PolkaVM
transactions on Asset Hub. An unmapped account fails on its first one.

## Calling contracts from an app

At runtime, apps make typed calls with `@parity/product-sdk-contracts`, which
is part of the [Product SDK](../reference/packages.md#product-sdk-family). You
build a runtime from the Asset Hub chain client, then a contract handle from
the contract's address and ABI. Read-only `.query()` calls need no account, and
`.tx()` calls are signed through the host wallet.
`ensureContractAccountMapped` maps an account for `pallet-revive` when a call
needs it.
[Use platform services from the SDK](../guides/platform-services-sdk.md#call-smart-contracts)
shows the code.

Never print or commit signing seeds. Fund an account that sends contract
transactions from the network faucet at <https://faucet.polkadot.io>.

## Common blockers

- The account is not mapped: map it once with `dotns account map --env devnet`,
  or call `ensureContractAccountMapped` from your app.
- The account has no funds: get PAS from the faucet.

## Learn more

- [pallet-revive](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/revive): the PolkaVM contract environment
- [Use platform services from the SDK](../guides/platform-services-sdk.md#call-smart-contracts): call a contract from your app
- [Identity & personhood](identity.md): the personhood precompile
