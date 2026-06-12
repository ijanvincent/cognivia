import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import { STORAGE_KEYS } from './../../services/api.js';
import api from './../../services/api.js';
import {
    PageHeader, StatCard, UserCell, ActivityItem, EmptyState,
    themeColor, timeAgo, fmtDate,
} from './components/admin-ui.jsx';

function getAdminUser() {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        if (!token) return {};
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}') || {};
    } catch { return {}; }
}

function cssVar(name, fallback) {
    return (getComputedStyle(document.body).getPropertyValue(name) || fallback).trim();
}

function AdminDashboard() {
    const context   = useContext(AppSettings);
    const adminUser = getAdminUser();

    const [stats, setStats] = useState({
        total_users: 0, new_today: 0, new_this_month: 0, total_deleted_users: 0,
    });
    const [content, setContent] = useState({
        total_decks: 0, total_flashcards: 0, ai_generated: 0,
        mastered_cards: 0, pending_approvals: 0, deck_sources: {},
    });
    const [engagement, setEngagement] = useState(null);
    const [events, setEvents]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchDashboard = useCallback(async () => {
        setRefreshing(true);
        try {
            const [dashRes, contentRes, engageRes, feedRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/content/overview').catch(() => ({ data: null })),
                api.get('/admin/activity/engagement').catch(() => ({ data: null })),
                api.get('/admin/activity', { params: { limit: 30 } }).catch(() => ({ data: { events: [] } })),
            ]);
            setStats(dashRes.data.stats);
            if (contentRes.data) setContent(prev => ({ ...prev, ...contentRes.data }));
            if (engageRes.data)  setEngagement(engageRes.data);
            setEvents(feedRes.data.events || []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchDashboard();
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
        // eslint-disable-next-line
    }, []);

    const accent  = themeColor();
    const indigo  = cssVar('--bs-indigo', '#8753de');
    const gridCol = cssVar('--bs-border-color', '#e4e7ec');
    const muted   = cssVar('--bs-gray-500', '#adb5bd');

    const series = engagement?.signups_by_day || [];

    const trendOptions = {
        chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
        colors: [accent, indigo],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.25, opacityTo: 0.02 } },
        dataLabels: { enabled: false },
        grid: { borderColor: gridCol, strokeDashArray: 3, padding: { left: 8, right: 8 } },
        legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: { colors: muted } },
        xaxis: {
            categories: series.map(d => d.date),
            type: 'datetime',
            labels: { style: { colors: muted, fontSize: '11px' }, datetimeUTC: false },
            axisBorder: { show: false }, axisTicks: { show: false },
            tooltip: { enabled: false },
        },
        yaxis: {
            labels: { style: { colors: muted, fontSize: '11px' }, formatter: v => Math.round(v) },
            min: 0, forceNiceScale: true,
        },
        tooltip: { x: { format: 'MMM d' } },
    };
    const trendSeries = [
        { name: 'Signups',  data: series.map(d => d.signups) },
        { name: 'Sign-ins', data: series.map(d => d.logins) },
    ];

    const sessions      = engagement?.sessions || { web: 0, mobile: 0 };
    const totalSessions = (sessions.web || 0) + (sessions.mobile || 0);

    const platformOptions = {
        chart: { type: 'donut', fontFamily: 'inherit' },
        labels: ['Web', 'Mobile'],
        colors: [accent, indigo],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '78%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '11px', color: muted, offsetY: 16 },
                        value: { show: true, fontSize: '22px', fontWeight: 700, offsetY: -12 },
                        total: { show: true, label: 'sessions', fontSize: '11px', color: muted, formatter: () => totalSessions.toLocaleString() },
                    },
                },
            },
        },
        tooltip: { y: { formatter: v => `${v} session${v === 1 ? '' : 's'}` } },
    };

    const deckSources = [
        { key: 'ai',     label: 'AI generated' },
        { key: 'manual', label: 'Created manually' },
        { key: 'import', label: 'Imported via share code' },
    ];

    const study = engagement?.study || { total_reviews: 0, mastered_cards: 0, total_cards: 0 };
    const masteredPct = study.total_cards > 0
        ? Math.round((study.mastered_cards / study.total_cards) * 100) : 0;

    const recentSignups = events.filter(e => e.type === 'signup').slice(0, 5);
    const recentEvents  = events.slice(0, 8);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    return (
        <div>
            <PageHeader
                crumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Overview' }]}
                title="Overview"
                subtitle={<>Welcome back, <span className="fw-semibold">{adminUser?.username || 'Admin'}</span> — {today}</>}
            >
                {lastUpdated && (
                    <span className="text-muted d-none d-md-inline me-1" style={{ fontSize: '11px' }}>
                        Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                )}
                <button type="button" className="btn btn-default btn-sm"
                    onClick={fetchDashboard} disabled={refreshing} title="Refresh">
                    <i className={`fa-solid fa-rotate-right ${refreshing ? 'fa-spin' : ''}`}></i>
                </button>
                <Link to="/admin/activity" className="btn btn-default btn-sm">
                    <i className="fa-solid fa-wave-square me-2"></i>Activity
                </Link>
                <Link to="/admin/users" className="btn btn-theme btn-sm">
                    <i className="fa-solid fa-users me-2"></i>Manage users
                </Link>
            </PageHeader>

            {/* KPI row */}
            <div className="row g-3 mb-3">
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Total users"
                        value={stats.total_users.toLocaleString()}
                        icon="fa-users"
                        loading={loading}
                        delta={stats.new_this_month > 0 ? `+${stats.new_this_month}` : null}
                        deltaUp
                        sub="this month"
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Active today"
                        value={(engagement?.active_today ?? 0).toLocaleString()}
                        icon="fa-bolt"
                        loading={loading}
                        sub={engagement?.active_now > 0 ? `${engagement.active_now} online now` : 'no one online'}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Active this week"
                        value={(engagement?.active_7d ?? 0).toLocaleString()}
                        icon="fa-calendar-week"
                        loading={loading}
                        sub="unique users"
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Decks"
                        value={content.total_decks.toLocaleString()}
                        icon="fa-layer-group"
                        loading={loading}
                        sub={`${content.total_flashcards.toLocaleString()} cards`}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Cards mastered"
                        value={content.mastered_cards.toLocaleString()}
                        icon="fa-graduation-cap"
                        loading={loading}
                        sub={`${masteredPct}% of all cards`}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Pending logins"
                        value={content.pending_approvals}
                        icon="fa-shield-halved"
                        accent={content.pending_approvals > 0}
                        loading={loading}
                        sub={content.pending_approvals > 0 ? 'need attention' : 'all clear'}
                    />
                </div>
            </div>

            {/* Engagement trend + platform usage */}
            <div className="row g-3 mb-3">
                <div className="col-xl-8 d-flex">
                    <Panel className="mb-0 flex-grow-1">
                        <PanelHeader>Engagement — last 30 days</PanelHeader>
                        <PanelBody>
                            {series.length > 0 ? (
                                <Chart type="area" height={285} options={trendOptions} series={trendSeries} />
                            ) : (
                                <EmptyState icon="fa-chart-area" title="No engagement data yet"
                                    hint="Signups and sign-ins will appear here as users join." />
                            )}
                        </PanelBody>
                    </Panel>
                </div>

                <div className="col-xl-4 d-flex flex-column gap-3">
                    <Panel className="mb-0">
                        <PanelHeader>Sessions by platform</PanelHeader>
                        <PanelBody>
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ width: 140, minWidth: 140 }}>
                                    <Chart type="donut" height={140}
                                        options={platformOptions}
                                        series={[sessions.web || 0, sessions.mobile || 0]} />
                                </div>
                                <div className="flex-grow-1">
                                    {[
                                        { label: 'Web', value: sessions.web || 0, color: accent, icon: 'fa-display' },
                                        { label: 'Mobile', value: sessions.mobile || 0, color: indigo, icon: 'fa-mobile-screen-button' },
                                    ].map((p) => (
                                        <div key={p.label} className="d-flex align-items-center justify-content-between py-2 border-bottom"
                                            style={{ fontSize: '13px' }}>
                                            <span className="d-inline-flex align-items-center gap-2">
                                                <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, background: p.color }} />
                                                {p.label}
                                            </span>
                                            <span className="fw-semibold">{p.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex align-items-center justify-content-between py-2 text-muted" style={{ fontSize: '12px' }}>
                                        <span>Total reviews</span>
                                        <span className="fw-semibold text-body">{study.total_reviews.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>

                    <Panel className="mb-0 flex-grow-1">
                        <PanelHeader>Deck sources</PanelHeader>
                        <PanelBody>
                            {deckSources.map(({ key, label }) => {
                                const count = content.deck_sources?.[key] || 0;
                                const pct = content.total_decks > 0 ? Math.round((count / content.total_decks) * 100) : 0;
                                return (
                                    <div key={key} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12px' }}>
                                            <span className="text-muted">{label}</span>
                                            <span className="fw-semibold">{count.toLocaleString()} <span className="text-muted fw-normal">({pct}%)</span></span>
                                        </div>
                                        <div className="progress" style={{ height: 5 }}>
                                            <div className="progress-bar bg-theme" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="text-muted" style={{ fontSize: '11px' }}>
                                Based on {content.total_decks.toLocaleString()} decks across all users.
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>

            {/* Recent activity + latest signups */}
            <div className="row g-3">
                <div className="col-xl-8">
                    <Panel className="mb-0">
                        <PanelHeader>Recent activity</PanelHeader>
                        <PanelBody className="py-1">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : recentEvents.length === 0 ? (
                                <EmptyState icon="fa-wave-square" title="No activity yet"
                                    hint="User signups, sign-ins, decks and study progress will show up here." />
                            ) : (
                                <div className="divide-y">
                                    {recentEvents.map((ev, i) => (
                                        <div key={i} className={i > 0 ? 'border-top' : ''}>
                                            <ActivityItem event={ev} compact />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!loading && recentEvents.length > 0 && (
                                <div className="text-center border-top py-2">
                                    <Link to="/admin/activity" className="text-decoration-none fw-semibold" style={{ fontSize: '12px' }}>
                                        View all activity <i className="fa-solid fa-arrow-right ms-1" style={{ fontSize: '10px' }}></i>
                                    </Link>
                                </div>
                            )}
                        </PanelBody>
                    </Panel>
                </div>

                <div className="col-xl-4">
                    <Panel className="mb-0">
                        <PanelHeader>Latest signups</PanelHeader>
                        <PanelBody className="py-2">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : recentSignups.length === 0 ? (
                                <EmptyState icon="fa-user-plus" title="No signups yet" />
                            ) : (
                                recentSignups.map((ev, i) => (
                                    <div key={i}
                                        className={`d-flex align-items-center justify-content-between py-2 ${i > 0 ? 'border-top' : ''}`}>
                                        <UserCell user={ev.user} />
                                        <span className="text-muted" style={{ fontSize: '11px' }} title={fmtDate(ev.timestamp)}>
                                            {timeAgo(ev.timestamp)}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div className="text-center border-top py-2 mt-1">
                                <Link to="/admin/users" className="text-decoration-none fw-semibold" style={{ fontSize: '12px' }}>
                                    All users <i className="fa-solid fa-arrow-right ms-1" style={{ fontSize: '10px' }}></i>
                                </Link>
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
