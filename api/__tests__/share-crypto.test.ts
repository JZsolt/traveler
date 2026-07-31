import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { encryptShareToken, decryptShareToken, CURRENT_SHARE_KEY_VERSION } from '../_share-crypto.js'

// 32 bajtos kulcs base64-ben. A tesztek SOHA nem logolnak nyers tokent.
const TEST_KEY = Buffer.alloc(32, 7).toString('base64')
const RAW_TOKEN = 'a-secret-share-token-value-abc123'

let keyBackup: string | undefined

beforeEach(() => {
  keyBackup = process.env.SHARE_TOKEN_ENCRYPTION_KEY
  process.env.SHARE_TOKEN_ENCRYPTION_KEY = TEST_KEY
})

afterEach(() => {
  if (keyBackup === undefined) delete process.env.SHARE_TOKEN_ENCRYPTION_KEY
  else process.env.SHARE_TOKEN_ENCRYPTION_KEY = keyBackup
})

describe('share token encryption (AES-256-GCM)', () => {
  it('round-trips: decrypt(encrypt(token)) === token', () => {
    const { ciphertext, keyVersion } = encryptShareToken(RAW_TOKEN)
    expect(decryptShareToken(ciphertext, keyVersion)).toBe(RAW_TOKEN)
  })

  it('does not store the plaintext token inside the ciphertext', () => {
    const { ciphertext } = encryptShareToken(RAW_TOKEN)
    expect(ciphertext).not.toContain(RAW_TOKEN)
  })

  it('ciphertext is a parseable iv.tag.data (3 non-empty base64 parts)', () => {
    const { ciphertext } = encryptShareToken(RAW_TOKEN)
    const parts = ciphertext.split('.')
    expect(parts).toHaveLength(3)
    for (const part of parts) expect(part.length).toBeGreaterThan(0)
  })

  it('uses a random IV, so the same token encrypts differently each time', () => {
    expect(encryptShareToken(RAW_TOKEN).ciphertext).not.toBe(encryptShareToken(RAW_TOKEN).ciphertext)
  })

  it('returns the current key version', () => {
    expect(encryptShareToken(RAW_TOKEN).keyVersion).toBe(CURRENT_SHARE_KEY_VERSION)
  })

  it('rejects tampered ciphertext via the GCM auth tag', () => {
    const { ciphertext, keyVersion } = encryptShareToken(RAW_TOKEN)
    const [iv, tag] = ciphertext.split('.')
    const tampered = `${iv}.${tag}.${Buffer.from('tampered-data').toString('base64')}`
    expect(() => decryptShareToken(tampered, keyVersion)).toThrow()
  })

  it('fails to decrypt with a different key', () => {
    const { ciphertext, keyVersion } = encryptShareToken(RAW_TOKEN)
    process.env.SHARE_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString('base64')
    expect(() => decryptShareToken(ciphertext, keyVersion)).toThrow()
  })

  it('fails safely when the encryption key is missing', () => {
    delete process.env.SHARE_TOKEN_ENCRYPTION_KEY
    expect(() => encryptShareToken(RAW_TOKEN)).toThrow()
  })

  it('rejects an invalid (wrong-length) key', () => {
    process.env.SHARE_TOKEN_ENCRYPTION_KEY = Buffer.alloc(16, 1).toString('base64')
    expect(() => encryptShareToken(RAW_TOKEN)).toThrow()
  })

  it('rejects a malformed ciphertext format', () => {
    expect(() => decryptShareToken('not-a-valid-format', CURRENT_SHARE_KEY_VERSION)).toThrow()
  })
})
