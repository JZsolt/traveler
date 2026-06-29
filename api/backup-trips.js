/* global process */
import { createClient } from '@supabase/supabase-js'

const BACKUP_PATH = 'backups/trips-backup.json'

function ghError(code, message) {
  return { ok: false, error: { code, message } }
}

function mapGitHubError(status, body) {
  if (status === 401 || status === 403) {
    return ghError('GITHUB_AUTH_FAILED', 'A GitHub token ervenytelen vagy nincs jogosultsaga.')
  }
  if (status === 404) {
    const msg = body?.message || ''
    if (msg.includes('Not Found')) {
      return ghError('GITHUB_REPO_NOT_FOUND', 'A GitHub repo vagy branch nem talalhato. Ellenorizd a GITHUB_REPO es GITHUB_BACKUP_BRANCH beallitasokat.')
    }
    return ghError('GITHUB_NOT_FOUND', 'A GitHub eroforras nem talalhato.')
  }
  if (status === 409) {
    return ghError('GITHUB_CONFLICT', 'A fajl utkozest okozott. Probald ujra.')
  }
  if (status === 422) {
    return ghError('GITHUB_VALIDATION', 'A GitHub elutasitotta a kerest. Ellenorizd a branch nevet es a fajl utvonalat.')
  }
  if (status === 429) {
    return ghError('GITHUB_RATE_LIMIT', 'Tullepted a GitHub API limitet. Probald ujra kesobb.')
  }
  return ghError('GITHUB_ERROR', `GitHub API hiba (${status}).`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      ghError('METHOD_NOT_ALLOWED', 'Csak POST keres engedelyezett.')
    )
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const githubToken = process.env.GITHUB_TOKEN
  const githubRepo = process.env.GITHUB_REPO
  const githubBranch = process.env.GITHUB_BACKUP_BRANCH || 'main'

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json(
      ghError('MISSING_SUPABASE_ENV', 'A Supabase konfiguracio hianyzik a szerveren.')
    )
  }

  if (!githubToken || !githubRepo) {
    return res.status(500).json(
      ghError('MISSING_GITHUB_ENV', 'A GitHub konfiguracio hianyzik a szerveren (GITHUB_TOKEN, GITHUB_REPO).')
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error: fetchError } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('[backup-trips] Supabase fetch error:', fetchError.message)
      return res.status(502).json(
        ghError('SUPABASE_FETCH_FAILED', 'Nem sikerult exportalni az utazasokat.')
      )
    }

    const now = new Date()
    const backup = {
      version: 1,
      application: 'Traveler',
      schema: 1,
      exportedAt: now.toISOString(),
      tripCount: (data || []).length,
      trips: (data || []).map(row => ({
        id: row.id,
        slug: row.slug,
        trip_data: row.trip_data,
        owner: row.owner,
        created_at: row.created_at,
        updated_at: row.updated_at,
      })),
    }

    const content = JSON.stringify(backup, null, 2)
    const encoded = Buffer.from(content).toString('base64')

    const apiBase = `https://api.github.com/repos/${githubRepo}/contents/${BACKUP_PATH}`
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }

    let existingSha = null
    const getRes = await fetch(`${apiBase}?ref=${githubBranch}`, { headers })
    if (getRes.ok) {
      const existing = await getRes.json()
      existingSha = existing.sha
    } else if (getRes.status !== 404) {
      const body = await getRes.json().catch(() => ({}))
      console.error('[backup-trips] GitHub GET error:', getRes.status, body)
      return res.status(getRes.status >= 500 ? 502 : getRes.status).json(
        mapGitHubError(getRes.status, body)
      )
    }

    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ')
    const putBody = {
      message: `backup: export trips ${dateStr}`,
      content: encoded,
      branch: githubBranch,
    }
    if (existingSha) {
      putBody.sha = existingSha
    }

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify(putBody),
    })

    if (!putRes.ok) {
      const body = await putRes.json().catch(() => ({}))
      console.error('[backup-trips] GitHub PUT error:', putRes.status, body)
      return res.status(putRes.status >= 500 ? 502 : putRes.status).json(
        mapGitHubError(putRes.status, body)
      )
    }

    const result = await putRes.json()
    const commitSha = result.commit?.sha || null
    const commitUrl = result.commit?.html_url || null

    return res.status(200).json({
      ok: true,
      exportedAt: backup.exportedAt,
      tripCount: backup.tripCount,
      path: BACKUP_PATH,
      commitSha,
      commitUrl,
    })
  } catch (err) {
    console.error('[backup-trips] Unexpected error:', err.message)
    return res.status(500).json(
      ghError('INTERNAL_ERROR', 'Varatlan szerverhiba tortent.')
    )
  }
}
