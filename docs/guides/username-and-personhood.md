# Username & proof of personhood

Claim a human-readable **username** in the Polkadot app and understand the
**proof-of-personhood** tier attached to it. Some features, such as reserving
certain `.dot` domains or using apps that allow only one action per person, need
that signal before they can treat an account as a distinct human.

## What a username and personhood are

A **username** is a short, readable name that stands in for your account's long
technical address — easier to share and to recognise. When you claim one, the
app registers you on the People chain as a **lite person**.

**Personhood** is the network's way of expressing "this account belongs to a
distinct human", without exposing who you are. There are two tiers:

- **Lite** — earned by registering an attested username. This is the tier most
  users reach.
- **Full** — earned through the personhood "game" or by being invited, which
  provides stronger, one-account-per-human assurance.

Apps and smart contracts can read your tier through an on-chain interface and
adjust what they offer accordingly. In practice, an app only needs to know
whether you have no personhood, Lite personhood, or Full personhood.

!!! tip "Your privacy is preserved"
    When an app checks your personhood, it does not receive your identity. It
    receives a per-application **alias** — a pseudonym unique to that one app —
    so the same person cannot be tracked or linked across different apps.

## Before you start

You need an account with a small amount of devnet funds. If you have not set
one up yet, follow [Create an account & get funds](create-account.md) first.

Download links for the app are in [More resources](../reference/resources.md).

## Claim a username

1. Open the app and go to the profile or identity section, then choose to
   **claim a username**.
2. Enter a base name. The app validates it for you and will tell you if the
   name is unavailable or does not meet the network's formatting rules.
3. The app pairs your base name with a two-digit suffix (for example,
   `alicia.07`). The suffix `00` is never used, and the app skips digits that are
   already taken, so distinct people can share the same base name. Base names
   need at least six lowercase letters.
4. Confirm. The app signs the registration request **on your device** — your
   keys never leave it. It does not submit the registration directly: instead it
   sends the signed request to the network's attester service (the identity
   backend), which vouches for you and submits it to the People chain on your
   behalf.
5. Wait for the registration to finalize on-chain. Once it does, you are a
   **lite person** and your username is live.

Behind the scenes, the app sends your signed request to the attester service,
which records your username on the People chain. Your username can also be
reflected into `.dot` naming so it works across app and discovery flows.

```mermaid
sequenceDiagram
    participant You as You (device)
    participant App as Polkadot app
    participant Attester as Attester (identity backend)
    participant People as People chain
    participant DotNS as Asset Hub (.dot domains)
    You->>App: Choose base name, confirm
    You->>App: Sign registration on device
    App->>Attester: Send signed request
    Attester->>People: Vouch & register you as a lite person
    People-->>Attester: Finalized
    Attester-->>App: Registration confirmed
    People-->>DotNS: Username can be reflected into .dot naming
```

## Reach Full personhood (optional)

Lite personhood is enough for everyday use. Some features may require **Full**
personhood, which you reach by taking part in the personhood game or by
redeeming an invitation. When you have an invitation, the app can request a
one-time ticket and use it on-chain to progress your verification. Availability
of the game and invitations can change between Devnet builds, so this step may
not be active at all times.

## Why some features need personhood

Personhood exists so that apps can offer **one-person-one-action** experiences
fairly — for example, a single vote, a single claim, or one entry per human —
rather than letting one user act many times from many accounts. Because apps
read your tier (and a privacy-preserving alias) directly from the chain, they
can enforce these limits without ever learning your identity.

Reserving a name can also be tied to your registration: claiming your username
can also reserve a matching `.dot` domain in your name when `.dot` reflection is
enabled on the current devnet build. More desirable or scarce names may be gated
behind a personhood tier, so completing this flow is what unlocks them. To learn
how naming works, see
[Register a .dot domain](register-a-dot-name.md).

## If something blocks you

- **The name is unavailable.** Try another base name or accept the suffix the app
  proposes.
- **The registration does not finalize.** Check that your account has enough PAS
  for fees.
- **Full personhood is not offered.** Lite is the expected tier for most current
  flows; Full depends on which personhood flows are active in the current build.
- **An app does not recognize your status yet.** Wait for the on-chain update to
  finalize, then reopen the app.

## Learn more

- [Identity & personhood](../architecture/identity.md) — tiers, aliases, and the precompile
- [Register a .dot domain](register-a-dot-name.md) — what a tier unlocks
