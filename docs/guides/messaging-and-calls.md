# Messaging & calls

The Polkadot app includes a built-in, self-custodial messenger. You can hold
one-to-one chats, send media, and place voice or video calls to your contacts —
without a central chat database that reads your messages. Text, attachments,
and calls use different transports behind the scenes, but the app keeps that
workflow in one conversation view.

There is no plaintext messaging backend: text and call signals travel encrypted
over the People chain statement store, attachments go through Bulletin-backed
storage, and call media flows peer-to-peer over WebRTC. The chain only ever sees
ciphertext. For how that fits together, see
[Messaging & calls](../architecture/messaging.md).

This page covers the user-facing flow and the current limits of each client.

## Before you start

You will need the Polkadot app installed — downloads are in
[Get the app](../reference/resources.md#get-the-app) — and an on-device account.

Messaging is tied to your on-chain identity, so both you and the person you want
to reach need an account and, in practice, to have added each other as a
contact.

!!! tip
    Voice and video calls are a mobile-only feature today. You place and receive
    them on Android or iOS; the Desktop app has no call UI. Desktop is for chats.

## Start a chat and send messages

1. Open the app and go to the chats section.
2. Add or select a contact. Contacts are keyed to their on-chain identity, so you
   are messaging an account, not a phone number or email address.
3. Type your message and send it. The app encrypts the message locally and
   submits it through the statement store.
4. Your contact's app is subscribed to the statement store, receives the
   statement, decrypts it, and displays the message.

The same encrypted channel supports replies, reactions, and in-chat token
transfers.

## Send media

1. In a chat, attach an image, video, or file.
2. The app encrypts the file and uploads it through Bulletin-backed storage.
3. A reference to the stored file is embedded in a normal encrypted chat message.
4. Your contact receives the message, fetches the encrypted chunks from the
   Bulletin Chain, and decrypts them locally.

!!! note
    Attachment sending is a mobile-app capability. Desktop participates in chats,
    but its own attachment-sending support is not yet available.

## Place a voice or video call

Calls are placed from the mobile app.

1. Open a chat with the contact you want to call and start an audio or video call.
2. The app creates a WebRTC peer connection. If the two devices cannot connect
   directly, the app can fall back to relay infrastructure.
3. The app sends the call offer, answer, and connection candidates as encrypted
   chat messages over the statement-store channel.
4. Once connection negotiation completes, audio and video flow peer to peer over
   WebRTC, either directly or relayed through TURN.

Calls are a mobile-only feature today: the Desktop app has no call UI, so voice
and video calls are placed and received only on Android or iOS.

## Device sync

Desktop and mobile can keep contacts and chats in sync over an encrypted
peer-to-peer channel. The devices negotiate that channel through the same
statement-store path used for calls, then replicate contacts and chats once the
channel opens.

## Current limits

- Voice/video calls are a mobile-only feature today; the Desktop app has no call
  UI, and Desktop attachment sending is not yet available.
- Whether a specific call is peer-to-peer or TURN-relayed depends on your
  network; the app degrades gracefully to relaying when a direct path is not
  possible.

## Learn more

- [Messaging & calls](../architecture/messaging.md) — the transports behind chat and calls
- [Polkadot Android](https://github.com/Polkadot-Community-Foundation/polkadot-android-community) — source
