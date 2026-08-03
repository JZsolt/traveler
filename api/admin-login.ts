import type { ApiRequest, ApiResponse } from '../src/types/http';
import { validateAdmin } from './_admin-auth.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({
        ok: false,
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Csak POST kérés engedélyezett.' },
      });
  }

  if (!(await validateAdmin(req, res))) return;

  return res.status(200).json({ ok: true });
}
