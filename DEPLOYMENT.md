# Deploying CogniVia (free tier)

Production topology — everything on free plans, no credit card required:

| Piece | Host | Free domain |
|---|---|---|
| React frontend | Vercel | `https://cognivia.vercel.app` (or similar) |
| Laravel API | Render (Docker, free web service) | `https://cognivia-api.onrender.com` |
| MySQL | Aiven (free MySQL plan) | — |
| Realtime (optional) | Pusher Channels (free plan) | — |

Visitors only ever type the Vercel URL; it calls the Render API, which talks to
Aiven MySQL. Realtime is optional because login-approval falls back to polling
(`POST /api/auth/login/status` is authoritative — see CLAUDE.md).

Known free-tier trade-offs:

- **Render sleeps after 15 min idle** — the first request after a quiet period
  takes ~1 minute while the service wakes up.
- **Render's disk is ephemeral** — uploaded avatars vanish on each deploy or
  restart. Move `FILESYSTEM_DISK` to S3-compatible storage later if it matters.
- **Admin password is managed by env** — `AdminSeeder` runs on every deploy and
  re-applies `ADMIN_SEEDER_PASSWORD`. Changing it in the profile page lasts only
  until the next deploy; change the env var instead.

---

## 0. Push the repo to GitHub

Render and Vercel both deploy from GitHub. Make sure the branch you want to
deploy (after review/merge, normally `main`) is pushed to
`github.com/ijanvincent/cognivia`.

## 1. Database — Aiven free MySQL

1. Sign up at <https://aiven.io/free-mysql-database> (no card needed).
2. Create the **free MySQL** service. When it's running, open its overview page
   and note: **host, port, user (`avnadmin`), password, database** (create a
   `cognivia` database, or use `defaultdb`).
3. Download the service's **CA certificate** (`ca.pem`) — needed in step 2.

## 2. API — Render blueprint

1. Sign up at <https://render.com> with your GitHub account.
2. **New → Blueprint**, pick the `cognivia` repo and the deploy branch. Render
   reads `render.yaml` and prompts for the `sync: false` values:

   | Var | Value |
   |---|---|
   | `APP_KEY` | run `docker exec cognivia_backend php artisan key:generate --show` |
   | `JWT_SECRET` | run `openssl rand -base64 64 \| tr -d '\n='` |
   | `APP_URL` | `https://cognivia-api.onrender.com` (shown by Render; adjust if the name differs) |
   | `FRONTEND_URL` | your Vercel URL (come back and set it after step 3 if needed) |
   | `ADMIN_SEEDER_EMAIL` / `ADMIN_SEEDER_PASSWORD` | production admin credentials — use a strong, unique password |
   | `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | from Aiven (step 1) |

3. In the service's **Environment → Secret Files**, add a file named
   `db-ca.pem` with the contents of Aiven's `ca.pem`
   (`MYSQL_ATTR_SSL_CA` already points to `/etc/secrets/db-ca.pem`).
4. Deploy. Boot automations run `migrate --force` and the idempotent
   `AdminSeeder`. Verify: `https://cognivia-api.onrender.com/up` returns 200.

## 3. Frontend — Vercel

1. Sign up at <https://vercel.com> with GitHub and **Add New → Project**,
   importing the `cognivia` repo.
2. Set **Root Directory** to `frontend` (framework preset: Create React App —
   auto-detected; `frontend/vercel.json` supplies SPA rewrites + security headers).
3. Add environment variables (build-time):

   | Var | Value |
   |---|---|
   | `REACT_APP_API_URL` | `https://cognivia-api.onrender.com/api` |
   | `REACT_APP_PUSHER_APP_KEY` | from Pusher (step 4) — omit until then |
   | `REACT_APP_PUSHER_APP_CLUSTER` | from Pusher (step 4) — omit until then |

   Leave `REACT_APP_PUSHER_HOST` **unset** in production — that switches the
   frontend from the Soketi proxy to hosted Pusher automatically.
