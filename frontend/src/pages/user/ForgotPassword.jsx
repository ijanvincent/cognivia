import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './login.module.css';

/*
 * CHANGE FP-1 — Removed: import emailIcon from './../../assets/email.png'
 *
 * What:  PNG asset import deleted.
 * Why:   Icon is now rendered as an inline SVG element using the same
 *        MaterialCommunityIcons `email-outline` path used in login.jsx (CHANGE 1a)
 *        and register.jsx (CHANGE R-1). This component already imports
 *        login.module.css, which has the updated .inputIcon rules (20px,
 *        color: currentColor, no filter hacks) — so no CSS changes are needed.
 *        The PNG file itself is untouched.
 */

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

      {/* ── Desktop wave background ────────────────────────────────────────────
          CSS hides this at ≤768px via .bgCanvas { display: none } inside
          @media (max-width: 768px) in login.module.css. Unchanged from original.
      ─────────────────────────────────────────────────────────────────────── */}
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

      {/* ── CHANGE A — Mobile wave background ─────────────────────────────────
          What:  Added bgCanvasMobile div with its three wave sets
                 (pink × 8, cyan × 8, purple × 5).
          Why:   ForgotPassword.jsx had the desktop bgCanvas but no mobile
                 counterpart — identical to the gap that existed in
                 ResetPassword.jsx (already corrected). login.module.css is
                 already imported, so all .bgCanvasMobile styles are present:
                 hidden by default, revealed as position:absolute; inset:0 at
                 ≤768px with a ::after scrim overlay. Zero CSS changes required.
                 Wave parameters (viewBox, path shapes, colour values, stroke
                 widths) are byte-identical to login.js and the corrected
                 ResetPassword.jsx — guaranteeing visual consistency across
                 all three auth screens on mobile.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className={styles.bgCanvasMobile} aria-hidden="true">
        <svg
          style={{ width: '100%', height: '100%' }}
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[...Array(8)].map((_, i) => (
            <path
              key={`m-pink-${i}`}
              d={`M ${-20 + i * 6} ${200 + i * 8} C ${80 + i * 5} ${80 + i * 6}, ${220 + i * 3} ${340 + i * 4}, ${300 + i * 5} ${160 + i * 5} S ${380 + i * 3} ${400 + i * 3}, ${460 + i * 4} ${240 + i * 4}`}
              fill="none"
              stroke={`rgba(200, 80, 200, ${0.3 - i * 0.025})`}
              strokeWidth="1.2"
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <path
              key={`m-cyan-${i}`}
              d={`M ${200 + i * 5} ${700} C ${280 + i * 4} ${520 + i * 5}, ${340 + i * 3} ${640 + i * 3}, ${420 + i * 4} ${440 + i * 5} S ${500 + i * 3} ${600 + i * 3}, ${560 + i * 4} ${480 + i * 4}`}
              fill="none"
              stroke={`rgba(30, 180, 255, ${0.3 - i * 0.025})`}
              strokeWidth="1.2"
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <path
              key={`m-purple-${i}`}
              d={`M ${80 + i * 10} ${400 + i * 4} C ${160 + i * 6} ${240 + i * 5}, ${280 + i * 4} ${560 + i * 3}, ${400 + i * 5} ${320 + i * 4}`}
              fill="none"
              stroke={`rgba(130, 80, 255, ${0.18 - i * 0.02})`}
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
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

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className={styles.mainContent}>

        {/* ── Hero section ────────────────────────────────────────────────── */}
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

        {/* ── Card ────────────────────────────────────────────────────────── */}
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
                      : "Provide your email and we'll send a reset link"}
                  </p>
                </div>
              </div>
            </div>

            {submitted ? (

              /* ── Success state ─────────────────────────────────────────── */
              <div className={styles.successState}>

                <div className={styles.successIconBadge}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#34d399" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <p className={styles.successMessage}>
                  Reset link sent — check your inbox.
                </p>

                <div className={styles.successEmail}>
                  <svg width="13" height="13" viewBox="0 0 16 16"
                    fill="currentColor" aria-hidden="true">
                    <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v1.5l-6 3.75L2 5.5V4zm0 2.5V12a2 2 0 002 2h8a2 2 0 002-2V6.5l-6 3.75L2 6.5z"/>
                  </svg>
                  <span>{email}</span>
                </div>

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
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {errors.general && (
                  <div className={styles.errorAlert} role="alert">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                <div className={`${styles.formGroup} ${errors.email ? styles.formGroupError : ''}`}>
                  <label className={styles.label} htmlFor="fp-email">Email</label>
                  <div className={`${styles.inputContainer} ${errors.email ? styles.inputContainerError : ''}`}>
                    {/*
                     * CHANGE FP-1 — Email icon: <img src={emailIcon}> → inline <svg>
                     *
                     * What:  PNG <img> replaced with an inline SVG using the
                     *        MaterialCommunityIcons `email-outline` path — the exact
                     *        same path used in login.jsx (CHANGE 1a) and
                     *        register.jsx (CHANGE R-1).
                     *
                     * Why:   This component uses login.module.css which already has
                     *        the updated .inputIcon rules: 20px size, color-based
                     *        transitions, focus (cyan) and error (red) states.
                     *        The PNG <img> with filter:invert() was bypassing all of
                     *        that. Inline SVG with fill="currentColor" inherits
                     *        `color` from .inputIcon and its state rules directly.
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
                      id="fp-email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                      placeholder="you@example.com"
                      disabled={loading}
                      autoComplete="email"
                      autoFocus
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'fp-email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <span id="fp-email-error" className={styles.errorText} role="alert">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                        <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                      </svg>
                      {errors.email}
                    </span>
                  )}
                </div>

                <button type="submit" disabled={loading} className={styles.submitButton}>
                  {loading ? (
                    <><div className={styles.buttonSpinner} aria-hidden="true"></div>Sending Link...</>
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