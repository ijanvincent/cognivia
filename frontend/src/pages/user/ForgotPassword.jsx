import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './login.module.css';
import emailIcon from './../../assets/email.png';

function ForgotPassword() {
  const [email,     setEmail]     = useState('');
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim())                        newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))     newErrors.email = 'Please enter a valid email';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (error) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

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
              fill="none" strokeWidth="1.2"
            />
          ))}
          {[...Array(18)].map((_, i) => (
            <path key={`cyan-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.12 + 1}s`, '--wave-color': `rgba(30, 180, 255, ${0.4 - i * 0.015})` }}
              d={`M ${500 + i * 6} ${900} C ${700 + i * 4} ${650 + i * 5}, ${900 + i * 3} ${800 + i * 3}, ${1100 + i * 5} ${550 + i * 6} S ${1300 + i * 4} ${750 + i * 3}, ${1500 + i * 5} ${600 + i * 4}`}
              fill="none" strokeWidth="1.2"
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <path key={`purple-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.2 + 0.5}s`, '--wave-color': `rgba(130, 80, 255, ${0.25 - i * 0.02})` }}
              d={`M ${200 + i * 10} ${500 + i * 4} C ${400 + i * 6} ${300 + i * 5}, ${700 + i * 4} ${700 + i * 3}, ${1000 + i * 5} ${400 + i * 4}`}
              fill="none" strokeWidth="1"
            />
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
            <span className={styles.heroTitleLight}>Recover</span>
            <span className={styles.heroTitleBold}><span className={styles.heroAccent}>Access.</span></span>
            <span className={styles.heroTitleSub}>Start fresh.</span>
          </h1>
          <p className={styles.heroSubtext}>
            Forgot your password? No worries —<br />
            we'll send you a secure reset link.
          </p>
          <div className={styles.heroActions}>
            <Link to="/login"    className={styles.heroBtnPrimary}>Back to Login</Link>
            <Link to="/register" className={styles.heroBtnOutline}>Register</Link>
          </div>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h2 className={styles.cardTitle}>
                    {submitted ? 'Check your email' : 'Forgot password'}
                  </h2>
                  <p className={styles.cardSubtitle}>
                    {submitted
                      ? 'A reset link has been sent if that email is registered'
                      : 'Provide your email and we\'ll send you a reset link'}
                  </p>
                </div>
              </div>
            </div>

            {submitted ? (

              /* ── Success state ─────────────────────────────────────────── */
              <div className={styles.successState}>

                {/* Checkmark badge */}
                <div className={styles.successIconBadge}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#34d399" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {/* Primary confirmation copy */}
                <p className={styles.successMessage}>
                  Reset link sent — check your inbox.
                </p>

                {/* Email chip — lets user confirm the address at a glance */}
                <div className={styles.successEmail}>
                  <svg width="13" height="13" viewBox="0 0 16 16"
                    fill="currentColor" aria-hidden="true">
                    <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v1.5l-6 3.75L2 5.5V4zm0 2.5V12a2 2 0 002 2h8a2 2 0 002-2V6.5l-6 3.75L2 6.5z"/>
                  </svg>
                  <span>{email}</span>
                </div>

                {/* Secondary hint + inline retry action */}
                <p className={styles.successHint}>
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    type="button"
                    className={styles.successRetry}
                    onClick={() => setSubmitted(false)}
                  >
                    try another email
                  </button>
                  .
                </p>

                <div className={styles.linksSection}>
                  <span className={styles.registerPrompt}>
                    Remembered it?{' '}
                    <Link to="/login" className={styles.registerLink}>Sign in</Link>
                  </span>
                </div>

              </div>

            ) : (

              /* ── Request form ───────────────────────────────────────────── */
              <form onSubmit={handleSubmit} className={styles.form}>
                {errors.general && (
                  <div className={styles.errorAlert}>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email address</label>
                  <div className={styles.inputContainer}>
                    <img src={emailIcon} alt="" className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                      placeholder="you@example.com"
                      disabled={loading}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <button type="submit" disabled={loading} className={styles.submitButton}>
                  {loading ? (
                    <><div className={styles.buttonSpinner}></div>Sending Link...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <div className={styles.linksSection}>
                  <span className={styles.registerPrompt}>
                    Remembered it?{' '}
                    <Link to="/login" className={styles.registerLink}>Sign in</Link>
                  </span>
                </div>
              </form>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;