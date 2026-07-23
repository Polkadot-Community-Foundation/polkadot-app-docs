For a hackathon you do not need to import a seed phrase or set a keystore
password. Mint a fresh account and hand its mnemonic to the CLIs through the
environment:

```bash
# One fresh BIP-39 mnemonic, generated with the crypto that ships inside the CLIs
export MNEMONIC="$(NODE_PATH="$(npm root -g)/@polkadot-community-foundation/dotns-cli/node_modules" \
  node -e 'const c=require("@polkadot/util-crypto");c.cryptoWaitReady().then(()=>console.log(c.mnemonicGenerate()))')"

export DOTNS_MNEMONIC="$MNEMONIC"   # dotns signs with this — no `dotns auth set`, no password
dotns account address               # the throwaway's address — fund THIS at the faucet
```

The same `$MNEMONIC` is what `pad` takes when it publishes (`--mnemonic
"$MNEMONIC"`), so one account both owns the name and deploys to it. It lives only
in this shell session: save the phrase if you want to keep the name, or discard
it and the account is genuinely throwaway.

!!! danger "Set a key, or you sign as a shared account"
    With neither `DOTNS_MNEMONIC`/`DOTNS_KEY_URI` set nor `dotns auth set` run,
    `dotns` falls back to a **shared public dev account anyone can control**, and
    a name registered to it is **not yours** — anyone can transfer it away.
    `dotns` prints a warning on every command when it does.
