import { createRequire } from 'node:module'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
const require = createRequire(import.meta.url)
const { validatePublicEnv } = require('./server/config.cjs')
export default defineConfig(({ mode }) => {
  validatePublicEnv({ ...loadEnv(mode, process.cwd(), ''), ...process.env })
  return {
    plugins: [vue(), viteSingleFile()],
    server: { host: '127.0.0.1', port: 5173, strictPort: true, cors: { origin: 'http://127.0.0.1:5173' } },
    preview: { host: '127.0.0.1', port: 5173, strictPort: true },
    build: { target: 'es2022', sourcemap: false, cssCodeSplit: false },
  }
})
