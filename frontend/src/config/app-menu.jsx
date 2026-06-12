const Menu = [
    // ── OVERVIEW ───────────────────────────────────────────────────────────
    { is_header: true, title: 'Overview' },
    {
        path: '/admin/dashboard',
        icon: 'fa fa-gauge-high',
        title: 'Dashboard',
    },
    {
        path: '/admin/activity',
        icon: 'fa fa-wave-square',
        title: 'Activity',
    },
    {
        path: '/admin/users/analytics',
        icon: 'fa fa-chart-line',
        title: 'Analytics',
    },

    // ── MANAGEMENT ─────────────────────────────────────────────────────────
    { is_header: true, title: 'Management' },
    {
        path: '/admin/users',
        icon: 'fa fa-users',
        title: 'Users',
    },
    {
        path: '/admin/login-approvals',
        icon: 'fa fa-shield-halved',
        title: 'Login Approvals',
    },
    {
        path: '/admin/decks',
        icon: 'fa fa-layer-group',
        title: 'Deck Library',
    },
];

export default Menu;
