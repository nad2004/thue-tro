import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { AuthService } from "@/services/Auth.service";
import { LoginValues, RegisterValues } from "@/lib/utils/validation";

export const useAuthActions = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: (data: LoginValues) => AuthService.login(data),
    onSuccess: (data) => {
      // Map đúng dữ liệu vào Store
      if (data.token && data.data) {
        setAuth({ user: data.data, token: data.token });
      }
    },
    onError: (error: any) => {
      // Ném lỗi ra để component (ví dụ LoginForm) có thể catch và hiển thị form error
      throw new Error(error.response?.data?.message || "Email hoặc mật khẩu không đúng.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterValues) => AuthService.register(data),
    onSuccess: (data) => {
      if (data.token && data.data) {
        setAuth({ user: data.data, token: data.token });
      }
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại.");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};

// Hook lấy trạng thái Auth (giữ nguyên logic cũ nhưng thêm type)
export const useAuthStatus = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    token,
    isLoading,
    isLoggedIn: !!token,
    isAdmin: user?.role === 'Admin' // Helper tiện ích
  };
};