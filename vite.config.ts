import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 打包输出目录（默认就是 dist，可不用改）
    assetsDir: 'assets', // 静态资源存放目录
    minify: 'terser', // 开启代码压缩（默认开启）
    sourcemap: false, // 生产环境关闭 sourcemap，减小打包体积
  },
})
