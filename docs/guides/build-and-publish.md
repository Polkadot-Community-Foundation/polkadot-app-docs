# Build & Publish Applications

This is the full publishing path for a first Product app: start from a Product
SDK frontend, build a static bundle, register a `.dot` domain, and publish with
the `pad` deploy CLI. When it works, the app is reachable as `<name>.dot` inside
the Polkadot app and at `https://<name>.dev-dot.li` on the web gateway.

An app is a static bundle. `pad` uploads it to the Bulletin Chain and points
your `.dot` domain at the result; the gateway resolves that name client-side and
renders the bundle. For the full pipeline, see
[App delivery](../architecture/app-delivery.md).

## Prerequisites

Install the SDK and the CLIs you will use:

```bash
npm i @parity/product-sdk
npm i -g @polkadot-community-foundation/polkadot-app-deploy   # deploy CLI (bins: pad, pad-bootstrap)
npm i -g @polkadot-community-foundation/dotns-cli             # DotNS CLI (bin: dotns)
npm i -g @polkadot-community-foundation/cdm-cli               # contract manifest CLI (bin: cdm)
```

The publishing CLIs (`pad` and `dotns`) select the network with `--env devnet`;
CDM uses `-n devnet`.

Before your first on-chain step, make sure your **signing account** is ready:

- **Funded with native devnet tokens for fees.** `register` and `publish` sign
  PolkaVM transactions on Asset Hub, so the account needs native tokens (from the
  faucet — see the storage-authorization note below).
- **Mapped to its EVM address.** `dotns`, `cdm`, and `pad` sign on Asset Hub's
  PolkaVM; an account that has never been mapped fails on the first on-chain step.

