import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      "/phaser": {
        target: "https://cdn.phaserfiles.com/v385",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/phaser/, ""),
      },
    },
  },
});
