import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import path from 'path'
import { fileURLToPath } from 'url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

async function readJsonBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return undefined
  return JSON.parse(raw)
}

function createVercelLikeResponse(res) {
  const vercelRes = Object.assign(res, {
    status(code) {
      res.statusCode = code
      return vercelRes
    },
    json(payload) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(payload))
      return vercelRes
    },
  })
  return vercelRes
}

function localSharingApiPlugin() {
  return {
    name: 'local-sharing-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/sharing')) return next()
        try {
          const url = new URL(req.url, 'http://localhost')
          const mod = await server.ssrLoadModule('/api/sharing.ts')
          const handler = mod.default
          const vercelReq = Object.assign(req, {
            query: Object.fromEntries(url.searchParams),
            body: await readJsonBody(req),
          })
          await handler(vercelReq, createVercelLikeResponse(res))
        } catch (err) {
          console.error('[local-sharing-api] failed', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            ok: false,
            error: { code: 'LOCAL_SHARING_API_FAILED', message: 'Lokalis sharing API hiba.' },
          }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [
      localSharingApiPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['icons/*.png'],
        manifest: {
          name: 'Az Utazásaim',
          short_name: 'Utazásaim',
          description: 'Utazástervező app — menetrenddel, árakkal, linkekkel, offline.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#1a1a2e',
          theme_color: '#1a1a2e',
          orientation: 'portrait',
          categories: ['travel'],
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          navigateFallbackDenylist: [/\.pdf$/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'wiki-images',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-stylesheets' }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './src'),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) return 'react'
            if (id.includes('/@supabase/')) return 'supabase'
            if (id.includes('/@base-ui/') || id.includes('/lucide-react/')) return 'ui'
            if (id.includes('/zod/')) return 'validation'
            return undefined
          },
        },
      },
    },
  }
})
