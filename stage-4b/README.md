# WhisperBox Secure Messenger

A Next.js App Router client for the HNG Stage 4B end-to-end encrypted messaging task. The app talks to the WhisperBox backend at `https://whisperbox.koyeb.app/` and keeps plaintext on the client.

## Architecture

```text
Browser / Next.js client
  |
  | 1. Generate RSA-OAEP keypair
  | 2. Encrypt private key with password-derived AES-GCM key
  | 3. Encrypt each message with AES-GCM
  v
WhisperBox API / WebSocket
  |
  | Stores user identities, public keys, wrapped private keys,
  | refresh tokens, conversation metadata, and encrypted payload blobs
  v
Recipient browser
  |
  | Uses local password to unwrap private key
  | Uses RSA-OAEP to unwrap per-message AES key
  | Uses AES-GCM to decrypt message text
```

## Encryption Flow

1. During registration, the browser generates an RSA-OAEP keypair with Web Crypto.
2. The public key is exported and sent to the backend.
3. The private key is encrypted with AES-GCM. The AES-GCM key is derived from the user password using PBKDF2 and a random salt.
4. For every message, the client generates a fresh AES-GCM 256-bit key and 96-bit IV.
5. Plaintext is encrypted locally with AES-GCM.
6. The AES key is encrypted twice with RSA-OAEP: once for the recipient and once for the sender.
7. The backend receives only `{ ciphertext, iv, encryptedKey, encryptedKeyForSelf }`.
8. On receive, the client unwraps the correct AES key with the in-memory RSA private key and decrypts locally.

## Key Management

- Public keys are stored by the WhisperBox backend.
- Raw private keys never leave the browser.
- Private keys are not stored in `localStorage`.
- The app stores only the backend-held encrypted private key envelope and refresh token in IndexedDB.
- The unwrapped private key lives in memory only and is cleared on logout or page reload.
- A saved session must be unlocked with the account password before messages can be decrypted.

## Security Trade-offs

- This is a browser-only E2EE client, so a compromised browser session or malicious shipped JavaScript could still access plaintext while the user is active.
- Refresh tokens are stored in IndexedDB for usability. A stricter production system would prefer httpOnly secure cookies or a native secure enclave.
- RSA-OAEP protects per-message AES keys, but this implementation does not provide full forward secrecy after private-key compromise.
- The UI handles decryption failures without exposing raw ciphertext, but users should still verify recipients out-of-band for strong identity assurance.
- HTTPS is required by Web Crypto security context rules and by the hosted WhisperBox API.

## Known Limitations

- No attachment encryption.
- No message deletion or edit flow.
- No formal replay protection in the client beyond backend message IDs and timestamps.
- WebSocket delivery is optimistic; REST fallback is used when the socket is unavailable.
- Multi-device support depends on the same password unwrapping the backend-stored private key blob.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
