# Messaging & calls

The Polkadot app has a built-in messenger. You can chat one to one, send
photos, videos and files, and make voice or video calls to your contacts. There
is no central chat database that can read your messages.

Text and call signals travel encrypted over the People chain statement store.
Attachments go through Bulletin-backed storage, and call audio and video flow
peer to peer over WebRTC. The chain only ever sees ciphertext. The architecture
page on [Messaging & calls](../architecture/messaging.md) explains how these
fit together.

## Before you start

You need the Polkadot app installed (downloads are in
[Get the app](../reference/resources.md#get-the-app)) and an account on the
device.

Messaging is tied to your on-chain identity. You and the person you want to
reach both need an account, and in practice you need to have added each other
as contacts.

Calls and sending attachments only work in the mobile app, on Android or iOS.
The desktop app is for chats.

## Start a chat

1. Open the app and go to the chats section.
2. Add or select a contact. Contacts are keyed to their on-chain identity, so
   you are messaging an account, not a phone number or email address.
3. Type your message and send it. The app encrypts it on your device and
   submits it through the statement store.
4. Your contact's app, which is subscribed to the statement store, receives the
   message, decrypts it and shows it.

The same encrypted channel carries replies, reactions and in-chat token
transfers.

## Send media

1. In a chat, attach an image, video or file.
2. The app encrypts the file and uploads it through Bulletin-backed storage.
3. A reference to the stored file goes into a normal encrypted chat message.
4. Your contact's app receives the message, fetches the encrypted chunks from
   the Bulletin Chain and decrypts them on the device.

Desktop takes part in chats, but it cannot send attachments yet.

## Make a voice or video call

The desktop app has no call UI, so you place and receive calls on Android or
iOS.

1. Open a chat with the contact and start an audio or video call.
2. The app creates a WebRTC peer connection. If the two devices cannot connect
   directly, it can fall back to relay infrastructure.
3. The call offer, answer and connection candidates travel as encrypted chat
   messages over the statement store.
4. Once the connection is set up, audio and video flow peer to peer over
   WebRTC, either directly or relayed through TURN.

Whether a call goes direct or through a relay depends on your network. When a
direct path is not possible, the app falls back to the relay.

## Device sync

Desktop and mobile can keep contacts and chats in sync over an encrypted
peer-to-peer channel. The devices set up that channel through the same
statement store path used for calls, then copy contacts and chats across once
it opens.

## Learn more

- [Messaging & calls](../architecture/messaging.md): the transports behind chat and calls
- [Polkadot Android](https://github.com/Polkadot-Community-Foundation/polkadot-android-community): source
