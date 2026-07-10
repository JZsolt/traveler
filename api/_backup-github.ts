import { GitHubContentSchema, GitHubCommitResultSchema } from '../src/schemas/apiResponses';
import type { GitHubConfig, CommitResult } from '../src/types/apiServer';

function mapGitHubError(status: number): string {
  if (status === 401 || status === 403) {
    return 'A GitHub token ervenytelen vagy nincs jogosultsaga.';
  }
  if (status === 404) {
    return 'A GitHub repo vagy branch nem talalhato. Ellenorizd a GITHUB_REPO es GITHUB_BACKUP_BRANCH beallitasokat.';
  }
  if (status === 409) {
    return 'A fajl utkozest okozott. Probald ujra.';
  }
  if (status === 422) {
    return 'A GitHub elutasitotta a kerest. Ellenorizd a branch nevet es a fajl utvonalat.';
  }
  if (status === 429) {
    return 'Tullepted a GitHub API limitet. Probald ujra kesobb.';
  }
  return `GitHub API hiba (${status}).`;
}

async function commitFile(
  path: string,
  content: string,
  message: string,
  gh: GitHubConfig,
): Promise<CommitResult> {
  const apiUrl = `https://api.github.com/repos/${gh.repo}/contents/${path}`;

  let existingSha: string | null = null;
  const getRes = await fetch(`${apiUrl}?ref=${gh.branch}`, { headers: gh.headers });
  if (getRes.ok) {
    const existing = GitHubContentSchema.safeParse(await getRes.json());
    if (existing.success) {
      existingSha = existing.data.sha;
    }
  } else if (getRes.status !== 404) {
    return { ok: false, error: mapGitHubError(getRes.status) };
  }

  const putBody: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: gh.branch,
  };
  if (existingSha) {
    putBody.sha = existingSha;
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: gh.headers,
    body: JSON.stringify(putBody),
  });

  if (!putRes.ok) {
    return { ok: false, error: mapGitHubError(putRes.status) };
  }

  const parsed = GitHubCommitResultSchema.safeParse(await putRes.json());
  if (!parsed.success) {
    return { ok: false, error: 'A GitHub valasza nem ertelmezheto.' };
  }
  return {
    ok: true,
    commitSha: parsed.data.commit.sha,
    commitUrl: parsed.data.commit.html_url,
  };
}

export { commitFile };
