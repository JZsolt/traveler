import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { importSingleTrip } from './_import-utils';
import { validateAdmin } from './_admin-auth';
import type { Database } from '../src/types/supabase';
import type {
  ImportBatchError,
  ImportBatchResult,
  ImportSingleResult,
} from '../src/types/apiServer';
import { isRecord } from './_narrowing';

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

  if (!supabaseUrl || !supabaseKey) {
    return res
      .status(500)
      .json(err('MISSING_SUPABASE_ENV', 'A Supabase konfiguracio hianyzik a szerveren.'));
  }

  const body: unknown = req.body;
  if (!isRecord(body)) {
    return res.status(400).json(err('INVALID_BODY', 'Hianyzo request body.'));
  }

  const mode = typeof body.mode === 'string' ? body.mode : 'create';

  if (mode !== 'create' && mode !== 'upsert-by-slug') {
    return res
      .status(400)
      .json(
        err(
          'INVALID_MODE',
          'Ervenytelen import mod. Hasznalj "create" vagy "upsert-by-slug" modot.',
        ),
      );
  }

  const backups = body.backups;
  if (!Array.isArray(backups) || backups.length === 0) {
    return res
      .status(400)
      .json(err('INVALID_BACKUPS', 'A "backups" mezonek nem-ures tombnek kell lennie.'));
  }

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    const results: ImportBatchResult[] = [];
    const errors: ImportBatchError[] = [];

    for (let i = 0; i < backups.length; i++) {
      const backup: unknown = backups[i];
      const tripObj = isRecord(backup) && isRecord(backup.trip) ? backup.trip : undefined;
      const slug = typeof tripObj?.slug === 'string' ? tripObj.slug : `#${i + 1}`;

      try {
        const result: ImportSingleResult = await importSingleTrip(supabase, backup, mode);

        if (result.ok && result.slug) {
          results.push({
            slug: result.slug,
            created: result.created,
            updated: result.updated,
          });
        } else {
          errors.push({ index: i, slug, error: result.error || 'Unknown error' });
        }
      } catch (itemError) {
        const message = itemError instanceof Error ? itemError.message : 'Unknown error';
        errors.push({ index: i, slug, error: message });
      }
    }

    return res.status(errors.length > 0 ? 207 : 200).json({
      ok: errors.length === 0,
      importedCount: results.length,
      failedCount: errors.length,
      results,
      errors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[import-trip-backups] Unexpected error:', message);
    return res.status(500).json(err('INTERNAL_ERROR', 'Varatlan szerverhiba tortent.'));
  }
}
