import { adminPath } from './admin-path';

const Menu = [
    // ── OVERVIEW ───────────────────────────────────────────────────────────
    { is_header: true, title: 'Overview' },
    {
        path: adminPath('/dashboard'),
        icon: 'bi bi-display',
        title: 'Dashboard',
    },
    {
        path: adminPath('/activity'),
        icon: 'bi bi-activity',
        title: 'Activity',
    },
    {
        path: adminPath('/users/analytics'),
        icon: 'bi bi-graph-up-arrow',
        title: 'Analytics',
    },

    // ── MANAGEMENT ─────────────────────────────────────────────────────────
    { is_header: true, title: 'Management' },
    {
        path: adminPath('/users'),
        icon: 'bi bi-person-workspace',
        title: 'Users',
    },
    {
        path: adminPath('/login-approvals'),
        icon: 'bi bi-fingerprint',
        title: 'Login Approvals',
    },
    {
        path: adminPath('/decks'),
        icon: 'bi bi-journals',
        title: 'Deck Library',
    },
];

export default Menu;
