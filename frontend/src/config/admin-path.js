// ---------------------------------------------------------------------------
// Admin route prefix — single source of truth.
//
// What:  Centralizes the (deliberately non-obvious) URL prefix under which the
//        entire admin SPA section is mounted, plus a helper to build admin
//        routes from it.
// Why:   The default `/admin` path is the first thing automated panel scanners
//        probe. Mounting the admin UI under an unguessable prefix removes it
//        from those wordlists (defense in depth — see SECURITY note below).
//        Keeping the prefix in ONE place means it can be rotated via the
//        REACT_APP_ADMIN_PATH build var without editing components.
//
// SECURITY: This is obscurity, not access control. A frontend bundle is public,
//        so a determined reader can still recover this prefix. Real protection
//        is enforced server-side (auth:sanctum + AdminMiddleware) and should be
//        reinforced at the edge (IP allowlist / access gate) in production.
//
// NOTE:  Changing the default below (or REACT_APP_ADMIN_PATH) must stay in sync
//        with currentRole() in services/api.js, which infers the admin role
//        from the URL prefix via ADMIN_BASE.
// ---------------------------------------------------------------------------

// Normalize: strip any surrounding slashes so callers control the leading '/'.
const RAW = (process.env.REACT_APP_ADMIN_PATH || 'ops-c5afc9').replace(/^\/+|\/+$/g, '');

// 'ops-c5afc9'  — bare segment, for relative React Router child paths.
export const ADMIN_PATH = RAW;

// '/ops-c5afc9' — absolute base, for prefix matching and link building.
export const ADMIN_BASE = `/${RAW}`;

/**
 * Build an absolute admin route.
 * @example adminPath('/users')        -> '/ops-c5afc9/users'
 * @example adminPath(`/users/${id}`)  -> '/ops-c5afc9/users/42'
 * @example adminPath()                -> '/ops-c5afc9'
 */
export const adminPath = (sub = '') => {
  const tail = String(sub).replace(/^\/+/, '');
  return tail ? `${ADMIN_BASE}/${tail}` : ADMIN_BASE;
};
