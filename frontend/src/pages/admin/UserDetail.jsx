import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';
import {
    PageHeader, Avatar, StatCard, SourceBadge, ApprovalBadge, PlatformLabel,
    PresenceDot, EmptyState, timeAgo, fmtDate, fmtDateTime, isOnline,
} from './components/admin-ui.jsx';
import { adminPath } from './../../config/admin-path';

function AdminUserDetail() {
    const context  = useContext(AppSettings);
    const { id }   = useParams();
    const navigate = useNavigate();

    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/users/${id}`);
            setData(res.data);
        } catch (err) {
            if (err.response?.status === 404) setNotFound(true);
            console.error('User detail error:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        context.handleSetAppSidebarNone(false);
        context.handleSetAppHeaderNone(false);
        context.handleSetAppContentClass('');
        fetchUser();
        return () => {
            context.handleSetAppSidebarNone(true);
            context.handleSetAppHeaderNone(true);
        };
        // eslint-disable-next-line
    }, [id]);

    if (notFound) {
        return (
            <div className="py-5">
                <EmptyState icon="fa-user-slash" title="User not found"
                    hint="This account may have been permanently deleted.">
                    <Link to={adminPath('/users')} className="btn btn-default btn-sm">
                        <i className="fa-solid fa-arrow-left me-2"></i>Back to users
                    </Link>
                </EmptyState>
            </div>
        );
    }

    const user      = data?.user;
    const stats     = data?.stats || { decks: 0, flashcards: 0, mastered: 0, reviews: 0 };
    const sessions  = data?.sessions || [];
    const decks     = data?.decks || [];
    const approvals = data?.approvals || [];

    const masteredPct = stats.flashcards > 0
        ? Math.round((stats.mastered / stats.flashcards) * 100) : 0;

    return (
        <div>
            <PageHeader
                crumbs={[
                    { label: 'Admin', to: adminPath('/dashboard') },
                    { label: 'Users', to: adminPath('/users') },
                    { label: user?.username || `#${id}` },
                ]}
                title={
                    loading ? 'Loading…' : (
                        <span className="d-inline-flex align-items-center gap-3">
                            <Avatar name={user.username} size={44} muted={!!user.deleted_at} />
                            {user.username}
                            {user.deleted_at && (
                                <span className="badge bg-transparent border border-danger text-danger fw-semibold align-middle"
                                    style={{ fontSize: '11px' }}>In trash</span>
                            )}
                        </span>
                    )
                }
                subtitle={!loading && user && (
                    <span className="d-inline-flex align-items-center gap-3 flex-wrap">
                        <span>{user.email}</span>
                        <span className="opacity-50">·</span>
                        <span>Joined {fmtDate(user.created_at)}</span>
                        <span className="opacity-50">·</span>
                        <PresenceDot lastActive={user.last_active_at} />
                    </span>
                )}
            >
                <button type="button" className="btn btn-default btn-sm" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left me-2"></i>Back
                </button>
                <button type="button" className="btn btn-default btn-sm" onClick={fetchUser} title="Refresh">
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </PageHeader>

            <div className="row g-3 mb-3">
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Decks" value={stats.decks.toLocaleString()} icon="fa-layer-group"
                        loading={loading} sub="created or imported" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Flashcards" value={stats.flashcards.toLocaleString()} icon="fa-clone"
                        loading={loading} sub="across all decks" />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Cards mastered" value={stats.mastered.toLocaleString()} icon="fa-graduation-cap"
                        loading={loading} sub={`${masteredPct}% of their cards`} />
                </div>
                <div className="col-xl-3 col-md-6">
                    <StatCard label="Total reviews" value={stats.reviews.toLocaleString()} icon="fa-repeat"
                        loading={loading} sub="study answers checked" />
                </div>
            </div>

            <div className="row g-3">
                {/* Decks */}
                <div className="col-xl-8">
                    <Panel className="mb-3">
                        <PanelHeader>Decks ({decks.length})</PanelHeader>
                        <PanelBody className="p-0">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : decks.length === 0 ? (
                                <EmptyState icon="fa-layer-group" title="No decks yet"
                                    hint="This user hasn't created or imported any decks." />
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th className="ps-3 small text-muted fw-semibold border-top-0">Deck</th>
                                                <th className="small text-muted fw-semibold border-top-0">Source</th>
                                                <th className="small text-muted fw-semibold border-top-0">Cards</th>
                                                <th className="small text-muted fw-semibold border-top-0" style={{ width: 160 }}>Mastery</th>
                                                <th className="small text-muted fw-semibold border-top-0 pe-3">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {decks.map(deck => {
                                                const mastery = Math.round(deck.mastery || 0);
                                                return (
                                                    <tr key={deck.id}>
                                                        <td className="ps-3 fw-semibold" style={{ fontSize: '13px' }}>{deck.title}</td>
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
                                                        <td className="pe-3 text-muted" style={{ fontSize: '12px' }} title={fmtDateTime(deck.created_at)}>
                                                            {timeAgo(deck.created_at)}
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

                    {/* Login approval history */}
                    <Panel className="mb-0">
                        <PanelHeader>Login approval history</PanelHeader>
                        <PanelBody className="p-0">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : approvals.length === 0 ? (
                                <EmptyState icon="fa-shield-halved" title="No approval requests"
                                    hint="Cross-platform login requests from this user will appear here." />
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th className="ps-3 small text-muted fw-semibold border-top-0">Requested from</th>
                                                <th className="small text-muted fw-semibold border-top-0">Active on</th>
                                                <th className="small text-muted fw-semibold border-top-0">Outcome</th>
                                                <th className="small text-muted fw-semibold border-top-0 pe-3">When</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approvals.map(a => (
                                                <tr key={a.id}>
                                                    <td className="ps-3"><PlatformLabel platform={a.requesting_platform} /></td>
                                                    <td><PlatformLabel platform={a.active_platform} /></td>
                                                    <td><ApprovalBadge status={a.status} /></td>
                                                    <td className="pe-3 text-muted" style={{ fontSize: '12px' }} title={fmtDateTime(a.created_at)}>
                                                        {timeAgo(a.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </PanelBody>
                    </Panel>
                </div>

                {/* Sessions */}
                <div className="col-xl-4">
                    <Panel className="mb-0">
                        <PanelHeader>Sessions</PanelHeader>
                        <PanelBody className="p-0">
                            {loading ? (
                                <div className="py-4 text-center text-muted small">Loading…</div>
                            ) : sessions.length === 0 ? (
                                <EmptyState icon="fa-right-to-bracket" title="No sessions"
                                    hint="This user hasn't signed in yet." />
                            ) : (
                                sessions.map((s, i) => {
                                    const online = isOnline(s.last_used_at);
                                    return (
                                        <div key={s.id} className={`d-flex align-items-center gap-3 px-3 py-3 ${i > 0 ? 'border-top' : ''}`}>
                                            <span className={`rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0 ${online ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-muted'}`}
                                                style={{ width: 36, height: 36 }}>
                                                <i className={`fa-solid ${s.platform === 'mobile' ? 'fa-mobile-screen-button' : 'fa-display'}`}
                                                    style={{ fontSize: '14px' }}></i>
                                            </span>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold text-capitalize" style={{ fontSize: '13px' }}>
                                                    {s.platform} session
                                                    {online && <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 ms-2" style={{ fontSize: '10px' }}>Active</span>}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                                    Signed in {timeAgo(s.created_at)}
                                                    {s.last_used_at && <> · last seen {timeAgo(s.last_used_at)}</>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </PanelBody>
                    </Panel>
                </div>
            </div>
        </div>
    );
}

export default AdminUserDetail;
