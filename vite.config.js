import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Kal-coorportion/', // Requis pour charger les assets sur GitHub Pages (sous-dossier du repo)
})
