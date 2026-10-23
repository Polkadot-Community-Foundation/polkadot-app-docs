# Get & use CASH

CASH is the balance you spend in the Polkadot app. On the Devnet it has no
real-world value, but you use it the same way: you top it up, see the balance
and send it to other people.

## Before you start

- An account in the Polkadot app. If you don't have one yet, see
  [Create an account & get funds](create-account.md).
- The mobile app. The top-up button is only in the mobile app (devnet builds).
  The desktop app has no CASH card.
- Some PAS for fees, if you want to send CASH. Topping up with the **"+"**
  button costs nothing, but sending or spending CASH is an on-chain transaction
  on the People chain, and that needs a small amount of PAS for the fee. Get it
  from the faucet, as described in
  [Fund the account from the faucet](create-account.md#fund-the-account-from-the-faucet).

## What CASH is

"CASH" is the app's name for the Devnet digital-dollar balance. The app shows it
as a single balance and does the chain-specific work for you. If the CASH card
shows a balance, you can use it in app payment flows.

If you are a developer: CASH is spent through Coinage on the People chain, and
the same logical asset can also be represented on Asset Hub with asset id
`50000413`.

## Get CASH

### Top up in the app (mobile)

Devnet builds of the app can top up your account directly. This is the fastest
way to get CASH.

1. Open the Polkadot app on Android or iOS.
2. Open your Pocket, go to the CASH card and tap the **"+"** (top-up) button
   next to **Get CASH**. The button only appears on non-production (devnet)
   builds.
3. The app requests a devnet top-up and prepares the funds for spending.
4. The deposit settles in a few seconds and the CASH card shows the new
   balance. If it has not changed after a minute, reopen the Pocket to refresh
   the view and tap **"+"** again.

New accounts are not funded automatically, so you do this yourself. The faucet
is a separate step, and it pays PAS for fees, not CASH.

### Earn it

You can also earn CASH through Devnet reward flows, such as games, judgements,
invitations or prize events. Rewards land in the same CASH balance as top-ups.

## Send CASH

1. Open your CASH card and choose **Send CASH**.
2. Enter the recipient and the amount.
3. Check both, then confirm. The app prepares the transfer, asks for your
   approval, submits it and waits for it to settle before it reports success.

The desktop app has no CASH card and no **Get CASH** button. On desktop you
send and receive CASH inside chat conversations. Top up on the mobile app
first.

Keep a small amount of PAS on the account as well. CASH does not pay fees, and
the account needs PAS to stay active and pay transaction fees.

## Learn more

- [Create an account & get funds](create-account.md)
- [Money (CASH & funding)](../architecture/money.md): why CASH and PAS are separate
