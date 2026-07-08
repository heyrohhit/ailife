/**
 * Application-level encryption (AES-256-GCM).
 *
 * Kyun: user ka sensitive data (journal, mood notes, goals) database me *encrypted*
 * (ciphertext) store hota hai. Agar kabhi DB leak ho jaye, to bina ENCRYPTION_KEY ke
 * data padha nahi ja sakta. User ko dashboard par hamesha *decrypted* (plain) data dikhta
 * hai kyunki decrypt sirf server par, ENCRYPTION_KEY ke saath hota hai.
 *
 * IMPORTANT: yeh file SIRF server par import karni hai (server components / actions /
 * route handlers). "use client" file me kabhi import mat karna — warna key browser me
 * chali jayegi. Niche wala window-guard galti se client bundle me aane par turant crash
 * karega, aur `node:crypto` import bhi client build me fail hota hai — double safety.
 *
 * AES-GCM authenticated encryption deta hai: agar ciphertext tamper ho to decrypt fail
 * hoga (auth tag mismatch) — isse chhed-chhaad turant pakdi jaati hai.
 */
import crypto from "node:crypto";

// Server-only guard: agar yeh code kisi tarah browser me chala to saaf error do.
if (typeof window !== "undefined") {
  throw new Error(
    "encryption.js sirf server par use hoti hai (client component me import mat karo).",
  );
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM ke liye 12 bytes (96-bit) recommended nonce size
const KEY_LENGTH = 32; // AES-256 => 32-byte key

/**
 * ENCRYPTION_KEY env var ko 32-byte Buffer me badalta hai.
 * Key generate kaise karein (terminal me):  openssl rand -base64 32
 * ya Node se:  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 * Phir .env.local me:  ENCRYPTION_KEY=<woh-base64-string>
 */
function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "ENCRYPTION_KEY missing. .env.local me ek 32-byte base64 key set karo (README dekho).",
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error(
      `ENCRYPTION_KEY galat size ka hai (${key.length} bytes). 32 bytes (base64) chahiye.`,
    );
  }
  return key;
}

/**
 * Plaintext string ko encrypt karke ek single portable string deta hai.
 * Output format:  base64(iv).base64(authTag).base64(ciphertext)
 * Yehi string DB column me store karni hai.
 */
export function encrypt(plaintext) {
  if (plaintext == null) return null;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH); // har encryption ke liye naya random IV
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // utf8 text ko encrypt karke bytes me convert
  const ciphertext = Buffer.concat([
    cipher.update(String(plaintext), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // integrity check ke liye tag

  // teeno pieces ko "." se jodkar ek string bana do (DB me store karne layak)
  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

/**
 * encrypt() se bane string ko wapas plaintext me decrypt karta hai.
 * Galat key ya tamper hua data => exception (crash safe: caller handle kare).
 */
export function decrypt(payload) {
  if (payload == null) return null;
  const key = getKey();

  const [ivB64, tagB64, dataB64] = String(payload).split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Encrypted payload ka format galat hai.");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64")); // tamper check enable

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(), // yahan tag mismatch hua to throw karega
  ]);
  return plaintext.toString("utf8");
}

/**
 * Convenience helpers: JSON object ko encrypt/decrypt karne ke liye
 * (jaise check-in ka pura object ek hi encrypted column me).
 */
export function encryptJSON(obj) {
  return encrypt(JSON.stringify(obj));
}

export function decryptJSON(payload) {
  const text = decrypt(payload);
  return text == null ? null : JSON.parse(text);
}
