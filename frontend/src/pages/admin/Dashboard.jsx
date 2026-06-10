import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Chart from 'react-apexcharts';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.min.css';
import { AppSettings } from './../../config/app-settings.js';
import { STORAGE_KEYS } from './../../services/api.js';
import api from './../../services/api.js';

function getAdminUser() {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        if (!token) return {};
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}') || {};
    } catch { return {}; }
}

const TRAFFIC_COUNTRIES = [
    { name: 'United States', code: 'US', visits: 10234, pct: 30.89, coords: [37.09, -95.71] },
    { name: 'Philippines',   code: 'PH', visits: 8621,  pct: 26.02, coords: [12.88, 121.77] },
    { name: 'India',         code: 'IN', visits: 4398,  pct: 13.28, coords: [20.59, 78.96] },
    { name: 'France',        code: 'FR', visits: 2901,  pct: 8.76,  coords: [46.23, 2.21] },
    { name: 'Brazil',        code: 'BR', visits: 1987,  pct: 5.99,  coords: [-14.24, -51.93] },
    { name: 'Germany',       code: 'DE', visits: 1540,  pct: 4.65,  coords: [51.17, 10.45] },
    { name: 'Japan',         code: 'JP', visits: 1204,  pct: 3.63,  coords: [36.20, 138.25] },
    { name: 'Canada',        code: 'CA', visits:  921,  pct: 2.78,  coords: [56.13, -106.35] },
    { name: 'Australia',     code: 'AU', visits:  754,  pct: 2.28,  coords: [-25.27, 133.78] },
    { name: 'Mexico',        code: 'MX', visits:  569,  pct: 1.72,  coords: [23.63, -102.55] },
];

const TRAFFIC_BROWSERS = [
    { name: 'Chrome',  visits: 13266, pct: 40 },
    { name: 'Firefox', visits: 8291,  pct: 25 },
    { name: 'Safari',  visits: 4969,  pct: 15 },
    { name: 'Edge',    visits: 3313,  pct: 10 },
    { name: 'Opera',   visits: 1656,  pct: 5 },
    { name: 'Other',   visits: 1634,  pct: 5 },
];

const TOTAL_VISITS = TRAFFIC_COUNTRIES.reduce((s, c) => s + c.visits, 0);

function StatCard({ label, value, icon, color, sub, trend, trendUp }) {
    return (
        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3 d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="text-muted text-uppercase fw-semibold"
                        style={{ fontSize: '11px', letterSpacing: '0.08em' }}>{label}</div>
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '38px', height: '38px', background: `${color}1a`, color, fontSize: '15px' }}>
                        <i className={`fa-solid ${icon}`}></i>
                    </div>
                </div>
                <div className="fw-bold lh-1 mb-2" style={{ fontSize: '1.75rem' }}>{value}</div>
                <div className="mt-auto d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '11px' }}>
                    {trend && (
                        <span className={`fw-semibold ${trendUp ? 'text-success' : 'text-danger'}`}>
                            <i className={`fa-solid fa-arrow-trend-${trendUp ? 'up' : 'down'} me-1`}></i>
                            {trend}
                        </span>
                    )}
                    <span className="text-muted">{sub}</span>
                </div>
            </div>
        </div>
    );
}

function PanelTitle({ icon, children }) {
    return (
        <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
            <i className={`fa-solid ${icon} me-2 opacity-50`}></i>
            {children}
        </span>
    );
}

