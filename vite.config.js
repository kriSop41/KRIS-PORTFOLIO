import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment. 
  // Set to './' to allow the site to be served from any subfolder.
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
