import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import path from 'path'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss()],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //     '@components': path.resolve(__dirname, './src/components'),
  //     '@hooks': path.resolve(__dirname, './src/hooks'),
  //     '@context': path.resolve(__dirname, './src/context'),
  //     '@services': path.resolve(__dirname, './src/services'),
  //     '@utils': path.resolve(__dirname, './src/utils'),
  //     '@constants': path.resolve(__dirname, './src/constants'),
  //     '@pages': path.resolve(__dirname, './src/pages'),
  //   },
  // },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
})