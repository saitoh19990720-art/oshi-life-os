import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// スマホで開ける本物のWebアプリ（PWA）。GitHub Pages 配信用に相対パス＋docs出力。
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "docs" },
});
