import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../services/api.js';
// CHANGE 1 — Added: import STORAGE_KEYS from api.js
// What:  Imports the centralised storage-key constants.
// Why:   Token and user data are now stored under namespaced keys.
//        Reading the old 'token'/'user' keys would always yield null
//        after the fix, locking every user out of authenticated routes.

function PrivateRoute({ children }) {
  const [isChecking, setIsChecking]           = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // CHANGE 2 — Token + user data reads: 'token'/'user' → namespaced keys.
    // What:  localStorage.getItem('token') || sessionStorage.getItem('token')
    //        → USER_TOKEN equivalents.
    //        localStorage.getItem('user') || sessionStorage.getItem('user')
    //        → USER_DATA equivalents.
    // Why:   Old keys are no longer written by the fixed login flow.
    //        Additionally, reading the old 'user' key could return the
    //        admin's user object (role: 'admin') — causing user.role === 'user'
    //        to be false and bouncing legitimate users back to /login.
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN)
      || sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN);

    const user = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USER_DATA)
      || sessionStorage.getItem(STORAGE_KEYS.USER_DATA)
      || '{}',
    );

    setIsAuthenticated(!!token && user.role === 'user');
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || isChecking) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, isChecking]);

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080f' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
}

export default PrivateRoute;