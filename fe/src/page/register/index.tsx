import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, Typography, Alert, Radio, Space } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';

// Hooks & Types
import { useAuthActions } from '@/hooks/useAuth';
import { registerSchema, RegisterValues } from '@/lib/utils/validation';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuthActions();

  const [serverError, setServerError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'Tenant', // Mặc định là người thuê
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterValues) => {
    setServerError('');
    try {
      await register(data);
      navigate('/');
    } catch (err: any) {
      setServerError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-pink-50 p-4">
      <Card 
        style={{ width: 500 }} 
        bordered={false} 
        className="shadow-2xl rounded-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-white text-3xl" />
          </div>
          <Title level={2} className="mb-2!">Tạo Tài Khoản</Title>
          <Text type="secondary">Đăng ký để bắt đầu tìm phòng trọ</Text>
        </div>

        {serverError && (
          <Alert
            message={serverError}
            type="error"
            showIcon
            className="mb-4 rounded-lg"
            closable
            onClose={() => setServerError('')}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Họ và Tên */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<IdcardOutlined className="text-gray-400" />}
                  size="large"
                  status={errors.fullName ? 'error' : ''}
                  placeholder="Nguyễn Văn A"
                  className="rounded-lg"
                />
              )}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined className="text-gray-400" />}
                  size="large"
                  status={errors.email ? 'error' : ''}
                  placeholder="email@example.com"
                  className="rounded-lg"
                />
              )}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  size="large"
                  status={errors.phoneNumber ? 'error' : ''}
                  placeholder="0987654321"
                  maxLength={11}
                  className="rounded-lg"
                />
              )}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined className="text-gray-400" />}
                  size="large"
                  status={errors.password ? 'error' : ''}
                  placeholder="••••••••"
                  className="rounded-lg"
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Vai trò */}
          <div>
            <label className="block mb-3 font-medium text-gray-700">
              Bạn là <span className="text-red-500">*</span>
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Radio.Group 
                  {...field} 
                  size="large"
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    <Radio 
                      value="Tenant"
                      className="w-full"
                    >
                      <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedRole === 'Tenant' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}>
                        <UserOutlined className="text-2xl text-orange-500" />
                        <div>
                          <div className="font-semibold text-gray-800">Người thuê trọ</div>
                          <div className="text-sm text-gray-500">Tìm kiếm phòng trọ phù hợp</div>
                        </div>
                      </div>
                    </Radio>
                    
                    <Radio 
                      value="Landlord"
                      className="w-full"
                    >
                      <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedRole === 'Landlord' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}>
                        <HomeOutlined className="text-2xl text-blue-500" />
                        <div>
                          <div className="font-semibold text-gray-800">Chủ nhà</div>
                          <div className="text-sm text-gray-500">Đăng tin cho thuê phòng trọ</div>
                        </div>
                      </div>
                    </Radio>
                  </Space>
                </Radio.Group>
              )}
            />
            {errors.role && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.role.message}
              </span>
            )}
          </div>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large" 
            loading={isRegistering}
            className="bg-linear-to-r! from-orange-500! to-pink-500! hover:from-orange-600! hover:to-pink-600! border-none! h-12! rounded-lg! font-semibold! mt-6!"
          >
            Đăng Ký
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
            Đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
}