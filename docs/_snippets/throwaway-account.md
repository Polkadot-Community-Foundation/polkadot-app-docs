For a hackathon, you don't need to import a seed phrase or set a keystore
password. Create a fresh account and pass its mnemonic to the CLIs through the
environment:

```bash
# One fresh BIP-39 mnemonic, generated with the crypto that ships inside the CLIs
export MNEMONIC="$(NODE_PATH="$(npm root -g)/@polkadot-community-foundation/dotns-cli/node_modules" \
  node -e 'const c=require("@polkadot/util-crypto");c.cryptoWaitReady().then(()=>console.log(c.mnemonicGenerate()))')"

export DOTNS_MNEMONIC="$MNEMONIC"   # dotns signs with this — no `dotns auth set`, no password
dotns account address               # the throwaway's address — fund THIS at the faucet
```

`pad` takes the same `$MNEMONIC` when it publishes (`--mnemonic "$MNEMONIC"`),
so one account both owns the name and deploys to it. The phrase only lives in
this shell session. Save it if you want to keep the name. If you discard it,
the account really is throwaway.

!!! danger "Set a key, or you sign as a shared account"
    With neither `DOTNS_MNEMONIC`/`DOTNS_KEY_URI` set nor `dotns auth set` run,
    `dotns` falls back to a shared public dev account that anyone can control.
    A name registered to it is not yours, and anyone can transfer it away.
    `dotns` prints a warning on every command when this happens.
