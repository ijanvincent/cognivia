import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import {
    PageHeader, StatCard, UserCell, SourceBadge, EmptyState, TableSkeleton,
    timeAgo, fmtDateTime,
} from './components/admin-ui.jsx';

const SOURCE_FILTERS = [
    { key: 'all',    label: 'All' },
    { key: 'ai',     label: 'AI generated' },
    { key: 'manual', label: 'Manual' },
    { key: 'import', label: 'Imported' },
];

function AdminDecks() {
    const context = useContext(AppSettings);

    const [decks, setDecks]         = useState([]);
    const [overview, setOverview]   = useState({ total_decks: 0, deck_sources: {} });
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [sourceFilter, setSource] = useState('all');
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir]     = useState('desc');

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
        else { setSortField(f); setSortDir(f === 'created_at' ? 'desc' : 'asc'); }
    };

    const sortIcon = (f) => {
        if (sortField !== f) return <i className="fa-solid fa-sort ms-1 opacity-25" />;
        return <i className={`fa-solid fa-sort-${sortDir === 'asc' ? 'up' : 'down'} ms-1 text-theme`} />;
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
            if (va === vb) return 0;
            return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });

    return (
        <div>
            <PageHeader
                crumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Deck Library' }]}
                title="Deck Library"
                subtitle="Every flashcard deck created across the platform"
            >
                <Link to="/admin/activity" className="btn btn-default btn-sm">
                    <i className="fa-solid fa-wave-square me-2"></i>Activity
                </Link>
            </PageHeader>

            <div className="row g-3 mb-3">
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Total decks" value={(overview.total_decks || 0).toLocaleString()}
                        icon="fa-layer-group" loading={loading} sub="all sources" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="AI generated" value={(overview.deck_sources?.ai || 0).toLocaleString()}
                        icon="fa-wand-magic-sparkles" loading={loading} sub="from uploaded documents" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Created manually" value={(overview.deck_sources?.manual || 0).toLocaleString()}
                        icon="fa-pen" loading={loading} sub="hand-written decks" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Imported" value={(overview.deck_sources?.import || 0).toLocaleString()}
                        icon="fa-file-import" loading={loading} sub="via share codes" />
                </div>
            </div>

            <Panel className="mb-0">
                <PanelBody className="p-0">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 py-2 border-bottom">
                        <div className="d-flex gap-1 flex-wrap">
                            {SOURCE_FILTERS.map(f => (
                                <button key={f.key} type="button"
                                    className={`btn btn-sm ${sourceFilter === f.key ? 'btn-theme' : 'btn-default'}`}
                                    style={{ fontSize: '12px' }}
                                    onClick={() => setSource(f.key)}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="input-group input-group-sm" style={{ width: 280 }}>
                            <span className="input-group-text">
                                <i className="fa-solid fa-magnifying-glass text-muted"></i>
                            </span>
                            <input type="text" className="form-control"
                                placeholder="Search decks or users…"
                                value={search} onChange={e => setSearch(e.target.value)} />
                            {search && (
                                <button className="btn btn-default" type="button" onClick={() => setSearch('')}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="ps-4 small text-muted fw-semibold" style={{ width: 44 }}>#</th>
                                    <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                        onClick={() => handleSort('title')}>Title {sortIcon('title')}</th>
                                    <th className="small text-muted fw-semibold">Owner</th>
                                    <th className="small text-muted fw-semibold">Source</th>
                                    <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none' }}
                                        onClick={() => handleSort('card_count')}>Cards {sortIcon('card_count')}</th>
                                    <th className="small text-muted fw-semibold" style={{ cursor: 'pointer', userSelect: 'none', width: 160 }}
                                        onClick={() => handleSort('mastery')}>Mastery {sortIcon('mastery')}</th>
                                    <th className="small text-muted fw-semibold pe-4" style={{ cursor: 'pointer', userSelect: 'none' }}
                                        onClick={() => handleSort('created_at')}>Created {sortIcon('created_at')}</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <TableSkeleton rows={6} cols={7} />
                            ) : (
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-0">
                                                <EmptyState icon="fa-layer-group"
                                                    title={search ? `No results for “${search}”` : 'No decks found'} />
                                            </td>
                                        </tr>
                                    ) : filtered.map((deck, i) => {
                                        const mastery = Math.round(deck.mastery || 0);
                                        return (
                                            <tr key={deck.id}>
                                                <td className="ps-4 text-muted small">{i + 1}</td>
                                                <td>
                                                    <div className="fw-semibold" style={{ fontSize: '13px' }}>{deck.title}</div>
                                                    {deck.share_code && (
                                                        <small className="text-muted" style={{ fontSize: '11px' }}>
                                                            <i className="fa-solid fa-share-nodes me-1"></i>{deck.share_code}
                                                        </small>
                                                    )}
                                                </td>
                                                <td><UserCell user={deck.user} size={28} /></td>
                                                <td><SourceBadge source={deck.source} /></td>
                                                <td style={{ fontSize: '13px' }}>{deck.card_count ?? 0}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="progress flex-grow-1" style={{ height: 5 }}>
                                                            <div className="progress-bar bg-theme" style={{ width: `${mastery}%` }} />
                                                        </div>
                                                        <span className="text-muted" style={{ fontSize: '11px', width: 32 }}>{mastery}%</span>
                                                    </div>
                                                </td>
                                                <td className="pe-4 text-muted" style={{ fontSize: '12px' }} title={fmtDateTime(deck.created_at)}>
                                                    {timeAgo(deck.created_at)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>

                    {!loading && filtered.length > 0 && (
                        <div className="d-flex align-items-center px-4 py-2 border-top">
                            <small className="text-muted">
                                Showing <strong>{filtered.length}</strong> of <strong>{decks.length}</strong> decks
                            </small>
                        </div>
                    )}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default AdminDecks;
