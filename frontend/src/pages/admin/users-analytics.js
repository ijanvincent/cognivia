import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function AdminUsersAnalytics() {
    const context = useContext(AppSettings);
    const [stats, setStats] = useState({
        total_users: 0,
        new_today: 0,
        new_this_month: 0,
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchData();
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        try {
            const [dashRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/users')
            ]);
            setStats(dashRes.data.stats);
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error('Analytics error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group users by month for display
    const usersByMonth = users.reduce((acc, user) => {
        const month = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/admin/users">User Management</Link></li>
                <li className="breadcrumb-item active">User Analytics</li>
            </ol>
            <h1 className="page-header">
                User Analytics <small>registration trends and insights</small>
            </h1>

            {loading ? (
                <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="row mb-4">
                        <div className="col-xl-3 col-md-6">
                            <div className="widget widget-stats bg-blue">
                                <div className="stats-icon"><i className="fa fa-users"></i></div>
                                <div className="stats-info">
                                    <h4>TOTAL USERS</h4>
                                    <p>{stats.total_users}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/admin/users">View All <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="widget widget-stats bg-info">
                                <div className="stats-icon"><i className="fa fa-user-plus"></i></div>
                                <div className="stats-info">
                                    <h4>NEW TODAY</h4>
                                    <p>{stats.new_today}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/admin/users">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="widget widget-stats bg-orange">
                                <div className="stats-icon"><i className="fa fa-calendar"></i></div>
                                <div className="stats-info">
                                    <h4>THIS MONTH</h4>
                                    <p>{stats.new_this_month}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/admin/users">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="widget widget-stats bg-red">
                                <div className="stats-icon"><i className="fa fa-chart-line"></i></div>
                                <div className="stats-info">
                                    <h4>GROWTH RATE</h4>
                                    <p>{stats.total_users > 0 && stats.new_this_month > 0
                                        ? ((stats.new_this_month / stats.total_users) * 100).toFixed(1) + '%'
                                        : '0%'}
                                    </p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/admin/users/analytics">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration by Month Table */}
                    <div className="row">
                        <div className="col-xl-6">
                            <Panel>
                                <PanelHeader>Registrations by Month</PanelHeader>
                                <PanelBody>
                                    <div className="table-responsive">
                                        <table className="table table-hover table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Month</th>
                                                    <th>New Users</th>
                                                    <th>Share</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(usersByMonth).length === 0 ? (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-muted">No data yet</td>
                                                    </tr>
                                                ) : (
                                                    Object.entries(usersByMonth).map(([month, count]) => (
                                                        <tr key={month}>
                                                            <td>{month}</td>
                                                            <td>
                                                                <span className="badge bg-primary">{count}</span>
                                                            </td>
                                                            <td>
                                                                <div className="progress" style={{ height: '6px' }}>
                                                                    <div
                                                                        className="progress-bar bg-primary"
                                                                        style={{ width: `${(count / stats.total_users) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <small className="text-muted">
                                                                    {stats.total_users > 0 ? ((count / stats.total_users) * 100).toFixed(1) : 0}%
                                                                </small>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </PanelBody>
                            </Panel>
                        </div>

                        {/* Recent Registrations */}
                        <div className="col-xl-6">
                            <Panel>
                                <PanelHeader>Recent Registrations</PanelHeader>
                                <PanelBody>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th>Registered</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.slice(0, 8).map(user => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div
                                                                    className="rounded-circle text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                                                                    style={{ width: '32px', height: '32px', minWidth: '32px', background: '#2196f3', fontSize: '13px' }}
                                                                >
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold">{user.username}</div>
                                                                    <small className="text-muted">{user.email}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-muted">
                                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </PanelBody>
                            </Panel>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminUsersAnalytics;