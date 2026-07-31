import type { VercelRequest, VercelResponse } from '@vercel/node'
import profileShareManagement from './_profile-share-management-route.js'
import sendTripInviteEmail from './_send-trip-invite-email-route.js'
import sharedTrip from './_shared-trip-route.js'
import sharedWithMe from './_shared-with-me-route.js'
import tripRecipients from './_trip-recipients-route.js'
import tripShareManagement from './_trip-share-management-route.js'

const ROUTES = {
  'profile-share-management': profileShareManagement,
  'send-trip-invite-email': sendTripInviteEmail,
  'shared-trip': sharedTrip,
  'shared-with-me': sharedWithMe,
  'trip-recipients': tripRecipients,
  'trip-share-management': tripShareManagement,
} as const

function getRoute(req: VercelRequest): keyof typeof ROUTES | null {
  const value = req.query.route
  const route = Array.isArray(value) ? value[0] : value
  return typeof route === 'string' && route in ROUTES ? route as keyof typeof ROUTES : null
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const route = getRoute(req)
  if (!route) {
    return res.status(404).json({
      ok: false,
      error: { code: 'SHARING_ROUTE_NOT_FOUND', message: 'Ismeretlen sharing API route.' },
    })
  }
  return ROUTES[route](req, res)
}
