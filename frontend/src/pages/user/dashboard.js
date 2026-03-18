import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import api from '../../services/api.js';

// ── Placeholder app URL — replace when app is ready ──
const APP_DOWNLOAD_URL = process.env.REACT_APP_DOWNLOAD_URL || 'https://cognivia.app/download';

// ── Custom SVG Icons ──

// Lightning bolt — Trivia Games (keep as is)
const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

// Circular progress ring — Progress Tracking
const IconChart = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" strokeOpacity="0.25"/>
    <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

// Podium steps — Leaderboards (more unique than crown)
const IconCrown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 000 5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 010 5H18"/>
    <path d="M6 9l1 9h10l1-9"/>
    <path d="M9 9V6.5a3 3 0 016 0V9"/>
    <path d="M9 18h6"/>
  </svg>
);

// Sparkle streak — Daily Streaks (more premium than flame)
const IconFlame = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
);

// User — Edit Profile
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

// Logout arrow
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// Chevron
const IconChevron = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function UserDashboard() {
  const [mounted, setMounted]           = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef(null);
  const navigate                        = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')) || {};
    } catch { return {}; }
  })();

  const userName    = storedUser.name || storedUser.username || 'Learner';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

        {/* Avatar chip with dropdown */}
        <div className={styles.avatarWrapper} ref={dropdownRef}>
          <button
            className={`${styles.avatarChip} ${dropdownOpen ? styles.avatarChipActive : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.avatar}>{userInitial}</div>
            <div>
              <div className={styles.avatarName}>{userName}</div>
              <div className={styles.avatarRole}>Member</div>
            </div>
            <span className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}>
              <IconChevron />
            </span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleEditProfile}>
                <span className={styles.dropdownIcon}><IconUser /></span>
                Edit Profile
              </button>
              <div className={styles.dropdownDivider} />
              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={handleLogout}
              >
                <span className={styles.dropdownIcon}><IconLogout /></span>
                Log out
              </button>
            </div>
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

        {/* Feature chips */}
        <div className={styles.featuresRow}>
          {[
            { icon: <IconGrid />,  label: 'Trivia Games'      },
            { icon: <IconChart />, label: 'Progress Tracking'  },
            { icon: <IconCrown />, label: 'Leaderboards'       },
            { icon: <IconFlame />, label: 'Daily Streaks'      },
          ].map((f, i) => (
            <div key={i} className={styles.featureChip} style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureLabel}>{f.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;