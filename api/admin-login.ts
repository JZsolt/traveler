import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateAdmin } from './_admin-auth.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({
        ok: false,
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Csak POST kérés engedélyezett.' },
      });
  }

  if (!validateAdmin(req, res)) return;

  return res.status(200).json({ ok: true });
}
