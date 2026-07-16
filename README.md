# Polkadot App Docs

Documentation for the **Polkadot Products Devnet** and the **Polkadot app**.
The site serves two audiences: people trying the app, and developers building
Products for the Devnet. Pages should help readers understand what they can do,
how to get there, what might block them, and which tools or source repositories
can help when they need more detail.

Built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). The
visual identity is intentionally **self-contained**, so a future restyle should
mostly be a CSS task:

- `material-overrides/assets/stylesheets/theme.css` — design tokens + the
  `polkadot-light` / `polkadot-dark` colour schemes.
- `material-overrides/assets/stylesheets/fonts.css` — self-hosted DM Sans.

Content is plain Markdown under `docs/`. Keep layout and styling concerns in the
two CSS files above whenever possible so content pages stay portable.

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
