import React, { useEffect, useState } from 'react';
import { AppSettings } from './config/app-settings.js';
import { slideToggle } from './composables/slideToggle.js';

import Header from './components/header/header.jsx';
import Sidebar from './components/sidebar/sidebar.jsx';
import SidebarRight from './components/sidebar-right/sidebar-right.jsx';
import TopMenu from './components/top-menu/top-menu.jsx';
import Content from './components/content/content.jsx';
import ThemePanel from './components/theme-panel/theme-panel.jsx';

function App() {	
	const [appTheme] = useState('');
	const [appDarkMode, setAppDarkMode] = useState(false);
	const [appGradientEnabled, setAppGradientEnabled] = useState(false);
	const [appHeaderNone, setAppHeaderNone] = useState(false);
	const [appHeaderFixed, setAppHeaderFixed] = useState(true);
	const [appHeaderInverse, setAppHeaderInverse] = useState(false);
	const [appHeaderMegaMenu, setAppHeaderMegaMenu] = useState(false);
	const [appHeaderLanguageBar, setAppHeaderLanguageBar] = useState(false);
	const [hasScroll, setHasScroll] = useState(false);
	const [appSidebarNone, setAppSidebarNone] = useState(false);
	const [appSidebarWide, setAppSidebarWide] = useState(false);
	const [appSidebarLight, setAppSidebarLight] = useState(false);
	const [appSidebarMinify, setAppSidebarMinify] = useState(false);
	const [appSidebarMobileToggled, setAppSidebarMobileToggled] = useState(false);
	const [appSidebarTransparent, setAppSidebarTransparent] = useState(false);
	const [appSidebarSearch, setAppSidebarSearch] = useState(false);
	const [appSidebarFixed, setAppSidebarFixed] = useState(true);
	const [appSidebarGrid, setAppSidebarGrid] = useState(false);
	const [appContentNone, setAppContentNone] = useState(false);
	const [appContentClass, setAppContentClass] = useState('');
	const [appContentFullHeight, setAppContentFullHeight] = useState(false);
	const [appTopMenu, setAppTopMenu] = useState(false);
	const [appTopMenuMobileToggled] = useState(false);
	const [appSidebarTwo, setAppSidebarTwo] = useState(false);
	const [appSidebarEnd, setAppSidebarEnd] = useState(false);
	const [appSidebarEndToggled, setAppSidebarEndToggled] = useState(false);
	const [appSidebarEndMobileToggled, setAppSidebarEndMobileToggled] = useState(false);
  
  const handleSetAppHeaderNone = (value) => {
		setAppHeaderNone(value);
	};

	const handleSetAppHeaderInverse = (value) => {
		setAppHeaderInverse(value);
	};

	const handleSetAppHeaderLanguageBar = (value) => {
		setAppHeaderLanguageBar(value);
	};

	const handleSetAppHeaderMegaMenu = (value) => {
		setAppHeaderMegaMenu(value);
	};

	const handleSetAppHeaderFixed = (value) => {
		if (value === false && appSidebarFixed) {
			alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
			setAppSidebarFixed(false);
			if (localStorage) {
				localStorage.appSidebarFixed = false;
			}
		}
		setAppHeaderFixed(value);
		if (localStorage) {
			localStorage.appHeaderFixed = value;
		}
	};

	const handleSetAppSidebarNone = (value) => {
		setAppSidebarNone(value);
	};

	const handleSetAppSidebarWide = (value) => {
		setAppSidebarWide(value);
	};

	const handleSetAppSidebarLight = (value) => {
		setAppSidebarLight(value);
	};

	const handleSetAppSidebarMinified = (value) => {
		setAppSidebarMinify(value);
	};

	const handleSetAppSidebarTransparent = (value) => {
		setAppSidebarTransparent(value);
	};

	const handleSetAppSidebarSearch = (value) => {
		setAppSidebarSearch(value);
	};

	const handleSetAppSidebarFixed = (value) => {
		if (value === true && !appHeaderFixed) {
			alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
			setAppHeaderFixed(true);
			if (localStorage) {
				localStorage.appHeaderFixed = true;
			}
		}
		setAppSidebarFixed(value);
		if (localStorage) {
			localStorage.appSidebarFixed = value;
		}
	};

	const handleSetAppSidebarGrid = (value) => {
		setAppSidebarGrid(value);
		if (localStorage) {
			localStorage.appSidebarGrid = value;
		}
	};

	const toggleAppSidebarMinify = (e) => {
		e.preventDefault();
		setAppSidebarMinify(!appSidebarMinify);
		if (localStorage) {
			localStorage.appSidebarMinify = !appSidebarMinify;
		}
	};

	const toggleAppSidebarMobile = (e) => {
		e.preventDefault();
		setAppSidebarMobileToggled(!appSidebarMobileToggled);
	};

	const handleSetAppSidebarEnd = (value) => {
		setAppSidebarEnd(value);
	};

	const handleSetAppContentNone = (value) => {
		setAppContentNone(value);
	};

	const handleSetAppContentClass = (value) => {
		setAppContentClass(value);
	};

	const handleSetAppContentFullHeight = (value) => {
		setAppContentFullHeight(value);
	};

	const handleSetAppTopMenu = (value) => {
		setAppTopMenu(value);
	};

	const toggleAppTopMenuMobile = (e) => {
		e.preventDefault();
		slideToggle(document.querySelector('.app-top-menu'));
	};

	const handleSetAppSidebarTwo = (value) => {
		setAppSidebarTwo(value);
		setAppSidebarEndToggled(value);
	};

	const handleSetAppBoxedLayout = (value) => {
		if (value === true) {
			document.body.classList.add('boxed-layout');
		} else {
			document.body.classList.remove('boxed-layout');
		}
	};

	const handleSetAppDarkMode = (value) => {
		if (value === true) {
			document.querySelector('html').setAttribute('data-bs-theme', 'dark');
		} else {
			document.querySelector('html').removeAttribute('data-bs-theme');
		}
		setAppDarkMode(value);
		if (localStorage) {
			localStorage.appDarkMode = value;
		}
		document.dispatchEvent(new Event('theme-reload'));
	};

	const handleSetAppGradientEnabled = (value) => {
		setAppGradientEnabled(value);
		if (localStorage) {
			localStorage.appGradientEnabled = value;
		}
	};

	const handleSetAppTheme = (value) => {
		var newTheme = 'theme-' + value;
		for (var x = 0; x < document.body.classList.length; x++) {
			if (
				document.body.classList[x].indexOf('theme-') > -1 &&
				document.body.classList[x] !== newTheme
			) {
				document.body.classList.remove(document.body.classList[x]);
			}
		}
		document.body.classList.add(newTheme);

		if (localStorage && value) {
			localStorage.appTheme = value;
		}
		document.dispatchEvent(new Event('theme-reload'));
	};
	
	const toggleAppSidebarEnd = (e) => {
		e.preventDefault();
		setAppSidebarEndToggled(!appSidebarEndToggled);
	};
	
	const toggleAppSidebarEndMobile = (e) => {
		e.preventDefault();
		setAppSidebarEndMobileToggled(!appSidebarEndMobileToggled);
	}

	useEffect(() => {
		handleSetAppTheme(appTheme);
		if (appDarkMode) {
			handleSetAppDarkMode(true);
		}

		const handleScroll = () => {
			if (window.scrollY > 0) {
				setHasScroll(true);
			} else {
				setHasScroll(false);
			}
			var elm = document.getElementsByClassName('nvtooltip');
			for (var i = 0; i < elm.length; i++) {
				elm[i].classList.add('d-none');
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [appTheme, appDarkMode]);

	return (
		<AppSettings.Provider
			value={{
				appTheme,
				appDarkMode,
				appGradientEnabled,
				appHeaderNone,
				appHeaderFixed,
				appHeaderInverse,
				appHeaderMegaMenu,
				appHeaderLanguageBar,
				hasScroll,
				handleSetAppHeaderNone,
				handleSetAppHeaderInverse,
				handleSetAppHeaderLanguageBar,
				handleSetAppHeaderMegaMenu,
				handleSetAppHeaderFixed,
				appSidebarNone,
				appSidebarWide,
				appSidebarLight,
				appSidebarMinify,
				appSidebarMobileToggled,
				appSidebarTransparent,
				appSidebarSearch,
				appSidebarFixed,
				appSidebarGrid,
				handleSetAppSidebarNone,
				handleSetAppSidebarWide,
				handleSetAppSidebarLight,
				handleSetAppSidebarMinified,
				handleSetAppSidebarTransparent,
				handleSetAppSidebarSearch,
				handleSetAppSidebarFixed,
				handleSetAppSidebarGrid,
				toggleAppSidebarMinify,
				toggleAppSidebarMobile,
				appContentNone,
				appContentClass,
				appContentFullHeight,
				handleSetAppContentNone,
				handleSetAppContentClass,
				handleSetAppContentFullHeight,
				appTopMenu,
				appTopMenuMobileToggled,
				toggleAppTopMenuMobile,
				handleSetAppTopMenu,
				appSidebarTwo,
				handleSetAppSidebarTwo,
				appSidebarEnd,
				appSidebarEndToggled,
				appSidebarEndMobileToggled,
				toggleAppSidebarEnd,
				toggleAppSidebarEndMobile,
				handleSetAppSidebarEnd,
				handleSetAppBoxedLayout,
				handleSetAppDarkMode,
				handleSetAppGradientEnabled,
				handleSetAppTheme,
			}}
		>
			<div
				className={
					'app ' +
					(appGradientEnabled ? 'app-gradient-enabled ' : '') +
					(appHeaderNone ? 'app-without-header ' : '') +
					(appHeaderFixed && !appHeaderNone ? 'app-header-fixed ' : '') +
					(appSidebarFixed ? 'app-sidebar-fixed ' : '') +
					(appSidebarNone ? 'app-without-sidebar ' : '') +
					(appSidebarEnd ? 'app-with-end-sidebar ' : '') +
					(appSidebarWide ? 'app-with-wide-sidebar ' : '') +
					(appSidebarMinify ? 'app-sidebar-minified ' : '') +
					(appSidebarMobileToggled ? 'app-sidebar-mobile-toggled ' : '') +
					(appTopMenu ? 'app-with-top-menu ' : '') +
					(appContentFullHeight ? 'app-content-full-height ' : '') +
					(appSidebarTwo ? 'app-with-two-sidebar ' : '') +
					(appSidebarEndToggled ? 'app-sidebar-end-toggled ' : '') +
					(appSidebarEndMobileToggled ? 'app-sidebar-end-mobile-toggled ' : '') +
					(hasScroll ? 'has-scroll ' : '')
				}
			>
				{!appHeaderNone && <Header />}
				{!appSidebarNone && <Sidebar />}
				{appSidebarTwo && <SidebarRight />}
				{appTopMenu && <TopMenu />}
				{!appContentNone && <Content />}
				<ThemePanel />
			</div>
		</AppSettings.Provider>
	);
}

export default App;