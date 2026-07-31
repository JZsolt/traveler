import { Buffer } from 'node:buffer'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { ApiHandler, NodeApiRequest, NodeApiResponse } from './types.js'

const MAX_BODY_BYTES = 1024 * 1024

function queryFromUrl(url: URL): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {}
  for (const [key, value] of url.searchParams) {
    const existing = query[key]
    if (existing === undefined) query[key] = value
    else if (Array.isArray(existing)) existing.push(value)
    else query[key] = [existing, value]
  }
  return query
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined

  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > MAX_BODY_BYTES) throw new Error('REQUEST_BODY_TOO_LARGE')
    chunks.push(buffer)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return undefined
  return JSON.parse(raw)
}

function createResponse(res: ServerResponse): NodeApiResponse {
  const apiRes = Object.assign(res, {
    status(code: number) {
      res.statusCode = code
      return apiRes
    },
    json(payload: unknown) {
      if (!res.headersSent) res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(payload))
      return apiRes
    },
  })
  return apiRes
}

export async function runApiHandler(
  handler: ApiHandler,
  req: IncomingMessage,
  res: ServerResponse,
  url: URL,
): Promise<void> {
  try {
    const apiReq = Object.assign(req, {
      body: await readBody(req),
      query: queryFromUrl(url),
    }) as NodeApiRequest
    await handler(apiReq as unknown as VercelRequest, createResponse(res) as unknown as VercelResponse)
  } catch (err) {
    const status = err instanceof Error && err.message === 'REQUEST_BODY_TOO_LARGE' ? 413 : 400
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      ok: false,
      error: { code: 'INVALID_REQUEST_BODY', message: 'Hibas vagy tul nagy keres body.' },
    }))
  }
}
