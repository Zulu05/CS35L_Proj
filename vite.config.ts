import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/adminpass': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/traits': 'http://localhost:3000',
      '/clubs': 'http://localhost:3000',
      '/recommendations': 'http://localhost:3000',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})