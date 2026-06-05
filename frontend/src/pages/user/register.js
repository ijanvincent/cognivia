import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from './../../services/api.js';
import styles from './register.module.css';
/*
 * CHANGE R-1 — Removed: import emailIcon from './../../assets/email.png'
 * CHANGE R-2 — Removed: import lockIcon  from './../../assets/lock.png'
 * CHANGE R-3 — Removed: import userIcon  from './../../assets/user.png'
 * CHANGE R-4 — Removed: import confirmPassIcon from './../../assets/confirm-pass.png'
 *
 * What:  All four PNG asset imports for input field icons deleted.
 * Why:   Mirrors the identical refactor already applied in login.jsx (CHANGE 1a/1b).
 *        Inline SVG inherits `color: currentColor` from .inputIcon, enabling clean
 *        focus (cyan) and error (red) colour transitions via CSS alone — no
 *        filter: invert() / hue-rotate() approximations needed.
 *        The PNG files themselves are untouched and remain on disk.
 *
 * Retained: eyeIcon and hideIcon imports — still used by password toggle <img> buttons,
 *           exactly as login.jsx retains them.
 */
import eyeIcon   from './../../assets/eye.png';
import hideIcon  from './../../assets/hide.png';


const PASSWORD_RULES = [
  { key: 'lowercase', test: (p) => /[a-z]/.test(p) },
  { key: 'uppercase', test: (p) => /[A-Z]/.test(p) },
  { key: 'number',    test: (p) => /[0-9]/.test(p) },
  { key: 'special',   test: (p) => /[^a-zA-Z0-9]/.test(p) },
  { key: 'length',    test: (p) => p.length >= 8 },
];

const STRENGTH_LEVELS = [
  null,
  { label: 'Too Weak',    color: '#ef4444', bars: 1 },
  { label: 'Weak',        color: '#f97316', bars: 2 },
  { label: 'Fair',        color: '#eab308', bars: 3 },
  { label: 'Strong',      color: '#22c55e', bars: 3 },
  { label: 'Very Strong', color: '#10b981', bars: 4 },
];

const getStrength = (password) => {
  const score = PASSWORD_RULES.filter((r) => r.test(password)).length;
  return { score, ...(STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[1]) };
};

