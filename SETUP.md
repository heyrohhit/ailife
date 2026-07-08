# Aivra — Setup (Supabase + Auth + Encryption)

Yeh guide project ko Supabase ke saath chalane ke steps deti hai. Sab kuch Hinglish comments ke saath code me bhi likha hai.

## 1. Dependencies

Already installed (`package.json`): `@supabase/ssr`, `@supabase/supabase-js`. Kuch install karna ho to:

```bash
npm install
```

## 2. Environment variables

`.env.example` ko copy karke `.env.local` banao (agar already nahi hai):

```bash
cp .env.example .env.local
```

Phir values bharo. Konsi value kahan se aati hai:

| Variable | Required? | Kahan se milega |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Dashboard → Project Settings → **Data API** → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Dashboard → Project Settings → **API Keys** → publishable (anon) key |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Aapki app URL. Local: `http://localhost:3000`, prod: aapki domain |
| `ENCRYPTION_KEY` | ✅ | Khud generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `SUPABASE_SECRET_KEY` | Optional | Dashboard → API Keys → secret/service_role key (server-only admin kaam) |
| `DISPOSABLE_EMAIL_API_URL` | Optional | Free temp-mail API, e.g. `https://open.kickbox.com/v1/disposable/{email}` |

> ⚠️ `ENCRYPTION_KEY` kabhi mat kho / mat badlo production me — warna purana encrypted data decrypt nahi hoga.

## 3. Database schema (tables + RLS)

Supabase Dashboard → **SQL Editor** → New query → `supabase/schema.sql` ka pura content paste karo → **Run**.

Isse banti hain:
- `profiles` (encrypted naam, focus, commitment)
- `checkins` (encrypted daily check-ins)
- **Row Level Security** policies — har user sirf apna data access kar sakta hai.

## 4. Email verification ON karo (temp-mail block ke saath)

1. Dashboard → **Authentication** → **Sign In / Providers** → **Email**.
2. **Confirm email** ko **ON** rakho. (Isse signup ke baad user ko confirm-link email jaata hai; verify hone tak login nahi hoga.)
3. Redirect URL allow karo: Authentication → **URL Configuration** → **Redirect URLs** me add karo:
   - `http://localhost:3000/auth/confirm`
   - production: `https://YOUR-DOMAIN/auth/confirm`

Temp/disposable mail app-level par bhi block hoti hai (`src/lib/disposable-email.js`) — signup form us email ko reject kar dega.

## 5. App chalao

```bash
npm run dev
```

Flow test karo:
1. `/signup` → naam, asli email, strong password. (Temp mail try karoge to reject hoga.)
2. Email me confirm link → click → `/auth/confirm` → session ban jayega → `/dashboard`.
3. Dashboard par daily check-in save karo → DB me **encrypted** jayega, screen par **decrypted** dikhega.
4. Supabase → Table Editor → `checkins` → `data_encrypted` column me sirf ciphertext dikhega (readable nahi).

## Files ka map

| File | Kya karta hai |
|---|---|
| `src/lib/supabase/client.js` | Browser Supabase client |
| `src/lib/supabase/server.js` | Server Supabase client (async cookies, Next 16) |
| `src/proxy.js` | Session refresh + `/dashboard` route protection (Next 16 me `middleware` → `proxy`) |
| `src/lib/encryption.js` | AES-256-GCM encrypt/decrypt (server-only) |
| `src/lib/disposable-email.js` | Temp-mail blocklist + optional API |
| `src/lib/validation.js` | Email/password validation |
| `src/app/auth/actions.js` | signup / login / signout server actions |
| `src/app/auth/confirm/route.js` | Email confirm link handler |
| `src/app/login`, `src/app/signup`, `src/app/verify-email` | Auth pages |
| `src/app/dashboard/*` | Encrypted dashboard + check-in |
| `supabase/schema.sql` | Tables + RLS |

## Konse APIs / services chahiye (summary)

- **Supabase** (required) — database + auth + email. Free tier kaafi hai.
- **Encryption key** (required) — koi external API nahi, khud generate hoti hai (Node crypto).
- **Disposable-email API** (optional) — free public APIs (Kickbox / DeBounce), no key.
- **Custom SMTP** (optional, production) — Supabase ka default email limited hota hai; asli
  volume ke liye Dashboard → Authentication → Emails me apna SMTP (Resend/SendGrid/Postmark) jodo.
