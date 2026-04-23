import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../services/api.js';
// CHANGE 1 — Added: import STORAGE_KEYS from api.js
// What:  Imports the centralised storage-key constants.
// Why:   Admin token is now stored under 'admin_token'. Reading the old
//        'token' key yields null after the fix, locking admins out.

function AdminPrivateRoute({ children }) {
  const [isChecking, setIsChecking]       = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // CHANGE 2 — Token + user data reads: 'token'/'user' → admin-namespaced keys.
    // What:  Reads STORAGE_KEYS.ADMIN_TOKEN and STORAGE_KEYS.ADMIN_DATA
    //        from localStorage only.
    // Why (1 — key namespace): old 'token' key is no longer written.
    // Why (2 — localStorage only): admin login never offers a rememberMe
    //        toggle and always writes to localStorage. The sessionStorage
    //        fallback was dead code that could accidentally pick up a user's
    //        sessionStorage token and grant a regular user admin access
    //        if their role object happened to contain role:'admin' somehow.
    //        Removing sessionStorage from the admin guard is a security
    //        hardening — not just a cleanup.
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    const user  = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}');

    setIsAuthenticated(!!token && user.role === 'admin');
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     '#1a1a2e',
      }}>
        <div style={{
          width:        '40px',
          height:       '40px',
          border:       '3px solid rgba(255,255,255,0.2)',
          borderTop:    '3px solid #0d9488',
          borderRadius: '50%',
          animation:    'spin 0.8s linear infinite',
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/admin/login' replace />;
  }

  return children;
}

export default AdminPrivateRoute;