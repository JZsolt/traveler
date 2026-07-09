import type { ImportSingleResult, SupabaseAdmin } from '../src/types/apiServer'
import { isRecord, isTripBackupBody, isTripImportData } from './_narrowing'

function validateBackupShape(body: unknown): string | null {
  if (!isRecord(body)) return 'A JSON nem egy objektum.'
  const b = body
  if (b.application !== 'Traveler') return 'Nem Traveler backup fajl.'
  if (!isRecord(b.trip)) return 'Hianyzo "trip" mezo.'

  const t = b.trip
  if (!t.slug || typeof t.slug !== 'string') return 'Hianyzo vagy ervenytelen "trip.slug".'
  if (!isRecord(t.trip_data)) return 'Hianyzo vagy ervenytelen "trip.trip_data".'
  if (typeof t.trip_data.title !== 'string') return 'Hianyzo "trip_data.title".'
  if (typeof t.trip_data.startDate !== 'string') return 'Hianyzo "trip_data.startDate".'
  if (typeof t.trip_data.endDate !== 'string') return 'Hianyzo "trip_data.endDate".'
  if (!isTripImportData(t.trip_data)) return 'A "trip.trip_data" szerkezete ervenytelen.'

  return null
}

async function findUniqueSlug(supabase: SupabaseAdmin, baseSlug: string): Promise<string> {
  const { data } = await supabase
    .from('trips')
    .select('slug')
    .like('slug', `${baseSlug}%`)

  if (!data || data.length === 0) return baseSlug

  const existing = new Set(data.map((r: { slug: string }) => r.slug))
  if (!existing.has(baseSlug)) return baseSlug

  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`
    if (!existing.has(candidate)) return candidate
  }

  return `${baseSlug}-${Date.now()}`
}

async function importSingleTrip(supabase: SupabaseAdmin, backup: unknown, mode: string): Promise<ImportSingleResult> {
  const validationError = validateBackupShape(backup)
  if (validationError || !isTripBackupBody(backup)) {
    return { ok: false, error: validationError || 'A backup szerkezete ervenytelen.' }
  }

  const trip = backup.trip
  let slug = trip.slug

  if (mode === 'create') {
    slug = await findUniqueSlug(supabase, trip.slug)

    const { error: insertError } = await supabase
      .from('trips')
      .insert({
        slug,
        trip_data: { ...trip.trip_data, slug },
        owner: trip.owner || null,
      })

    if (insertError) {
      return { ok: false, error: 'Nem sikerult importalni: ' + insertError.message }
    }

    return { ok: true, slug, created: true, updated: false }
  }

  const { data: existing } = await supabase
    .from('trips')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    const { error: updateError } = await supabase
      .from('trips')
      .update({
        trip_data: trip.trip_data,
        owner: trip.owner || null,
      })
      .eq('slug', slug)

    if (updateError) {
      return { ok: false, error: 'Nem sikerult frissiteni: ' + updateError.message }
    }

    return { ok: true, slug, created: false, updated: true }
  }

  const { error: insertError } = await supabase
    .from('trips')
    .insert({
      slug,
      trip_data: trip.trip_data,
      owner: trip.owner || null,
    })

  if (insertError) {
    return { ok: false, error: 'Nem sikerult importalni: ' + insertError.message }
  }

  return { ok: true, slug, created: true, updated: false }
}

export { validateBackupShape, findUniqueSlug, importSingleTrip }
