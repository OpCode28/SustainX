import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Expose over Wi-Fi and local network
    port: 5173,
    allowedHosts: true, // Allow tunneling domains (localtunnel, ngrok, pinggy, etc.)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
