import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './login.module.css';
/*
 * CHANGE B — Removed: import lockIcon from './../../assets/lock.png'
 * (carried forward from previous session — rationale unchanged)
 */
import eyeIcon  from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE RP-2 — Password strength system
//
// What:  Replaced getPasswordStrength() (single-bar, 3-level) with the
//        PASSWORD_RULES + STRENGTH_LEVELS system from register.js.
//
// Why:   register.js is the design standard for password strength in this
//        codebase. Using the same rules and levels across register and reset
//        gives users a consistent, familiar experience. The checklist (rules)
//        view is more instructional than a plain bar — it tells the user
//        exactly what to fix, which is especially important on a reset screen
//        where they are creating a replacement credential.
//
//        PASSWORD_RULES: 5 rules — lowercase, uppercase, number, special,
//        length ≥ 8. Matches RegisterScreen.js (mobile) and register.js (web).
//        STRENGTH_LEVELS: maps score 0–5 → label + colour + bar count.
//        getStrength(): pure function, no side effects.
// ─────────────────────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { key: 'lowercase', label: 'At least one lowercase letter',   test: (p) => /[a-z]/.test(p) },
  { key: 'uppercase', label: 'At least one uppercase letter',   test: (p) => /[A-Z]/.test(p) },
  { key: 'number',    label: 'At least one number',             test: (p) => /[0-9]/.test(p) },
  { key: 'special',   label: 'At least one special character',  test: (p) => /[^a-zA-Z0-9]/.test(p) },
  { key: 'length',    label: 'Minimum 8 characters',            test: (p) => p.length >= 8 },
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
  if (!password) return { score: 0, label: '', color: '', bars: 0 };
  const score = PASSWORD_RULES.filter((r) => r.test(password)).length;
  return { score, ...(STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[1]) };
};

