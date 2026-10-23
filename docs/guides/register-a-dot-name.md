# Register a .dot domain

A `.dot` domain is a readable name on the Polkadot Products Devnet. It has an
owner account and can point to an app bundle, so that opening `your-app.dot` in
the [Polkadot app](../reference/resources.md) or the
[web gateway](https://dev-dot.li) loads your app.

You register and manage names with the DotNS CLI
(`@polkadot-community-foundation/dotns-cli`). Ordinary app names follow the
normal registration path, and short or reserved names have extra gates.

Owning a name means owning an ERC-721 token. Binding it to an app means writing
an IPFS content hash into its resolver, which clients read to fetch your
bundle. [Naming (DotNS)](../architecture/naming.md) covers the resolution path
and the contracts behind it.

## Install the CLI

The `dotns` command ships in `@polkadot-community-foundation/dotns-cli`.
[Packages & tools](../reference/packages.md) has the install line.

Every command takes a network with `--env devnet` (or the `DOTNS_ENV`
environment variable).

## Set up an account

The CLI signs with its own key, separate from any account in the Polkadot app.
Set one up before you register anything.

### Fastest: a throwaway account

--8<-- "throwaway-account.md"

Then check which account is active:

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

The prompt first asks which kind of secret you are storing. Answer `mnemonic` or
`key-uri`, then paste the value. Finally it asks you to set a keystore
password. Every later `dotns` command needs that password: pass it with
`--password`, or export `DOTNS_KEYSTORE_PASSWORD` so scripts don't stall on a
hidden prompt.

To do it in one non-interactive step instead:

```bash
export DOTNS_KEYSTORE_PASSWORD="…"
dotns auth set --mnemonic "…" --account my-app
```

### Fund and map the account

Registration signs a PolkaVM transaction, so your account also needs a balance
for fees and a mapped EVM address. Fund it from the
[faucet](../reference/networks.md#faucet), then:

```bash
# Map your Substrate account to its EVM address (once per account)
dotns account map --env devnet

# Check whether an address is already mapped
dotns account is-mapped <address> --env devnet
```

`dotns account is-mapped` checks the address you pass in. Its connection banner
still shows the CLI's default signer, so it may show the shared dev account
even when your keystore is set up. Trust the `mapped:` line for the address you
asked about, not the banner.

## Reserved and short-name gating

Not every label is open to everyone. The public commit-reveal path requires a
label of at least three characters, and sorts labels by their stem (the label
with any trailing digits stripped):

- Reserved: stems of five characters or fewer are gated and cannot be claimed
  through the open path.
- Personhood-gated: stems of six to eight characters need proof of personhood
  (the lite tier for a stem plus exactly two digits, the full tier for no
  digits).
- Open: stems of nine characters or more register without a personhood check.

The controller rejects governance-reserved and explicitly reserved names.
Personhood-tier usernames are issued through the gateway path when you prove
personhood in the Polkadot app, not through the CLI commands below.

So if you just want a name for an app, use a label whose stem is nine
characters or longer, for example `my-cool-app`. It is the only band that
registers without proof of personhood, which today comes from the Polkadot app
and not from the CLI. Shorter names such as `my-app` (a six-character stem)
will be refused.

You can't check a label's tier before committing to it, so count the stem
yourself.

## Register a name

Registration is a commit-reveal handshake: you commit a hashed intent, wait a
minimum commitment age, then reveal and pay. The CLI runs all three steps:

```bash
dotns register domain -n my-cool-app --env devnet
```

It takes several minutes, because the commitment has to finalize, then
mature, then be revealed. Before the final step the CLI prints the tier and the
price it is about to pay:

```
  name tier:  NoStatus
  your tier:  NoStatus
  message:    Available to all
  price:      10 PAS
```

Useful options:

- `-r, --reverse`: also set this name as your account's reverse (primary)
  record.
- `--json`: print machine-readable output.

Whatever the CLI printed, check the result on chain before you do anything
else:

```bash
dotns lookup owner-of my-cool-app --env devnet
dotns lookup name my-cool-app --env devnet    # full record view
```

You can also look the name up in the [DotNS UI](https://dotns.dev-dot.li).

If the owner is your address, the name is yours and you are done. Only if it is
not, resume the handshake:

```bash
dotns register list --env devnet     # inspect cached commitments
dotns register retry my-cool-app --env devnet
```

## Bind a name to a bundle

Once you have deployed your app (see
[Build & publish an app](build-and-publish.md)), you have an IPFS CID for the
bundle. Write it into the content resolver to make the name resolve to your
app:

```bash
# Set the content hash (IPFS CID) for a name you own
dotns content set my-cool-app <cid> --env devnet

# Read it back
dotns content view my-cool-app --env devnet
```

After this, opening `my-cool-app.dot` in the Polkadot app or at
[dev-dot.li](https://dev-dot.li) resolves the name, decodes the content hash to
the CID and fetches your bundle from the gateway.

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

- [Naming (DotNS)](../architecture/naming.md): resolution, the contracts and the naming rules
- [DotNS UI](https://dotns.dev-dot.li): the same lookups in a browser
- [Build & publish an app](build-and-publish.md): bind the name to a bundle
