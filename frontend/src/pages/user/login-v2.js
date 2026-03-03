import React, { useEffect, useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function LoginV2() {
	const context = useContext(AppSettings);
	const [redirect, setRedirect] = useState(false);
	const [activeBg, setActiveBg] = useState('/assets/img/login-bg/login-bg-17.jpg');
  const [bg1, setBg1] = useState(true);
  const [bg2, setBg2] = useState(false);
  const [bg3, setBg3] = useState(false);
  const [bg4, setBg4] = useState(false);
  const [bg5, setBg5] = useState(false);
  const [bg6, setBg6] = useState(false);
	const selectBg = (e, active, bg) => {
    e.preventDefault();

    setActiveBg(bg);
    setBg1(active === 'bg1');
    setBg2(active === 'bg2');
    setBg3(active === 'bg3');
    setBg4(active === 'bg4');
    setBg5(active === 'bg5');
    setBg6(active === 'bg6');
    setRedirect(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setRedirect(true);
  };

  useEffect(() => {
    context.handleSetAppSidebarNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppContentClass('p-0');

    return function cleanUp() {
      context.handleSetAppSidebarNone(false);
      context.handleSetAppHeaderNone(false);
      context.handleSetAppContentClass('');
    };
		
		// eslint-disable-next-line
	}, []);

  if (redirect) {
    return <Navigate to='/dashboard/v3' />;
  }

  return (
    <>
      <div className="login login-v2 fw-bold">
        <div className="login-cover">
          <div className="login-cover-img" style={{ backgroundImage: `url(${activeBg})` }}></div>
          <div className="login-cover-bg"></div>
        </div>

        <div className="login-container">
          <div className="login-header">
            <div className="brand">
              <div className="d-flex align-items-center">
                <span className="logo"></span> <b>Color</b> Admin
              </div>
              <small>Bootstrap 5 Responsive Admin Template</small>
            </div>
            <div className="icon">
              <i className="fa fa-lock"></i>
            </div>
          </div>

          <div className="login-content">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-20px">
                <input type="text" className="form-control fs-13px h-45px border-0" placeholder="Email Address" id="emailAddress" />
                <label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">Email Address</label>
              </div>
              <div className="form-floating mb-20px">
                <input type="password" className="form-control fs-13px h-45px border-0" placeholder="Password" />
                <label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">Password</label>
              </div>
              <div className="form-check mb-20px">
                <input className="form-check-input border-0" type="checkbox" value="1" id="rememberMe" />
                <label className="form-check-label fs-13px text-gray-500" htmlFor="rememberMe">
                  Remember Me
                </label>
              </div>
              <div className="mb-20px">
                <button type="submit" className="btn btn-theme d-block w-100 h-45px btn-lg">Sign me in</button>
              </div>
              <div className="text-gray-500">
                Not a member yet? Click <Link to="/user/register-v3">here</Link> to register.
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="login-bg-list clearfix">
        <div className={`login-bg-list-item ${bg1 ? 'active' : ''}`}>
          <Link to="/user/login-v2" onClick={(e) => selectBg(e, 'bg1', '/assets/img/login-bg/login-bg-17.jpg')} style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-17.jpg)' }} className="login-bg-list-link"></Link>
        </div>
        <div className={`login-bg-list-item ${bg2 ? 'active' : ''}`}>
          <Link to="/user/login-v2" onClick={(e) => selectBg(e, 'bg2', '/assets/img/login-bg/login-bg-16.jpg')} style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-16.jpg)' }} className="login-bg-list-link"></Link>
        </div>
        <div className={`login-bg-list-item ${bg3 ? 'active' : ''}`}>
          <Link to="/user/login-v2" onClick={(e) => selectBg(e, 'bg3', '/assets/img/login-bg/login-bg-15.jpg')} style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-15.jpg)' }} className="login-bg-list-link"></Link>
        </div>
        <div className={`login-bg-list-item ${bg4 ? 'active' : ''}`}>
          <Link to="/user/login-v2" onClick={(e) => selectBg(e, 'bg4', '/assets/img/login-bg/login-bg-14.jpg')} style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-14.jpg)' }} className="login-bg-list-link"></Link>
        </div>
        <div className={`login-bg-list-item ${bg5 ? 'active' : ''}`}>
          <Link to="/user/login-v2" onClick={(e) => selectBg(e, 'bg5', '/assets/img/login-bg/login-bg-13.jpg')} style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-13.jpg)' }} className="login-bg-list-link"></Link>
        </div>
        <div className={`login-bg-list-item ${bg6 ? 'active' : ''}`}>
          <Link to="/user/login-v2" onClick={(e) => selectBg(e, 'bg6', '/assets/img/login-bg/login-bg-12.jpg')} style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-12.jpg)' }} className="login-bg-list-link"></Link>
        </div>
      </div>
    </>
  );
}

export default LoginV2;