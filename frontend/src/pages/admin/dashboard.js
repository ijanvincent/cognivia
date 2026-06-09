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

const AVATAR_PALETTE = [
    '#4361ee','#7209b7','#f72585','#4cc9f0',
    '#06d6a0','#fb8500','#ef476f','#3a0ca3',
];

function avatarColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

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
    { name: 'Chrome',  visits: 13266, pct: 40, highlight: true },
    { name: 'Firefox', visits: 8291,  pct: 25, highlight: false },
    { name: 'Safari',  visits: 4969,  pct: 15, highlight: true },
    { name: 'Edge',    visits: 3313,  pct: 10, highlight: false },
    { name: 'Opera',   visits: 1656,  pct: 5,  highlight: false },
    { name: 'Other',   visits: 1634,  pct: 5,  highlight: false },
];

const TOTAL_VISITS = TRAFFIC_COUNTRIES.reduce((s, c) => s + c.visits, 0);

function SkeletonRows() {
    return (
        <div className="p-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-secondary opacity-25 flex-shrink-0"
                        style={{ width: '36px', height: '36px' }} />
                    <div className="flex-grow-1">
                        <div className="bg-secondary opacity-25 rounded mb-1" style={{ height: '11px', width: `${100 + i * 15}px` }} />
                        <div className="bg-secondary opacity-10 rounded" style={{ height: '9px', width: `${160 + i * 10}px` }} />
                    </div>
                    <div className="bg-secondary opacity-25 rounded" style={{ height: '11px', width: '70px' }} />
                    <div className="bg-secondary opacity-10 rounded" style={{ height: '28px', width: '80px' }} />
                </div>
            ))}
        </div>
    );
}

