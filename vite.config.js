import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // When deploying to GitHub Pages under a project page (username.github.io/repo),
  // set the base path to the repo name so asset URLs are generated correctly.
  base: '/janson-portfolio/',
})
