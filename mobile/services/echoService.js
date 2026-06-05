/**
 * mobile/services/echoService.js
 *
 * Changes from previous version:
 *
 * 1. Removed hardcoded IP fallbacks ('10.100.220.52').
 *    Why: when the dev machine IP changes (DHCP, different network) the app
 *    silently connects to a stale address. Env vars are the single source of
 *    truth; missing vars now produce an empty string so the failure is obvious
 *    in logs rather than mysteriously connecting to the wrong host.
 *
 * 2. Extracted _buildEchoInstance() shared builder.
 *    Why: getEcho() and the new getEchoWithToken() were duplicating the same
 *    Pusher + Echo construction logic. One builder, two callers.
 *
 * 3. Added getEchoWithToken(token).
 *    What: builds a fresh, non-singleton Echo instance authenticated with an
 *    explicit bearer token instead of reading SecureStore.
 *    Why: during the approval gate flow, Platform B (mobile) has no real
 *    session token stored yet — only the short-lived conflict_token returned
 *    in the 422 response. SecureStore would be empty at that point.
 *    The caller (LoginScreen) stores the instance in a ref and calls
 *    .disconnect() when the gate resolves.
 *
 * 4. forceTLS: false → true, encrypted: false → true,
 *    wsPort → wssPort, enabledTransports: ['ws','wss'] → ['wss'].
 *    Why: ngrok only serves secure WebSocket (wss://) on port 443.
 *    The old config attempted plain ws:// first which ngrok rejects,
 *    causing the connection to fail silently. Using wssPort and forcing
 *    TLS ensures the client connects on the correct secure transport
 *    that ngrok → nginx → Soketi expects.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import * as SecureStore from 'expo-secure-store';

const PUSHER_KEY     = process.env.EXPO_PUBLIC_PUSHER_APP_KEY     || '';
const PUSHER_HOST    = process.env.EXPO_PUBLIC_PUSHER_HOST        || '';
const PUSHER_PORT    = parseInt(process.env.EXPO_PUBLIC_PUSHER_PORT || '443', 10);
const PUSHER_CLUSTER = process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';
const API_URL        = process.env.EXPO_PUBLIC_API_URL            || '';

let echoInstance = null;

// ---------------------------------------------------------------------------
// Singleton — for authenticated screens (Dashboard, etc.)
// Reads the stored session token from SecureStore.
// ---------------------------------------------------------------------------
export const getEcho = async () => {
    if (echoInstance) return echoInstance;

    const token = await SecureStore.getItemAsync('token');
    if (!token) return null;

    echoInstance = _buildEchoInstance(token);
    return echoInstance;
};

// ---------------------------------------------------------------------------
// Temporary instance — for the approval gate flow.
// The caller must hold the reference and call .disconnect() when done.
// Never touches the singleton or SecureStore.
// ---------------------------------------------------------------------------
export const getEchoWithToken = (token) => {
    if (!token) return null;
    return _buildEchoInstance(token);
};

// ---------------------------------------------------------------------------
// Disconnect and clear the singleton.
// Call on logout so the next login gets a fresh instance with a new token.
// ---------------------------------------------------------------------------
export const disconnectEcho = () => {
    if (echoInstance) {
        try { echoInstance.disconnect(); } catch (_) {}
        echoInstance = null;
    }
};

// ---------------------------------------------------------------------------
// Internal — shared Echo + Pusher builder.
// ---------------------------------------------------------------------------
const _buildEchoInstance = (token) => {
    const authHeaders = {
        Authorization: `Bearer ${token}`,
        'X-Platform': 'mobile',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    const pusherClient = new Pusher(PUSHER_KEY, {
        wsHost:            PUSHER_HOST,
        wssPort:           PUSHER_PORT,
        wsPath:            '/ws',
        httpPath:          '/ws',
        forceTLS:          true,
        encrypted:         true,
        disableStats:      true,
        enabledTransports: ['wss'],
        cluster:           PUSHER_CLUSTER,
        channelAuthorization: {
            customHandler: async ({ socketId, channelName }, callback) => {
                try {
                    const response = await fetch(`${API_URL}/broadcasting/auth`, {
                        method: 'POST',
                        headers: authHeaders,
                        body: JSON.stringify({
                            socket_id: socketId,
                            channel_name: channelName,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        callback(new Error(data?.message || 'Broadcast authorization failed.'), null);
                        return;
                    }

                    callback(null, data);
                } catch (error) {
                    callback(error, null);
                }
            },
        },
        authorizer: (channel) => ({
            authorize: async (socketId, callback) => {
                try {
                    const response = await fetch(`${API_URL}/broadcasting/auth`, {
                        method: 'POST',
                        headers: authHeaders,
                        body: JSON.stringify({
                            socket_id: socketId,
                            channel_name: channel.name,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        callback(new Error(data?.message || 'Broadcast authorization failed.'), null);
                        return;
                    }

                    callback(null, data);
                } catch (error) {
                    callback(error, null);
                }
            },
        }),
    });

    return new Echo({
        broadcaster:  'pusher',
        key:          PUSHER_KEY,
        client:       pusherClient,
        authEndpoint: `${API_URL}/broadcasting/auth`,
        auth: {
            headers: authHeaders,
        },
    });
};
