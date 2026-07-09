import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isRecord } from './_narrowing'

export function validateAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    res.status(500).json({ ok: false, error: { code: 'ADMIN_NOT_CONFIGURED', message: 'Az admin jelszó nincs konfigurálva a szerveren.' } })
    return false
  }
  const body: unknown = req.body
  const password = isRecord(body) ? body.password : undefined
  if (!password || password !== adminPassword) {
    res.status(401).json({ ok: false, error: { code: 'INVALID_ADMIN_PASSWORD', message: 'Hibás admin jelszó.' } })
    return false
  }
  return true
}
