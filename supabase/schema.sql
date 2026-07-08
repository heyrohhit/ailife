-- =============================================================================
--  Aivra — Database schema + Row Level Security (RLS)
--
--  Isse Supabase Dashboard → SQL Editor me paste karke "Run" karo (ek hi baar).
--  Yeh do tables banata hai (profiles, checkins) aur RLS policies lagata hai taaki
--  har user SIRF apna hi data padh/likh sake.
--
--  NOTE: personal data (naam, mood, note) app-level par AES-256-GCM se ENCRYPTED
--  store hota hai (dekho src/lib/encryption.js). Yaani columns me ciphertext aata
--  hai — DB me plain text kabhi nahi. RLS + encryption dono milke data ko protect
--  karte hain (defense in depth).
-- =============================================================================

-- --- profiles: har auth user ka ek profile row ------------------------------
create table if not exists public.profiles (
  -- id = auth.users ka id (1:1). User delete hone par profile bhi delete.
  id uuid primary key references auth.users (id) on delete cascade,
  -- Naam ENCRYPTED store hota hai (ciphertext string). App decrypt karke dikhata hai.
  full_name_encrypted text,
  -- Onboarding se chuna gaya niche slug (e.g. 'executive-stress') — non-sensitive.
  focus text,
  -- Roughly kitna time daily (e.g. '10','30','60') — non-sensitive.
  commitment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- checkins: daily encrypted check-ins ------------------------------------
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  -- Kis user ka check-in. User delete => uske check-ins bhi delete.
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Pura check-in {mood, sleep, energy, note} ek ENCRYPTED JSON string me.
  data_encrypted text not null,
  -- created_at plain rehta hai (streak/sorting ke liye) — koi personal content nahi.
  created_at timestamptz not null default now()
);

-- Query speed: user ke check-ins latest-first nikalne ke liye index.
create index if not exists checkins_user_created_idx
  on public.checkins (user_id, created_at desc);

-- =============================================================================
--  ROW LEVEL SECURITY — bina inke koi bhi kisi ka bhi data padh sakta hai!
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.checkins enable row level security;

-- --- profiles policies -------------------------------------------------------
-- Sirf apna profile padho.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);

-- Sirf apna profile banao (id == apna uid).
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check ((select auth.uid()) = id);

-- Sirf apna profile update karo.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- --- checkins policies -------------------------------------------------------
-- Sirf apne check-ins padho.
drop policy if exists "checkins_select_own" on public.checkins;
create policy "checkins_select_own" on public.checkins
  for select using ((select auth.uid()) = user_id);

-- Sirf apne naam par check-in insert karo.
drop policy if exists "checkins_insert_own" on public.checkins;
create policy "checkins_insert_own" on public.checkins
  for insert with check ((select auth.uid()) = user_id);

-- Sirf apne check-ins delete karo (optional).
drop policy if exists "checkins_delete_own" on public.checkins;
create policy "checkins_delete_own" on public.checkins
  for delete using ((select auth.uid()) = user_id);

-- =============================================================================
--  Done. Ab Authentication → Sign In / Providers → Email me "Confirm email"
--  ON hona chahiye taaki email verification kaam kare (README/SETUP dekho).
-- =============================================================================
