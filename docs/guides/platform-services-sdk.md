# Use platform services from the SDK

Your app reaches the platform through the Product SDK (`@parity/product-sdk`).
This guide covers the services most apps need first: chain access, signing,
cloud storage, contract calls, and a user's identity and personhood status.
[Packages & tools](../reference/packages.md) has the install line.

## Before you start

The SDK is a TypeScript umbrella package. You import from its subpath entry
points directly: `./chain`, `./cloud-storage`, `./contracts`, `./identity`,
`./individuality`, `./nfts`, `./host`, `./wallet`, `./local-storage`,
`./crypto`, `./address`, `./renderer`, `./core`, `./react`, and `./testing`.

`./react` (`ProductSDKProvider`, `useChain`, `useWallet`, `useLocalStorage`,
`useProductSDK`) declares `react` `^18 || ^19` as a peer dependency. In a
project without React installed, only that subpath fails, with a
module-not-found error.

### Your app has to run inside a host

Every chain call and every storage call goes through the host container: the
Polkadot app (mobile or desktop) or the web gateway at
[dev-dot.li](https://dev-dot.li). Outside a container, `createApp()` itself
throws before you reach any service:

```
HostUnavailableError: createApp requires a host product context
```

A chain call made outside a container throws
`Host provider unavailable for chain <genesisHash>`. To run your app in CI,
use the [test host](#test-without-the-real-host).

### Check results instead of catching errors

Most operations that can fail return a `Result` instead of throwing.
`Result<T, E>` is `{ ok: true; value: T } | { ok: false; error: E }`, so check
`res.ok` before you read `res.value`. `ok`, `err` and `isErrorOf` are exported
from the package root. `createApp`, `getChainAPI` and the `app.wallet` helpers
do throw, so wrap those in `try`/`catch`.

## Connect to the chains

The chain client gives you typed PAPI access to the three platform chains:
Asset Hub, the Bulletin chain, and the Individuality (People) chain. You can
connect in two ways.

The simplest is the preset. Call `getChainAPI(env)` and the SDK loads the right
descriptors for you:

```ts
import { getChainAPI } from "@parity/product-sdk/chain";

const client = await getChainAPI("devnet");

const account = await client.assetHub.query.System.Account.getValue(address);
const fee = await client.bulletin.query.TransactionStorage.ByteFee.getValue();
client.individuality; // People-chain access
client.raw; // lower-level PAPI handles, keyed by chain name
client.destroy(); // tear the connections down when you are finished
```

`Environment` has five values: `polkadot`, `kusama`, `paseo`, `previewnet` and
`devnet`. `polkadot` and `kusama` throw before connecting, because their
Bulletin and Individuality chains are not live yet. Connections are cached by
each chain's genesis-hash fingerprint.

For a specific or pre-release chain, pass descriptors yourself. They live in
`@parity/product-sdk-descriptors`. To import from it, add it as a direct
dependency, as shown in
[Current Devnet chain metadata](../reference/packages.md#current-devnet-chain-metadata):

```ts
import { createChainClient } from "@parity/product-sdk/chain";
import { devnet_asset_hub } from "@parity/product-sdk-descriptors/devnet-asset-hub";
import { devnet_bulletin } from "@parity/product-sdk-descriptors/devnet-bulletin";

const client = await createChainClient({
  chains: { assetHub: devnet_asset_hub, bulletin: devnet_bulletin },
});
```

`createChainClient` is async. If you leave out the `await`, the failure only
shows up on the next line you write, as a
`Property 'assetHub' does not exist on type 'Promise<ChainClient<…>>'` error.

!!! warning "The descriptor chooses the chain"
    The descriptor you pass to `createChainClient` is your network selection.
    Passing `paseo_asset_hub` here connects your app to Paseo Next, not this
    Devnet, whatever `--env` you deployed with. Nothing fails at build time:
    the app builds and loads, then throws `ChainNotSupportedError` at runtime.
    Match the descriptor prefix to your target network.

## Sign transactions

Signing goes through the host wallet, so you never manage keys yourself.
Connecting returns a `Result` with the available accounts. `getSigner()`
returns the selected account's PAPI 3 transaction signer, but only once an
account is selected:

```ts
import { SignerManager } from "@parity/product-sdk/wallet";

const manager = new SignerManager();
const connected = await manager.connect(); // or connect("dev") for Alice/Bob
if (!connected.ok) throw connected.error;

const [account] = connected.value;
if (!account) throw new Error("Host wallet returned no accounts");

manager.selectAccount(account.address);
const signer = manager.getSigner(); // CommonSignerTxCreator | null
```

`connect()` reports failure in its result and does not throw. If you skip the
check, you end up with a `null` signer and no error to explain it.

## Store and retrieve data (Cloud Storage)

Cloud Storage is content-addressed storage backed by the Polkadot Bulletin
chain, and it is how an app is meant to persist data. You store bytes, get back
a root CID, and read the bytes back by CID. Uploads need a connected wallet
with a selected account, and a storage authorization on that account.
[Storage & data](../architecture/storage.md) explains the model behind it.

```ts
import { createApp } from "@parity/product-sdk";

const app = await createApp({
  cloudStorage: { environment: "devnet" },
});

const cloud = app.cloudStorage;
if (!cloud) throw new Error("Cloud Storage is disabled");

const uploaded = await cloud.upload(bytes);
if (!uploaded.ok) throw uploaded.error;

const fetched = await cloud.fetch(uploaded.value);
if (fetched.ok) {
  render(fetched.value); // Uint8Array
}
```

!!! warning "`cloudStorage.environment` defaults to `paseo`"
    Omit the option and the SDK targets Bulletin on Paseo, which a Devnet host
    does not serve, so `createApp()` fails. Pass `environment: "devnet"`. The
    values are `paseo`, `previewnet` and `devnet`. Passing
    `cloudStorage: false` turns the service off, which is why
    `app.cloudStorage` can be null.

`cloud.computeCid(data)` computes the CID of raw bytes without uploading them
(`calculateCid` from the package root does the same without an `App`). This is
not the CID that `upload()` returns, which is the CID of the stored manifest.
Reads only work inside a container. There is no IPFS-gateway fallback.

## Call smart contracts

Contracts on the devnet are PolkaVM bytecode running on Asset Hub through
`pallet-revive`, with Solidity-style ABIs. Build a runtime from a raw PAPI
client, then a typed contract handle:

```ts
import {
  createContract,
  createContractRuntimeFromClient,
} from "@parity/product-sdk/contracts";

// client and manager as above; address and abi are your contract's.
const runtime = createContractRuntimeFromClient(client.raw.assetHub, devnet_asset_hub);
const contract = createContract(runtime, address, abi, { signerManager: manager });
```

The argument order is `(runtime, address, abi)`, with the address first. The
optional fourth argument supplies the signer: pass `{ signerManager }` for
`.tx()` calls, which look up the selected account when you call them.
Read-only `.query()` calls need no account and fall back to the keyless
`QUERY_FALLBACK_ORIGIN`. `ensureContractAccountMapped(runtime, address, signer)`
maps an account for `pallet-revive` when a call needs it.

## Read identity and personhood

To prove a user controls a `.dot` identity, sign with the account that owns it.
The wallet looks up the username's owner on the People chain and signs with
that account:

```ts
import { devnet_individuality } from "@parity/product-sdk-descriptors/devnet-individuality";

const proof = await app.wallet.signMessageWithDotNsIdentity({
  peopleChain: devnet_individuality,
  username: "alice", // omit to use the user's primary .dot name
  message: "Sign in to my-app",
});

proof.username; // username used for the lookup
proof.accountId; // owning AccountId32, 0x-prefixed
proof.signature; // Uint8Array
```

Usernames are matched byte for byte against the chain's records, and the
`.dot` suffix is not handled for you, so pass the exact registered value. If
you omit `username`, the host shows an identity-permission prompt. If your app
already connects the People chain with `app.chain.connect({ … })`, the lookup
reuses that connection.

For an app-scoped account, or a per-context alias that cannot be linked back to
the user's account, use `SignerManager.getProductAccount()` and
`SignerManager.getProductAccountAlias()`. Both go through the host.
`isValidDotNsName(name, suffix)` and `normalizeDotNsName(name, suffix)`
validate and canonicalise a name. Pass the TLD suffix, which is `".dot"` on
this Devnet.

For the raw host session (login state, product accounts, ring proofs), call
`getAccountsProvider()` from `@parity/product-sdk/host`. It is async and
resolves to `null` outside a host container. Its methods return neverthrow
`ResultAsync` values (`.isOk()`), not the SDK's own `Result`.

To read a user's personhood tier on-chain, call the `personhood`
`pallet-revive` precompile at the fixed address
`0x000000000000000000000000000000000A010000` with a contract handle. Its
`personhoodStatus(account, bytes32 context)` returns a status
(`0 = None`, `1 = Lite`, `2 = Full`) and a per-application `contextAlias`.
[Identity & personhood](../architecture/identity.md) has the full model.

## Test without the real host

`@parity/truapi-host` ships a Playwright test host that runs the real host core
with auto-signing dev accounts, so you can drive your app end to end in CI:

```bash
npm i -D @parity/truapi-host@0.25.0 @playwright/test esbuild
```

```ts
import { test as base, expect } from "@playwright/test";
import {
  createTestHostFixture,
  type TestHost,
} from "@parity/truapi-host/testing/playwright";

const test = base.extend<{ testHost: TestHost }>(
  createTestHostFixture({
    productUrl: "http://localhost:5173",
    productId: "my-app.dot", // the .dot name your app signs as
    accounts: ["alice"],
    networks: [
      {
        id: "devnet-asset-hub",
        name: "Devnet Asset Hub",
        genesisHash: "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2",
        rpcUrl: "wss://asset-hub-paseo-rpc.n.dwellir.com",
        tokenSymbol: "PAS",
        tokenDecimals: 10,
      },
    ],
  }),
);

test("signs a transfer", async ({ testHost }) => {
  await testHost.waitForConnection();
  await testHost.productFrame().getByRole("button", { name: "Send" }).click();

  const signed = await testHost.getSigningLog();
  expect(signed.length).toBeGreaterThan(0);
});
```

The fixture embeds your product in an iframe, signs in the dev accounts,
auto-signs signing requests, and proxies chain RPC to the chains you list.
`switchAccount`, `getSigningLog` and the permission, notification and chat logs
let tests check what the host did.

Each `networks` entry's `id` suffix sets its role (`-asset-hub`, `-people`,
`-bulletin`). If your app uses People or Bulletin, add entries for them from
[Networks & endpoints](../reference/networks.md). `productId` must be the name
your app signs as, because the host refuses a signing request scoped to
another product.

## Learn more

- [product-sdk](https://github.com/paritytech/product-sdk): SDK source
- [Claude Code plugin](https://github.com/paritytech/product-sdk#claude-code-plugin): agent skills for every SDK area. See the [developer quickstart](../getting-started/developers.md#build-with-claude-code)
- [Smart contracts](../architecture/contracts.md): contracts on Asset Hub
- [Identity & personhood](../architecture/identity.md): the model behind the precompile
