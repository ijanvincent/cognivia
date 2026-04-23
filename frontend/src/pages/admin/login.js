import React, { useEffect, useContext, useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import styles from './login.module.css';

/*
 * CHANGE AL-1 — Removed: import emailIcon from './../../assets/email.png'
 * CHANGE AL-2 — Removed: import lockIcon  from './../../assets/lock.png'
 * CHANGE AL-3 — Removed: import infoIcon  from './../../assets/info.png'
 *
 * What:  All three PNG asset imports deleted.
 * Why:   Icons are now rendered as inline SVG elements using the same
 *        MaterialCommunityIcons paths used across login.jsx, register.jsx,
 *        and ForgotPassword.jsx. SVG inherits `color: currentColor` from
 *        .inputIcon — no filter hacks needed, colour transitions are exact.
 *        The PNG files themselves are untouched.
 *
 * Retained: eyeIcon and hideIcon — still used by the password toggle button,
 *           identical to every other auth page in this codebase.
 */
import eyeIcon  from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';

function AdminLogin() {
  const context = useContext(AppSettings);
  const [redirect, setRedirect]           = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [errors, setErrors]               = useState({});
  const [loading, setLoading]             = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [attempts, setAttempts]           = useState(0);
  const [locked, setLocked]               = useState(false);
  const [shakingFields, setShakingFields] = useState({});

  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    context.handleSetAppSidebarNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppContentClass('p-0');
    return () => {
      context.handleSetAppSidebarNone(false);
      context.handleSetAppHeaderNone(false);
      context.handleSetAppContentClass('');
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email    = 'Email is required';
    if (!password)     newErrors.password = 'Password is required';
    return newErrors;
  };

  const triggerShake = (fieldKeys) => {
    const shakes = fieldKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setShakingFields(shakes);
    setTimeout(() => setShakingFields({}), 500);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (locked) {
      setErrors({ general: 'Access locked — try again in 5 min.' });
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake(Object.keys(newErrors));
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      attemptsRef.current = 0;
      setAttempts(0);
      setRedirect(true);

    } catch (err) {
      attemptsRef.current += 1;
      const currentAttempts = attemptsRef.current;
      setAttempts(currentAttempts);

      if (err.response?.status === 429 || currentAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setErrors({ general: 'Access locked — try again in 5 min.' });
      } else if (err.response?.data?.errors?.email) {
        setErrors({ general: err.response.data.errors.email[0] });
      } else if (err.response?.data?.message) {
        const serverMessage     = err.response.data.message;
        const remainingAttempts = MAX_ATTEMPTS - currentAttempts;
        const hasAttemptInfo    = /attempt/i.test(serverMessage);
        setErrors({
          general: hasAttemptInfo
            ? serverMessage
            : `${serverMessage} — ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} left.`,
        });
      } else {
        const remainingAttempts = MAX_ATTEMPTS - currentAttempts;
        setErrors({
          general: `Invalid credentials — ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} left.`,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  const hasError = Boolean(errors.general);

  return (
    <div className={styles.pageContainer}>
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
            <span className={styles.heroTitleLight}>Secure</span>
            <span className={styles.heroTitleBold}><span className={styles.heroAccent}>Control.</span></span>
            <span className={styles.heroTitleSub}>Admin access.</span>
          </h1>
          <p className={styles.heroSubtext}>
            Your AI learning companion —<br />
            turning knowledge into a game.
          </p>
          {/*
           * CHANGE AL-3 — Info icon: <img src={infoIcon}> → inline <svg>
           *
           * What:  PNG <img> replaced with an inline SVG using the
           *        MaterialCommunityIcons `information-outline` path.
           *
           * Why:   Removes the filter:invert()+hue-rotate() approximation.
           *        SVG inherits `color: currentColor` from .noticeIcon,
           *        which is set to the amber token in CSS — exact colour,
           *        crisp at all DPR values, no network request.
           */}
          <div className={styles.securityNotice}>
            <svg
              className={styles.noticeIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
              />
            </svg>
            <span>Secure area. All activities are monitored and logged.</span>
          </div>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.loginCard}>

            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h2 className={styles.cardTitle}>Admin Portal</h2>
                  <p className={styles.cardSubtitle}>Authorized personnel only</p>
                </div>
              </div>
            </div>

            <div className={`${styles.statusSlot} ${hasError ? styles.hasError : ''}`}>
              <div className={styles.securityBadge}>
                <span className={styles.securityDot}></span>
                Authorized Access Only
              </div>

              <div className={styles.errorAlert} role="alert" aria-live="polite">
                <svg className={styles.errorAlertIcon} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
                </svg>
                <span className={styles.errorAlertText}>{errors.general}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* EMAIL */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="admin-email">Admin Email</label>
                <div className={`${styles.inputContainer} ${shakingFields.email ? styles.inputShake : ''}`}>
                  {/*
                   * CHANGE AL-1 — Email icon: <img src={emailIcon}> → inline <svg>
                   *
                   * What:  PNG <img> replaced with MaterialCommunityIcons `email-outline`
                   *        path — identical to login.jsx, register.jsx, ForgotPassword.jsx.
                   *
                   * Why:   SVG inherits color: currentColor from .inputIcon.
                   *        Focus (cyan) and error (red) transitions work via CSS alone.
                   *        No filter chains. Crisp at all DPR values.
                   */}
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M22,6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V18C2,19.1 2.89,20 4,20H20C21.1,20 22,19.1 22,18V6M20,6L12,11L4,6H20M20,18H4V8L12,13L20,8V18Z"
                    />
                  </svg>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: null })); }}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Admin Email"
                    disabled={loading || locked}
                    autoComplete="email"
                    autoFocus
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'admin-email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <span id="admin-email-error" className={styles.errorText} role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="admin-password">Admin Password</label>
                <div className={`${styles.inputContainer} ${shakingFields.password ? styles.inputShake : ''}`}>
                  {/*
                   * CHANGE AL-2 — Lock icon: <img src={lockIcon}> → inline <svg>
                   *
                   * What:  PNG <img> replaced with MaterialCommunityIcons `lock-outline`
                   *        path — identical to login.jsx and register.jsx.
                   *
                   * Why:   Same rationale as AL-1.
                   */}
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13C13.1,13 14,13.89 14,15C14,16.1 13.1,17 12,17M18,20V10H6V20H18M18,8C19.1,8 20,8.89 20,10V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
                    />
                  </svg>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: null })); }}
                    className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Admin Password"
                    disabled={loading || locked}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'admin-password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                    tabIndex={-1}
                    disabled={loading || locked}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <img
                      src={showPassword ? hideIcon : eyeIcon}
                      alt=""
                      className={styles.eyeIcon}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {errors.password && (
                  <span id="admin-password-error" className={styles.errorText} role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || locked}
                className={`${styles.submitButton} ${locked ? styles.submitButtonLocked : ''}`}
              >
                {loading ? (
                  <><div className={styles.buttonSpinner}></div>Authenticating...</>
                ) : locked ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Account Locked
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Access Admin Panel
                  </>
                )}
              </button>

              <div className={styles.linksSection}>
                <span className={styles.registerPrompt}>
                  Not an admin?{' '}
                  <Link to="/login" className={styles.registerLink}>Go to user login</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;