import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuth';
import { Spin } from 'antd'; // Hoặc component Loading của bạn

const PublicRoute: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuthStatus();

  if (isLoading) {
    // UI Loading chuyên nghiệp hơn
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" tip="Đang kiểm tra..." />
      </div>
    );
  }

  // Nếu đã login -> Đá về Home (Dashboard)
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
