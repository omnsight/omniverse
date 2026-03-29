import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['elkjs/lib/elk.bundled.js'],
    exclude: ['node_modules'],
  },
  server: {
    proxy: {
      '/query': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/query/, ''),
      },
      '/crud': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/crud/, ''),
      },
      '/monitoring': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/monitoring/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
