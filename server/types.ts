import type { IncomingMessage, ServerResponse } from 'node:http'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown

export type NodeApiRequest = IncomingMessage & {
  body?: unknown
  query: Record<string, string | string[]>
}

export type NodeApiResponse = ServerResponse & {
  status: (code: number) => NodeApiResponse
  json: (payload: unknown) => NodeApiResponse
}
