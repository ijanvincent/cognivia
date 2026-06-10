import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

const STATUS_META = {
    pending:  { label: 'Pending',  color: '#fb8500', bg: 'rgba(251,133,0,0.12)',  icon: 'fa-hourglass-half' },
    approved: { label: 'Approved', color: '#06d6a0', bg: 'rgba(6,214,160,0.12)',  icon: 'fa-check-circle'   },
    denied:   { label: 'Denied',   color: '#ef476f', bg: 'rgba(239,71,111,0.12)', icon: 'fa-times-circle'   },
};

const PLATFORM_ICON = { web: 'fa-globe', mobile: 'fa-mobile-alt' };

function avatarColor(str = '') {
    const p = ['#4361ee','#7209b7','#f72585','#4cc9f0','#06d6a0','#fb8500','#ef476f','#3a0ca3'];
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return p[Math.abs(h) % p.length];
}

function timeAgo(d) {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function SkeletonRow() {
    return (
        <tr>
            {[40, 160, 100, 100, 90, 90, 80].map((w, i) => (
                <td key={i} className="py-3">
                    <div className="bg-secondary opacity-25 rounded" style={{ height: '12px', width: `${w}px` }} />
                </td>
            ))}
        </tr>
    );
}

function AdminLoginApprovals() {
    const context = useContext(AppSettings);

    const [approvals, setApprovals] = useState([]);
    const [stats, setStats]         = useState({ pending: 0, approved: 0, denied: 0, expired: 0 });
    const [loading, setLoading]     = useState(true);
    const [filter, setFilter]       = useState('all');
    const [search, setSearch]       = useState('');
    const [lastRefresh, setRefresh] = useState(Date.now());

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchData();
        const iv = setInterval(fetchData, 10000);
        return () => {
            clearInterval(iv);
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/login-approvals');
            setApprovals(res.data.approvals || []);
            setStats(res.data.stats || {});
            setRefresh(Date.now());
        } catch (err) {
            console.error('Login approvals error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = approvals.filter(a => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (a.user?.username || '').toLowerCase().includes(q) ||
            (a.user?.email || '').toLowerCase().includes(q) ||
            a.requesting_platform.includes(q) ||
            a.active_platform.includes(q);
        const effectiveStatus = a.is_expired && a.status === 'pending' ? 'expired' : a.status;
        const matchFilter = filter === 'all' || effectiveStatus === filter;
        return matchSearch && matchFilter;
    });

    const statCards = [
        { key: 'pending',  label: 'Pending',   icon: 'fa-hourglass-half', bg: 'linear-gradient(135deg,#fb8500,#d4620f)', shadow: 'rgba(251,133,0,0.3)' },
        { key: 'approved', label: 'Approved',  icon: 'fa-check-circle',   bg: 'linear-gradient(135deg,#06d6a0,#028a5b)', shadow: 'rgba(6,214,160,0.3)' },
        { key: 'denied',   label: 'Denied',    icon: 'fa-times-circle',   bg: 'linear-gradient(135deg,#ef476f,#b91543)', shadow: 'rgba(239,71,111,0.3)' },
        { key: 'expired',  label: 'Expired',   icon: 'fa-clock',          bg: 'linear-gradient(135deg,#6c757d,#495057)', shadow: 'rgba(108,117,125,0.3)' },
    ];

    const filters = ['all', 'pending', 'approved', 'denied', 'expired'];

    return (
        <div>
            {/* Page Header */}
            <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
                <div>
                    <ol className="breadcrumb mb-1 small">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Login Approvals</li>
                    </ol>
                    <h1 className="page-header mb-0">Login Approvals</h1>
                    <p className="text-muted mb-0 small">
                        Cross-platform login requests — users switching between web and mobile
                    </p>
                </div>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                    {stats.pending > 0 && (
                        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-3"
                            style={{ background: 'rgba(251,133,0,0.12)', border: '1px solid rgba(251,133,0,0.3)', fontSize: '12px' }}>
                            <span className="rounded-circle" style={{ width: '8px', height: '8px', background: '#fb8500', boxShadow: '0 0 6px rgba(251,133,0,0.6)', display: 'inline-block' }}></span>
                            <span className="fw-semibold" style={{ color: '#fb8500' }}>{stats.pending} pending approval{stats.pending !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                    <button className="btn btn-outline-theme btn-sm rounded-3 px-3" onClick={fetchData}>
                        <i className="fa fa-sync-alt me-2"></i>Refresh
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">
                {statCards.map((c, i) => (
                    <div key={i} className="col-xl-3 col-md-6">
                        <div className="rounded-4 text-white p-4"
                            style={{ background: c.bg, boxShadow: `0 8px 24px ${c.shadow}` }}>
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <div className="small fw-semibold text-uppercase mb-1 opacity-75"
                                        style={{ fontSize: '10px', letterSpacing: '0.07em' }}>{c.label}</div>
                                    <div className="fw-bold lh-1" style={{ fontSize: '2rem' }}>
                                        {loading ? '—' : (stats[c.key] || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
                                    style={{ width: '44px', height: '44px' }}>
                                    <i className={`fa ${c.icon}`} style={{ fontSize: '18px' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Approvals Table */}
            <div className="panel panel-inverse">
                <div className="panel-heading d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <h4 className="panel-title mb-0">Approval Log</h4>
                        {!loading && <span className="badge bg-theme rounded-pill">{filtered.length}</span>}
                        <div className="d-flex gap-1 flex-wrap">
                            {filters.map(f => (
                                <button key={f} type="button"
                                    className={`btn btn-xs rounded-pill px-3 ${filter === f ? 'btn-theme' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: '11px', textTransform: 'capitalize' }}
                                    onClick={() => setFilter(f)}>
                                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                                    {f !== 'all' && stats[f] > 0 && (
                                        <span className="ms-1" style={{ opacity: 0.8 }}>({stats[f]})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <small className="text-muted d-none d-md-block" style={{ fontSize: '11px' }}>
                            <i className="fa fa-sync-alt me-1" style={{ fontSize: '10px' }}></i>
                            Auto-refresh every 10s
                        </small>
                        <div className="input-group input-group-sm" style={{ width: '240px' }}>
                            <span className="input-group-text bg-transparent">
                                <i className="fa fa-search text-muted"></i>
                            </span>
                            <input type="text" className="form-control"
                                placeholder="Search user or platform…"
                                value={search} onChange={e => setSearch(e.target.value)} />
                            {search && (
                                <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                                    <i className="fa fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="panel-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="border-bottom" style={{ background: 'rgba(0,0,0,0.025)' }}>
                                <tr>
                                    <th className="ps-4 py-3 fw-semibold text-muted small border-0" width="40">#</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">User</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Requesting From</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Active On</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Status</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Expires</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Requested</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">
                                            <i className="fa fa-shield-alt d-block mb-2 fa-2x opacity-25"></i>
                                            <div className="fw-semibold">
                                                {search ? `No results for "${search}"` : filter !== 'all' ? `No ${filter} approvals` : 'No approval records yet'}
                                            </div>
                                            {filter !== 'all' && (
                                                <button className="btn btn-sm btn-outline-secondary mt-2 rounded-3"
                                                    onClick={() => setFilter('all')}>Show all</button>
                                            )}
                                        </td>
                                    </tr>
                                ) : filtered.map((a, i) => {
                                    const effectiveStatus = a.is_expired && a.status === 'pending' ? 'expired' : a.status;
                                    const sm = STATUS_META[effectiveStatus] || STATUS_META.pending;
                                    const reqIcon = PLATFORM_ICON[a.requesting_platform] || 'fa-question';
                                    const actIcon = PLATFORM_ICON[a.active_platform]     || 'fa-question';
                                    return (
                                        <tr key={a.id}>
                                            <td className="ps-4 text-muted small">{i + 1}</td>
                                            <td>
                                                {a.user ? (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                            style={{ width: '32px', height: '32px', background: avatarColor(a.user.username), fontSize: '12px' }}>
                                                            {a.user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="small fw-semibold">{a.user.username}</div>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>{a.user.email}</div>
                                                        </div>
                                                    </div>
                                                ) : <span className="text-muted small">—</span>}
                                            </td>
                                            <td>
                                                <span className="d-flex align-items-center gap-2">
                                                    <i className={`fa ${reqIcon} text-muted`}></i>
                                                    <span className="small text-capitalize fw-semibold">{a.requesting_platform}</span>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="d-flex align-items-center gap-2">
                                                    <i className={`fa ${actIcon} text-muted`}></i>
                                                    <span className="small text-capitalize fw-semibold">{a.active_platform}</span>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge rounded-pill px-2 py-1"
                                                    style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.color}44`, fontSize: '11px' }}>
                                                    <i className={`fa ${sm.icon} me-1`} style={{ fontSize: '10px' }}></i>
                                                    {sm.label}
                                                </span>
                                            </td>
                                            <td>
                                                {a.is_expired ? (
                                                    <span className="text-muted small"><i className="fa fa-clock me-1"></i>Expired</span>
                                                ) : (
                                                    <span className="small text-muted">{timeAgo(a.expires_at)}</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="small text-muted">{timeAgo(a.created_at)}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!loading && filtered.length > 0 && (
                    <div className="panel-footer d-flex align-items-center justify-content-between px-4 py-2 border-top">
                        <small className="text-muted">
                            Showing <strong>{filtered.length}</strong> of <strong>{approvals.length}</strong> records
                        </small>
                        <small className="text-muted">
                            Last updated {timeAgo(new Date(lastRefresh).toISOString())}
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminLoginApprovals;
