import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment. 
  // Should match your repository name: https://github.com/krisop41/KRIS-PORTFOLIO
  base: '/KRIS-PORTFOLIO/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
