import React from 'react';
import { useNavigate } from 'react-router-dom';
import api, { STORAGE_KEYS } from '../../../services/api.js';

/*
 * NAMESPACE FIX — Replace all generic 'token'/'user' storage reads/removes.
 *
 * What:  All storage operations updated to role-namespaced keys:
 *          localStorage.getItem('user')      → role-aware read (see below)
 *          localStorage.removeItem('token')  → STORAGE_KEYS.ADMIN_TOKEN /
 *                                              STORAGE_KEYS.USER_TOKEN
 *          localStorage.removeItem('user')   → STORAGE_KEYS.ADMIN_DATA /
 *                                              STORAGE_KEYS.USER_DATA
 *
 * Why:   The component read localStorage['user'] to determine role and
 *        display name. After the namespace fix, 'user' is no longer written
 *        by any login flow — it will always be null. The admin session is
 *        now in 'admin_data' (localStorage only). The user session is in
 *        'user_data' (localStorage or sessionStorage depending on rememberMe).
 *        Reading the wrong key caused the header to show "User / Member"
 *        for admins and show nothing for users.
 *
 * Resolution strategy — role detection order:
 *   1. Check localStorage for ADMIN_TOKEN → if present, this is an admin session.
 *   2. Check localStorage for USER_TOKEN  → if present, this is a remembered user.
 *   3. Check sessionStorage for USER_TOKEN → non-remembered user session.
 *   Admin always takes priority when both sessions coexist (admin is viewing
 *   the admin panel — the header is only rendered inside the admin layout).
 *
 * Logout:
 *   Clears only the keys belonging to the role being logged out.
 *   Admin logout never touches user keys and vice versa.
 */

function getAdminUser() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (!token) return null;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || 'null');
  } catch { return null; }
}

function DropdownProfile() {
  const navigate = useNavigate();

  // This component is rendered inside the admin layout — admin data takes
  // priority. Fall back to user data only if no admin session exists.
  const adminUser = getAdminUser();
  const isAdmin   = Boolean(adminUser);
  const user      = adminUser || (() => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || '{}');
      }
      if (sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER_DATA) || '{}');
      }
      return {};
    } catch { return {}; }
  })();

  const displayName = user?.username || 'User';

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await api.post(isAdmin ? '/admin/logout' : '/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // NAMESPACE FIX — Remove only the current role's keys.
      // What:  localStorage.removeItem('token') / localStorage.removeItem('user')
      //        → role-specific key pairs only.
      // Why:   The generic removes wiped whichever key existed regardless of
      //        role. If user and admin were both logged in, admin logout would
      //        also destroy the user session (and vice versa). Scoped removes
      //        guarantee each logout only clears its own session.
      if (isAdmin) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        sessionStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
      navigate(isAdmin ? '/admin/login' : '/login');
    }
  }

  return (
    <div className="navbar-item navbar-user dropdown">
      <a href="#/" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 'bold', fontSize: '14px',
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span>
          <span className="d-none d-md-inline">{displayName}</span>
          <b className="caret"></b>
        </span>
      </a>
      <div className="dropdown-menu dropdown-menu-end me-1">
        {!isAdmin && (
          <>
            <a href="#/" className="dropdown-item">Edit Profile</a>
            <a href="#/" className="dropdown-item d-flex align-items-center">
              Inbox
              <span className="badge bg-danger rounded-pill ms-auto pb-4px">2</span>
            </a>
            <a href="#/" className="dropdown-item">Calendar</a>
            <a href="#/" className="dropdown-item">Settings</a>
            <div className="dropdown-divider"></div>
          </>
        )}
        {isAdmin && (
          <>
            <div className="dropdown-header text-muted">
              <small>Logged in as Administrator</small>
            </div>
            <div className="dropdown-divider"></div>
          </>
        )}
        <a href="#/" className="dropdown-item text-danger" onClick={handleLogout}>
          <i className="fa fa-sign-out-alt me-1"></i> Log Out
        </a>
      </div>
    </div>
  );
}

export default DropdownProfile;