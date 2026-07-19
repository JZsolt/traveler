export interface MockAdminEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  ADMIN_USER_ID: string
  ADMIN_PASSWORD: string
}

export interface MockResData {
  statusCode: number
  body: unknown
}

export function getErrorCode(body: unknown): string | null {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return null
  const rec = body as Record<string, unknown>
  const err = rec.error
  if (err === null || typeof err !== 'object' || Array.isArray(err)) return null
  const errRec = err as Record<string, unknown>
  return typeof errRec.code === 'string' ? errRec.code : null
}
