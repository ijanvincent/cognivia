import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const user = JSON.parse(
            localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
        );
        // Golden Rule #1 — must have token AND role must be 'user'
        // Admin cannot access user routes and vice versa!
        setIsAuthenticated(!!token && user.role === 'user');
        setIsChecking(false);
    }, []);

    if (isChecking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
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