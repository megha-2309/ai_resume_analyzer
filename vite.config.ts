import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite"; // ✅ IMPORTANT
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    reactRouter(), // ✅ THIS WAS MISSING
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});