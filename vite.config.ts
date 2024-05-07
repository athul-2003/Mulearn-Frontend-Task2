import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Mulearn-Frontend-Task2/",
  plugins: [react()],
})
