import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from './../../services/api.js';
import styles from './register.module.css';
import emailIcon from './../../assets/email.png';
import lockIcon from './../../assets/lock.png';
import eyeIcon from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';
import userIcon from './../../assets/user.png';
import confirmPassIcon from './../../assets/confirm-pass.png';


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
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
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

    // Mark consent touched regardless
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

              {/* USERNAME */}
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>Username</label>
                <div className={`${styles.inputContainer} ${shakingFields.username ? styles.inputShake : ''}`}>
                  <img src={userIcon} alt="" className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setShowStrengthMeter(false)}
                    className={`${styles.inputField} ${errors.username ? styles.inputError : ''}`}
                    placeholder="Enter your username"
                    disabled={loading}
                    autoComplete="username"
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
                  <img src={emailIcon} alt="" className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setShowStrengthMeter(false)}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="you@example.com"
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
                      <img src={lockIcon} alt="" className={styles.inputIcon} aria-hidden="true" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setShowStrengthMeter(true)}
                        onBlur={() => setShowStrengthMeter(false)}
                        className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                        placeholder="Min. 8 characters"
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
                    <img src={confirmPassIcon} alt="" className={styles.inputIcon} aria-hidden="true" />
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      onFocus={() => setShowStrengthMeter(false)}
                      className={`${styles.inputField} ${errors.password_confirmation ? styles.inputError : ''}`}
                      placeholder="Re-enter password"
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