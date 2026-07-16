# The network

The Polkadot Products Devnet is a public developer preview that runs on the
community-operated **Paseo** network: a Paseo relay chain plus a set of system
parachains. Applications are built against three of those chains — **Asset Hub**,
**People**, and **Bulletin**. This page maps what each chain is responsible for
and how they fit together when a Product is deployed and opened.

!!! note
    This is a devnet. Tokens have no real value, and flows may still change.
    Never paste secrets (mnemonics, seed phrases, private keys) into any tool or
    page.

## Topology

The relay chain is the root of trust. Product flows mostly touch three system
parachains: **Asset Hub** for contracts and assets, **People** for identity and
money flows, and **Bulletin** for web-app bundle storage.

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>Chain topology</figcaption>
<svg viewBox="0 0 756 274" style="width:100%;height:auto;display:block;overflow:visible">
<defs><marker id="topo-arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6 Z" fill="var(--ink3,#a8a29e)"/></marker></defs>
<path d="M378,88 V130 H120 V166" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#topo-arrow)"/>
<path d="M378,88 V166" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#topo-arrow)"/>
<path d="M378,88 V130 H636 V166" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#topo-arrow)"/>
<path d="M232,206 H260" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#topo-arrow)"/>
<path d="M490,206 H520" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#topo-arrow)"/>
<foreignObject x="0" y="0" width="756" height="274"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:756px;height:274px;font-family:'DM Sans',sans-serif">
<div style="position:absolute;left:278px;top:14px;width:200px;padding:var(--pad,12px 15px);background:color-mix(in srgb,var(--acc,#ff2867) 9%,var(--surface,#fff));border:1px solid color-mix(in srgb,var(--acc,#ff2867) 34%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--acc,#ff2867)">Root of trust</div><div style="margin-top:6px;font:600 15px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">Paseo relay chain</div></div>
<div style="position:absolute;left:8px;top:166px;width:224px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#0ea5e9 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#0ea5e9 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#0ea5e9">para 1004</div><div style="margin-top:6px;font:600 15px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">People</div><div style="margin-top:3px;font:400 12px/1.4 'DM Sans',sans-serif;color:var(--ink2,#57534e)">identity + proof-of-personhood</div></div>
<div style="position:absolute;left:266px;top:166px;width:224px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#6366f1 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#6366f1 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#6366f1">para 1000</div><div style="margin-top:6px;font:600 15px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">Asset Hub</div><div style="margin-top:3px;font:400 12px/1.4 'DM Sans',sans-serif;color:var(--ink2,#57534e)">contracts · assets · DotNS</div></div>
<div style="position:absolute;left:524px;top:166px;width:224px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#14b8a6 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#14b8a6 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#14b8a6">para 1010</div><div style="margin-top:6px;font:600 15px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">Bulletin</div><div style="margin-top:3px;font:400 12px/1.4 'DM Sans',sans-serif;color:var(--ink2,#57534e)">web-app bundle storage</div></div>
<div style="position:absolute;left:180px;top:138px;transform:translateY(-50%);padding:2px 8px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10.5px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e);white-space:nowrap">identity + CASH</div>
<div style="position:absolute;left:505px;top:138px;transform:translate(-50%,-50%);padding:2px 8px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10.5px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e);white-space:nowrap">contenthash → CID</div>
</div></foreignObject></svg>
</figure>

| Chain | Para ID | Role |
| --- | --- | --- |
| Relay | — | Root of trust; anchors the system parachains |
| Asset Hub | 1000 | Contracts (PolkaVM/EVM), assets, DotNS gateway |
| People | 1004 | Identity and proof-of-personhood |
| Bulletin | 1010 | Web-app content storage |

## Asset Hub <span class="dg-chip" style="--chip:#6366f1">para 1000</span>

Asset Hub is the primary chain for Product developers. It carries the contract,
asset, and naming machinery used by deployed apps.

### pallet-revive (PolkaVM contracts)

`pallet-revive` provides the PolkaVM smart-contract environment. CDM, DotNS, and
application contracts run here.

### Assets suite and ERC-20 precompiles

Asset Hub exposes on-chain assets to contracts through ERC-20-style precompiles,
so Product contracts can read and transfer supported assets without learning
Substrate storage details.

### DotNS gateway

The DotNS gateway connects `.dot` domains to the contract environment. For how
names resolve to app bundles, see [Naming](./naming.md).

### Personhood precompile

Contracts on Asset Hub can read proof-of-personhood through a precompile. That
lets apps ask for a user's personhood tier without calling the identity backend.

## People <span class="dg-chip" style="--chip:#0ea5e9">para 1004</span>

The People chain holds identity, proof-of-personhood, and Coinage state. It is
where usernames are attested, personhood status is recorded, and CASH is held
and sent through Coinage.

## Bulletin <span class="dg-chip" style="--chip:#14b8a6">para 1010</span>

The Bulletin chain stores published web-app bundles that the gateway serves.

!!! note
    Bulletin uploads are **authorization-based, not fee-based**. Rather than
    charging tokens per upload, storage is gated by an authorizer (Root, sibling
    parachains, or registered authorizers). This is why publishing an app bundle
    does not consume devnet tokens.

## The deployments register

