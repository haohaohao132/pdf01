import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the sub-path this site is served from (phpstudy: /pdf/)
export default defineConfig({
  base: '/pdf/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 5000,
  },
})
