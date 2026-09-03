# Back up & restore your account

Your account lives on your phone, and it is held by a **12-word recovery
phrase**. Back it up to your own cloud, write the phrase down, and know how to
get the account back. The steps differ a little between Android and iOS.

You will need the app installed. Download links are in
[Get the app](../reference/resources.md#get-the-app).

!!! warning "The recovery phrase *is* the account"
    Anyone who has your recovery phrase can take over your account, and nobody
    can issue you a new one. Never type it into a website, send it in a chat, or
    give it to someone offering help. The Polkadot app will never ask you for it.

## What a backup covers

A backup saves one thing: your 12-word phrase. That is enough to bring back your
account, your username, your CASH and your collectables, because those belong to
the account itself rather than to the phone.

What it does not bring back is anything that only ever lived on the phone. Chat
history and downloaded photos start fresh on a restored app.

| | Cloud backup | Written-down phrase |
| --- | --- | --- |
| Where it goes | Your Google Drive (Android) or iCloud (iOS) | Paper, kept somewhere safe |
| Covers you if | You lose, break or replace the phone | You also lose your Google or Apple account |
| Effort | Two taps | A minute with a pen |

Do both.

## Turn on the cloud backup

The app tries to set this up when you first create your account, so it is often
already on. Check, and switch it on if it is not.

### Android

1. Open the **Settings** tab. A warning dot on the tab means you have no backup.
2. Under **Security & privacy**, tap **Backup**.
3. You will see one of these:

    | What it says | What to do |
    | --- | --- |
    | **Account is backed up** | Nothing, you are set |
    | **Backup your account** | Tap **Backup Your account** and choose a Google account |
    | **Enable Google Drive** | Tap **Enable Google Drive**, allow access, then back up |
    | **Backup conflict** | You already backed up a different account. See below. |

Your backup is saved in your own Google Drive, in a folder called
**`Polkadot App - DO NOT DELETE`**. Do not delete or rename that folder.

**If you see a backup conflict.** Google Drive keeps one Polkadot backup at a
time. Backing up a second account offers to **Override existing backup**, and
makes you tick a box saying *"I fully understand the risk"*. The account you
replace cannot be recovered unless you already have its phrase on paper, so go
and write that down first.

**If your phone has no Google Play.** The `app-polkadot-devnet-nogms.apk`
download is for phones without Google Play services, and it cannot back up to
Google Drive at all. On that version, writing the phrase down is your only
backup, so do it straight away.

### iOS

1. Open the **Settings** tab.
2. Under **Security & privacy**, tap **Backup**.
3. You will see one of these:

    | What it says | What to do |
    | --- | --- |
    | **Account is Backed Up** | Nothing, you are set |
    | **Backup your account** | Tap **Backup Your Account** |
    | **Enable iCloud backup** | The app cannot reach iCloud. See below. |

**Enable iCloud backup** talks you through signing in to iCloud and turning on
iCloud Drive, with an **Open settings** button. It misses one setting you also
need: your phrase is stored in the **iCloud Keychain**, so turn that on too under
**Settings → *your name* → iCloud → Passwords and Keychain**. Then come back and
tap **Backup Your Account**.

!!! warning "You need the same account to get it back"
    A backup only opens for the account that made it. An Android backup can only
    be restored by signing in to the same Google account, and an iOS backup only
    reappears on a phone signed in to the same Apple Account. Make sure you can
    still get into that account.

## Write down the recovery phrase

Do this even if the cloud backup is on. You can do it at any time, whether or
not you have a backup yet.

1. **Settings → Security & privacy → Backup**.
2. Tap **View recovery phrase** on Android, or **View Secret Recovery Phrase**
   on iOS.
3. Read the warning and tap **Show recovery phrase**.
4. Unlock. Android asks for your usual screen lock (*"Verify it's you"*); iOS
   asks for Face ID, Touch ID or your passcode. If iOS will not let you through,
   check that you have a passcode or Face ID set up on the phone.
5. Tap **Tap to reveal**, then copy the 12 words onto paper, in order.

Keep the paper somewhere only you can get to. Android has no copy button on
purpose. iOS does have **Copy to clipboard** under the words if you keep the
phrase in a password manager, but paste it and then copy something else straight
away, because other apps can read whatever is on your clipboard.

## Get your account back on another phone

You can only restore onto an app that has no account on it yet. If the app on
that phone is already set up with a different account, uninstall and reinstall it
first.

### Android

1. Open the app. It starts on **Pick a username**.
2. Tap **Already using Polkadot? Recover here**.
3. Either tap **Backup from Google Drive** and sign in with the Google account
   that holds your backup, or tap **Import recovery phrase**, type your words in,
   and tap **Restore account**.
4. You will see **Account restored**. Confirm your username to finish.

If you start creating a new account while a backup already exists, the app stops
you with **We found an existing backup** and offers **Recover this backup** or
**Replace with a new backup**. Replacing it cannot be undone.

### iOS

iOS does this for you. If it finds your iCloud backup when you open the freshly
installed app, it restores the account on its own and you have nothing to tap.

If it shows you **Pick Your Username** instead, the phone is signed in to a
different Apple Account, or iCloud Keychain is switched off. Fix that in the iOS
Settings app and reinstall. To use your written phrase instead, tap **Already
using Polkadot? Recover here** and type it into **Recover Polkadot ID**.

### Desktop

The desktop app has no account of its own. It works by pairing with your phone,
and everything is approved on the phone, so there is nothing to back up. Get
your phone working again, then open the desktop app and scan its QR code to pair
once more. See [the client architecture](../architecture/client.md) for why it
works this way.

## The hidden debug menu

This test version of the app has a debug menu that the public Polkadot app does
not. **Shake your phone** to open it, or on Android use **Settings → Debug →
Debug menu**. It is meant for testing, and two things in it can cost you an
account.

On Android, **Copy wallet mnemonic** copies your 12 words without asking for your
screen lock, so anyone holding your unlocked phone could take them. **Clear
backup** deletes your Google Drive backup.

On iOS there is no copy shortcut. **Clear Backup** deletes your iCloud backup,
and **Replace Entropy (Random)** throws your account away and starts a new one,
which you cannot undo without your written phrase.

!!! danger "Nothing here asks you to confirm"
    Use the debug menu on accounts you do not mind losing, and have your recovery
    phrase written down before you tap anything that says *clear* or *replace*.

## Learn more

- [Create an account & get funds](create-account.md) — set the account up in the first place
- [Username & proof of personhood](username-and-personhood.md) — the username that comes back with the account
- [The Polkadot app (client tier)](../architecture/client.md) — where keys live and why the desktop app has none
