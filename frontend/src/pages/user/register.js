import React, { useEffect, useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import styles from './register.module.css';
import emailIcon from './../../assets/email.png';
import lockIcon from './../../assets/lock.png';
import eyeIcon from './../../assets/eye.png';
import hideIcon from './../../assets/hide.png';
import userIcon from './../../assets/user.png';
import confirmPassIcon from './../../assets/confirm-pass.png';

function UserRegister() {
  const context = useContext(AppSettings);
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Username is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.name.trim())) {
      newErrors.name = 'Username can only contain letters, numbers, and underscores';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const response = await api.post('/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setRedirect(true);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
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

  if (redirect) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <div className={styles.pageWrapper}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBar} />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.formCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>C</div>
              </div>
              <div className={styles.headerText}>
                <h1 className={styles.headerTitle}>Cognivia</h1>
                <p className={styles.headerSubtitle}>Create your account</p>
              </div>
            </div>
          </div>

          <div className={styles.formBody}>
            {errors.general && (
              <div className={styles.errorBanner}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Username <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <img src={userIcon} alt="user" className={styles.userinputIcon} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Enter your username"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <img src={emailIcon} alt="email" className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Enter your email"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Password <span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordWrapper}>
                  <img src={lockIcon} alt="lock" className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                    tabIndex={-1}
                    disabled={loading}
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

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Confirm Password <span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordWrapper}>
                  <img src={confirmPassIcon} alt="confirm" className={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.password_confirmation ? styles.inputError : ''}`}
                    placeholder="Re-enter your password"
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
                    <img
                      src={showConfirmPassword ? hideIcon : eyeIcon}
                      alt={showConfirmPassword ? 'hide' : 'show'}
                      className={styles.eyeIcon}
                    />
                  </button>
                </div>
                {errors.password_confirmation && <span className={styles.errorText}>{errors.password_confirmation}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={styles.btnSubmit}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserRegister;