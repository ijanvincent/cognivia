import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import App from './../app.jsx';
import UserLayout from './../components/layouts/UserLayout.jsx';
import PrivateRoute from './private-route.jsx';
import AdminPrivateRoute from './private-route-admin.jsx';

import AdminDashboard from './../pages/admin/Dashboard.jsx';
import AdminUsers from './../pages/admin/Users.jsx';
import AdminUsersAnalytics from './../pages/admin/UsersAnalytics.jsx';
import AdminLogin from './../pages/admin/Login.jsx';
import AdminDecks from './../pages/admin/decks.js';
import AdminLoginApprovals from './../pages/admin/login-approvals.js';

import UserDashboard from '../pages/user/UserDashboard.jsx';
import UserLogin from './../pages/user/Login.jsx';
import UserRegister from './../pages/user/Register.jsx';
import About from './../pages/user/About.jsx';
import Solutions from './../pages/user/Solutions.jsx';
import HowItWorks from './../pages/user/HowItWorks.jsx';
import FAQ from './../pages/user/Faq.jsx';
import Legal from './../pages/user/Legal.jsx';
import Contact from './../pages/user/Contact.jsx';
import ForgotPassword from './../pages/user/ForgotPassword.jsx';
import ResetPassword  from './../pages/user/ResetPassword.jsx';
import EditProfile from './../pages/user/EditProfile.jsx';
import PublicRoute from './../config/public-route.jsx';


import EmailInbox from './../pages/email/email-inbox.jsx';
import EmailCompose from './../pages/email/email-compose.jsx';
import EmailDetail from './../pages/email/email-detail.jsx';
import Widgets from './../pages/widget/widget.jsx';
import UIGeneral from './../pages/ui/ui-general.jsx';
import UITypography from './../pages/ui/ui-typography.jsx';
import UITabsAccordion from './../pages/ui/ui-tabs-accordion.jsx';
import UIModalNotification from './../pages/ui/ui-modal-notification.jsx';
import UIWidgetBoxes from './../pages/ui/ui-widget-boxes.jsx';
import UIMediaObject from './../pages/ui/ui-media-object.jsx';
import UIButtons from './../pages/ui/ui-buttons.jsx';
import UIIconDuotone from './../pages/ui/ui-icon-duotone.jsx';
import UIIconFontAwesome from './../pages/ui/ui-icon-fontawesome.jsx';
import UIIconBootstrap from './../pages/ui/ui-icon-bootstrap.jsx';
import UIIconSimpleLineIcons from './../pages/ui/ui-icon-simple-line-icons.jsx';
import UILanguageBarIcon from './../pages/ui/ui-language-bar-icon.jsx';
import UISocialButtons from './../pages/ui/ui-social-buttons.jsx';
import Bootstrap5 from './../pages/bootstrap/bootstrap-5.jsx';
import FormElements from './../pages/form/form-elements.jsx';
import FormPlugins from './../pages/form/form-plugins.jsx';
import FormWizards from './../pages/form/form-wizards.jsx';
import TableElements from './../pages/table/table-elements.jsx';
import TablePlugins from './../pages/table/table-plugins.jsx';
import PosCustomerOrder from './../pages/pos/customer-order.jsx';
import PosKitchenOrder from './../pages/pos/kitchen-order.jsx';
import PosCounterCheckout from './../pages/pos/counter-checkout.jsx';
import PosTableBooking from './../pages/pos/table-booking.jsx';
import PosMenuStock from './../pages/pos/menu-stock.jsx';
import ChartJS from './../pages/chart/chart-js.jsx';
import ChartApex from './../pages/chart/chart-apex.jsx';
import Landing from './../pages/landing/landing.jsx';
import Calendar from './../pages/calendar/calendar.jsx';
import MapGoogle from './../pages/map/map-google.jsx';
import MapVector from './../pages/map/map-vector.jsx';
import Gallery from './../pages/gallery/gallery.jsx';
import PageBlank from './../pages/option/page-blank.jsx';
import PageWithFooter from './../pages/option/page-with-footer.jsx';
import PageWithFixedFooter from './../pages/option/page-with-fixed-footer.jsx';
import PageWithoutSidebar from './../pages/option/page-without-sidebar.jsx';
import PageWithRightSidebar from './../pages/option/page-with-right-sidebar.jsx';
import PageWithMinifiedSidebar from './../pages/option/page-with-minified-sidebar.jsx';
import PageWithTwoSidebar from './../pages/option/page-with-two-sidebar.jsx';
import PageFullHeight from './../pages/option/page-full-height.jsx';
import PageWithWideSidebar from './../pages/option/page-with-wide-sidebar.jsx';
import PageWithLightSidebar from './../pages/option/page-with-light-sidebar.jsx';
import PageWithMegaMenu from './../pages/option/page-with-mega-menu.jsx';
import PageWithTopMenu from './../pages/option/page-with-top-menu.jsx';
import PageWithBoxedLayout from './../pages/option/page-with-boxed-layout.jsx';
import PageWithMixedMenu from './../pages/option/page-with-mixed-menu.jsx';
import PageBoxedLayoutWithMixedMenu from './../pages/option/page-boxed-layout-with-mixed-menu.jsx';
import PageWithTransparentSidebar from './../pages/option/page-with-transparent-sidebar.jsx';
import PageWithSearchSidebar from './../pages/option/page-with-search-sidebar.jsx';
import ExtraTimeline from './../pages/extra/extra-timeline.jsx';
import ExtraComingSoon from './../pages/extra/extra-coming-soon.jsx';
import ExtraSearch from './../pages/extra/extra-search.jsx';
import ExtraInvoice from './../pages/extra/extra-invoice.jsx';
import ExtraError from './../pages/extra/extra-error.jsx';
import ExtraProfile from './../pages/extra/extra-profile.jsx';
import ExtraScrumBoard from './../pages/extra/extra-scrum-board.jsx';
import ExtraCookieAcceptanceBanner from './../pages/extra/extra-cookie-acceptance-banner.jsx';
import ExtraOrders from './../pages/extra/extra-orders.jsx';
import ExtraOrderDetails from './../pages/extra/extra-order-details.jsx';
import ExtraProducts from './../pages/extra/extra-products.jsx';
import ExtraProductDetails from './../pages/extra/extra-product-details.jsx';
import ExtraFileManager from './../pages/extra/extra-file-manager.jsx';
import ExtraPricingPage from './../pages/extra/extra-pricing-page.jsx';
import ExtraMessengerPage from './../pages/extra/extra-messenger-page.jsx';
import ExtraDataManagement from './../pages/extra/extra-data-management.jsx';
import ExtraSettingsPage from './../pages/extra/extra-settings-page.jsx';
import HelperCSS from './../pages/helper/helper-css.jsx';

