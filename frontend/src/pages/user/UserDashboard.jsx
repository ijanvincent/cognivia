import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import api from '../../services/api.js';

const APP_DOWNLOAD_URL = process.env.REACT_APP_DOWNLOAD_URL || 'https://cognivia.app/download';

// ── Icons ──
const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

const IconChart = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" strokeOpacity="0.25"/>
    <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconCrown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3C9 3 6 5 5 7.5"/>
    <path d="M12 3C15 3 18 5 19 7.5"/>
    <path d="M5 7.5C4 9 3.5 10.5 4 12c.5 1.5 1.5 2.5 2.5 3"/>
    <path d="M19 7.5C20 9 20.5 10.5 20 12c-.5 1.5-1.5 2.5-2.5 3"/>
    <path d="M6.5 15C8 17 10 18 12 18c2 0 4-1 5.5-3"/>
    <line x1="12" y1="18" x2="12" y2="21"/>
    <line x1="9"  y1="21" x2="15" y2="21"/>
  </svg>
);

const IconFlame = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
);

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

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <div className={`${styles.page} ${mounted ? styles.mounted : ''}`}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Welcome back, <span className={styles.accentName}>{userName}</span>
          </p>
        </div>

        {/* ── Avatar + Dropdown ── */}
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
              {/* Full-screen overlay — closes dropdown when clicking outside */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setDropdownOpen(false)}
              />

              {/* Dropdown — above overlay */}
              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleEditProfile}
                >
                  <span className={styles.dropdownIcon}><IconUser /></span>
                  Edit Profile
                </button>
                <div className={styles.dropdownDivider} />
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onMouseDown={(e) => e.preventDefault()}
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

      {/* ── QR Code Center ── */}
      <div className={styles.qrWrapper}>
        <div className={styles.qrCard}>
          <div className={styles.qrBadge}>Mobile App</div>

          <div className={styles.qrCodeBox}>
            <QRCode
              value={APP_DOWNLOAD_URL}
              size={180}
              bgColor="transparent"
              fgColor="#f1f5f9"
              level="H"
            />
          </div>

          <h2 className={styles.qrTitle}>Scan for the full experience</h2>
          <p className={styles.qrSubtitle}>
            Point your phone camera at the QR code<br />
            to download the CogniVia mobile app.
          </p>

          <div className={styles.qrDivider}>
            <span className={styles.qrDividerLine} />
            <span className={styles.qrDividerText}>or</span>
            <span className={styles.qrDividerLine} />
          </div>

          <a href={APP_DOWNLOAD_URL} className={styles.qrLink} target="_blank" rel="noopener noreferrer">
            Download manually →
          </a>

          <div className={styles.qrNotice}>
            <span className={styles.qrNoticeDot} />
            Web version is currently under development
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;