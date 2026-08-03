import type { IncomingMessage, ServerResponse } from 'node:http'

export type { ApiHandler } from '../src/types/http.js'

export type NodeApiRequest = IncomingMessage & {
  body?: unknown
  query: Record<string, string | string[]>
}

export type NodeApiResponse = ServerResponse & {
  status: (code: number) => NodeApiResponse
  json: (payload: unknown) => NodeApiResponse
}
