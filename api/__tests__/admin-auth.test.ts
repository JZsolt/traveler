import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getErrorCode } from './adminAuthTypes'
import type { MockAdminEnv, MockResData } from './adminAuthTypes'

import { validateAdmin } from '../_admin-auth.js'

const VALID_ENV: MockAdminEnv = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-key',
  ADMIN_USER_ID: 'admin-uuid-123',
  ADMIN_PASSWORD: 'correct-password',
}

const ADMIN_TOKEN = 'valid-jwt-token'

function mockReq(overrides: {
  token?: string | null
  scheme?: string
  body?: unknown
} = {}): VercelRequest {
  const headers: Record<string, string | undefined> = {}
  if (overrides.token !== null) {
    headers.authorization = `${overrides.scheme ?? 'Bearer'} ${overrides.token ?? ADMIN_TOKEN}`
  }
  return { headers, body: overrides.body ?? { password: VALID_ENV.ADMIN_PASSWORD } } as unknown as VercelRequest
}

function mockRes(): VercelResponse & { _data: MockResData } {
  const data: MockResData = { statusCode: 0, body: null }
  const res = {
    _data: data,
    status(code: number) {
      data.statusCode = code
      return this
    },
    json(body: unknown) {
      data.body = body
      return this
    },
  }
  return res as unknown as VercelResponse & { _data: MockResData }
}

function setupEnv(env: Partial<MockAdminEnv> = {}) {
  const merged = { ...VALID_ENV, ...env }
  process.env.SUPABASE_URL = merged.SUPABASE_URL
  process.env.SUPABASE_SERVICE_ROLE_KEY = merged.SUPABASE_SERVICE_ROLE_KEY
  process.env.ADMIN_USER_ID = merged.ADMIN_USER_ID
  process.env.ADMIN_PASSWORD = merged.ADMIN_PASSWORD
}

function mockAuthUser(user: { id: string; email?: string | null } | null) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: !!user,
    json: vi.fn().mockResolvedValue(user),
  }))
}

const envBackup: Record<string, string | undefined> = {}

beforeEach(() => {
  for (const key of Object.keys(VALID_ENV)) {
    envBackup[key] = process.env[key]
  }
})

