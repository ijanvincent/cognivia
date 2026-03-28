import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import api from '../../services/api.js';
import { getEcho, disconnectEcho } from '../../services/echo.js';

const APP_DOWNLOAD_URL = process.env.REACT_APP_DOWNLOAD_URL || 'https://cognivia.app/download';

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconChevron = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function getStoredUser() {
  try {
    if (localStorage.getItem('token')) {
      return JSON.parse(localStorage.getItem('user') || 'null') || {};
    }
    if (sessionStorage.getItem('token')) {
      return JSON.parse(sessionStorage.getItem('user') || 'null') || {};
    }
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return JSON.parse(raw || 'null') || {};
  } catch { return {}; }
}

function UserDashboard() {
  const [mounted, setMounted]           = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser]                 = useState(() => getStoredUser());
  const navigate                        = useNavigate();

  const userName    = user.name || user.username || 'Learner';
  const userInitial = userName.charAt(0).toUpperCase();


  useEffect(() => {
    setUser(getStoredUser());
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);


  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail || getStoredUser());
    window.addEventListener('cognivia:userUpdated', handleUserUpdated);
    return () => window.removeEventListener('cognivia:userUpdated', handleUserUpdated);
  }, []);


  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const echo = getEcho();
    if (!echo) return;

    echo.private(`user.${userId}`)
      .listen('.force.logout', (e) => {
        if (e.platform === 'web') {
          handleLogout();
        }
      });

    return () => {
      disconnectEcho();
    };
  }, [user?.id]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.replace('/login');
  };

  const handleEditProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <div className={`${styles.page} ${mounted ? styles.mounted : ''}`}>


      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Welcome back, <span className={styles.accentName}>{userName}</span>
          </p>
        </div>


        <div className={styles.avatarWrapper}>
          <button
            className={`${styles.avatarChip} ${dropdownOpen ? styles.avatarChipActive : ''}`}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <div className={styles.avatar}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={userName}
                  className={styles.avatarImg}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.textContent = userInitial;
                  }}
                />
              ) : userInitial}
            </div>
            <div>
              <div className={styles.avatarName}>{userName}</div>
              <div className={styles.avatarRole}>{user.role || 'Member'}</div>
            </div>
            <span className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}>
              <IconChevron />
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setDropdownOpen(false)}
              />
              <div className={styles.dropdown} style={{ zIndex: 100 }}>
                <button
                  className={styles.dropdownItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleEditProfile}
                >
                  <span className={styles.dropdownIcon}><IconUser /></span>
                  Edit Profile
                </button>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 6px', pointerEvents: 'none' }} />
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={handleLogout}
                >
                  <span className={styles.dropdownIcon}><IconLogout /></span>
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>


      <div className={styles.qrWrapper}>
        <div className={styles.qrCard}>
          <div className={styles.qrCodeBox}>
            <QRCode
              value={APP_DOWNLOAD_URL}
              size={180}
              bgColor="transparent"
              fgColor="#f1f5f9"
              level="H"
            />
          </div>
          <h2 className={styles.qrTitle}>Please Scan for the full experience</h2>
          <p className={styles.qrSubtitle}>
            Scan the QR code with your phone camera<br />
            to download CogniVia and start learning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;