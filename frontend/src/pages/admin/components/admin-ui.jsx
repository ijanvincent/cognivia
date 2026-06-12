import React from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Shared building blocks for the admin panel.
// Every admin page imports from here so colors, badges, avatars and time
// formatting stay identical across screens.
// ---------------------------------------------------------------------------

export const AVATAR_PALETTE = [
    '#6366f1', '#0ea5e9', '#10b981', '#f43f5e',
    '#d97706', '#8b5cf6', '#14b8a6', '#64748b',
];

export function themeColor() {
    return (getComputedStyle(document.body).getPropertyValue('--bs-app-theme') || '#00c853').trim();
}

export function avatarColor(str = '') {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function timeAgo(d) {
    if (!d) return '—';
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 0)      return 'just now';
    if (s < 60)     return 'just now';
    if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
    if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
    if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtDateTime(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    });
}

// A user counts as online if a session token was used in the last 5 minutes.
export function isOnline(lastActive) {
    return !!lastActive && Date.now() - new Date(lastActive).getTime() < 5 * 60 * 1000;
}

export const SOURCE_META = {
    ai:     { label: 'AI',     icon: 'fa-wand-magic-sparkles', className: 'text-indigo' },
    manual: { label: 'Manual', icon: 'fa-pen',                 className: 'text-primary' },
    import: { label: 'Import', icon: 'fa-file-import',         className: 'text-warning' },
};

export const APPROVAL_META = {
    pending:  { label: 'Pending',  className: 'border-warning text-warning', icon: 'fa-hourglass-half' },
    approved: { label: 'Approved', className: 'border-success text-success', icon: 'fa-check' },
    denied:   { label: 'Denied',   className: 'border-danger text-danger',   icon: 'fa-xmark' },
    expired:  { label: 'Expired',  className: 'border-secondary text-muted', icon: 'fa-clock' },
};

