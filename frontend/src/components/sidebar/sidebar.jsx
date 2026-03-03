import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AppSettings } from './../../config/app-settings.js';
import { slideUp } from './../../composables/slideUp.js';
import { slideToggle } from './../../composables/slideToggle.js';
import SidebarMinifyBtn from './sidebar-minify-btn.jsx';
import SidebarProfile from './sidebar-profile.jsx';
import SidebarNav from './sidebar-nav.jsx';

function Sidebar() {
	const context = useContext(AppSettings);
	
	useEffect(() => {
		var handleSidebarMenuToggle = function(menus, expandTime) {
			menus.map(function(menu) {
				menu.onclick = function(e) {
					e.preventDefault();
					var target = this.nextElementSibling;

					menus.map(function(m) {
						var otherTarget = m.nextElementSibling;
						if (otherTarget !== target) {
							slideUp(otherTarget, expandTime);
							otherTarget.closest('.menu-item').classList.remove('expand');
							otherTarget.closest('.menu-item').classList.add('closed');
						}
						return true;
					});

					var targetItemElm = target.closest('.menu-item');
		
					if (targetItemElm.classList.contains('expand') || (targetItemElm.classList.contains('active') && !target.style.display)) {
						targetItemElm.classList.remove('expand');
						targetItemElm.classList.add('closed');
						slideToggle(target, expandTime);
					} else {
						targetItemElm.classList.add('expand');
						targetItemElm.classList.remove('closed');
						slideToggle(target, expandTime);
					}
				}
				
				return true;
			});
		};
		
		var targetSidebar       = document.querySelector('.app-sidebar:not(.app-sidebar-end)');
		var expandTime          = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 300;
	
		var menuBaseSelector = '.app-sidebar .menu > .menu-item.has-sub';
		var submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub';

		// menu
		var menuLinkSelector =  menuBaseSelector + ' > .menu-link';
		var menus = [].slice.call(document.querySelectorAll(menuLinkSelector));
		handleSidebarMenuToggle(menus, expandTime);

		// submenu lvl 1
		var submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
		var submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link'));
		handleSidebarMenuToggle(submenusLvl1, expandTime);

		// submenu lvl 2
		var submenuLvl2Selector = menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
		var submenusLvl2 = [].slice.call(document.querySelectorAll(submenuLvl2Selector + ' > .menu-link'));
		handleSidebarMenuToggle(submenusLvl2, expandTime);
		
		
		var appSidebarFloatSubmenuTimeout = '';
		var appSidebarFloatSubmenuDom = '';
		
		function handleGetHiddenMenuHeight(elm) {
			elm.setAttribute('style', 'position: absolute; visibility: hidden; display: block !important');
			var targetHeight  = elm.clientHeight;
			elm.removeAttribute('style');
			return targetHeight;
		}
		
		function handleSidebarMinifyFloatMenuClick() {
			var elms = [].slice.call(document.querySelectorAll('#app-sidebar-float-submenu .menu-item.has-sub > .menu-link'));
			if (elms) {
				elms.map(function(elm) {
					elm.onclick = function(e) {
						e.preventDefault();
						var targetItem = this.closest('.menu-item');
						var target = targetItem.querySelector('.menu-submenu');
						var targetStyle = getComputedStyle(target);
						var close = (targetStyle.getPropertyValue('display') !== 'none') ? true : false;
						var expand = (targetStyle.getPropertyValue('display') !== 'none') ? false : true;
				
						slideToggle(target);
				
						var loopHeight = setInterval(function() {
							var targetMenu = document.querySelector('#app-sidebar-float-submenu');
							var targetMenuArrow = document.querySelector('#app-sidebar-float-submenu-arrow');
							var targetMenuLine = document.querySelector('#app-sidebar-float-submenu-line');
							var targetHeight = targetMenu.clientHeight;
							var targetOffset = targetMenu.getBoundingClientRect();
							var targetOriTop = targetMenu.getAttribute('data-offset-top');
							var targetMenuTop = targetMenu.getAttribute('data-menu-offset-top');
							var targetTop 	 = targetOffset.top;
							var windowHeight = document.body.clientHeight;
							if (close) {
								if (targetTop > targetOriTop) {
									targetTop = (targetTop > targetOriTop) ? targetOriTop : targetTop;
									targetMenu.style.top = targetTop + 'px';
									targetMenu.style.bottom = 'auto';
									targetMenuArrow.style.top = '20px';
									targetMenuArrow.style.bottom = 'auto';
									targetMenuLine.style.top = '20px';
									targetMenuLine.style.bottom = 'auto';
								}
							}
							if (expand) {
								if ((windowHeight - targetTop) < targetHeight) {
									var arrowBottom = (windowHeight - targetMenuTop) - 22;
									targetMenu.style.top = 'auto';
									targetMenu.style.bottom = 0;
									targetMenuArrow.style.top = 'auto';
									targetMenuArrow.style.bottom = arrowBottom + 'px';
									targetMenuLine.style.top = '20px';
									targetMenuLine.style.bottom = arrowBottom + 'px';
								}
								var floatSubmenuElm = document.querySelector('#app-sidebar-float-submenu .app-sidebar-float-submenu');
								if (targetHeight > windowHeight) {
									if (floatSubmenuElm) {
										var splitClass = ('overflow-scroll mh-100vh').split(' ');
										for (var i = 0; i < splitClass.length; i++) {
											floatSubmenuElm.classList.add(splitClass[i]);
										}
									}
								}
							}
						}, 1);
						setTimeout(function() {
							clearInterval(loopHeight);
						}, 250);
					}
					return true;
				});
			}
		}

		function handleSidebarMinifyFloatMenu() {
			var elms = [].slice.call(document.querySelectorAll('.app-sidebar .menu > .menu-item.has-sub > .menu-link'));
			if (elms) {
				elms.map(function(elm) {
					elm.onmouseenter = function() {
						var appElm = document.querySelector('.app');
						if (appElm && appElm.classList.contains('app-sidebar-minified')) {
							clearTimeout(appSidebarFloatSubmenuTimeout);
							var targetMenu = this.closest('.menu-item').querySelector('.menu-submenu');
							if (appSidebarFloatSubmenuDom === this && document.querySelector('#app-sidebar-float-submenu')) {
								return;
							} else {
								appSidebarFloatSubmenuDom = this;
							}
							var targetMenuHtml = targetMenu.innerHTML;
							if (targetMenuHtml) {
								var bodyStyle     = getComputedStyle(document.body);
								var sidebar       = document.querySelector('#sidebar');
								var sidebarOffset = sidebar.getBoundingClientRect();
								var sidebarWidth  = parseInt(sidebar.clientWidth);
								var sidebarX      = (!appElm.classList.contains('app-sidebar-end') && bodyStyle.getPropertyValue('direction') !== 'rtl') ? (sidebarOffset.left + sidebarWidth) : (document.body.clientWidth - sidebarOffset.left);
								var targetHeight  = handleGetHiddenMenuHeight(targetMenu);
								var targetOffset  = this.getBoundingClientRect();
								var targetTop     = targetOffset.top;
								var targetLeft    = (!appElm.classList.contains('app-sidebar-end') && bodyStyle.getPropertyValue('direction') !== 'rtl') ? sidebarX : 'auto';
								var targetRight   = (!appElm.classList.contains('app-sidebar-end') && bodyStyle.getPropertyValue('direction') !== 'rtl') ? 'auto' : sidebarX;
								var darkMode      = (sidebar.getAttribute('data-bs-theme') === 'dark') ? true : false;
								var windowHeight  = document.body.clientHeight;
						
								if (!document.querySelector('#app-sidebar-float-submenu')) {
									var overflowClass = '';
									if (targetHeight > windowHeight) {
										overflowClass = 'overflow-scroll mh-100vh';
									}
									var html = document.createElement('div');
									if (darkMode) {
										html.setAttribute('data-bs-theme', 'dark');
									}
									html.setAttribute('id', 'app-sidebar-float-submenu');
									html.setAttribute('class', 'app-sidebar-float-submenu-container');
									html.setAttribute('data-offset-top', targetTop);
									html.setAttribute('data-menu-offset-top', targetTop);
									html.innerHTML = ''+
									'	<div class="app-sidebar-float-submenu-arrow" id="app-sidebar-float-submenu-arrow"></div>'+
									'	<div class="app-sidebar-float-submenu-line" id="app-sidebar-float-submenu-line"></div>'+
									'	<div class="app-sidebar-float-submenu '+ overflowClass +'">'+ targetMenuHtml + '</div>';
									appElm.appendChild(html);
							
									var elm = document.getElementById('app-sidebar-float-submenu');
									elm.onmouseover = function() {
										clearTimeout(appSidebarFloatSubmenuTimeout);
									};
									elm.onmouseout = function() {
										appSidebarFloatSubmenuTimeout = setTimeout(() => {
											document.querySelector('#app-sidebar-float-submenu').remove();
										}, 250);
									};
								} else {
									var floatSubmenu = document.querySelector('#app-sidebar-float-submenu');
									var floatSubmenuInnerElm = document.querySelector('#app-sidebar-float-submenu .app-sidebar-float-submenu');
							
									if (targetHeight > windowHeight) {
										if (floatSubmenuInnerElm) {
											var splitClass = ('overflow-scroll mh-100vh').split(' ');
											for (var i = 0; i < splitClass.length; i++) {
												floatSubmenuInnerElm.classList.add(splitClass[i]);
											}
										}
									}
									floatSubmenu.setAttribute('data-offset-top', targetTop);
									floatSubmenu.setAttribute('data-menu-offset-top', targetTop);
									floatSubmenuInnerElm.innerHTML = targetMenuHtml;
								}
				
								var targetSubmenuHeight = document.querySelector('#app-sidebar-float-submenu').clientHeight;
								var floatSubmenuElm = document.querySelector('#app-sidebar-float-submenu');
								var floatSubmenuArrowElm = document.querySelector('#app-sidebar-float-submenu-arrow');
								var floatSubmenuLineElm = document.querySelector('#app-sidebar-float-submenu-line');
								if ((windowHeight - targetTop) > targetSubmenuHeight) {
									if (floatSubmenuElm) {
										floatSubmenuElm.style.top = targetTop + 'px';
										floatSubmenuElm.style.left = targetLeft + 'px';
										floatSubmenuElm.style.bottom = 'auto';
										floatSubmenuElm.style.right = targetRight + 'px';
									}
									if (floatSubmenuArrowElm) {
										floatSubmenuArrowElm.style.top = '20px';
										floatSubmenuArrowElm.style.bottom = 'auto';
									}
									if (floatSubmenuLineElm) {
										floatSubmenuLineElm.style.top = '20px';
										floatSubmenuLineElm.style.bottom = 'auto';
									}
								} else {
									var arrowBottom = (windowHeight - targetTop) - 21;
									if (floatSubmenuElm) {
										floatSubmenuElm.style.top = 'auto';
										floatSubmenuElm.style.left = targetLeft + 'px';
										floatSubmenuElm.style.bottom = 0;
										floatSubmenuElm.style.right = targetRight + 'px';
									}
									if (floatSubmenuArrowElm) {
										floatSubmenuArrowElm.style.top = 'auto';
										floatSubmenuArrowElm.style.bottom = arrowBottom + 'px';
									}
									if (floatSubmenuLineElm) {
										floatSubmenuLineElm.style.top = '20px';
										floatSubmenuLineElm.style.bottom = arrowBottom + 'px';
									}
								}
								handleSidebarMinifyFloatMenuClick();
							} else {
								document.querySelector('#app-sidebar-float-submenu-line').remove();
								appSidebarFloatSubmenuDom = '';
							}
						}
					}
					elm.onmouseleave = function() {
						var elm = document.querySelector('.app');
						if (elm && elm.classList.contains('app-sidebar-minified')) {
							appSidebarFloatSubmenuTimeout = setTimeout(() => {
								var elm = document.querySelector('#app-sidebar-float-submenu-line');
								if (elm) {
									elm.remove();
								}
								appSidebarFloatSubmenuDom = '';
							}, 250);
						}
					}
					return true;
				});
			}
		};
		
		handleSidebarMinifyFloatMenu();
	});
	
	return (
		<AppSettings.Consumer>
			{({toggleAppSidebarMinify, toggleAppSidebarMobile, appSidebarTransparent, appSidebarGrid, appSidebarLight}) => (
				<React.Fragment>
					<div id="sidebar" className={'app-sidebar ' + (appSidebarTransparent ? 'app-sidebar-transparent' : '') + (appSidebarGrid ? 'app-sidebar-grid' : '')} data-bs-theme={appSidebarLight ? '' : 'dark'}>
						<PerfectScrollbar className="app-sidebar-content" options={{suppressScrollX: true}}>
							{!context.appSidebarSearch && ( <SidebarProfile /> )}
							<SidebarNav />
							<SidebarMinifyBtn />
						</PerfectScrollbar>
					</div>
					<div className="app-sidebar-bg" data-bs-theme={appSidebarLight ? '' : 'dark'}></div>
					<div className="app-sidebar-mobile-backdrop"><Link to="/" onClick={toggleAppSidebarMobile} className="stretched-link"></Link></div>
				</React.Fragment>
			)}
		</AppSettings.Consumer>
	)
}

export default Sidebar;
