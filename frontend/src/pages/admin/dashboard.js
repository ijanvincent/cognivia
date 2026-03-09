import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function AdminDashboard() {
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
		fetchDashboard();
		fetchUsers();
		return () => {
			context.handleSetAppSidebarNone(true);
			context.handleSetAppHeaderNone(true);
		};
		// eslint-disable-next-line
	}, []);

	const fetchDashboard = async () => {
		try {
			const response = await api.get('/admin/dashboard');
			setStats(response.data.stats);
		} catch (error) {
			console.error('Dashboard error:', error);
		}
	};

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

	const handleDeleteUser = async (id) => {
		if (!window.confirm('Are you sure you want to delete this user?')) return;
		try {
			await api.delete(`/admin/users/${id}`);
			setUsers(users.filter(user => user.id !== id));
			setStats(prev => ({
				...prev,
				total_users: prev.total_users - 1
			}));
		} catch (error) {
			console.error('Delete error:', error);
		}
	};

	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
				<li className="breadcrumb-item active">Dashboard</li>
			</ol>
			<h1 className="page-header">
				Admin Dashboard <small>Cognivia overview</small>
			</h1>

			{/* Stats Widgets */}
			<div className="row">
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-blue">
						<div className="stats-icon">
							<i className="fa fa-users"></i>
						</div>
						<div className="stats-info">
							<h4>TOTAL USERS</h4>
							<p>{stats.total_users}</p>
						</div>
						<div className="stats-link">
							<Link to="/admin/dashboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>

				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-info">
						<div className="stats-icon">
							<i className="fa fa-user-plus"></i>
						</div>
						<div className="stats-info">
							<h4>NEW TODAY</h4>
							<p>{stats.new_today}</p>
						</div>
						<div className="stats-link">
							<Link to="/admin/dashboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>

				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-orange">
						<div className="stats-icon">
							<i className="fa fa-calendar"></i>
						</div>
						<div className="stats-info">
							<h4>THIS MONTH</h4>
							<p>{stats.new_this_month}</p>
						</div>
						<div className="stats-link">
							<Link to="/admin/dashboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>

				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-red">
						<div className="stats-icon">
							<i className="fa fa-mobile"></i>
						</div>
						<div className="stats-info">
							<h4>PLATFORMS</h4>
							<p>Web + Mobile</p>
						</div>
						<div className="stats-link">
							<Link to="/admin/dashboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
						</div>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className="row">
				<div className="col-xl-12">
					<Panel>
						<PanelHeader>
							Registered Users
							<span className="badge bg-primary ms-2">{users.length}</span>
						</PanelHeader>
						<PanelBody>
							{loading ? (
								<div className="text-center p-3">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							) : users.length === 0 ? (
								<div className="text-center text-muted p-3">
									<i className="fa fa-users fa-3x mb-3 d-block"></i>
									No users found
								</div>
							) : (
								<div className="table-responsive">
									<table className="table table-hover table-striped mb-0 align-middle">
										<thead>
											<tr>
												<th width="50">#</th>
												<th>Username</th>
												<th>Email</th>
												<th>Registered</th>
												<th width="100">Action</th>
											</tr>
										</thead>
										<tbody>
											{users.map((user, index) => (
												<tr key={user.id}>
													<td className="text-muted fw-bold">{index + 1}</td>
													<td>
														<div className="d-flex align-items-center">
															<div className="rounded-circle text-white d-flex align-items-center justify-content-center me-2 fw-bold"
																style={{
																	width: '36px',
																	height: '36px',
																	minWidth: '36px',
																	background: '#2196f3',
																	fontSize: '14px'
																}}>
																{user.username.charAt(0).toUpperCase()}
															</div>
															<span className="fw-bold">{user.username}</span>
														</div>
													</td>
													<td className="text-muted">{user.email}</td>
													<td className="text-muted">
														{new Date(user.created_at).toLocaleDateString('en-US', {
															year: 'numeric',
															month: 'short',
															day: 'numeric'
														})}
													</td>
													<td>
														<button
															className="btn btn-danger btn-sm"
															onClick={() => handleDeleteUser(user.id)}
														>
															<i className="fa fa-trash me-1"></i>Delete
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</PanelBody>
					</Panel>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;