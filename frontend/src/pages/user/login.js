import React, { useEffect, useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import api from './../../services/api.js';

function UserLogin() {
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
      const response = await api.post('/login', { email, password });
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
    return <Navigate to='/dashboard' />;
  }

  return (
    <div className="login login-v2 fw-bold">
      <div className="login-cover">
        <div className="login-cover-img" style={{backgroundImage: 'url(/assets/img/login-bg/login-bg-17.jpg)'}}></div>
        <div className="login-cover-bg"></div>
      </div>
      <div className="login-container">
        <div className="login-header">
          <div className="brand">
            <div className="d-flex align-items-center">
              <span className="logo"></span> <b>Cognivia</b>
            </div>
            <small>Welcome back!</small>
          </div>
          <div className="icon">
            <i className="fa fa-lock"></i>
          </div>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger mb-20px">{error}</div>
            )}
            <div className="form-floating mb-20px">
              <input
                type="email"
                className="form-control fs-13px h-45px border-0"
                placeholder="Email Address"
                id="emailAddress"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">Email Address</label>
            </div>
            <div className="form-floating mb-20px">
              <input
                type="password"
                className="form-control fs-13px h-45px border-0"
                placeholder="Password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="d-flex align-items-center text-gray-600 fs-13px">Password</label>
            </div>
            <div className="mb-20px">
              <button
                type="submit"
                className="btn btn-theme d-block w-100 h-45px btn-lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign me in'}
              </button>
            </div>
            <div className="text-white">
              Not a member yet? Click <Link to="/register" className="text-white fw-bold">here</Link> to register.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;