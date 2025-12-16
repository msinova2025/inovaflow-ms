import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "metatag.png"],
      manifest: {
        name: "MS INOVA MAIS",
        short_name: "MS INOVA",
        description: "Plataforma oficial de gestão em inovação do Estado de Mato Grosso do Sul",
        theme_color: "#004f9f",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/metatag.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/metatag.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/metatag.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
