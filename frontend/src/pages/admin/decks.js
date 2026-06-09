import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

const SOURCE_META = {
    ai:     { label: 'AI Generated', color: '#7209b7', icon: 'fa-robot' },
    manual: { label: 'Manual',       color: '#4361ee', icon: 'fa-pencil-alt' },
    import: { label: 'Imported',     color: '#fb8500', icon: 'fa-file-import' },
};

function avatarColor(str = '') {
    const p = ['#4361ee','#7209b7','#f72585','#4cc9f0','#06d6a0','#fb8500','#ef476f','#3a0ca3'];
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return p[Math.abs(h) % p.length];
}

function timeAgo(d) {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    const days = Math.floor(s / 86400);
    if (days < 30) return `${days}d ago`;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SkeletonRow() {
    return (
        <tr>
            {[50, 200, 100, 80, 80, 80, 100].map((w, i) => (
                <td key={i} className="py-3">
                    <div className="bg-secondary opacity-25 rounded" style={{ height: '12px', width: `${w}px` }} />
                </td>
            ))}
        </tr>
    );
}

function AdminDecks() {
    const context = useContext(AppSettings);

    const [decks, setDecks]           = useState([]);
    const [overview, setOverview]     = useState({ total_decks: 0, ai_generated: 0, deck_sources: {} });
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [sourceFilter, setSource]   = useState('all');
    const [sortField, setSortField]   = useState('created_at');
    const [sortDir, setSortDir]       = useState('desc');

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
            const [deckRes, overviewRes] = await Promise.all([
                api.get('/admin/decks'),
                api.get('/admin/content/overview'),
            ]);
            setDecks(deckRes.data.decks || []);
            setOverview(overviewRes.data || {});
        } catch (err) {
            console.error('Decks error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (f) => {
        if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(f); setSortDir('asc'); }
    };

    const sortIcon = (f) => {
        if (sortField !== f) return <i className="fa fa-sort ms-1 opacity-25" />;
        return <i className={`fa fa-sort-${sortDir === 'asc' ? 'up' : 'down'} ms-1 text-theme`} />;
    };

    const filtered = decks
        .filter(d => {
            const q = search.toLowerCase();
            const matchSearch = !q || d.title.toLowerCase().includes(q) ||
                (d.user?.username || '').toLowerCase().includes(q) ||
                (d.user?.email || '').toLowerCase().includes(q);
            const matchSource = sourceFilter === 'all' || d.source === sourceFilter;
            return matchSearch && matchSource;
        })
        .sort((a, b) => {
            let va = a[sortField] ?? '';
            let vb = b[sortField] ?? '';
            if (sortField === 'created_at') { va = new Date(va); vb = new Date(vb); }
            else if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });

    const sources = ['all', 'ai', 'manual', 'import'];

    return (
        <div>
            {/* Page Header */}
            <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
                <div>
                    <ol className="breadcrumb mb-1 small">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Deck Library</li>
                    </ol>
                    <h1 className="page-header mb-0">Deck Library</h1>
                    <p className="text-muted mb-0 small">All user-created flashcard decks across the platform</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <Link to="/admin/users/analytics" className="btn btn-outline-theme btn-sm rounded-3 px-3">
                        <i className="fa fa-chart-bar me-2"></i>Analytics
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Total Decks',    value: overview.total_decks    || 0, icon: 'fa-layer-group', bg: 'linear-gradient(135deg,#4361ee,#3a0ca3)', shadow: 'rgba(67,97,238,0.3)' },
                    { label: 'AI Generated',   value: overview.deck_sources?.ai     || 0, icon: 'fa-robot',       bg: 'linear-gradient(135deg,#7209b7,#560bad)', shadow: 'rgba(114,9,183,0.3)' },
                    { label: 'Manual Created', value: overview.deck_sources?.manual || 0, icon: 'fa-pencil-alt',  bg: 'linear-gradient(135deg,#06d6a0,#028a5b)', shadow: 'rgba(6,214,160,0.3)' },
                    { label: 'Imported',       value: overview.deck_sources?.import || 0, icon: 'fa-file-import', bg: 'linear-gradient(135deg,#fb8500,#d4620f)', shadow: 'rgba(251,133,0,0.3)' },
                ].map((c, i) => (
                    <div key={i} className="col-xl-3 col-md-6">
                        <div className="rounded-4 text-white p-4 h-100"
                            style={{ background: c.bg, boxShadow: `0 8px 24px ${c.shadow}` }}>
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <div className="small fw-semibold text-uppercase mb-1 opacity-75"
                                        style={{ fontSize: '10px', letterSpacing: '0.07em' }}>{c.label}</div>
                                    <div className="fw-bold lh-1" style={{ fontSize: '2rem' }}>{c.value.toLocaleString()}</div>
                                </div>
                                <div className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
                                    style={{ width: '44px', height: '44px' }}>
                                    <i className={`fa ${c.icon}`} style={{ fontSize: '18px' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Deck Table */}
            <div className="panel panel-inverse">
                <div className="panel-heading d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <h4 className="panel-title mb-0">All Decks</h4>
                        {!loading && <span className="badge bg-theme rounded-pill">{filtered.length}</span>}
                        <div className="d-flex gap-1">
                            {sources.map(s => (
                                <button key={s} type="button"
                                    className={`btn btn-xs rounded-pill px-3 ${sourceFilter === s ? 'btn-theme' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: '11px', textTransform: 'capitalize' }}
                                    onClick={() => setSource(s)}>
                                    {s === 'all' ? 'All' : SOURCE_META[s]?.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="input-group input-group-sm" style={{ width: '280px' }}>
                        <span className="input-group-text bg-transparent">
                            <i className="fa fa-search text-muted"></i>
                        </span>
                        <input type="text" className="form-control"
                            placeholder="Search decks or users…"
                            value={search} onChange={e => setSearch(e.target.value)} />
                        {search && (
                            <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                                <i className="fa fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="panel-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="border-bottom" style={{ background: 'rgba(0,0,0,0.025)' }}>
                                <tr>
                                    <th className="ps-4 py-3 fw-semibold text-muted small border-0" width="40">#</th>
                                    <th className="py-3 fw-semibold text-muted small border-0" style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('title')}>Title {sortIcon('title')}</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Owner</th>
                                    <th className="py-3 fw-semibold text-muted small border-0">Source</th>
                                    <th className="py-3 fw-semibold text-muted small border-0" style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('card_count')}>Cards {sortIcon('card_count')}</th>
                                    <th className="py-3 fw-semibold text-muted small border-0" style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('mastery')}>Mastery {sortIcon('mastery')}</th>
                                    <th className="py-3 fw-semibold text-muted small border-0" style={{ cursor: 'pointer' }}
                                        onClick={() => handleSort('created_at')}>Created {sortIcon('created_at')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">
                                            <i className="fa fa-layer-group d-block mb-2 fa-2x opacity-25"></i>
                                            <div className="fw-semibold">{search ? `No results for "${search}"` : 'No decks found'}</div>
                                        </td>
                                    </tr>
                                ) : filtered.map((deck, i) => {
                                    const src = SOURCE_META[deck.source] || SOURCE_META.manual;
                                    const mastery = Math.round((deck.mastery || 0) * 100) / 100;
                                    return (
                                        <tr key={deck.id}>
                                            <td className="ps-4 text-muted small">{i + 1}</td>
                                            <td>
                                                <div className="fw-semibold">{deck.title}</div>
                                                {deck.share_code && (
                                                    <small className="text-muted" style={{ fontSize: '10px' }}>
                                                        <i className="fa fa-share-alt me-1"></i>{deck.share_code}
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                {deck.user ? (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                            style={{ width: '30px', height: '30px', background: avatarColor(deck.user.username), fontSize: '12px' }}>
                                                            {deck.user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="small fw-semibold">{deck.user.username}</div>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>{deck.user.email}</div>
                                                        </div>
                                                    </div>
                                                ) : <span className="text-muted small">—</span>}
                                            </td>
                                            <td>
                                                <span className="badge rounded-pill px-2"
                                                    style={{ background: src.color + '22', color: src.color, border: `1px solid ${src.color}44`, fontSize: '11px' }}>
                                                    <i className={`fa ${src.icon} me-1`} style={{ fontSize: '10px' }}></i>
                                                    {src.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-semibold">{deck.card_count ?? 0}</span>
                                                <small className="text-muted ms-1">cards</small>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1" style={{ height: '5px', width: '60px' }}>
                                                        <div className="progress-bar bg-theme" style={{ width: `${mastery}%` }} />
                                                    </div>
                                                    <small className="text-muted">{mastery}%</small>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="small text-muted">{timeAgo(deck.created_at)}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!loading && filtered.length > 0 && (
                    <div className="panel-footer d-flex align-items-center justify-content-between px-4 py-2 border-top">
                        <small className="text-muted">
                            Showing <strong>{filtered.length}</strong> of <strong>{decks.length}</strong> decks
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDecks;
