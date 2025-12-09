import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuth"; 
import { Spin } from "antd";

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuthStatus(); 
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" tip="Đang xác thực..." />
      </div>
    );
  }

  // Nếu chưa login -> Đá về Login
  if (!isLoggedIn) {
    // state={{ from: location }} giúp redirect lại trang cũ sau khi login thành công
    return <Navigate to="/login" state={{ from: location }} replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;