import React, { useEffect } from 'react';
import { useResolvedPath, useMatch, useLocation, matchPath, Link, NavLink } from 'react-router-dom';
import menus from './../../config/app-menu.jsx';
import { slideUp } from './../../composables/slideUp.js';
import { slideToggle } from './../../composables/slideToggle.js';

function NavItem({ menu, ...props }: LinkProps) {
	let resolved = useResolvedPath(menu.path);
  let match = useMatch({ path: resolved.pathname });
  
  let location = useLocation();
  let match2 = matchPath({path: menu.path, end: false, },location.pathname);
  
	let icon = menu.icon && <div className="menu-icon"><i className={menu.icon}></i></div>;
	let img = menu.img && <div className="menu-icon-img"><img src={menu.img} alt="" /></div>;
	let caret = (menu.children && !menu.badge) && <div className="menu-caret"></div>;
	let label = menu.label && <span className="menu-label ms-5px">{menu.label}</span>;
	let badge = menu.badge && <div className="menu-badge">{menu.badge}</div>;
	let highlight = menu.highlight && <i className="fa fa-paper-plane text-theme"></i>;
	let title = menu.title && <div className="menu-text">{menu.title} {label} {highlight}</div>;
	
	return (
    <div className={'menu-item' + ((match || match2) ? ' active' : '') + (menu.children ? ' has-sub' : '')}>
    	<NavLink className="menu-link" to={menu.path} {...props}>
				{ img } { icon } { title }{ caret } { badge }
			</NavLink>
			
      {menu.children && (
				<div className="menu-submenu">
					{menu.children.map((submenu, i) => (
						<NavItem key={i} menu={submenu} />
					))}
				</div>
			)}
    </div>
  );
}

