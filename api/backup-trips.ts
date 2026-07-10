import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { buildBackupFiles } from './_backup-utils.js';
import { fetchAllTrips } from './_backup-fetch.js';
import { commitFile } from './_backup-github.js';
import { validateAdmin } from './_admin-auth.js';
import { TripSchema } from '../src/schemas/trip';
import type { Database } from '../src/types/supabase';
import type {
  ValidatedTripRow,
  GitHubConfig,
  BackupCommitEntry,
  BackupFailedEntry,
} from '../src/types/apiServer';

function err(code: string, message: string) {
  return { ok: false, error: { code, message } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json(err('METHOD_NOT_ALLOWED', 'Csak POST keres engedelyezett.'));
  }

  if (!validateAdmin(req, res)) return;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BACKUP_BRANCH || 'main';

  if (!supabaseUrl || !supabaseKey) {
    return res
      .status(500)
      .json(err('MISSING_SUPABASE_ENV', 'A Supabase konfiguracio hianyzik a szerveren.'));
  }

  if (!githubToken || !githubRepo) {
    return res
      .status(500)
      .json(
        err(
          'MISSING_GITHUB_ENV',
          'A GitHub konfiguracio hianyzik a szerveren (GITHUB_TOKEN, GITHUB_REPO).',
        ),
      );
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    const { rows: allRows, malformedSlugs } = await fetchAllTrips(supabase);
    const skippedSlugs: string[] = [...malformedSlugs];
    const validRows: ValidatedTripRow[] = [];
    for (const row of allRows) {
      const parsed = TripSchema.safeParse(row.trip_data);
      if (parsed.success) {
        validRows.push({ ...row, trip_data: parsed.data });
      } else {
        console.warn(`[backup-trips] Skipping invalid trip_data for slug=${row.slug}`);
        skippedSlugs.push(row.slug);
      }
    }
    const now = new Date();
    const exportedAt = now.toISOString();
    const dateStr = exportedAt.slice(0, 16).replace('T', ' ');
    const { files, manifest } = buildBackupFiles(validRows, exportedAt);

    const gh: GitHubConfig = {
      token: githubToken,
      repo: githubRepo,
      branch: githubBranch,
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };

    const commits: BackupCommitEntry[] = [];
    const failedFiles: BackupFailedEntry[] = [];

    for (const file of files) {
      const result = await commitFile(
        file.path,
        file.content,
        `backup: export trip ${file.slug} ${dateStr}`,
        gh,
      );
      if (result.ok) {
        commits.push({
          path: file.path,
          slug: file.slug,
          commitSha: result.commitSha ?? null,
          commitUrl: result.commitUrl ?? null,
        });
      } else {
        console.error(`[backup-trips] Failed to commit ${file.path}:`, result.error);
        failedFiles.push({
          path: file.path,
          slug: file.slug,
          error: result.error || 'Unknown error',
        });
      }
    }

    const manifestResult = await commitFile(
      manifest.path,
      manifest.content,
      `backup: update trips manifest ${dateStr}`,
      gh,
    );

    if (manifestResult.ok) {
      commits.push({
        path: manifest.path,
        commitSha: manifestResult.commitSha ?? null,
        commitUrl: manifestResult.commitUrl ?? null,
      });
    } else {
      console.error('[backup-trips] Failed to commit manifest:', manifestResult.error);
      failedFiles.push({
        path: manifest.path,
        error: manifestResult.error || 'Unknown error',
      });
    }

    const allOk = failedFiles.length === 0 && skippedSlugs.length === 0;

    return res.status(allOk ? 200 : 207).json({
      ok: allOk,
      exportedAt,
      tripCount: validRows.length,
      fileCount: commits.length,
      manifestPath: manifest.path,
      commits,
      failedFiles,
      skippedCount: new Set(skippedSlugs).size,
      skippedSlugs: [...new Set(skippedSlugs)],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[backup-trips] Error:', message);
    return res
      .status(502)
      .json(err('BACKUP_FAILED', 'Nem sikerult az exportalas.'));
  }
}
