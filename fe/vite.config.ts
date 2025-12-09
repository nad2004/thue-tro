import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; 
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    // Cấu hình Proxy để gọi sang Backend Node.js
    proxy: {
      '/tin-tuc': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    // Alias giúp import ngắn gọn (khớp với tsconfig.json)
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src/page'),
    },
  },
});