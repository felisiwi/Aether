import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

/** ESM-safe: `__dirname` is undefined in native ESM; alias breaks without this on some setups. */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '..'),
  resolve: {
    alias: {
      '@ds': path.resolve(__dirname, '../DesignSystem/src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
