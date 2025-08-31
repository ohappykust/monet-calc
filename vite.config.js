import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Determine base path for GitHub Pages when running in CI
const isCI = process.env.GITHUB_ACTIONS === 'true'
const repoName = (process.env.GITHUB_REPOSITORY || '').split('/')[1] || ''
// For user/org pages (e.g., username.github.io) base should be '/'
const isUserSite = /\.github\.io$/i.test(repoName)
const base = isCI && repoName && !isUserSite ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [vue()],
  server: {
    port: 5173,
    open: false,
  },
})
