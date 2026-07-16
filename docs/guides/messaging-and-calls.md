# Messaging & calls

The Polkadot app includes a built-in, self-custodial messenger. You can hold
one-to-one chats, send media, and place voice or video calls to your contacts —
without a central chat database that reads your messages. Text, attachments,
and calls use different transports behind the scenes, but the app keeps that
workflow in one conversation view.

This page covers the user-facing flow and the current limits of each client.

!!! note
    This is the Polkadot Products Devnet, a public developer preview. Devnet
    tokens have no real value and flows may change between builds.

## Before you start

You will need the Polkadot app installed and an on-device account:

- Android (Play): <https://play.google.com/store/apps/details?id=io.pcf.polkadotapp>
- Android APK: <https://get.polkadotcommunity.foundation/android/latest.apk>
- iOS (TestFlight): <https://testflight.apple.com/join/VvC8SHVE>
- Desktop: <https://polkadotcommunity.foundation/desktop/>

Messaging is tied to your on-chain identity, so both you and the person you want
to reach need an account and, in practice, to have added each other as a
contact.

!!! tip
    Voice and video call initiation is a mobile-app feature. On Desktop you can
    take part in chats and see call state (ringing, active, missed), but calls
    are started from Android or iOS.

## How messaging works

The messenger has no dedicated plaintext messaging backend. It uses two Polkadot
chains as transport, plus WebRTC for live media:

- **Text messages and call signaling** are end-to-end encrypted and delivered
  through the People chain statement store.
- **Media attachments** (images, video, files) do not go through the statement
  store. They are encrypted and stored through Bulletin-backed storage; the chat
  message only carries a reference so the recipient can fetch and decrypt the
  file.
- **Voice and video calls** use WebRTC directly between the two devices. There is
  no signaling server: the SDP offer/answer and ICE candidates are sent as
  ordinary encrypted chat messages over the same statement-store channel.

Encryption is per peer. The chain sees only ciphertext.

```mermaid
flowchart TD
  subgraph You
    A1[Chat UI / ChatEngine]
    A2[WebRTC peer connection]
  end
  subgraph Contact
    B1[Chat UI / ChatEngine]
    B2[WebRTC peer connection]
  end
  SS[People chain<br/>statement store]
  BC[Bulletin-backed<br/>attachment storage]
  TURN[STUN / TURN]

  A1 -- E2E-encrypted statements<br/>text + call signals --> SS
  SS -- subscription --> B1
  A1 -- chunked AES media --> BC
  BC -- fetch by HopTicket --> B1
  A2 -- ICE / audio+video --> TURN
  TURN -- relay --> B2
  A2 -. direct P2P when possible .- B2
```

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

```mermaid
sequenceDiagram
  participant Caller
  participant SS as People chain<br/>statement store
  participant Callee
  Caller->>Caller: Prepare WebRTC session
  Caller->>SS: Send encrypted call offer
  SS-->>Callee: offer statement
  Callee->>SS: Send encrypted answer
  SS-->>Caller: answer statement
  Caller->>SS: Exchange connection candidates
  Callee->>SS: Exchange connection candidates
  Caller-->>Callee: WebRTC media (direct or TURN relay)
  Caller->>SS: End call
```

On Desktop, incoming call state is folded from the same call-signal messages and
shown in the chat UI (ringing, active, finished, cancelled, missed).

## Device sync

Desktop and mobile can keep contacts and chats in sync over an encrypted
peer-to-peer channel. The devices negotiate that channel through the same
statement-store path used for calls, then replicate contacts and chats once the
channel opens.

## Limits and honesty

- Voice/video call initiation is a mobile feature; Desktop is receive/display
  only, and Desktop attachment sending is not yet available.
- Whether a specific call is peer-to-peer or TURN-relayed depends on your
  network; the app degrades gracefully to relaying when a direct path is not
  possible.
- This is a devnet. Identities, messages, and flows are for evaluation and may
  change.

## Learn more

- Polkadot Android (source): <https://github.com/Polkadot-Community-Foundation/polkadot-android-community>
- Polkadot Desktop (source): <https://github.com/Polkadot-Community-Foundation/polkadot-desktop-community>
- Polkadot iOS (source): <https://github.com/Polkadot-Community-Foundation/polkadot-ios-community>
- Polkadot developer docs: <https://docs.polkadot.com>
- Web gateway: <https://dev-dot.li>
