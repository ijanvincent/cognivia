import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api.js';

function DropdownNotification() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(
    () => parseInt(localStorage.getItem('notif_unread') || '0')
);
    const seenIdsRef = useRef(null);

    useEffect(() => {
        fetchNotifications(true);
        const interval = setInterval(() => fetchNotifications(false), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async (isInitial) => {
        try {
            const response = await api.get('/admin/users');
            const users = response.data.users || [];
            if (isInitial) {
                seenIdsRef.current = new Set(users.map(u => u.id));
                setNotifications(users.slice(0, 5).map(u => ({
                    id: u.id, username: u.username,
                    email: u.email, created_at: u.created_at, isNew: false
                })));
            } else {
                const newUsers = users.filter(u => !seenIdsRef.current.has(u.id));
                if (newUsers.length > 0) {
                    newUsers.forEach(u => seenIdsRef.current.add(u.id));
                    const newCount = unreadCount + newUsers.length;
                    setUnreadCount(newCount);
                    localStorage.setItem('notif_unread', String(newCount));
                    setNotifications(prev => [
                        ...newUsers.map(u => ({
                            id: u.id, username: u.username,
                            email: u.email, created_at: u.created_at, isNew: true
                        })),
                        ...prev
                    ].slice(0, 10));    
                }
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    };

    const getTimeAgo = (dateString) => {
        const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const handleOpen = () => {
    setUnreadCount(0);
    localStorage.setItem('notif_unread', '0');
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
};

    return (
        <div className="navbar-item dropdown">
            <a href="#/" data-bs-toggle="dropdown"
                className="navbar-link dropdown-toggle icon"
                onClick={handleOpen}>
                <i className="fa fa-bell"></i>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </a>
            <div className="dropdown-menu media-list dropdown-menu-end">
                <div className="dropdown-header">
                    NEW REGISTRATIONS ({notifications.length})
                </div>
                {notifications.length === 0 ? (
                    <div className="dropdown-item text-center text-muted p-3">
                        <i className="fa fa-bell-slash d-block mb-2 fa-2x"></i>
                        <small>No notifications yet</small>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <a href="#/" key={notif.id} className="dropdown-item media">
                            <div className="media-left">
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: notif.isNew
                                        ? 'linear-gradient(135deg, #34c759, #248a3d)'
                                        : 'linear-gradient(135deg, #1a73e8, #0d47a1)',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#fff',
                                    fontWeight: 'bold', fontSize: '14px', flexShrink: 0
                                }}>
                                    {notif.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="media-body">
                                <h6 className="media-heading">
                                    <b>{notif.username}</b> registered
                                    {notif.isNew && (
                                        <span className="badge bg-success ms-1"
                                            style={{ fontSize: '9px' }}>NEW</span>
                                    )}
                                </h6>
                                <small className="text-muted d-block">{notif.email}</small>
                                <div className="text-muted fs-10px">
                                    {getTimeAgo(notif.created_at)}
                                </div>
                            </div>
                        </a>
                    ))
                )}
                <div className="dropdown-footer text-center">
                    <Link to="/admin/users" className="text-decoration-none">
                        View all users <i className="fa fa-arrow-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DropdownNotification;