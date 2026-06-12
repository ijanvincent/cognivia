const Menu = [
    // ── OVERVIEW ───────────────────────────────────────────────────────────
    { is_header: true, title: 'Overview' },
    {
        path: '/admin/dashboard',
        icon: 'bi bi-display',
        title: 'Dashboard',
    },
    {
        path: '/admin/activity',
        icon: 'bi bi-activity',
        title: 'Activity',
    },
    {
        path: '/admin/users/analytics',
        icon: 'bi bi-graph-up-arrow',
        title: 'Analytics',
    },

    // ── MANAGEMENT ─────────────────────────────────────────────────────────
    { is_header: true, title: 'Management' },
    {
        path: '/admin/users',
        icon: 'bi bi-person-workspace',
        title: 'Users',
    },
    {
        path: '/admin/login-approvals',
        icon: 'bi bi-fingerprint',
        title: 'Login Approvals',
    },
    {
        path: '/admin/decks',
        icon: 'bi bi-journals',
        title: 'Deck Library',
    },
];

export default Menu;
