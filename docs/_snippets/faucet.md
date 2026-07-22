Devnet funds come from the [Polkadot faucet](https://faucet.polkadot.io). It
serves several networks, so the two choices that matter are **Paseo** and the
right parachain — these links pre-select both:

| You need fees for | Use |
| --- | --- |
| Contracts, `.dot` names, publishing | [Paseo **Asset Hub** (1000)](https://faucet.polkadot.io/paseo?parachain=1000) |
| Sending CASH, usernames, personhood | [Paseo **People** (1004)](https://faucet.polkadot.io/paseo?parachain=1004) |

Paste your **SS58 address** (the one the app shows on its receive screen, or
`dotns account address` for CLI work) — not an EVM `0x…` address. The faucet
pays the native token, PAS.

!!! warning "Do not pick an *Asset Hub Next* or *People Next* chain"
    The faucet also lists **Asset Hub Next (1500)** and **People Next (1502)**.
    Those belong to a different network. Funds sent there will not appear on
    this Devnet, and the balance you are waiting for will never arrive.
