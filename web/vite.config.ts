import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import type { Connect, Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const languages = ['es', 'en', 'pt']
const configPath = new URL('./config/appConfig.json', import.meta.url)
const configFile = 'assets/data/appConfig.json'

// In deployment Spring forwards deep links to the localized entry.
const localRouting: Connect.NextHandleFunction = (req, res, next) => {
  const path = (req.url || '/').split('?')[0]
  if (path === '/dashboard' || path === '/dashboard/') {
    res.writeHead(302, { Location: '/dashboard/es/' }).end()
    return
  }
  const locale = path.split('/')[2]
  if (path.startsWith('/dashboard/') && languages.includes(locale)
    && req.headers.accept?.includes('text/html') && !path.split('/').pop()?.includes('.')) {
    req.url = `/dashboard/${locale}/index.html`
  }
  next()
}

function dashboardEntries(): Plugin {
  return {
    name: 'dashboard-localized-entries',
    configureServer(server) {
      server.middlewares.use(localRouting)
      server.middlewares.use((req, res, next) => {
        if (!languages.some(lang => req.url?.split('?')[0] === `/dashboard/${lang}/${configFile}`)) return next()
        res.setHeader('Content-Type', 'application/json')
        res.end(readFileSync(configPath))
      })
    },
    configurePreviewServer(server) { server.middlewares.use(localRouting) },
    generateBundle() {
      for (const lang of languages) {
        this.emitFile({ type: 'asset', fileName: `${lang}/${configFile}`, source: readFileSync(configPath) })
      }
    },
  }
}

export default defineConfig({
  base: '/dashboard/',
  appType: 'mpa',
  plugins: [dashboardEntries(), react()],
  build: { rollupOptions: { input: languages.map(lang => `${lang}/index.html`) } },
  server: { host: '127.0.0.1', port: 5174, strictPort: true,
    proxy: { '/api/v5': {
      target: process.env.DASHBOARD_GATEWAY_ORIGIN || 'http://127.0.0.1:8188',
      headers: { host: 'dashboard.localhost' },
    } } },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
})
