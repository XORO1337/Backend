import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requireVerification = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user.role === 'artisan' ? '/artisan-dashboard' : 
                         user.role === 'distributor' ? '/distributor-dashboard' : '/';
    return <Navigate to={dashboardPath} replace />;
  }

  // Check verification requirements
  if (requireVerification && !user.isIdentityVerified && ['artisan', 'distributor'].includes(user.role)) {
    // Allow access to dashboard but show verification prompt
    // The dashboard component should handle showing verification UI
  }

  return children;
};

// Specific role-based route components
export const ArtisanRoute = ({ children }) => (
  <ProtectedRoute requiredRole="artisan" requireVerification={true}>
    {children}
  </ProtectedRoute>
);

export const DistributorRoute = ({ children }) => (
  <ProtectedRoute requiredRole="distributor" requireVerification={true}>
    {children}
  </ProtectedRoute>
);

export const CustomerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="customer">
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
