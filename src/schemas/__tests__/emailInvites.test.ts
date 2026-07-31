import { describe, expect, it } from 'vitest'
import {
  SendTripInviteEmailRequestSchema,
  SendTripInviteEmailResponseSchema,
} from '../emailInvites'

describe('SendTripInviteEmailRequestSchema', () => {
  it('accepts one recipient email and slug', () => {
    expect(SendTripInviteEmailRequestSchema.safeParse({
      slug: 'roma',
      recipientEmail: 'user@example.com',
    }).success).toBe(true)
  })

  it('rejects invalid email and bulk recipients', () => {
    expect(SendTripInviteEmailRequestSchema.safeParse({
      slug: 'roma',
      recipientEmail: 'bad',
    }).success).toBe(false)
    expect(SendTripInviteEmailRequestSchema.safeParse({
      slug: 'roma',
      recipientEmail: ['a@example.com', 'b@example.com'],
    }).success).toBe(false)
  })
})

describe('SendTripInviteEmailResponseSchema', () => {
  it('accepts safe status-only responses', () => {
    expect(SendTripInviteEmailResponseSchema.safeParse({ ok: true, status: 'sent' }).success).toBe(true)
    expect(SendTripInviteEmailResponseSchema.safeParse({ ok: true, status: 'duplicate' }).success).toBe(true)
  })

  it('rejects account-existence details in the status', () => {
    expect(SendTripInviteEmailResponseSchema.safeParse({ ok: true, status: 'not_app_user' }).success).toBe(false)
  })
})
