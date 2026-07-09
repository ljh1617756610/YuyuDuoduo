import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 设为 /static/，使构建产物的资源路径与 Django 的 STATIC_URL 一致，
// 这样 Django（开发模式）就能直接托管 dist 下的静态文件。
export default defineConfig({
  plugins: [vue()],
  base: '/static/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
