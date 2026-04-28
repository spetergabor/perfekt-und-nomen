import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/perfekt-und-nomen/', // Cseréld le a GitHub repository-d nevére!
})