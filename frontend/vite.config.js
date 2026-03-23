import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(process.cwd(), '..'), '')
  const host = String(env.FRONTEND_HOST || '').trim()
  const port = Number(env.FRONTEND_PORT)

  if (!host || !Number.isInteger(port) || port <= 0) {
    throw new Error('FRONTEND_HOST and FRONTEND_PORT must be defined in root .env')
  }

  return {
    plugins: [react()],
    envDir: '..',
    envPrefix: ['VITE_', 'BACKEND_'],
    server: {
      host,
      port
    }
  }
})
