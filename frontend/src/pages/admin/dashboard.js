import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import { STORAGE_KEYS } from './../../services/api.js';
import api from './../../services/api.js';

const AVATAR_PALETTE = [
    '#4361ee','#7209b7','#f72585','#4cc9f0',
    '#06d6a0','#fb8500','#ef476f','#3a0ca3',
];

function avatarColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getAdminUser() {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        if (!token) return {};
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}') || {};
    } catch { return {}; }
}

const STAT_CARDS = [
    {
        key: 'total_users',
        label: 'TOTAL USERS',
        icon: 'fa-users',
        bg: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
        shadow: 'rgba(67,97,238,0.30)',
        sub: 'All registered accounts',
    },
    {
        key: 'new_today',
        label: 'NEW TODAY',
        icon: 'fa-user-plus',
        bg: 'linear-gradient(135deg, #06d6a0 0%, #028a5b 100%)',
        shadow: 'rgba(6,214,160,0.30)',
        sub: 'Registered in last 24h',
    },
    {
        key: 'new_this_month',
        label: 'THIS MONTH',
        icon: 'fa-calendar-check',
        bg: 'linear-gradient(135deg, #fb8500 0%, #d4620f 100%)',
        shadow: 'rgba(251,133,0,0.30)',
        sub: `${new Date().toLocaleString('default', { month: 'long' })} signups`,
    },
    {
        key: 'total_deleted_users',
        label: 'TRASHED USERS',
        icon: 'fa-trash',
        bg: 'linear-gradient(135deg, #ef476f 0%, #b91543 100%)',
        shadow: 'rgba(239,71,111,0.30)',
        sub: 'Soft-deleted accounts',
    },
];

function SkeletonRows() {
    return (
        <div className="p-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-secondary opacity-25 flex-shrink-0"
                        style={{ width: '36px', height: '36px' }} />
                    <div className="flex-grow-1">
                        <div className="bg-secondary opacity-25 rounded mb-1" style={{ height: '11px', width: `${100 + i * 15}px` }} />
                        <div className="bg-secondary opacity-10 rounded" style={{ height: '9px', width: `${160 + i * 10}px` }} />
                    </div>
                    <div className="bg-secondary opacity-25 rounded" style={{ height: '11px', width: '70px' }} />
                    <div className="bg-secondary opacity-10 rounded" style={{ height: '28px', width: '80px' }} />
                </div>
            ))}
        </div>
    );
}

