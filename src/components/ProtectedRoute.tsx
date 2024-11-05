import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { decodeToken } from '../tokenUtils';

interface ProtectedRouteProps {
    allowedRoles: string[]; // Array of allowed roles
    children?: React.ReactNode; // Optional children prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");
    let userRole: string | null = null;

    // Check if the token exists and decode it
    if (token) {
        const decodedToken = decodeToken(token);
        userRole = decodedToken.role; // Extract role from the decoded token
      //   console.log(userRole);
    }

    // Check if the user's role is included in the allowed roles
    const isAuthorized = userRole && allowedRoles.includes(userRole);

    // Redirect logic
    if (!isAuthorized) {
        if (userRole?.startsWith('volunteer')) {
            // If user is a volunteer, redirect to their respective page
            return <Navigate to={`/${userRole}`} replace />;
        } else {
            // For any other role, redirect to the unauthenticated page
            return <Navigate to="/unauthenticated" replace />;
        }
    }

    // The user has access; render the desired component here
    return <>{children || <Outlet />}</>; // Render child routes
};

export default ProtectedRoute;
