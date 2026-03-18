import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './login.module.css';
import emailIcon from './../../assets/email.png';
import lockIcon from './../../assets/lock.png';
import eyeIcon from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';

const isMobile = window.innerWidth <=768;

function UserLogin() {
  const [redirect, setRedirect]         = useState(false);
  const [formData, setFormData]         = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email    = 'Email is required';
    if (!formData.password)     newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setErrors({});
    try {
      const response = await api.post('/auth/login', {
        email:      formData.email,
        password:   formData.password,
        rememberMe: formData.rememberMe,
      });
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', response.data.token);
      storage.setItem('user', JSON.stringify(response.data.user));
      setRedirect(true);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ general: 'Invalid email or password' });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to='/dashboard' />;

  return (
    <div className={styles.pageContainer}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      {/* Animated SVG Background — desktop only */}
      {!isMobile && (
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
      )}

      {/* Top Navigation Bar */}
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

      {/* Main Content */}
      <div className={styles.mainContent}>

        {/* Left Hero */}
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

        {/* Right Login Card */}
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

            <form onSubmit={handleSubmit} className={styles.form}>
              {errors.general && (
                <div className={styles.errorAlert}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Email address</label>
                <div className={styles.inputContainer}>
                  <img src={emailIcon} alt="" className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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

              {/* Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputContainer}>
                  <img src={lockIcon} alt="" className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
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
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className={styles.rememberRow}>
                <label className={styles.rememberLabel}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                    className={styles.rememberCheckbox}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? (
                  <><div className={styles.buttonSpinner}></div>Signing In...</>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className={styles.linksSection}>
                <span className={styles.registerPrompt}>
                  Don't have an account?{' '}
                  <Link to="/register" className={styles.registerLink}>Register here</Link>
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