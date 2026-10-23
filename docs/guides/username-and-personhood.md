# Username & proof of personhood

A username is a short, readable name that stands in for your account's long
address, so it is easier to share and to recognise. Claiming one also gives
your account proof of personhood. Some features need that, such as reserving
certain `.dot` domains or using apps that allow only one action per person.

## What personhood means

Personhood tells apps that an account belongs to a distinct human, without
saying who that human is. There are two tiers:

- Lite: you get it by registering an attested username. Most users have this
  tier.
- Full: you get it by redeeming an invitation. It gives a stronger guarantee of
  one account per human.

Apps and smart contracts can read your tier on-chain and change what they offer
based on it. An app only needs to know whether you have no personhood, Lite
personhood or Full personhood.

When an app checks your personhood, it does not learn your identity. It gets an
alias: a pseudonym unique to that one app. So the same person cannot be
tracked or linked across different apps.

## Before you start

You need an account with a small amount of devnet funds. If you don't have one
yet, follow [Create an account & get funds](create-account.md) first.

Download links for the app are in
[Get the app](../reference/resources.md#get-the-app).

## Claim a username

1. Open the app, go to the profile or identity section, and choose to claim a
   username.
2. Enter a base name. Base names need at least six lowercase letters. The app
   checks the name and tells you if it is unavailable or does not meet the
   network's formatting rules.
3. The app adds a two-digit suffix to your base name, for example `alicia.07`.
   The suffix `00` is never used, and the app skips digits that are already
   taken, so different people can share the same base name.
4. Confirm. The app signs the registration request on your device, and your
   keys never leave it. It does not submit the registration itself. It sends
   the signed request to the network's attester service (the identity
   backend), which vouches for you and submits it to the People chain on your
   behalf.
5. The attester queues the request before submitting it, so the username
   appears a few seconds after you confirm. Once it is on-chain, you are a lite
   person and your username is live.

## Reach Full personhood (optional)

Full personhood needs an invitation. The app redeems a one-time invitation
voucher, which then moves your verification forward on-chain. You can't request
a voucher yourself. The team hands them out directly, for example as a QR code
at an event. Without one, your tier is Lite.

That is expected, and nothing is wrong. Lite covers every user flow in these
guides. The only thing Full adds is claiming a `.dot` name with a
six-to-eight-character stem and no digits (see
[Reserved and short-name gating](register-a-dot-name.md#reserved-and-short-name-gating)).

## Why some features need personhood

Personhood lets apps offer one-person-one-action experiences fairly, such as a
single vote, a single claim or one entry per human. Without it, one user could
act many times from many accounts. Apps read your tier, and your alias for that
app, directly from the chain, so they can enforce these limits without learning
who you are.

Claiming a username can also mirror it into `.dot` naming, so the same name
works across app and discovery flows. Operator-run infrastructure does this,
not a transaction of your own. To see whether yours
was mirrored, search the name in the [DotNS UI](https://dotns.dev-dot.li).
Nothing else about your account depends on it. Short names are the ones a tier
unlocks: see [Register a .dot domain](register-a-dot-name.md).

## If something blocks you

- The name is unavailable: try another base name, or accept the suffix the app
  proposes.
- The registration does not finalize: check that your account has enough PAS
  for fees.
- Full personhood is not offered: that is expected without an invitation
  voucher. These guides assume Lite.
- An app does not recognize your status yet: wait for the on-chain update to
  finalize, then reopen the app.

## Learn more

- [Identity & personhood](../architecture/identity.md): tiers, aliases and the precompile
- [Register a .dot domain](register-a-dot-name.md): what a tier unlocks
