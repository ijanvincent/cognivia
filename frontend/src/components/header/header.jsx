import React from 'react';
import { Link } from 'react-router-dom';
import DropdownNotification from './dropdown/notification.jsx';
import DropdownLanguage from './dropdown/language.jsx';
import DropdownProfile from './dropdown/profile.jsx';
import SearchForm from './search/form.jsx';
import DropdownMegaMenu from './dropdown/mega.jsx';

import { AppSettings } from './../../config/app-settings.js';
import { STORAGE_KEYS } from './../../services/api.js';

/*
 * NAMESPACE FIX — Replace generic localStorage['user'] read.
 *
 * What:  localStorage.getItem('user') → STORAGE_KEYS.ADMIN_DATA
 *        (localStorage only — admin sessions never use sessionStorage)
 *
 * Why:   The dark mode toggle checks user?.role === 'admin' to decide
 *        whether to render. After the namespace fix, 'user' is always null
 *        — the check always returned false and the toggle was never shown
 *        to the admin. Reading ADMIN_DATA gives the correct admin object
 *        and the role check resolves correctly.
 */

function Header() {
	return (
		<AppSettings.Consumer>
			{({toggleAppSidebarMobile, toggleAppSidebarEnd, toggleAppSidebarEndMobile, toggleAppTopMenuMobile, appHeaderLanguageBar, appHeaderMegaMenu, appHeaderInverse, appSidebarTwo, appTopMenu, appSidebarNone}) => (
				<div id="header" className="app-header" data-bs-theme={appHeaderInverse ? 'dark' : ''}>
					<div className="navbar-header">
						{appSidebarTwo && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarEndMobile}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						)}
						<Link to="/" className="navbar-brand"><span><b>Cognivia</b></span></Link>

						{appHeaderMegaMenu && (
							<button type="button" className="navbar-mobile-toggler" data-bs-toggle="collapse" data-bs-target="#top-navbar">
								<span className="fa-stack fa-lg text-inverse">
									<i className="far fa-square fa-stack-2x"></i>
									<i className="fa fa-cog fa-stack-1x"></i>
								</span>
							</button>
						)}
						{appTopMenu && !appSidebarNone && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppTopMenuMobile}>
								<span className="fa-stack fa-lg text-inverse">
									<i className="far fa-square fa-stack-2x"></i>
									<i className="fa fa-cog fa-stack-1x"></i>
								</span>
							</button>
						)}
						{appSidebarNone && appTopMenu && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppTopMenuMobile}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						)}
						{!appSidebarNone && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarMobile}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						)}
					</div>

					{appHeaderMegaMenu && (
						<DropdownMegaMenu />
					)}

					<div className="navbar-nav">
						<SearchForm />
						<DropdownNotification />

						{appHeaderLanguageBar && (
							<DropdownLanguage />
						)}

						{/* Admin-only dark mode toggle */}
						<AppSettings.Consumer>
							{({ appDarkMode, handleSetAppDarkMode }) => {
								// NAMESPACE FIX — read admin_data, not generic 'user'.
								// What:  localStorage.getItem('user') → STORAGE_KEYS.ADMIN_DATA
								// Why:   'user' key is no longer written. ADMIN_DATA holds the
								//        admin object with role:'admin'. Without this fix the
								//        toggle was never rendered for the admin.
								let isAdmin = false;
								try {
									const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
									if (token) {
										const adminUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}');
										isAdmin = adminUser?.role === 'admin';
									}
								} catch {}

								if (!isAdmin) return null;

								return (
									<div className="navbar-item">
										<button
											className="navbar-link icon btn border-0 bg-transparent"
											onClick={() => handleSetAppDarkMode(!appDarkMode)}
											title={appDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
											style={{ cursor: 'pointer' }}
										>
											<i className={`fa ${appDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
										</button>
									</div>
								);
							}}
						</AppSettings.Consumer>

						<DropdownProfile />

						{appSidebarTwo && (
							<div className="navbar-divider d-none d-md-block"></div>
						)}

						{appSidebarTwo && (
							<div className="navbar-item d-none d-md-block">
								<Link to="/" onClick={toggleAppSidebarEnd} className="navbar-link icon">
									<i className="fa fa-th"></i>
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</AppSettings.Consumer>
	);
}

export default Header;