import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './styles/login.module.css';
/*
 * CHANGE B — Removed: import lockIcon from './../../assets/lock.png'
 * (carried forward from previous session — rationale unchanged)
 */
import eyeIcon  from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';

// ─────────────────────────────────────────────────────────────────────────────
// Password strength system — identical to RegisterScreen.js (mobile)
// ─────────────────────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { key: 'lowercase', label: 'At least one lowercase letter',  test: (p) => /[a-z]/.test(p) },
  { key: 'uppercase', label: 'At least one uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { key: 'number',    label: 'At least one number',            test: (p) => /[0-9]/.test(p) },
  { key: 'special',   label: 'At least one special character', test: (p) => /[^a-zA-Z0-9]/.test(p) },
  { key: 'length',    label: 'Minimum 8 characters',           test: (p) => p.length >= 8 },
];

function ResetPassword() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const [formData, setFormData] = useState({ password: '', password_confirmation: '' });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid,          setTokenValid]          = useState(true);

  /*
   * CHANGE RP-X1 (state) — Three booleans matching RegisterScreen.js state exactly.
   */
  const [passwordFocused,   setPasswordFocused]   = useState(false);
  const [confirmFocused,    setConfirmFocused]     = useState(false);
  const [strengthDismissed, setStrengthDismissed] = useState(false);

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
    setStrengthDismissed(true);
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

  /*
   * CHANGE RP-X1 (visibility) — showPasswordRules mirrors RegisterScreen.js exactly.
   */
  const showPasswordRules = !strengthDismissed &&
    (passwordFocused || (!confirmFocused && formData.password.length > 0));

  return (
    <div className={styles.pageContainer}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      {/* ── Desktop wave background ──────────────────────────────────────── */}
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

      {/* ── Mobile wave background ───────────────────────────────────────── */}
      <div className={styles.bgCanvasMobile} aria-hidden="true">
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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

        {/* ── Hero ────────────────────────────────────────────────────────── */}
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
                  <p className={styles.cardSubtitle}>
                    {success
                      ? 'Your account is secured — redirecting you to sign in'
                      : !tokenValid
                      ? 'This reset link is invalid or missing'
                      : 'Secure your account with a new password'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Invalid token ───────────────────────────────────────────── */}
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

            {/* ── Success ─────────────────────────────────────────────────── */}
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

                {/*
                 * CHANGE RP-LAYOUT-1b
                 * WHAT: Wrapped New Password and Confirm Password fields in
                 *       passwordRow / passwordCol divs so they sit side by side.
                 * WHY:  Matches mobile RegisterScreen layout exactly —
                 *       passwordRow: flexDirection:'row', gap:10
                 *       passwordCol: flex:1
                 *       The strength checklist stays inside the left column so
                 *       it expands beneath New Password only, not across both.
                 */}
                <div className={styles.passwordRow}>

                  {/* ── Left column: New Password + strength checklist ──── */}
                  <div className={styles.passwordCol}>

                    {/* ── New Password field ─────────────────────────────── */}
                    <div className={`${styles.formGroup} ${styles.formGroupPassword}`}>
                      <label className={styles.label} htmlFor="password">New Password</label>
                      <div className={`${styles.inputContainer} ${errors.password ? styles.inputContainerError : ''}`}>

                        {/* Lock icon — matches mobile lock-outline */}
                        <svg
                          className={styles.inputIcon}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path fill="currentColor" d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2 2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                        </svg>

                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => {
                            setPasswordFocused(true);
                            setStrengthDismissed(false);
                          }}
                          onBlur={() => setPasswordFocused(false)}
                          className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                          placeholder="Enter new password"
                          disabled={loading}
                          autoComplete="new-password"
                          autoFocus
                          aria-invalid={!!errors.password}
                          aria-describedby="rp-password-rules"
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

                      {errors.password && (
                        <span id="password-error" className={styles.errorText} role="alert">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                            <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                          </svg>
                          {errors.password}
                        </span>
                      )}
                    </div>

                    {/* ── Password strength checklist ────────────────────── */}
                    {showPasswordRules && (
                      <div
                        id="rp-password-rules"
                        className={styles.reqContainer}
                        aria-live="polite"
                        aria-label="Password requirements"
                      >
                        {PASSWORD_RULES.map((rule) => {
                          const met = rule.test(formData.password);
                          return (
                            <div key={rule.key} className={styles.reqRow}>
                              {met ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="#22c55e" aria-hidden="true" focusable="false">
                                  <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd"/>
                                </svg>
                              ) : (
                                <div className={styles.reqDot} aria-hidden="true" />
                              )}
                              <span className={`${styles.reqText} ${met ? styles.reqTextMet : ''}`}>
                                {rule.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>{/* end left passwordCol */}

                  {/* ── Right column: Confirm Password ──────────────────── */}
                  <div className={styles.passwordCol}>

                    {/* ── Confirm Password field ─────────────────────────── */}
                    <div className={`${styles.formGroup} ${styles.formGroupConfirmPassword}`}>
                      <label className={styles.label} htmlFor="password_confirmation">Confirm Password</label>
                      <div className={`${styles.inputContainer} ${errors.password_confirmation ? styles.inputContainerError : ''}`}>

                        {/* Lock-check icon — matches mobile lock-check-outline */}
                        <svg
                          className={styles.inputIcon}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path fill="currentColor" d="M14 15c0 1.11-.89 2-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2m-.91 5c.12.72.37 1.39.72 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6c0-2.76 2.24-5 5-5s5 2.24 5 5v2h1a2 2 0 0 1 2 2v3.09c-.33-.05-.66-.09-1-.09s-.67.04-1 .09V10H6v10zM9 8h6V6c0-1.66-1.34-3-3-3S9 4.34 9 6zm12.34 7.84-3.59 3.59-1.59-1.59L15 19l2.75 3 4.75-4.75z"/>
                        </svg>

                        <input
                          id="password_confirmation"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          onFocus={() => {
                            setConfirmFocused(true);
                            setStrengthDismissed(true);
                          }}
                          onBlur={() => setConfirmFocused(false)}
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

                  </div>{/* end right passwordCol */}

                </div>{/* end passwordRow */}

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