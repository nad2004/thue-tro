import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuth';
import { Spin } from 'antd';

const PublicRoute: React.FC = () => {
  const { isLoading, isAdmin } = useAuthStatus();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  if (isAdmin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
