# PR package — Dark-default theme + automatic per-chain diagram colouring

> This folder mirrors the repo layout. Copy each file to the matching path in
> `polkadot-app-docs`, commit on a dedicated branch, and open the PR with the
> title/description below. (Prepared here because the design tool has read-only
> GitHub access and can't push branches or open PRs directly.)

## Suggested branch

```
redesign/dark-default-diagram-theming
```

## Files in this package → destination

| This package | Copy to |
| --- | --- |
| `pr/material-overrides/assets/stylesheets/theme.css` | `material-overrides/assets/stylesheets/theme.css` |
| `pr/material-overrides/assets/javascripts/mermaid-chain-colors.js` | `material-overrides/assets/javascripts/mermaid-chain-colors.js` |
| `pr/mkdocs.yml` | `mkdocs.yml` |
| `pr/docs/architecture/network.md` | `docs/architecture/network.md` |
| `pr/docs/AUTHORING-diagrams.md` | `docs/AUTHORING-diagrams.md` (contributor note; optional) |

## Apply

```bash
git checkout -b redesign/dark-default-diagram-theming
# from the repo root, with this package available:
mkdir -p material-overrides/assets/javascripts
cp <pkg>/material-overrides/assets/stylesheets/theme.css material-overrides/assets/stylesheets/theme.css
cp <pkg>/material-overrides/assets/javascripts/mermaid-chain-colors.js material-overrides/assets/javascripts/mermaid-chain-colors.js
cp <pkg>/mkdocs.yml mkdocs.yml
cp <pkg>/docs/architecture/network.md docs/architecture/network.md
cp <pkg>/docs/AUTHORING-diagrams.md docs/AUTHORING-diagrams.md
mkdocs serve      # verify light + dark, then diagrams across several pages
git add -A && git commit -m "Dark-default theme + automatic per-chain Mermaid diagram colouring"
git push -u origin redesign/dark-default-diagram-theming
gh pr create --fill   # or open via the GitHub UI
```

---

## PR title

**Dark-default docs theme + automatic per-chain Mermaid diagram colouring**

## PR description

Moves the docs to a dark-first, black-and-white-forward identity and gives every
Mermaid diagram a modern treatment — including per-chain colour coding applied
**automatically across all diagrams**, no per-page edits.

### What changes

- **Dark scheme is now the default.** `mkdocs.yml` palette leads with
  `polkadot-dark` and drops the `prefers-color-scheme` media queries, so the
  docs open dark for everyone; the header toggle still switches to light. Both
  schemes remain fully defined in `theme.css`.
- **Selected nav / TOC items use the primary text colour** (white in dark)
  instead of pink; the accent is reserved for links, buttons, and diagram
  highlights.
- **Logo adapts to the scheme.** The white logo mark inverts to black in light
  mode via a `--logo-filter` token.
- **Global Mermaid restyle (every diagram, no per-diagram edits).** Rounded node
  shells matched to the current surface, quieter edges, dashed rounded subgraph
  clusters with monospace labels, and pill-shaped monospace edge labels. Driven
  from the existing design tokens, so it tracks the active colour scheme.
- **Automatic per-chain colour.** `mermaid-chain-colors.js` runs after each
  diagram renders and adds a chain/actor class to nodes by matching their label
  text (Asset Hub → indigo, People → sky, Bulletin → teal, DotNS → violet,
  gateway → sky, developer → amber, user → green, relay → pink). Process/step
  nodes that match nothing stay neutral — the intended look. The palette lives
  in `theme.css` (`--dg-*` tokens + `.<name>Node` rules); the JS only adds
  classes. Registered via `extra_javascript` in `mkdocs.yml`, so it applies to
  all ~39 diagrams site-wide.
- **Explicit override supported.** A diagram can set a node's class directly
  (`classDef` + `class`); the script respects any node that already has a chain
  class. `docs/architecture/network.md` demonstrates the explicit form.

### Design rationale

- Keeps the repo's "visual identity is a CSS task" principle: colours and all
  diagram styling stay centralised in `theme.css`. Content pages need no edits.
- Colouring is keyword-driven, so new diagrams are coloured the moment they're
  authored — nothing to remember.

### Tuning

- Change a hue → edit the `--dg-*` token in `theme.css`.
- Change what matches a hue → edit the `RULES` table in
  `mermaid-chain-colors.js`.
- See `docs/AUTHORING-diagrams.md` for the full contributor note.

### Testing

- `mkdocs serve`; confirm the site loads dark, the light toggle works and inverts
  the logo, and diagrams across several pages (`/architecture/network/`,
  `/architecture/`, `/architecture/contracts/`) show rounded nodes, pill edge
  labels, and chain-coloured nodes in both schemes.

### Notes / risk

- Mermaid DOM selectors (`g.node`, `.node > rect`, `.edgeLabel`, `.cluster`) are
  stable across Mermaid 10.x (bundled with mkdocs-material 9.7.x). If
  mkdocs-material / Mermaid is upgraded, re-check the selectors in the "Mermaid
  diagrams" section of `theme.css` and the `classify()` selector in
  `mermaid-chain-colors.js`.
- Per-chain colour targets flowchart/graph nodes; sequence-diagram participants
  keep the base look (see the scope note in `AUTHORING-diagrams.md`).
- A live mockup of the target look (dark, coloured diagrams) is in
  `Polkadot Docs — Design Audit.dc.html` at the project root.
