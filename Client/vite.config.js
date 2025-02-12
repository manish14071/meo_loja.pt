import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://meo-loja-pt-d4sy.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://meo-loja-pt-d4sy.onrender.com')
  }
})

