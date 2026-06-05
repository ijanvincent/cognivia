import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

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
    const usersPerPage = 10;

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
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Soft delete ──────────────────────────────────────────────────────────
    const confirmDelete = (user) => {
        setConfirmModal({ ...user, action: 'delete' });
    };

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
        } catch (error) {
            showToast('Failed to delete user. Please try again.', 'danger');
        } finally {
            setActionId(null);
        }
    };

    // ── Restore ──────────────────────────────────────────────────────────────
    const confirmRestore = (user) => {
        setConfirmModal({ ...user, action: 'restore' });
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
        } catch (error) {
            showToast('Failed to restore user. Please try again.', 'danger');
        } finally {
            setActionId(null);
        }
    };

    // ── Force delete ─────────────────────────────────────────────────────────
    const confirmForceDelete = (user) => {
        setConfirmModal({ ...user, action: 'force' });
    };

    const handleForceDelete = async () => {
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setActionId(id);
        try {
            await api.delete(`/admin/users/${id}/force`);
            setTrashedUsers(prev => prev.filter(u => u.id !== id));
            showToast(`"${username}" permanently deleted.`, 'success');
        } catch (error) {
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

    // ── Filter + paginate ────────────────────────────────────────────────────
    const users = activeTab === 'active' ? activeUsers : trashedUsers;

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / usersPerPage);
    const paginated  = filtered.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const switchTab = (tab) => {
        setActiveTab(tab);
        setSearch('');
        setCurrentPage(1);
    };

    // ── Modal config ─────────────────────────────────────────────────────────
    const modalConfig = {
        delete: {
            title:       'Move to Trash',
            icon:        'fa-trash text-danger',
            body:        'You are about to delete this user. They can be restored later.',
            warning:     'Their data will be preserved.',
            warningClass:'text-warning',
            confirmText: 'Move to Trash',
            confirmClass:'btn-danger',
        },
        restore: {
            title:       'Restore User',
            icon:        'fa-undo text-success',
            body:        'You are about to restore this user.',
            warning:     'They will regain access to their account.',
            warningClass:'text-success',
            confirmText: 'Restore',
            confirmClass:'btn-success',
        },
        force: {
            title:       'Permanently Delete',
            icon:        'fa-exclamation-triangle text-danger',
            body:        'You are about to permanently delete this user.',
            warning:     'This cannot be undone. All data will be lost forever.',
            warningClass:'text-danger',
            confirmText: 'Delete Forever',
            confirmClass:'btn-danger',
        },
    };

    const modal = confirmModal ? modalConfig[confirmModal.action] : null;

    return (
        <div>

            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '70px', right: '20px',
                    zIndex: 9999, minWidth: '300px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    borderRadius: '8px', overflow: 'hidden'
                }}>
                    <div className={`alert alert-${toast.type} mb-0 d-flex align-items-center`}>
                        <i className={`fa ${toast.type === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger'} me-2 fa-lg`}></i>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* ── Confirm modal ── */}
            {confirmModal && modal && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9998 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className={`fa ${modal.icon} me-2`}></i>
                                    {modal.title}
                                </h5>
                            </div>
                            <div className="modal-body">
                                <p className="mb-1">{modal.body}</p>
                                <div className="d-flex align-items-center p-3 bg-light rounded mt-2">
                                    <div
                                        className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold me-3"
                                        style={{ width: '42px', height: '42px', minWidth: '42px', background: '#2196f3', fontSize: '16px' }}
                                    >
                                        {confirmModal.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-bold">{confirmModal.username}</div>
                                        <small className="text-muted">{confirmModal.email}</small>
                                    </div>
                                </div>
                                <p className={`mt-3 mb-0 ${modal.warningClass}`}>
                                    <i className="fa fa-info-circle me-1"></i>
                                    {modal.warning}
                                </p>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setConfirmModal(null)}
                                >
                                    <i className="fa fa-times me-1"></i>Cancel
                                </button>
                                <button
                                    className={`btn ${modal.confirmClass}`}
                                    onClick={handleConfirm}
                                >
                                    <i className={`fa ${modal.icon.split(' ')[0]} me-1`}></i>
                                    {modal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Breadcrumb + header ── */}
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                <li className="breadcrumb-item active">User Management</li>
            </ol>
            <h1 className="page-header">
                User Management <small>all registered users</small>
            </h1>

            {/* ── Panel ── */}
            <div className="panel panel-inverse">
                <div className="panel-heading d-flex align-items-center justify-content-between flex-wrap gap-2">

                    {/* Tabs */}
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => switchTab('active')}
                        >
                            <i className="fa fa-users me-1"></i>
                            All Users
                            <span className={`badge ms-2 ${activeTab === 'active' ? 'bg-white text-primary' : 'bg-secondary'}`}>
                                {activeUsers.length}
                            </span>
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'trashed' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => switchTab('trashed')}
                        >
                            <i className="fa fa-trash me-1"></i>
                            Trash
                            {trashedUsers.length > 0 && (
                                <span className={`badge ms-2 ${activeTab === 'trashed' ? 'bg-white text-danger' : 'bg-danger'}`}>
                                    {trashedUsers.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="input-group input-group-sm" style={{ width: '280px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search username or email..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                        <button className="btn btn-primary" type="button">
                            <i className="fa fa-search"></i>
                        </button>
                        {search && (
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => { setSearch(''); setCurrentPage(1); }}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="panel-body">
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            <i className={`fa ${activeTab === 'trashed' ? 'fa-trash' : 'fa-users'} fa-3x mb-3 d-block`}></i>
                            {search
                                ? `No users found for "${search}"`
                                : activeTab === 'trashed'
                                    ? 'Trash is empty'
                                    : 'No users registered yet'
                            }
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover table-striped mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th width="50">#</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>{activeTab === 'trashed' ? 'Deleted' : 'Registered'}</th>
                                            <th width="180">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((user, index) => (
                                            <tr
                                                key={user.id}
                                                style={{
                                                    opacity: actionId === user.id ? 0.4 : 1,
                                                    transition: 'opacity 0.3s ease'
                                                }}
                                            >
                                                <td className="text-muted fw-bold">
                                                    {(currentPage - 1) * usersPerPage + index + 1}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="rounded-circle text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                                                            style={{
                                                                width: '36px', height: '36px', minWidth: '36px',
                                                                background: activeTab === 'trashed' ? '#9e9e9e' : '#2196f3',
                                                                fontSize: '14px'
                                                            }}
                                                        >
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={`fw-bold ${activeTab === 'trashed' ? 'text-muted' : ''}`}>
                                                            {user.username}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-muted">{user.email}</td>
                                                <td className="text-muted">
                                                    {new Date(
                                                        activeTab === 'trashed' ? user.deleted_at : user.created_at
                                                    ).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    {actionId === user.id ? (
                                                        <button className="btn btn-secondary btn-sm" disabled>
                                                            <span className="spinner-border spinner-border-sm me-1" role="status" />
                                                            Processing...
                                                        </button>
                                                    ) : activeTab === 'active' ? (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => confirmDelete(user)}
                                                        >
                                                            <i className="fa fa-trash me-1"></i>Delete
                                                        </button>
                                                    ) : (
                                                        <div className="d-flex gap-1">
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => confirmRestore(user)}
                                                                title="Restore user"
                                                            >
                                                                <i className="fa fa-undo me-1"></i>Restore
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => confirmForceDelete(user)}
                                                                title="Delete forever"
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

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted">
                                        Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filtered.length)} of {filtered.length} users
                                    </small>
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>
                                                <i className="fa fa-chevron-left"></i>
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>
                                                <i className="fa fa-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
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