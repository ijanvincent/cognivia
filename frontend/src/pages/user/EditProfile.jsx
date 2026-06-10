import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { STORAGE_KEYS, resolveAvatarUrl } from '../../services/api.js';
import styles from './styles/editprofile.module.css';

/*
 * NAMESPACE FIX — Import STORAGE_KEYS constant.
 *
 * What:  Replaced `import STORAGE_KEYS from '../../config/storageKeys.js'`
 *        with named import `{ STORAGE_KEYS }` from `../../services/api.js`.
 *
 * Why (1 — wrong source): storageKeys.js is superseded and deleted.
 *        api.js is the single source of truth for STORAGE_KEYS (flat shape).
 *
 * Why (2 — nested vs flat): storageKeys.js used STORAGE_KEYS.USER.TOKEN.
 *        api.js uses STORAGE_KEYS.USER_TOKEN. All accesses in getStoredUser()
 *        and persistUser() have been updated to the flat shape. Nested access
 *        resolves to `undefined` — getItem(undefined) always returns null,
 *        so getStoredUser() always returned {} (empty form fields) and
 *        persistUser() wrote to key "undefined" instead of 'user_data'.
 */

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconCamera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/*
 * NAMESPACE FIX — getStoredUser reads from namespaced user keys only.
 *
 * What:  All storage reads changed from nested to flat shape:
 *          STORAGE_KEYS.USER.TOKEN → STORAGE_KEYS.USER_TOKEN
 *          STORAGE_KEYS.USER.DATA  → STORAGE_KEYS.USER_DATA
 *
 * Why:   STORAGE_KEYS has no .USER sub-key. Nested access resolved to
 *        `undefined`, so getItem(undefined) always returned null — the
 *        token-presence check always failed and the function returned {},
 *        leaving username and avatar fields blank on every page load.
 *        Flat keys correctly read 'user_token' / 'user_data'.
 */
function getStoredUser() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null') || {};
    }
    if (sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null') || {};
    }
    return {};
  } catch { return {}; }
}

/*
 * NAMESPACE FIX — persistUser writes only to the storage that owns
 *                 the active user token (targeted write).
 *
 * What:  All storage reads/writes changed from nested to flat shape:
 *          STORAGE_KEYS.USER.TOKEN → STORAGE_KEYS.USER_TOKEN
 *          STORAGE_KEYS.USER.DATA  → STORAGE_KEYS.USER_DATA
 *
 * Why:   Same root cause as getStoredUser. Additionally, the token-presence
 *        check using the nested key always returned null/false, so neither
 *        branch was ever entered — profile saves were silently discarded
 *        and the updated user object was never persisted to storage.
 *        Flat keys ensure the write lands in the correct storage slot,
 *        leaving admin keys ('admin_token' / 'admin_data') untouched.
 */
function persistUser(updatedUser) {
  const serialized = JSON.stringify(updatedUser);
  if (localStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
    try { localStorage.setItem(STORAGE_KEYS.USER_DATA, serialized); } catch {}
  } else if (sessionStorage.getItem(STORAGE_KEYS.USER_TOKEN)) {
    try { sessionStorage.setItem(STORAGE_KEYS.USER_DATA, serialized); } catch {}
  }
}

