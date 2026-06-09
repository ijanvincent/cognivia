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

function resolveAvatarUrl(avatar) {
  if (!avatar) return null;
  if (avatar.startsWith('blob:') || avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  const base = 'http://localhost:3000';
  return avatar.startsWith('/') ? `${base}${avatar}` : `${base}/storage/${avatar}`;
}

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

function UserDashboard() {
  const [mounted, setMounted]           = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser]                 = useState(() => getStoredUser());
  const [avatarError, setAvatarError]   = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [approvalBusy, setApprovalBusy]       = useState(false);
  const [approvalError, setApprovalError]     = useState('');
  const navigate                        = useNavigate();

  const userName    = user.name || user.username || 'Learner';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    setUser(getStoredUser());
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  useEffect(() => {
    const handleUserUpdated = (e) => {
      setUser(e.detail || getStoredUser());
      setAvatarError(false);
    };
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
      {incomingRequest && (
        <div className={styles.approvalScrim} role="dialog" aria-modal="true" aria-labelledby="approval-title">
          <div className={styles.approvalModal}>
            <div className={styles.approvalIcon} aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 id="approval-title" className={styles.approvalTitle}>New Sign-In Request</h2>
            <p className={styles.approvalBody}>
              Someone is trying to sign in to your account from a {incomingRequest.requestingPlatform === 'mobile' ? 'mobile device' : 'web browser'}.
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
                {approvalBusy ? 'Working...' : 'Allow'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              {user.avatar && !avatarError ? (
                <img
                  src={resolveAvatarUrl(user.avatar)}
                  alt={userName}
                  className={styles.avatarImg}
                  onError={() => setAvatarError(true)}
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
