import React, { useState } from 'react';
import api, { STORAGE_KEYS } from './../../services/api.js';
import { PageHeader, avatarColor } from './components/admin-ui.jsx';
import { adminPath } from './../../config/admin-path';

function getStoredAdmin() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}') || {};
    } catch { return {}; }
}

function FieldRow({ label, hint, children }) {
    return (
        <div className="list-group-item px-4 py-3">
            <div className="row align-items-center g-2">
                <div className="col-md-4">
                    <div className="fw-semibold" style={{ fontSize: '13px' }}>{label}</div>
                    {hint && <div className="text-muted" style={{ fontSize: '11px' }}>{hint}</div>}
                </div>
                <div className="col-md-8">{children}</div>
            </div>
        </div>
    );
}

function SectionHeader({ icon, title, desc }) {
    return (
        <div className="d-flex align-items-center gap-2 mb-1 px-4 pt-3 pb-2 border-bottom">
            <span className="rounded d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary flex-shrink-0"
                style={{ width: 32, height: 32 }}>
                <i className={`fa-solid ${icon}`} style={{ fontSize: '13px' }}></i>
            </span>
            <div>
                <div className="fw-bold" style={{ fontSize: '14px' }}>{title}</div>
                {desc && <div className="text-muted" style={{ fontSize: '11px' }}>{desc}</div>}
            </div>
        </div>
    );
}

