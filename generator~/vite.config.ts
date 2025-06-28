import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
