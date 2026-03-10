import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function AdminUsers() {
    const context = useContext(AppSettings);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
        // eslint-disable-next-line
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Search filter
    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filtered.length / usersPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    return (
        <div>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/admin/users">User Management</Link></li>
                <li className="breadcrumb-item active">All Users</li>
            </ol>
            <h1 className="page-header">
                User Management <small>manage registered users</small>
            </h1>

            <Panel>
                <PanelHeader>
                    All Users
                    <span className="badge bg-primary ms-2">{filtered.length}</span>
                </PanelHeader>
                <PanelBody>
                    {/* Search Bar */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by username or email..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            <i className="fa fa-users fa-3x mb-3 d-block"></i>
                            No users found
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
                                            <th width="120">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((user, index) => (
                                            <tr key={user.id}>
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
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <i className="fa fa-trash me-1"></i>Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
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
                </PanelBody>
            </Panel>
        </div>
    );
}

export default AdminUsers;