import React, { useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';

// Cấu hình React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động fetch lại khi focus tab (tuỳ chọn)
      retry: 1, // Số lần thử lại khi lỗi
    },
  },
});

// Định nghĩa Interface cho Props
interface StateInitializerProps {
  children: ReactNode;
}

const StateInitializer: React.FC<StateInitializerProps> = ({ children }) => {
  // TypeScript sẽ tự hiểu state có initialize nhờ file auth-store.ts đã refactor
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
};

// Lấy root element và kiểm tra null (chuẩn TypeScript)
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <StateInitializer>
          <App />
        </StateInitializer>
      </QueryClientProvider>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found! Check index.html');
}
