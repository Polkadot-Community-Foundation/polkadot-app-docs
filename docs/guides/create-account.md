# Create an account & get funds

Create or import an account in the Polkadot app, protect the recovery phrase,
and get enough devnet funds to start using Products on the Polkadot Products
Devnet.

You will need the app installed — download links are in
[Get the app](../reference/resources.md#get-the-app).

!!! note "Building an app instead?"
    This page is the **in-app** account you use as an end user. To deploy a
    Product you want a **CLI signing key**, which is set up separately — see
    [Set up an account](register-a-dot-name.md#set-up-an-account) (a throwaway
    one takes a single command).

## 1. Create or import the account

The Polkadot app is **self-custodial**: your keys are generated and stored on
your own device. The app's backend never holds your keys; every signature
happens locally after you approve it.

1. Open the app. It starts by asking for a username, and creates the account for
   you once you pick one. There is no separate "create account" step.
2. If you already have a recovery phrase, tap **Already using Polkadot? Recover
   here** on that same screen instead, and restore from it.
3. The app does not show you your recovery phrase on its own, so go and get it
   from **Settings → Security & privacy → Backup**. See
   [Back up & restore your account](back-up-your-account.md).

!!! warning "Your recovery phrase is the account"
    Anyone who holds your recovery phrase controls the account, and losing it
    means losing access. Write it down, store it offline, and never paste it
    into a website, a chat, or a support request. The Polkadot app will never
    ask you to share it.

### Log in on the desktop app

The desktop (and web) app holds no keys of its own — it is a companion that
pairs with your phone, and signing stays on the phone. So set the account up on
mobile first:

1. **Create or import your account in the mobile app** (above).
2. Open the **desktop app** and **scan the QR code** it shows to pair the two
   devices.
3. If macOS asks for network options, choose **dev only**.

See [the client architecture](../architecture/client.md) for why signing happens
on the phone.

## 2. Get devnet funds

Nothing funds a brand-new account automatically. You need two different things,
from two different places:

| What | Why | Where |
| --- | --- | --- |
| **CASH** | The balance you spend inside the app | The in-app **"+"** top-up — see [Get & use CASH](get-and-use-cash.md) |
| **Native tokens (PAS)** | Transaction fees and keeping the account alive | The faucet — below |

The faucet does **not** give you CASH, and the in-app top-up does not give you
fees. A new account generally wants both.

### Fund the account from the faucet

--8<-- "faucet.md"

A request pays 5,000 PAS and normally lands within a block or two — a few
seconds.

## Check the funds arrived

The app shows the balance once it refreshes. To confirm it independently, open
Polkadot-JS Apps against the chain you funded —
[Asset Hub](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fasset-hub-paseo-rpc.n.dwellir.com#/chainstate)
or
[People](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpeople-paseo.rotko.net#/chainstate)
— select `system` → `account`, paste your SS58 address, and read `data.free`.

If it is still zero a minute later, the request went to a different chain than
the one you are using. Request again from the link for the chain you need.

Keep a small **PAS** balance in reserve afterwards: like other Substrate-based
chains, an account needs one to stay active and pay fees.

## Learn more

- [Get & use CASH](get-and-use-cash.md) — spend the balance you just funded
- [Username & proof of personhood](username-and-personhood.md) — claim a readable name
- [Money (CASH & funding)](../architecture/money.md) — the model behind the balance
