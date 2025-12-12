import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuth';
import { Spin, Result, Button } from 'antd';

const AdminRoute: React.FC = () => {
  const { isLoading, isAdmin } = useAuthStatus();
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
          extra={
            <Button type="primary" href="/">
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
