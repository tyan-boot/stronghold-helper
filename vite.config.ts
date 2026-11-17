import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      includeAssets: ["favicon.svg", "icons.svg", "apple-touch-icon-180x180.png"],
      manifest: {
        id: "/",
        name: "卫戍协议助手",
        short_name: "卫戍助手",
        description: "设置盟约 Ban，查看可用和已禁用干员，按等级与盟约筛选。",
        lang: "zh-CN",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#e9ede2",
        background_color: "#e9ede2",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
