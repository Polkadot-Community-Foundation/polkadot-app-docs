# Create an account & get funds

Set up an account in the Polkadot app, keep its recovery phrase safe and get
enough devnet funds to start using apps. You need the app installed first.
Download links are in [Get the app](../reference/resources.md#get-the-app).

This page covers the account you use in the app. To deploy a Product you need a
separate CLI signing key, described in
[Set up an account](register-a-dot-name.md#set-up-an-account). A throwaway one
takes a single command.

## 1. Create or import the account

1. Open the app. It starts by asking for a username, and creates the account
   for you once you pick one. There is no separate "create account" step.
2. If you already have a recovery phrase, tap **Already using Polkadot? Recover
   here** on that same screen instead, and restore from it.
3. The app does not show you your recovery phrase on its own. Get it from
   **Settings → Security & privacy → Backup**, as described in
   [Back up & restore your account](back-up-your-account.md).

The app is self-custodial: your keys are created and stored on your own device.
The app's backend never holds them, and every signature happens on the device
after you approve it.

!!! warning "Your recovery phrase is the account"
    Anyone who holds your recovery phrase controls the account, and losing it
    means losing access. Write it down, store it offline, and never paste it
    into a website, a chat, or a support request. The Polkadot app will never
    ask you to share it.

### Log in on the desktop app

The desktop (and web) app holds no keys of its own. It pairs with your phone,
and signing stays on the phone. So set up the account on mobile first:

1. Create or import your account in the mobile app, as above.
2. Open the desktop app and scan the QR code it shows to pair the two devices.
3. If macOS asks for network options, choose **dev only**.

[The client architecture](../architecture/client.md) explains why signing
happens on the phone.

## 2. Get devnet funds

Nothing funds a new account automatically. You need two different things, from
two different places:

| What | What it is for | Where to get it |
| --- | --- | --- |
| CASH | The balance you spend inside the app | The **"+"** top-up in the app. See [Get & use CASH](get-and-use-cash.md) |
| Native tokens (PAS) | Transaction fees, and keeping the account alive | The faucet, below |

The faucet does not give you CASH, and the in-app top-up does not give you
fees. A new account usually needs both.

### Fund the account from the faucet

--8<-- "faucet.md"

A request pays 5,000 PAS and normally lands within a block or two, which is a
few seconds.

### Check the funds arrived

The app shows the balance once it refreshes. To check it yourself, open
Polkadot-JS Apps on the chain you funded
([Asset Hub](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fasset-hub-paseo-rpc.n.dwellir.com#/chainstate)
or
[People](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpeople-paseo.rotko.net#/chainstate)),
select `system` → `account`, paste your SS58 address and read `data.free`.

If it is still zero a minute later, the request went to a different chain from
the one you are using. Request again from the link for the chain you need.

Afterwards, keep a small PAS balance. As on other Substrate-based chains, an
account needs one to stay active and pay fees.

## Learn more

- [Get & use CASH](get-and-use-cash.md): spend the balance you just funded
- [Username & proof of personhood](username-and-personhood.md): claim a readable name
- [Money (CASH & funding)](../architecture/money.md): how CASH and PAS work
