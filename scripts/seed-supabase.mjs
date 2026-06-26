import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tripsDir = join(__dirname, '..', 'src', 'data', 'trips')

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Hianyzik: SUPABASE_URL es/vagy SUPABASE_SERVICE_ROLE_KEY')
  console.error('Hasznalat: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm run seed')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const files = readdirSync(tripsDir)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))

console.log(`${files.length} trip fajl talalva...`)

for (const file of files) {
  const tripData = JSON.parse(readFileSync(join(tripsDir, file), 'utf-8'))
  const { slug } = tripData

  if (!slug) {
    console.warn(`  ⚠ ${file}: nincs slug, kihagyva`)
    continue
  }

  const { error } = await supabase
    .from('trips')
    .upsert(
      { slug, trip_data: tripData },
      { onConflict: 'slug' }
    )

  if (error) {
    console.error(`  ✗ ${slug}: ${error.message}`)
  } else {
    console.log(`  ✓ ${slug}`)
  }
}

console.log('Seed kesz!')
