import React, { useContext, useState } from 'react';
import { AppSettings } from './../../config/app-settings.js';

function ThemePanel() {
	const context = useContext(AppSettings);
	const [expand, setExpand] = useState(false);
	const [theme, setTheme] = useState((localStorage && typeof localStorage.appTheme !== 'undefined') ?  localStorage.appTheme : 'teal');
	const themeList = ['red','pink','orange','yellow','lime','green','teal','cyan','blue','purple','indigo','dark'];
	
	function handleDarkMode(e) {
		if (e.target.checked) {
			context.handleSetAppDarkMode(true);
		} else {
			context.handleSetAppDarkMode(false);
		}
	}
	
	function handleHeaderFixed(e) {
		if (e.target.checked) {
			context.handleSetAppHeaderFixed(true);
		} else {
			context.handleSetAppHeaderFixed(false);
		}
	}
	
	function handleSidebarFixed(e) {
		if (e.target.checked) {
			context.handleSetAppSidebarFixed(true);
		} else {
			context.handleSetAppSidebarFixed(false);
		}
	}
	
	function handleHeaderInverse(e) {
		if (e.target.checked) {
			context.handleSetAppHeaderInverse(true);
		} else {
			context.handleSetAppHeaderInverse(false);
		}
	}
	
	function handleSidebarGrid(e) {
		if (e.target.checked) {
			context.handleSetAppSidebarGrid(true);
		} else {
			context.handleSetAppSidebarGrid(false);
		}
	}
	
	function handleGradientEnabled(e) {
		if (e.target.checked) {
			context.handleSetAppGradientEnabled(true);
		} else {
			context.handleSetAppGradientEnabled(false);
		}
	}
	
	function toggleExpand(e) {
		e.preventDefault();
		setExpand(!expand);
	}
	
	function toggleTheme(e, theme) {
		e.preventDefault();
		context.handleSetAppTheme(theme);
		setTheme(theme);
	}
	
	return (
		<AppSettings.Consumer>
			{({appDarkMode, appHeaderFixed, appHeaderInverse, appSidebarFixed, appSidebarGrid, appGradientEnabled}) => (
				<div className={'theme-panel ' + (expand ? 'active' : '')}>
					<a href="#0" onClick={ e => toggleExpand(e) } className="theme-collapse-btn"><i className="fa fa-cog"></i></a>
					<div className="theme-panel-content" data-scrollbar="true" data-height="100%">
						<h5>App Settings</h5>
			
						<div className="theme-list">
							{themeList.map((themeListItem, i) => (
								<div key={i} className={'theme-list-item '+ ((themeListItem === theme) ? 'active' : '')}>
									<a href="#0" onClick={ e => toggleTheme(e, themeListItem) } className={'theme-list-link bg-'+ themeListItem}>&nbsp;</a>
								</div>
							))}
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<div className="row mt-10px">
							<div className="col-8 control-label text-dark fw-bold">
								<div>Dark Mode <span className="badge bg-primary ms-1 py-2px position-relative" style={{top: '-1px'}}>NEW</span></div>
								<div className="lh-14">
									<small className="text-dark opacity-50">
										Adjust the appearance to reduce glare and give your eyes a break.
									</small>
								</div>
							</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-theme-dark-mode" onChange={handleDarkMode} id="appThemeDarkMode" checked={appDarkMode} value="1" />
									<label className="form-check-label" htmlFor="appThemeDarkMode">&nbsp;</label>
								</div>
							</div>
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Header Fixed</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-header-fixed" onChange={handleHeaderFixed} id="appHeaderFixed" value="1" checked={appHeaderFixed} />
									<label className="form-check-label" htmlFor="appHeaderFixed">&nbsp;</label>
								</div>
							</div>
						</div>
						<div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Header Inverse</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-header-inverse" onChange={handleHeaderInverse} id="appHeaderInverse" checked={appHeaderInverse} />
									<label className="form-check-label" htmlFor="appHeaderInverse">&nbsp;</label>
								</div>
							</div>
						</div>
						<div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Sidebar Fixed</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-sidebar-fixed" onChange={handleSidebarFixed} id="appSidebarFixed" checked={appSidebarFixed} />
									<label className="form-check-label" htmlFor="appSidebarFixed">&nbsp;</label>
								</div>
							</div>
						</div>
						<div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Sidebar Grid</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" onChange={handleSidebarGrid} name="app-sidebar-grid" id="appSidebarGrid" checked={appSidebarGrid} />
									<label className="form-check-label" htmlFor="appSidebarGrid">&nbsp;</label>
								</div>
							</div>
						</div>
						<div className="row mt-10px align-items-center">
							<div className="col-md-8 control-label text-dark fw-bold">Gradient Enabled</div>
							<div className="col-md-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-gradient-enabled" onChange={handleGradientEnabled} id="appGradientEnabled" checked={appGradientEnabled} />
									<label className="form-check-label" htmlFor="appGradientEnabled">&nbsp;</label>
								</div>
							</div>
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<h5>Admin Design (6)</h5>
						<div className="theme-version">
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/html/index_v2.html" className="theme-version-link active">
									<span style={{backgroundImage: 'url(/assets/img/theme/default.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/transparent/index_v2.html" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/transparent.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/apple/index_v2.html" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/apple.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/material/index_v2.html" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/material.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/facebook/index_v2.html" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/facebook.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/google/index_v2.html" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/google.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<h5>Language Version (9)</h5>
						<div className="theme-version">
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/html/index_v2.html" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/html.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/ajax/" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/ajax.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/angularjs/" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/angular1x.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/angularjs17/" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/angular10x.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="javascript:alert('Svelte Version only available in downloaded version.');" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/svelte.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="javascript:alert('Laravel 11 Version only available in downloaded version.');" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/laravel.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="javascript:alert('Django Version only available in downloaded version.');" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/django.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/vue3/" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/vuejs.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/admin/react/" className="theme-version-link active">
									<span style={{backgroundImage: 'url(/assets/img/version/reactjs.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="javascript:alert('.NET Core 8.0 Version only available in downloaded version.');" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/version/dotnet.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<h5>Frontend Design (5)</h5>
						<div className="theme-version">
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/frontend/one-page-parallax/" target="_blank" rel="noreferrer" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/one-page-parallax.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/frontend/e-commerce/" target="_blank" rel="noreferrer" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/e-commerce.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/frontend/blog/" target="_blank" rel="noreferrer" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/blog.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/frontend/forum/" target="_blank" rel="noreferrer" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/forum.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
							<div className="theme-version-item">
								<a href="https://seantheme.com/color-admin/frontend/corporate/" target="_blank" rel="noreferrer" className="theme-version-link">
									<span style={{backgroundImage: 'url(/assets/img/theme/corporate.jpg)'}} className="theme-version-cover"></span>
								</a>
							</div>
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<a href="https://seantheme.com/color-admin/documentation/" className="btn btn-dark d-block w-100 rounded-pill mb-10px" target="_blank" rel="noreferrer"><b>Documentation</b></a>
						<a href="#0" className="btn btn-default d-block w-100 rounded-pill" data-toggle="reset-local-storage"><b>Reset Local Storage</b></a>
					</div>
				</div>
			)}
		</AppSettings.Consumer>
	);
};

export default ThemePanel;
