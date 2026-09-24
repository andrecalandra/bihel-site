import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminho relativo: funciona tanto no GitHub Pages (serve em /bihel-site/)
  // quanto na Vercel (serve na raiz do domínio), sem precisar escolher um.
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade.html'),
      },
    },
  },
})
