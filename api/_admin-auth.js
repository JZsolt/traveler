/* global process */

export function validateAdmin(req, res) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    res.status(500).json({ ok: false, error: { code: 'ADMIN_NOT_CONFIGURED', message: 'Az admin jelszó nincs konfigurálva a szerveren.' } })
    return false
  }
  const { password } = req.body || {}
  if (!password || password !== adminPassword) {
    res.status(401).json({ ok: false, error: { code: 'INVALID_ADMIN_PASSWORD', message: 'Hibás admin jelszó.' } })
    return false
  }
  return true
}
