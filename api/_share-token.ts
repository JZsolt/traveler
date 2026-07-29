import { createHash, randomBytes } from 'node:crypto'

const TOKEN_BYTES = 32

// A nyers megosztasi tokent szerver oldalon generaljuk kriptografiai
// veletlennel; az adatbazisba SOHA nem a nyers token, csak a SHA-256 hash kerul.
export function createRawShareToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url')
}

export function hashShareToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
