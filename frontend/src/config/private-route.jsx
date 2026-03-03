import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to='/user/login-v3' replace />;
    }
    
    return children;
}

export default PrivateRoute;