import { z } from 'zod'
import { ProfileShareIdSchema } from './profileShare.js'

// Account-to-account recipient muveletek egy owner-verified endpointon at.
// Az invite email VAGY profil QR publicShareId alapjan old fel letezo app-usert.
const InviteByEmailSchema = z.object({
  action: z.literal('invite'),
  slug: z.string().min(1),
  recipientEmail: z.string().email(),
})

const InviteByProfileShareSchema = z.object({
  action: z.literal('invite'),
  slug: z.string().min(1),
  publicShareId: ProfileShareIdSchema,
})

export const RecipientRequestSchema = z.union([
  InviteByEmailSchema,
  InviteByProfileShareSchema,
  z.object({ action: z.literal('accept'), inviteId: z.string().uuid() }),
  z.object({ action: z.literal('decline'), inviteId: z.string().uuid() }),
  z.object({ action: z.literal('revoke'), inviteId: z.string().uuid() }),
])

// Egyseges statusz-alapu valasz. Nem szivarogtat mas felhasznalo/profil adatot.
export const RecipientResponseSchema = z.object({
  ok: z.literal(true),
  status: z.enum([
    'invited',          // uj pending meghivas letrejott
    'already_invited',  // mar van aktiv meghivas erre a trip+recipient parra
    'not_app_user',     // az email nem letezo app-user (public link ut: 18-10)
    'self',             // az owner sajat magat nem hivhatja meg
    'invite_limit',     // tul sok fuggo meghivas ugyanannak a recipientnek (spam-vedelem)
    'accepted',
    'declined',
    'revoked',
    'noop',             // nem volt kezelheto sor (pl. mar elfogadva/visszavonva)
  ]),
})
