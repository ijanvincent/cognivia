import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const [isChecking, setIsChecking]           = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const user  = JSON.parse(
            localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
        );
        setIsAuthenticated(!!token && user.role === 'user');
        setIsChecking(false);
    }, []);

    useEffect(() => {
        if (!isAuthenticated || isChecking) return;

        // Push a duplicate history entry so back button stays on dashboard
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            // User pressed back — push forward again, trapping them on dashboard
            window.history.pushState(null, '', window.location.href);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isAuthenticated, isChecking]);

    if (isChecking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080f' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return children;
}

export default PrivateRoute;