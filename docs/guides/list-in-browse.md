# List your app in Browse

Browse is the app-discovery directory for the Polkadot Products Devnet. A
listing is a small on-chain record that points directory clients back to the
app's `.dot` domain and manifest. This page covers the permission model, the CLI
path, and how to verify or retract a listing.

!!! warning "Listing needs proof of personhood — from the Polkadot app"
    `pad --publish --env devnet` calls `Publisher.publish`, and the contract is
    live on the Devnet. But publishing is gated on-chain: you must own the
    `.dot` label **and** hold proof of personhood, which is obtained in the
    Polkadot app on a device — there is no CLI path to a tier. Without one, the
    publish step reports `NoPersonhood`.

    This does not block you. A deploy without `--publish` always succeeds, and
    the app is fully usable at `<name>.dot` and `https://<name>.dev-dot.li` —
    it simply is not listed in the directory. Read on if you have a tier, or
    want to know what listing would add.

## What "listing" actually is

Listing records almost nothing on-chain: the `Publisher` contract stores only a
labelhash, the publisher address, and a timestamp. Everything Browse displays —
name, description, icon — is read from your DotNS `manifest` record at load
time. See [App discovery (Browse)](../architecture/discovery.md) for the model.

Listing has two parts: your app is already deployed to a `.dot` domain, and you
call `Publisher.publish("<label>")` so directory clients can enumerate it.

## What publishing requires

Publishing is gated on-chain, and each gate has its own revert:

| Requirement | Revert if unmet |
| --- | --- |
| You own the `.dot` label | `NotOwner` |
| You have personhood (Lite or Full) | `NoPersonhood` |
| You are under your tier's cap — **Lite 1/day, Full 5/day**, rolling 24h | `RateLimitExceeded` |

Unpublishing only requires ownership. See
[Username & proof of personhood](username-and-personhood.md) to get a tier.

## Before you start

To list an app, you need:

- A built static bundle for your app (for example a Vite `dist/` directory).
- A `.dot` domain you own on the devnet, and proof of personhood on the account
  that will publish. That account must also be funded with native devnet tokens
  for fees and mapped to its EVM address — the deploy and `Publisher.publish`
  calls are PolkaVM transactions on Asset Hub. See
  [Username & proof of personhood](username-and-personhood.md).
- A Bulletin storage allowance for the upload — see
  [Get storage authorization](build-and-publish.md#get-storage-authorization).
  Without it the deploy step cannot store your bundle.
- The deploy CLI installed — see
  [Packages & tools](../reference/packages.md).

- The network preset: `pad` takes it via `--env devnet`. The `--publish` step
  only takes effect when that preset carries a `Publisher` contract address.

!!! note "Metadata comes from a manifest"
    Browse renders your card from a `manifest` record that `pad` writes when it
    finds a product config — see
    [Add card metadata](build-and-publish.md#add-card-metadata) for the file.
    An app without one can still be listed; it just will not hydrate into a
    rich card.

## Step 1 — Deploy your app to its `.dot` domain

If your app is not deployed yet, deploy it first. The CLI merkleizes your
bundle, uploads it to the Bulletin Chain, and writes the content root as the
`contenthash` on DotNS:

```bash
pad ./dist my-app.dot --env devnet --mnemonic "$MNEMONIC"
```

The signer must own the `.dot` label. Keep the phrase in an environment
variable; never commit or print it. When a product config is present, this same
run also writes the `manifest` text records that Browse reads.

## Step 2 — Publish the listing

List the app as part of a deploy by adding `--publish`:

```bash
pad ./dist my-app.dot --env devnet --publish
```

After the contenthash is set, this calls `Publisher.publish("my-app")`. On an
environment whose `--env` preset carries no `Publisher` address, the publish
step prints `Publish: not supported on this environment` and is skipped rather
than failing the deploy; the `devnet` preset does carry it, so `--publish` is
active there.

Publishing is idempotent. Re-running it on an
already-listed label refreshes the publisher and timestamp in place rather than
creating a duplicate entry, so it is safe to include `--publish` on every deploy.

## Step 3 — Verify the listing

Once the publish step succeeds, open the Browse reference app and search for
your app:

- <https://browse.dev-dot.li>

The client enumerates the published set, resolves your label, and hydrates the
card from your manifest. Selecting the card opens the app — inside the Polkadot
app it navigates to `my-app.dot`; in a plain browser it opens the app through
the web gateway.

## Removing a listing

To retract an existing listing, unpublish it. This is a standalone operation that
skips the deploy:

```bash
pad --unpublish my-app.dot --env devnet
```

Unpublishing only requires ownership of the label — there is no personhood gate
or rate limit on removal.

## Learn more

- [Build & Publish Applications](build-and-publish.md) — get the app deployed first
- [Username & proof of personhood](username-and-personhood.md) — publishing needs a tier
- [App discovery (Browse)](../architecture/discovery.md) — the permission and hydration model