function StatCard({ label, value, icon, bg, shadow, sub, trend, trendUp }) {
    return (
        <div className="rounded-4 p-3 h-100 d-flex flex-column"
            style={{ background: bg, boxShadow: `0 8px 24px ${shadow}` }}>
            <div className="d-flex align-items-start justify-content-between mb-2">
                <div>
                    <div className="text-white text-uppercase fw-semibold mb-1 opacity-75"
                        style={{ fontSize: '10px', letterSpacing: '0.08em' }}>{label}</div>
                    <div className="text-white fw-bold lh-1" style={{ fontSize: '1.9rem' }}>
                        {value}
                    </div>
                </div>
                <div className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', fontSize: '17px', color: '#fff' }}>
                    <i className={`fa ${icon}`}></i>
                </div>
            </div>
            {trend && (
                <div className="mt-1 mb-1">
                    <span className={`badge rounded-pill px-2 py-1 small ${trendUp ? 'bg-success' : 'bg-danger'}`}
                        style={{ fontSize: '10px' }}>
                        <i className={`fa fa-arrow-${trendUp ? 'up' : 'down'} me-1`} style={{ fontSize: '9px' }}></i>
                        {trend}
                    </span>
                </div>
            )}
            <div className="mt-auto">
                <small className="text-white opacity-60" style={{ fontSize: '10px' }}>{sub}</small>
            </div>
        </div>
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
    const [users, setUsers]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast]           = useState(null);
    const [sortField, setSortField]   = useState('created_at');
    const [sortDir, setSortDir]       = useState('desc');

    const renderTrafficMap = () => {
        const themeColor  = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme') || '#00c853').trim();
        const gray500     = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500') || '#adb5bd').trim();
        const gray900     = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900') || '#212529').trim();
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
        fetchUsers();
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
        try {
            const [dashRes, contentRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/content/overview').catch(() => ({ data: {} })),
            ]);
            setStats(dashRes.data.stats);
            if (contentRes.data) setContent(contentRes.data);
        } catch (err) {
            console.error('Dashboard error:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (err) {
            console.error('Users error:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleDelete = async () => {
        if (!confirmModal) return;
        const { id, username } = confirmModal;
        setConfirmModal(null);
        setDeletingId(id);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            setStats(prev => ({
                ...prev,
                total_users:         prev.total_users - 1,
                total_deleted_users: prev.total_deleted_users + 1,
            }));
            showToast(`"${username}" moved to trash.`, 'success');
        } catch {
            showToast('Failed to delete user. Please try again.', 'danger');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return <i className="fa fa-sort ms-1 opacity-25" />;
        return <i className={`fa fa-sort-${sortDir === 'asc' ? 'up' : 'down'} ms-1 text-primary`} />;
    };

    const filteredUsers = users
        .filter(u =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            let va = a[sortField] || '';
            let vb = b[sortField] || '';
            if (sortField === 'created_at') { va = new Date(va); vb = new Date(vb); }
            else { va = va.toLowerCase(); vb = vb.toLowerCase(); }
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });

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

    const registrationTrendOptions = {
        chart: {
            type: 'area',
            height: 200,
            toolbar: { show: false },
            sparkline: { enabled: false },
            background: 'transparent',
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 95, 100],
            },
        },
        xaxis: {
            categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            labels: { style: { fontSize: '11px' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { labels: { style: { fontSize: '11px' } } },
        grid: { strokeDashArray: 4, borderColor: 'rgba(128,128,128,0.15)' },
        tooltip: { theme: 'dark' },
        colors: [themeGreen],
        legend: { show: false },
    };

    const registrationTrendSeries = [{
        name: 'New Users',
        data: [12, 18, 14, 22, 30, 28, 35, 42, 38, 50, 55, stats.new_this_month || 60],
    }];

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
            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', top: '72px', right: '20px', zIndex: 9999, minWidth: '320px' }}>
                    <div className={`alert mb-0 d-flex align-items-center border-0 shadow-lg ${toast.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                        style={{ borderRadius: '12px', borderLeft: `4px solid ${toast.type === 'success' ? '#00d96f' : '#ff4757'}` }}>
                        <i className={`fa ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2 fa-lg`}></i>
                        <span className="fw-semibold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmModal && (
                <div className="modal fade show d-block"
                    style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(3px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px' }}>
                                        <i className="fa fa-trash text-danger fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">Move to Trash</h5>
                                        <small className="text-muted">Reversible — restore from User Management</small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body px-4">
                                <div className="d-flex align-items-center p-3 rounded-3 mt-1 border"
                                    style={{ background: '#f8f9fa' }}>
                                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold me-3"
                                        style={{ width: '44px', height: '44px', minWidth: '44px', background: avatarColor(confirmModal.username), fontSize: '17px' }}>
                                        {confirmModal.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-semibold">{confirmModal.username}</div>
                                        <small className="text-muted">{confirmModal.email}</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 mt-3 p-2 rounded-2 bg-warning bg-opacity-10 border border-warning border-opacity-25">
                                    <i className="fa fa-info-circle text-warning flex-shrink-0"></i>
                                    <small className="text-warning fw-semibold">Their data will be preserved and can be restored.</small>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0 px-4 pb-4 gap-2">
                                <button className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setConfirmModal(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger rounded-3 px-4" onClick={handleDelete}>
                                    <i className="fa fa-trash me-2"></i>Move to Trash
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
                <div>
                    <ol className="breadcrumb mb-1 small">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <h1 className="page-header mb-0">
                        Welcome back,{' '}
                        <span className="text-theme">{adminUser?.username || 'Admin'}</span>
                    </h1>
                    <p className="text-muted mb-0 small">{today}</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/users/analytics" className="btn btn-outline-theme btn-sm rounded-3 px-3">
                        <i className="fa fa-chart-line me-2"></i>View Analytics
                    </Link>
                    <Link to="/admin/users" className="btn btn-theme btn-sm rounded-3 px-3">
                        <i className="fa fa-users me-2"></i>Manage Users
                    </Link>
                </div>
            </div>

            {/* ── Stat Cards Row ── */}
            <div className="row g-3 mb-4">
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Total Users"
                        value={stats.total_users.toLocaleString()}
                        icon="fa-users"
                        bg="linear-gradient(135deg,#4361ee 0%,#3a0ca3 100%)"
                        shadow="rgba(67,97,238,0.30)"
                        sub="All registered accounts"
                        trend={`${growthRate}% this month`}
                        trendUp={parseFloat(growthRate) >= 0}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="New Today"
                        value={stats.new_today}
                        icon="fa-user-plus"
                        bg="linear-gradient(135deg,#06d6a0 0%,#028a5b 100%)"
                        shadow="rgba(6,214,160,0.30)"
                        sub="Registered in last 24h"
                        trend={stats.new_today > 0 ? '+' + stats.new_today : null}
                        trendUp={true}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="This Month"
                        value={stats.new_this_month}
                        icon="fa-calendar-check"
                        bg="linear-gradient(135deg,#fb8500 0%,#d4620f 100%)"
                        shadow="rgba(251,133,0,0.30)"
                        sub={`${new Date().toLocaleString('default',{month:'long'})} signups`}
                        trend={stats.new_this_month > 0 ? `+${stats.new_this_month}` : null}
                        trendUp={true}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Growth Rate"
                        value={`${growthRate}%`}
                        icon="fa-chart-line"
                        bg="linear-gradient(135deg,#7209b7 0%,#560bad 100%)"
                        shadow="rgba(114,9,183,0.30)"
                        sub="Month-over-month growth"
                        trend={parseFloat(growthRate) > 0 ? `+${growthRate}%` : `${growthRate}%`}
                        trendUp={parseFloat(growthRate) >= 0}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Page Views"
                        value={TOTAL_VISITS.toLocaleString()}
                        icon="fa-eye"
                        bg="linear-gradient(135deg,#0d6efd 0%,#0a58ca 100%)"
                        shadow="rgba(13,110,253,0.30)"
                        sub="Traffic last 24h"
                        trend="+8.5% vs last month"
                        trendUp={true}
                    />
                </div>
                <div className="col-xl-2 col-md-4 col-6">
                    <StatCard
                        label="Trashed Users"
                        value={stats.total_deleted_users}
                        icon="fa-trash"
                        bg="linear-gradient(135deg,#ef476f 0%,#b91543 100%)"
                        shadow="rgba(239,71,111,0.30)"
                        sub="Soft-deleted accounts"
                    />
                </div>
            </div>

            {/* ── Traffic Analytics + User Distribution ── */}
            <div className="row g-3 mb-4">

                {/* Traffic Analytics Panel */}
                <div className="col-xl-8">
                    <Panel>
                        <PanelHeader className="">
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                Traffic Analytics
                            </span>
                        </PanelHeader>
                        <PanelBody className="p-0">
                            <div className="row g-0">
                                {/* World Map */}
                                <div className="col-lg-7 position-relative" style={{ minHeight: '320px' }}>
                                    <div id="adminTrafficMap" style={{ width: '100%', height: '320px' }}></div>
                                    <div className="position-absolute bottom-0 start-0 p-3">
                                        <small className="text-muted" style={{ fontSize: '10px' }}>
                                            <i className="fa fa-circle me-1 text-theme" style={{ fontSize: '8px' }}></i>
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
                                                [{TOTAL_VISITS.toLocaleString()}]
                                            </div>
                                        </div>
                                        <span className="badge rounded-pill px-2 py-1 text-success border border-success"
                                            style={{ fontSize: '11px', background: 'rgba(0,200,83,0.1)' }}>
                                            <i className="fa fa-arrow-up me-1" style={{ fontSize: '9px' }}></i>
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
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Pct%</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TRAFFIC_COUNTRIES.slice(0, 7).map((c, i) => (
                                                    <tr key={i} className={c.name === 'Philippines' ? 'text-theme fw-semibold' : ''}>
                                                        <td className="border-0 py-1">{c.name.toUpperCase()}</td>
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
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>No/m</th>
                                                    <th className="border-0 text-muted fw-semibold text-uppercase py-1 text-end"
                                                        style={{ fontSize: '9px', letterSpacing: '0.07em' }}>Pct%</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TRAFFIC_BROWSERS.map((b, i) => (
                                                    <tr key={i} className={b.highlight ? 'fw-semibold' : ''}>
                                                        <td className="border-0 py-1">{b.name}</td>
                                                        <td className="border-0 py-1 text-end">{b.visits.toLocaleString()}</td>
                                                        <td className="border-0 py-1 text-end"
                                                            style={{ color: b.highlight ? themeGreen : undefined }}>
                                                            {b.pct}%
                                                        </td>
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
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                User Distribution
                            </span>
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

            {/* ── Registration Trend + Analytics Details ── */}
            <div className="row g-3 mb-4">

                {/* Registration Trend Chart */}
                <div className="col-xl-8">
                    <Panel>
                        <PanelHeader className="">
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                Registration Trend
                            </span>
                        </PanelHeader>
                        <PanelBody>
                            <Chart
                                type="area"
                                height={200}
                                options={registrationTrendOptions}
                                series={registrationTrendSeries}
                            />
                        </PanelBody>
                    </Panel>
                </div>

                {/* Analytics Details Sparkline Table */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                Analytics Details
                            </span>
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
                                            { label: 'Unique Visitors', badge: 'bg-danger',  value: TOTAL_VISITS.toLocaleString(), data: [789,880,676,200,890,677,900] },
                                            { label: 'Bounce Rate',     badge: 'bg-warning', value: '28.2%',         data: [200,300,280,350,290,310,270] },
                                            { label: 'Page Views',      badge: 'bg-success', value: '1,230,030',     data: [789,880,676,200,890,677,900] },
                                            { label: 'Avg Time On Site',badge: 'bg-primary', value: '00:03:45',      data: [500,700,650,800,750,900,850] },
                                            { label: '% New Visits',    badge: 'bg-gray-500',value: '40.5%',         data: [400,500,450,600,550,700,650] },
                                            { label: 'Return Visitors', badge: 'bg-inverse', value: '73.4%',         data: [600,750,700,850,800,950,900] },
                                        ].map((row, i) => {
                                            const colors = ['#ef476f','#fb8500','#06d6a0','#4361ee','#adb5bd','#212529'];
                                            return (
                                                <tr key={i}>
                                                    <td><label className={`badge ${row.badge}`}>{row.label}</label></td>
                                                    <td>{row.value}</td>
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
            </div>

            {/* ── Business Metrics + Top Countries + System Overview ── */}
            <div className="row g-3 mb-4">

                {/* Business Metrics */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                Business Metrics
                            </span>
                        </PanelHeader>
                        <PanelBody>
                            <div className="row g-3">
                                {[
                                    { icon: 'fa-users',        label: 'Total Users',   value: stats.total_users.toLocaleString(),      color: '#4361ee' },
                                    { icon: 'fa-layer-group',  label: 'Total Decks',   value: content.total_decks.toLocaleString(),    color: '#7209b7' },
                                    { icon: 'fa-clone',        label: 'Flashcards',    value: content.total_flashcards.toLocaleString(), color: '#0d6efd' },
                                    { icon: 'fa-robot',        label: 'AI Generated',  value: content.ai_generated.toLocaleString(),   color: '#06d6a0' },
                                    { icon: 'fa-check-double', label: 'Mastered',      value: content.mastered_cards.toLocaleString(), color: '#fb8500' },
                                    { icon: 'fa-shield-alt',   label: 'Pending Logins',value: content.pending_approvals,              color: content.pending_approvals > 0 ? '#ef476f' : '#6c757d' },
                                ].map((m, i) => (
                                    <div key={i} className="col-6">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '36px', height: '36px', background: m.color + '22', color: m.color }}>
                                                <i className={`fa ${m.icon}`} style={{ fontSize: '14px' }}></i>
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

                {/* Top Traffic Sources */}
                <div className="col-xl-4">
                    <Panel>
                        <PanelHeader className="">
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                Top Traffic Sources
                            </span>
                        </PanelHeader>
                        <PanelBody className="p-0">
                            <div className="px-3 py-2">
                                {TRAFFIC_COUNTRIES.slice(0, 5).map((c, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="small fw-semibold">{c.name}</span>
                                            <span className="small text-muted">{c.visits.toLocaleString()}</span>
                                        </div>
                                        <div className="progress" style={{ height: '5px', borderRadius: '10px' }}>
                                            <div className="progress-bar"
                                                style={{
                                                    width: `${c.pct}%`,
                                                    background: i === 0 ? themeGreen : i === 1 ? '#4361ee' : i === 2 ? '#fb8500' : '#0d6efd',
                                                    borderRadius: '10px',
                                                }}>
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
                            <span className="text-uppercase fw-bold" style={{ letterSpacing: '0.06em', fontSize: '12px' }}>
                                Operational Overview
                            </span>
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
                                    { label: 'AUTH', value: 'JWT + BCRYPT',        color: themeGreen },
                                    { label: 'ENCRYPTION', value: 'AES-256',        color: '#4361ee' },
                                    { label: 'ACCESS CTRL', value: 'ADMIN MIDDLEWARE', color: '#fb8500' },
                                    { label: 'SOFT DELETE', value: 'ENABLED',       color: '#06d6a0' },
                                ].map((r, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{r.label}:</span>
                                        <span className="fw-semibold" style={{ fontSize: '11px', color: r.color }}>{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>

            {/* ── Registered Users Table ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="panel panel-inverse">
                        <div className="panel-heading d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <h4 className="panel-title mb-0">Registered Users</h4>
                                {!loading && (
                                    <span className="badge bg-primary rounded-pill">{filteredUsers.length}</span>
                                )}
                            </div>
                            <div className="input-group input-group-sm" style={{ width: '280px' }}>
                                <span className="input-group-text bg-transparent">
                                    <i className="fa fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search username or email..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch('')}>
                                        <i className="fa fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="panel-body p-0">
                            {loading ? (
                                <SkeletonRows />
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <div className="mb-3 opacity-25" style={{ fontSize: '52px' }}>
                                        <i className="fa fa-users"></i>
                                    </div>
                                    <div className="fw-semibold fs-6">
                                        {search ? `No results for "${search}"` : 'No users registered yet'}
                                    </div>
                                    {search && (
                                        <button className="btn btn-sm btn-outline-secondary mt-2 rounded-3"
                                            onClick={() => setSearch('')}>
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="border-bottom" style={{ background: 'rgba(0,0,0,0.025)' }}>
                                            <tr>
                                                <th className="ps-4 py-3 fw-semibold text-muted small border-0" width="50">#</th>
                                                <th className="py-3 fw-semibold text-muted small border-0"
                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('username')}>
                                                    User {sortIcon('username')}
                                                </th>
                                                <th className="py-3 fw-semibold text-muted small border-0"
                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('email')}>
                                                    Email {sortIcon('email')}
                                                </th>
                                                <th className="py-3 fw-semibold text-muted small border-0"
                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                    onClick={() => handleSort('created_at')}>
                                                    Joined {sortIcon('created_at')}
                                                </th>
                                                <th className="py-3 fw-semibold text-muted small border-0 text-end pe-4" width="110">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user, index) => (
                                                <tr key={user.id} style={{
                                                    opacity: deletingId === user.id ? 0.4 : 1,
                                                    transition: 'opacity 0.3s ease',
                                                }}>
                                                    <td className="ps-4 text-muted small">{index + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                                style={{ width: '36px', height: '36px', background: avatarColor(user.username), fontSize: '14px' }}>
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="fw-semibold">{user.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small">{user.email}</td>
                                                    <td>
                                                        <span className="text-muted small d-block">{timeAgo(user.created_at)}</span>
                                                        <span className="text-muted" style={{ fontSize: '11px', opacity: 0.6 }}>
                                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        {deletingId === user.id ? (
                                                            <button className="btn btn-danger btn-sm rounded-3" disabled>
                                                                <span className="spinner-border spinner-border-sm me-1" />
                                                                Deleting
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm rounded-3 px-3"
                                                                onClick={() => setConfirmModal(user)}
                                                                title="Delete user"
                                                            >
                                                                <i className="fa fa-trash me-1"></i>Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {!loading && filteredUsers.length > 0 && (
                            <div className="panel-footer d-flex align-items-center justify-content-between px-4 py-2 border-top bg-transparent">
                                <small className="text-muted">
                                    Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
                                </small>
                                <Link to="/admin/users" className="btn btn-sm btn-link text-decoration-none pe-0">
                                    Full user list <i className="fa fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
