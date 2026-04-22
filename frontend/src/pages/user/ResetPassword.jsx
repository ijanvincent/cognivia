import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './login.module.css';
import lockIcon from './../../assets/lock.png';
import eyeIcon from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';

function ResetPassword() {
  const [searchParams]                        = useSearchParams();
  const navigate                              = useNavigate();
  const [formData, setFormData]               = useState({ password: '', password_confirmation: '' });
  const [errors,   setErrors]                 = useState({});
  const [loading,  setLoading]                = useState(false);
  const [success,  setSuccess]                = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid]           = useState(true);

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


  const getPasswordStrength = (password) => {
    if (!password) return null;
    const hasLower   = /[a-z]/.test(password);
    const hasUpper   = /[A-Z]/.test(password);
    const hasNumber  = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const score = [hasLower, hasUpper, hasNumber, hasSpecial, password.length >= 12].filter(Boolean).length;
    if (score <= 2) return { label: 'Weak',   color: '#f87171', width: '33%'  };
    if (score <= 3) return { label: 'Fair',   color: '#fbbf24', width: '66%'  };
    return           { label: 'Strong', color: '#34d399', width: '100%' };
  };

  const strength = getPasswordStrength(formData.password);

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
                      ? 'Redirecting you to login...'
                      : !tokenValid
                      ? 'This reset link is invalid or missing'
                      : 'Reset CogniVia Password'}
                  </p>
                </div>
              </div>
            </div>

      
            {!tokenValid && (
              <div>
                <div className={styles.errorAlert}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
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

         
            {success && (
              <div>
                <div className={styles.successAlert}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
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

  
            {tokenValid && !success && (
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
                  <label className={styles.label}>New Password</label>
                  <div className={styles.inputContainer}>
                    <img src={lockIcon} alt="" className={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                      placeholder="Enter new password"
                      disabled={loading}
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.eyeButton}
                      tabIndex={-1}
                      disabled={loading}
                    >
                      <img src={showPassword ? hideIcon : eyeIcon} alt={showPassword ? 'hide' : 'show'} className={styles.eyeIcon} />
                    </button>
                  </div>
       
                  {formData.password && strength && (
                    <div className={styles.strengthWrapper}>
                      <div className={styles.strengthBar}>
                        <div className={styles.strengthFill} style={{ width: strength.width, background: strength.color }} />
                      </div>
                      <span className={styles.strengthLabel} style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

             
                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirm Password</label>
                  <div className={styles.inputContainer}>
                    <img src={lockIcon} alt="" className={styles.inputIcon} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className={`${styles.inputField} ${errors.password_confirmation ? styles.inputError : ''}`}
                      placeholder="Confirm new password"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.eyeButton}
                      tabIndex={-1}
                      disabled={loading}
                    >
                      <img src={showConfirmPassword ? hideIcon : eyeIcon} alt={showConfirmPassword ? 'hide' : 'show'} className={styles.eyeIcon} />
                    </button>
                  </div>
                  {errors.password_confirmation && <span className={styles.errorText}>{errors.password_confirmation}</span>}
                </div>

       
                <button type="submit" disabled={loading} className={styles.submitButton}>
                  {loading ? (
                    <><div className={styles.buttonSpinner}></div>Resetting...</>
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