import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,          // listen on all network interfaces
    cors: true,          // allow cross-origin requests
    allowedHosts: true   // allow requests from any host
  }
})
