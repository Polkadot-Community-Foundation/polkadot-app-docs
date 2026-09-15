---
date: 2026-09-08
short_title: Devnet update, September 2026
summary: Every user creates a new username; DotNS moves to a new contract set, so check your published apps; developers move to the new CDM registry and re-pin chain descriptors.
---

# Devnet update: new apps, X25519 chat, new registries

A major update is rolling out to the Polkadot Products Devnet, with new versions
of the Devnet mobile and desktop apps to match.

It changes a lot, and everyone has to act. **Every user creates a new
username**, and contacts and chat history do not carry over. The `.dot` name
system moves to a new set of contracts, so app publishers should
[check their published apps](#check-your-published-apps). Product developers
move to a new contract registry and re-pin their chain descriptors. Deployed
contracts, `.dot` registrations, and published Bulletin data all survive.

It is a testnet. Expect chaos.

## Before you update the mobile app

The update needs a fresh account, so the app must not restore your old one from
the cloud backup. Your `.dot` domains stay with the old account, and its
recovery phrase is the only way to keep managing them once you have a new one.
Do these steps **in this order**, before installing the new build:

1. **Write down your recovery phrase.** In the app, open **Settings → Security
   & privacy → Backup → View recovery phrase**. Skip this only if you have no
   published `.dot` domain you care about.
2. **Delete your cloud backup.** Shake your phone to open the
   [debug menu](../guides/back-up-your-account.md#the-hidden-debug-menu) and
   tap **Clear backup**. With the backup gone, the reinstalled app lets you
   create a new account instead of restoring the old one.
3. **Uninstall the app.**
4. **Reinstall it** from the links under [Get the update](#get-the-update).

!!! danger "Phrase first, then clear"
    Clearing the backup before you have written the phrase down loses the old
    account, and every `.dot` domain it owns, for good.

Your `.dot` names are tied to the account behind that recovery phrase. Restore
from the same phrase after reinstalling and you keep them. Create a fresh
account instead and the names stay with the old one. To keep managing a domain
from the old account, import its phrase into the `dotns` CLI with
`dotns auth set` as described in
[Register a .dot domain](../guides/register-a-dot-name.md#set-up-an-account).

## What's changing

Four platform changes drive the update:

- **Stronger chat encryption.** Chat encryption moves from P-256 to X25519, a
  modern elliptic curve built for fast, lightweight key exchange. Keys in the
  old format cannot be converted, which is why contacts and messages start
  fresh. See [Messaging & calls](../architecture/messaging.md#encryption).
- **Cleaner personhood pseudonyms.** The cryptographic context behind your
  pseudonym is updated, which is why you create a new username. See
  [Identity & personhood](../architecture/identity.md).
- **A fixed contract registry.** The CDM registry is redeployed at a new
  address to resolve a failure when publishing a brand-new contract name. What
  developers must do is under [Tooling updates](#tooling-updates).
- **A new DotNS deployment.** The `.dot` name system moves to a new set of
  contracts. Registered names carry over. See
  [Check your published apps](#check-your-published-apps) and
  [Naming (DotNS)](../architecture/naming.md).

### Desktop app

- Audio and video calls. Until now the desktop app only offered *Open Mobile
  App to call*.
- Chat search across chats, contacts, and message text.

### Mobile apps

- Chat search
- New tab bar UI
- General UI / UX improvements
- Reply to a transfer inside chat
- Improved multimedia download in chat
- Audio-device picker for calls
- Registration queue explainers and per-operation progress states
- Improved error messaging
- Coinage management improvements (durability layer)
- Improved PGAS

## Get the update

Finish the [steps above](#before-you-update-the-mobile-app) first, then install
the new build:

| Platform | Where to get it |
| --- | --- |
| Android | [Firebase App Distribution](https://appdistribution.firebase.dev/i/f3b79521380b40b9) for registered testers, or the APK on the [latest release](https://github.com/Polkadot-Community-Foundation/polkadot-android-community/releases/latest) |
| iOS | [TestFlight](https://testflight.apple.com/join/tCzFysKq) |
| Desktop (macOS / Windows / Linux) | [latest desktop release](https://github.com/Polkadot-Community-Foundation/polkadot-desktop-community/releases/latest) |

The desktop app holds no keys of its own: it pairs with your phone. Once your
new account exists, open the desktop app and scan its QR code to pair again.

## Check your published apps

The DotNS migration moved every registered `.dot` name to the new contracts.
**You keep your names.** The app records attached to them, the content hash
and the app manifest, were re-created from a snapshot of the old deployment,
and most apps came across intact. Not all of them did, and we cannot guarantee
yours is one of them.

After you update, open your app in the Polkadot app or at
`https://<your-name>.dev-dot.li`. If it loads, you are done. If it fails to
load, shows *Can't find product*, or shows an older version, republish it:

```bash
npm i -g @polkadot-community-foundation/polkadot-app-deploy@latest  # pad
npm i -g @polkadot-community-foundation/dotns-cli@latest            # dotns
pad ./dist <your-name>.dot --env devnet --publish
```

Update the tooling first. Older releases of `pad` and `dotns` still point at
the retired DotNS contracts, and a publish through them succeeds without error
while nothing changes for anyone on the new apps. Anything you published or
registered on the old deployment after the snapshot was taken is not on the
new one, so republish that too.

Your data on Bulletin is not affected. Republishing only rewrites the pointer
on your name. The full flow is in
[Build & Publish Applications](../guides/build-and-publish.md).

## Tooling updates

### DotNS moves to a new contract set

The current DotNS contract addresses are in
[Addresses & registries](../reference/addresses.md#dotns-the-dot-naming-system).
They ship inside `@polkadot-community-foundation/dotns-cli` and
`@polkadot-community-foundation/polkadot-app-deploy`, so installing the latest
release of those two packages is all most projects need. Only addresses you
wrote by hand need manual attention. The retired contracts stay readable, which
is why an old tool keeps "working" against them without an error.

### The contract registry moves

The CDM `ContractRegistry` is redeployed at
`0x05662b3dbd5dd9f2ff92d67630477e84b0b37c1f` to fix a failure when publishing
a brand-new contract name. Every name and version from the old registry at
`0x59b0245778917af55224e5f8fb55f7f8d452619f` was migrated with its owner, so
you keep your names. The current addresses live in
[Addresses & registries](../reference/addresses.md#cdm-contractregistry).

Upgrade in this order:

1. **Update your tooling.** The registry address ships inside the CDM
   packages, so installing the latest `@polkadot-community-foundation/cdm-cli`
   and `@polkadot-community-foundation/cdm-env` handles most of it. If you
   read the address through `getRegistryAddress("devnet")` or a preset rather
   than writing it yourself, updating the package is all you need.
2. **Regenerate your `cdm.json`.** Your project file pins the registry at the
   top level as `"registry": "0x59b0…"`, and updating the package does not
   rewrite that pin. Re-resolve your dependencies with `cdm install -n devnet`
   so the new address is written in.
3. **Then check anything custom.** Only addresses you wrote by hand, outside
   the tooling and outside `cdm.json`, need manual attention.

!!! warning "The old registry keeps answering"
    The old registry stays readable after the switch, so nothing breaks at
    cutover. But it cannot be frozen, and anything registered on it after the
    migration snapshot does not appear in the new registry. **Do not register
    new contract names on the old registry.** If you keep pointing at the old
    address, you keep reading an old registry with no error to tell you.

### Descriptors need re-pinning

After the runtime upgrades land, regenerate and re-pin your chain descriptors
for Bulletin, Asset Hub, and People. Publishing or querying with stale
descriptors fails at decode. How descriptors are loaded and overridden is in
[Use platform services from the SDK](../guides/platform-services-sdk.md#connect-to-the-chains).

Specifically, the Bulletin authorization structure changes shape: the value
`bytesPermanent` moves from the top level into a nested `extra` field.
Anything that reads authorization extents by field name breaks until re-pinned.
Your published data is not affected, only the way it is read.

## Questions

Ask in the Devnet chat for developers on Matrix:
[#polkadot-products-public](https://matrix.to/#/#polkadot-products-public:matrix.org).
