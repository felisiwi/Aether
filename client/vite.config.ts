import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

/** ESM-safe: `__dirname` is undefined in native ESM; alias breaks without this on some setups. */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  /** Config file lives in `client/` — project root is this directory (index.html, src/). */
  root: __dirname,
  plugins: [react()],
  envDir: path.resolve(__dirname, '..'),
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@ds/Components/themewheel': path.resolve(
        __dirname,
        '../vendor/DesignSystem/src/Components/themewheel',
      ),
      '@ds/Components/paginationindicator': path.resolve(
        __dirname,
        '../vendor/DesignSystem/src/Components/paginationindicator',
      ),
      '@ds': path.resolve(__dirname, '../vendor/DesignSystem/src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['framer-motion'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
