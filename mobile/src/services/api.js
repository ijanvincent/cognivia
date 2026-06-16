import axios from 'axios';
import * as SecureStore from './secureStorage';

// Env var is the single source of truth — no hardcoded fallback, so a missing
// var fails loudly in the log below instead of hitting a stale tunnel URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
console.log('📡 API URL being used:', API_URL);

// Uploaded assets (avatars) are stored as relative paths like /storage/...
// Native <Image> can't load relative URIs, so resolve them against the same
// host the API uses. Mirrors resolveAvatarUrl in the web frontend.
export const ASSET_BASE_URL = API_URL.replace(/\/api\/?$/, '');

export function resolveAvatarUrl(avatar) {
    if (!avatar) return null;
    if (/^(https?:|blob:|file:|data:|content:)/.test(avatar)) return avatar;
    return avatar.startsWith('/') ? `${ASSET_BASE_URL}${avatar}` : `${ASSET_BASE_URL}/storage/${avatar}`;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type':               'application/json',
        'Accept':                     'application/json',
        'X-Platform':                 'mobile',
        'ngrok-skip-browser-warning': 'true',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
        }
        return Promise.reject(error);
    }
);

/**
 * NEW — what: explicit logout function that calls the backend first.
 * why: this is the critical piece that triggers the ForceLogout broadcast.
 * The previous pattern relied on the 401 interceptor which only fires on
 * failed requests, never on intentional logout. Without calling
 * POST /auth/logout, the backend never fires the event, and web never
 * receives the signal to auto-proceed.
 *
 * Flow:
 *   1. POST /api/auth/logout  →  backend fires ForceLogout broadcast
 *   2. Web receives .force.logout via Echo (sub-second)
 *   3. Web auto-retries login and navigates to /dashboard
 *   4. THEN we clear SecureStore and disconnect Echo on mobile
 *
 * Why clear AFTER the API call: the token must be valid when the request
 * hits the server. Clearing first would cause a 401 on the logout call
 * itself, skipping the broadcast entirely.
 */
export const performLogout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        // Even if the network call fails, we still clear local state.
        // The mobile session will eventually expire on the backend.
        console.warn('[CogniVia] Logout API call failed, clearing local session anyway:', error?.message);
    } finally {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
    }
};

/**
 * Pull the canonical profile from the server and merge it into the cached
 * user. Realtime `.profile.updated` events only reach a platform while its
 * socket is connected — if the profile changed while this app was closed,
 * the cache is stale until the next login. Calling this on screen focus
 * keeps web and mobile in sync regardless of socket state.
 */
/**
 * Fire-and-forget warm-up ping for the free-tier backend.
 *
 * Render free web services spin down after ~15 min idle and cold-start in
 * ~30s. Flashcard generation is the only long request (cold start + a 15-30s
 * AI call), so on a cold instance it can take ~50-65s and fail on the device.
 * Pinging this when the Generate screen opens spins the instance (and DB) up
 * while the user picks a file and names the deck, so the real generate request
 * hits a warm instance.
 */
export const warmUpBackend = async () => {
    try {
        // /health/db is a public, side-effect-free DB ping (routes/api.php).
        // 70s timeout tolerates a full Render cold start.
        await api.get('/health/db', { timeout: 70000 });
    } catch (error) {
        // Best-effort only; the real request surfaces any genuine problem.
        console.warn('[CogniVia] Backend warm-up ping failed:', error?.message);
    }
};

export const refreshUserProfile = async () => {
    const res   = await api.get('/auth/me');
    const fresh = res.data?.user;
    if (!fresh) return null;
    const stored = await SecureStore.getItemAsync('user');
    const merged = { ...(stored ? JSON.parse(stored) : {}), ...fresh };
    await SecureStore.setItemAsync('user', JSON.stringify(merged));
    return merged;
};

export default api;