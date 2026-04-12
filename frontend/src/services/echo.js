import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

/**
 * getEcho() — for authenticated users (full session token).
 * Used by UserDashboard and any screen that needs real-time
 * features after login is complete.
 */
export const getEcho = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) return null;
    if (echoInstance) return echoInstance;

    echoInstance = _buildEchoInstance(token);
    return echoInstance;
};

/**
 * getEchoWithToken(token) — NEW.
 * what: accepts an explicit token instead of reading from storage.
 * why: during conflict resolution the user has no session token yet —
 * only a short-lived conflict_token. We cannot use getEcho() because
 * localStorage/sessionStorage are empty. This function lets UserLogin
 * build a temporary Echo connection using the conflict_token so it
 * can subscribe to the private channel before login completes.
 */
export const getEchoWithToken = (token) => {
    if (!token) return null;
    // Always build a fresh instance — never reuse the singleton here
    // because this is a temporary conflict-only connection.
    return _buildEchoInstance(token);
};

/**
 * _buildEchoInstance(token) — shared internal builder.
 * what: constructs the Echo instance with correct WSS config.
 * why: centralised so getEcho and getEchoWithToken stay in sync.
 *
 * CHANGED — wsHost, wsPort, wssPort, forceTLS, enabledTransports:
 * Previously pointed to local IP 10.76.253.117:6001 which is
 * unreachable from the public internet. Now routes WebSocket through
 * the ngrok tunnel via the /ws nginx proxy path on port 443.
 * forceTLS: true because ngrok only serves WSS (not WS).
 */
const _buildEchoInstance = (token) => {
    return new Echo({
        broadcaster:       'pusher',
        key:               process.env.REACT_APP_PUSHER_APP_KEY,

        // CHANGED — wsHost: ngrok domain instead of local IP
        wsHost:            process.env.REACT_APP_PUSHER_HOST,

        // CHANGED — wsPort/wssPort: 443 (ngrok HTTPS port)
        wsPort:            parseInt(process.env.REACT_APP_PUSHER_PORT),
        wssPort:           parseInt(process.env.REACT_APP_PUSHER_PORT),

        // CHANGED — forceTLS: true because ngrok is HTTPS/WSS only
        forceTLS:          true,

        encrypted:         true,
        disableStats:      true,

        // CHANGED — enabledTransports: wss only (no plain ws over ngrok)
        enabledTransports: ['wss'],

        cluster:           process.env.REACT_APP_PUSHER_APP_CLUSTER,

        // CHANGED — wsPath: '/ws' so nginx knows to proxy to Soketi.
        // Without this, Pusher.js connects to wss://host:443/ which
        // nginx serves as the Laravel app, not the WebSocket server.
        wsPath:            '/ws',

        authEndpoint:      `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization:               `Bearer ${token}`,
                'X-Platform':                'web',
                Accept:                      'application/json',
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