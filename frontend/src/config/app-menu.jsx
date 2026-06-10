import React from 'react';

const Menu = [
    // ── APP INTERFACE ──────────────────────────────────────────────────────
    { is_header: true, title: 'App Interface' },
    {
        path: '/admin/dashboard',
        icon: 'fa fa-home',
        title: 'Dashboard',
    },
    {
        path: '/admin/users/analytics',
        icon: 'fa fa-chart-bar',
        title: 'Analytics',
    },

    // ── USER MANAGEMENT ────────────────────────────────────────────────────
    { is_header: true, title: 'User Management' },
    {
        icon: 'fa fa-users',
        title: 'Users',
        children: [
            { path: '/admin/users',           title: 'All Users' },
            { path: '/admin/users/trashed',   title: 'Trashed Users' },
        ],
    },
    {
        path: '/admin/login-approvals',
        icon: 'fa fa-shield-alt',
        title: 'Login Approvals',
    },

    // ── CONTENT MANAGEMENT ─────────────────────────────────────────────────
    { is_header: true, title: 'Content' },
    {
        path: '/admin/decks',
        icon: 'fa fa-layer-group',
        title: 'Deck Library',
    },
];

export default Menu;
