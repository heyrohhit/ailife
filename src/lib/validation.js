/**
 * Chhoti, dependency-free validation helpers (email + password).
 * (Zod jaisi library add nahi ki taaki extra dependency na ho — basic rules kaafi hain.)
 */

// Simple par practical email regex: kuchh@kuchh.tld
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailFormat(email) {
  return typeof email === "string" && EMAIL_RE.test(email.trim());
}

/**
 * Password rules: kam se kam 8 chars, ek letter aur ek number.
 * Array of error messages deta hai (khaali array => valid).
 */
export function validatePassword(password) {
  const errors = [];
  if (typeof password !== "string" || password.length < 8) {
    errors.push("Kam se kam 8 characters hone chahiye.");
  }
  if (!/[a-zA-Z]/.test(password || "")) {
    errors.push("Kam se kam ek letter hona chahiye.");
  }
  if (!/[0-9]/.test(password || "")) {
    errors.push("Kam se kam ek number hona chahiye.");
  }
  return errors;
}
