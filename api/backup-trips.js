/* global process */
import { createClient } from '@supabase/supabase-js'
import { buildBackupFiles } from './_backup-utils.js'
import { validateAdmin } from './_admin-auth.js'

const PAGE_SIZE = 500

function err(code, message) {
  return { ok: false, error: { code, message } }
}

function mapGitHubError(status, body) {
  if (status === 401 || status === 403) {
    return 'A GitHub token ervenytelen vagy nincs jogosultsaga.'
  }
  if (status === 404) {
    return 'A GitHub repo vagy branch nem talalhato. Ellenorizd a GITHUB_REPO es GITHUB_BACKUP_BRANCH beallitasokat.'
  }
  if (status === 409) {
    return 'A fajl utkozest okozott. Probald ujra.'
  }
  if (status === 422) {
    return 'A GitHub elutasitotta a kerest. Ellenorizd a branch nevet es a fajl utvonalat.'
  }
  if (status === 429) {
    return 'Tullepted a GitHub API limitet. Probald ujra kesobb.'
  }
  return `GitHub API hiba (${status}).`
}

async function fetchAllTrips(supabase) {
  const rows = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      throw new Error(error.message)
    }

    const page = data || []
    rows.push(...page)

    if (page.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return rows
}

async function commitFile(path, content, message, { token, repo, branch, headers }) {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`

  let existingSha = null
  const getRes = await fetch(`${apiUrl}?ref=${branch}`, { headers })
  if (getRes.ok) {
    const existing = await getRes.json()
    existingSha = existing.sha
  } else if (getRes.status !== 404) {
    const body = await getRes.json().catch(() => ({}))
    return { ok: false, error: mapGitHubError(getRes.status, body) }
  }

  const putBody = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
  }
  if (existingSha) {
    putBody.sha = existingSha
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(putBody),
  })

  if (!putRes.ok) {
    const body = await putRes.json().catch(() => ({}))
    return { ok: false, error: mapGitHubError(putRes.status, body) }
  }

  const result = await putRes.json()
  return {
    ok: true,
    commitSha: result.commit?.sha || null,
    commitUrl: result.commit?.html_url || null,
  }
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
  const githubToken = process.env.GITHUB_TOKEN
  const githubRepo = process.env.GITHUB_REPO
  const githubBranch = process.env.GITHUB_BACKUP_BRANCH || 'main'

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json(
      err('MISSING_SUPABASE_ENV', 'A Supabase konfiguracio hianyzik a szerveren.')
    )
  }

  if (!githubToken || !githubRepo) {
    return res.status(500).json(
      err('MISSING_GITHUB_ENV', 'A GitHub konfiguracio hianyzik a szerveren (GITHUB_TOKEN, GITHUB_REPO).')
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const rows = await fetchAllTrips(supabase)
    const now = new Date()
    const exportedAt = now.toISOString()
    const dateStr = exportedAt.slice(0, 16).replace('T', ' ')
    const { files, manifest } = buildBackupFiles(rows, exportedAt)

    const gh = {
      token: githubToken,
      repo: githubRepo,
      branch: githubBranch,
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    }

    const commits = []
    const failedFiles = []

    for (const file of files) {
      const result = await commitFile(
        file.path,
        file.content,
        `backup: export trip ${file.slug} ${dateStr}`,
        gh
      )
      if (result.ok) {
        commits.push({ path: file.path, slug: file.slug, commitSha: result.commitSha, commitUrl: result.commitUrl })
      } else {
        console.error(`[backup-trips] Failed to commit ${file.path}:`, result.error)
        failedFiles.push({ path: file.path, slug: file.slug, error: result.error })
      }
    }

    const manifestResult = await commitFile(
      manifest.path,
      manifest.content,
      `backup: update trips manifest ${dateStr}`,
      gh
    )

    if (manifestResult.ok) {
      commits.push({ path: manifest.path, commitSha: manifestResult.commitSha, commitUrl: manifestResult.commitUrl })
    } else {
      console.error('[backup-trips] Failed to commit manifest:', manifestResult.error)
      failedFiles.push({ path: manifest.path, error: manifestResult.error })
    }

    const allOk = failedFiles.length === 0

    return res.status(allOk ? 200 : 207).json({
      ok: allOk,
      exportedAt,
      tripCount: rows.length,
      fileCount: commits.length,
      manifestPath: manifest.path,
      commits,
      failedFiles,
    })
  } catch (error) {
    console.error('[backup-trips] Error:', error.message)
    return res.status(502).json(
      err('BACKUP_FAILED', 'Nem sikerult az exportalas. ' + (error.message || ''))
    )
  }
}
