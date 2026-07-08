/**
 * Disposable / temporary email blocker.
 *
 * Requirement: "koi bhi temp mail allowed nahi". Yeh module signup ke time email ke
 * domain ko ek known disposable-domains list se match karta hai. Match hua => signup reject.
 *
 * Do layer ka protection:
 *   1) Niche di gayi built-in list (common temp-mail providers) — fast, offline, free.
 *   2) (Optional) External API se live check — niche `isDisposableViaApi()` dekho.
 *      Yeh us case ke liye hai jab aap hazaaron domains ki taaza list chahte ho.
 *
 * List ko badhane ke liye aap ek maintained dataset use kar sakte ho, jaise:
 *   https://github.com/disposable-email-domains/disposable-email-domains
 *   (us repo ki disposable_email_blocklist.conf ko yahan copy/generate kar sakte ho)
 */

// Sabse common disposable email domains. Zarurat par aur add karo (lowercase me rakho).
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "sharklasers.com",
  "grr.la",
  "temp-mail.org",
  "tempmail.com",
  "tempmailo.com",
  "tempr.email",
  "throwawaymail.com",
  "getnada.com",
  "nada.email",
  "dispostable.com",
  "yopmail.com",
  "yopmail.net",
  "trashmail.com",
  "trashmail.de",
  "maildrop.cc",
  "fakeinbox.com",
  "mailnesia.com",
  "mohmal.com",
  "mintemail.com",
  "emailondeck.com",
  "spam4.me",
  "moakt.com",
  "mailcatch.com",
  "inboxkitten.com",
  "burnermail.io",
  "tempinbox.com",
  "discard.email",
  "1secmail.com",
  "1secmail.org",
  "email-temp.com",
  "luxusmail.org",
  "mailpoof.com",
  "dropmail.me",
]);

/**
 * Email string se domain nikalta hai (lowercase, trimmed). Invalid ho to null.
 */
export function getEmailDomain(email) {
  if (typeof email !== "string") return null;
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return domain || null;
}

/**
 * Built-in list ke against synchronous check. true => disposable/temp mail hai.
 * Signup validation me sabse pehle yehi call hota hai (fast, koi network nahi).
 */
export function isDisposableEmail(email) {
  const domain = getEmailDomain(email);
  if (!domain) return false; // format galat hai — usse alag validation pakdega
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * (Optional) Live API check — bahut badi/taaza disposable list ke liye.
 *
 * Kai free APIs available hain, jaise:
 *   - https://open.kickbox.com/v1/disposable/<email>   (free, no key)  -> { "disposable": true }
 *   - https://disposable.debounce.io/?email=<email>    (free, no key)  -> { "disposable": "true" }
 * .env me DISPOSABLE_EMAIL_API_URL set karo (email {email} placeholder ke saath), warna
 * yeh function chup-chaap skip kar dega (sirf built-in list chalegi).
 *
 * Network fail hone par "false" (yaani block nahi) return karta hai taaki asli users ka
 * signup down API ki wajah se na ruke — built-in list phir bhi guard karti hai.
 */
export async function isDisposableViaApi(email) {
  const template = process.env.DISPOSABLE_EMAIL_API_URL;
  if (!template) return false; // API configured nahi — skip
  try {
    const url = template.replace("{email}", encodeURIComponent(email));
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    // Alag-alag APIs alag shape deti hain — dono common keys handle kar lo.
    return data?.disposable === true || data?.disposable === "true";
  } catch {
    return false; // API down => built-in list par bharosa
  }
}
