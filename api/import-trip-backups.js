/* global process */
import { createClient } from '@supabase/supabase-js'
import { importSingleTrip } from './_import-utils.js'
import { validateAdmin } from './_admin-auth.js'

function err(code, message) {
  return { ok: false, error: { code, message } }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      err('METHOD_NOT_ALLOWED', 'Csak POST keres engedelyezett.')
    )
  }

  if (!validateAdmin(req, res)) return

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

  const backups = body?.backups
  if (!Array.isArray(backups) || backups.length === 0) {
    return res.status(400).json(
      err('INVALID_BACKUPS', 'A "backups" mezonek nem-ures tombnek kell lennie.')
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const results = []
    const errors = []

    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i]
      const slug = backup?.trip?.slug || `#${i + 1}`

      try {
        const result = await importSingleTrip(supabase, backup, mode)

        if (result.ok) {
          results.push({ slug: result.slug, created: result.created, updated: result.updated })
        } else {
          errors.push({ index: i, slug, error: result.error })
        }
      } catch (itemError) {
        errors.push({ index: i, slug, error: itemError.message })
      }
    }

    return res.status(errors.length > 0 ? 207 : 200).json({
      ok: errors.length === 0,
      importedCount: results.length,
      failedCount: errors.length,
      results,
      errors,
    })
  } catch (error) {
    console.error('[import-trip-backups] Unexpected error:', error.message)
    return res.status(500).json(
      err('INTERNAL_ERROR', 'Varatlan szerverhiba tortent.')
    )
  }
}
