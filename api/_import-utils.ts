import type { ImportSingleResult, SlugRow, SupabaseAdmin } from '../src/types/apiServer';
import { TripBackupEnvelopeSchema } from '../src/schemas/backup.js';
import { formatZodError } from '../src/schemas/errors.js';

async function findUniqueSlug(
  supabase: SupabaseAdmin,
  baseSlug: string,
): Promise<string> {
  const { data } = await supabase
    .from('trips')
    .select('slug')
    .like('slug', `${baseSlug}%`);

  if (!data || data.length === 0) return baseSlug;

  const rows: SlugRow[] = data;
  const existing = new Set(rows.map((r) => r.slug));
  if (!existing.has(baseSlug)) return baseSlug;

  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }

  return `${baseSlug}-${Date.now()}`;
}

async function importSingleTrip(
  supabase: SupabaseAdmin,
  backup: unknown,
  mode: string,
): Promise<ImportSingleResult> {
  const validated = TripBackupEnvelopeSchema.safeParse(backup);
  if (!validated.success) {
    return { ok: false, error: formatZodError(validated.error) };
  }

  const trip = validated.data.trip;
  let slug = trip.slug;

  if (mode === 'create') {
    slug = await findUniqueSlug(supabase, trip.slug);

    const { error: insertError } = await supabase.from('trips').insert({
      slug,
      trip_data: { ...trip.trip_data, slug },
      owner: trip.owner || null,
    });

    if (insertError) {
      return { ok: false, error: 'Nem sikerult importalni: ' + insertError.message };
    }

    return { ok: true, slug, created: true, updated: false };
  }

  const { data: existing } = await supabase
    .from('trips')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from('trips')
      .update({
        trip_data: trip.trip_data,
        owner: trip.owner || null,
      })
      .eq('slug', slug);

    if (updateError) {
      return { ok: false, error: 'Nem sikerult frissiteni: ' + updateError.message };
    }

    return { ok: true, slug, created: false, updated: true };
  }

  const { error: insertError } = await supabase.from('trips').insert({
    slug,
    trip_data: trip.trip_data,
    owner: trip.owner || null,
  });

  if (insertError) {
    return { ok: false, error: 'Nem sikerult importalni: ' + insertError.message };
  }

  return { ok: true, slug, created: true, updated: false };
}

export { findUniqueSlug, importSingleTrip };
