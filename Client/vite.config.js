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
      }
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
});