afterEach(() => {
  for (const [key, val] of Object.entries(envBackup)) {
    if (val === undefined) delete process.env[key]
    else process.env[key] = val
  }
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('validateAdmin', () => {
  describe('env validation', () => {
    it('returns 500 when SUPABASE_URL is missing', async () => {
      setupEnv({ SUPABASE_URL: '' })
      const res = mockRes()
      const result = await validateAdmin(mockReq(), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(500)
      expect(res._data.body).toMatchObject({ ok: false, error: { code: 'MISSING_SUPABASE_ENV' } })
    })

    it('returns 500 when SUPABASE_SERVICE_ROLE_KEY is missing', async () => {
      setupEnv({ SUPABASE_SERVICE_ROLE_KEY: '' })
      const res = mockRes()
      const result = await validateAdmin(mockReq(), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(500)
    })

    it('returns 500 when ADMIN_USER_ID is missing', async () => {
      setupEnv({ ADMIN_USER_ID: '' })
      const res = mockRes()
      const result = await validateAdmin(mockReq(), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(500)
      expect(res._data.body).toMatchObject({ ok: false, error: { code: 'ADMIN_NOT_CONFIGURED' } })
    })

    it('returns 500 when ADMIN_PASSWORD is missing', async () => {
      setupEnv({ ADMIN_PASSWORD: '' })
      const res = mockRes()
      const result = await validateAdmin(mockReq(), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(500)
    })
  })

  describe('token validation', () => {
    it('returns 401 when Authorization header is missing', async () => {
      setupEnv()
      const res = mockRes()
      const result = await validateAdmin(mockReq({ token: null }), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(401)
      expect(res._data.body).toMatchObject({ error: { code: 'MISSING_AUTH' } })
    })

    it('returns 401 when JWT verification fails', async () => {
      setupEnv()
      mockAuthUser(null)
      const res = mockRes()
      const result = await validateAdmin(mockReq({ token: 'bad-token' }), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(401)
      expect(res._data.body).toMatchObject({ error: { code: 'INVALID_TOKEN' } })
    })

    it('accepts a case-insensitive bearer scheme', async () => {
      setupEnv()
      mockAuthUser({ id: VALID_ENV.ADMIN_USER_ID })
      const res = mockRes()
      const result = await validateAdmin(mockReq({ scheme: 'bearer' }), res)
      expect(result).toBe(true)
      expect(res._data.statusCode).toBe(0)
    })
  })

  describe('user identity check', () => {
    it('returns 403 when authenticated user is not the admin', async () => {
      setupEnv()
      mockAuthUser({ id: 'other-user-uuid' })
      const res = mockRes()
      const result = await validateAdmin(mockReq(), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(403)
      expect(res._data.body).toMatchObject({ error: { code: 'NOT_ADMIN' } })
    })
  })

  describe('password validation', () => {
    it('returns 401 when password is wrong', async () => {
      setupEnv()
      mockAuthUser({ id: VALID_ENV.ADMIN_USER_ID })
      const res = mockRes()
      const result = await validateAdmin(
        mockReq({ body: { password: 'wrong-password' } }),
        res,
      )
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(401)
      expect(res._data.body).toMatchObject({ error: { code: 'INVALID_ADMIN_PASSWORD' } })
    })

    it('returns 401 when password is missing from body', async () => {
      setupEnv()
      mockAuthUser({ id: VALID_ENV.ADMIN_USER_ID })
      const res = mockRes()
      const result = await validateAdmin(mockReq({ body: {} }), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(401)
    })

    it('returns 401 when body is not an object', async () => {
      setupEnv()
      mockAuthUser({ id: VALID_ENV.ADMIN_USER_ID })
      const res = mockRes()
      const result = await validateAdmin(mockReq({ body: 'not-object' }), res)
      expect(result).toBe(false)
      expect(res._data.statusCode).toBe(401)
    })
  })

  describe('successful validation', () => {
    it('returns true when JWT, user ID, and password all match', async () => {
      setupEnv()
      mockAuthUser({ id: VALID_ENV.ADMIN_USER_ID })
      const res = mockRes()
      const result = await validateAdmin(mockReq(), res)
      expect(result).toBe(true)
      expect(res._data.statusCode).toBe(0)
      expect(fetch).toHaveBeenCalledWith('https://test.supabase.co/auth/v1/user', {
        headers: {
          apikey: VALID_ENV.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      })
    })
  })

  describe('error code uniqueness', () => {
    it('returns distinct error codes for each failure mode', async () => {
      const codes = new Set<string | null>()

      setupEnv({ SUPABASE_URL: '' })
      let res = mockRes()
      await validateAdmin(mockReq(), res)
      codes.add(getErrorCode(res._data.body))

      setupEnv({ ADMIN_USER_ID: '' })
      res = mockRes()
      await validateAdmin(mockReq(), res)
      codes.add(getErrorCode(res._data.body))

      setupEnv()
      res = mockRes()
      await validateAdmin(mockReq({ token: null }), res)
      codes.add(getErrorCode(res._data.body))

      mockAuthUser(null)
      res = mockRes()
      await validateAdmin(mockReq(), res)
      codes.add(getErrorCode(res._data.body))

      mockAuthUser({ id: 'other' })
      res = mockRes()
      await validateAdmin(mockReq(), res)
      codes.add(getErrorCode(res._data.body))

      mockAuthUser({ id: VALID_ENV.ADMIN_USER_ID })
      res = mockRes()
      await validateAdmin(mockReq({ body: { password: 'wrong' } }), res)
      codes.add(getErrorCode(res._data.body))

      expect(codes.size).toBe(6)
    })
  })
})
