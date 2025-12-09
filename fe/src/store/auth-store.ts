import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUser } from '@/types/User'; // Import interface User đã tạo

// 1. Định nghĩa kiểu dữ liệu cho State (Dữ liệu)
interface AuthState {
  token: string | null;
  user: IUser | null;
  isLoading: boolean;
}

// 2. Định nghĩa kiểu dữ liệu cho Actions (Hàm)
interface AuthActions {
  setAuth: (data: { user: IUser; token: string }) => void;
  setLoading: (loadingState: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

// 3. Gộp lại thành Interface tổng cho Store
type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // --- Initial State ---
      token: null,
      user: null,
      isLoading: false,

      // --- Actions ---
      setAuth: ({ user, token }) => {
        set({ user, token, isLoading: false });
      },

      setLoading: (loadingState) => {
        set({ isLoading: loadingState });
      },

      logout: () => {
        set({ user: null, token: null, isLoading: false });
        // Lưu ý: persist middleware tự động update localStorage,
        // nhưng nếu muốn xóa sạch key thì gọi removeItem là an toàn nhất.
        localStorage.removeItem('auth-storage');
      },

      initialize: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu token và user vào localStorage (không lưu isLoading)
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
