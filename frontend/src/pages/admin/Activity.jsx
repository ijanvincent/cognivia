import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import {
    PageHeader, StatCard, ActivityItem, EmptyState,
} from './components/admin-ui.jsx';

const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'signup',   label: 'Signups' },
    { key: 'session',  label: 'Sign-ins' },
    { key: 'deck',     label: 'Decks' },
    { key: 'study',    label: 'Study' },
    { key: 'approval', label: 'Login approvals' },
];

const REFRESH_MS = 15000;

// Group events under "Today", "Yesterday", or the calendar date so the
// feed reads like a log rather than an undifferentiated list.
function dayLabel(d) {
    const date = new Date(d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const that  = new Date(date); that.setHours(0, 0, 0, 0);
    const diff = Math.round((today - that) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function AdminActivity() {
    const context = useContext(AppSettings);

    const [events, setEvents]         = useState([]);
    const [engagement, setEngagement] = useState(null);
    const [filter, setFilter]         = useState('all');
    const [search, setSearch]         = useState('');
    const [loading, setLoading]       = useState(true);
    const [autoRefresh, setAuto]      = useState(true);
    const [lastUpdated, setUpdated]   = useState(null);
    const filterRef = useRef(filter);
    filterRef.current = filter;

    const fetchData = useCallback(async (type = filterRef.current, silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [feedRes, engageRes] = await Promise.all([
                api.get('/admin/activity', { params: { type, limit: 100 } }),
                api.get('/admin/activity/engagement').catch(() => ({ data: null })),
            ]);
            setEvents(feedRes.data.events || []);
            if (engageRes.data) setEngagement(engageRes.data);
            setUpdated(new Date());
        } catch (err) {
            console.error('Activity error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

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

    useEffect(() => {
        if (!autoRefresh) return;
        const iv = setInterval(() => fetchData(filterRef.current, true), REFRESH_MS);
        return () => clearInterval(iv);
    }, [autoRefresh, fetchData]);

    const changeFilter = (key) => {
        setFilter(key);
        fetchData(key);
    };

    const q = search.toLowerCase();
    const filtered = events.filter(ev =>
        !q ||
        (ev.user?.username || '').toLowerCase().includes(q) ||
        (ev.user?.email || '').toLowerCase().includes(q) ||
        (ev.meta?.title || '').toLowerCase().includes(q) ||
        (ev.meta?.deck_title || '').toLowerCase().includes(q)
    );

    // Group by day, preserving order.
    const groups = [];
    filtered.forEach(ev => {
        const label = dayLabel(ev.timestamp);
        const last = groups[groups.length - 1];
        if (last && last.label === label) last.items.push(ev);
        else groups.push({ label, items: [ev] });
    });

    const todayCount = events.filter(ev => dayLabel(ev.timestamp) === 'Today').length;

    return (
        <div>
            <PageHeader
                crumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Activity' }]}
                title="User Activity"
                subtitle="A live trail of what users are doing — signups, sign-ins, decks, study progress and login approvals."
            >
                <div className="form-check form-switch d-flex align-items-center gap-2 me-2 mb-0">
                    <input className="form-check-input" type="checkbox" id="activityAutoRefresh"
                        checked={autoRefresh} onChange={e => setAuto(e.target.checked)} />
                    <label className="form-check-label text-muted" htmlFor="activityAutoRefresh" style={{ fontSize: '12px' }}>
                        Auto-refresh
                    </label>
                </div>
                <button type="button" className="btn btn-default btn-sm" onClick={() => fetchData()} title="Refresh">
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </PageHeader>

            <div className="row g-3 mb-3">
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Online now" value={(engagement?.active_now ?? 0).toLocaleString()}
                        icon="fa-circle-dot" accent={(engagement?.active_now ?? 0) > 0}
                        loading={loading && !engagement} sub="active in the last 5 minutes" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Active today" value={(engagement?.active_today ?? 0).toLocaleString()}
                        icon="fa-bolt" loading={loading && !engagement} sub="unique users" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Active this week" value={(engagement?.active_7d ?? 0).toLocaleString()}
                        icon="fa-calendar-week" loading={loading && !engagement} sub="last 7 days" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Events today" value={todayCount.toLocaleString()}
                        icon="fa-wave-square" loading={loading && !engagement} sub="in this feed" />
                </div>
            </div>

            <Panel className="mb-0">
                <PanelHeader>Activity feed</PanelHeader>
                <PanelBody className="p-0">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 py-2 border-bottom">
                        <div className="d-flex gap-1 flex-wrap">
                            {FILTERS.map(f => (
                                <button key={f.key} type="button"
                                    className={`btn btn-sm ${filter === f.key ? 'btn-theme' : 'btn-default'}`}
                                    style={{ fontSize: '12px' }}
                                    onClick={() => changeFilter(f.key)}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            {lastUpdated && (
                                <span className="text-muted d-none d-md-inline" style={{ fontSize: '11px' }}>
                                    Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                                </span>
                            )}
                            <div className="input-group input-group-sm" style={{ width: 240 }}>
                                <span className="input-group-text"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
                                <input type="text" className="form-control" placeholder="Filter by user or deck…"
                                    value={search} onChange={e => setSearch(e.target.value)} />
                                {search && (
                                    <button className="btn btn-default" type="button" onClick={() => setSearch('')}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="px-3 py-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="d-flex align-items-center gap-3 py-3">
                                    <span className="placeholder rounded-circle d-inline-block" style={{ width: 32, height: 32 }} />
                                    <span className="flex-grow-1">
                                        <span className="placeholder rounded d-block mb-1" style={{ height: 11, width: `${45 + (i * 13) % 40}%` }} />
                                        <span className="placeholder rounded d-block opacity-50" style={{ height: 9, width: '12%' }} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <EmptyState icon="fa-wave-square"
                            title={search ? `No activity matching “${search}”` : 'No activity recorded yet'}
                            hint={search ? 'Try a different name or deck title.' : 'Events appear here as users sign up, sign in, build decks and study.'} />
                    ) : (
                        <div className="px-3 pb-2">
                            {groups.map(group => (
                                <div key={group.label}>
                                    <div className="text-muted text-uppercase fw-semibold pt-3 pb-1"
                                        style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                                        {group.label}
                                        <span className="ms-2 fw-normal text-lowercase" style={{ letterSpacing: 0 }}>
                                            {group.items.length} event{group.items.length === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    {group.items.map((ev, i) => (
                                        <div key={i} className={i > 0 ? 'border-top' : ''}>
                                            <ActivityItem event={ev} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default AdminActivity;
