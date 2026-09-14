!!! warning "Node.js 22 or newer"
    `pad` and `cdm` both require Node 22+. On Node 20 they fail at startup with
    an unrelated-looking error (a module `SyntaxError`, or
    `Missing WebSocket class`). Check with `node --version` before installing.

```bash
npm i -g @polkadot-community-foundation/dotns-cli@latest            # dotns
npm i -g @polkadot-community-foundation/polkadot-app-deploy@latest  # pad, pad-bootstrap
npm i -g @polkadot-community-foundation/cdm-cli@latest              # cdm
```

Install only what you need: `pad` publishes (and can register the name for
you), `dotns` manages names in depth, `cdm` is only for contracts. The first two
are large — expect a few minutes and roughly 1.5 GB across the global prefix and
the npm cache, with no progress output while npm works.

Always take the latest release. These CLIs carry the current contract addresses
and network presets inside them, so an older copy can talk to a retired
deployment and report success while nothing changes. Re-run the same command to
upgrade one you already have.

!!! note "Installing on ARM64 (e.g. Termux / Android)"
    On some ARM64 platforms a transitive dependency (`node-datachannel`, used
    for optional peer-to-peer CID verification) ships no prebuilt binary, and its
    native build fails during `npm i -g`. Skip the build with `--ignore-scripts`:

    ```bash
    npm i -g --ignore-scripts @polkadot-community-foundation/dotns-cli@latest
    ```

    Only the peer-to-peer verification path is unavailable in this mode; the
    CLI's gateway-based CID verification still works.