Concrete addresses, endpoints, and CIDs for a given deployment are recorded in the
[`summit-net-deployments`](https://github.com/paritytech/summit-net-deployments)
register, not hard-coded in this documentation. Treat that register, plus the
tooling address books, as the source of truth for live Devnet addresses.

Command-line tools select a network preset (`--env <network>` for `pad` and
`dotns`, `-n/--name <network>` for CDM); the concrete name for a given
deployment is provided by the team operating that network. Read addresses and
CIDs from the register files rather than assuming them.

## Deploy and serve flow

The three chains combine into a single application lifecycle:

<figure class="dg-figure">
<figcaption class="dg-figcaption"><span class="dot"></span>Publish → resolve → use</figcaption>
<svg viewBox="0 0 756 300" style="width:100%;height:auto;display:block;overflow:visible">
<defs><marker id="flow-arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6 Z" fill="var(--ink3,#a8a29e)"/></marker></defs>
<path d="M168,154 H186 V63 H214" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#flow-arrow)"/>
<path d="M168,154 H214" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#flow-arrow)"/>
<path d="M168,154 H186 V245 H214" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#flow-arrow)"/>
<path d="M354,192 V206" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#flow-arrow)"/>
<path d="M560,107 H526 V154 H494" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#flow-arrow)"/>
<path d="M654,200 V148" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#flow-arrow)"/>
<path d="M560,237 H534 V63 H494" fill="none" stroke="var(--border2,#d6d3d1)" stroke-width="1.5" marker-end="url(#flow-arrow)"/>
<foreignObject x="0" y="0" width="756" height="300"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:756px;height:300px;font-family:'DM Sans',sans-serif">
<div style="position:absolute;left:196px;top:8px;width:316px;height:284px;border:1.5px dashed color-mix(in srgb,var(--ink3,#a8a29e) 55%,transparent);border-radius:16px;background:color-mix(in srgb,var(--ink3,#a8a29e) 4%,transparent)"></div>
<div style="position:absolute;left:206px;top:14px;font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3,#a8a29e)">Paseo · system parachains</div>
<div style="position:absolute;left:8px;top:117px;width:160px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#f59e0b 9%,var(--surface,#fff));border:1px solid color-mix(in srgb,#f59e0b 34%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#f59e0b">Actor</div><div style="margin-top:6px;font:600 15px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">Developer</div></div>
<div style="position:absolute;left:214px;top:26px;width:278px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#6366f1 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#6366f1 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#6366f1">Asset Hub</div><div style="margin-top:6px;font:600 14.5px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">pallet-revive contract</div></div>
<div style="position:absolute;left:214px;top:117px;width:278px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#8b5cf6 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#8b5cf6 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#8b5cf6">Naming</div><div style="margin-top:6px;font:600 14.5px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">DotNS · .dot domain + resolver</div></div>
<div style="position:absolute;left:214px;top:208px;width:278px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#14b8a6 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#14b8a6 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#14b8a6">Bulletin</div><div style="margin-top:6px;font:600 14.5px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">bundle storage · CID</div></div>
<div style="position:absolute;left:560px;top:70px;width:188px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#0ea5e9 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#0ea5e9 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#0ea5e9">Gateway</div><div style="margin-top:6px;font:600 14.5px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">dev-dot.li</div></div>
<div style="position:absolute;left:560px;top:200px;width:188px;padding:var(--pad,12px 15px);background:color-mix(in srgb,#22c55e 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,#22c55e 32%,var(--border,#e7e5e4));border-radius:13px"><div style="font:600 10px/1 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#22c55e">Actor</div><div style="margin-top:6px;font:600 15px/1.2 'DM Sans',sans-serif;color:var(--ink,#1c1917)">App / web user</div></div>
<div style="position:absolute;left:191px;top:90px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">deploy</div>
<div style="position:absolute;left:191px;top:140px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">reserve</div>
<div style="position:absolute;left:191px;top:222px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">upload</div>
<div style="position:absolute;left:388px;top:199px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">CID</div>
<div style="position:absolute;left:525px;top:130px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">resolve</div>
<div style="position:absolute;left:654px;top:174px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">open</div>
<div style="position:absolute;left:533px;top:150px;transform:translate(-50%,-50%);padding:2px 7px;background:var(--surface,#fff);border:1px solid var(--border,#e7e5e4);border-radius:999px;font:500 10px/1.3 'DM Mono',monospace;color:var(--ink2,#57534e)">contract calls</div>
</div></foreignObject></svg>
</figure>

A developer deploys contracts to Asset Hub via `pallet-revive`, reserves a `.dot`
name through the DotNS gateway, and uploads the web bundle to Bulletin. The name's
contenthash resolver is bound to the bundle's CID, and the gateway at
[https://dev-dot.li](https://dev-dot.li) serves the app at `https://<label>.dev-dot.li`.
For how contracts and naming fit together, see the
[contracts](./contracts.md) and [naming](./naming.md) architecture pages, and the
[developer guides](../guides/index.md).

## Learn more

- [paseo-network/runtimes — chain runtimes](https://github.com/paseo-network/runtimes)
- [summit-net-deployments — deployments register](https://github.com/paritytech/summit-net-deployments)
- [pallet-revive (contracts / PolkaVM)](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/revive)
- [pallet-assets ERC-20 precompiles](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame/assets/precompiles)
- [Polkadot developer documentation](https://docs.polkadot.com)
- [Web gateway (public developer preview)](https://dev-dot.li)
