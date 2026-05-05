import { EncryptedPayload } from "./types";

const RSA_ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
} as const;

const PBKDF2_ITERATIONS = 250_000;

function bytesToBase64(bytes: ArrayBuffer | Uint8Array) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function normalizeBase64(value: string) {
  const trimmed = value.trim();
  const withoutPemHeaders = trimmed
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "");
  const normalized = withoutPemHeaders
    .replace(/\s/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = normalized.length % 4;

  if (padding === 0) return normalized;
  if (padding === 2) return `${normalized}==`;
  if (padding === 3) return `${normalized}=`;
  return normalized;
}

function base64ToBytes(base64: string) {
  const normalized = normalizeBase64(base64);
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

async function derivePrivateKeyEncryptionKey(password: string, salt: Uint8Array) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: toArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptPrivateKey(privateKey: CryptoKey, password: string, salt: Uint8Array) {
  const wrappingKey = await derivePrivateKeyEncryptionKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey);
  const encryptedPrivateKey = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    wrappingKey,
    exportedPrivateKey,
  );

  return bytesToBase64(
    new TextEncoder().encode(
      JSON.stringify({
        v: 1,
        alg: "PBKDF2-SHA256+A256GCM",
        iv: bytesToBase64(iv),
        data: bytesToBase64(encryptedPrivateKey),
      }),
    ),
  );
}

async function decryptPrivateKey(
  password: string,
  wrappedPrivateKey: string,
  salt: string,
) {
  const envelope = JSON.parse(new TextDecoder().decode(base64ToBytes(wrappedPrivateKey))) as {
    v: number;
    alg: string;
    iv: string;
    data: string;
  };

  if (envelope.v !== 1 || envelope.alg !== "PBKDF2-SHA256+A256GCM") {
    throw new Error("Unsupported private key envelope.");
  }

  const wrappingKey = await derivePrivateKeyEncryptionKey(password, base64ToBytes(salt));
  const privateKeyBytes = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
    wrappingKey,
    base64ToBytes(envelope.data),
  );

  return crypto.subtle.importKey("pkcs8", privateKeyBytes, RSA_ALGORITHM, false, [
    "decrypt",
  ]);
}

export async function createUserKeyBundle(password: string) {
  const keyPair = await crypto.subtle.generateKey(RSA_ALGORITHM, true, [
    "encrypt",
    "decrypt",
  ]);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const wrappedPrivateKey = await encryptPrivateKey(keyPair.privateKey, password, salt);

  return {
    publicKey: bytesToBase64(publicKey),
    wrappedPrivateKey,
    salt: bytesToBase64(salt),
    privateKey: keyPair.privateKey,
  };
}

export async function unlockPrivateKey(
  password: string,
  wrappedPrivateKey: string,
  salt: string,
) {
  return decryptPrivateKey(password, wrappedPrivateKey, salt);
}

export function importPublicKey(publicKey: string) {
  const trimmed = publicKey.trim();

  if (trimmed.startsWith("{")) {
    return crypto.subtle.importKey(
      "jwk",
      JSON.parse(trimmed) as JsonWebKey,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"],
    );
  }

  return crypto.subtle.importKey(
    "spki",
    base64ToBytes(publicKey),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );
}

export async function encryptMessage(
  plaintext: string,
  recipientPublicKey: CryptoKey,
  senderPublicKey: CryptoKey,
): Promise<EncryptedPayload> {
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded,
  );
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
  const [encryptedKey, encryptedKeyForSelf] = await Promise.all([
    crypto.subtle.encrypt({ name: "RSA-OAEP" }, recipientPublicKey, rawAesKey),
    crypto.subtle.encrypt({ name: "RSA-OAEP" }, senderPublicKey, rawAesKey),
  ]);

  return {
    ciphertext: bytesToBase64(ciphertext),
    iv: bytesToBase64(iv),
    encryptedKey: bytesToBase64(encryptedKey),
    encryptedKeyForSelf: bytesToBase64(encryptedKeyForSelf),
  };
}

export async function decryptMessage(
  payload: EncryptedPayload,
  privateKey: CryptoKey,
  useSelfCopy: boolean,
) {
  const wrappedAesKey = useSelfCopy ? payload.encryptedKeyForSelf : payload.encryptedKey;
  const rawAesKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    base64ToBytes(wrappedAesKey),
  );
  const aesKey = await crypto.subtle.importKey(
    "raw",
    rawAesKey,
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(payload.iv) },
    aesKey,
    base64ToBytes(payload.ciphertext),
  );
  return new TextDecoder().decode(plaintext);
}
