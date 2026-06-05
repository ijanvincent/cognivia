import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../services/api.js';
import { parseStoredJson } from '../services/storage.js';

function PublicRoute({ children }) {
    const [isChecking, setIsChecking]         = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Only localStorage token counts as "remembered".
        // sessionStorage = no remember me = must login again on public pages.
        const rememberToken = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        const user          = parseStoredJson(localStorage.getItem(STORAGE_KEYS.USER_DATA));

        if (rememberToken && user.role === 'user') {
            setIsAuthenticated(true);
        } else {
    setIsAuthenticated(false);
}
        setIsChecking(false);
    }, []);

    if (isChecking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080f' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to='/dashboard' replace />;
    }

    return children;
}

export default PublicRoute;
