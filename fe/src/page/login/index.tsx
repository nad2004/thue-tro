import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, Typography, Alert, Checkbox } from 'antd';
import { LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';
import { Home } from 'lucide-react';
// Hooks & Types
import { useAuthActions } from '@/hooks/useAuth';
import { loginSchema, LoginValues } from '@/lib/utils/validation';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthActions();

  const [serverError, setServerError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

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

  const onSubmit = async (data: LoginValues) => {
    setServerError('');
    try {
      await login(data);

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/');
    } catch (err: any) {
      setServerError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 to-pink-50 p-4">
      <Card style={{ width: 450 }} bordered={false} className="shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <Home size={20} className="text-white" />
            </div>
          </div>
          <Title level={2} className="mb-2!">
            Đăng Nhập
          </Title>
          <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
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
              <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>
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
              <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
              <Text type="secondary">Ghi nhớ đăng nhập</Text>
            </Checkbox>
            <Link
              to="/forgot-password"
              className="text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isLoggingIn}
            icon={<LoginOutlined />}
            className="bg-linear-to-r! from-orange-500! to-pink-500! hover:from-orange-600! hover:to-pink-600! border-none! h-12! rounded-lg! font-semibold! mt-6!"
          >
            Đăng Nhập
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
            Đăng ký ngay
          </Link>
        </div>

        {/* Divider với "hoặc" */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập với</span>
          </div>
        </div>

        {/* Social Login Buttons (Optional) */}
        <div className="grid grid-cols-2 gap-3">
          <Button size="large" className="rounded-lg border-gray-300" disabled>
            <span className="mr-2">🔵</span> Facebook
          </Button>
          <Button size="large" className="rounded-lg border-gray-300" disabled>
            <span className="mr-2">🔴</span> Google
          </Button>
        </div>
      </Card>
    </div>
  );
}
