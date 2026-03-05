import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://server:5050",
        changeOrigin: true,
      },
      "/webhook": {
        target: "http://server:5050",
        changeOrigin: true,
      },
    },
  },
});