import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function AdminUsersAnalytics() {
    const context = useContext(AppSettings);
    const [stats, setStats] = useState({ total_users: 0, new_today: 0, new_this_month: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const fetchData = async () => {
        try {
            const [dashRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/users')
            ]);
            setStats(dashRes.data.stats);
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error('Analytics error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ── Real data calculations ──────────────────────────────────────────────

    const totalUsers    = stats.total_users;
    const newToday      = stats.new_today;
    const newThisMonth  = stats.new_this_month;
    const growthRate    = totalUsers > 0 && newThisMonth > 0
        ? ((newThisMonth / totalUsers) * 100).toFixed(1) : '0';

    // Group by month (last 7 months)
    const usersByMonth = users.reduce((acc, user) => {
        const month = new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'short', year: 'numeric'
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    // Last 7 months labels + counts for chart
    const getLast7Months = () => {
        const months = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
        return months;
    };
    const last7Months  = getLast7Months();
    const registrationData = last7Months.map(m => usersByMonth[m] || 0);
    const monthLabels      = last7Months.map(m => m.split(' ')[0]); // short: "Jan"

    // Last 7 days for sparklines
    const getLast7Days = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });
    };
    const last7Days = getLast7Days();
    const dailyCounts = last7Days.map(day =>
        users.filter(u => u.created_at.startsWith(day)).length
    );
    const cumulativeCounts = last7Days.map((day, i) => {
        const cutoff = new Date(day);
        cutoff.setHours(23, 59, 59);
        return users.filter(u => new Date(u.created_at) <= cutoff).length;
    });

    const avgPerMonth = Object.keys(usersByMonth).length > 0
        ? (totalUsers / Object.keys(usersByMonth).length).toFixed(1) : '0';
    const mostActiveMonth = Object.entries(usersByMonth).sort((a, b) => b[1] - a[1])[0];

    // ── ApexCharts configs (same pattern as dashboard-v3) ──────────────────

    // Main area chart — registrations last 7 months (blue + green, same as ColorAdmin)
    const mainChartOptions = {
        colors: ['#00acac', '#348fe2'],
        fill: { opacity: 0.75, type: 'solid' },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: 15,
            labels: { colors: '#ffffff' }
        },
        xaxis: {
            categories: monthLabels,
            labels: { style: { colors: '#ffffff' } }
        },
        yaxis: { labels: { style: { colors: '#ffffff' } } },
        chart: { height: '100%', type: 'area', toolbar: { show: false }, stacked: false },
        dataLabels: { enabled: false },
        grid: {
            show: true, borderColor: 'rgba(255,255,255,.15)',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
            padding: { top: -40, right: 3, bottom: 0, left: 10 }
        },
        stroke: { show: true, curve: 'smooth', width: 2 },
        tooltip: {
            theme: 'dark',
            y: { formatter: val => val + ' users' }
        }
    };
    const mainChartSeries = [
        { name: 'New Registrations', data: registrationData },
        { name: 'Total Users',       data: cumulativeCounts }
    ];

    // Sparkline — daily new users (blue→indigo gradient)
    const sparkNewOptions = {
        chart: { type: 'line', width: 120, height: 36, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 1, opacityTo: 1,
                colorStops: [
                    { offset: 0,   color: '#348fe2', opacity: 1 },
                    { offset: 100, color: '#6610f2', opacity: 1 }
                ]
            }
        },
        tooltip: {
            theme: 'dark',
            fixed: { enabled: false },
            x: { show: false },
            y: { title: { formatter: () => '' }, formatter: v => v + ' users' },
            marker: { show: false }
        },
        responsive: [
            { breakpoint: 3000, options: { chart: { width: 120 } } },
            { breakpoint: 576,  options: { chart: { width: 80  } } }
        ]
    };
    const sparkNewSeries = [{ data: dailyCounts }];

    // Sparkline — growth rate trend (red→orange→lime, same as conversion rate)
    const sparkGrowthOptions = {
        chart: { type: 'line', width: 120, height: 36, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 1, opacityTo: 1,
                colorStops: [
                    { offset: 0,   color: '#ff5b57', opacity: 1 },
                    { offset: 50,  color: '#f59c1a', opacity: 1 },
                    { offset: 100, color: '#90ca4b', opacity: 1 }
                ]
            }
        },
        tooltip: {
            theme: 'dark',
            fixed: { enabled: false },
            x: { show: false },
            y: { title: { formatter: () => '' }, formatter: v => v + ' users' },
            marker: { show: false }
        },
        responsive: [
            { breakpoint: 3000, options: { chart: { width: 120 } } },
            { breakpoint: 576,  options: { chart: { width: 80  } } }
        ]
    };
    const sparkGrowthSeries = [{ data: registrationData }];

    // Sparkline — cumulative total (teal→blue→cyan, same as store sessions)
    const sparkTotalOptions = {
        chart: { type: 'line', width: 120, height: 36, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 1, opacityTo: 1,
                colorStops: [
                    { offset: 0,   color: '#00acac', opacity: 1 },
                    { offset: 50,  color: '#348fe2', opacity: 1 },
                    { offset: 100, color: '#49b6d6', opacity: 1 }
                ]
            }
        },
        tooltip: {
            theme: 'dark',
            fixed: { enabled: false },
            x: { show: false },
            y: { title: { formatter: () => '' }, formatter: v => v + ' users' },
            marker: { show: false }
        },
        responsive: [
            { breakpoint: 3000, options: { chart: { width: 120 } } },
            { breakpoint: 576,  options: { chart: { width: 80  } } }
        ]
    };
    const sparkTotalSeries = [{ data: cumulativeCounts }];

    // prev 7 days vs prior 7 days comparison
    const prev7Total  = dailyCounts.reduce((a, b) => a + b, 0);
    const prior7Total = last7Days.map(day => {
        const d = new Date(day);
        d.setDate(d.getDate() - 7);
        const key = d.toISOString().split('T')[0];
        return users.filter(u => u.created_at.startsWith(key)).length;
    }).reduce((a, b) => a + b, 0);
    const weekChange = prior7Total > 0
        ? (((prev7Total - prior7Total) / prior7Total) * 100).toFixed(1)
        : prev7Total > 0 ? '100' : '0';
    const weekUp = parseFloat(weekChange) >= 0;

    return (
        <div>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/admin/users">User Management</Link></li>
                <li className="breadcrumb-item active">User Analytics</li>
            </ol>
            <h1 className="page-header">
                User Analytics <small>registration trends and insights</small>
            </h1>

            {loading ? (
                <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : (
                <>
                    {/* ══════════════════════════════════════════════════
                        ROW 1 — Website Analytics (Last 7 Days)
                        Same dark card style as dashboard-v3
                    ══════════════════════════════════════════════════ */}
                    <div className="row">
                        {/* Main chart card — full width left */}
                        <div className="col-xl-8 col-lg-6">
                            <div className="card border-0 mb-3 overflow-hidden bg-gray-800 text-white">
                                <div className="card-body">
                                    <div className="mb-3 text-gray-500">
                                        <b>WEBSITE ANALYTICS</b>
                                        <span className="ms-2 text-gray-600 fw-normal">(last 7 months)</span>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-3 col-4">
                                            <h3 className="mb-1">{totalUsers}</h3>
                                            <div>Total Users</div>
                                            <div className="text-gray-500 small text-truncate">
                                                <i className={`fa fa-caret-${weekUp ? 'up' : 'down'}`}></i>
                                                {' '}{Math.abs(weekChange)}% vs last 7 days
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-4">
                                            <h3 className="mb-1">{newThisMonth}</h3>
                                            <div>This Month</div>
                                            <div className="text-gray-500 small text-truncate">
                                                <i className="fa fa-caret-up"></i> {growthRate}% growth rate
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-4">
                                            <h3 className="mb-1">{prev7Total}</h3>
                                            <div>Last 7 Days</div>
                                            <div className="text-gray-500 small text-truncate">
                                                <i className="fa fa-caret-up"></i> new registrations
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div style={{ height: '269px' }}>
                                        <div className="widget-chart-full-width pe-4" data-bs-theme="dark" style={{ height: '254px' }}>
                                            <Chart
                                                type="area"
                                                height="254"
                                                width="100%"
                                                options={mainChartOptions}
                                                series={mainChartSeries}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column — 2 sparkline cards stacked */}
                        <div className="col-xl-4 col-lg-6">
                            <div className="row">
                                {/* New Registrations sparkline */}
                                <div className="col-sm-6 col-xl-12">
                                    <div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
                                        <div className="card-body">
                                            <div className="mb-3 text-gray-500">
                                                <b>NEW REGISTRATIONS</b>
                                            </div>
                                            <div className="d-flex align-items-center mb-1">
                                                <h2 className="text-white mb-0">{prev7Total}</h2>
                                                <div className="ms-auto">
                                                    <Chart
                                                        type="line"
                                                        height="36px"
                                                        options={sparkNewOptions}
                                                        series={sparkNewSeries}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 text-gray-500">
                                                <i className={`fa fa-caret-${weekUp ? 'up' : 'down'}`}></i>
                                                {' '}{Math.abs(weekChange)}% compare to last week
                                            </div>
                                            <div className="d-flex mb-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-circle text-blue fs-8px me-2"></i>
                                                    Today
                                                </div>
                                                <div className="d-flex align-items-center ms-auto">
                                                    <div className="w-50px text-end ps-2 fw-bold">{newToday}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex mb-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-circle text-indigo fs-8px me-2"></i>
                                                    This Month
                                                </div>
                                                <div className="d-flex align-items-center ms-auto">
                                                    <div className="w-50px text-end ps-2 fw-bold">{newThisMonth}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-circle text-teal fs-8px me-2"></i>
                                                    All Time
                                                </div>
                                                <div className="d-flex align-items-center ms-auto">
                                                    <div className="w-50px text-end ps-2 fw-bold">{totalUsers}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Growth trend sparkline */}
                                <div className="col-sm-6 col-xl-12">
                                    <div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
                                        <div className="card-body">
                                            <div className="mb-3 text-gray-500">
                                                <b>GROWTH TREND</b>
                                            </div>
                                            <div className="d-flex align-items-center mb-1">
                                                <h2 className="text-white mb-0">{growthRate}%</h2>
                                                <div className="ms-auto">
                                                    <Chart
                                                        type="line"
                                                        height="36px"
                                                        options={sparkGrowthOptions}
                                                        series={sparkGrowthSeries}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 text-gray-500">
                                                <i className="fa fa-caret-up"></i> monthly growth rate
                                            </div>
                                            <div className="d-flex mb-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-circle text-red fs-8px me-2"></i>
                                                    Avg / Month
                                                </div>
                                                <div className="d-flex align-items-center ms-auto">
                                                    <div className="w-50px text-end ps-2 fw-bold">{avgPerMonth}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex mb-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-circle text-warning fs-8px me-2"></i>
                                                    Best Month
                                                </div>
                                                <div className="d-flex align-items-center ms-auto">
                                                    <div className="text-end ps-2 fw-bold" style={{ fontSize: '11px' }}>
                                                        {mostActiveMonth ? mostActiveMonth[0] : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-circle text-lime fs-8px me-2"></i>
                                                    Peak Registrations
                                                </div>
                                                <div className="d-flex align-items-center ms-auto">
                                                    <div className="w-50px text-end ps-2 fw-bold">
                                                        {mostActiveMonth ? mostActiveMonth[1] : 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════
                        ROW 2 — Analytics Details
                        Same dark card style, total + trend sparkline
                    ══════════════════════════════════════════════════ */}
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card border-0 mb-3 bg-gray-800 text-white">
                                <div className="card-body">
                                    <div className="mb-3 text-gray-500">
                                        <b>ANALYTICS DETAILS</b>
                                        <span className="ms-2 text-gray-600 fw-normal">(last 7 days)</span>
                                    </div>
                                    <div className="row">
                                        {/* Total Users */}
                                        <div className="col-xl-3 col-md-6 mb-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <div>
                                                    <div className="text-gray-500 fs-12px mb-1">TOTAL USERS</div>
                                                    <h3 className="mb-0 text-white">{totalUsers}</h3>
                                                </div>
                                                <div className="ms-auto">
                                                    <Chart
                                                        type="line"
                                                        height="36px"
                                                        options={sparkTotalOptions}
                                                        series={sparkTotalSeries}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-gray-500 small">
                                                <i className={`fa fa-caret-${weekUp ? 'up' : 'down'} me-1`}></i>
                                                {Math.abs(weekChange)}% vs last week
                                            </div>
                                            <div className="progress mt-2" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-teal" style={{ width: '100%' }} />
                                            </div>
                                        </div>

                                        {/* New Today */}
                                        <div className="col-xl-3 col-md-6 mb-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <div>
                                                    <div className="text-gray-500 fs-12px mb-1">NEW TODAY</div>
                                                    <h3 className="mb-0 text-white">{newToday}</h3>
                                                </div>
                                                <div className="ms-auto">
                                                    <Chart
                                                        type="line"
                                                        height="36px"
                                                        options={sparkNewOptions}
                                                        series={sparkNewSeries}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-gray-500 small">
                                                <i className="fa fa-caret-up me-1"></i>
                                                registered today
                                            </div>
                                            <div className="progress mt-2" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-blue"
                                                    style={{ width: `${totalUsers > 0 ? (newToday / totalUsers) * 100 : 0}%` }} />
                                            </div>
                                        </div>

                                        {/* This Month */}
                                        <div className="col-xl-3 col-md-6 mb-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <div>
                                                    <div className="text-gray-500 fs-12px mb-1">THIS MONTH</div>
                                                    <h3 className="mb-0 text-white">{newThisMonth}</h3>
                                                </div>
                                                <div className="ms-auto">
                                                    <Chart
                                                        type="line"
                                                        height="36px"
                                                        options={sparkGrowthOptions}
                                                        series={sparkGrowthSeries}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-gray-500 small">
                                                <i className="fa fa-caret-up me-1"></i>
                                                {growthRate}% growth rate
                                            </div>
                                            <div className="progress mt-2" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-warning"
                                                    style={{ width: `${totalUsers > 0 ? (newThisMonth / totalUsers) * 100 : 0}%` }} />
                                            </div>
                                        </div>

                                        {/* Avg Per Month */}
                                        <div className="col-xl-3 col-md-6 mb-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <div>
                                                    <div className="text-gray-500 fs-12px mb-1">AVG / MONTH</div>
                                                    <h3 className="mb-0 text-white">{avgPerMonth}</h3>
                                                </div>
                                                <div className="ms-auto">
                                                    <Chart
                                                        type="line"
                                                        height="36px"
                                                        options={sparkGrowthOptions}
                                                        series={sparkGrowthSeries}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-gray-500 small">
                                                <i className="fa fa-caret-up me-1"></i>
                                                average monthly signups
                                            </div>
                                            <div className="progress mt-2" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-danger"
                                                    style={{ width: `${Math.min((parseFloat(avgPerMonth) / totalUsers) * 100 * 5, 100)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════
                        ROW 3 — Registrations by Month + Recent
                        Plain div panels — no Panel component = no buttons
                    ══════════════════════════════════════════════════ */}
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="panel panel-inverse">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                        <i className="fa fa-calendar-alt me-2"></i>
                                        Registrations by Month
                                    </h4>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Month</th>
                                                    <th>New Users</th>
                                                    <th>Share</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(usersByMonth).length === 0 ? (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-muted p-3">No data yet</td>
                                                    </tr>
                                                ) : (
                                                    Object.entries(usersByMonth)
                                                        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                                                        .map(([month, count]) => (
                                                            <tr key={month}>
                                                                <td className="fw-bold">{month}</td>
                                                                <td>
                                                                    <span className="badge bg-primary">{count}</span>
                                                                </td>
                                                                <td style={{ minWidth: '120px' }}>
                                                                    <div className="progress mb-1" style={{ height: '6px' }}>
                                                                        <div className="progress-bar bg-primary"
                                                                            style={{ width: `${totalUsers > 0 ? (count / totalUsers) * 100 : 0}%` }} />
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0}%
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                        ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6">
                            <div className="panel panel-inverse">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                        <i className="fa fa-user-clock me-2"></i>
                                        Recent Registrations
                                    </h4>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th>Registered</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="2" className="text-center text-muted p-3">No users yet</td>
                                                    </tr>
                                                ) : (
                                                    users.slice(0, 8).map(user => (
                                                        <tr key={user.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div
                                                                        className="rounded-circle text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                                                                        style={{ width: '32px', height: '32px', minWidth: '32px', background: '#2196f3', fontSize: '13px' }}
                                                                    >
                                                                        {user.username.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-bold">{user.username}</div>
                                                                        <small className="text-muted">{user.email}</small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-muted">
                                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminUsersAnalytics;
