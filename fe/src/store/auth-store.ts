import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUser } from '@/types/User'; // Import interface User đã tạo
interface AuthState {
  token: string | null;
  user: IUser | null;
  isLoading: boolean;
}
interface AuthActions {
  setAuth: (data: { user: IUser; token?: string }) => void;
  setLoading: (loadingState: boolean) => void;
  logout: () => void;
  initialize: () => void;
}
type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      setAuth: ({ user, token }) => {
        set((s) => ({
          token: token ?? s.token,
          user: user,
          isLoading: false,
        }));
      },

      setLoading: (loadingState) => {
        set({ isLoading: loadingState });
      },

      logout: () => {
        set({ user: null, token: null, isLoading: false });
        localStorage.removeItem('auth-storage');
      },

      initialize: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
