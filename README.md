# Polkadot App Docs

Documentation for the **Polkadot Products Devnet** and the **Polkadot app**.
The site serves two audiences: people trying the app, and developers building
Products for the Devnet. Pages should help readers understand what they can do,
how to get there, what might block them, and which tools or source repositories
can help when they need more detail.

Built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). The
site looks like the Polkadot app clients because it uses the app's own design
tokens. Everything visual lives in `material-overrides/`:

- `assets/stylesheets/tokens.css` — **generated, do not edit**. Primitives,
  typescale, and the semantic colour roles for the four app themes (`berlin`
  default, `tokyo`, `malta`, `lisbon`), each in light and dark. Regenerate with
  `tools/build-design-tokens.mjs` from `@novasamatech/tr-ui` (themes) and
  `paritytech/polkadot-app-design-system` (typescale); see the script header.
- `assets/stylesheets/fonts.css` — self-hosted Inter, Manrope and Martian Mono
  (variable woff2 under `assets/fonts/`).
- `assets/stylesheets/chrome.css` — Material bridge variables and the shell:
  header, tabs, search, sidebars, TOC, footer, banner, theme-picker popover,
  article panel and page grid.
- `assets/stylesheets/content.css` — everything inside `.md-typeset`: headings,
  prose, code, tables, admonitions, tabs, figures.
- `assets/stylesheets/components.css` — home page, cards, chips, updates
  section, buttons.
- `assets/stylesheets/diagrams.css` — Mermaid diagram styling, per-chain
  colours and the zoom lightbox.
- `assets/javascripts/theme-picker.js` — header theme picker; persists the
  choice in `localStorage['dg-theme']`, applied pre-paint by `main.html`.
  Light/dark is Material's palette toggle (first visit follows the OS); the
  dark scheme is swapped for light while printing.

Rules: colours, radii, spacing and type come from token variables only (no raw
hex outside `tokens.css`); `mkdocs.yml` `extra_css` order is fonts, tokens, then
the consumer layers. Content is plain Markdown under `docs/`; keep layout and
styling out of content pages so they stay portable.

## Develop locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Then open http://127.0.0.1:8000.

To produce a static build:

```bash
mkdocs build   # outputs to ./site
```

## Structure

| Section | Path | What it covers |
| --- | --- | --- |
| Home | `docs/index.md` | Gentle entry point into the documentation |
| Introduction | `docs/introduction.md` | Mental model, main flows, and where to go next |
| Getting started | `docs/getting-started/` | First steps for users and developers |
| Architecture | `docs/architecture/` | How the platform pieces fit together |
| Guides | `docs/guides/` | Task-oriented walkthroughs |
| Reference | `docs/reference/` | Networks, packages, addresses, glossary, links |

## Editorial guidance

Every factual claim in these docs should be traceable to source: a package, a
contract, a runtime, a deployment register, or an official reference. If we have
not verified something, say that plainly instead of smoothing over the gap.

Write for the reader's next action. Each page should make it clear what the
reader can do, the steps to get there, the caveats they may hit, and the tools
or resources that help. Keep implementation details in source links unless they
directly help the reader complete the task.
