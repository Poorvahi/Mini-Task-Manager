import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config: dev server runs on port 5173, matching the CORS
// allow-list configured on the FastAPI backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
