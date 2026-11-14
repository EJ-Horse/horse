# EJ 🐴

A phone app for EJ and Sofía: health, photo history, nutrition, braids and looks, shopping, costs, and Sofía’s riding (skills, tips, coach, weekly to-dos, things that scare EJ).

It’s a web app (PWA). Open the link on the phone and add it to the home screen. It works on iPhone and Android, and both phones share the same data live.

**App:** https://ej-horse.github.io/horse/

## Add it to your phone

- **iPhone (Safari):** open the link → Share button → **Add to Home Screen**.
- **Android (Chrome):** open the link → ⋮ menu → **Add to Home screen** / **Install app**.

## One-time setup (≈15 minutes)

### 1. Supabase (database, photo storage, sign-in, free)

1. At https://supabase.com, **New project** (name it `ej-horse`, choose a region near you, save the database password somewhere safe).
2. **SQL Editor → New query**: paste all of `supabase/migrations/0001_initial.sql` and click **Run**.
3. **Authentication → Sign In / Providers**: turn **off** “Allow new users to sign up”.
4. **Authentication → Users → Add user → Create new user**, once for each of you: email + passcode (6+ characters), tick **Auto Confirm User**.
5. **Authentication → URL Configuration**: Site URL `https://ej-horse.github.io/horse/`, and add the same URL plus `http://localhost:5174/` under Redirect URLs (used by “Forgot passcode?”).
6. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

### 2. GitHub (hosting, free)

In the `EJ-Horse/horse` repo: **Settings → Secrets and variables → Actions → Variables** tab → add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the two values above. Then **Actions → Deploy to GitHub Pages → Run workflow**.

The anon key is safe in the browser; the database rules only let signed-in people read or write.

## Run it on your computer

```bash
npm install
npm run dev -- --port 5174
```

Without a `.env.local` it runs in preview mode and saves to that browser only. Copy `.env.example` to `.env.local` and paste the two Supabase values to use the real data.

```bash
npm test
```

## How it’s built

React + Vite PWA, hosted on GitHub Pages. Supabase stores everything in one shared `items` table (each row has a `kind`: vaccine, photo, cost, skill…) plus a private `media` bucket for photos, invoices and clips (50 MB max per file). Starter skills, tips, hairstyles, foods and weekly to-dos are added the first time someone opens the app, and everything can be edited.

## Ideas for v2

- AI photo comparison (highlight what changed between two photos of the same spot)
- Symptom suggestions and riding-video feedback with Claude
- Push notifications for due dates (v1 has in-app alerts + “add to calendar” buttons)
- Pull product photo/price from Amazon links
