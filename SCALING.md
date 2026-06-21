# Scaling & production-readiness

This document is the honest answer to "can CogniVia handle thousands of
concurrent users?" — what is true today, what protects the app right now, and
the exact steps to scale when you decide to spend money. Nothing here is
required to keep running on the free tier; it is the upgrade path.

## TL;DR

- **No free tier can serve thousands of *truly simultaneous* requests.** That
  needs paid app instances, a paid queue worker, and a non-pausing database.
- What has been done is to make the architecture **correct, guarded, measured,
  and one config-flip from scaling** — so it degrades gracefully under the load
  it *can* take, and scales without a rewrite the day you pay.
- Production is intentionally left on the safe `sync`/`file`/`database` drivers.
  The Redis path is wired and ready; flip it only after provisioning Redis + a
  worker (see below), or auth and rate-limiting will break.

## The original risk and what now mitigates it

| Risk | Status | Mitigation |
| --- | --- | --- |
| AI/parse calls hold a PHP-FPM worker for seconds and starve cheap endpoints (login) | **Mitigated (free)** | Per-user `throttle` on `/document/parse` (20/min), `/flashcards/generate` (15/min), `/flashcards/check-answer` (60/min) in `routes/api.php` |
| Forgot-password blocks the request on an outbound Gmail API call | **Mitigated (free, forward-compatible)** | `PasswordResetMail implements ShouldQueue` — runs inline under `sync`, async once a worker exists |
| Rate-limit bucket / sessions not shared across instances | **Ready** | Redis-backed cache/session wired; see "Scale out" |
| No visibility into production errors | **Ready** | Sentry wired behind `SENTRY_LARAVEL_DSN` (no-op until set) |
| "Is it fast enough?" was a guess | **Measurable** | k6 load tests in [`load-tests/`](load-tests/README.md) |
| Slow AI work runs in the web request | **Documented, deferred** | Needs a paid worker to matter; see "Make AI generation async" |

## Local: run the full scalable stack

The `docker-compose.yml` includes a `redis` service and an opt-in `worker`
service (behind the `worker` compose profile, so the default `sync` setup never
starts a worker it can't use).

**Free async with no extra service** — use the existing MySQL. In `backend/.env`:

```env
QUEUE_CONNECTION=database
```

**Shared async for scaling out** — use Redis. In `backend/.env`:

```env
REDIS_CLIENT=predis
QUEUE_CONNECTION=redis
CACHE_STORE=redis
SESSION_DRIVER=redis
```

Then start the worker (and Redis if used) and clear cached config:

```bash
docker compose --profile worker up -d
docker exec cognivia_backend php artisan optimize:clear
```

Queued jobs (e.g. password-reset mail) are now drained by the `worker`
container off the request path. Watch it with `docker logs -f cognivia_worker`.

## Production upgrade path (in order)

### 1. Managed Redis (free tier available)
Provision a free Redis — [Upstash](https://upstash.com) has a free plan that
works with the `predis` client over TLS. Add its connection details to Render as
env vars (`REDIS_URL` or `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD`,
`REDIS_CLIENT=predis`).

### 2. A worker process (needs a paid Render service)
Render's free plan gives one web service and **no background worker**, so until
this step `QUEUE_CONNECTION=sync` (jobs run inline) is correct. To go async, add
a Render **Background Worker** running:

```
php artisan queue:work --tries=3 --backoff=5 --max-time=3600
```

### 3. Flip the drivers (only after 1 + 2 exist)
In `render.yaml` / Render env, change:

```env
QUEUE_CONNECTION=redis   # was sync
CACHE_STORE=redis        # was file
SESSION_DRIVER=redis     # was file
```

> Doing this **before** Redis + a worker exist will break login throttling and
> sessions. Order matters.

### 4. Scale out the web tier
Move off free, run **≥2 instances** behind Render's load balancer (redundancy +
headroom). This is only safe once cache/session/rate-limit live in shared Redis
(step 3) — otherwise each instance has its own rate-limit bucket and sessions.

### 5. Make AI generation truly async (client change required)
Today `/api/flashcards/generate` returns the cards synchronously. To stop slow
generations from occupying web workers at all:
- Dispatch a `GenerateFlashcardsJob` to the queue; return `202 Accepted` + a job id.
- Deliver the result over the existing WebSocket layer (Soketi/Pusher) or via polling.
- **Update the web and mobile clients** to handle `202` + the async result.

This is deferred deliberately: it only pays off once a worker exists (step 2),
and it changes the API contract for both clients, so it should land as its own
reviewed change — not bundled with infra config.

### 6. Database
The free Aiven MySQL pauses on inactivity and adds ~1.5–2.5s/query latency. For
real traffic, move to a non-pausing managed MySQL with **connection pooling**
and, when reads dominate, a **read replica**.

### 7. (Later) Throughput per instance — Laravel Octane
Octane (FrankenPHP/Swoole) keeps the framework booted between requests for a
3–5× throughput gain. Deferred because it changes the container run command and
is risky to tune on a constrained instance — adopt it after the above, with
load tests (`load-tests/`) confirming the before/after.

## Verifying capacity
Run the k6 browse test against the target environment and watch
`http_req_duration` p95/p99 and `http_req_failed`. The VU level where p95 climbs
or failures appear is your current ceiling — re-run after each step above to
prove the gain. See [`load-tests/README.md`](load-tests/README.md).
</content>
