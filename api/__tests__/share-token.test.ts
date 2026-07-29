import { describe, it, expect } from 'vitest'
import { createRawShareToken, hashShareToken } from '../_share-token.js'

// A tesztek SOHA nem logolnak nyers tokent (checklist: "Tests do not log tokens").

describe('hashShareToken — only the hash is ever stored', () => {
  it('produces a deterministic 64-char lowercase hex SHA-256 hash', () => {
    const token = 'example-share-token'
    const hash = hashShareToken(token)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(hashShareToken(token)).toBe(hash)
  })

  it('never equals the raw token (raw token is not derivable from what is stored)', () => {
    const token = createRawShareToken()
    expect(hashShareToken(token)).not.toBe(token)
  })

  it('produces different hashes for different tokens', () => {
    expect(hashShareToken('token-a')).not.toBe(hashShareToken('token-b'))
  })
})

describe('createRawShareToken — unguessable, URL-safe tokens', () => {
  it('is url-safe base64url and at least 43 chars (32 random bytes)', () => {
    const token = createRawShareToken()
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(token.length).toBeGreaterThanOrEqual(43)
  })

  it('produces unique tokens across many calls (entropy sanity)', () => {
    const tokens = new Set(Array.from({ length: 200 }, () => createRawShareToken()))
    expect(tokens.size).toBe(200)
  })
})
