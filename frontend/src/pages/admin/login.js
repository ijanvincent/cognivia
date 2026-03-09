import React, { useEffect, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
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
  const [redirect, setRedirect] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    context.handleSetAppSidebarNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppContentClass('p-0');
    return () => {
      context.handleSetAppSidebarNone(false);
      context.handleSetAppHeaderNone(false);
      context.handleSetAppContentClass('');
    };
    // eslint-disable-next-line
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (locked) {
      setErrors({ general: 'Too many failed attempts. Please try again in 5 minutes.' });
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAttempts(0);
      setRedirect(true);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setErrors({ general: 'Too many failed attempts. Please try again in 5 minutes.' });
      } else if (err.response?.status === 429) {
        setLocked(true);
        setErrors({ general: 'Too many failed attempts. Please try again in 5 minutes.' });
      } else if (err.response?.data?.errors?.email) {
        setErrors({ general: err.response.data.errors.email[0] });
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>C</div>
            <div className={styles.titleSection}>
              <h1 className={styles.systemTitle}>Cognivia</h1>
              <p className={styles.systemSubtitle}>Admin Portal</p>
            </div>
          </div>
          <div className={styles.securityBadgeAdmin}>
            Authorized Access Only
          </div>
        </div>


        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.general && (
            <div className={styles.errorAlert}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email Field */}
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <img src={emailIcon} alt="email" className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if(errors.email) setErrors(p => ({...p, email: null})); }}
                className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                placeholder="Admin email address"
                disabled={loading || locked}
                autoComplete="email"
                autoFocus
              />
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <img src={lockIcon} alt="lock" className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); if(errors.password) setErrors(p => ({...p, password: null})); }}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || locked}
            className={styles.submitButtonAdmin}
          >
            {loading ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Authenticating...
              </>
            ) : locked ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Account Locked
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Access Admin Panel
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Notice */}
      <div className={styles.securityNotice}>
        <img src={infoIcon} alt="info" className={styles.noticeIcon} />
        <span>Secure access area. All activities are monitored and logged.</span>
      </div>
    </div>
  );
}

export default AdminLogin;