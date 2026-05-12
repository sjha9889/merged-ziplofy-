/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5000'

function attachForwardedHeaders(proxy: any) {
  proxy.on('proxyReq', (proxyReq: any, req: any) => {
    const host = req?.headers?.host
    if (typeof host === 'string') {
      proxyReq.setHeader('X-Forwarded-Host', host)
      proxyReq.setHeader('X-Forwarded-Proto', 'http')
    }
  })
}

function createDevProxy() {
  return {
    target: proxyTarget,
    changeOrigin: true,
    configure(proxy: any) {
      attachForwardedHeaders(proxy)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@render-store/sdk': path.resolve(__dirname, 'src/sdk/index.ts'),
    },
  },
  server: {
    host: true,
    cors: true,
    allowedHosts: true,
    proxy: {
      '/api': createDevProxy(),
      '/uploads': createDevProxy(),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
