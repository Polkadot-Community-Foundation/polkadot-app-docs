# The Polkadot app (client tier)

The Polkadot app is the end-user entry point to the Polkadot Products Devnet.
It keeps keys on the user's device and combines identity, chat, payments, and an
in-app browser for `.dot` apps. This page describes the client tier across
mobile and desktop, how apps run inside it through the Host API, and how the app
decides which network it is talking to.

!!! note
    This documents a public developer preview. Devnet tokens have no real value, and
    the flows described here may change. Never share your recovery phrase or private
    keys with anyone.

## What the client tier helps you do

The client tier gives users one place to hold keys, manage identity, use CASH,
message other people, and open `.dot` apps. For developers, it provides the host
environment that Product apps rely on for accounts, signing, chain access,
permissions, and storage.

The product surface is shared across native clients:

| Client | Role |
|--------|------|
| [Polkadot Android](https://github.com/Polkadot-Community-Foundation/polkadot-android-community) | Mobile app with local custody, identity, CASH, messaging, and app hosting |
| [Polkadot iOS](https://github.com/Polkadot-Community-Foundation/polkadot-ios-community) | Mobile app with the same product surface for iOS users |
| [Polkadot Desktop/Web](https://github.com/Polkadot-Community-Foundation/polkadot-desktop-community) | Desktop app and web client for the same account and Product flows |

You can install the app from the following locations. The Desktop build also runs as a
web application, and the same product suite is reachable through the web gateway at
[https://dev-dot.li](https://dev-dot.li).

- Android APK: <https://get.polkadotcommunity.foundation/android/latest.apk>
- iOS TestFlight: <https://testflight.apple.com/join/VvC8SHVE>
- Desktop: <https://polkadotcommunity.foundation/desktop/>

## Wallet and account management

On mobile (Android, iOS), accounts are created and stored on-device and the app is
self-custodial. Keys are held in the platform's hardware-backed secure storage (the
Android keystore, or the iOS Keychain), and recovery is offered through the device's
cloud backup (Google Drive on Android, iCloud on iOS). On mobile, signing happens
locally: when a dApp or an in-app action needs a signature, the app presents a modal, and
only on your approval does the on-device key sign the payload.

The desktop/web client holds no keys of its own. It is a companion: you pair it with your
phone (scan a pairing code) and signing happens on the phone. Nothing funds a brand-new
account automatically. On devnet (non-production) builds you can top up your account with
test tokens using the manual "+" (top-up) action; for native devnet tokens to pay
transaction fees you can also use the faucet at <https://faucet.polkadot.io>.

The identity, chat, and payment features map onto specific parachains: the People Chain
carries your username and the chat statement store, Asset Hub carries payments and the
DotNS name registry, and the Bulletin Chain serves dApp content and chat attachments.

## The app browser and the client layers

The in-app browser addresses dApps by `.dot` domain rather than by URL. A name is
resolved through DotNS, the referenced content archive is fetched from Bulletin
or a gateway, and the archive runs inside a sandboxed webview. The app injects a
Host API bridge so Products can ask the host for account, signing, chain,
permission, storage, theme, notification, payment, and navigation services.

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>browser &#8594; host API</figcaption>
<div class="dg-flow col">
  <div class="dg-node user"><div class="eb">User</div><div class="tt">Opens .dot domain</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node dotns"><div class="eb">Naming</div><div class="tt">Resolve through DotNS</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node bulletin"><div class="eb">Bulletin</div><div class="tt">Fetch app bundle</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node"><div class="eb">Webview</div><div class="tt">Run in sandboxed webview</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node"><div class="eb">Bridge</div><div class="tt">Host API bridge</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node"><div class="eb">Host</div><div class="tt">Native host services</div></div>
  <div class="dg-edge"></div>
  <div class="dg-stage">
    <div class="dg-node"><div class="eb">Accounts</div><div class="tt">Accounts / signing</div></div>
    <div class="dg-node"><div class="eb">Chain</div><div class="tt">Chain connection</div><div class="sb">by genesis hash</div></div>
    <div class="dg-node"><div class="eb">Permissions</div><div class="tt">Device + remote permissions</div></div>
    <div class="dg-node people"><div class="eb">Services</div><div class="tt">Payment / statement store</div><div class="sb">storage / theme / notifications</div></div>
  </div>
  <div class="dg-edge"><span class="lb">on-device key</span></div>
  <div class="dg-node"><div class="eb">Keystore</div><div class="tt">Hardware-backed keystore</div></div>
</div>
</figure>

Each platform implements the webview and bridge in its native stack, but the
contract exposed to Products is the same Host API.

## Running dApps through the Host API

Once the webview loads, the Product talks to the host through the injected API.
The host decides which capabilities are available, checks permissions, and
mediates sensitive actions such as signing.

A typical signing flow looks like this:

1. The dApp calls `hostApi.signPayload`, `signRaw`, or `createTransaction` over the
   Spektr channel.
2. The native side receives the request and checks the product's granted permissions.
3. The app shows a signing modal for you to review and approve.
4. On approval the on-device key signs, and the signature is returned to the dApp;
   broadcast is gated inside the container.

!!! tip
    If you are building a product, you rarely call these primitives by hand. The
    [`@parity/product-sdk`](https://www.npmjs.com/package/@parity/product-sdk) layer
    wraps the Host API, and you can test a product end-to-end against a real host with
    [`@parity/host-api-test-sdk`](https://www.npmjs.com/package/@parity/host-api-test-sdk)
    — a Node host that embeds your product in an iframe over the real Spektr protocol,
    injects dev accounts (Alice/Bob), and auto-signs requests.

## Selecting the network

Network selection is operator-driven. Each client asks for the roles it needs
(`people`, `bulletin`, `assetHub`), then receives the current RPC endpoints,
DotNS contract addresses, gateway URLs, and backend URLs from the Devnet
configuration service. The important point for users and app developers is that
the app does not expect Products to hardcode those values.

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>network selection</figcaption>
<div class="dg-flow col">
  <div class="dg-node"><div class="eb">Channel</div><div class="tt">Selected Devnet channel</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node"><div class="eb">Config</div><div class="tt">Devnet configuration</div></div>
  <div class="dg-edge"></div>
  <div class="dg-stage">
    <div class="dg-node people"><div class="eb">Roles</div><div class="tt">Resolve chain roles</div><div class="sb">people / bulletin / assetHub</div></div>
    <div class="dg-node gateway"><div class="eb">Services</div><div class="tt">Resolve service URLs</div><div class="sb">gateway / identity / storage</div></div>
  </div>
  <div class="dg-edge"></div>
  <div class="dg-node"><div class="eb">Environment</div><div class="tt">Active app environment</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node"><div class="eb">Products</div><div class="tt">Products use host + SDK</div><div class="sb">without hardcoded endpoints</div></div>
</div>
</figure>

If the app cannot resolve a complete environment, it fails closed instead of
guessing. Developer tooling follows the same idea: CLIs select a named network
preset, and the preset supplies the chain and registry addresses for that
environment.

## Common blockers

- **A Product runs outside the host.** Host-only APIs need the Polkadot app or
  web gateway. Use the test host for local end-to-end tests.
- **A signing request is denied.** The user must approve locally, and the
  Product must have the required permission.
- **The app cannot resolve the Devnet.** Network configuration is supplied by
  the platform; hardcoded endpoints in Product code are brittle.

## Learn more

- Polkadot Desktop (source): <https://github.com/Polkadot-Community-Foundation/polkadot-desktop-community>
- Polkadot Android (source): <https://github.com/Polkadot-Community-Foundation/polkadot-android-community>
- Polkadot iOS (source): <https://github.com/Polkadot-Community-Foundation/polkadot-ios-community>
- `host-api-test-sdk` (source): <https://github.com/paritytech/host-api-test-sdk>
- `@novasamatech/host-api` on npm: <https://www.npmjs.com/package/@novasamatech/host-api>
- `@novasamatech/host-container` on npm: <https://www.npmjs.com/package/@novasamatech/host-container>
- DotNS name resolution: [../architecture/naming.md](../architecture/naming.md)
- Polkadot developer docs: <https://docs.polkadot.com>
