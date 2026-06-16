import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import {
    PageHeader, StatCard, UserCell, EmptyState,
    themeColor, timeAgo, fmtDate,
} from './components/admin-ui.jsx';
import { adminPath } from './../../config/admin-path';

function cssVar(name, fallback) {
    return (getComputedStyle(document.body).getPropertyValue(name) || fallback).trim();
}

const MONTHS_SHOWN = 12;

function monthKey(d) {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// First day of each of the last N calendar months, oldest first.
function lastMonths(n) {
    return [...Array(n)].map((_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        d.setMonth(d.getMonth() - (n - 1 - i));
        return d;
    });
}

function lastDays(n) {
    return [...Array(n)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (n - 1 - i));
        return d.toISOString().split('T')[0];
    });
}

function AdminUsersAnalytics() {
    const context = useContext(AppSettings);

    const [stats, setStats]     = useState({ total_users: 0, new_today: 0, new_this_month: 0 });
    const [users, setUsers]     = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [dashRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/users'),
            ]);
            setStats(dashRes.data.stats);
            setUsers(usersRes.data.users || []);
        } catch (err) {
            console.error('Analytics error:', err);
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

    const accent  = themeColor();
    const indigo  = cssVar('--bs-indigo', '#8753de');
    const gridCol = cssVar('--bs-border-color', '#e4e7ec');
    const muted   = cssVar('--bs-gray-500', '#adb5bd');

    // ---- Derived metrics (all-time buckets keyed by "Jun 2026") ------------
    const usersByMonth = users.reduce((acc, u) => {
        const key = monthKey(new Date(u.created_at));
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const months      = lastMonths(MONTHS_SHOWN);
    const monthlyNew  = months.map(m => usersByMonth[monthKey(m)] || 0);
    const monthLabels = months.map(m => m.toLocaleDateString('en-US', { month: 'short' }));

    let running = users.filter(u => new Date(u.created_at) < months[0]).length;
    const cumulative = monthlyNew.map(c => (running += c));

    const days14   = lastDays(14);
    const daily14  = days14.map(day => users.filter(u => (u.created_at || '').startsWith(day)).length);
    const thisWeek = daily14.slice(7).reduce((a, b) => a + b, 0);
    const lastWeek = daily14.slice(0, 7).reduce((a, b) => a + b, 0);
    const weekDelta = lastWeek > 0
        ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
        : thisWeek > 0 ? 100 : 0;

    const totalUsers  = stats.total_users;
    const activeMonths = Object.keys(usersByMonth).length;
    const avgPerMonth  = activeMonths > 0 ? (totalUsers / activeMonths).toFixed(1) : '0';
    const bestMonth    = Object.entries(usersByMonth).sort((a, b) => b[1] - a[1])[0];
    const growthRate   = totalUsers > 0 && stats.new_this_month > 0
        ? ((stats.new_this_month / totalUsers) * 100).toFixed(1) : null;

    const recentUsers = [...users]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8);

    // ---- Charts -------------------------------------------------------------
    const growthOptions = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
        colors: [accent, indigo],
        stroke: { width: [0, 2], curve: 'smooth' },
        plotOptions: { bar: { columnWidth: '45%', borderRadius: 3 } },
        dataLabels: { enabled: false },
        grid: { borderColor: gridCol, strokeDashArray: 3, padding: { left: 8, right: 8 } },
        legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: { colors: muted } },
        xaxis: {
            categories: monthLabels,
            labels: { style: { colors: muted, fontSize: '11px' } },
            axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: [
            {
                labels: { style: { colors: muted, fontSize: '11px' }, formatter: v => Math.round(v) },
                min: 0, forceNiceScale: true,
            },
            {
                opposite: true,
                labels: { style: { colors: muted, fontSize: '11px' }, formatter: v => Math.round(v) },
                min: 0, forceNiceScale: true,
            },
        ],
        tooltip: { shared: true, intersect: false },
    };
    const growthSeries = [
        { name: 'New signups', type: 'column', data: monthlyNew },
        { name: 'Total users', type: 'line',   data: cumulative },
    ];

    const dailyOptions = {
        chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
        colors: [accent],
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 2 } },
        dataLabels: { enabled: false },
        grid: { borderColor: gridCol, strokeDashArray: 3, padding: { left: 4, right: 4 } },
        xaxis: {
            categories: days14,
            labels: {
                style: { colors: muted, fontSize: '10px' },
                formatter: v => new Date(v).toLocaleDateString('en-US', { day: 'numeric' }),
            },
            axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: {
            labels: { style: { colors: muted, fontSize: '11px' }, formatter: v => Math.round(v) },
            min: 0, forceNiceScale: true,
        },
        tooltip: {
            x: { formatter: v => fmtDate(v) },
            y: { formatter: v => `${v} signup${v === 1 ? '' : 's'}` },
        },
    };
    const dailySeries = [{ name: 'Signups', data: daily14 }];

    // Months that actually have data, newest first, for the breakdown table.
    const monthRows = Object.entries(usersByMonth)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]));
    const peakCount = monthRows.reduce((max, [, c]) => Math.max(max, c), 0);

    return (
        <div>
            <PageHeader
                crumbs={[
                    { label: 'Admin', to: adminPath('/dashboard') },
                    { label: 'Users', to: adminPath('/users') },
                    { label: 'Analytics' },
                ]}
                title="User Analytics"
                subtitle="Registration trends and growth across the platform"
            >
                <Link to={adminPath('/users')} className="btn btn-default btn-sm">
                    <i className="fa-solid fa-users me-2"></i>All users
                </Link>
                <button type="button" className="btn btn-default btn-sm" onClick={fetchData} title="Refresh">
                    <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i>
                </button>
            </PageHeader>

            {/* KPI row */}
            <div className="row g-3 mb-3">
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        label="Total users"
                        value={totalUsers.toLocaleString()}
                        icon="fa-users"
                        loading={loading}
                        delta={weekDelta !== 0 ? `${Math.abs(weekDelta)}%` : null}
                        deltaUp={weekDelta >= 0}
                        sub="vs previous week"
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        label="New today"
                        value={stats.new_today.toLocaleString()}
                        icon="fa-user-plus"
                        accent={stats.new_today > 0}
                        loading={loading}
                        sub={`${thisWeek} in the last 7 days`}
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        label="This month"
                        value={stats.new_this_month.toLocaleString()}
                        icon="fa-calendar"
                        loading={loading}
                        sub={growthRate ? `${growthRate}% of all users` : 'no signups yet'}
                    />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard
                        label="Average / month"
                        value={avgPerMonth}
                        icon="fa-chart-line"
                        loading={loading}
                        sub={bestMonth ? `best: ${bestMonth[0]} (${bestMonth[1]})` : 'no data yet'}
                    />
                </div>
            </div>

            {/* Growth chart + daily signups */}
            <div className="row g-3 mb-3">
                <div className="col-xl-8 d-flex">
                    <Panel className="mb-0 flex-grow-1">
                        <PanelHeader>Growth — last {MONTHS_SHOWN} months</PanelHeader>
                        <PanelBody>
                            {loading ? (
                                <div className="py-5 text-center text-muted small">Loading…</div>
                            ) : users.length === 0 ? (
                                <EmptyState icon="fa-chart-column" title="No registration data yet"
                                    hint="Monthly signups and cumulative growth will appear here." />
                            ) : (
                                <Chart type="line" height={285} options={growthOptions} series={growthSeries} />
                            )}
                        </PanelBody>
                    </Panel>
                </div>

                <div className="col-xl-4 d-flex">
                    <Panel className="mb-0 flex-grow-1">
                        <PanelHeader>Daily signups — last 14 days</PanelHeader>
                        <PanelBody>
                            {loading ? (
                                <div className="py-5 text-center text-muted small">Loading…</div>
                            ) : (
                                <>
                                    <Chart type="bar" height={210} options={dailyOptions} series={dailySeries} />
                                    <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-1"
                                        style={{ fontSize: '12px' }}>
                                        <span className="text-muted">
                                            This week <strong className="text-body">{thisWeek}</strong>
                                            <span className="mx-2 opacity-50">·</span>
                                            Last week <strong className="text-body">{lastWeek}</strong>
                                        </span>
                                        <span className={`fw-semibold ${weekDelta >= 0 ? 'text-success' : 'text-danger'}`}>
                                            <i className={`fa-solid fa-arrow-${weekDelta >= 0 ? 'up' : 'down'} me-1`}
                                                style={{ fontSize: '10px' }}></i>
                                            {Math.abs(weekDelta)}%
                                        </span>
                                    </div>
                                </>
                            )}
                        </PanelBody>
                    </Panel>
                </div>
            </div>

            {/* Monthly breakdown + recent registrations */}
            <div className="row g-3">
                <div className="col-xl-6">
                    <Panel className="mb-0">
                        <PanelHeader>Registrations by month</PanelHeader>
                        <PanelBody className="p-0">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : monthRows.length === 0 ? (
                                <EmptyState icon="fa-calendar" title="No registrations yet" />
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th className="ps-3 small text-muted fw-semibold border-top-0">Month</th>
                                                <th className="small text-muted fw-semibold border-top-0" style={{ width: 90 }}>New users</th>
                                                <th className="small text-muted fw-semibold border-top-0 pe-3" style={{ width: 180 }}>Share</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthRows.map(([month, count]) => {
                                                const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
                                                return (
                                                    <tr key={month}>
                                                        <td className="ps-3 fw-semibold" style={{ fontSize: '13px' }}>
                                                            {month}
                                                            {bestMonth && bestMonth[0] === month && monthRows.length > 1 && (
                                                                <span className="badge bg-theme bg-opacity-10 text-theme fw-semibold ms-2"
                                                                    style={{ fontSize: '10px' }}>Peak</span>
                                                            )}
                                                        </td>
                                                        <td style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                                                            {count.toLocaleString()}
                                                        </td>
                                                        <td className="pe-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="progress flex-grow-1" style={{ height: 5 }}>
                                                                    <div className="progress-bar bg-theme"
                                                                        style={{ width: `${peakCount > 0 ? (count / peakCount) * 100 : 0}%` }} />
                                                                </div>
                                                                <span className="text-muted" style={{ fontSize: '11px', width: 38 }}>
                                                                    {pct.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </PanelBody>
                    </Panel>
                </div>

                <div className="col-xl-6">
                    <Panel className="mb-0">
                        <PanelHeader>Recent registrations</PanelHeader>
                        <PanelBody className="py-2">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : recentUsers.length === 0 ? (
                                <EmptyState icon="fa-user-plus" title="No users yet" />
                            ) : (
                                <>
                                    {recentUsers.map((user, i) => (
                                        <div key={user.id}
                                            className={`d-flex align-items-center justify-content-between py-2 ${i > 0 ? 'border-top' : ''}`}>
                                            <UserCell user={user} />
                                            <span className="text-end">
                                                <span className="d-block" style={{ fontSize: '12px' }}>{timeAgo(user.created_at)}</span>
                                                <span className="d-block text-muted" style={{ fontSize: '11px' }}>{fmtDate(user.created_at)}</span>
                                            </span>
                                        </div>
                                    ))}
                                    <div className="text-center border-top py-2 mt-1">
                                        <Link to={adminPath('/users')} className="text-decoration-none fw-semibold" style={{ fontSize: '12px' }}>
                                            All users <i className="fa-solid fa-arrow-right ms-1" style={{ fontSize: '10px' }}></i>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </PanelBody>
                    </Panel>
                </div>
            </div>
        </div>
    );
}

export default AdminUsersAnalytics;