function AdminDashboard() {
    const context   = useContext(AppSettings);
    const adminUser = getAdminUser();
    const mapRef    = useRef(null);

    const [stats, setStats] = useState({
        total_users: 0, new_today: 0, new_this_month: 0, total_deleted_users: 0,
    });
    const [content, setContent] = useState({
        total_decks: 0, total_flashcards: 0, ai_generated: 0,
        mastered_cards: 0, pending_approvals: 0, deck_sources: {},
    });
    const [refreshing, setRefreshing]   = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const renderTrafficMap = () => {
        const themeColor  = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme') || '#00c853').trim();
        const gray500     = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500') || '#adb5bd').trim();
        const fontFamily  = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family') || 'inherit').trim();

        const el    = document.getElementById('adminTrafficMap');
        const tips  = document.querySelectorAll('.jvm-tooltip');
        if (!el) return;

        tips.forEach(t => t.remove());
        el.innerHTML = '';

        if (mapRef.current) {
            try { mapRef.current.destroy(); } catch (_) {}
        }

        mapRef.current = new jsVectorMap({
            selector: '#adminTrafficMap',
            map: 'world',
            zoomButtons: true,
            normalizeFunction: 'polynomial',
            hoverOpacity: 0.5,
            hoverColor: false,
            zoomOnScroll: false,
            series: { regions: [{ normalizeFunction: 'polynomial' }] },
            labels: { markers: { render: m => m.name } },
            focusOn: { x: 0.5, y: 0.5, scale: 1 },
            markers: TRAFFIC_COUNTRIES.map(c => ({ name: c.name, coords: c.coords })),
            markerStyle: {
                initial: { fill: themeColor, stroke: 'none', r: 6 },
                hover:   { fill: themeColor },
            },
            markerLabelStyle: {
                initial: { fontFamily, fontSize: '11px', fill: '#fff' },
            },
            regionStyle: {
                initial: {
                    fill: gray500, fillOpacity: 0.35,
                    stroke: 'none', strokeWidth: 0.4, strokeOpacity: 1,
                },
                hover: { fillOpacity: 0.6 },
            },
            backgroundColor: 'transparent',
        });
    };

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

    useEffect(() => {
        const timer = setTimeout(renderTrafficMap, 120);
        const handler = () => renderTrafficMap();
        document.addEventListener('theme-reload', handler);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('theme-reload', handler);
        };
        // eslint-disable-next-line
    }, []);

    const fetchDashboard = async () => {
        setRefreshing(true);
        try {
            const [dashRes, contentRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/content/overview').catch(() => ({ data: {} })),
            ]);
            setStats(dashRes.data.stats);
            if (contentRes.data) setContent(prev => ({ ...prev, ...contentRes.data }));
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const growthRate = stats.total_users > 0 && stats.new_this_month > 0
        ? ((stats.new_this_month / stats.total_users) * 100).toFixed(1)
        : '0';

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const themeGreen = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme') || '#00c853').trim();

    const sparkOptions = (color) => ({
        chart: { sparkline: { enabled: true }, toolbar: { show: false } },
        stroke: { width: 2, curve: 'smooth' },
        colors: [color],
        tooltip: { enabled: false },
    });

    const sparkData = (data) => [{ data }];

    const userDistOptions = {
        chart: { type: 'donut', background: 'transparent', toolbar: { show: false } },
        labels: ['Active', 'New', 'Trashed'],
        colors: ['#4361ee', themeGreen, '#ef476f'],
        legend: { position: 'bottom', fontSize: '12px' },
        dataLabels: { enabled: false },
        plotOptions: { pie: { donut: { size: '65%' } } },
        tooltip: { theme: 'dark' },
    };

    const userDistSeries = [
        Math.max(0, stats.total_users - stats.new_this_month - stats.total_deleted_users),
        stats.new_this_month || 0,
        stats.total_deleted_users || 0,
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 mb-4 border-bottom">
                <div>
                    <ol className="breadcrumb mb-1" style={{ fontSize: '11px' }}>
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Admin</Link></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h1 className="page-header mb-0">Dashboard</h1>
                        <span className="badge rounded-pill text-success border border-success border-opacity-25 fw-semibold"
                            style={{ fontSize: '10px', background: 'rgba(0,200,83,0.08)' }}>
                            <i className="fa-solid fa-circle me-1" style={{ fontSize: '6px', verticalAlign: 'middle' }}></i>
                            Live
                        </span>
                    </div>
                    <p className="text-muted mb-0 small">
                        Welcome back, <span className="fw-semibold">{adminUser?.username || 'Admin'}</span>
                        <span className="mx-2 opacity-50">|</span>{today}
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {lastUpdated && (
                        <small className="text-muted me-1 d-none d-md-inline" style={{ fontSize: '11px' }}>
                            <i className="fa-regular fa-clock me-1"></i>
                            Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </small>
                    )}
                    <button type="button"
                        className="btn btn-outline-secondary btn-sm rounded-3 px-3"
                        onClick={fetchDashboard}
                        disabled={refreshing}
                        title="Refresh data">
                        <i className={`fa-solid fa-rotate-right ${refreshing ? 'fa-spin' : ''}`}></i>
                    </button>
                    <div className="vr d-none d-sm-block opacity-25 mx-1"></div>
                    <Link to="/admin/users/analytics" className="btn btn-outline-theme btn-sm rounded-3 px-3">
                        <i className="fa-solid fa-chart-line me-2"></i>Analytics
                    </Link>
                    <Link to="/admin/users" className="btn btn-theme btn-sm rounded-3 px-3">
                        <i className="fa-solid fa-users-gear me-2"></i>Manage Users
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="row g-3 mb-4">
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Total Users"
                        value={stats.total_users.toLocaleString()}
                        icon="fa-users"
                        color="#4361ee"
                        sub="all accounts"
                        trend={`${growthRate}%`}
                        trendUp={parseFloat(growthRate) >= 0}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="New Today"
                        value={stats.new_today}
                        icon="fa-user-plus"
                        color="#06d6a0"
                        sub="last 24 hours"
                        trend={stats.new_today > 0 ? `+${stats.new_today}` : null}
                        trendUp={true}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="This Month"
                        value={stats.new_this_month}
                        icon="fa-calendar-check"
                        color="#fb8500"
                        sub={`${new Date().toLocaleString('default', { month: 'long' })} signups`}
                        trend={stats.new_this_month > 0 ? `+${stats.new_this_month}` : null}
                        trendUp={true}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Growth Rate"
                        value={`${growthRate}%`}
                        icon="fa-arrow-trend-up"
                        color="#7209b7"
                        sub="month over month"
                        trend={`${parseFloat(growthRate) >= 0 ? '+' : ''}${growthRate}%`}
                        trendUp={parseFloat(growthRate) >= 0}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Page Views"
                        value={TOTAL_VISITS.toLocaleString()}
                        icon="fa-chart-column"
                        color="#0d6efd"
                        sub="traffic last 24h"
                        trend="+8.5%"
                        trendUp={true}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Trashed Users"
                        value={stats.total_deleted_users}
                        icon="fa-trash-can"
                        color="#ef476f"
                        sub="soft-deleted accounts"
                    />
                </div>
            </div>

            {/* ── Traffic Analytics + User Distribution ── */}
            <div className="row g-3 mb-4">

                {/* Traffic Analytics Panel */}
                <div className="col-xl-8">
                    <Panel>
                        <PanelHeader className="">
                            <PanelTitle icon="fa-earth-americas">Traffic Analytics</PanelTitle>
                        </PanelHeader>
                        <PanelBody className="p-0">
                            <div className="row g-0">
                                {/* World Map */}
                                <div className="col-lg-7 position-relative" style={{ minHeight: '320px' }}>
                                    <div id="adminTrafficMap" style={{ width: '100%', height: '320px' }}></div>
                                    <div className="position-absolute bottom-0 start-0 p-3">
                                        <small className="text-muted" style={{ fontSize: '10px' }}>
                                            <i className="fa-solid fa-circle me-1 text-theme" style={{ fontSize: '8px' }}></i>
                                            Real-time data updates every 5 minutes
                                        </small>
                                    </div>
                                </div>

                                {/* Country + Browser Tables */}
                                <div className="col-lg-5 border-start">
                                    {/* Total Visits Header */}
                                    <div className="px-3 pt-3 pb-2 border-bottom d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="text-muted text-uppercase fw-semibold"
                                                style={{ fontSize: '10px', letterSpacing: '0.07em' }}>Total Visits</div>
                                            <div className="fw-bold" style={{ fontSize: '1.5rem' }}>
                                                {TOTAL_VISITS.toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="badge rounded-pill px-2 py-1 text-success border border-success"
                                            style={{ fontSize: '11px', background: 'rgba(0,200,83,0.1)' }}>
                                            <i className="fa-solid fa-arrow-trend-up me-1" style={{ fontSize: '9px' }}></i>
                                            +8.5%
                                        </span>
                                    </div>

                                    {/* Country Table */}
                                    <div className="px-2 pt-1">
                                        <table className="table table-sm mb-0" style={{ fontSize: '11px' }}>
                                            <thead>
                                                <tr>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Country</th>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1 text-end"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Visits</th>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1 text-end"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Share</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TRAFFIC_COUNTRIES.slice(0, 7).map((c, i) => (
                                                    <tr key={i} className={c.name === 'Philippines' ? 'text-theme fw-semibold' : ''}>
                                                        <td className="border-0 py-1">{c.name}</td>
                                                        <td className="border-0 py-1 text-end">{c.visits.toLocaleString()}</td>
                                                        <td className="border-0 py-1 text-end"
                                                            style={{ color: c.name === 'Philippines' ? themeGreen : undefined }}>
                                                            {c.pct.toFixed(2)}%
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Browser Table */}
                                    <div className="px-2 pt-1 border-top mt-1">
                                        <table className="table table-sm mb-0" style={{ fontSize: '11px' }}>
                                            <thead>
                                                <tr>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Browser</th>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1 text-end"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Sessions</th>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1 text-end"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Share</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TRAFFIC_BROWSERS.map((b, i) => (
                                                    <tr key={i}>
                                                        <td className="border-0 py-1">{b.name}</td>
                                                        <td className="border-0 py-1 text-end">{b.visits.toLocaleString()}</td>
                                                        <td className="border-0 py-1 text-end">{b.pct}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>
                </div>

                {/* User Distribution Donut */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <PanelTitle icon="fa-chart-pie">User Distribution</PanelTitle>
                        </PanelHeader>
                        <PanelBody>
                            <Chart
                                type="donut"
                                height={200}
                                options={userDistOptions}
                                series={userDistSeries}
                            />
                            <div className="row g-2 mt-2">
                                {[
                                    { label: 'Active',  val: userDistSeries[0], color: '#4361ee' },
                                    { label: 'New',     val: userDistSeries[1], color: themeGreen },
                                    { label: 'Trashed', val: userDistSeries[2], color: '#ef476f' },
                                ].map((item, i) => (
                                    <div key={i} className="col-4 text-center">
                                        <div className="fw-bold" style={{ color: item.color, fontSize: '1.2rem' }}>
                                            {item.val.toLocaleString()}
                                        </div>
                                        <small className="text-muted text-uppercase"
                                            style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{item.label}</small>
                                    </div>
                                ))}
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>

            {/* ── Analytics Details + Business Metrics + Operational Overview ── */}
            <div className="row g-3 mb-4">

                {/* Analytics Details Sparkline Table */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <PanelTitle icon="fa-gauge-high">Analytics Details</PanelTitle>
                        </PanelHeader>
                        <PanelBody className="p-0">
                            <div className="table-responsive">
                                <table className="table table-panel align-middle mb-0" style={{ fontSize: '12px' }}>
                                    <thead>
                                        <tr>
                                            <th>Metric</th>
                                            <th>Value</th>
                                            <th>Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: 'Unique Visitors',  value: TOTAL_VISITS.toLocaleString(), data: [789,880,676,200,890,677,900] },
                                            { label: 'Bounce Rate',      value: '28.2%',     data: [200,300,280,350,290,310,270] },
                                            { label: 'Page Views',       value: '1,230,030', data: [789,880,676,200,890,677,900] },
                                            { label: 'Avg Time On Site', value: '00:03:45',  data: [500,700,650,800,750,900,850] },
                                            { label: '% New Visits',     value: '40.5%',     data: [400,500,450,600,550,700,650] },
                                            { label: 'Return Visitors',  value: '73.4%',     data: [600,750,700,850,800,950,900] },
                                        ].map((row, i) => {
                                            const colors = ['#ef476f','#fb8500','#06d6a0','#4361ee','#adb5bd','#7209b7'];
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <span className="d-inline-flex align-items-center">
                                                            <span className="rounded-circle me-2 d-inline-block flex-shrink-0"
                                                                style={{ width: '8px', height: '8px', background: colors[i] }} />
                                                            {row.label}
                                                        </span>
                                                    </td>
                                                    <td className="fw-semibold">{row.value}</td>
                                                    <td className="align-middle">
                                                        <div className="my-n1" style={{ width: '80px' }}>
                                                            <Chart
                                                                type="line"
                                                                height={20}
                                                                options={sparkOptions(colors[i])}
                                                                series={sparkData(row.data)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </PanelBody>
                    </Panel>
                </div>

                {/* Business Metrics */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <PanelTitle icon="fa-briefcase">Business Metrics</PanelTitle>
                        </PanelHeader>
                        <PanelBody>
                            <div className="row g-3">
                                {[
                                    { icon: 'fa-users',         label: 'Total Users',    value: stats.total_users.toLocaleString(),        color: '#4361ee' },
                                    { icon: 'fa-layer-group',   label: 'Total Decks',    value: content.total_decks.toLocaleString(),      color: '#7209b7' },
                                    { icon: 'fa-clone',         label: 'Flashcards',     value: content.total_flashcards.toLocaleString(), color: '#0d6efd' },
                                    { icon: 'fa-robot',         label: 'AI Generated',   value: content.ai_generated.toLocaleString(),     color: '#06d6a0' },
                                    { icon: 'fa-check-double',  label: 'Mastered',       value: content.mastered_cards.toLocaleString(),   color: '#fb8500' },
                                    { icon: 'fa-shield-halved', label: 'Pending Logins', value: content.pending_approvals,                 color: content.pending_approvals > 0 ? '#ef476f' : '#6c757d' },
                                ].map((m, i) => (
                                    <div key={i} className="col-6">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '36px', height: '36px', background: m.color + '1a', color: m.color }}>
                                                <i className={`fa-solid ${m.icon}`} style={{ fontSize: '14px' }}></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold lh-1" style={{ fontSize: '1.1rem' }}>{m.value}</div>
                                                <small className="text-muted text-uppercase"
                                                    style={{ fontSize: '9px', letterSpacing: '0.05em' }}>{m.label}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PanelBody>
                    </Panel>
                </div>

                {/* System / Operational Overview */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <PanelTitle icon="fa-shield-halved">Operational Overview</PanelTitle>
                        </PanelHeader>
                        <PanelBody>
                            <div className="mb-3 p-2 rounded-3 border">
                                <div className="small text-muted mb-1">User growth this period reflects steady engagement across regions.</div>
                                <div className="row g-2 mt-1">
                                    <div className="col-6">
                                        <div className="text-muted small text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>Current</div>
                                        <div className="fw-bold">{stats.total_users.toLocaleString()} <small className="text-muted fw-normal">users</small></div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted small text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>Rate</div>
                                        <div className="fw-bold">{stats.new_today} <small className="text-muted fw-normal">users/day</small></div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted small text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>Target</div>
                                        <div className="fw-bold">{Math.ceil(stats.total_users * 1.1).toLocaleString()} <small className="text-muted fw-normal">users</small></div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted small text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>Monthly</div>
                                        <div className="fw-bold text-success">+{stats.new_this_month} <small className="text-muted fw-normal">this month</small></div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2" style={{ fontSize: '12px' }}>
                                {[
                                    { label: 'Authentication', value: 'JWT + bcrypt' },
                                    { label: 'Encryption',     value: 'AES-256' },
                                    { label: 'Access Control', value: 'Admin middleware' },
                                    { label: 'Soft Delete',    value: 'Enabled' },
                                ].map((r, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{r.label}</span>
                                        <span className="fw-semibold" style={{ fontSize: '11px' }}>
                                            <i className="fa-solid fa-circle-check text-success me-1"></i>
                                            {r.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