function UserRegister() {
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors]                           = useState({});
  const [loading, setLoading]                         = useState(false);
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showStrengthMeter, setShowStrengthMeter]     = useState(false);
  const [shakingFields, setShakingFields]             = useState({});

  const [consentChecked, setConsentChecked] = useState(false);
  const [consentTouched, setConsentTouched] = useState(false);
  const [shakeConsent, setShakeConsent]     = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Profile name is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Profile name must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_ ]+$/.test(formData.username.trim())) {
      newErrors.username = 'Profile name can only contain letters, numbers, underscores, and spaces';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    return newErrors;
  };

  const triggerShake = (fieldKeys) => {
    const shakes = fieldKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setShakingFields(shakes);
    setTimeout(() => setShakingFields({}), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowStrengthMeter(false);

    const newErrors = validateForm();
    const hasFieldErrors = Object.keys(newErrors).length > 0;
    const hasConsentError = !consentChecked;

    setConsentTouched(true);

    if (hasFieldErrors || hasConsentError) {
      if (hasFieldErrors) {
        setErrors(newErrors);
        triggerShake(Object.keys(newErrors));
      }
      if (hasConsentError) {
        setShakeConsent(true);
        setTimeout(() => setShakeConsent(false), 500);
      }
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.post('/auth/register', formData);
      setRedirect(true);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        triggerShake(Object.keys(error.response.data.errors));
      } else if (error.response?.status === 422) {
        setErrors({ general: 'This email is already registered. Please use a different email.' });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to="/login" />;

  const strength = getStrength(formData.password);
  const isSubmitDisabled = loading || !consentChecked;
  const strengthMeterVisible = showStrengthMeter && formData.password.length > 0;

  return (
    <div className={styles.pageContainer}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      <div className={styles.bgCanvas}>
        <svg
          className={styles.bgSvg}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[...Array(18)].map((_, i) => (
            <path
              key={`pink-${i}`}
              className={styles.wavePath}
              style={{
                animationDelay: `${i * 0.15}s`,
                '--wave-color': `rgba(200, 80, 200, ${0.4 - i * 0.015})`,
              }}
              d={`M ${-100 + i * 8} ${300 + i * 6} C ${200 + i * 5} ${100 + i * 8}, ${500 + i * 3} ${500 + i * 4}, ${700 + i * 6} ${200 + i * 5} S ${900 + i * 4} ${600 + i * 3}, ${1100 + i * 5} ${300 + i * 4}`}
              fill="none"
              strokeWidth="1.2"
            />
          ))}
          {[...Array(18)].map((_, i) => (
            <path
              key={`cyan-${i}`}
              className={styles.wavePath}
              style={{
                animationDelay: `${i * 0.12 + 1}s`,
                '--wave-color': `rgba(30, 180, 255, ${0.4 - i * 0.015})`,
              }}
              d={`M ${500 + i * 6} ${900} C ${700 + i * 4} ${650 + i * 5}, ${900 + i * 3} ${800 + i * 3}, ${1100 + i * 5} ${550 + i * 6} S ${1300 + i * 4} ${750 + i * 3}, ${1500 + i * 5} ${600 + i * 4}`}
              fill="none"
              strokeWidth="1.2"
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <path
              key={`purple-${i}`}
              className={styles.wavePath}
              style={{
                animationDelay: `${i * 0.2 + 0.5}s`,
                '--wave-color': `rgba(130, 80, 255, ${0.25 - i * 0.02})`,
              }}
              d={`M ${200 + i * 10} ${500 + i * 4} C ${400 + i * 6} ${300 + i * 5}, ${700 + i * 4} ${700 + i * 3}, ${1000 + i * 5} ${400 + i * 4}`}
              fill="none"
              strokeWidth="1"
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
            <span className={styles.heroTitleLight}>Begin your</span>
            <span className={styles.heroTitleBold}>
              <span className={styles.heroAccent}>Journey.</span>
            </span>
            <span className={styles.heroTitleSub}>Join us today.</span>
          </h1>
          <p className={styles.heroSubtext}>
            Your AI learning companion —<br />
            turning knowledge into a game.
          </p>
          <div className={styles.heroActions}>
            <Link to="/login" className={styles.heroBtnOutline}>Sign In</Link>
          </div>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h2 className={styles.cardTitle}>Create account</h2>
                  <p className={styles.cardSubtitle}>Fill in your details to get started</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              {errors.general && (
                <div className={styles.errorAlert} role="alert">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* PROFILE NAME */}
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>Profile Name</label>
                <div className={`${styles.inputContainer} ${shakingFields.username ? styles.inputShake : ''}`}>
                  {/*
                   * CHANGE R-3 — User icon: <img src={userIcon}> → inline <svg>
                   *
                   * What:  PNG <img> replaced with an inline SVG using the
                   *        MaterialCommunityIcons `account-outline` path.
                   *
                   * Why:   Matches the login.jsx icon refactor pattern exactly.
                   *        SVG inherits `color: currentColor` from .inputIcon,
                   *        so focus (cyan) and error (red) colour transitions work
                   *        natively via CSS without filter hacks. Crisp at all DPR
                   *        values, no extra network request.
                   */}
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z"
                    />
                  </svg>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setShowStrengthMeter(false)}
                    className={`${styles.inputField} ${errors.username ? styles.inputError : ''}`}
                    placeholder="Profile Name"
                    disabled={loading}
                    autoComplete="name"
                    autoFocus
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                  />
                </div>
                {errors.username && (
                  <span id="username-error" className={styles.errorText} role="alert">
                    {errors.username}
                  </span>
                )}
              </div>

              {/* EMAIL */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email address</label>
                <div className={`${styles.inputContainer} ${shakingFields.email ? styles.inputShake : ''}`}>
                  {/*
                   * CHANGE R-1 — Email icon: <img src={emailIcon}> → inline <svg>
                   *
                   * What:  PNG <img> replaced with an inline SVG using the
                   *        MaterialCommunityIcons `email-outline` path — the exact
                   *        same path used in login.jsx (CHANGE 1a).
                   *
                   * Why:   Identical rationale to login.jsx CHANGE 1a.
                   *        Ensures pixel-identical icon shapes across both pages.
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
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setShowStrengthMeter(false)}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="you@gmail.com"
                    disabled={loading}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className={styles.errorText} role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.formRow}>

                {/* PASSWORD */}
                <div className={styles.strengthMeterAnchor}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <div className={`${styles.inputContainer} ${shakingFields.password ? styles.inputShake : ''}`}>
                      {/*
                       * CHANGE R-2 — Lock icon: <img src={lockIcon}> → inline <svg>
                       *
                       * What:  PNG <img> replaced with an inline SVG using the
                       *        MaterialCommunityIcons `lock-outline` path — the exact
                       *        same path used in login.jsx (CHANGE 1b).
                       *
                       * Why:   Identical rationale to login.jsx CHANGE 1b.
                       *        Ensures pixel-identical icon shapes across both pages.
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
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setShowStrengthMeter(true)}
                        onBlur={() => setShowStrengthMeter(false)}
                        className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                        placeholder="Password"
                        disabled={loading}
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        aria-describedby="password-strength"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className={styles.eyeButton}
                        tabIndex={-1}
                        disabled={loading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <img
                          src={showPassword ? hideIcon : eyeIcon}
                          alt=""
                          className={styles.eyeIcon}
                        />
                      </button>
                    </div>
                    {errors.password && (
                      <span className={styles.errorText} role="alert">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div
                    id="password-strength"
                    className={`${styles.strengthMeter} ${strengthMeterVisible ? styles.strengthMeterVisible : ''}`}
                    aria-live="polite"
                    aria-label={`Password strength: ${strength.label || 'none'}`}
                  >
                    <div className={styles.strengthHeader}>
                      <span className={styles.strengthTitle}>Strength</span>
                      {strength.score > 0 && (
                        <span className={styles.strengthLabel} style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      )}
                    </div>
                    <div className={styles.strengthBars}>
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={styles.strengthBar}
                          style={i < strength.bars ? { background: strength.color } : undefined}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className={styles.formGroup}>
                  <label htmlFor="password_confirmation" className={styles.label}>
                    Confirm password
                  </label>
                  <div className={`${styles.inputContainer} ${shakingFields.password_confirmation ? styles.inputShake : ''}`}>
                    {/*
                     * CHANGE R-4 — Confirm-pass icon: <img src={confirmPassIcon}> → inline <svg>
                     *
                     * What:  PNG <img> replaced with an inline SVG using the
                     *        MaterialCommunityIcons `lock-check-outline` path.
                     *
                     * Why:   `lock-check-outline` is the semantic match for "confirm password"
                     *        — a lock with a checkmark communicates "verified / confirmed".
                     *        Applies the same SVG currentColor pattern as all other icons.
                     *        Visually distinct from the plain lock on the password field,
                     *        preserving the original intent of using a different icon for
                     *        the confirm field (confirmPassIcon vs lockIcon in the original).
                     */}
                    <svg
                      className={styles.inputIcon}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fill="currentColor"
                        d="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M15.6,8.4L17,9.8L11,15.8L7.4,12.2L8.8,10.8L11,13L15.6,8.4Z"
                      />
                    </svg>
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      onFocus={() => setShowStrengthMeter(false)}
                      className={`${styles.inputField} ${errors.password_confirmation ? styles.inputError : ''}`}
                      placeholder="Confirm Password"
                      disabled={loading}
                      autoComplete="new-password"
                      aria-invalid={!!errors.password_confirmation}
                      aria-describedby={errors.password_confirmation ? 'confirm-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className={styles.eyeButton}
                      tabIndex={-1}
                      disabled={loading}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      <img
                        src={showConfirmPassword ? hideIcon : eyeIcon}
                        alt=""
                        className={styles.eyeIcon}
                      />
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <span id="confirm-error" className={styles.errorText} role="alert">
                      {errors.password_confirmation}
                    </span>
                  )}
                </div>

              </div>{/* end formRow */}

              {/* CONSENT */}
              <div className={`${styles.consentWrapper} ${consentTouched && !consentChecked ? styles.consentWrapperError : ''} ${shakeConsent ? styles.inputShake : ''}`}>
                <label className={styles.consentLabel}>
                  <div className={styles.consentCheckboxWrap}>
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => {
                        setConsentChecked(e.target.checked);
                        if (consentTouched && e.target.checked) {
                          setConsentTouched(false);
                        }
                      }}
                      disabled={loading}
                      className={styles.consentCheckboxNative}
                      aria-describedby="consent-error"
                    />
                    <div className={`${styles.consentCheckbox} ${consentChecked ? styles.consentCheckboxChecked : ''} ${consentTouched && !consentChecked ? styles.consentCheckboxError : ''}`}>
                      {consentChecked && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                          <path d="M1 4L4 7.5L10 1" stroke="#07080f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>

                  <span className={styles.consentText}>
                    I accept the{' '}
                    <Link
                      to="/terms"
                      className={styles.consentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      to="/privacy"
                      className={styles.consentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {consentTouched && !consentChecked && (
                  <span id="consent-error" className={styles.consentError} role="alert">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    You must agree to the Terms and Privacy Policy to continue.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`${styles.submitButton} ${!consentChecked ? styles.submitButtonDisabled : ''}`}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className={styles.linksSection}>
                <span className={styles.registerPrompt}>
                  Already have an account?{' '}
                  <Link to="/login" className={styles.registerLink}>Sign in here</Link>
                </span>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserRegister;