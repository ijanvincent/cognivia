import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import styles from './editprofile.module.css';

// ── Icons ──
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

// ─────────────────────────────────────────────────────────────────────────────
// FIX: resolveAvatarUrl
// WHY: Laravel Storage::url() may return "/storage/avatars/5_xxx.jpg" (relative)
//      or the raw path "avatars/5_xxx.jpg". Either way, <img src> needs a full URL.
//      We normalize all cases here in one place.
// ─────────────────────────────────────────────────────────────────────────────
function resolveAvatarUrl(avatar) {
  if (!avatar) return null;
  if (avatar.startsWith('blob:'))   return avatar; // local preview, already usable
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (avatar.startsWith('/')) return `${base}${avatar}`;
  return `${base}/storage/${avatar}`; // raw path e.g. "avatars/5_xxx.jpg"
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX: getStoredUser / getStorageTarget
// WHY: Reading storedUser at module scope creates a stale closure — the value
//      is captured once at import time and never updates. Reading inside
//      useEffect picks up the latest value after navigation.
//      getStorageTarget() checks both storages so we write to the right one.
// ─────────────────────────────────────────────────────────────────────────────
function getStoredUser() {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return JSON.parse(raw) || {};
  } catch { return {}; }
}

function getStorageTarget() {
  return localStorage.getItem('token') ? localStorage : sessionStorage;
}

// ─────────────────────────────────────────────────────────────────────────────

function EditProfile() {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null); // track blob URL for cleanup

  const [mounted, setMounted]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [errors, setErrors]               = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [storedUser, setStoredUser]       = useState({});
  const [formData, setFormData]           = useState({ username: '' });

  // ── Load user fresh inside useEffect ────────────────────────────────────
  useEffect(() => {
    const user = getStoredUser();
    setStoredUser(user);
    setFormData({ username: user.username || '' });
    // FIX: resolve raw avatar path → full URL before setting as preview
    if (user.avatar) setAvatarPreview(resolveAvatarUrl(user.avatar));
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // ── Revoke blob URLs on unmount to prevent memory leaks ─────────────────
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  // ── FIX: Use URL.createObjectURL instead of FileReader ──────────────────
  // WHY: FileReader is async and introduces a race condition where the user
  //      could select another file before the first read completes.
  //      createObjectURL is synchronous and immediate.
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

    // Revoke previous blob URL before creating a new one
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const blobUrl = URL.createObjectURL(file);
    objectUrlRef.current = blobUrl;

    setAvatarFile(file);
    setAvatarPreview(blobUrl);
    setErrors(prev => ({ ...prev, avatar: null }));

    // Reset so same file can be selected again
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Only letters, numbers and underscores allowed';
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

      const updatedUser = response.data.user;

      // ── FIX: Normalize avatar URL before persisting ──────────────────────
      // WHY: API returns raw path or relative URL — normalize to full URL
      //      so every future read from storage is display-ready
      if (updatedUser.avatar) {
        updatedUser.avatar = resolveAvatarUrl(updatedUser.avatar);
      }

      // ── FIX: Write to correct storage ────────────────────────────────────
      getStorageTarget().setItem('user', JSON.stringify(updatedUser));

      // ── FIX: Notify Dashboard on same tab ────────────────────────────────
      // WHY: The 'storage' event doesn't fire on the same tab that wrote the
      //      change. We dispatch a custom event so Dashboard can re-read user
      //      and update the avatar chip without a full page reload.
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
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Edit Profile</h1>
          <p className={styles.cardSubtitle}>Update your username and profile picture</p>
        </div>

        {success && (
          <div className={styles.successAlert}>
            <IconCheck />
            Profile updated successfully! Redirecting...
          </div>
        )}
        {errors.general && (
          <div className={styles.errorAlert}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* ── Avatar upload ── */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrap} onClick={handleAvatarClick}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className={styles.avatarImg}
                  // FIX: onError fallback — broken img shows initials instead
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

          {/* ── Username ── */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <div className={styles.inputContainer}>
              <span className={styles.inputIcon}><IconUser /></span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`${styles.inputField} ${errors.username ? styles.inputError : ''}`}
                placeholder="Enter username"
                disabled={loading || success}
                autoComplete="username"
              />
            </div>
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>

          {/* ── Email (read only) ── */}
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

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading || success}
            className={styles.submitBtn}
          >
            {loading ? (
              <><div className={styles.spinner} /> Saving...</>
            ) : success ? (
              <><IconCheck /> Saved!</>
            ) : (
              'Save Changes'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;