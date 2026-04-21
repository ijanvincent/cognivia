import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { getEchoWithToken, disconnectEcho } from '../../services/echo.js';
import styles from './login.module.css';
import emailIcon from './../../assets/email.png';
import lockIcon  from './../../assets/lock.png';
import eyeIcon   from './../../assets/eye.png';
import hideIcon  from './../../assets/hide.png';

/*
 * CHANGE 3 — Removed: const isMobile = window.innerWidth <= 768
 * Why: Module-level window.innerWidth is evaluated once at parse time.
 * It never reacts to resize, breaks in SSR/hydration environments, and
 * mixes a layout concern into JS when CSS media queries are the correct layer.
 * The bgCanvas div is now rendered unconditionally; CSS controls
 * visibility and animation per breakpoint (already handled via .wavePath
 * and .bgCanvas rules in the stylesheet).
 */

function UserLogin() {
  const navigate = useNavigate();

  const [formData, setFormData]                   = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors]                       = useState({});
  const [loading, setLoading]                     = useState(false);
  const [showPassword, setShowPassword]           = useState(false);
  const [isWaitingForMobile, setIsWaitingForMobile] = useState(false);
  const [waitingDots, setWaitingDots]             = useState('');

  const echoInstanceRef = useRef(null);
  const dotsIntervalRef = useRef(null);
  const formDataRef     = useRef(formData);

  useEffect(() => { formDataRef.current = formData; }, [formData]);

  // Animated dots while waiting
  useEffect(() => {
    if (isWaitingForMobile) {
      dotsIntervalRef.current = setInterval(() => {
        setWaitingDots(d => d.length >= 3 ? '' : d + '.');
      }, 500);
    } else {
      clearInterval(dotsIntervalRef.current);
      setWaitingDots('');
    }
    return () => clearInterval(dotsIntervalRef.current);
  }, [isWaitingForMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupEcho();
  }, []);

  const cleanupEcho = useCallback(() => {
    if (echoInstanceRef.current) {
      try {
        echoInstanceRef.current.leave(`user.${echoInstanceRef.current._userId}`);
        echoInstanceRef.current.disconnect();
      } catch (_) {}
      echoInstanceRef.current = null;
    }
    disconnectEcho();
  }, []);

  /**
   * CHANGED — what: uses getEchoWithToken from echo.js instead of
   * building Echo inline. why: centralises all Echo config in one place.
   * If wsHost/port/path changes, only echo.js needs updating.
   */
  const subscribeToConflictChannel = useCallback((userId, conflictToken) => {
    const echo = getEchoWithToken(conflictToken);
    if (!echo) {
      console.error('[CogniVia] Could not build Echo instance for conflict channel');
      return;
    }

    // Store userId on instance for cleanup reference
    echo._userId = userId;
    echoInstanceRef.current = echo;

    echo.private(`user.${userId}`)
      .listen('.force.logout', async (event) => {
        if (event.platform !== 'mobile') return;

        cleanupEcho();
        setIsWaitingForMobile(false);
        setLoading(true);

        try {
          const { email, password, rememberMe } = formDataRef.current;

          const response = await api.post('/auth/login', {
            email,
            password,
            remember_me: rememberMe,
            platform:    'web',
          });

          const storage = rememberMe ? localStorage : sessionStorage;
          const user    = response.data.user;

          if (user.avatar && !user.avatar.startsWith('http')) {
            user.avatar = `${process.env.REACT_APP_API_URL.replace('/api', '')}${
              user.avatar.startsWith('/') ? '' : '/storage/'
            }${user.avatar}`;
          }

          storage.setItem('token', response.data.token);
          storage.setItem('user', JSON.stringify(user));

          navigate('/dashboard', { replace: true });

        } catch (retryError) {
          setErrors({ general: 'Auto-login failed. Please sign in manually.' });
          setIsWaitingForMobile(false);
          setLoading(false);
        }
      });
  }, [cleanupEcho, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: null, general: null }));
    if (isWaitingForMobile) {
      setIsWaitingForMobile(false);
      cleanupEcho();
    }
  };

  const validateForm = () => {
    const newErrors  = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim())          newErrors.email    = 'Email address is required.';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!formData.password)              newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    cleanupEcho();
    setIsWaitingForMobile(false);
    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/auth/login', {
        email:       formData.email,
        password:    formData.password,
        remember_me: formData.rememberMe,
        platform:    'web',
      });

      const storage = formData.rememberMe ? localStorage : sessionStorage;
      const user    = response.data.user;

      if (user.avatar && !user.avatar.startsWith('http')) {
        user.avatar = `${process.env.REACT_APP_API_URL.replace('/api', '')}${
          user.avatar.startsWith('/') ? '' : '/storage/'
        }${user.avatar}`;
      }

      storage.setItem('token', response.data.token);
      storage.setItem('user', JSON.stringify(user));
      navigate('/dashboard', { replace: true });

    } catch (error) {
      const status  = error.response?.status;
      const code    = error.response?.data?.error_code;
      const message = error.response?.data?.message;

      if (status === 401) {
        switch (code) {
          case 'EMAIL_NOT_FOUND':
            setErrors({ email: message || 'No account found with this email address.' });
            break;
          case 'WRONG_PASSWORD':
            setErrors({ password: message || 'The password you entered is incorrect.' });
            break;
          case 'TOO_MANY_ATTEMPTS':
            setErrors({ general: message || 'Too many attempts. Please try again later.' });
            break;
          default:
            setErrors({ email: 'Please check your email address.', password: 'Please check your password.' });
        }
      } else if (status === 422) {
        if (code === 'PLATFORM_CONFLICT') {
          const conflictToken = error.response?.data?.conflict_token;
          const userId        = error.response?.data?.conflict_user_id;

          setIsWaitingForMobile(true);
          setErrors({ general: message });

          if (conflictToken && userId) {
            subscribeToConflictChannel(userId, conflictToken);
          }

        } else if (code === 'ADMIN_ACCOUNT') {
          setErrors({ email: 'This account is not authorized here.' });
        } else {
          const laravelErrors = error.response?.data?.errors || {};
          setErrors({
            email:    laravelErrors.email?.[0]    || null,
            password: laravelErrors.password?.[0] || null,
          });
        }
      } else if (status === 429) {
        const retryAfter = error.response?.data?.retry_after;
        setErrors({
          general: retryAfter
            ? `Too many login attempts. Please try again in ${retryAfter} seconds.`
            : (message || 'Too many login attempts. Please try again later.'),
        });
      } else {
        setErrors({ general: message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* SESSION CONFLICT MODAL */}
      {(errors.general || isWaitingForMobile) && (
        <div className={styles.toastScrim} role="dialog" aria-modal="true" aria-labelledby="session-alert-title">
          <div className={styles.toast}>
            <div className={styles.toastIconWrap} aria-hidden="true">
              {isWaitingForMobile ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warning, #f59e0b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 16 16" fill="var(--error)">
                  <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                </svg>
              )}
            </div>

            <p id="session-alert-title" className={styles.toastTitle}>
              {isWaitingForMobile ? 'Waiting for mobile to log out' : 'Session conflict detected'}
            </p>

            <p className={styles.toastBody}>
              {isWaitingForMobile
                ? `This page will automatically sign you in once your mobile session ends${waitingDots}`
                : errors.general}
            </p>

            <div className={styles.toastDivider}></div>

            <span className={styles.toastHint} aria-live="polite">
              {isWaitingForMobile
                ? 'Listening for session release in real-time'
                : 'Active session found on another device'}
            </span>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      {/*
        CHANGE 3 — bgCanvas is now always rendered.
        Visibility and animation are controlled exclusively by CSS media
        queries (.bgCanvas display, .wavePath animation: none at ≤768px).
        On mobile, the static wave SVG overlay (.bgCanvasMobile) is shown
        instead via CSS — no JS branching needed.
      */}
      <div className={styles.bgCanvas}>
        <svg className={styles.bgSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {[...Array(18)].map((_, i) => (
            <path key={`pink-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.15}s`, '--wave-color': `rgba(200, 80, 200, ${0.4 - i * 0.015})` }}
              d={`M ${-100 + i * 8} ${300 + i * 6} C ${200 + i * 5} ${100 + i * 8}, ${500 + i * 3} ${500 + i * 4}, ${700 + i * 6} ${200 + i * 5} S ${900 + i * 4} ${600 + i * 3}, ${1100 + i * 5} ${300 + i * 4}`}
              fill="none" strokeWidth="1.2" />
          ))}
          {[...Array(18)].map((_, i) => (
            <path key={`cyan-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.12 + 1}s`, '--wave-color': `rgba(30, 180, 255, ${0.4 - i * 0.015})` }}
              d={`M ${500 + i * 6} ${900} C ${700 + i * 4} ${650 + i * 5}, ${900 + i * 3} ${800 + i * 3}, ${1100 + i * 5} ${550 + i * 6} S ${1300 + i * 4} ${750 + i * 3}, ${1500 + i * 5} ${600 + i * 4}`}
              fill="none" strokeWidth="1.2" />
          ))}
          {[...Array(10)].map((_, i) => (
            <path key={`purple-${i}`} className={styles.wavePath}
              style={{ animationDelay: `${i * 0.2 + 0.5}s`, '--wave-color': `rgba(130, 80, 255, ${0.25 - i * 0.02})` }}
              d={`M ${200 + i * 10} ${500 + i * 4} C ${400 + i * 6} ${300 + i * 5}, ${700 + i * 4} ${700 + i * 3}, ${1000 + i * 5} ${400 + i * 4}`}
              fill="none" strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/*
        CHANGE 1 — Mobile wave background.
        Mirrors the React Native WaveBackground component exactly:
        same 3 wave families (pink, cyan, purple), same 400×800 viewBox,
        same preserveAspectRatio="xMidYMid slice", same path geometry
        and opacity values. Rendered in DOM always; CSS shows it only
        at ≤768px (display: none on desktop). No animation — static,
        zero GPU cost on mobile.
      */}
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

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <div className={`${styles.inputContainer} ${errors.email ? styles.inputContainerError : ''}`}>
                  <img src={emailIcon} alt="" className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="email" type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="you@example.com"
                    disabled={loading || isWaitingForMobile}
                    autoComplete="email" autoFocus
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className={styles.errorText} role="alert">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
                      <path fillRule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 11a1 1 0 102 0V5a1 1 0 10-2 0v6zm1-9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                    </svg>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={`${styles.inputContainer} ${errors.password ? styles.inputContainerError : ''}`}>
                  <img src={lockIcon} alt="" className={styles.inputIcon} aria-hidden="true" />
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange}
                    className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Enter your password"
                    disabled={loading || isWaitingForMobile}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton} tabIndex={-1}
                    disabled={loading || isWaitingForMobile}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
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

              <div className={styles.rememberRow}>
                <label className={styles.rememberLabel}>
                  <input type="checkbox" name="rememberMe"
                    checked={formData.rememberMe} onChange={handleChange}
                    disabled={loading || isWaitingForMobile}
                    className={styles.rememberCheckbox} />
                  Remember me
                </label>
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading || isWaitingForMobile} className={styles.submitButton}>
                {loading ? (
                  <><div className={styles.buttonSpinner} aria-hidden="true"></div>Signing in...</>
                ) : isWaitingForMobile ? (
                  <>Waiting for mobile logout{waitingDots}</>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className={styles.linksSection}>
                <span className={styles.registerPrompt}>
                  Don't have an account?{' '}
                  <Link to="/register" className={styles.registerLink}>Sign Up</Link>
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