function AdminProfile() {
    const stored = getStoredAdmin();

    const [username, setUsername] = useState(stored.username || '');
    const [email, setEmail]       = useState(stored.email || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword]         = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [savingAccount,  setSavingAccount]  = useState(false);
    const [savingSecurity, setSavingSecurity] = useState(false);
    const [successAccount,  setSuccessAccount]  = useState('');
    const [successSecurity, setSuccessSecurity] = useState('');
    const [errorsAccount,   setErrorsAccount]   = useState({});
    const [errorsSecurity,  setErrorsSecurity]  = useState({});

    const joinDate = stored.created_at
        ? new Date(stored.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;

    async function handleSaveAccount(e) {
        e.preventDefault();
        setSuccessAccount('');
        setErrorsAccount({});

        const payload = {};
        if (username.trim() !== (stored.username || '')) payload.username = username.trim();
        if (email.trim()    !== (stored.email    || '')) payload.email    = email.trim();

        if (Object.keys(payload).length === 0) {
            setErrorsAccount({ form: 'No changes to save.' });
            return;
        }

        setSavingAccount(true);
        try {
            const response = await api.post('/admin/profile', payload);
            const user = response.data?.user?.data || response.data?.user || {};
            localStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify({ ...stored, ...user }));
            setSuccessAccount('Account information updated.');
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                const flat = {};
                Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : v; });
                setErrorsAccount(flat);
            } else {
                setErrorsAccount({ form: data?.message || 'Update failed. Please try again.' });
            }
        } finally {
            setSavingAccount(false);
        }
    }

    async function handleSaveSecurity(e) {
        e.preventDefault();
        setSuccessSecurity('');
        setErrorsSecurity({});

        if (!newPassword) {
            setErrorsSecurity({ new_password: 'Enter a new password.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorsSecurity({ new_password: 'Passwords do not match.' });
            return;
        }

        setSavingSecurity(true);
        try {
            await api.post('/admin/profile', {
                current_password:          currentPassword,
                new_password:              newPassword,
                new_password_confirmation: confirmPassword,
            });
            setSuccessSecurity('Password changed successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                const flat = {};
                Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : v; });
                setErrorsSecurity(flat);
            } else {
                setErrorsSecurity({ form: data?.message || 'Update failed. Please try again.' });
            }
        } finally {
            setSavingSecurity(false);
        }
    }

    return (
        <div>
            <PageHeader
                crumbs={[{ label: 'Admin', to: adminPath('/dashboard') }, { label: 'Profile' }]}
                title="Profile"
                subtitle="Manage your account information and security settings"
            />

            <div className="row justify-content-center g-4">
                {/* ── Profile card ───────────────────────────────────────────── */}
                <div className="col-xl-3 col-lg-4">
                    <div className="card h-auto">
                        <div className="card-body text-center pt-4 pb-3">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{
                                    width: 80, height: 80,
                                    background: avatarColor(username),
                                    fontSize: 30, color: '#fff', fontWeight: 700,
                                }}>
                                {(username || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div className="fw-bold fs-5 lh-sm">{username || 'Admin'}</div>
                            <div className="mt-1 mb-2">
                                <span className="badge bg-primary bg-opacity-15 text-primary fw-semibold"
                                    style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                                    <i className="fa-solid fa-shield-halved me-1" style={{ fontSize: '10px' }}></i>
                                    Administrator
                                </span>
                            </div>
                            {email && (
                                <div className="text-muted" style={{ fontSize: '12px' }}>
                                    <i className="fa-solid fa-envelope me-1 opacity-50"></i>{email}
                                </div>
                            )}
                        </div>
                        {joinDate && (
                            <div className="card-footer text-center text-muted py-2" style={{ fontSize: '11px' }}>
                                <i className="fa-solid fa-calendar-days me-1 opacity-50"></i>
                                Member since {joinDate}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Forms ──────────────────────────────────────────────────── */}
                <div className="col-xl-7 col-lg-8 d-flex flex-column gap-4">

                    {/* Account information */}
                    <div className="card p-0 overflow-hidden">
                        <SectionHeader
                            icon="fa-user"
                            title="Account Information"
                            desc="Update your display name and email address"
                        />
                        <form onSubmit={handleSaveAccount}>
                            <div className="list-group list-group-flush">
                                <FieldRow label="Username" hint="3–30 characters">
                                    <input
                                        type="text"
                                        className={'form-control form-control-sm' + (errorsAccount.username ? ' is-invalid' : '')}
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Username"
                                    />
                                    {errorsAccount.username && <div className="invalid-feedback">{errorsAccount.username}</div>}
                                </FieldRow>
                                <FieldRow label="Email address" hint="Used for login and notifications">
                                    <input
                                        type="email"
                                        className={'form-control form-control-sm' + (errorsAccount.email ? ' is-invalid' : '')}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                    />
                                    {errorsAccount.email && <div className="invalid-feedback">{errorsAccount.email}</div>}
                                </FieldRow>
                            </div>

                            {successAccount && (
                                <div className="mx-4 mt-3 mb-0 alert alert-success py-2 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                                    <i className="fa-solid fa-circle-check text-success"></i> {successAccount}
                                </div>
                            )}
                            {errorsAccount.form && (
                                <div className="mx-4 mt-3 mb-0 alert alert-danger py-2" style={{ fontSize: '13px' }}>
                                    {errorsAccount.form}
                                </div>
                            )}

                            <div className="px-4 py-3 d-flex justify-content-end border-top">
                                <button type="submit" className="btn btn-theme btn-sm px-4" disabled={savingAccount}>
                                    {savingAccount
                                        ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving…</>
                                        : <><i className="fa-solid fa-floppy-disk me-2"></i>Save changes</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security / Change password */}
                    <div className="card p-0 overflow-hidden">
                        <SectionHeader
                            icon="fa-lock"
                            title="Security"
                            desc="Change your password — minimum 8 characters"
                        />
                        <form onSubmit={handleSaveSecurity}>
                            <div className="list-group list-group-flush">
                                <FieldRow label="Current password" hint="Required to confirm changes">
                                    <input
                                        type="password"
                                        className={'form-control form-control-sm' + (errorsSecurity.current_password ? ' is-invalid' : '')}
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                    {errorsSecurity.current_password && (
                                        <div className="invalid-feedback">{errorsSecurity.current_password}</div>
                                    )}
                                </FieldRow>
                                <FieldRow label="New password" hint="At least 8 characters">
                                    <input
                                        type="password"
                                        className={'form-control form-control-sm' + (errorsSecurity.new_password ? ' is-invalid' : '')}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                    />
                                    {errorsSecurity.new_password && (
                                        <div className="invalid-feedback">{errorsSecurity.new_password}</div>
                                    )}
                                </FieldRow>
                                <FieldRow label="Confirm new password" hint="Must match the password above">
                                    <input
                                        type="password"
                                        className="form-control form-control-sm"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                    />
                                </FieldRow>
                            </div>

                            {successSecurity && (
                                <div className="mx-4 mt-3 mb-0 alert alert-success py-2 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                                    <i className="fa-solid fa-circle-check text-success"></i> {successSecurity}
                                </div>
                            )}
                            {errorsSecurity.form && (
                                <div className="mx-4 mt-3 mb-0 alert alert-danger py-2" style={{ fontSize: '13px' }}>
                                    {errorsSecurity.form}
                                </div>
                            )}

                            <div className="px-4 py-3 d-flex justify-content-end border-top">
                                <button type="submit" className="btn btn-theme btn-sm px-4" disabled={savingSecurity}>
                                    {savingSecurity
                                        ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Updating…</>
                                        : <><i className="fa-solid fa-key me-2"></i>Update password</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
