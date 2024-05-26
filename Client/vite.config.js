import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api/":"https://server-rho-two-92.vercel.app/",
      "/uploads/":"http://localhost:6000",
    },
  },
});
