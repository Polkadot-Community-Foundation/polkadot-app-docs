# Get & use CASH

CASH is the spendable balance you see inside the Polkadot app on the Polkadot
Products Devnet. It has no real-world value, but it lets you try the real user
flow: receive funds, see a balance, and send value to another account.

!!! warning "Devnet only"
    This is a public developer preview. CASH on the devnet is play money —
    it has no monetary value and cannot be redeemed for anything. Balances,
    amounts, and flows may change as the platform evolves. Never treat devnet
    funds, addresses, or backup phrases as if they were real.

## What CASH is

"CASH" is the name the app uses for the Devnet digital-dollar balance. The app
presents it as a simple spendable balance, while the platform handles the
chain-specific work behind the scenes.

For developers, the useful detail is that CASH is spent through **Coinage** on
the People chain, and the same logical asset can also be represented on Asset
Hub with asset id `50000413`. For users, the important rule is simpler: if the
CASH card shows a balance, you can use it in app payment flows.

## Get CASH

You have a few ways to acquire CASH on the devnet.

### 1. The in-app "+" top-up button (mobile)

On devnet builds the app can top your account up directly. This is the fastest
path. The desktop app has no CASH card and no top-up flow — fund your account on
the mobile app.

1. Open the Polkadot app on mobile
   ([Android APK](https://get.polkadotcommunity.foundation/android/latest.apk) or
   [iOS TestFlight](https://testflight.apple.com/join/VvC8SHVE)).
2. Open your Pocket, go to the CASH card, and tap the **"+"** (top-up) button
   next to **Get CASH**. (The **"+"** top-up button appears only on
   non-production / devnet builds.)
3. The app requests a devnet top-up and prepares the funds for spending.
4. Once the deposit settles, your CASH balance updates. You can now spend it.

!!! note "‘Get CASH’ is not the same as ‘+’"
    The labelled **Get CASH** button is different from the **"+"** top-up: it
    opens a flow to *convert* an asset you already hold into CASH (on iOS, via a
    payment card), which can take time — it is not the instant faucet. For a
    brand-new empty account, the **"+"** top-up button is the one to use.

!!! tip "You fund your account yourself"
    New accounts are not funded automatically. Tap the **"+"** top-up on the CASH
    card (devnet builds) to add test CASH, or use the faucet for native tokens to
    pay fees.

### 2. The public faucet

You can also request devnet funds from the shared Polkadot faucet at
<https://faucet.polkadot.io>. This is useful for topping up native devnet
tokens for fees alongside your CASH.

### 3. Earn it

CASH can also be earned through Devnet reward flows, such as games, judgements,
invitations, or prize events. When rewards are paid out, they appear in the same
CASH balance as funds from the top-up flow.

## Send & use CASH

Once you hold CASH you can send it to another user.

1. Open your CASH card and choose **Send CASH**.
2. Enter the recipient and the amount.
3. Review and confirm the action. The app prepares the transfer, asks for your
   approval, submits it, and waits for settlement before reporting success.

Because CASH transfers move value, always check the recipient and amount before
you approve.

!!! note "On desktop, CASH lives in chat"
    The desktop app has no CASH card or **Get CASH** button. On desktop you send
    and receive CASH inside chat conversations, not from a card. Fund your
    account on the mobile app first.

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>CASH top-up &amp; send</figcaption>
<div class="dg-seq">
  <div class="dg-seq-step"><span class="dg-actor user">You</span><span class="arr">&#8594;</span><span class="dg-actor">Polkadot app</span><span class="msg">Tap "+" top-up (devnet only)</span></div>
  <div class="dg-seq-step"><span class="dg-actor">Polkadot app</span><span class="arr">&#8594;</span><span class="dg-actor people">People chain</span><span class="msg">Request devnet funds</span></div>
  <div class="dg-seq-step"><span class="dg-actor">Polkadot app</span><span class="arr">&#8594;</span><span class="dg-actor">Polkadot app</span><span class="msg">Prepare funds for spending</span></div>
  <div class="dg-seq-step"><span class="dg-actor">Polkadot app</span><span class="arr">&#8594;</span><span class="dg-actor user">You</span><span class="msg">CASH balance shown</span></div>
  <div class="dg-seq-step"><span class="dg-actor user">You</span><span class="arr">&#8594;</span><span class="dg-actor">Polkadot app</span><span class="msg">Send CASH to a recipient</span></div>
  <div class="dg-seq-step"><span class="dg-actor">Polkadot app</span><span class="arr">&#8594;</span><span class="dg-actor people">People chain</span><span class="msg">Submit CASH transfer</span></div>
  <div class="dg-seq-step"><span class="dg-actor people">People chain</span><span class="arr">&#8594;</span><span class="dg-actor">Polkadot app</span><span class="msg">Transfer complete</span></div>
</div>
</figure>

!!! note "Where the value lives"
    Spending CASH is separate from the native token used for fees. Keep a small
    amount of native devnet funds available so your account can stay active and
    pay transaction fees.

## Learn more

- [Create an account & get funds](create-account.md)
- [Discover & open apps](discover-and-open-apps.md)
- [Polkadot faucet](https://faucet.polkadot.io)
- [Polkadot app — Android APK](https://get.polkadotcommunity.foundation/android/latest.apk)
- [Individuality runtimes (Coinage / Score / Airdrop pallets)](https://github.com/paseo-network/runtimes)
- [Polkadot Android](https://github.com/Polkadot-Community-Foundation/polkadot-android-community)
- [Polkadot developer docs](https://docs.polkadot.com)
