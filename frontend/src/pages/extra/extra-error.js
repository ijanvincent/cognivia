import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function ExtraError() {
  const context = useContext(AppSettings);

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

  return (
    <div className="error">
      <div className="error-code">404</div>
      <div className="error-content">
        <div className="error-message">We couldn't find it...</div>
        <div className="error-desc mb-4">
          The page you're looking for doesn't exist. <br />
          Perhaps, these pages will help find what you're looking for.
        </div>
        <div>
          <Link to="/" className="btn btn-success px-3">Go Home</Link>
        </div>
      </div>
    </div>
  );
}

export default ExtraError;