# More resources

Use this page when you know what you want to do next and need the right link:
install the app, open a reference Product, install developer tools, read source,
or fall back to the official Polkadot documentation.

!!! note
    The Polkadot Products Devnet is a public developer preview. Devnet
    tokens have no real value, and the flows described here may change. Never
    print or share seed phrases or private keys.

## If you want to try the app

The Polkadot app is the end-user host for Products. It is available on mobile
and desktop; a web gateway is also available for quick access.

| Platform | Link |
| --- | --- |
| Web gateway | <https://dev-dot.li> |
| Android (direct APK) | <https://get.polkadotcommunity.foundation/android/latest.apk> |
| iOS (TestFlight) | <https://testflight.apple.com/join/VvC8SHVE> |
| Desktop | <https://polkadotcommunity.foundation/desktop/> |

!!! tip "Possible blocker"
    If an account cannot submit a transaction, it may need Devnet funds. Use the
    faucet at <https://faucet.polkadot.io>.

## If you want examples to open

These reference Products are useful when you want to see the platform from a
user's point of view before reading code. They are public developer-preview
examples, not audited production applications.

| App | Live URL | What it shows |
| --- | --- | --- |
| Browse | <https://browse.dev-dot.li> | Directory of published Products |
| DotNS UI | <https://dotns.dev-dot.li> | `.dot` domain registration and lookup |
| CDM Frontend | <https://contracts.dev-dot.li> | CDM contract registry frontend |
| Playground template | <https://playground-template.dev-dot.li> | Minimal fork-and-go scaffold |
| Playground | <https://playground.dev-dot.li> | Guided environment to build a sample app |
| Simple Survey | <https://survey.dev-dot.li> | Storage app indexed by a contract |
| Mercado | <https://mercado.dev-dot.li> | Community marketplace |
| localdot | <https://localmarket.dev-dot.li> | Local peer-to-peer marketplace |

## If you want to build

Install the SDK for Product code, then add the CLIs for the task you are doing:
managing names, publishing an app bundle, or working with contracts.

### Libraries

```bash
# Product SDK — build a Product that runs inside the Host
npm i @parity/product-sdk

# Host API — talk to the Polkadot Host from your app
npm i @novasamatech/host-api

# CDM environment library
npm i @polkadot-community-foundation/cdm-env
```

### Command-line tools

```bash
# DotNS CLI — register and manage .dot domains
npm i -g @polkadot-community-foundation/dotns-cli

# Deploy CLI (bin: pad) — publish a built app to a .dot domain
npm i -g @parity/polkadot-app-deploy

# CDM CLI (bin: cdm) — register contracts in a CDM registry
npm i -g @polkadot-community-foundation/cdm-cli
```

!!! note
    Use the `devnet` preset for this environment. `pad` and `dotns` select it
    with `--env devnet`; CDM uses `-n devnet`.

## Source repositories

Source code is the place to go when you need details that these docs intentionally
do not duplicate. Product and tooling repositories are linked under
`paritytech`. App client repositories keep their app-specific source links.

Reference Product repositories:

- [Rock-Paper-Scissors](https://github.com/paritytech/Rock-Paper-Scissors)
- [simple-survey](https://github.com/paritytech/simple-survey)
- [feedback-board](https://github.com/paritytech/feedback-board)
- [mercado-community](https://github.com/paritytech/mercado-community)
- [localdot-community](https://github.com/paritytech/localdot-community)
- [w3spay](https://github.com/paritytech/w3spay)
- [festival](https://github.com/paritytech/festival)
- [t3rminal](https://github.com/paritytech/t3rminal)
- [playground-app-template](https://github.com/paritytech/playground-app-template)
- [playground-tutorial](https://github.com/paritytech/playground-tutorial)

## If you need protocol background

For the underlying protocol, tooling, and network concepts, see the official
Polkadot developer documentation:

- <https://docs.polkadot.com>

## Quick links

- Polkadot developer docs — <https://docs.polkadot.com>
- Web gateway — <https://dev-dot.li>
- Browse directory — <https://browse.dev-dot.li>
- Faucet — <https://faucet.polkadot.io>
- Source org — <https://github.com/paritytech>
