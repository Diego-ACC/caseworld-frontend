import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAdmin = true; // Luego esto lo controlaremos con login

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;