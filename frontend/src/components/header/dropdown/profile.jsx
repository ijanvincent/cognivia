import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api.js';

function DropdownProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const displayName = user?.username || 'User';

  async function handleLogout(e) {
    e.preventDefault();
    try {
      
      await api.post(isAdmin ? '/admin/logout' : '/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
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
    color: '#fff', fontWeight: 'bold', fontSize: '14px'
}}>
    {displayName.charAt(0).toUpperCase()}
</div>
        <span>
          <span className="d-none d-md-inline">{displayName}</span>
          <b className="caret"></b>
        </span>
      </a>
      <div className="dropdown-menu dropdown-menu-end me-1">
        {/* Golden Rule #1 — show only role-relevant items */}
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