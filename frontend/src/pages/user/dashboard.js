import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function UserDashboard() {
    const context = useContext(AppSettings);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user?.username || 'User';

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                <li className="breadcrumb-item active">Dashboard</li>
            </ol>
            <h1 className="page-header">
                Welcome back, <span className="text-theme">{username}</span>! <small>your Cognivia overview</small>
            </h1>

            <div className="row">
                <div className="col-xl-3 col-md-6">
                    <div className="widget widget-stats bg-blue">
                        <div className="stats-icon"><i className="fa fa-trophy"></i></div>
                        <div className="stats-info"><h4>QUIZZES TAKEN</h4><p>0</p></div>
                        <div className="stats-link">
                            <Link to="/quizzes">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="widget widget-stats bg-info">
                        <div className="stats-icon"><i className="fa fa-star"></i></div>
                        <div className="stats-info"><h4>BEST SCORE</h4><p>0%</p></div>
                        <div className="stats-link">
                            <Link to="/leaderboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="widget widget-stats bg-orange">
                        <div className="stats-icon"><i className="fa fa-fire"></i></div>
                        <div className="stats-info"><h4>CURRENT STREAK</h4><p>0 days</p></div>
                        <div className="stats-link">
                            <Link to="/dashboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="widget widget-stats bg-red">
                        <div className="stats-icon"><i className="fa fa-medal"></i></div>
                        <div className="stats-info"><h4>RANK</h4><p>#—</p></div>
                        <div className="stats-link">
                            <Link to="/leaderboard">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-8">
                    <div className="panel panel-inverse">
                        <div className="panel-heading">
                            <h4 className="panel-title"><i className="fa fa-history me-2"></i>Recent Quiz Activity</h4>
                        </div>
                        <div className="panel-body text-center text-muted py-5">
                            <i className="fa fa-gamepad fa-4x mb-3 d-block" style={{ opacity: 0.3 }}></i>
                            <h5>No quizzes taken yet</h5>
                            <p className="mb-4">Start your first quiz and track your progress here!</p>
                            <Link to="/quizzes" className="btn btn-primary px-4">
                                <i className="fa fa-play me-2"></i>Start a Quiz
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4">
                    <div className="panel panel-inverse">
                        <div className="panel-heading">
                            <h4 className="panel-title"><i className="fa fa-user me-2"></i>My Profile</h4>
                        </div>
                        <div className="panel-body text-center">
                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold"
                                style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', fontSize: '28px' }}>
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <h5 className="fw-bold mb-1">{username}</h5>
                            <p className="text-muted mb-3"><span className="badge bg-primary">Member</span></p>
                            <Link to="/profile" className="btn btn-outline-primary btn-sm w-100">
                                <i className="fa fa-edit me-2"></i>Edit Profile
                            </Link>
                        </div>
                    </div>
                    <div className="panel panel-inverse">
                        <div className="panel-heading">
                            <h4 className="panel-title"><i className="fa fa-trophy me-2"></i>Leaderboard</h4>
                        </div>
                        <div className="panel-body text-center text-muted py-3">
                            <i className="fa fa-trophy fa-3x mb-2 d-block" style={{ opacity: 0.3 }}></i>
                            <p className="mb-3">Complete quizzes to appear on the leaderboard!</p>
                            <Link to="/leaderboard" className="btn btn-warning btn-sm px-4">
                                <i className="fa fa-list-ol me-2"></i>View Leaderboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;