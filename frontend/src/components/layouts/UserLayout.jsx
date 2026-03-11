import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * UserLayout — completely standalone, NO ColorAdmin shell.
 * Wraps all user-facing pages (/dashboard, /profile, etc.)
 * Admin routes continue using the ColorAdmin <App /> shell.
 */
function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080f' }}>
      <Outlet />
    </div>
  );
}

export default UserLayout;