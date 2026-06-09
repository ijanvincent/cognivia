import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import api, { STORAGE_KEYS } from '../../services/api.js';
import { getEcho, disconnectEcho } from '../../services/echo.js';

/*
 * NAMESPACE FIX — Import STORAGE_KEYS constant.
 *
 * What:  Replaced `import STORAGE_KEYS from '../../config/storageKeys.js'`
 *        with named import `{ STORAGE_KEYS }` from `../../services/api.js`.
 *
 * Why (1 — wrong source): storageKeys.js is superseded and deleted.
 *        api.js is the single source of truth for STORAGE_KEYS (flat shape).
 *
 * Why (2 — nested vs flat): storageKeys.js used STORAGE_KEYS.USER.TOKEN.
 *        api.js uses STORAGE_KEYS.USER_TOKEN. All accesses below have been
 *        updated to the flat shape. Nested access resolves to `undefined`,
 *        which causes getStoredUser() to always return {} and handleLogout()
 *        to remove nothing — both silent failures with no runtime error.
 */

const APP_DOWNLOAD_URL = process.env.REACT_APP_DOWNLOAD_URL || 'https://cognivia.app/download';
const APPROVAL_TTL_SECONDS = 60;

// ── Icon components ──────────────────────────────────────────────────────────

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

const IconBrain = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-2.5-2.5V2zM14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 002.5-2.5V2z"/>
    <path d="M12 4.5C12 3.1 13.1 2 14.5 2S17 3.1 17 4.5c1.1.5 2 1.7 2 3a3 3 0 01-1.1 2.3C18.6 10.3 19 11.1 19 12a3 3 0 01-3 3v2.5a2.5 2.5 0 01-4 0V15a3 3 0 01-3-3c0-.9.4-1.7 1.1-2.2A3 3 0 015 7.5c0-1.3.9-2.5 2-3C7 3.1 8.1 2 9.5 2S12 3.1 12 4.5z"/>
  </svg>
);

const IconFlame = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1-2.8-2-3.5 0 1.5-1.5 2.5-2.5 3zM12 22c4.97 0 8-3.58 8-8 0-4.5-4-7-5-10-1 2.5-2 4-4.5 5.5C8.5 11 7 13 7 15c0 3.87 2.24 7 5 7z"/>
  </svg>
);

const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const IconShield = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconApple = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const IconAndroid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4461a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/*
 * NAMESPACE FIX — getStoredUser reads from namespaced user keys only.
 *
 * What:  All storage reads changed from nested to flat shape:
 *          STORAGE_KEYS.USER.TOKEN → STORAGE_KEYS.USER_TOKEN
 *          STORAGE_KEYS.USER.DATA  → STORAGE_KEYS.USER_DATA
 *
 * Why:   STORAGE_KEYS has no .USER sub-key (flat object). The nested access
 *        resolved to `undefined`, so getItem(undefined) always returned null,
 *        making the token-presence check always false and returning {} on
 *        every call — the dashboard always showed the fallback "Learner" name.
 *        Flat keys correctly read 'user_token' / 'user_data' from storage.
 */
function getStoredUser() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null') || {};
    }
    if (sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null') || {};
    }
    return {};
  } catch { return {}; }
}

// ── Stat card definitions ────────────────────────────────────────────────────

const STAT_CARDS = [
  { Icon: IconBrain,  label: 'Cards Studied', value: '0', sub: 'today',     color: 'cyan'   },
  { Icon: IconFlame,  label: 'Day Streak',    value: '0', sub: 'days',      color: 'orange' },
  { Icon: IconLayers, label: 'Active Decks',  value: '0', sub: 'created',   color: 'purple' },
  { Icon: IconZap,    label: 'Total XP',      value: '0', sub: 'points',    color: 'pink'   },
];

const FEATURES = [
  { emoji: '🧠', title: 'Spaced Repetition',  desc: 'Learn smarter with our adaptive algorithm' },
  { emoji: '📱', title: 'Offline Mode',        desc: 'Study anywhere, even without internet'    },
  { emoji: '📊', title: 'Progress Tracking',   desc: 'Visualize your learning journey over time' },
  { emoji: '🔔', title: 'Smart Reminders',     desc: 'Stay consistent with personalised nudges' },
];

