import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Env var is the single source of truth — no hardcoded fallback, so a missing
// var fails loudly in the log below instead of hitting a stale tunnel URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
console.log('📡 API URL being used:', API_URL);

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

export default api;