export const PLATFORM_META = {
    web:    { label: 'Web',    icon: 'fa-display' },
    mobile: { label: 'Mobile', icon: 'fa-mobile-screen-button' },
};

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export function Avatar({ name = '?', size = 32, muted = false }) {
    return (
        <span className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
            style={{
                width: size, height: size, minWidth: size,
                background: muted ? '#9aa0a6' : avatarColor(name),
                fontSize: Math.round(size * 0.42),
            }}>
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export function UserCell({ user, deleted = false, link = true, size = 32 }) {
    if (!user) return <span className="text-muted small">—</span>;
    const body = (
        <span className="d-inline-flex align-items-center gap-2 text-start">
            <Avatar name={user.username} size={size} muted={deleted} />
            <span>
                <span className={`d-block fw-semibold lh-sm ${deleted ? 'text-muted' : 'text-body'}`} style={{ fontSize: '13px' }}>
                    {user.username}
                </span>
                <span className="d-block text-muted lh-sm" style={{ fontSize: '11px' }}>{user.email}</span>
            </span>
        </span>
    );
    if (!link || !user.id) return body;
    return (
        <Link to={`/admin/users/${user.id}`} className="text-decoration-none">
            {body}
        </Link>
    );
}

export function PresenceDot({ lastActive }) {
    const online = isOnline(lastActive);
    return (
        <span className="d-inline-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
            <span className="rounded-circle d-inline-block"
                style={{
                    width: 7, height: 7,
                    background: online ? 'var(--bs-success)' : 'var(--bs-gray-400)',
                }} />
            <span className={online ? 'text-success fw-semibold' : 'text-muted'}>
                {online ? 'Online' : lastActive ? timeAgo(lastActive) : 'Never signed in'}
            </span>
        </span>
    );
}

export function SourceBadge({ source }) {
    const meta = SOURCE_META[source] || SOURCE_META.manual;
    return (
        <span className={`badge bg-transparent border fw-semibold ${meta.className}`}
            style={{ fontSize: '11px', borderColor: 'currentcolor' }}>
            <i className={`fa-solid ${meta.icon} me-1`} style={{ fontSize: '10px' }}></i>
            {meta.label}
        </span>
    );
}

export function ApprovalBadge({ status }) {
    const meta = APPROVAL_META[status] || APPROVAL_META.pending;
    return (
        <span className={`badge bg-transparent border fw-semibold ${meta.className}`} style={{ fontSize: '11px' }}>
            <i className={`fa-solid ${meta.icon} me-1`} style={{ fontSize: '10px' }}></i>
            {meta.label}
        </span>
    );
}

export function PlatformLabel({ platform }) {
    const meta = PLATFORM_META[platform];
    if (!meta) return <span className="text-muted small">—</span>;
    return (
        <span className="d-inline-flex align-items-center gap-2 small">
            <i className={`fa-solid ${meta.icon} text-muted`} style={{ fontSize: '12px' }}></i>
            {meta.label}
        </span>
    );
}

export function PageHeader({ crumbs = [], title, subtitle, children }) {
    return (
        <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
                {crumbs.length > 0 && (
                    <ol className="breadcrumb mb-1" style={{ fontSize: '11px' }}>
                        {crumbs.map((c, i) => (
                            <li key={i} className={`breadcrumb-item ${!c.to ? 'active' : ''}`}>
                                {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
                            </li>
                        ))}
                    </ol>
                )}
                <h1 className="page-header mb-0">{title}</h1>
                {subtitle && <div className="text-muted mt-1" style={{ fontSize: '13px' }}>{subtitle}</div>}
            </div>
            {children && <div className="d-flex align-items-center gap-2 flex-wrap">{children}</div>}
        </div>
    );
}

export function StatCard({ label, value, icon, sub, delta, deltaUp, loading = false, accent = false }) {
    return (
        <div className="card h-100">
            <div className="card-body py-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted text-uppercase fw-semibold"
                        style={{ fontSize: '11px', letterSpacing: '0.05em' }}>{label}</span>
                    {icon && (
                        <i className={`fa-solid ${icon} ${accent ? 'text-theme' : 'text-muted opacity-50'}`}
                            style={{ fontSize: '14px' }}></i>
                    )}
                </div>
                <div className="fw-bold lh-1 mb-1" style={{ fontSize: '24px', fontVariantNumeric: 'tabular-nums' }}>
                    {loading ? <span className="placeholder col-4 rounded" style={{ height: 22, display: 'inline-block' }} /> : value}
                </div>
                {(delta != null || sub) && (
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
                        {delta != null && (
                            <span className={`fw-semibold ${deltaUp ? 'text-success' : 'text-danger'}`}>
                                <i className={`fa-solid fa-arrow-${deltaUp ? 'up' : 'down'} me-1`} style={{ fontSize: '10px' }}></i>
                                {delta}
                            </span>
                        )}
                        {sub && <span className="text-muted">{sub}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

export function EmptyState({ icon = 'fa-inbox', title, hint, children }) {
    return (
        <div className="text-center py-5 text-muted">
            <i className={`fa-solid ${icon} d-block mb-3 opacity-25`} style={{ fontSize: '36px' }}></i>
            <div className="fw-semibold text-body">{title}</div>
            {hint && <div className="small mt-1">{hint}</div>}
            {children && <div className="mt-3">{children}</div>}
        </div>
    );
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
    return (
        <tbody>
            {[...Array(rows)].map((_, r) => (
                <tr key={r}>
                    {[...Array(cols)].map((_, c) => (
                        <td key={c} className={`py-3 ${c === 0 ? 'ps-4' : ''}`}>
                            <span className="placeholder rounded d-inline-block"
                                style={{ height: 12, width: `${40 + ((r * 17 + c * 29) % 60)}%` }} />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

export const EVENT_META = {
    signup:   { icon: 'fa-user-plus',       className: 'bg-success bg-opacity-10 text-success' },
    session:  { icon: 'fa-right-to-bracket', className: 'bg-primary bg-opacity-10 text-primary' },
    deck:     { icon: 'fa-layer-group',      className: 'bg-indigo bg-opacity-10 text-indigo' },
    study:    { icon: 'fa-graduation-cap',   className: 'bg-teal bg-opacity-10 text-teal' },
    approval: { icon: 'fa-shield-halved',    className: 'bg-warning bg-opacity-10 text-warning' },
};

export function describeEvent(ev) {
    const m = ev.meta || {};
    switch (ev.type) {
        case 'signup':
            return 'created an account';
        case 'session':
            return `signed in on ${PLATFORM_META[m.platform]?.label || m.platform}`;
        case 'deck': {
            const src = m.source === 'ai' ? 'generated' : m.source === 'import' ? 'imported' : 'created';
            return (
                <>
                    {src} the deck <span className="fw-semibold text-body">“{m.title}”</span>
                    {m.card_count != null && <span className="text-muted"> · {m.card_count} cards</span>}
                </>
            );
        }
        case 'study':
            return (
                <>
                    mastered a card{m.deck_title && <> in <span className="fw-semibold text-body">“{m.deck_title}”</span></>}
                </>
            );
        case 'approval': {
            const verbs = {
                pending:  'requested a login approval',
                approved: 'approved a login request',
                denied:   'denied a login request',
                expired:  'let a login request expire',
            };
            return (
                <>
                    {verbs[m.status] || verbs.pending}
                    {m.requesting_platform && (
                        <span className="text-muted"> · {PLATFORM_META[m.requesting_platform]?.label || m.requesting_platform} → {PLATFORM_META[m.active_platform]?.label || m.active_platform}</span>
                    )}
                </>
            );
        }
        default:
            return 'did something';
    }
}

export function ActivityItem({ event, compact = false }) {
    const meta = EVENT_META[event.type] || EVENT_META.session;
    return (
        <div className={`d-flex align-items-start gap-3 ${compact ? 'py-2' : 'py-3'}`}>
            <span className={`rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0 ${meta.className}`}
                style={{ width: 32, height: 32 }}>
                <i className={`fa-solid ${meta.icon}`} style={{ fontSize: '12px' }}></i>
            </span>
            <div className="flex-grow-1 min-w-0">
                <div style={{ fontSize: '13px' }} className="text-muted">
                    <Link to={`/admin/users/${event.user?.id}`} className="fw-semibold text-body text-decoration-none">
                        {event.user?.username || 'Unknown user'}
                    </Link>{' '}
                    {describeEvent(event)}
                </div>
                <div className="text-muted" style={{ fontSize: '11px' }} title={fmtDateTime(event.timestamp)}>
                    {timeAgo(event.timestamp)}
                </div>
            </div>
        </div>
    );
}
