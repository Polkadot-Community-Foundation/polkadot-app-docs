# Create an account & get funds

Create or import an account in the Polkadot app, protect the recovery phrase,
and get enough devnet funds to start using Products on the Polkadot Products
Devnet.

You will need the app installed — download links are in
[More resources](../reference/resources.md).

## 1. Create or import the account

The Polkadot app is **self-custodial**: your keys are generated and stored on
your own device. The app's backend never holds your keys; every signature
happens locally after you approve it.

1. Open the app and choose to **create a new account** if you are starting
   fresh, or **import an existing account** if you already hold a recovery
   phrase.
2. If you create a new account, the app generates a fresh key pair on the
   device.
3. Follow the prompts to back up your recovery phrase. Store it somewhere you
   can recover later, but never somewhere another person or website can read it.

!!! warning "Your recovery phrase is the account"
    Anyone who holds your recovery phrase controls the account, and losing it
    means losing access. Write it down, store it offline, and never paste it
    into a website, a chat, or a support request. The Polkadot app will never
    ask you to share it.

## 2. Get devnet funds

Nothing funds a brand-new account automatically. You need two different things,
from two different places:

| What | Why | Where |
| --- | --- | --- |
| **CASH** | The balance you spend inside the app | The in-app **"+"** top-up — see [Get & use CASH](get-and-use-cash.md) |
| **Native tokens (PAS)** | Transaction fees and keeping the account alive | The [faucet](https://faucet.polkadot.io) |

The faucet does **not** give you CASH, and the in-app top-up does not give you
fees. A new account generally wants both.

## If your balance does not appear

A few common reasons a balance may not show up right away:

- **The transaction is still settling.** Funding involves an on-chain transfer
  and, for CASH, an automatic conversion step. Give it a few moments to
  finalize and refresh the balance view.
- **Account minimums and fees.** Like other Substrate-based chains, accounts
  need a small native balance to stay active and pay fees. On this Devnet, keep
  a small **PAS** balance available.

## Learn more

- [Get & use CASH](get-and-use-cash.md) — spend the balance you just funded
- [Username & proof of personhood](username-and-personhood.md) — claim a readable name
- [Money (CASH & funding)](../architecture/money.md) — the model behind the balance
