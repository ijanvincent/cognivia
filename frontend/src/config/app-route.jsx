import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import App from './../app.jsx';

import DashboardV1 from './../pages/dashboard/dashboard-v1.js';
import DashboardV2 from './../pages/dashboard/dashboard-v2.js';
import DashboardV3 from './../pages/dashboard/dashboard-v3.js';
import EmailInbox from './../pages/email/email-inbox.js';
import EmailCompose from './../pages/email/email-compose.js';
import EmailDetail from './../pages/email/email-detail.js';
import Widgets from './../pages/widget/widget.js';
import UIGeneral from './../pages/ui/ui-general.js';
import UITypography from './../pages/ui/ui-typography.js';
import UITabsAccordion from './../pages/ui/ui-tabs-accordion.js';
import UIModalNotification from './../pages/ui/ui-modal-notification.js';
import UIWidgetBoxes from './../pages/ui/ui-widget-boxes.js';
import UIMediaObject from './../pages/ui/ui-media-object.js';
import UIButtons from './../pages/ui/ui-buttons.js';
import UIIconDuotone from './../pages/ui/ui-icon-duotone.js';
import UIIconFontAwesome from './../pages/ui/ui-icon-fontawesome.js';
import UIIconBootstrap from './../pages/ui/ui-icon-bootstrap.js';
import UIIconSimpleLineIcons from './../pages/ui/ui-icon-simple-line-icons.js';
import UILanguageBarIcon from './../pages/ui/ui-language-bar-icon.js';
import UISocialButtons from './../pages/ui/ui-social-buttons.js';
import Bootstrap5 from './../pages/bootstrap/bootstrap-5.js';
import FormElements from './../pages/form/form-elements.js';
import FormPlugins from './../pages/form/form-plugins.js';
import FormWizards from './../pages/form/form-wizards.js';
import TableElements from './../pages/table/table-elements.js';
import TablePlugins from './../pages/table/table-plugins.js';
import PosCustomerOrder from './../pages/pos/customer-order.js';
import PosKitchenOrder from './../pages/pos/kitchen-order.js';
import PosCounterCheckout from './../pages/pos/counter-checkout.js';
import PosTableBooking from './../pages/pos/table-booking.js';
import PosMenuStock from './../pages/pos/menu-stock.js';
import ChartJS from './../pages/chart/chart-js.js';
import ChartApex from './../pages/chart/chart-apex.js';
import Landing from './../pages/landing/landing.js';
import Calendar from './../pages/calendar/calendar.js';
import MapGoogle from './../pages/map/map-google.js';
import MapVector from './../pages/map/map-vector.js';
import Gallery from './../pages/gallery/gallery.js';
import PageBlank from './../pages/option/page-blank.js';
import PageWithFooter from './../pages/option/page-with-footer.js';
import PageWithFixedFooter from './../pages/option/page-with-fixed-footer.js';
import PageWithoutSidebar from './../pages/option/page-without-sidebar.js';
import PageWithRightSidebar from './../pages/option/page-with-right-sidebar.js';
import PageWithMinifiedSidebar from './../pages/option/page-with-minified-sidebar.js';
import PageWithTwoSidebar from './../pages/option/page-with-two-sidebar.js';
import PageFullHeight from './../pages/option/page-full-height.js';
import PageWithWideSidebar from './../pages/option/page-with-wide-sidebar.js';
import PageWithLightSidebar from './../pages/option/page-with-light-sidebar.js';
import PageWithMegaMenu from './../pages/option/page-with-mega-menu.js';
import PageWithTopMenu from './../pages/option/page-with-top-menu.js';
import PageWithBoxedLayout from './../pages/option/page-with-boxed-layout.js';
import PageWithMixedMenu from './../pages/option/page-with-mixed-menu.js';
import PageBoxedLayoutWithMixedMenu from './../pages/option/page-boxed-layout-with-mixed-menu.js';
import PageWithTransparentSidebar from './../pages/option/page-with-transparent-sidebar.js';
import PageWithSearchSidebar from './../pages/option/page-with-search-sidebar.js';
import ExtraTimeline from './../pages/extra/extra-timeline.js';
import ExtraComingSoon from './../pages/extra/extra-coming-soon.js';
import ExtraSearch from './../pages/extra/extra-search.js';
import ExtraInvoice from './../pages/extra/extra-invoice.js';
import ExtraError from './../pages/extra/extra-error.js';
import ExtraProfile from './../pages/extra/extra-profile.js';
import ExtraScrumBoard from './../pages/extra/extra-scrum-board.js';
import ExtraCookieAcceptanceBanner from './../pages/extra/extra-cookie-acceptance-banner.js';
import ExtraOrders from './../pages/extra/extra-orders.js';
import ExtraOrderDetails from './../pages/extra/extra-order-details.js';
import ExtraProducts from './../pages/extra/extra-products.js';
import ExtraProductDetails from './../pages/extra/extra-product-details.js';
import ExtraFileManager from './../pages/extra/extra-file-manager.js';
import ExtraPricingPage from './../pages/extra/extra-pricing-page.js';
import ExtraMessengerPage from './../pages/extra/extra-messenger-page.js';
import ExtraDataManagement from './../pages/extra/extra-data-management.js';
import ExtraSettingsPage from './../pages/extra/extra-settings-page.js';
import LoginV1 from './../pages/user/login-v1.js';
import LoginV2 from './../pages/user/login-v2.js';
import LoginV3 from './../pages/user/login-v3.js';
import RegisterV3 from './../pages/user/register-v3.js';
import HelperCSS from './../pages/helper/helper-css.js';

