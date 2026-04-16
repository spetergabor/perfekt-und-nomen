// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/perfekt-und-nomen/', // IDE a GitHub tárolód (repository) nevét írd!
})