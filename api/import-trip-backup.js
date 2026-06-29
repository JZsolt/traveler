/* global process */
import { createClient } from '@supabase/supabase-js'
import { importSingleTrip } from './_import-utils.js'

function err(code, message) {
  return { ok: false, error: { code, message } }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      err('METHOD_NOT_ALLOWED', 'Csak POST keres engedelyezett.')
    )
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json(
      err('MISSING_SUPABASE_ENV', 'A Supabase konfiguracio hianyzik a szerveren.')
    )
  }

  const body = req.body
  const mode = body?.mode || 'create'

  if (mode !== 'create' && mode !== 'upsert-by-slug') {
    return res.status(400).json(
      err('INVALID_MODE', 'Ervenytelen import mod. Hasznalj "create" vagy "upsert-by-slug" modot.')
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const result = await importSingleTrip(supabase, body?.backup, mode)

    if (!result.ok) {
      return res.status(400).json(
        err('IMPORT_FAILED', result.error)
      )
    }

    return res.status(200).json({
      ok: true,
      mode,
      slug: result.slug,
      created: result.created,
      updated: result.updated,
    })
  } catch (error) {
    console.error('[import-trip-backup] Unexpected error:', error.message)
    return res.status(500).json(
      err('INTERNAL_ERROR', 'Varatlan szerverhiba tortent.')
    )
  }
}
