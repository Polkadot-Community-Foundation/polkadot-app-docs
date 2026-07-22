!!! warning "Node.js 22 or newer"
    `pad` and `cdm` both require Node 22+. On Node 20 they fail at startup with
    an unrelated-looking error (a module `SyntaxError`, or
    `Missing WebSocket class`). Check with `node --version` before installing.

```bash
npm i -g @polkadot-community-foundation/dotns-cli            # dotns
npm i -g @polkadot-community-foundation/polkadot-app-deploy  # pad, pad-bootstrap
npm i -g @polkadot-community-foundation/cdm-cli              # cdm
```

Install only what you need: `pad` publishes (and can register the name for
you), `dotns` manages names in depth, `cdm` is only for contracts. The first two
are large — expect a few minutes and roughly 1.5 GB across the global prefix and
the npm cache, with no progress output while npm works.