const AppRoute = [
  {
    path: '*', 
    element: <App />,
    children: [
    	{
				path: '', 
				element: <Navigate to='/dashboard/v3' />
			},
    	{
				path: 'dashboard/*', 
				element: <Outlet />,
				children: [
					{ path: 'v1', element: <DashboardV1 /> },
					{ path: 'v2', element: <DashboardV2 /> },
					{ path: 'v3', element: <DashboardV3 /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'email/*', 
				element: <Outlet />,
				children: [
					{ path: 'inbox', element: <EmailInbox /> },
					{ path: 'compose', element: <EmailCompose /> },
					{ path: 'detail', element: <EmailDetail /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'widgets', 
				element: <Widgets />
			},
			{
				path: 'ui/*', 
				element: <Outlet />,
				children: [
					{ path: 'general', element: <UIGeneral /> },
					{ path: 'typography', element: <UITypography /> },
					{ path: 'tabs-accordion', element: <UITabsAccordion /> },
					{ path: 'modal-notification', element: <UIModalNotification /> },
					{ path: 'widget-boxes', element: <UIWidgetBoxes /> },
					{ path: 'media-object', element: <UIMediaObject /> },
					{ path: 'buttons', element: <UIButtons /> },
					{ path: 'icon-duotone', element: <UIIconDuotone /> },
					{ path: 'icon-fontawesome', element: <UIIconFontAwesome /> },
					{ path: 'icon-bootstrap', element: <UIIconBootstrap /> },
					{ path: 'icon-simple-line-icons', element: <UIIconSimpleLineIcons /> },
					{ path: 'language-bar-icon', element: <UILanguageBarIcon /> },
					{ path: 'social-buttons', element: <UISocialButtons /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'bootstrap-5', 
				element: <Bootstrap5 />
			},
			{
				path: 'form/*', 
				element: <Outlet />,
				children: [
					{ path: 'elements', element: <FormElements /> },
					{ path: 'plugins', element: <FormPlugins /> },
					{ path: 'wizards', element: <FormWizards /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'table/*', 
				element: <Outlet />,
				children: [
					{ path: 'elements', element: <TableElements /> },
					{ path: 'plugins', element: <TablePlugins /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'pos/*', 
				element: <Outlet />,
				children: [
					{ path: 'customer-order', element: <PosCustomerOrder /> },
					{ path: 'kitchen-order', element: <PosKitchenOrder /> },
					{ path: 'counter-checkout', element: <PosCounterCheckout /> },
					{ path: 'table-booking', element: <PosTableBooking /> },
					{ path: 'menu-stock', element: <PosMenuStock /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'chart/*', 
				element: <Outlet />,
				children: [
					{ path: 'js', element: <ChartJS /> },
					{ path: 'apex', element: <ChartApex /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'landing', 
				element: <Landing />
			},
			{
				path: 'calendar', 
				element: <Calendar />
			},
			{
				path: 'map/*', 
				element: <Outlet />,
				children: [
					{ path: 'google', element: <MapGoogle /> },
					{ path: 'vector', element: <MapVector /> },
				]
			},
			{
				path: 'gallery', 
				element: <Gallery />
			},
			{
				path: 'page-option/*', 
				element: <Outlet />,
				children: [
					{ path: 'blank', element: <PageBlank /> },
					{ path: 'with-footer', element: <PageWithFooter /> },
					{ path: 'with-fixed-footer', element: <PageWithFixedFooter /> },
					{ path: 'without-sidebar', element: <PageWithoutSidebar /> },
					{ path: 'with-right-sidebar', element: <PageWithRightSidebar /> },
					{ path: 'with-minified-sidebar', element: <PageWithMinifiedSidebar /> },
					{ path: 'with-two-sidebar', element: <PageWithTwoSidebar /> },
					{ path: 'full-height', element: <PageFullHeight /> },
					{ path: 'with-wide-sidebar', element: <PageWithWideSidebar /> },
					{ path: 'with-light-sidebar', element: <PageWithLightSidebar /> },
					{ path: 'with-mega-menu', element: <PageWithMegaMenu /> },
					{ path: 'with-top-menu', element: <PageWithTopMenu /> },
					{ path: 'with-boxed-layout', element: <PageWithBoxedLayout /> },
					{ path: 'with-mixed-menu', element: <PageWithMixedMenu /> },
					{ path: 'boxed-layout-with-mixed-menu', element: <PageBoxedLayoutWithMixedMenu /> },
					{ path: 'with-boxed-layout', element: <PageWithBoxedLayout /> },
					{ path: 'with-transparent-sidebar', element: <PageWithTransparentSidebar /> },
					{ path: 'with-search-sidebar', element: <PageWithSearchSidebar /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'extra/*', 
				element: <Outlet />,
				children: [
					{ path: 'timeline', element:<ExtraTimeline /> },
					{ path: 'coming-soon', element:<ExtraComingSoon />},
					{ path: 'search', element:<ExtraSearch /> },
					{ path: 'invoice', element:<ExtraInvoice /> },
					{ path: 'error', element:<ExtraError /> },
					{ path: 'profile', element:<ExtraProfile /> },
					{ path: 'scrum-board', element:<ExtraScrumBoard /> },
					{ path: 'cookie-acceptance-banner', element:<ExtraCookieAcceptanceBanner /> },
					{ path: 'orders', element:<ExtraOrders /> },
					{ path: 'order-details', element:<ExtraOrderDetails /> },
					{ path: 'products', element:<ExtraProducts /> },
					{ path: 'product-details', element:<ExtraProductDetails /> },
					{ path: 'file-manager', element:<ExtraFileManager /> },
					{ path: 'pricing-page', element:<ExtraPricingPage /> },
					{ path: 'messenger-page', element:<ExtraMessengerPage /> },
					{ path: 'data-management', element:<ExtraDataManagement /> },
					{ path: 'settings-page', element:<ExtraSettingsPage /> },
					{ path: '*', element: <ExtraError /> }
				]
			}, 
			{
				path: 'user/*', 
				element: <Outlet />,
				children: [
					{ path: 'login-v1', element:<LoginV1 /> },
					{ path: 'login-v2', element:<LoginV2 /> },
					{ path: 'login-v3', element:<LoginV3 /> },
					{ path: 'register-v3', element:<RegisterV3 /> },
					{ path: '*', element: <ExtraError /> }
				]
			}, 
			{
				path: 'helper/css', 
				element: <HelperCSS />
			},
    	{ path: '*', element: <ExtraError /> }
		]
  }
];


export default AppRoute;