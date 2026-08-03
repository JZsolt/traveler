import type { ApiRequest, ApiResponse } from '../src/types/http';
import { createClient } from '@supabase/supabase-js';
import { importSingleTrip } from './_import-utils.js';
import { validateAdmin } from './_admin-auth.js';
import { isRecord } from './_narrowing.js';
import type { Database } from '../src/types/supabase';

function err(code: string, message: string) {
  return { ok: false, error: { code, message } };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json(err('METHOD_NOT_ALLOWED', 'Csak POST keres engedelyezett.'));
  }

  if (!(await validateAdmin(req, res))) return;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!supabaseUrl || !supabaseKey) {
    return res
      .status(500)
      .json(err('MISSING_SUPABASE_ENV', 'A Supabase konfiguracio hianyzik a szerveren.'));
  }

  if (!adminUserId) {
    return res
      .status(500)
      .json(err('MISSING_ADMIN_USER_ID', 'ADMIN_USER_ID nincs konfigurálva a szerveren.'));
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

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    const result = await importSingleTrip(supabase, body.backup, mode, adminUserId);

    if (!result.ok) {
      return res.status(400).json(err('IMPORT_FAILED', result.error || 'Unknown error'));
    }

    return res.status(200).json({
      ok: true,
      mode,
      slug: result.slug,
      created: result.created,
      updated: result.updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[import-trip-backup] Unexpected error:', message);
    return res.status(500).json(err('INTERNAL_ERROR', 'Varatlan szerverhiba tortent.'));
  }
}
