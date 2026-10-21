import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../static/dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/kiwoom/api': { target: 'http://localhost:8000', changeOrigin: true },
      '/kiwoom/token': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
