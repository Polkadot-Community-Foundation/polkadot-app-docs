# Snippets

Single-source blocks included with `--8<--` by `pymdownx.snippets`.

These exist because the same facts used to be re-typed on many pages and
drifted apart. If a page needs one of these blocks, include it. Do not paste a
copy:

```markdown
--8<-- "reference-apps.md"
```

| Snippet | Owns | Included by |
| --- | --- | --- |
| `reference-apps.md` | The list of deployed reference Products | `reference/resources.md`, `guides/discover-and-open-apps.md`, `guides/build-and-publish.md` |
| `install-app.md` | Where to get the Polkadot app | `reference/resources.md`, `getting-started/users.md` |
| `install-clis.md` | Installing the CLIs, incl. the Node version floor | `getting-started/developers.md`, `guides/build-and-publish.md` |
| `faucet.md` | Getting devnet funds: which chain, which address | `guides/create-account.md`, `reference/networks.md` |
| `throwaway-account.md` | Minting a throwaway CLI signing account | `getting-started/developers.md`, `guides/register-a-dot-name.md` |

Everywhere else links to the owning reference page instead of repeating the
block. This directory is excluded from the built site via `exclude_docs`.
