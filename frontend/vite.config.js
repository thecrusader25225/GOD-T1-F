import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Ensures Vite binds to all network interfaces
    port: 5173,  // Your desired port
    strictPort: true,  // Ensures it doesn’t switch ports automatically
    cors: true,  // Allow cross-origin requests
    allowedHosts: ['.localtunnel.me', '.loca.lt']  // Add localtunnel domains
  }
})

