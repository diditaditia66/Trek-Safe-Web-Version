// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',          // penting untuk domain root
  plugins: [react()],
  build: { outDir: 'dist' }
})
