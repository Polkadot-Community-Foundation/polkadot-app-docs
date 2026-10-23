---
date: 2026-10-23
short_title: Devnet update, October 2026
summary: The Android, iOS and desktop apps and dev-dot.li now speak TrUAPI 0.25, and so do DotNS and Browse. Update your app; developers move to Product SDK 0.39.0 and update pad and dotns.
---

# Devnet update: the apps move to TrUAPI

All four Devnet hosts now talk to the apps they open over a new host protocol,
TrUAPI 0.25:

- the Android app
- the iOS app
- the desktop app
- the web gateway at [dev-dot.li](https://dev-dot.li)

Apps built for the previous protocol can no longer talk to them.

## If you use the app

Update the host you use. Older builds cannot run apps built on the current
Product SDK.

- **Android:** the [tester group](https://appdistribution.firebase.dev/i/f3b79521380b40b9)
  delivers the new build. To install by hand, take the APK from the
  [latest Android release](https://github.com/Polkadot-Community-Foundation/polkadot-android-community/releases/latest).
- **iOS:** install the new build from
  [TestFlight](https://testflight.apple.com/join/HnBX59vz).
- **Desktop:** install the
  [latest desktop release](https://github.com/Polkadot-Community-Foundation/polkadot-desktop-community/releases/latest).
- **Web:** nothing to install. [dev-dot.li](https://dev-dot.li) is already
  updated.

More detail is in [Get the app](../reference/resources.md#get-the-app).

## Updated apps

These Devnet apps are updated for TrUAPI 0.25:

- **DotNS** (`dotns.dot`), for registering and looking up `.dot` names, is now
  version 0.8.0.
- **Browse** (`browse.dot`), the app directory.

## If you build apps

### Move your app to Product SDK 0.39.0

1. Pin the Product SDK to 0.39.0, the release that speaks TrUAPI 0.25:

    ```bash
    npm i @parity/product-sdk@0.39.0
    ```

    Later releases speak TrUAPI 0.26, which the Devnet hosts do not support.

2. Move to `polkadot-api` 3 if your app is on an older SDK. An app built
   directly on `@novasamatech/host-api` has to switch to the SDK.
3. Add the descriptors override to get the current Devnet chain metadata, as
   shown in
   [Current Devnet chain metadata](../reference/packages.md#current-devnet-chain-metadata).
4. Run your end-to-end tests against the TrUAPI test host in
   `@parity/truapi-host`, as shown in
   [Test without the real host](../guides/platform-services-sdk.md#test-without-the-real-host).

### Start a new app

The
[playground-app-template](https://github.com/Polkadot-Community-Foundation/playground-app-template)
is updated to Product SDK 0.39.0, so it works with TrUAPI 0.25 out of the box.

### Update the CLIs

Reinstall `pad` and `dotns` to get `pad` 0.22.1 and `dotns` 1.0.0:

```bash
npm i -g @polkadot-community-foundation/polkadot-app-deploy@latest @polkadot-community-foundation/dotns-cli@latest
```

What changes for you:

- Both CLIs default to `devnet`. Keep passing `--env devnet` anyway.
- `pad` no longer lists apps in Browse: `--publish` and `--unpublish` are gone.
- `dotns lookup transfer` takes `--destination` (`-d`) instead of `--to`.

## Questions

Ask in the Devnet chat for developers on Matrix:
[#polkadot-products-public](https://matrix.to/#/#polkadot-products-public:matrix.org).
