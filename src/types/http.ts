// Platform-fuggetlen HTTP handler tipusok a self-hosted Node szerverhez (server/)
// es a Vite dev middleware-hez. NINCS deploy-platform-specifikus runtime vagy
// tipus fuggoseg — a handlerek csak ezt a minimalis feluletet hasznaljak.

export interface ApiRequest {
  method?: string
  url?: string
  headers: Record<string, string | string[] | undefined>
  query: Record<string, string | string[]>
  body?: unknown
}

export interface ApiResponse {
  status(code: number): ApiResponse
  json(payload: unknown): ApiResponse
}

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => Promise<unknown> | unknown
