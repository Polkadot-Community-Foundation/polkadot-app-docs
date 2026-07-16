# Mermaid diagram styling

Two things style the docs' Mermaid diagrams, and **both are global** — they apply
to every diagram on every page automatically, with no per-diagram edits.

## 1. Base look (CSS) — `theme.css`

Every diagram gets: rounded nodes, surface-matched fills, quiet edges, pill-shaped
monospace edge labels, dashed rounded subgraph clusters, and full light/dark
support. Nothing to opt into.

## 2. Per-chain colour (JS) — `mermaid-chain-colors.js`

`material-overrides/assets/javascripts/mermaid-chain-colors.js` runs after each
diagram renders and colours nodes by matching their **label text** to a keyword
table, so each system chain / actor gets its stable hue everywhere:

| Hue | Applied when the node label mentions | Class |
| --- | --- | --- |
| Polkadot pink | relay, root of trust | `relayNode` |
| Indigo | Asset Hub, pallet-revive, contract, CDM, precompile | `assethubNode` |
| Sky | People, identity, personhood, CASH, username, Coinage | `peopleNode` |
| Teal | Bulletin, bundle, CID, content storage | `bulletinNode` |
| Amber | developer, author, publisher | `developerNode` |
| Violet | DotNS, `.dot`, naming, resolver, contenthash | `dotnsNode` |
| Sky | gateway, dev-dot.li, Browse, directory | `gatewayNode` |
| Green | user, wallet | `userNode` |

Process/step nodes that match nothing stay neutral — which is the intended look.
The colours themselves live in `theme.css` as `--dg-*` tokens; the JS only adds
classes.

### Tuning globally

- **Change a hue:** edit the `--dg-*` token in `theme.css`.
- **Change what matches:** edit the `RULES` table in `mermaid-chain-colors.js`
  (order = priority, first match wins).

### Overriding a single diagram

If you want a specific node coloured differently from what the keywords pick,
set it explicitly in the diagram source — the JS respects any node that already
has a chain class:

```text
  classDef assethubNode stroke-width:1px;
  class MyNode assethubNode
```

`docs/architecture/network.md` shows this explicit form on both diagrams.

## Scope note

The keyword colouring targets **flowchart / graph** nodes (`g.node`). Sequence
diagrams (participants) and other diagram types still get the base CSS look and
the scheme colours, but not per-participant hues — extend
`mermaid-chain-colors.js` if you want that later.
