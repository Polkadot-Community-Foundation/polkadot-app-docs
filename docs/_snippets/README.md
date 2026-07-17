# Snippets

Single-source blocks included with `--8<--` by `pymdownx.snippets`.

These exist because the same facts were previously re-typed on many pages and
drifted apart. If a block here is needed on a page, include it — do not paste a
copy:

```markdown
--8<-- "reference-apps.md"
```

| Snippet | Owns | Included by |
| --- | --- | --- |
| `reference-apps.md` | The list of deployed reference Products | `reference/resources.md`, `guides/discover-and-open-apps.md` |
| `install-app.md` | Where to get the Polkadot app | `reference/resources.md`, `getting-started/users.md` |

Everywhere else links to the owning reference page instead of repeating the
block. This directory is excluded from the built site via `exclude_docs`.
