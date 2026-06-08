import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
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

const MODAL_CONFIG = {
    delete: {
        title:        'Move to Trash',
        iconClass:    'fa-trash',
        iconBg:       'bg-danger bg-opacity-10',
        iconColor:    'text-danger',
        body:         'This user will be soft-deleted and can be restored later.',
        warningText:  'All their data is preserved. You can restore from the Trash tab.',
        warningClass: 'bg-warning bg-opacity-10 border-warning border-opacity-25',
        warningIcon:  'text-warning',
        confirmText:  'Move to Trash',
        confirmClass: 'btn-danger',
    },
    restore: {
        title:        'Restore User',
        iconClass:    'fa-undo',
        iconBg:       'bg-success bg-opacity-10',
        iconColor:    'text-success',
        body:         'This user will be restored and regain access to their account.',
        warningText:  'Their data and history will be fully reinstated.',
        warningClass: 'bg-success bg-opacity-10 border-success border-opacity-25',
        warningIcon:  'text-success',
        confirmText:  'Restore User',
        confirmClass: 'btn-success',
    },
    force: {
        title:        'Permanently Delete',
        iconClass:    'fa-exclamation-triangle',
        iconBg:       'bg-danger bg-opacity-10',
        iconColor:    'text-danger',
        body:         'This user will be permanently removed from the system.',
        warningText:  'This cannot be undone. All associated data will be lost forever.',
        warningClass: 'bg-danger bg-opacity-10 border-danger border-opacity-25',
        warningIcon:  'text-danger',
        confirmText:  'Delete Forever',
        confirmClass: 'btn-danger',
    },
};

const USERS_PER_PAGE = 10;

function SkeletonRows({ count = 8 }) {
    return (
        <div className="p-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-secondary opacity-25 flex-shrink-0"
                        style={{ width: '36px', height: '36px' }} />
                    <div className="flex-grow-1">
                        <div className="bg-secondary opacity-25 rounded mb-1"
                            style={{ height: '11px', width: `${100 + i * 12}px` }} />
                        <div className="bg-secondary opacity-10 rounded"
                            style={{ height: '9px', width: `${160 + i * 8}px` }} />
                    </div>
                    <div className="bg-secondary opacity-10 rounded"
                        style={{ height: '11px', width: '80px' }} />
                    <div className="bg-secondary opacity-10 rounded"
                        style={{ height: '30px', width: '100px' }} />
                </div>
            ))}
        </div>
    );
}

