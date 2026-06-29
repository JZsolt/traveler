import { supabase } from '@/lib/supabase'

export async function ensureUniqueSlug(baseSlug, currentSlug = null) {
  if (!baseSlug) return ''

  if (baseSlug === currentSlug) return baseSlug

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
