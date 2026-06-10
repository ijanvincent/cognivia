import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { STORAGE_KEYS, API_BASE_URL } from '../../services/api.js';
import { getEchoWithToken, disconnectEcho } from '../../services/echo.js';
import styles from './styles/login.module.css';

import eyeIcon   from './../../assets/eye.png';
import hideIcon  from './../../assets/hide.png';

// Approval window must match backend APPROVAL_TTL_SECONDS (60).
const APPROVAL_TTL_SECONDS = 60;
const DENIED_NOTICE_DISMISS_MS = 3500;
const NOTICE_EXIT_ANIMATION_MS = 260;

function UserLogin() {
  const navigate = useNavigate();

  const [formData, setFormData]         = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoDismissGeneralError, setAutoDismissGeneralError] = useState(false);
  const [generalErrorExiting, setGeneralErrorExiting] = useState(false);

  // ── Approval gate state ────────────────────────────────────────────────────
  // What: tracks whether we're waiting for the active session to approve/deny.
  // Why separate from errors: the waiting state drives a distinct UI (countdown
  // modal with Allow/Deny buttons) rather than an inline error message.
  const [conflictState, setConflictState] = useState(null);
  // conflictState shape: {
  //   userId:          number,
  //   conflictToken:   string,   // for WS auth
  //   approvalToken:   string,   // for identifying the pending login
  //   requestingFrom:  string,   // 'web' — what platform is waiting
  //   secondsLeft:     number,
  // }

  const echoInstanceRef  = useRef(null);
  const countdownRef     = useRef(null);
  const generalErrorDismissRef = useRef(null);
  const formDataRef      = useRef(formData);
  const approvalCompletedRef = useRef(false);

  useEffect(() => { formDataRef.current = formData; }, [formData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupEcho();
      clearInterval(countdownRef.current);
      clearTimeout(generalErrorDismissRef.current);
    };
  }, []);

  const cleanupEcho = useCallback(() => {
    if (echoInstanceRef.current) {
      try {
        echoInstanceRef.current.disconnect();
      } catch (_) {}
      echoInstanceRef.current = null;
    }
    disconnectEcho();
  }, []);

  // ── Countdown timer ────────────────────────────────────────────────────────
  // What: counts down secondsLeft in conflictState every second.
  // Why: shows the user how long they have to wait for a response, and
  //      auto-cancels when the window expires so the UI doesn't hang.
  useEffect(() => {
    if (! conflictState) {
      clearInterval(countdownRef.current);
      return;
    }

    countdownRef.current = setInterval(() => {
      setConflictState(prev => {
        if (! prev) return null;
        if (prev.secondsLeft <= 1) {
          approvalCompletedRef.current = true;
          clearInterval(countdownRef.current);
          cleanupEcho();
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [conflictState?.userId, cleanupEcho]);

  // ── WebSocket subscription ─────────────────────────────────────────────────
  /**
   * What: subscribes Platform B (web) to its private channel using the
   *       short-lived conflict_token, then listens for login.approved
   *       or login.denied events.
   *
   * Why conflict_token for WS auth: Platform B has no real session token
   *     yet. The conflict_token is a limited Sanctum token that only
   *     authenticates the WS channel subscription — it cannot call any
   *     other API endpoint.
   *
   * Why listen for login.approved / login.denied (not force.logout):
   *     The old implementation listened for force.logout which required
   *     the active user to fully log out before the new login could
   *     proceed. The new flow is explicit: Platform A sends Allow or Deny,
   *     and Platform B treats realtime as a wake-up signal before consuming
   *     the approved request through the HTTPS status endpoint.
   */
  const completeApprovedLogin = useCallback((token, approvedUser) => {
    if (approvalCompletedRef.current) return;
    approvalCompletedRef.current = true;

    clearInterval(countdownRef.current);
    cleanupEcho();
    setConflictState(null);
    setLoading(true);

    try {
      const { rememberMe } = formDataRef.current;
      const storage = rememberMe ? localStorage : sessionStorage;
      const user = { ...approvedUser };

      if (user.avatar && ! user.avatar.startsWith('http')) {
        user.avatar = `${API_BASE_URL.replace('/api', '')}${
          user.avatar.startsWith('/') ? '' : '/storage/'
        }${user.avatar}`;
      }

      storage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors({ general: 'Sign-in approved but session setup failed. Please try again.' });
      setLoading(false);
    }
  }, [cleanupEcho, navigate]);

  const handleDeniedLogin = useCallback((message) => {
    if (approvalCompletedRef.current) return;
    approvalCompletedRef.current = true;

    clearInterval(countdownRef.current);
    cleanupEcho();
    setConflictState(null);
    setLoading(false);
    setAutoDismissGeneralError(true);
    setGeneralErrorExiting(false);
    setErrors({ general: message || 'Your sign-in request was denied by the active session.' });
  }, [cleanupEcho]);

  useEffect(() => {
    if (!autoDismissGeneralError || !errors.general || conflictState) return undefined;

    const timer = setTimeout(() => {
      setGeneralErrorExiting(true);
      generalErrorDismissRef.current = setTimeout(() => {
        setErrors(prev => ({ ...prev, general: null }));
        setAutoDismissGeneralError(false);
        setGeneralErrorExiting(false);
      }, NOTICE_EXIT_ANIMATION_MS);
    }, DENIED_NOTICE_DISMISS_MS);

    return () => {
      clearTimeout(timer);
      clearTimeout(generalErrorDismissRef.current);
    };
  }, [autoDismissGeneralError, errors.general, conflictState]);

  useEffect(() => {
    if (errors.general) return;

    setGeneralErrorExiting(false);
    clearTimeout(generalErrorDismissRef.current);
  }, [errors.general]);

  const checkApprovalStatus = useCallback(async (approvalToken) => {
    if (approvalCompletedRef.current) return true;

    const response = await api.post('/auth/login/status', {
      approval_token: approvalToken,
    });

    if (approvalCompletedRef.current) return true;

    const status = response.data?.status;

    if (status === 'approved' && response.data?.platform === 'web') {
      completeApprovedLogin(response.data.token, response.data.user);
      return true;
    }

    if (status === 'denied') {
      handleDeniedLogin(response.data?.message);
      return true;
    }

    return false;
  }, [completeApprovedLogin, handleDeniedLogin]);

  const subscribeToApprovalChannel = useCallback((userId, conflictToken, approvalToken) => {
    const echo = getEchoWithToken(conflictToken);
    if (! echo) {
      console.error('[CogniVia] Could not build Echo instance for approval channel');
      return;
    }

    echoInstanceRef.current = echo;

    echo.private(`user.${userId}`)
      .listen('.login.approved', async (event) => {
        // Only handle if this approval is for web (our platform)
        if (event.platform !== 'web') return;

        try {
          await checkApprovalStatus(approvalToken);
        } catch (_) {
          // The normal interval poll remains active if the immediate check fails.
        }
      })
      .listen('.login.denied', (event) => {
        if (event.platform !== 'web') return;

        handleDeniedLogin(event.reason);
      });
  }, [checkApprovalStatus, handleDeniedLogin]);

  useEffect(() => {
    if (! conflictState?.approvalToken) return;

    let stopped = false;

    let intervalId = null;

    const pollApprovalStatus = async () => {
      try {
        if (stopped) return;
        const isFinished = await checkApprovalStatus(conflictState.approvalToken);
        if (stopped) return;
        if (isFinished && intervalId) clearInterval(intervalId);
      } catch (_) {
        // Keep waiting for the normal timeout. The WebSocket listener remains active too.
      }
    };

    pollApprovalStatus();
    intervalId = setInterval(pollApprovalStatus, 2000);

    return () => {
      stopped = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [conflictState?.approvalToken, checkApprovalStatus]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    clearTimeout(generalErrorDismissRef.current);
    setGeneralErrorExiting(false);
    setErrors(prev => ({ ...prev, [name]: null, general: null }));
    setAutoDismissGeneralError(false);
    if (conflictState) {
      approvalCompletedRef.current = true;
      clearInterval(countdownRef.current);
      cleanupEcho();
      setConflictState(null);
    }
  };

  const validateForm = () => {
    const newErrors  = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (! formData.email.trim())               newErrors.email    = 'Email address is required.';
    else if (! emailRegex.test(formData.email)) newErrors.email   = 'Please enter a valid email address.';
    if (! formData.password)                   newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    clearInterval(countdownRef.current);
    cleanupEcho();
    approvalCompletedRef.current = true;
    setConflictState(null);
    setLoading(true);
    setErrors({});
    setGeneralErrorExiting(false);
    setAutoDismissGeneralError(false);

    try {
      const response = await api.post('/auth/login', {
        email:       formData.email,
        password:    formData.password,
        remember_me: formData.rememberMe,
        platform:    'web',
      });

      const storage = formData.rememberMe ? localStorage : sessionStorage;
      const user    = response.data.user;

      if (user.avatar && ! user.avatar.startsWith('http')) {
        user.avatar = `${API_BASE_URL.replace('/api', '')}${
          user.avatar.startsWith('/') ? '' : '/storage/'
        }${user.avatar}`;
      }

      storage.setItem(STORAGE_KEYS.USER_TOKEN, response.data.token);
      storage.setItem(STORAGE_KEYS.USER_DATA,  JSON.stringify(user));
      navigate('/dashboard', { replace: true });

    } catch (error) {
      const status  = error.response?.status;
      const code    = error.response?.data?.error_code;
      const message = error.response?.data?.message;

      if (status === 401) {
        setErrors({ general: message || 'Invalid email or password.' });
      } else if (status === 422) {
        if (code === 'PLATFORM_CONFLICT') {
          // What: store conflict data and subscribe to approval channel.
          // Why: Platform B (web) must now wait for Platform A (mobile) to
          //      explicitly allow or deny this login attempt. We subscribe
          //      using the conflict_token (WS auth only) and store the
          //      approval_token so we can correlate the WS event.
          const conflictToken  = error.response?.data?.conflict_token;
          const approvalToken  = error.response?.data?.approval_token;
          const userId         = error.response?.data?.conflict_user_id;

          approvalCompletedRef.current = false;

          setConflictState({
            userId,
            conflictToken,
            approvalToken,
            requestingFrom: 'web',
            secondsLeft:    APPROVAL_TTL_SECONDS,
          });

          if (conflictToken && userId) {
            subscribeToApprovalChannel(userId, conflictToken, approvalToken);
          }

        } else if (code === 'ADMIN_ACCOUNT') {
          setErrors({ email: 'This account is not authorized here.' });
        } else {
          const laravelErrors = error.response?.data?.errors || {};
          setErrors({
            email:    laravelErrors.email?.[0]    || null,
            password: laravelErrors.password?.[0] || null,
          });
        }
      } else if (status === 429) {
        const retryAfter = error.response?.data?.retry_after;
        setErrors({
          general: retryAfter
            ? `Too many login attempts. Please try again in ${retryAfter} seconds.`
            : (message || 'Too many login attempts. Please try again later.'),
        });
      } else {
        setErrors({ general: message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Cancel waiting ─────────────────────────────────────────────────────────
  const handleCancelWaiting = () => {
    approvalCompletedRef.current = true;
    clearInterval(countdownRef.current);
    cleanupEcho();
    setConflictState(null);
  };

  const isWaiting = !! conflictState;

  return (
    <div className={styles.pageContainer}>

      {/* ── Approval gate modal ─────────────────────────────────────────────── */}
      {isWaiting && (
        <div className={styles.toastScrim} role="dialog" aria-modal="true" aria-labelledby="session-alert-title">
          <div className={styles.toast}>
            <div className={styles.toastIconWrap} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warning, #f59e0b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>

            <p id="session-alert-title" className={styles.toastTitle}>
              Sign-in request sent to your mobile device
            </p>

            <p className={styles.toastBody}>
              Your mobile session received a notification. Open the app and tap <strong>Allow</strong> to continue signing in here.
            </p>

            <div className={styles.toastDivider}></div>

            <span className={styles.toastHint} aria-live="polite">
              Request expires in {conflictState.secondsLeft}s
            </span>

            <button
              onClick={handleCancelWaiting}
              className={styles.toastCancelBtn}
              style={{ marginTop: 12, fontSize: 13, color: 'var(--subtext)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Error modal (non-conflict errors) ──────────────────────────────── */}
      {(errors.general && ! isWaiting) && (
        <div
          className={`${styles.toastScrim} ${generalErrorExiting ? styles.toastScrimExiting : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-alert-title"
        >
          <div className={styles.toast}>
            <div className={styles.toastIconWrap} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="var(--error)">
                <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
              </svg>
            </div>
            <p id="session-alert-title" className={styles.toastTitle}>
              {autoDismissGeneralError ? 'Sign-in request denied' : 'Sign-in failed'}
            </p>
            <p className={styles.toastBody}>{errors.general}</p>
            <div className={styles.toastDivider}></div>
            <span className={styles.toastHint}>
              {autoDismissGeneralError ? 'You can try again when ready' : 'Please review the message and try again'}
            </span>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      <div className={styles.bgCanvas}>
        <svg className={styles.bgSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {[...Array(18)].map((_, i) => (
            <path key={`pink-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.15}s`, '--wave-color': `rgba(200, 80, 200, ${0.4 - i * 0.015})` }}
              d={`M ${-100 + i * 8} ${300 + i * 6} C ${200 + i * 5} ${100 + i * 8}, ${500 + i * 3} ${500 + i * 4}, ${700 + i * 6} ${200 + i * 5} S ${900 + i * 4} ${600 + i * 3}, ${1100 + i * 5} ${300 + i * 4}`}
              fill="none" strokeWidth="1.2" />
          ))}
          {[...Array(18)].map((_, i) => (
            <path key={`cyan-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.12 + 1}s`, '--wave-color': `rgba(30, 180, 255, ${0.4 - i * 0.015})` }}
              d={`M ${500 + i * 6} ${900} C ${700 + i * 4} ${650 + i * 5}, ${900 + i * 3} ${800 + i * 3}, ${1100 + i * 5} ${550 + i * 6} S ${1300 + i * 4} ${750 + i * 3}, ${1500 + i * 5} ${600 + i * 4}`}
              fill="none" strokeWidth="1.2" />
          ))}
          {[...Array(10)].map((_, i) => (
            <path key={`purple-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.2 + 0.5}s`, '--wave-color': `rgba(130, 80, 255, ${0.25 - i * 0.02})` }}
              d={`M ${200 + i * 10} ${500 + i * 4} C ${400 + i * 6} ${300 + i * 5}, ${700 + i * 4} ${700 + i * 3}, ${1000 + i * 5} ${400 + i * 4}`}
              fill="none" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className={styles.bgCanvasMobile} aria-hidden="true">
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {[...Array(8)].map((_, i) => (
            <path key={`m-pink-${i}`} d={`M ${-20 + i * 6} ${200 + i * 8} C ${80 + i * 5} ${80 + i * 6}, ${220 + i * 3} ${340 + i * 4}, ${300 + i * 5} ${160 + i * 5} S ${380 + i * 3} ${400 + i * 3}, ${460 + i * 4} ${240 + i * 4}`} fill="none" stroke={`rgba(200, 80, 200, ${0.3 - i * 0.025})`} strokeWidth="1.2" />
          ))}
          {[...Array(8)].map((_, i) => (
            <path key={`m-cyan-${i}`} d={`M ${200 + i * 5} ${700} C ${280 + i * 4} ${520 + i * 5}, ${340 + i * 3} ${640 + i * 3}, ${420 + i * 4} ${440 + i * 5} S ${500 + i * 3} ${600 + i * 3}, ${560 + i * 4} ${480 + i * 4}`} fill="none" stroke={`rgba(30, 180, 255, ${0.3 - i * 0.025})`} strokeWidth="1.2" />
          ))}
          {[...Array(5)].map((_, i) => (
            <path key={`m-purple-${i}`} d={`M ${80 + i * 10} ${400 + i * 4} C ${160 + i * 6} ${240 + i * 5}, ${280 + i * 4} ${560 + i * 3}, ${400 + i * 5} ${320 + i * 4}`} fill="none" stroke={`rgba(130, 80, 255, ${0.18 - i * 0.02})`} strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className={styles.topBar}>
        <Link to="/" className={styles.topBarLogo}>
          <span className={styles.topBarBrand}>CogniVia</span>
        </Link>
        <nav className={styles.topBarNav}>
          <Link to="/about"      className={styles.navLink}>About</Link>
          <Link to="/solutions"  className={styles.navLink}>Solutions</Link>
          <Link to="/howitworks" className={styles.navLink}>How It Works</Link>
          <Link to="/faq"        className={styles.navLink}>FAQ</Link>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroDivider}></div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLight}>Intelligent</span>
            <span className={styles.heroTitleBold}><span className={styles.heroAccent}>Clarity.</span></span>
            <span className={styles.heroTitleSub}>Start Here.</span>
          </h1>
          <p className={styles.heroSubtext}>
            Your AI learning companion —<br />
            turning knowledge into a game.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.heroBtnPrimary}>Get Started</Link>
            <Link to="/about"    className={styles.heroBtnOutline}>Learn More</Link>
          </div>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h2 className={styles.cardTitle}>Welcome back</h2>
                  <p className={styles.cardSubtitle}>Sign in to your account to continue</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Email</label>
                <div className={`${styles.inputContainer} ${errors.email ? styles.inputContainerError : ''}`}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M22,6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V18C2,19.1 2.89,20 4,20H20C21.1,20 22,19.1 22,18V6M20,6L12,11L4,6H20M20,18H4V8L12,13L20,8V18Z" />
                  </svg>
                  <input
                    id="email" type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="you@example.com"
                    disabled={loading || isWaiting}
                    autoComplete="email" autoFocus
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className={styles.errorText} role="alert">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={`${styles.inputContainer} ${errors.password ? styles.inputContainerError : ''}`}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13C13.1,13 14,13.89 14,15C14,16.1 13.1,17 12,17M18,20V10H6V20H18M18,8C19.1,8 20,8.89 20,10V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                  </svg>
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange}
                    className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Password"
                    disabled={loading || isWaiting}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton} tabIndex={-1}
                    disabled={loading || isWaiting}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    <img src={showPassword ? hideIcon : eyeIcon} alt="" className={styles.eyeIcon} aria-hidden="true" />
                  </button>
                </div>
                {errors.password && (
                  <span id="password-error" className={styles.errorText} role="alert">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className={styles.rememberRow}>
                <label className={styles.rememberLabel}>
                  <input type="checkbox" name="rememberMe"
                    checked={formData.rememberMe} onChange={handleChange}
                    disabled={loading || isWaiting}
                    className={styles.rememberCheckbox} />
                  Remember me
                </label>
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot your password?</Link>
              </div>

              <button type="submit" disabled={loading || isWaiting} className={styles.submitButton}>
                {loading ? (
                  <><div className={styles.buttonSpinner} aria-hidden="true"></div>Signing in...</>
                ) : isWaiting ? (
                  <>Waiting for approval ({conflictState.secondsLeft}s)...</>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className={styles.linksSection}>
                <span className={styles.registerPrompt}>
                  Don't have an account?{' '}
                  <Link to="/register" className={styles.registerLink}>Sign Up</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
