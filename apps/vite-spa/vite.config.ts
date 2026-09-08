import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    viteSingleFile({
      deleteInlinedFiles: false
    })
  ],
  build: {
    target: "es2015",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife'
      },
    },
    sourcemap: true
  },
})