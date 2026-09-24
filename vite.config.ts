import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
=======

// https://vitejs.dev/config/
export default defineConfig(() => ({
>>>>>>> origin/main
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
<<<<<<< HEAD
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
=======
  plugins: [react()],
>>>>>>> origin/main
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
