import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    nodePolyfills({
      globals: {
        process: true,
        Buffer: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      plugins: []
    }
  },
  publicDir: './public',
  envDir: './',
  css: {
    preprocessorOptions: {
      scss:{
        additionalData: '@use "/src/shared/styles/app.scss" as *;',
      },
    },
  },
})