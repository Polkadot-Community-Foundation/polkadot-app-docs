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

The `dotns` command ships in `@polkadot-community-foundation/dotns-cli` — see
[Packages & tools](../reference/packages.md) to install it.

Every command takes a network via `--env devnet` (or the `DOTNS_ENV` environment
variable).

## Set up an account

The CLI signs with its **own** key, separate from any account in the Polkadot
app. Configure one **before** you register anything.

### Fastest: a throwaway account

--8<-- "throwaway-account.md"

Then confirm which account is active:

```bash
dotns account address
dotns account info --env devnet
```

### Keep it: the encrypted keystore

To reuse an account across sessions, store a mnemonic or key-uri in the
password-protected `dotns` keystore instead of the environment:

```bash
dotns auth set
```

The prompt asks which kind of secret you are storing — answer `mnemonic` or
`key-uri`, *then* paste the value — and finally sets a **keystore password**.
Every later `dotns` command needs that password: pass it with `--password`, or
export `DOTNS_KEYSTORE_PASSWORD` so scripts do not stall on a hidden prompt.

To do it in one non-interactive step instead:

```bash
export DOTNS_KEYSTORE_PASSWORD="…"
dotns auth set --mnemonic "…" --account my-app
```

Registration signs a PolkaVM transaction, so your account also needs a mapped
EVM address and a balance for fees — fund it from the
[faucet](../reference/networks.md#faucet), then:

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

!!! tip "Pick a nine-character stem"
    If you just want a name for an app, use a label whose stem is **nine
    characters or longer** (for example `my-cool-app`). That is the only band
    that registers without proof of personhood, which today comes from the
    Polkadot app rather than the CLI. Shorter names such as `my-app` — a
    six-character stem — will be refused.

    There is no way to check a label's tier before committing to it, so count
    the stem yourself: the label with any trailing digits stripped.

## Register a name

Registration uses a commit-reveal handshake: you commit a hashed intent, wait a minimum
commitment age, then reveal and pay. The CLI orchestrates all three steps:

```bash
dotns register domain -n my-cool-app --env devnet
```

Expect this to take **several minutes** — the commitment has to finalize, then
mature, then be revealed. The CLI prints the tier and the price it is about to
pay before the final step:

```
  name tier:  NoStatus
  your tier:  NoStatus
  message:    Available to all
  price:      10 PAS
```

Useful options:

- `-r, --reverse` — also set this name as your account's reverse (primary) record.
- `--json` — emit machine-readable output.

**Always confirm the result on chain before doing anything else** — that is the
authoritative answer, whatever the CLI printed:

```bash
dotns lookup owner-of my-cool-app --env devnet
dotns lookup name my-cool-app --env devnet    # full record view
```

If the owner is your address, the name is yours and the job is done. Only if it
is not should you resume the handshake:

```bash
dotns register list --env devnet     # inspect cached commitments
dotns register retry my-cool-app --env devnet
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
