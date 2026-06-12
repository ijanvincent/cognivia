import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import {
    PageHeader, Avatar, UserCell, PresenceDot, EmptyState, TableSkeleton,
    timeAgo, fmtDate,
} from './components/admin-ui.jsx';

const MODAL_CONFIG = {
    delete: {
        title:        'Move to Trash',
        iconClass:    'fa-trash-can',
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
        iconClass:    'fa-rotate-left',
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
        iconClass:    'fa-triangle-exclamation',
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
        // eslint-disable-next-line
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
            setSortDir(field === 'created_at' || field === 'last_active_at' ? 'desc' : 'asc');
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return <i className="fa-solid fa-sort ms-1 opacity-25" />;
        return <i className={`fa-solid fa-sort-${sortDir === 'asc' ? 'up' : 'down'} ms-1 text-theme`} />;
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setSearch('');
        setCurrentPage(1);
        setSortField('created_at');
        setSortDir('desc');
    };

    const sourceList = activeTab === 'active' ? activeUsers : trashedUsers;
    const dateField  = activeTab === 'active' ? 'created_at' : 'deleted_at';

    const filtered = sourceList
        .filter(u =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const field = sortField === 'created_at' ? dateField : sortField;
            let va = a[field];
            let vb = b[field];
            if (field === dateField || field === 'last_active_at') {
                va = va ? new Date(va).getTime() : 0;
                vb = vb ? new Date(vb).getTime() : 0;
            } else if (typeof va === 'string') {
                va = va.toLowerCase(); vb = (vb || '').toLowerCase();
            } else {
                va = va || 0; vb = vb || 0;
            }
            if (va === vb) return 0;
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });

    const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
    const paginated  = filtered.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const modal = confirmModal ? MODAL_CONFIG[confirmModal.action] : null;

    const exportCSV = () => {
        const rows = [['#', 'Username', 'Email', 'Decks', 'Cards', 'Last Active', activeTab === 'active' ? 'Registered' : 'Deleted']];
        filtered.forEach((u, i) => {
            const dateVal = activeTab === 'active' ? u.created_at : u.deleted_at;
            rows.push([
                i + 1,
                u.username,
                u.email,
                u.decks_count ?? 0,
                u.flashcards_count ?? 0,
                u.last_active_at ? fmtDate(u.last_active_at) : 'Never',
                fmtDate(dateVal),
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
            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', top: 72, right: 20, zIndex: 9999, minWidth: 320 }}>
                    <div className={`alert mb-0 d-flex align-items-center shadow ${toast.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2`}></i>
                        <span className="fw-semibold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Confirm modal */}
            {confirmModal && modal && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9998 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`rounded-3 ${modal.iconBg} d-flex align-items-center justify-content-center`}
                                        style={{ width: 44, height: 44 }}>
                                        <i className={`fa-solid ${modal.iconClass} ${modal.iconColor}`}></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">{modal.title}</h5>
                                        <small className="text-muted">User: {confirmModal.username}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body px-4">
                                <p className="text-muted mb-3">{modal.body}</p>
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 border bg-light">
                                    <Avatar name={confirmModal.username} size={40} muted={activeTab === 'trashed'} />
                                    <div>
                                        <div className="fw-semibold">{confirmModal.username}</div>
                                        <small className="text-muted">{confirmModal.email}</small>
                                    </div>
                                </div>
                                <div className={`d-flex align-items-center gap-2 mt-3 p-2 rounded-2 border ${modal.warningClass}`}>
                                    <i className={`fa-solid fa-circle-info ${modal.warningIcon} flex-shrink-0`}></i>
                                    <small className={`${modal.warningIcon} fw-semibold`}>{modal.warningText}</small>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0 px-4 pb-4 gap-2">
                                <button className="btn btn-default" onClick={() => setConfirmModal(null)}>
                                    Cancel
                                </button>
                                <button className={`btn ${modal.confirmClass}`} onClick={handleConfirm}>
                                    <i className={`fa-solid ${modal.iconClass} me-2`}></i>
                                    {modal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <PageHeader
                crumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Users' }]}
                title="Users"
                subtitle={
                    <>
                        <span className="me-3">
                            <strong className="text-body">{activeUsers.length}</strong> active
                        </span>
                        {trashedUsers.length > 0 && (
                            <span><strong className="text-body">{trashedUsers.length}</strong> in trash</span>
                        )}
                    </>
                }
            >
                <Link to="/admin/activity" className="btn btn-default btn-sm">
                    <i className="fa-solid fa-wave-square me-2"></i>Activity
                </Link>
                <Link to="/admin/users/analytics" className="btn btn-default btn-sm">
                    <i className="fa-solid fa-chart-line me-2"></i>Analytics
                </Link>
            </PageHeader>

            <Panel className="mb-0">
                <PanelBody className="p-0">
                    {/* Tabs + controls */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 py-2 border-bottom">
                        <div className="d-flex align-items-center gap-1">
                            <button type="button"
                                className={`btn btn-sm ${activeTab === 'active' ? 'btn-theme' : 'btn-default'}`}
                                onClick={() => switchTab('active')}>
                                All users
                                <span className="badge bg-dark bg-opacity-25 ms-2">{activeUsers.length}</span>
                            </button>
                            <button type="button"
                                className={`btn btn-sm ${activeTab === 'trashed' ? 'btn-danger' : 'btn-default'}`}
                                onClick={() => switchTab('trashed')}>
                                Trash
                                {trashedUsers.length > 0 && (
                                    <span className="badge bg-dark bg-opacity-25 ms-2">{trashedUsers.length}</span>
                                )}
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <div className="input-group input-group-sm" style={{ width: 260 }}>
                                <span className="input-group-text">
                                    <i className="fa-solid fa-magnifying-glass text-muted"></i>
                                </span>
                                <input type="text" className="form-control"
                                    placeholder="Search username or email…"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
                                {search && (
                                    <button className="btn btn-default" type="button"
                                        onClick={() => { setSearch(''); setCurrentPage(1); }}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                            {!loading && filtered.length > 0 && (
                                <button className="btn btn-default btn-sm" onClick={exportCSV} title="Export to CSV">
                                    <i className="fa-solid fa-download me-1"></i>CSV
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    {!loading && filtered.length === 0 ? (
                        <EmptyState
                            icon={activeTab === 'trashed' ? 'fa-trash-can' : 'fa-users'}
                            title={search ? `No results for “${search}”`
                                : activeTab === 'trashed' ? 'Trash is empty' : 'No users registered yet'}
                        >
                            {search && (
                                <button className="btn btn-sm btn-default"
                                    onClick={() => { setSearch(''); setCurrentPage(1); }}>
                                    Clear search
                                </button>
                            )}
                        </EmptyState>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th className="ps-4 small text-muted fw-semibold" style={{ width: 44 }}>#</th>
                                            <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                                onClick={() => handleSort('username')}>
                                                User {sortIcon('username')}
                                            </th>
                                            <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                                onClick={() => handleSort('decks_count')}>
                                                Decks {sortIcon('decks_count')}
                                            </th>
                                            <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                                onClick={() => handleSort('flashcards_count')}>
                                                Cards {sortIcon('flashcards_count')}
                                            </th>
                                            {activeTab === 'active' && (
                                                <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('last_active_at')}>
                                                    Last active {sortIcon('last_active_at')}
                                                </th>
                                            )}
                                            <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                                onClick={() => handleSort('created_at')}>
                                                {activeTab === 'trashed' ? 'Deleted' : 'Joined'} {sortIcon('created_at')}
                                            </th>
                                            <th className="small text-muted fw-semibold text-end pe-4" style={{ width: 190 }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    {loading ? (
                                        <TableSkeleton rows={8} cols={activeTab === 'active' ? 7 : 6} />
                                    ) : (
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
                                                        <UserCell user={user} deleted={activeTab === 'trashed'} link={activeTab === 'active'} />
                                                    </td>
                                                    <td style={{ fontSize: '13px' }}>{user.decks_count ?? 0}</td>
                                                    <td style={{ fontSize: '13px' }}>{user.flashcards_count ?? 0}</td>
                                                    {activeTab === 'active' && (
                                                        <td><PresenceDot lastActive={user.last_active_at} /></td>
                                                    )}
                                                    <td>
                                                        <span className="d-block" style={{ fontSize: '12px' }}>
                                                            {timeAgo(activeTab === 'trashed' ? user.deleted_at : user.created_at)}
                                                        </span>
                                                        <span className="text-muted" style={{ fontSize: '11px' }}>
                                                            {fmtDate(activeTab === 'trashed' ? user.deleted_at : user.created_at)}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        {actionId === user.id ? (
                                                            <button className="btn btn-default btn-sm" disabled>
                                                                <span className="spinner-border spinner-border-sm me-1" />
                                                                Processing
                                                            </button>
                                                        ) : activeTab === 'active' ? (
                                                            <div className="d-inline-flex gap-1">
                                                                <Link to={`/admin/users/${user.id}`}
                                                                    className="btn btn-default btn-sm" title="View profile & activity">
                                                                    <i className="fa-solid fa-eye me-1"></i>View
                                                                </Link>
                                                                <button className="btn btn-default btn-sm text-danger"
                                                                    onClick={() => confirmDelete(user)} title="Move to trash">
                                                                    <i className="fa-solid fa-trash-can"></i>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="d-inline-flex gap-1">
                                                                <button className="btn btn-default btn-sm"
                                                                    onClick={() => confirmRestore(user)} title="Restore user">
                                                                    <i className="fa-solid fa-rotate-left me-1"></i>Restore
                                                                </button>
                                                                <button className="btn btn-default btn-sm text-danger"
                                                                    onClick={() => confirmForceDelete(user)} title="Permanently delete">
                                                                    <i className="fa-solid fa-xmark"></i>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>
                            </div>

                            {/* Pagination */}
                            {!loading && (totalPages > 1 || filtered.length > 0) && (
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
                                                <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>
                                                    <i className="fa-solid fa-chevron-left"></i>
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
                                                        <button className="page-link" onClick={() => setCurrentPage(page)}>
                                                            {page}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default AdminUsers;
