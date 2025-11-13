import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'File Reader',
        short_name: 'File Reader',
        description:
          'File Reader es una aplicación web que permite a los usuarios subir archivos para extraer texto y escucharlo.',
        theme_color: '#010409',
        background_color: '#010409',
        display: 'standalone',
        scope: '/',
        start_url: '.',
        lang: 'es',
        icons: [
          {
            src: '/favicon.ico',
            type: 'image/x-icon',
            sizes: '16x16 32x32'
          },
          {
            src: '/icon-192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: '/icon-512.png',
            type: 'image/png',
            sizes: '512x512'
          },
          {
            src: '/icon-192-maskable.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable'
          },
          {
            src: '/icon-512-maskable.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
