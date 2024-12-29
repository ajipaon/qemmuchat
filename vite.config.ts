import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    https: false,
    cors: false,
    hmr: true,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: "/qemmuWeb",
      },
    ],
  },
});