!!! warning "Two prerequisites for publishing"
    Your deploy account must (1) **own** the target `.dot` domain, and (2) the
    accounts `pad` uploads with must hold a live **Bulletin storage
    authorization**. `pad` never self-authorizes and fails fast if the
    authorization is missing or expired. See
    [Get storage authorization](#get-storage-authorization) below.

## Get storage authorization

Publishing writes your app to the **Bulletin Chain**, and Bulletin storage is
**authorization-based, not fee-based**: before `pad` can upload, the uploading
account needs a live *authorization* — an on-chain quota of bytes and
transactions recorded in `TransactionStorage.Authorizations`. You do **not** pay
devnet tokens per upload, and `pad` never self-authorizes: if the authorization
is missing or expired, it fails fast.

One detail decides *which* account to authorize: **`pad` does not upload from
your signing account.** It derives a small **pool** of helper accounts and
uploads from one of those — which is why a failing deploy reports
`pool account N is not authorized`. By default the pool is a shared, well-known
set derived from the standard dev phrase (`//deploy/0…9`); set
`BULLETIN_POOL_MNEMONIC` to use your own. Either way, it is the **pool** accounts
that need authorization. There are two ways to grant it.

### Option 1 — Storage Faucet (web)

The **Storage Faucet** in the
[Bulletin Chain Console](https://paritytech.github.io/polkadot-bulletin-chain/authorizations?tab=faucet)
authorizes a storage allowance for any account you name, and the same page lists
current authorizations and when each expires. This is the quickest way to
authorize a single account.

!!! note "Two different faucets"
    The [token faucet](https://faucet.polkadot.io) provides **native devnet
    tokens** for transaction fees and account existence. The **Storage Faucet**
    grants a **Bulletin storage allowance**. Publishing typically needs both:
    native tokens to sign the on-chain transactions, and an allowance to upload
    the bundle.

### Option 2 — `pad-bootstrap` (self-driven)

**`pad-bootstrap`** ships in the same `@polkadot-community-foundation/polkadot-app-deploy` package as
`pad` (installed in [Prerequisites](#prerequisites) — no extra install). It
checks every pool account `pad` will use and grants authorization to the ones
that need it, in a single run. It signs the grants with an **authorizer** key,
and the Devnet provides a shared, feeless one for exactly this purpose.

!!! info "Devnet storage authorizer"
    The Devnet provides a shared storage authorizer for `pad-bootstrap`. Pass it
    as `--authorizer`; it can be rotated, so check here for the current value.

    ```bash
    export AUTHORIZER="//Eve"   # Devnet storage authorizer (rotatable)
    ```

Authorize the default (shared) pool that `pad … --env devnet` uses:

```bash
pad-bootstrap --env devnet --authorizer "$AUTHORIZER"
```

It prints each pool account's status, grants any that are missing or expired
(feeless), and is idempotent — re-run it any time to top up expiring
authorizations. Then run your deploy again.

!!! warning "Always pass `--authorizer` explicitly"
    The Devnet Bulletin identifies as a testnet, so if you omit `--authorizer`,
    `pad-bootstrap` falls back to `//Alice` — which is **not** an authorizer here
    and cannot grant. Always pass `//Eve` (above).

Using your own pool? Pass the same mnemonic you deploy with, so `pad-bootstrap`
authorizes the accounts your deploy actually uses:

```bash
BULLETIN_POOL_MNEMONIC="<your pool mnemonic>" \
  pad-bootstrap --env devnet --authorizer "$AUTHORIZER"
```

### Authorizations expire

Authorizations are finite and expire. If a deploy that used to work starts
failing at the upload step, the allowance has most likely lapsed — top it up from
the Storage Faucet or by re-running `pad-bootstrap`, then deploy again.

## 1. Scaffold with the Product SDK

Start from a reference template rather than an empty directory. The playground
template ([playground-template.dev-dot.li](https://playground-template.dev-dot.li),
source
[playground-app-template](https://github.com/paritytech/playground-app-template))
is a minimal React + Vite + TypeScript app wired to the Host API: it surfaces the
app-scoped product account (SS58 and H160 addresses) and signs a message via
`@parity/product-sdk-signer`. For a plain HTML/CSS/JS starting point, use
[dotli-starter](https://github.com/paritytech/dotli-starter),
which detects the host container with `@parity/product-sdk-host` and submits
extrinsics through the host provider.

Your app runs as a *Product* inside the Polkadot host (mobile, desktop, or the
web gateway), which lends it a signer and routes all chain RPC. Reach the
platform through `@parity/product-sdk` — `createApp(config)` returns an app with
wallet, chain, and cloud-storage APIs, and the SDK also exposes contract and
identity modules. See
[Use platform services from the SDK](platform-services-sdk.md).

## 2. Build the frontend

Produce a static build directory. With a Vite template:

```bash
npm install
npm run build   # emits dist/
```

The output (`dist/`) is what you publish. If your app is contract-backed, deploy
and register its PolkaVM contracts first and record them in a `cdm.json`
manifest with the `cdm` CLI — see
[Deploy & register contracts](deploy-contracts-cdm.md).

## 3. Register a .dot domain

Names are `.dot` domains managed by DotNS. Check availability and register with
the DotNS CLI:

```bash
dotns lookup name <name> --env devnet
dotns register domain -n <name> --env devnet
```

Pass the **label without the `.dot` suffix** — `my-cool-app`, not `my-cool-app.dot`.

Label eligibility depends on length and personhood tier — short or reserved
names are gated behind proof of personhood. See
[Register a .dot domain](register-a-dot-name.md) and the
[Naming architecture](../architecture/naming.md) for the full rules.

!!! tip
    `pad` will register the name for you during deploy if the signing account
    does not already own it, so this step is optional when you deploy with an
    account that will hold the name.

## 4. Publish with pad

Point `pad` at your build directory and the target name:

```bash
pad ./dist <name>.dot --env devnet
```

`pad` uploads the bundle to Bulletin (skipping unchanged blocks on repeat
deploys), registers the name if needed, and writes the content hash on Asset
Hub.

!!! note "`pad` uses its own signing key"
    `pad` does **not** read the dotns keystore. Give it a signer explicitly —
    pass `--mnemonic` (see `pad --help`), preferably from an environment
    variable, and never commit or print it.

Add `--publish` to list the app in the on-chain Publisher registry so directory
apps such as [Browse](https://browse.dev-dot.li) can enumerate it:

```bash
pad ./dist <name>.dot --env devnet --publish
```

!!! note "`--publish` is personhood-gated"
    The `devnet` preset carries the Browse `Publisher` address, so `--publish`
    is active. Publishing is gated on-chain: the account must own the `.dot`
    label and hold proof of personhood (Lite lists 1/day, Full 5/day). A deploy
    without `--publish` always succeeds; the app just is not listed in Browse.

Once the transaction settles, the app is live at `<name>.dot` in the Polkadot
app and at `https://<name>.dev-dot.li` on the web gateway. See
[List your app in Browse](list-in-browse.md) for discovery.

## Reference apps to study

These are working, deployed examples (source under
[paritytech](https://github.com/paritytech)):

- **[Simple Survey](https://survey.dev-dot.li)** — storage-indexed app: survey
  JSON on Bulletin, an Asset Hub contract indexes response CIDs.
- **[CDM Frontend](https://contracts.dev-dot.li)** and
  **[DotNS UI](https://dotns.dev-dot.li)** — reference tools for contracts and
  names.

## Learn more

- [Register a .dot domain](register-a-dot-name.md) — the full naming surface
- [Use platform services from the SDK](platform-services-sdk.md) — once your app is live
- [App delivery](../architecture/app-delivery.md) — how publishing works
- [How Bulletin authorization works](https://github.com/paritytech/polkadot-bulletin-chain) — the storage pallet and quota model
