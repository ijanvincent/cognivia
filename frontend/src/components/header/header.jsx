import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import { STORAGE_KEYS } from './../../services/api.js';
import api from './../../services/api.js';

const SEARCH_ITEMS = [
    { label: 'Dashboard',        path: '/admin/dashboard',          icon: 'fa-home',         section: 'Pages' },
    { label: 'All Users',        path: '/admin/users',              icon: 'fa-users',        section: 'Users' },
    { label: 'Trashed Users',    path: '/admin/users/trashed',      icon: 'fa-trash',        section: 'Users' },
    { label: 'User Analytics',   path: '/admin/users/analytics',    icon: 'fa-chart-bar',    section: 'Analytics' },
    { label: 'Deck Library',     path: '/admin/decks',              icon: 'fa-layer-group',  section: 'Content' },
    { label: 'Login Approvals',  path: '/admin/login-approvals',    icon: 'fa-shield-alt',   section: 'Security' },
];

function getAdminUser() {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        if (!token) return null;
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || 'null');
    } catch { return null; }
}

function avatarBg(name = '') {
    const colors = ['#4361ee','#7209b7','#06d6a0','#fb8500','#ef476f','#0d6efd'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
}

function Header() {
    const context  = useContext(AppSettings);
    const navigate = useNavigate();
    const adminUser = getAdminUser();
    const displayName = adminUser?.username || 'Admin';

    const [search, setSearch]         = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [notifs, setNotifs]         = useState([]);
    const [unread, setUnread]         = useState(() => parseInt(localStorage.getItem('notif_unread') || '0'));
    const [profileOpen, setProfileOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const seenIdsRef = useRef(null);
    const searchRef  = useRef(null);
    const profileRef = useRef(null);

    const filtered = search.length > 0
        ? SEARCH_ITEMS.filter(i =>
            i.label.toLowerCase().includes(search.toLowerCase()) ||
            i.section.toLowerCase().includes(search.toLowerCase())
          )
        : [];

    useEffect(() => {
        fetchNotifs(true);
        fetchPending();
        const iv = setInterval(() => { fetchNotifs(false); fetchPending(); }, 8000);
        return () => clearInterval(iv);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        function onClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const fetchNotifs = async (initial) => {
        try {
            const res = await api.get('/admin/users');
            const users = res.data.users || [];
            if (initial) {
                seenIdsRef.current = new Set(users.map(u => u.id));
                setNotifs(users.slice(0, 8).map(u => ({ ...u, isNew: false })));
            } else {
                const fresh = users.filter(u => !seenIdsRef.current.has(u.id));
                if (fresh.length > 0) {
                    fresh.forEach(u => seenIdsRef.current.add(u.id));
                    const next = unread + fresh.length;
                    setUnread(next);
                    localStorage.setItem('notif_unread', String(next));
                    setNotifs(prev => [
                        ...fresh.map(u => ({ ...u, isNew: true })),
                        ...prev,
                    ].slice(0, 10));
                }
            }
        } catch {}
    };

    const fetchPending = async () => {
        try {
            const res = await api.get('/admin/login-approvals');
            setPendingCount(res.data.stats?.pending || 0);
        } catch {}
    };

    const clearUnread = () => {
        setUnread(0);
        localStorage.setItem('notif_unread', '0');
        setNotifs(prev => prev.map(n => ({ ...n, isNew: false })));
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try { await api.post('/admin/logout'); } catch {}
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
        navigate('/admin/login');
    };

    const timeAgo = (d) => {
        const s = Math.floor((Date.now() - new Date(d)) / 1000);
        if (s < 60)    return 'just now';
        if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    const totalBadge = unread + pendingCount;

    return (
        <AppSettings.Consumer>
            {({ toggleAppSidebarMobile, appHeaderInverse, appDarkMode, handleSetAppDarkMode, appSidebarNone }) => (
                <div id="header" className="app-header" data-bs-theme={appHeaderInverse ? 'dark' : ''}>

                    {/* ── Left: Brand ── */}
                    <div className="navbar-header">
                        {!appSidebarNone && (
                            <button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarMobile}>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        )}
                        <Link to="/admin/dashboard" className="navbar-brand d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center justify-content-center rounded-2"
                                style={{ width: '28px', height: '28px', background: 'var(--bs-app-theme)', flexShrink: 0 }}>
                                <i className="fa fa-brain text-white" style={{ fontSize: '13px' }}></i>
                            </div>
                            <span className="fw-bold" style={{ fontSize: '15px', letterSpacing: '-0.3px' }}>
                                <b>Cognivia</b>
                            </span>
                            <span className="badge rounded-pill ms-1"
                                style={{ fontSize: '9px', background: 'var(--bs-app-theme)', color: '#fff', letterSpacing: '0.05em', padding: '3px 7px' }}>
                                ADMIN
                            </span>
                        </Link>
                    </div>

                    {/* ── Center: Search ── */}
                    <div className="d-none d-md-flex flex-grow-1 justify-content-center px-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
                        <div className="position-relative w-100" ref={searchRef}>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-transparent border-end-0"
                                    style={{ borderRadius: '8px 0 0 8px', opacity: 0.5 }}>
                                    <i className="fa fa-search" style={{ fontSize: '12px' }}></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 shadow-none"
                                    placeholder="Search pages, users, features…"
                                    value={search}
                                    style={{ borderRadius: '0 8px 8px 0', fontSize: '13px' }}
                                    onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
                                    onFocus={() => setSearchOpen(true)}
                                />
                                {search && (
                                    <button className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y pe-2 text-muted border-0"
                                        style={{ zIndex: 10 }} onClick={() => { setSearch(''); setSearchOpen(false); }}>
                                        <i className="fa fa-times" style={{ fontSize: '11px' }}></i>
                                    </button>
                                )}
                            </div>

                            {searchOpen && filtered.length > 0 && (
                                <div className="position-absolute top-100 start-0 w-100 mt-1 shadow-lg rounded-3 border overflow-hidden"
                                    style={{ zIndex: 1100, background: 'var(--bs-component-bg)' }}>
                                    {filtered.map((item, i) => (
                                        <Link key={i} to={item.path}
                                            className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none border-bottom"
                                            style={{ fontSize: '13px' }}
                                            onClick={() => { setSearch(''); setSearchOpen(false); }}>
                                            <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '28px', height: '28px', background: 'var(--bs-app-theme)', opacity: 0.15 }}>
                                                <i className={`fa ${item.icon} text-theme`} style={{ fontSize: '11px' }}></i>
                                            </div>
                                            <div>
                                                <div className="fw-semibold">{item.label}</div>
                                                <small className="text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{item.section}</small>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Actions ── */}
                    <div className="navbar-nav d-flex align-items-center gap-1">

                        {/* System status */}
                        <div className="navbar-item d-none d-lg-flex align-items-center gap-2 px-3 py-1 rounded-3 me-1"
                            style={{ background: 'rgba(6,214,160,0.10)', border: '1px solid rgba(6,214,160,0.25)', fontSize: '11px' }}>
                            <span className="rounded-circle bg-success d-block" style={{ width: '7px', height: '7px', boxShadow: '0 0 6px rgba(6,214,160,0.7)' }}></span>
                            <span className="text-success fw-semibold" style={{ letterSpacing: '0.04em' }}>ONLINE</span>
                        </div>

                        {/* Login approvals alert */}
                        {pendingCount > 0 && (
                            <div className="navbar-item">
                                <Link to="/admin/login-approvals"
                                    className="navbar-link icon btn border-0 bg-transparent position-relative"
                                    title={`${pendingCount} pending login approval${pendingCount !== 1 ? 's' : ''}`}>
                                    <i className="fa fa-shield-alt" style={{ color: '#fb8500' }}></i>
                                    <span className="badge rounded-pill position-absolute"
                                        style={{ top: '2px', right: '2px', fontSize: '9px', minWidth: '16px', height: '16px', lineHeight: '16px', padding: '0 4px', background: '#fb8500' }}>
                                        {pendingCount}
                                    </span>
                                </Link>
                            </div>
                        )}

                        {/* Notifications */}
                        <div className="navbar-item dropdown">
                            <a href="#/" data-bs-toggle="dropdown" className="navbar-link icon dropdown-toggle position-relative" onClick={clearUnread}>
                                <i className="fa fa-bell"></i>
                                {unread > 0 && (
                                    <span className="badge rounded-pill position-absolute"
                                        style={{ top: '2px', right: '2px', fontSize: '9px', minWidth: '16px', height: '16px', lineHeight: '16px', padding: '0 4px' }}>
                                        {unread > 99 ? '99+' : unread}
                                    </span>
                                )}
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" style={{ width: '340px', maxHeight: '420px', overflowY: 'auto' }}>
                                <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                                    <span className="fw-bold small text-uppercase" style={{ letterSpacing: '0.06em' }}>Notifications</span>
                                    <Link to="/admin/users" className="small text-theme text-decoration-none">View all</Link>
                                </div>
                                {notifs.length === 0 ? (
                                    <div className="text-center text-muted py-4">
                                        <i className="fa fa-bell-slash d-block mb-2 fa-xl opacity-25"></i>
                                        <small>No notifications yet</small>
                                    </div>
                                ) : notifs.map((n, i) => (
                                    <Link key={i} to="/admin/users" className="d-flex align-items-start gap-3 px-3 py-2 border-bottom text-decoration-none"
                                        style={{ background: n.isNew ? 'rgba(var(--bs-app-theme-rgb),0.05)' : 'transparent' }}>
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                            style={{ width: '34px', height: '34px', background: avatarBg(n.username), fontSize: '13px', marginTop: '2px' }}>
                                            {(n.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="small fw-semibold text-truncate">
                                                <span>{n.username}</span>
                                                <span className="text-muted fw-normal"> registered</span>
                                                {n.isNew && <span className="badge bg-success ms-1" style={{ fontSize: '9px' }}>NEW</span>}
                                            </div>
                                            <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>{n.email}</div>
                                            <div className="text-muted mt-1" style={{ fontSize: '10px' }}>{timeAgo(n.created_at)}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Dark mode */}
                        <div className="navbar-item">
                            <button className="navbar-link icon btn border-0 bg-transparent"
                                onClick={() => handleSetAppDarkMode(!appDarkMode)}
                                title={appDarkMode ? 'Light mode' : 'Dark mode'}>
                                <i className={`fa ${appDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                            </button>
                        </div>

                        {/* Settings quick-link */}
                        <div className="navbar-item d-none d-md-block">
                            <Link to="/admin/dashboard" className="navbar-link icon" title="Settings">
                                <i className="fa fa-cog"></i>
                            </Link>
                        </div>

                        {/* Profile */}
                        <div className="navbar-item dropdown" ref={profileRef}>
                            <a href="#/" data-bs-toggle="dropdown"
                                className="navbar-link d-flex align-items-center gap-2 dropdown-toggle text-decoration-none"
                                style={{ padding: '4px 8px' }}>
                                <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                    style={{ width: '30px', height: '30px', background: avatarBg(displayName), fontSize: '12px' }}>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="d-none d-lg-block lh-sm text-start">
                                    <div className="fw-semibold" style={{ fontSize: '13px' }}>{displayName}</div>
                                    <div className="text-muted" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>ADMINISTRATOR</div>
                                </div>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" style={{ minWidth: '220px' }}>
                                <div className="px-3 py-3 border-bottom">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                                            style={{ width: '40px', height: '40px', background: avatarBg(displayName), fontSize: '16px', flexShrink: 0 }}>
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="fw-bold text-truncate" style={{ fontSize: '14px' }}>{displayName}</div>
                                            <div className="text-muted small text-truncate">{adminUser?.email || ''}</div>
                                            <span className="badge rounded-pill mt-1"
                                                style={{ fontSize: '9px', background: 'var(--bs-app-theme)', color: '#fff' }}>
                                                ADMINISTRATOR
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/admin/dashboard" className="dropdown-item d-flex align-items-center gap-2 py-2">
                                    <i className="fa fa-home fa-fw text-muted"></i>
                                    <span>Dashboard</span>
                                </Link>
                                <Link to="/admin/users" className="dropdown-item d-flex align-items-center gap-2 py-2">
                                    <i className="fa fa-users fa-fw text-muted"></i>
                                    <span>Manage Users</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <a href="#/" className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" onClick={handleLogout}>
                                    <i className="fa fa-sign-out-alt fa-fw"></i>
                                    <span>Sign Out</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppSettings.Consumer>
    );
}

export default Header;
