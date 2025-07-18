import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url' // Import Node.js URL helpers

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      // This proxy forwards any request from the frontend starting with /api
      // to your backend server running on port 8000.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  // This section correctly sets up the path alias.
  resolve: {
    alias: {
      // This tells Vite that any import starting with '@/' should be
      // resolved from the 'src' directory.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
