// generate.js — load test for the EXPENSIVE AI generation path.
//
// WARNING: every iteration calls OpenRouter and consumes real quota/money. Run
// it deliberately, at low concurrency, against a non-production key. Its purpose
// is to confirm the throttle holds and to measure how generation latency and
// worker saturation behave under a handful of simultaneous requests — not to
// blast thousands of calls.
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const PLATFORM = __ENV.PLATFORM || 'web';

export const options = {
  // Deliberately small: 5 concurrent generations is already enough to reveal
  // worker starvation on a single instance.
  stages: [
    { duration: '20s', target: 5 },
    { duration: '40s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // A 429 here is a PASS for the throttle, so we only assert that requests
    // either succeed or are correctly rate-limited — never 5xx.
    'http_req_failed{expected_response:true}': ['rate<0.05'],
  },
};

const SAMPLE_TEXT =
  'Photosynthesis is the process by which green plants convert light energy ' +
  'into chemical energy stored in glucose. It occurs in the chloroplasts and ' +
  'requires carbon dioxide, water, and sunlight, producing oxygen as a byproduct.';

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
  const token = res.json('token');
  if (!token) {
    throw new Error(`Login did not return a token (status ${res.status}).`);
  }
  return { token };
}

export default function (data) {
  const res = http.post(
    `${BASE_URL}/api/flashcards/generate`,
    JSON.stringify({
      document_text: SAMPLE_TEXT,
      number_of_cards: 3,
      card_types: ['identification'],
    }),
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
        'X-Platform': PLATFORM,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: '130s', // generation can be slow; do not let k6 cut it short
    },
  );

  // 200 = generated, 429 = throttle did its job. Both are acceptable; 5xx is not.
  check(res, {
    'generated or throttled': (r) => r.status === 200 || r.status === 429,
    'no server error': (r) => r.status < 500,
  });

  sleep(1);
}
