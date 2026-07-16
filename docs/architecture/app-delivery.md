# App delivery

This page follows a built frontend as it becomes a live app on the Polkadot
Products Devnet. The path is concrete: publish a static bundle with the `pad`
CLI, store the content on the Bulletin chain, bind a `.dot` domain to it, and load
it through the `dev-dot.li` gateway or the Polkadot app.

App delivery is deliberately layered so that no single server sits between a user
and an app. Content lives on-chain (Bulletin), the pointer to it lives on-chain
(a `.dot` domain resolver on Asset Hub), and the loader is a client-side program
that reads both directly.

## The two pipelines at a glance

Delivery has a write side (publishing) and a read side (opening). The publisher
uploads a bundle and binds a name to it once; every visitor then resolves and
fetches that bundle independently.

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>publish pipeline</figcaption>
<div class="dg-flow col">
  <div class="dg-node developer"><div class="eb">Step 1</div><div class="tt">Built static app</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node developer"><div class="eb">pad CLI</div><div class="tt">Prepare bundle</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node bulletin"><div class="eb">Bulletin</div><div class="tt">Upload content</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node bulletin"><div class="eb">Bulletin</div><div class="tt">Receive content CID</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node dotns"><div class="eb">Asset Hub</div><div class="tt">DotNS</div><div class="sb">name ownership check</div></div>
  <div class="dg-edge"></div>
  <div class="dg-stage">
    <div class="dg-node dotns"><div class="eb">not owned</div><div class="tt">Register name</div></div>
    <div class="dg-node dotns"><div class="eb">owned</div><div class="tt">Use existing name</div></div>
  </div>
  <div class="dg-edge"></div>
  <div class="dg-node dotns"><div class="eb">Naming</div><div class="tt">Write contenthash</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node gateway"><div class="eb">Browse</div><div class="tt">Optional directory listing</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node gateway"><div class="eb">Gateway</div><div class="tt">Live</div><div class="sb">name.dot in app + https://name.dev-dot.li</div></div>
</div>
</figure>

## Publishing with `pad`

The deploy CLI is [`@parity/polkadot-app-deploy`](https://www.npmjs.com/package/@parity/polkadot-app-deploy),
which ships the `pad` binary (alongside `polkadot-app-deploy` and
`polkadot-app-bootstrap`). `pad` selects a network with `--env <network>`; the
concrete preset name is provided by the team operating the network. After
building your frontend, a publish is a single invocation over the output
directory:

```bash
npm i -g @parity/polkadot-app-deploy
pad ./dist my-app.dot --env <network>
```

The CLI prepares the static bundle, uploads the content, and binds the resulting
content identifier to the `.dot` domain. Re-publishing the same app updates that
name to point at the new content.

### Bulletin storage and upload authorization

Content is stored on the Bulletin chain. Uploads are authorization-based rather
than fee-based: the deploy account needs upload quota, but does not pay devnet
tokens for each bundle. Quota is granted by the network's **authorizer** (an
operator role) via `authorize_account`; a publisher cannot self-authorize. On the
devnet you request authorization for your deploy account from the operators, and
can inspect it in the [Bulletin Chain Console](https://paritytech.github.io/polkadot-bulletin-chain/authorizations).
See [Get storage authorization](../guides/build-and-publish.md#get-storage-authorization)
for the practical steps. This is separate from the token
[faucet](https://faucet.polkadot.io), which only provides native tokens for fees.

!!! note
    Authorizations are finite and expire. If a previously working deploy
    account starts failing at the upload step, its authorization likely lapsed
    and must be refreshed before uploads resume.

### Binding the `.dot` domain

Once the content CID exists, the CLI checks whether the signer owns the `.dot`
name. If the name is available, it can register it; if the signer already owns
it, the CLI updates the name's content hash. That single on-chain record is what
turns a name into an app. See [Naming (DotNS)](naming.md) for how ownership and
resolution fit together.

Optionally, `--publish` calls `Publisher.publish(label)` so directory apps such
as Browse can enumerate your app; it is silently skipped on networks that have
no Publisher contract configured. See [App discovery (Browse)](discovery.md).

!!! tip
    A deploy config can also publish manifest records. Product apps use those
    records to describe executables, labels, and icons to the host.

## Opening an app through the gateway

The web gateway at [https://dev-dot.li](https://dev-dot.li) is a client-side
loader. There is no resolution server: the host shell reads the label from the
subdomain, resolves it, fetches the content, and renders it in a sandboxed
iframe.

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>open pipeline</figcaption>
<div class="dg-flow col">
  <div class="dg-node user"><div class="eb">User</div><div class="tt">Opens survey.dev-dot.li</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node gateway"><div class="eb">Gateway</div><div class="tt">Read label</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node dotns"><div class="eb">Naming</div><div class="tt">Resolve survey.dot</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node dotns"><div class="eb">Resolver</div><div class="tt">Read contenthash</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node dotns"><div class="eb">Resolver</div><div class="tt">Decode to CID</div></div>
  <div class="dg-edge"></div>
  <div class="dg-node gateway"><div class="eb">Gateway</div><div class="tt">Render app in sandbox</div></div>
  <div class="dg-edge"><span class="lb">fetch content</span></div>
  <div class="dg-stage">
    <div class="dg-node bulletin"><div class="eb">Bulletin / light client</div><div class="tt">Verified path</div></div>
    <div class="dg-node gateway"><div class="eb">IPFS gateway</div><div class="tt">Gateway path</div></div>
  </div>
  <div class="dg-edge"></div>
  <div class="dg-node user"><div class="eb">Host API</div><div class="tt">App uses bridge</div></div>
</div>
</figure>

The rendered app talks to the host through a bridge for accounts, signing, chain
connection, and scoped storage. From the user's perspective, the same name works
in both places: on the web it is `https://<label>.dev-dot.li`, and in the
Polkadot app it is `<label>.dot`.

## Common blockers

- **Upload fails.** The deploy account may need Bulletin storage authorization.
- **The name cannot be updated.** The signer must own the `.dot` domain.
- **The app opens but has stale content.** Confirm the name's content hash points
  to the latest CID and that the gateway is resolving the expected network.
- **The app is live but hard to find.** Use `--publish` so Browse can list it.

## Learn more

- [`@parity/polkadot-app-deploy` on npm](https://www.npmjs.com/package/@parity/polkadot-app-deploy)
- [polkadot-app-deploy source](https://github.com/paritytech/polkadot-app-deploy)
- [dotli-community — the gateway loader](https://github.com/paritytech/dotli-community)
- [dotli-starter — reference app template](https://github.com/paritytech/dotli-starter)
- [polkadot-bulletin-chain (upstream)](https://github.com/paritytech/polkadot-bulletin-chain)
- [Naming (DotNS)](naming.md) · [The network](network.md) · [Smart contracts & CDM](contracts.md)
- [Guide: build and publish a dApp](../guides/build-and-publish.md)
- [Polkadot developer docs](https://docs.polkadot.com)
