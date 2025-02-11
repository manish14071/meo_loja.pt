import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://meo-loja-pt.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://localhost:3267',
        changeOrigin: true,
        secure: false
      }
    },
    port: 5173
  },
  optimizeDeps: {
    include: ['clsx', 'tailwind-merge'],
  },
});
