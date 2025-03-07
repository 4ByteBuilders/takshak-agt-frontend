import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
// allow host 717a-2401-4900-6284-32c0-f0f8-3ee9-a684-7c37.ngrok-free.app


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
