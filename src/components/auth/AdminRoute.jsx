import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('AdminRoute check:', { user, loading, userMetadata: user?.user_metadata });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.role === 'admin';
  console.log('Is admin?', isAdmin, 'Role:', user.user_metadata?.role);

  if (!isAdmin) {
    console.log('Not admin, redirecting to app');
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default AdminRoute;