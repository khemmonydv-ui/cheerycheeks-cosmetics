import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // lets Docker / other devices reach it
    port: 5173, // always the same port
    strictPort: true, // fail loudly instead of silently using 5174
    watch: {
      usePolling: true, // makes saves visible inside Docker
      interval: 300,
    },
  },
});