function AdminDashboard() {
    const context   = useContext(AppSettings);
    const adminUser = getAdminUser();

    const [stats, setStats] = useState({
        total_users: 0, new_today: 0, new_this_month: 0, total_deleted_users: 0,
    });
    const [users, setUsers]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast]           = useState(null);
    const [sortField, setSortField]   = useState('created_at');
    const [sortDir, setSortDir]       = useState('desc');

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchDashboard();
        fetchUsers();
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data.stats);
        } catch (err) {
            console.error('Dashboard error:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (err) {
            console.error('Users error:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleDelete = async () => {
        if (!confirmModal) return;
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setDeletingId(id);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            setStats(prev => ({
                ...prev,
                total_users:         prev.total_users - 1,
                total_deleted_users: prev.total_deleted_users + 1,
            }));
            showToast(`"${username}" moved to trash.`, 'success');
        } catch {
            showToast('Failed to delete user. Please try again.', 'danger');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return <i className="fa fa-sort ms-1 opacity-25" />;
        return <i className={`fa fa-sort-${sortDir === 'asc' ? 'up' : 'down'} ms-1 text-primary`} />;
    };

    const filteredUsers = users
        .filter(u =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            let va = a[sortField] || '';
            let vb = b[sortField] || '';
            if (sortField === 'created_at') { va = new Date(va); vb = new Date(vb); }
            else { va = va.toLowerCase(); vb = vb.toLowerCase(); }
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div>
            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '72px', right: '20px',
                    zIndex: 9999, minWidth: '320px',
                }}>
                    <div className={`alert mb-0 d-flex align-items-center border-0 shadow-lg ${toast.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                        style={{
                            borderRadius: '12px',
                            borderLeft: `4px solid ${toast.type === 'success' ? '#00d96f' : '#ff4757'}`,
                        }}>
                        <i className={`fa ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2 fa-lg`}></i>
                        <span className="fw-semibold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* ── Confirm Modal ── */}
            {confirmModal && (
                <div className="modal fade show d-block"
                    style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(3px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px' }}>
                                        <i className="fa fa-trash text-danger fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">Move to Trash</h5>
                                        <small className="text-muted">Reversible — restore from User Management</small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body px-4">
                                <div className="d-flex align-items-center p-3 rounded-3 mt-1 border"
                                    style={{ background: '#f8f9fa' }}>
                                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold me-3"
                                        style={{ width: '44px', height: '44px', minWidth: '44px', background: avatarColor(confirmModal.username), fontSize: '17px' }}>
                                        {confirmModal.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-semibold">{confirmModal.username}</div>
                                        <small className="text-muted">{confirmModal.email}</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 mt-3 p-2 rounded-2 bg-warning bg-opacity-10 border border-warning border-opacity-25">
                                    <i className="fa fa-info-circle text-warning flex-shrink-0"></i>
                                    <small className="text-warning fw-semibold">Their data will be preserved and can be restored.</small>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0 px-4 pb-4 gap-2">
                                <button className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setConfirmModal(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger rounded-3 px-4" onClick={handleDelete}>
                                    <i className="fa fa-trash me-2"></i>Move to Trash
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Page Header ── */}
            <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
                <div>
                    <ol className="breadcrumb mb-1 small">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <h1 className="page-header mb-0">
                        Welcome back,{' '}
                        <span className="text-primary">{adminUser?.username || 'Admin'}</span>
                    </h1>
                    <p className="text-muted mb-0 small">{today}</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/users/analytics" className="btn btn-outline-primary btn-sm rounded-3 px-3">
                        <i className="fa fa-chart-line me-2"></i>View Analytics
                    </Link>
                    <Link to="/admin/users" className="btn btn-primary btn-sm rounded-3 px-3">
                        <i className="fa fa-users me-2"></i>Manage Users
                    </Link>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="row g-3 mb-4">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="col-xl-3 col-md-6">
                        <div className="rounded-4 text-white p-4 h-100 d-flex flex-column"
                            style={{ background: card.bg, boxShadow: `0 8px 24px ${card.shadow}` }}>
                            <div className="d-flex align-items-start justify-content-between mb-3">
                                <div>
                                    <div className="small fw-semibold text-uppercase mb-1 opacity-75"
                                        style={{ letterSpacing: '0.06em' }}>{card.label}</div>
                                    <div className="fw-bold lh-1" style={{ fontSize: '2.4rem' }}>
                                        {stats[card.key]}
                                    </div>
                                </div>
                                <div className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
                                    style={{ width: '48px', height: '48px', fontSize: '20px' }}>
                                    <i className={`fa ${card.icon}`}></i>
                                </div>
                            </div>
                            <div className="mt-auto d-flex align-items-center justify-content-between">
                                <small className="opacity-75">{card.sub}</small>
                                <Link to="/admin/users" className="text-white opacity-75 small text-decoration-none">
                                    Details <i className="fa fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Registered Users Table ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="panel panel-inverse">
                        <div className="panel-heading d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <h4 className="panel-title mb-0">Registered Users</h4>
                                {!loading && (
                                    <span className="badge bg-primary rounded-pill">{filteredUsers.length}</span>
                                )}
                            </div>
                            <div className="input-group input-group-sm" style={{ width: '280px' }}>
                                <span className="input-group-text bg-transparent">
                                    <i className="fa fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search username or email..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className="btn btn-outline-secondary" type="button"
                                        onClick={() => setSearch('')}>
                                        <i className="fa fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="panel-body p-0">
                            {loading ? (
                                <SkeletonRows />
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <div className="mb-3 opacity-25" style={{ fontSize: '52px' }}>
                                        <i className="fa fa-users"></i>
                                    </div>
                                    <div className="fw-semibold fs-6">
                                        {search ? `No results for "${search}"` : 'No users registered yet'}
                                    </div>
                                    {search && (
                                        <button className="btn btn-sm btn-outline-secondary mt-2 rounded-3"
                                            onClick={() => setSearch('')}>
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="border-bottom" style={{ background: 'rgba(0,0,0,0.025)' }}>
                                            <tr>
                                                <th className="ps-4 py-3 fw-semibold text-muted small border-0" width="50">#</th>
                                                <th className="py-3 fw-semibold text-muted small border-0"
                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('username')}>
                                                    User {sortIcon('username')}
                                                </th>
                                                <th className="py-3 fw-semibold text-muted small border-0"
                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('email')}>
                                                    Email {sortIcon('email')}
                                                </th>
                                                <th className="py-3 fw-semibold text-muted small border-0"
                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('created_at')}>
                                                    Joined {sortIcon('created_at')}
                                                </th>
                                                <th className="py-3 fw-semibold text-muted small border-0 text-end pe-4" width="110">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user, index) => (
                                                <tr key={user.id} style={{
                                                    opacity: deletingId === user.id ? 0.4 : 1,
                                                    transition: 'opacity 0.3s ease',
                                                }}>
                                                    <td className="ps-4 text-muted small">{index + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                                style={{ width: '36px', height: '36px', background: avatarColor(user.username), fontSize: '14px' }}>
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="fw-semibold">{user.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small">{user.email}</td>
                                                    <td>
                                                        <span className="text-muted small d-block">{timeAgo(user.created_at)}</span>
                                                        <span className="text-muted" style={{ fontSize: '11px', opacity: 0.6 }}>
                                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        {deletingId === user.id ? (
                                                            <button className="btn btn-danger btn-sm rounded-3" disabled>
                                                                <span className="spinner-border spinner-border-sm me-1" />
                                                                Deleting
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm rounded-3 px-3"
                                                                onClick={() => setConfirmModal(user)}
                                                                title="Delete user"
                                                            >
                                                                <i className="fa fa-trash me-1"></i>Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {!loading && filteredUsers.length > 0 && (
                            <div className="panel-footer d-flex align-items-center justify-content-between px-4 py-2 border-top bg-transparent">
                                <small className="text-muted">
                                    Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
                                </small>
                                <Link to="/admin/users" className="btn btn-sm btn-link text-decoration-none pe-0">
                                    Full user list <i className="fa fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
