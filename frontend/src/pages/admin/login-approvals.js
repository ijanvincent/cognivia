import React, { useEffect, useState, useContext } from 'react';
import { Panel, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import {
    PageHeader, StatCard, UserCell, ApprovalBadge, PlatformLabel,
    EmptyState, TableSkeleton, timeAgo, fmtDateTime,
} from './components/admin-ui.jsx';

const FILTERS = ['all', 'pending', 'approved', 'denied', 'expired'];

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

    return (
        <div>
            <PageHeader
                crumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Login Approvals' }]}
                title="Login Approvals"
                subtitle="Cross-platform login requests — users switching between web and mobile"
            >
                {stats.pending > 0 && (
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 fw-semibold px-3 py-2"
                        style={{ fontSize: '12px' }}>
                        {stats.pending} pending approval{stats.pending !== 1 ? 's' : ''}
                    </span>
                )}
                <button className="btn btn-default btn-sm" onClick={fetchData}>
                    <i className="fa-solid fa-rotate-right me-2"></i>Refresh
                </button>
            </PageHeader>

            <div className="row g-3 mb-3">
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Pending" value={(stats.pending || 0).toLocaleString()}
                        icon="fa-hourglass-half" accent={stats.pending > 0}
                        loading={loading} sub="awaiting a decision" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Approved" value={(stats.approved || 0).toLocaleString()}
                        icon="fa-check" loading={loading} sub="all time" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Denied" value={(stats.denied || 0).toLocaleString()}
                        icon="fa-xmark" loading={loading} sub="all time" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Expired" value={(stats.expired || 0).toLocaleString()}
                        icon="fa-clock" loading={loading} sub="timed out after 60s" />
                </div>
            </div>

            <Panel className="mb-0">
                <PanelBody className="p-0">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 py-2 border-bottom">
                        <div className="d-flex gap-1 flex-wrap">
                            {FILTERS.map(f => (
                                <button key={f} type="button"
                                    className={`btn btn-sm text-capitalize ${filter === f ? 'btn-theme' : 'btn-default'}`}
                                    style={{ fontSize: '12px' }}
                                    onClick={() => setFilter(f)}>
                                    {f === 'all' ? 'All' : f}
                                    {f !== 'all' && stats[f] > 0 && (
                                        <span className="ms-1 opacity-75">({stats[f]})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted d-none d-md-inline" style={{ fontSize: '11px' }}>
                                Auto-refreshes every 10s · updated {timeAgo(new Date(lastRefresh).toISOString())}
                            </span>
                            <div className="input-group input-group-sm" style={{ width: 240 }}>
                                <span className="input-group-text">
                                    <i className="fa-solid fa-magnifying-glass text-muted"></i>
                                </span>
                                <input type="text" className="form-control"
                                    placeholder="Search user or platform…"
                                    value={search} onChange={e => setSearch(e.target.value)} />
                                {search && (
                                    <button className="btn btn-default" type="button" onClick={() => setSearch('')}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="ps-4 small text-muted fw-semibold" style={{ width: 44 }}>#</th>
                                    <th className="small text-muted fw-semibold">User</th>
                                    <th className="small text-muted fw-semibold">Requested from</th>
                                    <th className="small text-muted fw-semibold">Active on</th>
                                    <th className="small text-muted fw-semibold">Status</th>
                                    <th className="small text-muted fw-semibold">Expires</th>
                                    <th className="small text-muted fw-semibold pe-4">Requested</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <TableSkeleton rows={5} cols={7} />
                            ) : (
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-0">
                                                <EmptyState icon="fa-shield-halved"
                                                    title={search ? `No results for “${search}”`
                                                        : filter !== 'all' ? `No ${filter} approvals` : 'No approval records yet'}>
                                                    {filter !== 'all' && (
                                                        <button className="btn btn-sm btn-default" onClick={() => setFilter('all')}>
                                                            Show all
                                                        </button>
                                                    )}
                                                </EmptyState>
                                            </td>
                                        </tr>
                                    ) : filtered.map((a, i) => {
                                        const effectiveStatus = a.is_expired && a.status === 'pending' ? 'expired' : a.status;
                                        return (
                                            <tr key={a.id}>
                                                <td className="ps-4 text-muted small">{i + 1}</td>
                                                <td><UserCell user={a.user} size={28} /></td>
                                                <td><PlatformLabel platform={a.requesting_platform} /></td>
                                                <td><PlatformLabel platform={a.active_platform} /></td>
                                                <td><ApprovalBadge status={effectiveStatus} /></td>
                                                <td className="text-muted" style={{ fontSize: '12px' }}>
                                                    {a.is_expired ? 'Expired' : timeAgo(a.expires_at)}
                                                </td>
                                                <td className="pe-4 text-muted" style={{ fontSize: '12px' }} title={fmtDateTime(a.created_at)}>
                                                    {timeAgo(a.created_at)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>

                    {!loading && filtered.length > 0 && (
                        <div className="d-flex align-items-center px-4 py-2 border-top">
                            <small className="text-muted">
                                Showing <strong>{filtered.length}</strong> of <strong>{approvals.length}</strong> records
                            </small>
                        </div>
                    )}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default AdminLoginApprovals;
