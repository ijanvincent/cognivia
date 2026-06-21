// browse.js — realistic "many users browsing at once" load test.
//
// Authenticates ONCE in setup() (so the per-IP login throttle is never tripped)
// and then drives the cheap authenticated read endpoints under a ramping load.
// This is the safe default: it costs nothing and exercises the path real users
// hit most. See README.md for how to run.
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const PLATFORM = __ENV.PLATFORM || 'web';

export const options = {
  // Ramp 0 -> 50 -> 100 concurrent users, then back down. Tune the peak to the
  // load you want to prove the system survives.
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // The test FAILS (non-zero exit) if these are breached — so it works in CI.
    http_req_failed: ['rate<0.01'], // < 1% errors
    http_req_duration: ['p(95)<800'], // 95% of requests under 800ms
  },
};

// Runs once before the VUs start. Logs in and hands the token to every VU.
export function setup() {
  const email = __ENV.TEST_EMAIL;
  const password = __ENV.TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD (see load-tests/README.md).');
  }

  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email, password, platform: PLATFORM }),
    { headers: { 'Content-Type': 'application/json', 'X-Platform': PLATFORM } },
  );

  check(res, { 'login succeeded': (r) => r.status === 200 });
  const token = res.json('token');
  if (!token) {
    throw new Error(`Login did not return a token (status ${res.status}). Check credentials.`);
  }
  return { token };
}

export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
      'X-Platform': PLATFORM,
      Accept: 'application/json',
    },
  };

  const me = http.get(`${BASE_URL}/api/auth/me`, params);
  check(me, { '/auth/me 200': (r) => r.status === 200 });

  const decks = http.get(`${BASE_URL}/api/decks`, params);
  check(decks, { '/decks 200': (r) => r.status === 200 });

  sleep(1); // model a user pausing between actions
}
