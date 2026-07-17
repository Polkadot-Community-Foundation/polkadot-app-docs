# Register a .dot domain

A `.dot` domain is a human-readable handle on the Polkadot Products Devnet. It maps to
an owner account and, optionally, to an application bundle — so that visiting
`your-app.dot` in the [Polkadot app](../reference/resources.md) or the
[web gateway](https://dev-dot.li) loads your app.

You can register and manage names with the DotNS CLI (`@polkadot-community-foundation/dotns-cli`).
Short and reserved names have extra gates; ordinary app names follow the normal
registration path. The same reads and lookups are available from the
[DotNS reference UI](https://dotns.dev-dot.li).

Owning a name means owning an ERC-721 token; binding it to an app means writing
an IPFS content hash into its resolver, which clients then read to fetch your
bundle. For the resolution path and contract topology, see
[Naming (DotNS)](../architecture/naming.md).

## Install the CLI

```bash
npm i -g @polkadot-community-foundation/dotns-cli
# provides the `dotns` command
```

Every command takes a network via `--env devnet` (or the `DOTNS_ENV` environment
variable).

## Set up an account

The CLI keeps its **own** keystore, separate from any account in the Polkadot
app. Configure it **before** you register anything — store a mnemonic once, then
reference it by name:

```bash
# Encrypt and store a mnemonic (or key-uri) into the keystore
dotns auth set

# Confirm which account is active
dotns account address
dotns account info --env devnet
```

!!! danger "Without a keystore you sign with a shared public account"
    If you have not run `dotns auth set` — and have set neither `DOTNS_MNEMONIC`
    nor `DOTNS_KEY_URI` — `dotns` falls back to a **shared public dev account
    that anyone can control**, and prints a warning saying exactly that on every
    command. A `.dot` name registered from that account is **not yours**: anyone
    can transfer it away. Always configure your own key first.

Registration signs a PolkaVM transaction, so your account needs a mapped EVM address
and a small devnet balance:

```bash
# Map your Substrate account to its EVM address (once per account)
dotns account map --env devnet

# Check whether an address is already mapped
dotns account is-mapped <address> --env devnet
```

!!! note
    `dotns account is-mapped` checks the **address you pass in**. Its connection
    banner still announces the CLI's default signer, so it may show the shared
    dev account even when your keystore is configured — the authoritative answer
    is the `mapped:` line for the address you asked about, not the banner.

If your account has no balance, request devnet funds from the
[faucet](https://faucet.polkadot.io).

## Reserved and short-name gating

Not every label is openly registrable. The public commit-reveal path enforces a
minimum label length of three characters, and labels are classified by their *stem*
(the label with trailing digits stripped):

- **Reserved** — stems of five characters or fewer are gated and cannot be claimed
  through the open path.
- **Personhood-gated** — six-to-eight-character stems require proof of personhood
  (a "lite" tier for a stem plus exactly two digits, a "full" tier for no digits).
- **Open** — stems of nine characters or more register without a personhood check.

Governance-reserved and explicitly reserved names are rejected by the controller.
Personhood-tier usernames are issued through the gateway path when you prove personhood
in the Polkadot app, not through the CLI commands below.

!!! tip
    If you just want a name for an app, pick a label with a stem of nine or more
    characters (for example `my-cool-app`) to stay on the open path and avoid the
    personhood gate.

## Register a name

Registration uses a commit-reveal handshake: you commit a hashed intent, wait a minimum
commitment age, then reveal and pay. The CLI orchestrates all three steps:

```bash
dotns register domain -n my-cool-app --env devnet
```

Useful options:

- `-r, --reverse` — also set this name as your account's reverse (primary) record.
- `--json` — emit machine-readable output.

If the process is interrupted between commit and reveal, resume it:

```bash
dotns register domain retry my-cool-app --env devnet
dotns register domain list --env devnet     # inspect cached commitments
```

Verify ownership:

```bash
dotns lookup owner-of my-cool-app --env devnet
dotns lookup name my-cool-app --env devnet    # full record view
```

## Bind a name to a bundle

Once you have deployed your app (see [Build & Publish Applications](build-and-publish.md)) you will have an
IPFS CID for the bundle. Write it into the content resolver to make the name resolve to
your app:

```bash
# Set the content hash (IPFS CID) for a name you own
dotns content set my-cool-app <cid> --env devnet

# Read it back
dotns content view my-cool-app --env devnet
```

After this, opening `my-cool-app.dot` in the Polkadot app or at
[dev-dot.li](https://dev-dot.li) resolves the name, decodes the content hash to the CID,
and fetches your bundle from the gateway.

## Manage a name

```bash
# Set one of your names as the primary (reverse) name for your account
dotns primary set my-cool-app --env devnet
dotns primary status --env devnet

# Transfer ownership to another address or label
dotns lookup transfer my-cool-app --to <address-or-label> --env devnet

# Create a subname under a name you own
dotns register subname --env devnet
```

## Learn more

- [Naming (DotNS)](../architecture/naming.md) — resolution, contract topology, and the naming rules
- [DotNS UI](https://dotns.dev-dot.li) — the same lookups in a browser
- [Build & Publish Applications](build-and-publish.md) — bind the name to a bundle