// ── Component ────────────────────────────────────────────────────────────────

function UserDashboard() {
  const [mounted, setMounted]                 = useState(false);
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [user, setUser]                       = useState(() => getStoredUser());
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [approvalBusy, setApprovalBusy]       = useState(false);
  const [approvalError, setApprovalError]     = useState('');
  const navigate                              = useNavigate();

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

  /*
   * NAMESPACE FIX — handleLogout removes namespaced user keys only.
   *
   * What:  All removeItem calls changed from nested to flat shape:
   *          STORAGE_KEYS.USER.TOKEN → STORAGE_KEYS.USER_TOKEN
   *          STORAGE_KEYS.USER.DATA  → STORAGE_KEYS.USER_DATA
   *
   * Why:   Same root cause as getStoredUser — nested access resolved to
   *        `undefined`, so removeItem(undefined) removed nothing and the
   *        user session persisted in storage after logout. Flat keys
   *        correctly target 'user_token' / 'user_data' for removal.
   *        Admin keys ('admin_token' / 'admin_data') are never touched —
   *        concurrent admin sessions are fully isolated.
   */
  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    window.location.replace('/login');
  };

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
      })
      .listen('.new.login.request', (event) => {
        setApprovalError('');
        setIncomingRequest({
          approvalToken: event.approval_token,
          requestingPlatform: event.requesting_platform,
          expiresIn: event.expires_in ?? APPROVAL_TTL_SECONDS,
        });
      });

    return () => {
      disconnectEcho();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!incomingRequest) return undefined;

    const timer = setTimeout(() => {
      setIncomingRequest(null);
      setApprovalBusy(false);
    }, incomingRequest.expiresIn * 1000);

    return () => clearTimeout(timer);
  }, [incomingRequest]);

  useEffect(() => {
    let stopped = false;

    const checkPendingLogin = async () => {
      if (stopped || incomingRequest || approvalBusy) return;

      try {
        const response = await api.get('/auth/login/pending');
        const pending = response.data?.pending_login;

        if (!pending || stopped) return;

        setApprovalError('');
        setIncomingRequest({
          pendingLoginId: pending.id,
          approvalToken: null,
          requestingPlatform: pending.requesting_platform,
          expiresIn: pending.expires_in ?? APPROVAL_TTL_SECONDS,
        });
      } catch (_) {
        // Polling is the fallback for realtime delivery; transient errors should not interrupt the dashboard.
      }
    };

    checkPendingLogin();
    const interval = setInterval(checkPendingLogin, 3000);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [incomingRequest, approvalBusy]);

  const respondToLoginRequest = async (action) => {
    if (!incomingRequest?.approvalToken && !incomingRequest?.pendingLoginId) return;

    setApprovalBusy(true);
    setApprovalError('');

    try {
      const payload = incomingRequest.approvalToken
        ? { approval_token: incomingRequest.approvalToken }
        : { pending_login_id: incomingRequest.pendingLoginId };

      await api.post(`/auth/login/${action}`, payload);
      setIncomingRequest(null);
    } catch {
      setApprovalError(`Could not ${action} the sign-in request. Please try again.`);
    } finally {
      setApprovalBusy(false);
    }
  };

  const handleEditProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <div className={`${styles.page} ${mounted ? styles.mounted : ''}`}>

      {/* ── Sign-in approval modal ── */}
      {incomingRequest && (
        <div className={styles.approvalScrim} role="dialog" aria-modal="true" aria-labelledby="approval-title">
          <div className={styles.approvalModal}>
            <div className={styles.approvalIcon} aria-hidden="true">
              <IconShield />
            </div>
            <h2 id="approval-title" className={styles.approvalTitle}>New Sign-In Request</h2>
            <p className={styles.approvalBody}>
              Someone is trying to sign in to your account from a{' '}
              {incomingRequest.requestingPlatform === 'mobile' ? 'mobile device' : 'web browser'}.
              Is this you?
            </p>
            {approvalError && <p className={styles.approvalError}>{approvalError}</p>}
            <div className={styles.approvalActions}>
              <button
                type="button"
                className={styles.approvalDeny}
                onClick={() => respondToLoginRequest('deny')}
                disabled={approvalBusy}
              >
                Deny
              </button>
              <button
                type="button"
                className={styles.approvalAllow}
                onClick={() => respondToLoginRequest('approve')}
                disabled={approvalBusy}
              >
                {approvalBusy ? 'Working…' : 'Allow'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky navbar ── */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>
            <div className={styles.navLogoMark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className={styles.navLogoText}>CogniVia</span>
          </div>

          <div className={styles.navRight}>
            <div className={styles.avatarWrapper}>
              <button
                className={`${styles.avatarChip} ${dropdownOpen ? styles.avatarChipActive : ''}`}
                onClick={() => setDropdownOpen(prev => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
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
                <div className={styles.avatarInfo}>
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
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>{userInitial}</div>
                      <div className={styles.dropdownUserInfo}>
                        <div className={styles.dropdownUserName}>{userName}</div>
                        {user.email && (
                          <div className={styles.dropdownUserEmail}>{user.email}</div>
                        )}
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
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
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.heroDate}>{formatDate()}</p>
            <h1 className={styles.heroTitle}>
              {getGreeting()},{' '}
              <span className={styles.heroAccent}>{userName}</span>
            </h1>
            <p className={styles.heroSub}>
              Ready to continue your learning journey? Your knowledge awaits.
            </p>
          </div>
          <div className={styles.heroBadge}>
            <IconStar />
            <span>Learning in progress</span>
          </div>
        </section>

        {/* Stats grid */}
        <section className={styles.statsGrid} aria-label="Learning statistics">
          {STAT_CARDS.map(({ Icon, label, value, sub, color }) => (
            <div key={label} className={`${styles.statCard} ${styles[`statCard_${color}`]}`}>
              <div className={styles.statIconWrap}>
                <Icon />
              </div>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
              <div className={styles.statSub}>{sub}</div>
            </div>
          ))}
        </section>

        {/* Content grid */}
        <div className={styles.contentGrid}>

          {/* Mobile app download */}
          <div className={styles.downloadCard}>
            <div className={styles.downloadCardHeader}>
              <div className={styles.downloadCardIconWrap}>
                <IconPhone />
              </div>
              <div>
                <h2 className={styles.downloadCardTitle}>Get the Full App</h2>
                <p className={styles.downloadCardSub}>Scan to download CogniVia on your phone</p>
              </div>
            </div>

            <div className={styles.qrCodeBox}>
              <QRCode
                value={APP_DOWNLOAD_URL}
                size={160}
                bgColor="transparent"
                fgColor="#f1f5f9"
                level="H"
              />
            </div>

            <p className={styles.downloadCardNote}>
              Point your phone camera at the QR code above to download
            </p>

            <div className={styles.downloadBadges}>
              <div className={styles.downloadBadge}>
                <IconApple />
                <span>iOS</span>
              </div>
              <div className={styles.downloadBadge}>
                <IconAndroid />
                <span>Android</span>
              </div>
            </div>
          </div>

          {/* Features overview */}
          <div className={styles.featuresCard}>
            <div>
              <h2 className={styles.featuresTitle}>Everything in the App</h2>
              <p className={styles.featuresSub}>The full CogniVia experience lives on mobile</p>
            </div>

            <ul className={styles.featuresList}>
              {FEATURES.map(({ emoji, title, desc }) => (
                <li key={title} className={styles.featureItem}>
                  <span className={styles.featureEmoji} aria-hidden="true">{emoji}</span>
                  <div>
                    <div className={styles.featureTitle}>{title}</div>
                    <div className={styles.featureDesc}>{desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <button className={styles.editProfileBtn} onClick={() => navigate('/profile')}>
              <IconUser />
              <span>Edit Profile</span>
              <IconArrow />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
