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

--8<-- "install-clis.md"

Every command below targets the Devnet with `--env devnet`. Pass it every time:
`pad`'s own default is a different network.

Your **signing account** needs three things before the first on-chain step:

1. **Native tokens** on Asset Hub for fees — see
   [Faucet](../reference/networks.md#faucet).
2. **A mapped EVM address.** `dotns`, `pad`, and `cdm` all sign PolkaVM
   transactions on Asset Hub; an unmapped account fails on its first one. Map it
   once with `dotns account map --env devnet`.
3. **A Bulletin storage authorization**, so it can upload your bundle —
   [below](#get-storage-authorization).

You also need to **own** the `.dot` name you publish to, which step 3 covers.

## Get storage authorization

Publishing writes your app to the **Bulletin Chain**, and Bulletin storage is
**authorization-based, not fee-based**: before `pad` can upload, the uploading
account needs a live *authorization* — an on-chain quota of bytes and
transactions. You do **not** pay devnet tokens per upload, and `pad` never
self-authorizes: without an authorization it stops before uploading anything.

**The account that signs is the account that uploads.** When you pass
`--mnemonic`, `pad` uploads from that same account, so that is the account to
authorize — the one that owns your `.dot` name.

Grant it from the **Faucet** tab of the
[Bulletin Chain Console](https://paritytech.github.io/polkadot-bulletin-chain/):
select the **Products Devnet** network, then authorize the SS58 address you
deploy with. The same page lists current authorizations and when each expires.

!!! note "Two different faucets"
    The [token faucet](../reference/networks.md#faucet) provides **native devnet
    tokens** for transaction fees. The **Storage Faucet** above grants a
    **Bulletin storage allowance**. Publishing needs both: tokens to sign the
    on-chain transactions, and an allowance to upload the bundle.

Authorizations are finite and expire. If a deploy that used to work stops at the
upload step, the allowance has most likely lapsed — grant it again and re-run.

### Deploying without your own key

`pad` can also upload from a shared **pool** of helper accounts, used when you
deploy without `--mnemonic`. Those accounts are pre-authorized on the Devnet;
`pad-bootstrap` (same package, no extra install) tops them up:

```bash
pad-bootstrap --env devnet --authorizer "//Eve"
```

Pass `--authorizer` explicitly — omitting it falls back to `//Alice`, which
cannot grant here. This path does not authorize your own account, so it is only
useful for CI and shared setups; a deploy that signs with `--mnemonic` still
needs the authorization above.

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

Pick a label whose stem is **nine characters or longer** to register it without
a personhood check; shorter labels are gated. Registration is a commit–reveal
handshake that takes a few minutes and costs a deposit. See
[Register a .dot domain](register-a-dot-name.md) for the rules and the
verification step.

!!! tip
    `pad` registers the name for you during deploy if your signing account does
    not already own it, so this step is optional when you deploy with the
    account that will hold the name.

## 4. Publish with pad

Point `pad` at your build directory and the target name. `pad` takes its signer
explicitly — it does **not** read the dotns keystore:

```bash
pad ./dist <name>.dot --env devnet --mnemonic "$MNEMONIC"
```

Keep the phrase in an environment variable; never commit or print it.

`pad` also has a `login` mode that signs with your Polkadot app instead of a
local key — these guides use `--mnemonic` throughout, which is why every run
reports `Storage signer: … (no session)`.

`pad` uploads the bundle to Bulletin (skipping unchanged blocks on repeat
deploys), registers the name if needed, and writes the content hash on Asset
Hub. A successful run ends with `Verified on-chain:` and the CID it published.

Confirm the name points at that CID before you share it:

```bash
dotns content view <name> --env devnet
```

The app is now live at `<name>.dot` in the Polkadot app and at
`https://<name>.dev-dot.li` on the web gateway.

### Add card metadata

Browse and the Polkadot app render your Product from a **product config** that
`pad` reads at deploy time. Without one, the app still works — it just has no
name, description or icon to show.

Save this as `polkadot-app-deploy.config.ts` beside your project (`pad` walks up
from the build directory to find it):

```ts
export default {
  domain: "my-cool-app.dot",
  displayName: "My Cool App",
  description: "What it does, in one line.",
  icon: { path: "./icon.png", format: "png" },
  executables: [{ kind: "app", path: "./dist", appVersion: [1, 0, 0] }],
};
```

Paths are resolved relative to the config file, and the icon must exist — `pad`
validates all of this before it uploads anything. It then uploads the icon and
writes the `manifest` record on your name plus an `executable` record on
`app.<name>.dot`:

```
Icon CID: bafk2bzacecqdzkvdzflim3gspebc2iaqfjxtmqbuo6lpaqmvmlfhvkqxl2klw
Writing root manifest text record on my-cool-app.dot (177 B)…
✓ 2 text records written.
```

`executables` also accepts `widget` and `worker` entries, published to the
`widget.` and `worker.` subnames.

### List it in Browse

Add `--publish` to list the app in the on-chain Publisher registry:

```bash
pad ./dist <name>.dot --env devnet --mnemonic "$MNEMONIC" --publish
```

!!! note "`--publish` needs proof of personhood"
    Publishing is gated on-chain: the account must own the label **and** hold
    proof of personhood (Lite lists 1/day, Full 5/day), which today comes from
    the Polkadot app rather than the CLI. Without it the publish step reports
    `NoPersonhood` and the deploy itself still succeeds — the app is live, just
    not listed. See [List your app in Browse](list-in-browse.md).

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
