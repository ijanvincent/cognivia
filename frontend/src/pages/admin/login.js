import React, { useEffect, useContext, useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import styles from './login.module.css';
import emailIcon from './../../assets/email.png';
import lockIcon from './../../assets/lock.png';
import eyeIcon from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';
import infoIcon from './../../assets/info.png';

function AdminLogin() {
  const context = useContext(AppSettings);
  const [redirect, setRedirect]         = useState(false);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts]         = useState(0);
  const [locked, setLocked]             = useState(false);
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
          <div className={styles.securityNotice}>
            <img src={infoIcon} alt="info" className={styles.noticeIcon} />
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

            {/*
              STATUS SLOT — fixed height, zero layout shift.
              Badge is default. Error alert replaces it in-place via CSS transition.
            */}
            <div className={`${styles.statusSlot} ${hasError ? styles.hasError : ''}`}>
              <div className={styles.securityBadge}>
                <span className={styles.securityDot}></span>
                Authorized Access Only
              </div>

              <div className={styles.errorAlert} role="alert" aria-live="polite">
                {/* Clean single warning icon — no double borders */}
                <svg className={styles.errorAlertIcon} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
                </svg>
                <span className={styles.errorAlertText}>{errors.general}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* EMAIL */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Admin Email</label>
                <div className={`${styles.inputContainer} ${shakingFields.email ? styles.inputShake : ''}`}>
                  <img src={emailIcon} alt="" className={styles.inputIcon} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: null })); }}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Admin email address"
                    disabled={loading || locked}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              {/* PASSWORD */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Admin Password</label>
                <div className={`${styles.inputContainer} ${shakingFields.password ? styles.inputShake : ''}`}>
                  <img src={lockIcon} alt="" className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: null })); }}
                    className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Admin password"
                    disabled={loading || locked}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                    tabIndex={-1}
                    disabled={loading || locked}
                  >
                    <img
                      src={showPassword ? hideIcon : eyeIcon}
                      alt={showPassword ? 'hide' : 'show'}
                      className={styles.eyeIcon}
                    />
                  </button>
                </div>
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Account Locked
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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