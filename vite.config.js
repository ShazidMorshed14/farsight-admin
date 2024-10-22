import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Optional: customize rollup output settings
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true, // Allow mixed ES and CommonJS modules
    },
  },
  esbuild: {
    loader: "jsx", // Use the JSX loader
    include: /\.[jt]sx?$/, // Include .js, .jsx, .ts, .tsx files
    exclude: /node_modules/, // Exclude node_modules
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx", // Explicitly apply jsx loader for .js files
        ".ts": "tsx", // Apply tsx loader for TypeScript if necessary
      },
    },
  },
});
