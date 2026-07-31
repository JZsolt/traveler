import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isRecord } from './_narrowing.js';
import { fetchAuthenticatedUser } from './_auth-user.js';

function getAuthToken(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (typeof header !== 'string') return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
  return parts[1] || null;
}

export async function validateAdmin(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminUserId = process.env.ADMIN_USER_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({
      ok: false,
      error: { code: 'MISSING_SUPABASE_ENV', message: 'Supabase nincs konfigurálva a szerveren.' },
    });
    return false;
  }

  if (!adminUserId || !adminPassword) {
    res.status(500).json({
      ok: false,
      error: { code: 'ADMIN_NOT_CONFIGURED', message: 'Az admin nincs konfigurálva a szerveren.' },
    });
    return false;
  }

  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({
      ok: false,
      error: { code: 'MISSING_AUTH', message: 'Hiányzó autentikáció.' },
    });
    return false;
  }

  const user = await fetchAuthenticatedUser(supabaseUrl, supabaseKey, token);

  if (!user) {
    res.status(401).json({
      ok: false,
      error: { code: 'INVALID_TOKEN', message: 'Érvénytelen munkamenet.' },
    });
    return false;
  }

  if (user.id !== adminUserId) {
    res.status(403).json({
      ok: false,
      error: { code: 'NOT_ADMIN', message: 'Nincs admin jogosultság.' },
    });
    return false;
  }

  const body: unknown = req.body;
  const password = isRecord(body) ? body.password : undefined;
  if (!password || password !== adminPassword) {
    res.status(401).json({
      ok: false,
      error: { code: 'INVALID_ADMIN_PASSWORD', message: 'Hibás admin jelszó.' },
    });
    return false;
  }

  return true;
}
