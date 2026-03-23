import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '..',
  envPrefix: ['VITE_', 'BACKEND_'],
  server: {
    host: "172.20.10.2",
    port: 5173
  }
})
