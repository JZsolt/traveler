import { createClient } from '@supabase/supabase-js'
import type { ApiRequest, ApiResponse } from '../src/types/http'
import type { Database } from '../src/types/supabase'
import type { AuthenticatedServerContext } from '../src/types/apiServer'
import { fetchAuthenticatedUser } from './_auth-user.js'

function getAuthToken(req: ApiRequest): string | null {
  const header = req.headers.authorization
  if (typeof header !== 'string') return null
  const parts = header.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null
  return parts[1] || null
}

export async function requireAuthenticatedUser(
  req: ApiRequest,
  res: ApiResponse,
): Promise<AuthenticatedServerContext | null> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({
      ok: false,
      error: { code: 'MISSING_SUPABASE_ENV', message: 'Supabase nincs konfiguralva a szerveren.' },
    })
    return null
  }

  const token = getAuthToken(req)
  if (!token) {
    res.status(401).json({
      ok: false,
      error: { code: 'MISSING_AUTH', message: 'Hianyzo autentikacio.' },
    })
    return null
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)
  const user = await fetchAuthenticatedUser(supabaseUrl, supabaseKey, token)

  if (!user) {
    res.status(401).json({
      ok: false,
      error: { code: 'INVALID_TOKEN', message: 'Ervenytelen munkamenet.' },
    })
    return null
  }

  return { supabase, user }
}
