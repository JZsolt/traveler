const ERROR_MAP = [
  [/PGRST301|JWT/, 'Hitelesitesi hiba. Probald ujratolteni az oldalt.'],
  [/duplicate key|already exists|23505/, 'Ilyen utazas mar letezik.'],
  [/not found|PGRST116/, 'Az utazas nem talalhato.'],
  [/network|fetch|Failed to fetch|ERR_NETWORK/, 'Nincs internetkapcsolat. Ellenorizd a halozatot.'],
  [/timeout|ETIMEDOUT/, 'A szerver nem valaszolt idoiben. Probald ujra.'],
  [/rate.?limit|429|RESOURCE_EXHAUSTED|RPD/, 'Tullepted az API limitet. Probald ujra kesobb.'],
  [/GEMINI_API_KEY/, 'A Gemini API kulcs nincs beallitva a szerveren.'],
  [/Supabase nincs/, 'A Supabase nincs konfigurálva. Ellenorizd az .env.local fajlt.'],
]

export function friendlyError(err) {
  const raw = typeof err === 'string' ? err : err?.message || err?.error || ''

  if (raw) {
    console.error('[Error]', raw)
  }

  for (const [pattern, message] of ERROR_MAP) {
    if (pattern.test(raw)) return message
  }

  if (!raw) return 'Ismeretlen hiba tortent. Probald ujra.'
  return 'Hiba tortent. Probald ujra kesobb.'
}
