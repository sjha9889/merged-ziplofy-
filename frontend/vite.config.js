import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['admin.ziplofy.com'],
  },
  preview: {
    allowedHosts: ['admin.ziplofy.com'],
  },
})
