`pad` requires Node.js 22 or newer. On Node 20 it fails at startup with an
unrelated-looking error (a module `SyntaxError`, or `Missing WebSocket class`),
so check with `node --version` before installing.

```bash
npm i -g @polkadot-community-foundation/dotns-cli@latest            # dotns
npm i -g @polkadot-community-foundation/polkadot-app-deploy@latest  # pad, pad-bootstrap
```

Install only what you need: `pad` publishes (and can register the name for
you), and `dotns` manages names in depth. Both are large. Expect a few minutes
and roughly 1.5 GB across the global prefix and the npm cache, with no progress
output while npm works.

Always take the latest release. These CLIs carry the current contract addresses
and network presets inside them, so an older copy can talk to a retired
deployment and report success while nothing changes. To upgrade one you already
have, re-run the same command.

On some ARM64 platforms (for example Termux on Android), a transitive
dependency, `node-datachannel`, ships no prebuilt binary, and its native build
fails during `npm i -g`. It is only used for optional peer-to-peer CID
verification, so skip the build with `--ignore-scripts`:

```bash
npm i -g --ignore-scripts @polkadot-community-foundation/dotns-cli@latest
```

In this mode only the peer-to-peer verification path is unavailable. The CLI's
gateway-based CID verification still works.
