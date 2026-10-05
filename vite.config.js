import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { postMetadata } from './scripts/post-metadata'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    postMetadata(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Floyd's Personal Page",
        short_name: 'Floyd',
        description: "Floyd Benedikter's personal webpage",
        theme_color: '#221c16',
        background_color: '#221c16',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Downloadable research files are opt-in, not part of every visitor's cache.
        globIgnores: ['**/posts/notebooks/**'],
        // Static site — the only runtime fetch is Google Fonts.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
