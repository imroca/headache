import react from "@vitejs/plugin-react-swc";
import TurboConsole from "vite-plugin-turbo-console";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react({ tsDecorators: true }), TurboConsole()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
        background: resolve(__dirname, "background.ts"),
      },
      output: {
        entryFileNames: (chunk) => `${chunk.name}.js`,
      },
    },
  },
});
