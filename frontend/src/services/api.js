import axios from 'axios';

// ---------------------------------------------------------------------------
// CHANGE 1 — STORAGE_KEYS: exported constant replacing all magic strings.
// What:  Single source of truth for every storage key used by both roles.
// Why:   Both sessions previously wrote to 'token' and 'user' — identical
//        keys. Admin login overwrote user session and vice versa.
// ---------------------------------------------------------------------------
export const STORAGE_KEYS = Object.freeze({
  USER_TOKEN:  'user_token',
  USER_DATA:   'user_data',
  ADMIN_TOKEN: 'admin_token',
  ADMIN_DATA:  'admin_data',
});

// ---------------------------------------------------------------------------
// CHANGE 2 — currentRole(): pathname-based role resolver.
// What:  Returns 'admin' | 'user' based on window.location.pathname.
// Why:   Interceptors need role context without React Router coupling.
//        This is the only reliable, synchronous source available inside
//        an axios interceptor closure.
// ---------------------------------------------------------------------------
function currentRole() {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'user';
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Accept':                     'application/json',
    'Content-Type':               'application/json',
    'ngrok-skip-browser-warning': 'true',
    'X-Platform':                 'web',
  },
});

// ---------------------------------------------------------------------------
// CHANGE 3 — Request interceptor: role-namespaced token selection.
// What:  Admin routes read admin_token (localStorage only — admin has no
//        rememberMe toggle). User routes read user_token from localStorage
//        then sessionStorage (covers the non-rememberMe path).
// Why:   Previously read localStorage['token'] || sessionStorage['token']
//        blindly. Admin token leaked into user requests and vice versa.
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = currentRole() === 'admin'
    ? localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
    : (localStorage.getItem(STORAGE_KEYS.USER_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN));

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------------------------------------------------------
// CHANGE 4 — Response interceptor: role-isolated 401 handling.
// What:  On 401, clears only the current role's storage keys and redirects
//        to the correct login page. Sessions are never cross-contaminated.
// Why:   Old handler read localStorage['user'].role to decide redirect — that
//        slot could contain the other role's object, making redirects
//        non-deterministic. Pathname is the reliable signal.
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url || '';

    const isAuthRoute =
      url.includes('/auth/login')           ||
      url.includes('/admin/login')          ||
      url.includes('/auth/register')        ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');

    if (status === 401 && !isAuthRoute) {
      if (currentRole() === 'admin') {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        sessionStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;