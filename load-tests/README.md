# Load tests (k6)

These [k6](https://k6.io) scripts turn "will it handle the load?" into a measured
number instead of a guess. They target the **authenticated read path** — the
traffic real users generate most — and, optionally, the expensive AI generation
path.

> **Why k6:** it is free, open-source, scriptable in JS, and runs anywhere
> (binary or Docker). No SaaS account required.

## Running without installing anything (Docker)

```bash
# From the repo root. --network host so the container can reach localhost:3000.
docker run --rm -i --network host \
  -e BASE_URL=http://localhost:3000 \
  -e TEST_EMAIL=you@example.com \
  -e TEST_PASSWORD=yourpassword \
  grafana/k6 run - < load-tests/browse.js
```

## Running with a local k6 binary

```bash
# macOS: brew install k6   |   Windows: choco install k6   |   Linux: see k6.io/docs
BASE_URL=http://localhost:3000 \
TEST_EMAIL=you@example.com \
TEST_PASSWORD=yourpassword \
k6 run load-tests/browse.js
```

## Environment variables

| Var             | Default                  | Purpose                                  |
| --------------- | ------------------------ | ---------------------------------------- |
| `BASE_URL`      | `http://localhost:3000`  | API gateway origin                       |
| `TEST_EMAIL`    | _(required)_             | An existing user account to authenticate |
| `TEST_PASSWORD` | _(required)_             | That account's password                  |
| `PLATFORM`      | `web`                    | `X-Platform` header value                |

## Scripts

### `browse.js` — the safe default
Logs in **once** in `setup()` (so the login throttle is never tripped), then
hammers the cheap authenticated endpoints (`/api/auth/me`, `/api/decks`) with a
ramping load. This is the realistic "lots of users browsing at once" test and
costs nothing.

Thresholds (the test **fails** if breached):
- `http_req_failed` < 1%
- `http_req_duration` p95 < 800ms

### `generate.js` — opt-in, **spends real AI quota/money**
Drives `POST /api/flashcards/generate`, the slow path that holds a worker for
seconds. Kept at a low VU count on purpose. **Each iteration calls OpenRouter
and consumes quota** — only run it deliberately, against a non-production key.

```bash
BASE_URL=http://localhost:3000 TEST_EMAIL=... TEST_PASSWORD=... \
k6 run load-tests/generate.js
```

## Reading the result
Watch `http_req_duration` (p95/p99) and `http_req_failed`. When p95 climbs or
failures appear as VUs rise, you have found the current ceiling — that is the
number to quote, and the trigger to apply the scaling steps in
[`../SCALING.md`](../SCALING.md).
</content>
</invoke>
