import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Site de projeto do GitHub Pages fica em /<repo>/, não na raiz.
  base: '/bihel-site/',
  plugins: [react()],
})