function AdminUsers() {
    const context = useContext(AppSettings);

    const [activeUsers, setActiveUsers]   = useState([]);
    const [trashedUsers, setTrashedUsers] = useState([]);
    const [activeTab, setActiveTab]       = useState('active');
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState('');
    const [currentPage, setCurrentPage]   = useState(1);
    const [actionId, setActionId]         = useState(null);
    const [toast, setToast]               = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [sortField, setSortField]       = useState('created_at');
    const [sortDir, setSortDir]           = useState('desc');

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchAll();
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [activeRes, trashedRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/users/trashed'),
            ]);
            setActiveUsers(activeRes.data.users);
            setTrashedUsers(trashedRes.data.users);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const confirmDelete = (user)      => setConfirmModal({ ...user, action: 'delete' });
    const confirmRestore = (user)     => setConfirmModal({ ...user, action: 'restore' });
    const confirmForceDelete = (user) => setConfirmModal({ ...user, action: 'force' });

    const handleDelete = async () => {
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setActionId(id);
        try {
            await api.delete(`/admin/users/${id}`);
            const deleted = activeUsers.find(u => u.id === id);
            setActiveUsers(prev => prev.filter(u => u.id !== id));
            setTrashedUsers(prev => [{ ...deleted, deleted_at: new Date().toISOString() }, ...prev]);
            showToast(`"${username}" moved to trash.`, 'success');
        } catch {
            showToast('Failed to delete user. Please try again.', 'danger');
        } finally {
            setActionId(null);
        }
    };

    const handleRestore = async () => {
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setActionId(id);
        try {
            await api.post(`/admin/users/${id}/restore`);
            const restored = trashedUsers.find(u => u.id === id);
            setTrashedUsers(prev => prev.filter(u => u.id !== id));
            setActiveUsers(prev => [{ ...restored, deleted_at: null }, ...prev]);
            showToast(`"${username}" restored successfully.`, 'success');
        } catch {
            showToast('Failed to restore user. Please try again.', 'danger');
        } finally {
            setActionId(null);
        }
    };

    const handleForceDelete = async () => {
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setActionId(id);
        try {
            await api.delete(`/admin/users/${id}/force`);
            setTrashedUsers(prev => prev.filter(u => u.id !== id));
            showToast(`"${username}" permanently deleted.`, 'success');
        } catch {
            showToast('Failed to permanently delete user.', 'danger');
        } finally {
            setActionId(null);
        }
    };

    const handleConfirm = () => {
        if (!confirmModal) return;
        if (confirmModal.action === 'delete')  handleDelete();
        if (confirmModal.action === 'restore') handleRestore();
        if (confirmModal.action === 'force')   handleForceDelete();
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

    const switchTab = (tab) => {
        setActiveTab(tab);
        setSearch('');
        setCurrentPage(1);
        setSortField('created_at');
        setSortDir('desc');
    };

    const sourceList  = activeTab === 'active' ? activeUsers : trashedUsers;
    const dateField   = activeTab === 'active' ? 'created_at' : 'deleted_at';

    const filtered = sourceList
        .filter(u =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const field = sortField === 'created_at' ? dateField : sortField;
            let va = a[field] || '';
            let vb = b[field] || '';
            if (field === dateField) { va = new Date(va); vb = new Date(vb); }
            else { va = va.toLowerCase(); vb = vb.toLowerCase(); }
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });

    const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
    const paginated  = filtered.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const modal = confirmModal ? MODAL_CONFIG[confirmModal.action] : null;

    const exportCSV = () => {
        const rows = [['#', 'Username', 'Email', activeTab === 'active' ? 'Registered' : 'Deleted']];
        filtered.forEach((u, i) => {
            const dateVal = activeTab === 'active' ? u.created_at : u.deleted_at;
            rows.push([
                i + 1,
                u.username,
                u.email,
                new Date(dateVal).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            ]);
        });
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `cognivia-${activeTab}-users.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
            {confirmModal && modal && (
                <div className="modal fade show d-block"
                    style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(3px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`rounded-3 ${modal.iconBg} d-flex align-items-center justify-content-center`}
                                        style={{ width: '48px', height: '48px' }}>
                                        <i className={`fa ${modal.iconClass} ${modal.iconColor} fa-lg`}></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">{modal.title}</h5>
                                        <small className="text-muted">User: {confirmModal.username}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body px-4">
                                <p className="text-muted mb-3">{modal.body}</p>
                                <div className="d-flex align-items-center p-3 rounded-3 border"
                                    style={{ background: '#f8f9fa' }}>
                                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold me-3"
                                        style={{
                                            width: '44px', height: '44px', minWidth: '44px',
                                            background: activeTab === 'trashed' ? '#9e9e9e' : avatarColor(confirmModal.username),
                                            fontSize: '17px',
                                        }}>
                                        {confirmModal.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-semibold">{confirmModal.username}</div>
                                        <small className="text-muted">{confirmModal.email}</small>
                                    </div>
                                </div>
                                <div className={`d-flex align-items-center gap-2 mt-3 p-2 rounded-2 border ${modal.warningClass}`}>
                                    <i className={`fa fa-info-circle ${modal.warningIcon} flex-shrink-0`}></i>
                                    <small className={`${modal.warningIcon} fw-semibold`}>{modal.warningText}</small>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0 px-4 pb-4 gap-2">
                                <button className="btn btn-outline-secondary rounded-3 px-4"
                                    onClick={() => setConfirmModal(null)}>
                                    Cancel
                                </button>
                                <button className={`btn ${modal.confirmClass} rounded-3 px-4`} onClick={handleConfirm}>
                                    <i className={`fa ${modal.iconClass} me-2`}></i>
                                    {modal.confirmText}
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
                        <li className="breadcrumb-item active">User Management</li>
                    </ol>
                    <h1 className="page-header mb-0">User Management</h1>
                    <p className="text-muted mb-0 small">
                        <span className="me-3">
                            <i className="fa fa-users me-1 text-primary"></i>
                            <strong>{activeUsers.length}</strong> active
                        </span>
                        {trashedUsers.length > 0 && (
                            <span>
                                <i className="fa fa-trash me-1 text-danger"></i>
                                <strong>{trashedUsers.length}</strong> in trash
                            </span>
                        )}
                    </p>
                </div>
                <Link to="/admin/users/analytics" className="btn btn-outline-primary btn-sm rounded-3 px-3">
                    <i className="fa fa-chart-bar me-2"></i>User Analytics
                </Link>
            </div>

            {/* ── Main Panel ── */}
            <div className="panel panel-inverse">
                {/* Panel Header — Tabs + Controls */}
                <div className="panel-heading">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        {/* Tabs */}
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className={`btn btn-sm rounded-3 px-3 ${activeTab === 'active' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => switchTab('active')}
                            >
                                <i className="fa fa-users me-2"></i>
                                All Users
                                <span className={`badge ms-2 rounded-pill ${activeTab === 'active' ? 'bg-white text-primary' : 'bg-secondary'}`}>
                                    {activeUsers.length}
                                </span>
                            </button>
                            <button
                                className={`btn btn-sm rounded-3 px-3 ${activeTab === 'trashed' ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => switchTab('trashed')}
                            >
                                <i className="fa fa-trash me-2"></i>
                                Trash
                                {trashedUsers.length > 0 && (
                                    <span className={`badge ms-2 rounded-pill ${activeTab === 'trashed' ? 'bg-white text-danger' : 'bg-danger'}`}>
                                        {trashedUsers.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Search + Export */}
                        <div className="d-flex align-items-center gap-2">
                            <div className="input-group input-group-sm" style={{ width: '260px' }}>
                                <span className="input-group-text bg-transparent">
                                    <i className="fa fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search username or email..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                />
                                {search && (
                                    <button className="btn btn-outline-secondary" type="button"
                                        onClick={() => { setSearch(''); setCurrentPage(1); }}>
                                        <i className="fa fa-times"></i>
                                    </button>
                                )}
                            </div>
                            {!loading && filtered.length > 0 && (
                                <button className="btn btn-outline-secondary btn-sm rounded-3 px-3"
                                    onClick={exportCSV} title="Export to CSV">
                                    <i className="fa fa-download me-1"></i>CSV
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel Body */}
                <div className="panel-body p-0">
                    {loading ? (
                        <SkeletonRows count={8} />
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <div className="mb-3 opacity-25" style={{ fontSize: '52px' }}>
                                <i className={`fa ${activeTab === 'trashed' ? 'fa-trash' : 'fa-users'}`}></i>
                            </div>
                            <div className="fw-semibold fs-6">
                                {search
                                    ? `No results for "${search}"`
                                    : activeTab === 'trashed'
                                        ? 'Trash is empty'
                                        : 'No users registered yet'
                                }
                            </div>
                            {search && (
                                <button className="btn btn-sm btn-outline-secondary mt-2 rounded-3"
                                    onClick={() => { setSearch(''); setCurrentPage(1); }}>
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
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
                                                {activeTab === 'trashed' ? 'Deleted' : 'Joined'} {sortIcon('created_at')}
                                            </th>
                                            <th className="py-3 fw-semibold text-muted small border-0 text-end pe-4" width="180">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((user, index) => (
                                            <tr key={user.id} style={{
                                                opacity: actionId === user.id ? 0.4 : 1,
                                                transition: 'opacity 0.3s ease',
                                            }}>
                                                <td className="ps-4 text-muted small">
                                                    {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                            style={{
                                                                width: '36px', height: '36px',
                                                                background: activeTab === 'trashed' ? '#9e9e9e' : avatarColor(user.username),
                                                                fontSize: '14px',
                                                            }}>
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={`fw-semibold ${activeTab === 'trashed' ? 'text-muted' : ''}`}>
                                                            {user.username}
                                                        </span>
                                                        {activeTab === 'trashed' && (
                                                            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill small">
                                                                deleted
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-muted small">{user.email}</td>
                                                <td>
                                                    <span className="text-muted small d-block">
                                                        {timeAgo(activeTab === 'trashed' ? user.deleted_at : user.created_at)}
                                                    </span>
                                                    <span className="text-muted" style={{ fontSize: '11px', opacity: 0.6 }}>
                                                        {new Date(activeTab === 'trashed' ? user.deleted_at : user.created_at)
                                                            .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    {actionId === user.id ? (
                                                        <button className="btn btn-secondary btn-sm rounded-3 px-3" disabled>
                                                            <span className="spinner-border spinner-border-sm me-1" />
                                                            Processing
                                                        </button>
                                                    ) : activeTab === 'active' ? (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm rounded-3 px-3"
                                                            onClick={() => confirmDelete(user)}
                                                            title="Move to trash"
                                                        >
                                                            <i className="fa fa-trash me-1"></i>Delete
                                                        </button>
                                                    ) : (
                                                        <div className="d-flex justify-content-end gap-1">
                                                            <button
                                                                className="btn btn-outline-success btn-sm rounded-3 px-3"
                                                                onClick={() => confirmRestore(user)}
                                                                title="Restore user"
                                                            >
                                                                <i className="fa fa-undo me-1"></i>Restore
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm rounded-2"
                                                                onClick={() => confirmForceDelete(user)}
                                                                title="Permanently delete"
                                                            >
                                                                <i className="fa fa-times"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer — Pagination */}
                            {(totalPages > 1 || filtered.length > 0) && (
                                <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top">
                                    <small className="text-muted">
                                        Showing{' '}
                                        <strong>{(currentPage - 1) * USERS_PER_PAGE + 1}</strong>–
                                        <strong>{Math.min(currentPage * USERS_PER_PAGE, filtered.length)}</strong>
                                        {' '}of <strong>{filtered.length}</strong> users
                                    </small>
                                    {totalPages > 1 && (
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link rounded-start-2"
                                                    onClick={() => setCurrentPage(p => p - 1)}>
                                                    <i className="fa fa-chevron-left"></i>
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                const nearCurrent = Math.abs(page - currentPage) <= 1;
                                                const isEdge = page === 1 || page === totalPages;
                                                if (!nearCurrent && !isEdge) {
                                                    if (page === 2 || page === totalPages - 1) {
                                                        return (
                                                            <li key={i} className="page-item disabled">
                                                                <span className="page-link border-0 bg-transparent text-muted">…</span>
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                }
                                                return (
                                                    <li key={i} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                        <button className="page-link"
                                                            onClick={() => setCurrentPage(page)}>
                                                            {page}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link rounded-end-2"
                                                    onClick={() => setCurrentPage(p => p + 1)}>
                                                    <i className="fa fa-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;
