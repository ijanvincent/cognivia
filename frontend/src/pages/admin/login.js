import React, { useEffect, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function AdminLogin() {
  const context = useContext(AppSettings);
  const [redirect, setRedirect] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    context.handleSetAppSidebarNone(true);
    context.handleSetAppHeaderNone(true);
    context.handleSetAppContentClass('p-0');

    return () => {
      context.handleSetAppSidebarNone(false);
      context.handleSetAppHeaderNone(false);
      context.handleSetAppContentClass('');
    };
    // eslint-disable-next-line
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setRedirect(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to='/admin/dashboard' />;
  }

  return (
    <div className="login login-with-news-feed">
      <div className="news-feed">
        <div className="news-image" style={{backgroundImage: 'url(/assets/img/login-bg/login-bg-11.jpg)'}}></div>
        <div className="news-caption">
          <h4 className="caption-title"><b>Cognivia</b></h4>
          <p>
            A smart quiz and learning platform. Test your knowledge, track your progress, and climb the leaderboard.
          </p>
        </div>
      </div>
      <div className="login-container">
        <div className="login-header mb-30px">
          <div className="brand">
            <div className="d-flex align-items-center">
              <span className="logo"></span>
              <b>Cognivia</b>
            </div>
            <small>Admin Dashboard</small>
          </div>
          <div className="icon">
            <i className="fa fa-sign-in-alt"></i>
          </div>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit} className="fs-13px">
            {error && (
              <div className="alert alert-danger mb-15px">{error}</div>
            )}
            <div className="form-floating mb-15px">
              <input
                type="email"
                className="form-control h-45px fs-13px"
                placeholder="Email Address"
                id="emailAddress"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label htmlFor="emailAddress" className="d-flex align-items-center fs-13px text-gray-600">Email Address</label>
            </div>
            <div className="form-floating mb-15px">
              <input
                type="password"
                className="form-control h-45px fs-13px"
                placeholder="Password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="d-flex align-items-center fs-13px text-gray-600">Password</label>
            </div>
            <div className="mb-15px">
              <button
                type="submit"
                className="btn btn-theme d-block h-45px w-100 btn-lg fs-14px"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign me in'}
              </button>
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <div className="text-gray-600 text-center text-gray-500-darker mb-0">
              &copy; Cognivia {new Date().getFullYear()}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;