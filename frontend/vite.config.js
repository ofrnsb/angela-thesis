import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  // Base path untuk GitHub Pages (ubah sesuai nama repo)
  // Jika repo name adalah "angela-smart-contract", maka base: "/angela-smart-contract/"
  // Jika deploy ke root, maka base: "/"
  base: process.env.NODE_ENV === 'production' ? '/angela-smart-contract/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

