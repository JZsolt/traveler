import { SupabaseTripRowSchema } from '../src/schemas/apiResponses.js';
import type { ValidatedTripRow, FetchTripsResult, SupabaseAdmin } from '../src/types/apiServer';

const PAGE_SIZE = 500;

async function fetchAllTrips(supabase: SupabaseAdmin): Promise<FetchTripsResult> {
  const rows: ValidatedTripRow[] = [];
  const malformedSlugs: string[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(error.message);

    const rawPage: unknown[] = data || [];
    for (const raw of rawPage) {
      const parsed = SupabaseTripRowSchema.safeParse(raw);
      if (parsed.success) {
        rows.push(parsed.data);
      } else {
        const partial = SupabaseTripRowSchema.pick({ slug: true }).safeParse(raw);
        const slug = partial.success ? partial.data.slug : 'unknown';
        console.warn(`[backup-trips] Malformed Supabase row (slug=${slug})`);
        malformedSlugs.push(slug);
      }
    }

    if (rawPage.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return { rows, malformedSlugs };
}

export { fetchAllTrips };
