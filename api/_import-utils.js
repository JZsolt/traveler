function validateBackupShape(body) {
  if (!body || typeof body !== 'object') return 'A JSON nem egy objektum.'
  if (body.application !== 'Traveler') return 'Nem Traveler backup fajl.'
  if (!body.trip || typeof body.trip !== 'object') return 'Hianyzo "trip" mezo.'

  const t = body.trip
  if (!t.slug || typeof t.slug !== 'string') return 'Hianyzo vagy ervenytelen "trip.slug".'
  if (!t.trip_data || typeof t.trip_data !== 'object') return 'Hianyzo vagy ervenytelen "trip.trip_data".'

  const td = t.trip_data
  if (!td.title || typeof td.title !== 'string') return 'Hianyzo "trip_data.title".'
  if (!td.startDate) return 'Hianyzo "trip_data.startDate".'
  if (!td.endDate) return 'Hianyzo "trip_data.endDate".'

  return null
}

async function findUniqueSlug(supabase, baseSlug) {
  const { data } = await supabase
    .from('trips')
    .select('slug')
    .like('slug', `${baseSlug}%`)

  if (!data || data.length === 0) return baseSlug

  const existing = new Set(data.map(r => r.slug))
  if (!existing.has(baseSlug)) return baseSlug

  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`
    if (!existing.has(candidate)) return candidate
  }

  return `${baseSlug}-${Date.now()}`
}

async function importSingleTrip(supabase, backup, mode) {
  const validationError = validateBackupShape(backup)
  if (validationError) {
    return { ok: false, error: validationError }
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
