import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Actions → sous-dossier Pages ; Vercel / preview local → racine
  base: process.env.GITHUB_ACTIONS ? '/Kal-coorportion/' : '/',
})
