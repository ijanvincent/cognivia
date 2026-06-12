import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import DropdownNotification from './dropdown/notification.jsx';
import DropdownProfile from './dropdown/profile.jsx';

function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const context = useContext(AppSettings);

    return (
        <AppSettings.Consumer>
            {({ toggleAppSidebarMobile, toggleAppSidebarMinify, appHeaderInverse, appSidebarNone }) => (
                <div id="header" className="app-header" data-bs-theme={appHeaderInverse ? 'dark' : ''}>

                    {/* ── Left: Hamburger + Brand ── */}
                    <div className="navbar-header">
                        {!appSidebarNone && (
                            <>
                                <button
                                    type="button"
                                    className="navbar-desktop-toggler"
                                    onClick={toggleAppSidebarMinify}
                                >
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <button
                                    type="button"
                                    className="navbar-mobile-toggler"
                                    onClick={toggleAppSidebarMobile}
                                >
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                            </>
                        )}
                        <Link to="/admin/dashboard" className="navbar-brand d-flex flex-column justify-content-center" style={{ lineHeight: 1 }}>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>CogniVia</span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', opacity: 0.6, textTransform: 'uppercase', marginTop: '2px' }}>Administrator</span>
                        </Link>
                    </div>

                    {/* ── Right: Search, Notif, Profile ── */}
                    <div className="navbar-nav ms-auto d-flex align-items-center gap-1">

                        {/* Search */}
                        <div className="navbar-item">
                            <button
                                className="navbar-link icon btn border-0 bg-transparent"
                                onClick={() => setSearchOpen(o => !o)}
                                title="Search"
                            >
                                <i className="fa fa-search"></i>
                            </button>
                            {searchOpen && (
                                <div
                                    className="position-absolute top-100 end-0 mt-1 shadow rounded-3 border p-2"
                                    style={{ zIndex: 1100, background: 'var(--bs-component-bg)', width: '280px' }}
                                >
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text bg-transparent border-end-0">
                                            <i className="fa fa-search" style={{ fontSize: '12px', opacity: 0.5 }}></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 shadow-none"
                                            placeholder="Search…"
                                            autoFocus
                                            style={{ fontSize: '13px' }}
                                            onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <DropdownNotification />

                        {/* Profile */}
                        <DropdownProfile />
                    </div>
                </div>
            )}
        </AppSettings.Consumer>
    );
}

export default Header;
