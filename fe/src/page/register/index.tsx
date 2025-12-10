import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, Typography, Alert, Form } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined, // 📞 Import thêm icon điện thoại
} from '@ant-design/icons';

// Hooks & Types
import { useAuthActions } from '@/hooks/useAuth';
import { registerSchema, RegisterValues } from '@/lib/utils/validation';

const { Title } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthActions();

  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      userName: '',
      email: '',
      phoneNumber: '', // 📞 Khởi tạo giá trị mặc định
      password: '',
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setServerError('');
    try {
      await register(data);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card style={{ width: 450 }} bordered={false} className="shadow-lg">
        <div className="text-center mb-6">
          <Title level={2}>Tạo Tài Khoản</Title>
          <p className="text-gray-500">Đăng ký để quản lý hệ thống</p>
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
          {/* Họ và Tên */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Họ và Tên</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<IdcardOutlined />}
                  size="large"
                  status={errors.fullName ? 'error' : ''}
                  placeholder="Nguyễn Văn A"
                />
              )}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">{errors.fullName.message}</span>
            )}
          </div>

          {/* Tên đăng nhập */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Tên đăng nhập</label>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  size="large"
                  status={errors.userName ? 'error' : ''}
                  placeholder="nguyenvana"
                />
              )}
            />
            {errors.userName && (
              <span className="text-red-500 text-sm">{errors.userName.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  size="large"
                  status={errors.email ? 'error' : ''}
                  placeholder="email@example.com"
                />
              )}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

          {/* 👇 SỐ ĐIỆN THOẠI (Mới thêm) */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined />}
                  size="large"
                  status={errors.phoneNumber ? 'error' : ''}
                  placeholder="0987654321"
                  maxLength={11}
                />
              )}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  size="large"
                  status={errors.password ? 'error' : ''}
                  placeholder="••••••"
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Đăng Ký
          </Button>
        </Form>

        <div className="mt-4 text-center">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
}
