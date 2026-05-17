import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'icons.svg', 'data/vehicles.json', 'images/logo/brands/*.svg'],
      manifest: {
        name: 'CarSpec — Vehicle Specifications',
        short_name: 'CarSpec',
        description: 'Research and compare vehicle specifications',
        theme_color: '#1565C0',
        background_color: '#111318',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
      }
    })
  ],
})
