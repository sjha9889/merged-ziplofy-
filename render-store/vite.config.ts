import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // listen on all network interfaces
    cors: true,          // allow cross-origin requests
    allowedHosts: true   // allow requests from any host
  }
})
