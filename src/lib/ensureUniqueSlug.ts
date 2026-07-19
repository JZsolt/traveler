import { supabase } from '@/lib/supabase'
import type { TripsRow } from '@/types/supabase'

// Checks global slug uniqueness; after 15-09 RLS this query becomes owner-scoped automatically
export async function ensureUniqueSlug(baseSlug: string, currentSlug: string | null = null): Promise<string> {
  if (!baseSlug) return ''

  if (baseSlug === currentSlug) return baseSlug
  if (!supabase) return baseSlug

  const { data } = await supabase
    .from('trips')
    .select('slug')
    .like('slug', `${baseSlug}%`)

  if (!data || data.length === 0) return baseSlug

  const existing = new Set(data.map((r: Pick<TripsRow, 'slug'>) => r.slug))

  if (!existing.has(baseSlug)) return baseSlug

  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`
    if (!existing.has(candidate)) return candidate
  }

  return `${baseSlug}-${Date.now()}`
}
