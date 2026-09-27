import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,                    // Bind to 0.0.0.0 (required for ngrok)
    port: 5173,
    strictPort: true,
    allowedHosts: true,           // This is the correct way to allow all hosts
    // OR use the safer version below if you prefer:
    // allowedHosts: [".ngrok-free.dev", ".ngrok.io", "localhost", "127.0.0.1"],
  },
})