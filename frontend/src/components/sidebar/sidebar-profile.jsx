import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import { slideToggle } from './../../composables/slideToggle.js';
import { STORAGE_KEYS } from './../../services/api.js';

/*
 * NAMESPACE FIX — Replace generic localStorage['user'] reads.
 *
 * What:  Both inline reads replaced with getAdminUser() helper:
 *          localStorage.getItem('user') → STORAGE_KEYS.ADMIN_DATA
 *            (from localStorage, admin sessions only)
 *
 * Why:   sidebar-profile.jsx is rendered exclusively inside the admin
 *        layout. It should only ever read admin session data. The generic
 *        'user' key is no longer written by any login flow — it is always
 *        null after the namespace fix — so both the username and the role
 *        label always fell back to 'User' / 'Member' regardless of who
 *        was logged in. Reading ADMIN_DATA from localStorage gives the
 *        correct admin username and confirms role === 'admin' for the
 *        'Administrator' label.
 */
function getAdminUser() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (!token) return {};
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_DATA) || '{}') || {};
  } catch { return {}; }
}

function SidebarProfile() {
  function handleProfileExpand(e) {
    e.preventDefault();

    var targetSidebar = document.querySelector('.app-sidebar:not(.app-sidebar-end)');
    var targetMenu    = e.target.closest('.menu-profile');
    var targetProfile = document.querySelector('#appSidebarProfileMenu');
    var expandTime    = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 250;

    if (targetProfile) {
      if (targetProfile.style.display === 'block') {
        targetMenu.classList.remove('active');
      } else {
        targetMenu.classList.add('active');
      }
      slideToggle(targetProfile, expandTime);
      targetProfile.classList.toggle('expand');
    }
  }

  // Read once at render time — admin layout only.
  const adminUser   = getAdminUser();
  const displayName = adminUser?.username || 'Admin';
  const roleLabel   = adminUser?.role === 'admin' ? 'Administrator' : 'Member';

  return (
    <AppSettings.Consumer>
      {({ appSidebarMinify }) => (
        <div className="menu">
          <div className="menu-profile">
            <Link to="/" onClick={handleProfileExpand} className="menu-profile-link">
              <div className="menu-profile-cover with-shadow"></div>
              <div className="menu-profile-image">
                <img src="../assets/img/user/user-13.jpg" alt="" />
              </div>
              <div className="menu-profile-info">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    {displayName}
                  </div>
                  <div className="menu-caret ms-auto"></div>
                </div>
                <small>{roleLabel}</small>
              </div>
            </Link>
          </div>
          <div id="appSidebarProfileMenu" className="collapse">
            <div className="menu-item pt-5px">
              <a href="#/" className="menu-link" onClick={e => e.preventDefault()}>
                <div className="menu-icon"><i className="fa fa-cog"></i></div>
                <div className="menu-text">Settings</div>
              </a>
            </div>
            <div className="menu-item">
              <a href="#/" className="menu-link" onClick={e => e.preventDefault()}>
                <div className="menu-icon"><i className="fa fa-pencil-alt"></i></div>
                <div className="menu-text">Send Feedback</div>
              </a>
            </div>
            <div className="menu-item pb-5px">
              <a href="#/" className="menu-link" onClick={e => e.preventDefault()}>
                <div className="menu-icon"><i className="fa fa-question-circle"></i></div>
                <div className="menu-text">Help</div>
              </a>
            </div>
            <div className="menu-divider m-0"></div>
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
}

export default SidebarProfile;