const AppRoute = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
  { path: '',               element: <Navigate to='/login' replace /> },
  { path: 'login',          element: <PublicRoute><UserLogin /></PublicRoute> },
  { path: 'register',       element: <PublicRoute><UserRegister /></PublicRoute> },
  { path: 'forgot-password',element: <ForgotPassword /> },
  { path: 'reset-password', element: <ResetPassword /> },
  { path: 'about',          element: <About /> },
  { path: 'solutions',      element: <Solutions /> },
  { path: 'howitworks',     element: <HowItWorks /> },
  { path: 'faq',            element: <FAQ /> },
  { path: 'privacy',        element: <Legal /> },
  { path: 'terms',          element: <Legal /> },
  { path: 'contact',        element: <Contact /> },
  { path: 'profile', element: <PrivateRoute><EditProfile /></PrivateRoute> },
  { path: 'dashboard',      element: <PrivateRoute><UserDashboard /></PrivateRoute> },
]
  },
  {
    path: '*',
    element: <App />,
    children: [
      { path: 'admin',                 element: <Navigate to='/admin/login' replace /> },
      { path: 'admin/login',           element: <AdminLogin /> },
      { path: 'admin/dashboard',        element: <AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute> },
      { path: 'admin/users',            element: <AdminPrivateRoute><AdminUsers /></AdminPrivateRoute> },
      { path: 'admin/users/analytics',  element: <AdminPrivateRoute><AdminUsersAnalytics /></AdminPrivateRoute> },
      { path: 'admin/decks',            element: <AdminPrivateRoute><AdminDecks /></AdminPrivateRoute> },
      { path: 'admin/login-approvals',  element: <AdminPrivateRoute><AdminLoginApprovals /></AdminPrivateRoute> },
      { path: 'email/*', element: <Outlet />, children: [
        { path: 'inbox',   element: <EmailInbox /> },
        { path: 'compose', element: <EmailCompose /> },
        { path: 'detail',  element: <EmailDetail /> },
        { path: '*',       element: <ExtraError /> }
      ]},
      { path: 'widgets', element: <Widgets /> },
      { path: 'ui/*', element: <Outlet />, children: [
        { path: 'general',                element: <UIGeneral /> },
        { path: 'typography',             element: <UITypography /> },
        { path: 'tabs-accordion',         element: <UITabsAccordion /> },
        { path: 'modal-notification',     element: <UIModalNotification /> },
        { path: 'widget-boxes',           element: <UIWidgetBoxes /> },
        { path: 'media-object',           element: <UIMediaObject /> },
        { path: 'buttons',                element: <UIButtons /> },
        { path: 'icon-duotone',           element: <UIIconDuotone /> },
        { path: 'icon-fontawesome',       element: <UIIconFontAwesome /> },
        { path: 'icon-bootstrap',         element: <UIIconBootstrap /> },
        { path: 'icon-simple-line-icons', element: <UIIconSimpleLineIcons /> },
        { path: 'language-bar-icon',      element: <UILanguageBarIcon /> },
        { path: 'social-buttons',         element: <UISocialButtons /> },
        { path: '*',                      element: <ExtraError /> }
      ]},
      { path: 'bootstrap-5', element: <Bootstrap5 /> },
      { path: 'form/*', element: <Outlet />, children: [
        { path: 'elements', element: <FormElements /> },
        { path: 'plugins',  element: <FormPlugins /> },
        { path: 'wizards',  element: <FormWizards /> },
        { path: '*',        element: <ExtraError /> }
      ]},
      { path: 'table/*', element: <Outlet />, children: [
        { path: 'elements', element: <TableElements /> },
        { path: 'plugins',  element: <TablePlugins /> },
        { path: '*',        element: <ExtraError /> }
      ]},
      { path: 'pos/*', element: <Outlet />, children: [
        { path: 'customer-order',   element: <PosCustomerOrder /> },
        { path: 'kitchen-order',    element: <PosKitchenOrder /> },
        { path: 'counter-checkout', element: <PosCounterCheckout /> },
        { path: 'table-booking',    element: <PosTableBooking /> },
        { path: 'menu-stock',       element: <PosMenuStock /> },
        { path: '*',                element: <ExtraError /> }
      ]},
      { path: 'chart/*', element: <Outlet />, children: [
        { path: 'js',   element: <ChartJS /> },
        { path: 'apex', element: <ChartApex /> },
        { path: '*',    element: <ExtraError /> }
      ]},
      { path: 'landing',  element: <Landing /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'map/*', element: <Outlet />, children: [
        { path: 'google', element: <MapGoogle /> },
        { path: 'vector', element: <MapVector /> },
      ]},
      { path: 'gallery', element: <Gallery /> },
      { path: 'page-option/*', element: <Outlet />, children: [
        { path: 'blank',                        element: <PageBlank /> },
        { path: 'with-footer',                  element: <PageWithFooter /> },
        { path: 'with-fixed-footer',            element: <PageWithFixedFooter /> },
        { path: 'without-sidebar',              element: <PageWithoutSidebar /> },
        { path: 'with-right-sidebar',           element: <PageWithRightSidebar /> },
        { path: 'with-minified-sidebar',        element: <PageWithMinifiedSidebar /> },
        { path: 'with-two-sidebar',             element: <PageWithTwoSidebar /> },
        { path: 'full-height',                  element: <PageFullHeight /> },
        { path: 'with-wide-sidebar',            element: <PageWithWideSidebar /> },
        { path: 'with-light-sidebar',           element: <PageWithLightSidebar /> },
        { path: 'with-mega-menu',               element: <PageWithMegaMenu /> },
        { path: 'with-top-menu',                element: <PageWithTopMenu /> },
        { path: 'with-boxed-layout',            element: <PageWithBoxedLayout /> },
        { path: 'with-mixed-menu',              element: <PageWithMixedMenu /> },
        { path: 'boxed-layout-with-mixed-menu', element: <PageBoxedLayoutWithMixedMenu /> },
        { path: 'with-transparent-sidebar',     element: <PageWithTransparentSidebar /> },
        { path: 'with-search-sidebar',          element: <PageWithSearchSidebar /> },
        { path: '*',                            element: <ExtraError /> }
      ]},
      { path: 'extra/*', element: <Outlet />, children: [
        { path: 'timeline',                 element: <ExtraTimeline /> },
        { path: 'coming-soon',              element: <ExtraComingSoon /> },
        { path: 'search',                   element: <ExtraSearch /> },
        { path: 'invoice',                  element: <ExtraInvoice /> },
        { path: 'error',                    element: <ExtraError /> },
        { path: 'profile',                  element: <ExtraProfile /> },
        { path: 'scrum-board',              element: <ExtraScrumBoard /> },
        { path: 'cookie-acceptance-banner', element: <ExtraCookieAcceptanceBanner /> },
        { path: 'orders',                   element: <ExtraOrders /> },
        { path: 'order-details',            element: <ExtraOrderDetails /> },
        { path: 'products',                 element: <ExtraProducts /> },
        { path: 'product-details',          element: <ExtraProductDetails /> },
        { path: 'file-manager',             element: <ExtraFileManager /> },
        { path: 'pricing-page',             element: <ExtraPricingPage /> },
        { path: 'messenger-page',           element: <ExtraMessengerPage /> },
        { path: 'data-management',          element: <ExtraDataManagement /> },
        { path: 'settings-page',            element: <ExtraSettingsPage /> },
        { path: '*',                        element: <ExtraError /> }
      ]},
      { path: 'helper/css', element: <HelperCSS /> },
      { path: '*',          element: <ExtraError /> }
    ]
  }
];

export default AppRoute;