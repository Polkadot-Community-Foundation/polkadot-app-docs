# Deploy & register contracts

Deploy a PolkaVM (PVM) smart contract to the Devnet Asset Hub and register it in
the Contract Dependency Manager (CDM), so other projects and frontends resolve it
by name. One `cdm deploy` builds the contracts, publishes each contract's
metadata (ABI plus readme) to the Bulletin Chain as a content-addressed CID,
instantiates the contracts on Asset Hub, and records
`@org/name -> address + metadata` in the on-chain `ContractRegistry` — the
instantiations and the registration in a single atomic batch. For the registry
model itself, see [Smart contracts & CDM](../architecture/contracts.md).

!!! warning "Registry entries are permanent"
    The first account to publish a name owns it, and the registry is
    append-only: an entry cannot be deleted, renamed or reassigned. Getting the
    package name and the signing account right *before* the first deploy is most
    of what this page is about.

## Prerequisites

Do these in order — each step depends on the one before it.

**1. Install the CLI, then its build toolchain.** Install `cdm` (see
[Packages & tools](../reference/packages.md#command-line-tools)), then:

```bash
cdm setup          # installs rustup, Rust nightly + rust-src, and cargo-pvm-contract
cdm setup --check  # re-run the checks without installing anything
```

The npm package ships the CLI and nothing else — it has no install hooks and sets
up nothing Rust-shaped. `cdm setup` is what makes `cdm build` work, and it is
also what keeps `cargo-pvm-contract` in step with the SDK your contracts compile
against. It is safe to re-run.

**2. Name the network explicitly, every time.** Every command that touches a
chain takes `-n devnet` (`init`, `account …`, `build`, `deploy`, `install`);
`template`, `setup` and `update` take no `-n` at all. The valid presets are
`polkadot`, `paseo`, `paseo-next`, `w3s`, `devnet` and `local`. Do not check that
against `--help`: its preset lists are stale and omit `devnet`. A bare `cdm init`
defaults to `paseo`, which is a different network.

**3. Create or import the deploy account.**

```bash
cdm init -n devnet                                         # generate a new key
cdm account set -n devnet --mnemonic "<12 or 24 words>"    # or import one
```

Both save the account to `~/.cdm/accounts.json` and print its address; `cdm init`
also prints the new **mnemonic to stdout**, so store it and treat that scrollback
as a secret. Neither command creates any project files.

**4. Fund the account on the Devnet Asset Hub.** Contracts deploy to Asset Hub,
so that is the chain the balance has to be on — funding the relay chain or
another parachain leaves `cdm` reading zero, with no error connecting the two.
See [Faucet](../reference/networks.md#faucet).

**5. Map the account for `pallet-revive`.**

```bash
cdm account map -n devnet
```

Required before the first deploy. `cdm deploy` does not do this for you: an
unmapped account fails in the dry run with a raw `Revive.AccountUnmapped`
dispatch error that mentions neither mapping nor this command. `cdm account map`
operates on the **saved** account only — a good reason to prefer a saved account
over `--suri`.

**6. Get a Bulletin storage authorization.** A deploy publishes each contract's
metadata to the Bulletin Chain, spending one storage-authorization transaction
per contract, so the deploy account needs a live authorization of its own —
granted exactly as for publishing an app, in
[Get storage authorization](build-and-publish.md#get-storage-authorization).

One command shows the result of steps 3–6 at once:

```bash
cdm account bal -n devnet
```

It prints the address, its Asset Hub balance and its Bulletin allowance. Run it
before every deploy: it is also the only way to confirm *which* account you are
about to sign with.

## Step 1 — Start from a template

A CDM project is a Rust (or Foundry/Hardhat) workspace in which each contract
declares its package name — and the packages it calls — under
`[package.metadata.cdm]` in its own `Cargo.toml`:

```toml
[package.metadata.cdm]
package = "@myteam/counter-writer"
dependencies = ["@myteam/counter"]
```

`cdm template` with no argument **lists** the templates and writes nothing. Pass
a name to scaffold:

```bash
cdm template                       # lists: shared-counter, hardhat-counter, instagram, foundry-counter
cdm template shared-counter [dir]  # writes the project, printing every file it creates
```

`foundry-counter` and `hardhat-counter` additionally need Foundry or Hardhat
installed.

!!! warning "Templates track upstream `main`"
    A scaffold pins `cdm` and `pvm-contract-sdk` to `branch = "main"`, so it
    compiles against whatever those repositories are today and can fail on code
    you did not write. With `cdm-cli` 0.8.26 the flagship `shared-counter` does
    not build as shipped: its `counter` contract is rejected for an explicit
    `#[slot(0)]` on a sub-word field (deleting that one attribute makes it
    build), and the two contracts that call it through `cdm::import!` then fail
    to resolve the import. A failure of this shape is the template, not your
    toolchain or your account; report it upstream.

!!! warning "Rename before you build"
    Templates ship `@example/*` package names that are **already registered**.
    Change `[package.metadata.cdm] package` in every contract `Cargo.toml`, and
    every `dependencies` entry that refers to them, to a scope you control.
    Deploying under a name someone else owns is rejected; deploying under a free
    name claims it forever.

## Step 2 — Build

```bash
cdm build -n devnet
```

Pass `-n devnet` so the registry address compiled into the contracts is the
Devnet one. Each contract produces two artifacts:

- `target/release/<crate>.polkavm` — the bytecode that gets instantiated;
- `target/release/<crate>.abi.json` — the ABI that gets **published as the
  package's metadata**.

**Check that both exist before deploying.** If the ABI file is missing, the
deploy still succeeds and publishes an empty ABI — a registry entry nothing can
consume, and one you cannot repair. If it is missing, re-run `cdm setup`: the ABI
is generated by `cargo-pvm-contract`, and an installed build of it older than the
SDK your contracts pin emits no ABI at all while the contract build stays green.

`cdm build` in a directory with no workspace prints a single `Root:` line and
exits 0. A green run is not evidence that anything was built — look for the
per-contract progress bars and for the artifacts above.

## Step 3 — Deploy and register

!!! danger "Always deploy with your own key"
    If no `--suri` is given and no account is saved for the preset, `cdm` signs
    as the well-known development account **Alice**, whose key everyone has. It
    prints no warning, and a deploy never names the signer at all. The package
    name is then owned by Alice, permanently, and cannot be taken back. Confirm
    the account with `cdm account bal -n devnet` before every deploy.

```bash
cdm deploy -n devnet
```

signs with the account saved for the preset. To pass a key inline instead:

```bash
cdm deploy -n devnet --suri "<12 or 24-word mnemonic>"
```

Despite the name, `--suri` is not a full Substrate secret URI. It accepts a dev
derivation (`//Alice`) or a plain BIP-39 mnemonic, sr25519 only; derivation paths
and `///password` forms either fail to decode or silently derive a *different*
account from the dev phrase. A saved account keeps the phrase out of your shell
history, and is the only form `cdm account map` accepts.

A deploy resolves the network preset and the signer, builds, dry-runs each
instantiation for gas and its deterministic CREATE2 address, publishes each
contract's metadata to Bulletin, and submits every instantiation together with
`registry.publishLatest` in one atomic `Utility.batch_all`. The only other option
worth knowing is `--bootstrap`, which deploys a `ContractRegistry` first — use it
only on a network that has none.

The output is five lines: the two chain endpoints, the registry address, one row
per contract, and links to the extrinsic and to the metadata CID. It does not
print the signing account, the untruncated contract address or the registered
version, and it writes no local file. Recover the address from the linked
explorer page, or from Step 4.

## Step 4 — Verify the package resolves

A deploy is not done until something can consume it. In an empty directory:

```bash
cdm install @your/name -n devnet
```

A good result prints the version, metadata CID and address, and writes
`.cdm/contracts/@your/name/<version>/abi.json`. If it prints
`No ABI found in metadata`, the registry entry resolved but its metadata carries
no ABI: nothing can call that contract by name, and because the registry is
append-only you can only publish a new version, never repair that one. Do this
before you depend on a package or hand its name to anyone.

The [CDM Frontend](https://contracts.dev-dot.li) browses the same registry, but
it is itself a Product resolved client-side through the gateway — a blank page
means the name did not resolve for you, not that your deploy failed. The CLI
round-trip above is the check that carries information.

## Step 5 — Consume a published contract

From the consuming project:

```bash
cdm install @org/name -n devnet     # latest version
cdm install @org/name:3 -n devnet   # pinned version
cdm install -n devnet               # everything listed in cdm.json
```

`install` reads the registry, resolves the version, fetches the metadata by CID
from the Bulletin IPFS gateway, and writes `cdm.json` — dependencies, a
`contracts` entry with `version`, `address`, `abi` and `metadataCid`, and the
registry address it resolved against — plus
`.cdm/contracts/<name>/<version>/{abi,info,metadata}.json`.

The header line `Rust  Solidity  TypeScript` reports which code generators ran,
and each is enabled by what is already in the directory: Rust by a `Cargo.toml`,
TypeScript by a `package.json`, Solidity by a buildable Foundry or Hardhat
project. In a bare directory all three are off, and you get `cdm.json` and the
`.cdm` artifacts only — no TypeScript augmentation, no Solidity imports, no
`tsconfig` patch.

The first install connects to a public RPC and downloads chain metadata; several
minutes showing nothing but a spinner is normal, and a warm repeat still takes
about a minute.

At runtime a frontend performs the same resolution: read the registry address for
the selected network with `getRegistryAddress("devnet")` — never hard-code it, it
differs per network — build a registry handle with
`@parity/product-sdk-contracts`, and call the registry getters. Your contract's
ABI comes from `cdm.json` (or from the metadata CID), which is what makes the
calls typed. See
[How a frontend resolves a contract](../architecture/contracts.md#how-a-frontend-resolves-a-contract).

## Learn more

- [contract-dependency-manager (PCF fork)](https://github.com/Polkadot-Community-Foundation/contract-dependency-manager) — the source of the `cdm` you installed. Its README documents a different install channel (`install.sh`) and uses `-n paseo` throughout; here, use `cdm setup` and `-n devnet`.
- [Smart contracts & CDM](../architecture/contracts.md) — the registry model
- [CDM Frontend](https://contracts.dev-dot.li) — browse what is already published
