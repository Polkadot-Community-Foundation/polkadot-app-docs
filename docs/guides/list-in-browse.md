# List your app in Browse

Browse is the app-discovery directory for the Polkadot Products Devnet. Listing
your app means publishing a small on-chain record that points directory clients
back to the `.dot` domain and its manifest. This page covers the permission model,
the CLI path, and how to verify or retract a listing.

!!! warning "Self-serve listing is not available on the public devnet yet"
    No published `pad` build currently ships the devnet Browse `Publisher`
    address. `pad --publish --env devnet` therefore prints
    `Publish: not supported on this environment` and skips the listing step. The
    deploy can still succeed; the app just is not listed in Browse.

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

You will need:

- A built static bundle for your app (for example a Vite `dist/` directory).
- A `.dot` domain you own on the devnet, and proof of personhood on the account
  that will publish once listing is enabled. That account must also be funded
  with native devnet tokens for fees and mapped to its EVM address — the deploy
  and `Publisher.publish` calls are PolkaVM transactions on Asset Hub. See
  [Username & proof of personhood](username-and-personhood.md).
- A Bulletin storage allowance for the upload, from the
  [Storage Faucet](https://paritytech.github.io/polkadot-bulletin-chain/authorizations?tab=faucet).
  Without it the deploy step cannot store your bundle.
- The deploy CLI installed:

    ```bash
    npm i -g @polkadot-community-foundation/polkadot-app-deploy
    ```

    This installs the `pad` (and `polkadot-app-deploy`) binary. Listing uses
    the `--publish` flag, which only works when the selected environment carries
    a Browse `Publisher` address.

- The network preset: `pad` takes it via `--env devnet`. The `--publish` step
  only takes effect when that preset carries a `Publisher` contract address.

!!! note "Metadata comes from a manifest"
    Browse shows your app using a root manifest with `displayName`,
    `description`, and an `icon`. The deploy CLI writes these `manifest` text
    records when it finds a `polkadot-app-deploy.config` alongside your build.
    If your app has no manifest, it can still be published, but it will not
    hydrate into a rich card.

## Step 1 — Deploy your app to its `.dot` domain

If your app is not deployed yet, deploy it first. The CLI merkleizes your
bundle, uploads it to the Bulletin Chain, and writes the content root as the
`contenthash` on DotNS:

```bash
pad ./dist my-app.dot --env devnet
```

When a `polkadot-app-deploy.config` is present, this same run also writes the
root and per-executable `manifest` text records that Browse reads.

!!! warning "Never print secrets"
    Supply the signing key using your CLI's documented option (check
    `pad --help`), prefer an environment variable over an inline argument where
    possible, and never commit it. The signer must own the `.dot` label you are
    publishing.

## Step 2 — Publish the listing

You can list the app as part of a deploy by adding `--publish`:

```bash
pad ./dist my-app.dot --env devnet --publish
```

After the contenthash is set, this calls `Publisher.publish("my-app")`. If the
selected `--env` preset carries no `Publisher` address, the publish step prints
`Publish: not supported on this environment` and is skipped rather than failing
the deploy. That is the current public **devnet** behaviour.

Publishing is idempotent. Re-running it on an already-listed label refreshes the
publisher and timestamp in place rather than creating a duplicate entry, so it
is safe to include `--publish` on every deploy.

## Step 3 — Verify the listing

Once self-serve listing is enabled and the publish step succeeds, open the Browse
reference app and search for your app:

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