4. Deploy. Your site is live at the assigned `*.vercel.app` URL.
5. If you guessed `FRONTEND_URL` in step 2, confirm it matches this URL exactly
   (scheme + host, no trailing slash) — it drives the API's CORS allow-list.

## 4. Realtime — Pusher Channels (optional)

Login approval works without this (polling fallback); realtime just makes it
instant.

1. Create a free app at <https://pusher.com/channels> (note key, secret,
   app id, cluster).
2. On **Render**, set: `BROADCAST_CONNECTION=pusher`, `PUSHER_APP_ID`,
   `PUSHER_APP_KEY`, `PUSHER_APP_SECRET`, `PUSHER_APP_CLUSTER`,
   `PUSHER_HOST=api-<cluster>.pusher.com`, `PUSHER_PORT=443`,
   `PUSHER_SCHEME=https`.
3. On **Vercel**, set `REACT_APP_PUSHER_APP_KEY` + `REACT_APP_PUSHER_APP_CLUSTER`
   and redeploy (CRA bakes env vars in at build time).

## 5. Password-reset email

`MAIL_MAILER` defaults to `log` (reset emails are written to the Render logs).
To send real email, the recommended setup is the **Gmail API** mailer — it is
free, needs no custom domain, and works on Render's free tier. See below for
why SMTP does not.

### Why not SMTP on Render free

Two walls make SMTP unworkable here:

1. Render's free tier **blocks outbound SMTP ports 25/465/587**, so Gmail SMTP
   is unreachable.
2. A relay on the allowed port 2525 (e.g. Brevo) connects, but is **not
   authorized to send "From" an `@gmail.com` address** — `gmail.com`'s SPF only
   authorizes Google. Such mail fails DMARC and is dropped silently (nothing
   arrives, not even spam). Fixing this the SMTP way requires authenticating a
   **custom domain you own** (DKIM/DMARC) with the relay.

### Gmail API mailer (free, no custom domain)

The `gmail` mailer (`App\Mail\Transport\GmailApiTransport`) sends over the Gmail
API on HTTPS (port 443, not blocked) as the authenticated Google account —
fully SPF/DKIM/DMARC aligned. Limit: ~500 emails/day on a free Gmail account.

**One-time setup:**

1. **Google Cloud Console** (https://console.cloud.google.com) → create a
   project → **APIs & Services → Library** → enable **Gmail API**.
2. **OAuth consent screen** → User type **External** → fill the required fields →
   add scope `.../auth/gmail.send` → set **Publishing status: In production**
   (so the refresh token does not expire after 7 days). Add your Gmail as a
   test user if you keep it in Testing.
3. **Credentials → Create credentials → OAuth client ID** → type **Web
   application** → add Authorized redirect URI `http://localhost`. Note the
   **Client ID** and **Client secret**.
4. Locally, set `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET` in `backend/.env`,
   then run:

   ```bash
   docker exec cognivia_backend php artisan gmail:authorize
   ```

   Open the printed URL, approve access, copy the `code` from the
   `http://localhost/?code=...` redirect (the page will not load — that's
   expected), then run:

   ```bash
   docker exec cognivia_backend php artisan gmail:authorize --code=THE_CODE
   ```

   This prints `GMAIL_REFRESH_TOKEN=...`.
5. On **Render**, set: `MAIL_MAILER=gmail`, `GMAIL_CLIENT_ID`,
   `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, and `MAIL_FROM_ADDRESS` = the
   authorized Gmail address. Redeploy.
6. Verify delivery:

   ```bash
   docker exec cognivia_backend php artisan mail:test you@example.com
   ```

## 6. Mobile app

Point the Expo build at production by setting
`EXPO_PUBLIC_API_URL=https://cognivia-api.onrender.com/api` in `mobile/.env`
— no more ngrok needed for production builds.

## Smoke test

1. Open the Vercel URL → register a user → log in.
2. Upload a document → generate flashcards → study.
3. Visit `/admin` → log in with the seeded admin credentials.
4. If Pusher is configured: log in on web while logged in on mobile → approval
   prompt should appear in realtime; otherwise it appears via polling.
