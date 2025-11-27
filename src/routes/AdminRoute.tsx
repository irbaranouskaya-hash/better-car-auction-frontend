import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('AdminRoute check:', { isAuthenticated, user, role: user?.role });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    console.log('User is not admin, role:', user?.role, 'redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted');
  return <>{children}</>;
};

