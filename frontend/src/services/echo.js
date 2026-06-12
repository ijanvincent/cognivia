import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { STORAGE_KEYS, API_BASE_URL } from './api.js';
// CHANGE 1 — Added: import STORAGE_KEYS from api.js
// What:  Imports the centralised storage-key constants.
// Why:   getEcho() was reading localStorage['token'] / sessionStorage['token']
//        — the old shared key. After the namespace fix those keys no longer
//        exist; user token now lives under STORAGE_KEYS.USER_TOKEN.
//        Without this change getEcho() always returns null, breaking all
//        real-time features (force-logout listener, conflict channel).

window.Pusher = Pusher;

let echoInstance = null;

// ---------------------------------------------------------------------------
// CHANGE 2 — getEcho(): token read updated to STORAGE_KEYS.USER_TOKEN.
// What:  localStorage.getItem('token') || sessionStorage.getItem('token')
//        → localStorage.getItem(STORAGE_KEYS.USER_TOKEN) || sessionStorage...
// Why:   This function is called exclusively from user-side screens
//        (UserDashboard). It must read the user-namespaced key. Reading
//        the old 'token' key would find nothing (fixed sessions) or —
//        worse — find the admin token if admin is also logged in, causing
//        the user's WebSocket to authenticate as admin.
// ---------------------------------------------------------------------------
export const getEcho = () => {
  const token =
    localStorage.getItem(STORAGE_KEYS.USER_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN);

  if (!token) return null;
  if (echoInstance) return echoInstance;

  echoInstance = _buildEchoInstance(token);
  return echoInstance;
};

/**
 * getEchoWithToken(token) — accepts an explicit token.
 * Used during conflict resolution: the user has no session token yet,
 * only a short-lived conflict_token. Storage is empty at that point.
 * No change needed here — caller already supplies the token explicitly.
 */
export const getEchoWithToken = (token) => {
  if (!token) return null;
  // Always build a fresh instance — never reuse the singleton because
  // this is a temporary conflict-only connection.
  return _buildEchoInstance(token);
};

/**
 * _buildEchoInstance(token) — shared internal builder.
 * No changes to this function — token source is now caller-controlled.
 */
const _buildEchoInstance = (token) => {
  // Realtime is a convenience signal only — every consumer also polls the
  // API as the authoritative fallback and already handles a null Echo.
  // Without a key, new Pusher(undefined) throws inside the caller's render
  // effect and white-screens the app, so degrade to polling instead.
  if (!process.env.REACT_APP_PUSHER_APP_KEY) return null;

  // Self-hosted Soketi (dev/ngrok): REACT_APP_PUSHER_HOST is set and the
  // connection goes through the nginx /ws proxy. Hosted Pusher (production):
  // leave REACT_APP_PUSHER_HOST unset and pusher-js derives the endpoint
  // from the cluster — no custom host or path applies there.
  const wsHost = process.env.REACT_APP_PUSHER_HOST;

  return new Echo({
    broadcaster:       'pusher',
    key:               process.env.REACT_APP_PUSHER_APP_KEY,
    forceTLS:          true,
    encrypted:         true,
    disableStats:      true,
    enabledTransports: ['wss'],
    cluster:           process.env.REACT_APP_PUSHER_APP_CLUSTER,
    ...(wsHost && {
      wsHost,
      wsPort:   parseInt(process.env.REACT_APP_PUSHER_PORT),
      wssPort:  parseInt(process.env.REACT_APP_PUSHER_PORT),
      wsPath:   '/ws',
      httpPath: '/ws',
    }),
    authEndpoint:      `${API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization:                `Bearer ${token}`,
        'X-Platform':                 'web',
        Accept:                       'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    },
  });
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
