import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': 'http://localhost:3000', 
      '/clubs': 'http://localhost:3000', 
      '/recommendations': 'http://localhost:3000',
    },
  },
})