function EditProfile() {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [mounted, setMounted]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [errors, setErrors]               = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [storedUser, setStoredUser]       = useState({});
  const [formData, setFormData]           = useState({ username: '' });

  useEffect(() => {
    const user = getStoredUser();
    setStoredUser(user);
    setFormData({ username: user.username || '' });
    if (user.avatar) {
      setAvatarPreview(resolveAvatarUrl(user.avatar));
    } else {
      setAvatarPreview(null);
    }
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image must be less than 2MB' }));
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: 'Only JPEG, PNG or WebP images allowed' }));
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const blobUrl = URL.createObjectURL(file);
    objectUrlRef.current = blobUrl;

    setAvatarFile(file);
    setAvatarPreview(blobUrl);
    setErrors(prev => ({ ...prev, avatar: null }));
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * LABEL & VALIDATION FIX
     *
     * What: Regex updated from ^[a-zA-Z0-9_]+$ to ^[a-zA-Z0-9_ ]+$ (spaces
     *       now permitted). All three validation error messages updated from
     *       "Username" to "Profile name".
     *
     * Why:  Registration uses ^[a-zA-Z0-9_ ]+$ and labels the field "Profile
     *       Name". The old regex rejected any name containing a space,
     *       causing a client-side validation error for values that were
     *       accepted at registration. Messages must be consistent across
     *       both flows.
     */
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Profile name is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Profile name must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_ ]+$/.test(formData.username.trim())) {
      newErrors.username = 'Only letters, numbers, underscores and spaces allowed';
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setErrors({});

    try {
      const form = new FormData();
      form.append('username', formData.username.trim());
      if (avatarFile) form.append('avatar', avatarFile);

      const response = await api.post('/auth/profile/update', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Persist the raw avatar path as returned by the API. Resolving to an
      // absolute URL happens at render time only — a persisted absolute URL
      // goes stale when the app is served from a different host (ngrok/LAN).
      const updatedUser = response.data.user;

      // Targeted write — only touches the storage slot that owns user_token.
      persistUser(updatedUser);

      // Notify other components (e.g. UserDashboard) of the update.
      window.dispatchEvent(new CustomEvent('cognivia:userUpdated', { detail: updatedUser }));

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1800);

    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          apiErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(apiErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const userInitial = (formData.username || storedUser.username || 'U').charAt(0).toUpperCase();

  return (
    <div className={`${styles.page} ${mounted ? styles.mounted : ''}`}>

      <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
        <IconArrowLeft />
        Back to Dashboard
      </button>

      <div className={styles.card}>
        {success ? (
          <div className={styles.successState}>
            <svg className={styles.checkIcon} viewBox="0 0 52 52" fill="none">
              <circle className={styles.checkCircle} cx="26" cy="26" r="24" />
              <polyline className={styles.checkMark} points="14.5 27 22 34.5 37.5 17.5" />
            </svg>
            <div className={styles.successText}>
              <h2 className={styles.successTitle}>Profile updated!</h2>
              <p className={styles.successSub}>Redirecting you to dashboard…</p>
            </div>
            <div className={styles.successProgress}>
              <div className={styles.successProgressFill} />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>Edit Profile</h1>
              <p className={styles.cardSubtitle}>Update your profile name and profile picture</p>
            </div>

            {errors.general && (
              <div className={styles.errorAlert}>{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.avatarSection}>
            <div className={styles.avatarWrap} onClick={handleAvatarClick}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className={styles.avatarImg}
                  onError={() => setAvatarPreview(null)}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>{userInitial}</div>
              )}
              <div className={styles.avatarOverlay}>
                <IconCamera />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleAvatarChange}
              className={styles.fileInput}
            />
            <p className={styles.avatarHint}>Click to upload · JPEG, PNG, WebP · Max 2MB</p>
            {errors.avatar && <span className={styles.errorText}>{errors.avatar}</span>}
          </div>

          {/*
           * LABEL & PLACEHOLDER FIX
           * What: Label changed from "Username" to "Profile Name".
           *       Placeholder changed from "Enter username" to
           *       "Enter your profile name".
           * Why:  Must match registration field label and terminology
           *       consistently across the entire auth flow.
           */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Profile Name</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><IconUser /></span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`${styles.inputField} ${errors.username ? styles.inputError : ''}`}
                placeholder="Enter your profile name"
                disabled={loading || success}
                autoComplete="username"
              />
            </div>
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email address</label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                value={storedUser.email || ''}
                className={`${styles.inputField} ${styles.inputReadOnly}`}
                disabled
              />
            </div>
            <span className={styles.readOnlyHint}>Email cannot be changed</span>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`${styles.submitBtn}${loading ? ` ${styles.submitBtnLoading}` : ''}${success ? ` ${styles.submitBtnSuccess}` : ''}`}
          >
            {loading ? (
              <><div className={styles.spinner} /><span>Saving…</span></>
            ) : success ? (
              <><IconCheck /><span>Saved!</span></>
            ) : (
              'Save Changes'
            )}
          </button>

          </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProfile;