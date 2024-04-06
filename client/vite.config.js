import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// https://chat-app-api-0xrn.onrender.com

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://mern-e-commerce-8xpe.onrender.com",
      "/uploads/": "https://mern-e-commerce-8xpe.onrender.com/",
    },
  },
});
