import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { runApiHandler } from './adapter.js'
import { apiRoutes } from './apiRoutes.js'
import { safeDistPath, serveFile } from './static.js'

const port = Number(process.env.PORT ?? 8787)
const serverDir = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(serverDir, '../../dist')
const indexPath = path.join(distDir, 'index.html')

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

  if (url.pathname === '/healthz') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
    return
  }

  const apiHandler = apiRoutes[url.pathname]
  if (apiHandler) {
    await runApiHandler(apiHandler, req, res, url)
    return
  }

  const filePath = safeDistPath(distDir, url.pathname)
  if (filePath && await serveFile(res, filePath)) return

  if (await serveFile(res, indexPath)) return

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    ok: false,
    error: { code: 'FRONTEND_NOT_BUILT', message: 'A frontend build nem talalhato.' },
  }))
})

server.listen(port, '0.0.0.0', () => {
  console.log(`[server] listening on 0.0.0.0:${port}`)
})
