import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['elkjs/lib/elk.bundled.js'],
  },
  server: {
    // Proxy configuration to bypass CORS
    proxy: {
      '/apidata': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apidata/, ''),
      },
      '/apiauth': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiauth/, ''),
      },
    },
  },
});
