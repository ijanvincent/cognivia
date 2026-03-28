import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function AdminUsers() {
    const context = useContext(AppSettings);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const usersPerPage = 10;

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchUsers();
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
        
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };


    const confirmDelete = (user) => {
        setConfirmModal(user);
    };

    const handleDelete = async () => {
        if (!confirmModal) return;
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setDeletingId(id);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            showToast(`User "${username}" deleted successfully.`, 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete user. Please try again.', 'danger');
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / usersPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    return (
        <div>
       
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

       
            {confirmModal && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9998 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa fa-exclamation-triangle text-danger me-2"></i>
                                    Confirm Delete
                                </h5>
                            </div>
                            <div className="modal-body">
                                <p className="mb-1">You are about to delete user:</p>
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
                                <p className="text-danger mt-3 mb-0">
                                    <i className="fa fa-exclamation-circle me-1"></i>
                                    This action cannot be undone!
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
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    <i className="fa fa-trash me-1"></i>Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                <li className="breadcrumb-item active">User Management</li>
            </ol>
            <h1 className="page-header">
                User Management <small>all registered users</small>
            </h1>

       
            <div className="panel panel-inverse">
                <div className="panel-heading d-flex align-items-center justify-content-between">
                    <h4 className="panel-title">
                        All Users
                        <span className="badge bg-primary ms-2">{filtered.length}</span>
                    </h4>
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
                            <i className="fa fa-users fa-3x mb-3 d-block"></i>
                            {search ? `No users found for "${search}"` : 'No users registered yet'}
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
                                            <th>Registered</th>
                                            <th width="130">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((user, index) => (
                                            <tr key={user.id} style={{
                                                opacity: deletingId === user.id ? 0.4 : 1,
                                                transition: 'opacity 0.3s ease'
                                            }}>
                                                <td className="text-muted fw-bold">
                                                    {(currentPage - 1) * usersPerPage + index + 1}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="rounded-circle text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                                                            style={{ width: '36px', height: '36px', minWidth: '36px', background: '#2196f3', fontSize: '14px' }}
                                                        >
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="fw-bold">{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="text-muted">{user.email}</td>
                                                <td className="text-muted">
                                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    {deletingId === user.id ? (
                                                        <button className="btn btn-danger btn-sm" disabled>
                                                            <span className="spinner-border spinner-border-sm me-1" role="status" />
                                                            Deleting...
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => confirmDelete(user)}
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