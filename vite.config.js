import dns from 'node:dns'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Set DNS servers to Google (8.8.8.8) and Cloudflare (1.1.1.1) to bypass Jio ISP DNS block
dns.setServers(['8.8.8.8', '1.1.1.1'])

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://janavikasamapi-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
