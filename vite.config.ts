// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // allows global variables like describe, it, etc.
    environment: "jsdom", // sets the environment to jsdom
    setupFiles: "src/setupTests.js", // path to your setup file
  },
});