function TopMenuNav() {
	useEffect(() => {
		handlePageLoadMenuFocus();
		handleTopMenuSubMenu();
	});
	
	function handlePageLoadMenuFocus() {
		var targetMenu = document.querySelector('.app-top-menu .menu');
		if (!targetMenu) {
			return;
		}
		var bodyStyle = window.getComputedStyle(document.body);
		var viewWidth = document.querySelector('.app-top-menu').clientWidth - 128;
		var prevWidth = 0;
		var fullWidth = 0;

		var elms = [].slice.call(document.querySelectorAll('.app-top-menu .menu > .menu-item'));
		if (elms) {
			var found = false;
			elms.map(function(elm) {
				if (!elm.classList.contains('menu-control')) {
					fullWidth += elm.clientWidth;
					if (!found) {
						prevWidth += elm.clientWidth;
					}
					if (elm.classList.contains('active')) {
						found = true;
					}
				}
				return true;
			});
		}
	
		if (prevWidth >= viewWidth) {
			var finalScrollWidth = prevWidth - viewWidth + 128;
			if (bodyStyle.getPropertyValue('direction') !== 'rtl') {
				targetMenu.style.marginLeft = '-' + finalScrollWidth + 'px';
			} else {
				targetMenu.style.marginRight = '-' + finalScrollWidth + 'px';
			}
		}
	
		var elm = targetMenu.querySelector('.menu-control.menu-control-end');
		if (prevWidth !== fullWidth && fullWidth >= viewWidth) {
			elm.classList.add('show');
		} else {
			elm.classList.remove('show');
		}

		var elm2 = targetMenu.querySelector('.menu-control.menu-control-start');
		if (prevWidth >= viewWidth && fullWidth >= viewWidth) {
			elm2.classList.add('show');
		} else {
			elm2.classList.remove('show');
		}
	};
	
	function handleMenuButtonAction(elm, direction) {
		var element = elm.target;
		var obj = element.closest('.menu');
		var objStyle = window.getComputedStyle(obj);
		var bodyStyle = window.getComputedStyle(document.querySelector('body'));
		var targetCss = (bodyStyle.getPropertyValue('direction') === 'rtl') ? 'margin-right' : 'margin-left';
		var marginLeft = parseInt(objStyle.getPropertyValue(targetCss));  
		var containerWidth = document.querySelector('.app-top-menu').clientWidth - 80;
		var totalWidth = 0;
		var finalScrollWidth = 0;
	
		var elms = [].slice.call(obj.querySelectorAll('.menu-item'));
		if (elms) {
			elms.map(function(elm) {
				if (!elm.classList.contains('menu-control')) {
					totalWidth += elm.clientWidth;
				}
				return true;
			});
		}

		switch (direction) {
			case 'next':
				var widthNextLeft = totalWidth + marginLeft - containerWidth;
				if (widthNextLeft <= containerWidth) {
					finalScrollWidth = widthNextLeft - marginLeft - 88;
					setTimeout(function() {
						obj.querySelector('.menu-control.menu-control-end').classList.remove('show');
					}, 300);
				} else {
					finalScrollWidth = containerWidth - marginLeft - 88;
				}

				if (finalScrollWidth !== 0) {
					obj.style.transitionProperty = 'height, margin, padding';
					obj.style.transitionDuration = '300ms';
					if (bodyStyle.getPropertyValue('direction') !== 'rtl') {
						obj.style.marginLeft = '-' + finalScrollWidth + 'px';
					} else {
						obj.style.marginRight = '-' + finalScrollWidth + 'px';
					}
					setTimeout(function() {
						obj.style.transitionProperty = '';
						obj.style.transitionDuration = '';
						obj.querySelector('.menu-control.menu-control-start').classList.add('show');
					}, 300);
				}
				break;
			case 'prev':
				var widthPrevLeft = -marginLeft;

				if (widthPrevLeft <= containerWidth) {
					obj.querySelector('.menu-control.menu-control-start').classList.remove('show');
					finalScrollWidth = 0;
				} else {
					finalScrollWidth = widthPrevLeft - containerWidth + 88;
				}
			
				obj.style.transitionProperty = 'height, margin, padding';
				obj.style.transitionDuration = '300ms';
			
				if (bodyStyle.getPropertyValue('direction') !== 'rtl') {
					obj.style.marginLeft = '-' + finalScrollWidth + 'px';
				} else {
					obj.style.marginRight = '-' + finalScrollWidth + 'px';
				}
			
				setTimeout(function() {
					obj.style.transitionProperty = '';
					obj.style.transitionDuration = '';
					obj.querySelector('.menu-control.menu-control-end').classList.add('show');
				}, 300);
				break;
			default:
				break;
			}
	};
	
	function handleTopMenuToggle(menus, forMobile = false) {
		menus.map(function(menu) {
			menu.onclick = function(e) {
				e.preventDefault();
			
				if (!forMobile || (forMobile && document.body.clientWidth < 768)) {
					var target = this.nextElementSibling;
					menus.map(function(m) {
						var otherTarget = m.nextElementSibling;
						if (otherTarget !== target) {
							slideUp(otherTarget);
							otherTarget.closest('.menu-item').classList.remove('expand');
							otherTarget.closest('.menu-item').classList.add('closed');
						}
						
						return true;
					});
			
					slideToggle(target);
				}
			}
			
			return true;
		});
	};

	function handleTopMenuSubMenu() {
		var menuBaseSelector = '.app-top-menu .menu > .menu-item.has-sub';
		var submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub';
	
		var menuLinkSelector =  menuBaseSelector + ' > .menu-link';
		var menus = [].slice.call(document.querySelectorAll(menuLinkSelector));
		handleTopMenuToggle(menus, true);
	
		var submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
		var submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link'));
		handleTopMenuToggle(submenusLvl1);
	
		var submenuLvl2Selector = menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
		var submenusLvl2 = [].slice.call(document.querySelectorAll(submenuLvl2Selector + ' > .menu-link'));
		handleTopMenuToggle(submenusLvl2);
	
		window.addEventListener('resize', function() {
			var elms = [].slice.call(document.querySelectorAll('.app-top-menu .menu-submenu'));
			elms.map(function(elm) {
				elm.removeAttribute('style');
				return true;
			});
		});
	};
	
	function controlRight(e) {
		e.preventDefault();
		handleMenuButtonAction(e, 'next');
	}

	function controlLeft(e) {
		e.preventDefault();
		handleMenuButtonAction(e, 'prev');
	}

	return (
		<div id="app-top-menu" className="menu">
			{menus.map((menu, i) => (
				<NavItem key={i} menu={menu} />
			))}
			<div className="menu-item menu-control menu-control-start">
				<Link className="menu-link" to="/" onClick={controlLeft}><i className="fa fa-angle-left"></i></Link>
			</div>
			<div className="menu-item menu-control menu-control-end">
				<Link className="menu-link" to="/" onClick={controlRight}><i className="fa fa-angle-right"></i></Link>
			</div>
		</div>
	);
}

export default TopMenuNav;