function ResetPassword() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const [formData, setFormData] = useState({ password: '', password_confirmation: '' });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid,    setTokenValid]    = useState(true);

  /*
   * CHANGE RP-2 (state) — showPasswordMeter + passwordFocused
   *
   * What:  Two new boolean state variables.
   *        showPasswordMeter: true while password field is focused AND
   *        password.length > 0. Controls meter visibility on mobile.
   *        passwordFocused: tracks focus to suppress meter on confirm-field focus
   *        (mirrors register.js showStrengthMeter + confirmFocused logic).
   *
   * Why:   The meter must appear as the user types — not permanently —
   *        so it doesn't clutter the screen before interaction begins.
   *        Hiding on confirm-field focus prevents the meter from showing
   *        beneath a field the user is no longer editing.
   */
  const [showPasswordMeter, setShowPasswordMeter] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) setTokenValid(false);
  }, [token, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Must include uppercase, lowercase, and a number';

    if (!formData.password_confirmation)
      newErrors.password_confirmation = 'Please confirm your password';
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = 'Passwords do not match';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPasswordMeter(false);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/reset-password', {
        token,
        email,
        password:              formData.password,
        password_confirmation: formData.password_confirmation,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      if (error.response?.data?.errors?.token) {
        setErrors({ general: 'This reset link is invalid or has expired. Please request a new one.' });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const strength             = getStrength(formData.password);
  const meterVisible         = showPasswordMeter && formData.password.length > 0;

  return (
    <div className={styles.pageContainer}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      {/* ── Desktop wave background — hidden at ≤768px via CSS ──────────── */}
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

      {/* ── Mobile wave background — shown only at ≤768px via CSS ────────── */}
      <div className={styles.bgCanvasMobile} aria-hidden="true">
        <svg
          style={{ width: '100%', height: '100%' }}
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[...Array(8)].map((_, i) => (
            <path key={`m-pink-${i}`}
              d={`M ${-20 + i * 6} ${200 + i * 8} C ${80 + i * 5} ${80 + i * 6}, ${220 + i * 3} ${340 + i * 4}, ${300 + i * 5} ${160 + i * 5} S ${380 + i * 3} ${400 + i * 3}, ${460 + i * 4} ${240 + i * 4}`}
              fill="none" stroke={`rgba(200, 80, 200, ${0.3 - i * 0.025})`} strokeWidth="1.2"
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <path key={`m-cyan-${i}`}
              d={`M ${200 + i * 5} ${700} C ${280 + i * 4} ${520 + i * 5}, ${340 + i * 3} ${640 + i * 3}, ${420 + i * 4} ${440 + i * 5} S ${500 + i * 3} ${600 + i * 3}, ${560 + i * 4} ${480 + i * 4}`}
              fill="none" stroke={`rgba(30, 180, 255, ${0.3 - i * 0.025})`} strokeWidth="1.2"
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <path key={`m-purple-${i}`}
              d={`M ${80 + i * 10} ${400 + i * 4} C ${160 + i * 6} ${240 + i * 5}, ${280 + i * 4} ${560 + i * 3}, ${400 + i * 5} ${320 + i * 4}`}
              fill="none" stroke={`rgba(130, 80, 255, ${0.18 - i * 0.02})`} strokeWidth="1"
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
            <span className={styles.heroTitleLight}>Secure</span>
            <span className={styles.heroTitleBold}><span className={styles.heroAccent}>Reset.</span></span>
            <span className={styles.heroTitleSub}>New start.</span>
          </h1>
          <p className={styles.heroSubtext}>
            Create a strong new password —<br />
            keep your account safe and secure.
          </p>
          <div className={styles.heroActions}>
            <Link to="/login" className={styles.heroBtnPrimary}>Back to Login</Link>
          </div>
        </div>

        {/* ── Card ────────────────────────────────────────────────────────── */}
        <div className={styles.cardWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderRow}>
                <div>
                  <h2 className={styles.cardTitle}>
                    {success ? 'Password reset!' : !tokenValid ? 'Invalid link' : 'Set new password'}
                  </h2>

                  {/*
                   * CHANGE RP-1 — cardSubtitle copy, all three states.
                   *
                   * What:
                   *   Form state:    '' (empty string)
                   *              →   'Choose a strong password to secure your account'
                   *   Success state: 'Redirecting you to login...'
                   *              →   'Your account is secured — redirecting you to sign in'
                   *   Invalid state: unchanged — already descriptive enough.
                   *
                   * Why:
                   *   On mobile (≤768px), .cardTitle is hidden (display: none in
                   *   login.module.css). .cardSubtitle is the sole contextual
                   *   anchor visible to the user. An empty string for the form
                   *   state left mobile users with no instruction at all.
                   *   The new copies are self-contained and action-oriented —
                   *   the user knows what screen they are on and what is expected
                   *   of them without needing to read the title above.
                   *   Register uses: "Fill in your details to get started"
                   *   Login uses:    "Sign in to your account to continue"
                   *   Same register: instructional, present-tense, professional.
                   */}
                  <p className={styles.cardSubtitle}>
                    {success
                      ? 'Your account is secured — redirecting you to sign in'
                      : !tokenValid
                      ? 'This reset link is invalid or missing'
                      : 'Choose a strong password to secure your account'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Invalid token state ─────────────────────────────────────── */}
            {!tokenValid && (
              <div>
                <div className={styles.errorAlert} role="alert">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                  </svg>
                  <span>This reset link is invalid or has expired. Please request a new one.</span>
                </div>
                <div className={styles.linksSection}>
                  <span className={styles.registerPrompt}>
                    <Link to="/forgot-password" className={styles.registerLink}>Request new reset link</Link>
                  </span>
                </div>
              </div>
            )}

            {/* ── Success state ───────────────────────────────────────────── */}
            {success && (
              <div>
                <div className={styles.successAlert}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd"/>
                  </svg>
                  <span>
                    Your password has been reset successfully.
                    You will be redirected to login in 3 seconds.
                  </span>
                </div>
                <div className={styles.linksSection}>
                  <span className={styles.registerPrompt}>
                    <Link to="/login" className={styles.registerLink}>Go to Login now</Link>
                  </span>
                </div>
              </div>
            )}

            {/* ── Reset form ──────────────────────────────────────────────── */}
            {tokenValid && !success && (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {errors.general && (
                  <div className={styles.errorAlert} role="alert">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* ── New password field ───────────────────────────────────── */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="password">New Password</label>
                  <div className={`${styles.inputContainer} ${errors.password ? styles.inputContainerError : ''}`}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13C13.1,13 14,13.89 14,15C14,16.1 13.1,17 12,17M18,20V10H6V20H18M18,8C19.1,8 20,8.89 20,10V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                    </svg>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      /*
                       * CHANGE RP-2 (focus/blur) — onFocus/onBlur on password input.
                       *
                       * What:  onFocus → setShowPasswordMeter(true)
                       *        onBlur  → setShowPasswordMeter(false)
                       *
                       * Why:   The mobile strength meter is shown while the user
                       *        is actively typing in the password field. Hiding on
                       *        blur prevents the meter from persisting after the
                       *        user moves to the confirm field or taps elsewhere.
                       *        This is the same pattern used in register.js
                       *        (onFocus: setShowStrengthMeter(true), onBlur: false).
                       */
                      onFocus={() => setShowPasswordMeter(true)}
                      onBlur={() => setShowPasswordMeter(false)}
                      className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                      placeholder="Enter new password"
                      disabled={loading}
                      autoComplete="new-password"
                      autoFocus
                      aria-invalid={!!errors.password}
                      aria-describedby="rp-password-strength"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.eyeButton}
                      tabIndex={-1}
                      disabled={loading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <img src={showPassword ? hideIcon : eyeIcon} alt="" className={styles.eyeIcon} aria-hidden="true" />
                    </button>
                  </div>

                  {/*
                   * CHANGE RP-2 — Desktop strength bar (kept, desktop-only).
                   *
                   * What:  Retained the existing strengthWrapper bar but now uses
                   *        STRENGTH_LEVELS colour + label from the new system.
                   *        strength.score === 0 means no password yet — bar hidden.
                   *
                   * Why:   The desktop layout has space for the compact bar.
                   *        login.module.css already has .strengthWrapper /
                   *        .strengthBar / .strengthFill / .strengthLabel rules.
                   *        These are hidden on mobile via the new CSS (see
                   *        login.module.css CHANGE RP-3).
                   */}
                  {formData.password && strength.score > 0 && (
                    <div className={styles.strengthWrapper}>
                      <div className={styles.strengthBar}>
                        <div
                          className={styles.strengthFill}
                          style={{
                            width:      `${(strength.bars / 4) * 100}%`,
                            background: strength.color,
                          }}
                        />
                      </div>
                      <span className={styles.strengthLabel} style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}

                  {errors.password && (
                    <span id="password-error" className={styles.errorText} role="alert">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                        <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                      </svg>
                      {errors.password}
                    </span>
                  )}
                </div>

                {/*
                 * CHANGE RP-2 — Mobile strength meter block.
                 *
                 * What:  New DOM block placed between password formGroup and
                 *        confirm password formGroup. Always rendered — CSS
                 *        controls visibility:
                 *          default (desktop): display: none  (.mobileStrengthMeter)
                 *          ≤768px active:     display: block (.mobileStrengthMeterVisible)
                 *
                 * Why:   Placed outside formGroup so it does not conflict with
                 *        the formGroup's padding-bottom: 22px (error-reserved
                 *        space). The meter has its own vertical spacing via
                 *        margin in the CSS. The block contains:
                 *          1. Strength header (label + colour-coded level name)
                 *          2. 4-segment bar (same as register.js strengthBars)
                 *          3. Rules checklist (5 rules — met = green check,
                 *             unmet = dim dot, identical to RegisterScreen.js)
                 *
                 * Accessibility: aria-live="polite" announces strength changes.
                 *        aria-label provides a text summary. id="rp-password-strength"
                 *        is referenced by aria-describedby on the password input.
                 */}
                <div
                  id="rp-password-strength"
                  className={`${styles.mobileStrengthMeter} ${meterVisible ? styles.mobileStrengthMeterVisible : ''}`}
                  aria-live="polite"
                  aria-label={`Password strength: ${strength.label || 'none'}`}
                >
                  {/* Header row — "Strength" label + level name */}
                  <div className={styles.mobileStrengthHeader}>
                    <span className={styles.mobileStrengthTitle}>Strength</span>
                    {strength.score > 0 && (
                      <span className={styles.mobileStrengthLabel} style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    )}
                  </div>

                  {/* 4-segment bar */}
                  <div className={styles.mobileStrengthBars}>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={styles.mobileStrengthBar}
                        style={i < strength.bars ? { background: strength.color } : undefined}
                      />
                    ))}
                  </div>

                  {/* Rules checklist — mirrors RegisterScreen.js PASSWORD_RULES */}
                  <div className={styles.mobileReqContainer}>
                    {PASSWORD_RULES.map((rule) => {
                      const met = rule.test(formData.password);
                      return (
                        <div key={rule.key} className={styles.mobileReqRow}>
                          {met ? (
                            /* Check circle — same colour as RN RegisterScreen (#22c55e) */
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="#22c55e" aria-hidden="true">
                              <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd"/>
                            </svg>
                          ) : (
                            <div className={styles.mobileReqDot} aria-hidden="true" />
                          )}
                          <span className={`${styles.mobileReqText} ${met ? styles.mobileReqTextMet : ''}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Confirm password field ───────────────────────────────── */}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="password_confirmation">Confirm Password</label>
                  <div className={`${styles.inputContainer} ${errors.password_confirmation ? styles.inputContainerError : ''}`}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13C13.1,13 14,13.89 14,15C14,16.1 13.1,17 12,17M18,20V10H6V20H18M18,8C19.1,8 20,8.89 20,10V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                    </svg>
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      /*
                       * CHANGE RP-2 — onFocus hides the meter when confirm field
                       * is focused. Mirrors register.js behaviour where confirming
                       * password dismisses the strength guide.
                       */
                      onFocus={() => setShowPasswordMeter(false)}
                      className={`${styles.inputField} ${errors.password_confirmation ? styles.inputError : ''}`}
                      placeholder="Confirm new password"
                      disabled={loading}
                      autoComplete="new-password"
                      aria-invalid={!!errors.password_confirmation}
                      aria-describedby={errors.password_confirmation ? 'password-confirm-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.eyeButton}
                      tabIndex={-1}
                      disabled={loading}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      <img src={showConfirmPassword ? hideIcon : eyeIcon} alt="" className={styles.eyeIcon} aria-hidden="true" />
                    </button>
                  </div>

                  {errors.password_confirmation && (
                    <span id="password-confirm-error" className={styles.errorText} role="alert">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                        <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                      </svg>
                      {errors.password_confirmation}
                    </span>
                  )}
                </div>

                {/* ── Submit ──────────────────────────────────────────────── */}
                <button type="submit" disabled={loading} className={styles.submitButton}>
                  {loading ? (
                    <><div className={styles.buttonSpinner} aria-hidden="true"></div>Resetting...</>
                  ) : (
                    'Reset Password'
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

export default ResetPassword;