import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminho relativo: funciona tanto no GitHub Pages (serve em /bihel-site/)
  // quanto na Vercel (serve na raiz do domínio), sem precisar escolher um.
  base: './',
  plugins: [react()],
  server: {
    // Em desenvolvimento, /api vai para o servidor local de `npm run dev:api`.
    proxy: { '/api': 'http://localhost:8788' },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade.html'),
        painel: resolve(import.meta.dirname, 'painel.html'),
      },
    },
  },
})
