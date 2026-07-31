import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import type { ServerResponse } from 'node:http'
import path from 'node:path'

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
}

function contentType(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream'
}

export async function serveFile(res: ServerResponse, filePath: string): Promise<boolean> {
  try {
    const file = await stat(filePath)
    if (!file.isFile()) return false
    res.statusCode = 200
    res.setHeader('Content-Type', contentType(filePath))
    createReadStream(filePath).pipe(res)
    return true
  } catch {
    return false
  }
}

export function safeDistPath(distDir: string, requestPath: string): string | null {
  const decoded = decodeURIComponent(requestPath)
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const filePath = path.join(distDir, normalized === '/' ? 'index.html' : normalized)
  return filePath.startsWith(distDir) ? filePath : null
}
