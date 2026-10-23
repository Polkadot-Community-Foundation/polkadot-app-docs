# Discover & open apps

You can find apps on the Polkadot Products Devnet in Browse, open them by their
`.dot` domain, or follow a `dev-dot.li` link in any browser. If you don't have
the Polkadot app yet, [Get the app](../reference/resources.md#get-the-app) has
the Android, iOS and desktop downloads. Without it, the web gateway at
<https://dev-dot.li> opens apps in a browser.

## Ways to reach an app

- Browse: the app directory at <https://browse.dev-dot.li>. Search and pick
  from the list.
- A `.dot` domain: each published app has a name such as `calculator.dot`. On
  the desktop app you can type it into the address bar. The mobile app has no
  general address bar, so on mobile you open apps from Browse or by following a
  `.dot` / `.dev-dot.li` link.
- A `dev-dot.li` link: the web gateway serves each app at
  `https://<name>.dev-dot.li` (for example <https://calculator.dev-dot.li>).
  Open it in an ordinary browser.

## Find apps in Browse

Browse lists the apps currently published on the network. You can't publish an
app from Browse, but when you are signed in you can recommend (attest to) and
bookmark apps.

1. Open <https://browse.dev-dot.li>, or find **Browse** inside the Polkadot app.
2. Use search and categories to narrow the list. Each app shows a name,
   description and icon.
3. Some cards carry certificate badges. Treat them as extra context. On a
   devnet they are not a reason to be less careful.
4. Select a card to open the app.

Browse reads the Devnet publishing registry and the names attached to published
apps. [App discovery (Browse)](../architecture/discovery.md) explains how.

## Open an app by its `.dot` domain

On the desktop app you can go straight to a name:

1. Type the app's name, for example `calculator.dot`, into the address bar.
2. The app resolves the name, fetches the app bundle and opens it in a
   sandboxed webview.

The mobile app has no general address bar. On mobile, open the app from Browse
or follow a link instead. In an ordinary web browser, use the gateway form of
the same name: `https://calculator.dev-dot.li`.

## When a name does not resolve

The gateway resolves names in the browser, so every `<name>.dev-dot.li` address
first serves the same Polkadot loader shell. A typo, an unpublished name and a
working app look the same until resolution completes. If the shell never hands
over to an app, check the spelling, then look the name up in
<https://browse.dev-dot.li>. A name that is not listed there is not published.

## Apps to try

These apps are deployed on the Devnet:

--8<-- "reference-apps.md"

## What happens when you open an app

When you open an app, the Polkadot app (or the web gateway) resolves the name,
fetches the app's content and runs it in a sandbox. If the app needs accounts,
signing, chain access or payments, it has to ask the Polkadot app or the
gateway for them.

Two things follow from that:

- Each app is isolated. It cannot read another app's data or reach your keys
  directly.
- You approve every action. When an app needs a signature or a payment, the
  Polkadot app shows you a prompt, and your key signs only after you approve.
  Your recovery phrase and private keys never leave your device.

Inside the Polkadot app, opening one app from another stays inside the
Polkadot app. In a plain browser, the same action opens the other app at its
`https://<name>.dev-dot.li` address.

## Learn more

- [App discovery (Browse)](../architecture/discovery.md): how the directory is built
- [Create an account & get funds](create-account.md): most apps need this before they do anything
