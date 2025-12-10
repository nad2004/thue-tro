import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, Typography, Alert, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// Import Hooks & Types
import { useAuthActions } from '@/hooks/useAuth';
// Lưu ý: Import cả Schema và Type từ file validation bạn đã tạo
import { loginSchema, LoginValues } from '@/lib/utils/validation';

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthActions();

  // 1. Định nghĩa kiểu state rõ ràng
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2. Định kiểu cho useForm với LoginValues
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 3. Hàm onSubmit nhận data đã được Type-check chính xác
  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setServerError('');
    try {
      await login(data);
      // Login success -> redirect dashboard
      navigate('/dashboard');
    } catch (err: any) {
      // Xử lý lỗi từ API (err có thể là Error object hoặc string tùy config axios)
      setServerError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card
        style={{ width: 400 }}
        // Thay variant="borderless" thành bordered={false} nếu dùng bản Antd cũ,
        // hoặc giữ nguyên nếu dùng Antd v5 mới nhất hỗ trợ variant.
        bordered={false}
        className="shadow-lg"
      >
        <div className="text-center mb-6">
          <Title level={2}>Đăng Nhập</Title>
          <p className="text-gray-500">Hệ thống quản trị nhà trọ</p>
        </div>

        {serverError && (
          <Alert
            message={serverError}
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => setServerError('')}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="admin@example.com"
                  size="large"
                  status={errors.email ? 'error' : ''}
                />
              )}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="••••••"
                  size="large"
                  status={errors.password ? 'error' : ''}
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Đăng Nhập
          </Button>
        </Form>

        <div className="mt-4 text-center">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  );
}
