import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tripsDir = path.join(rootDir, 'src/data/trips')
const publicDir = path.join(rootDir, 'public')
const typographicQuotes = /[“”„]/
const strict = process.argv.includes('--strict')

let errorCount = 0

function report(message) {
  errorCount += 1
  console.error(`x ${message}`)
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function check(condition, message) {
  if (!condition) report(message)
}

function walk(value, visitor, trail = '') {
  visitor(value, trail)

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${trail}[${index}]`))
    return
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, child]) => {
      walk(child, visitor, trail ? `${trail}.${key}` : key)
    })
  }
}

function checkNoTypographicQuotes(trip, fileName) {
  walk(trip, (value, trail) => {
    if (typeof value === 'string' && typographicQuotes.test(value)) {
      report(`${fileName}: typographic quote found at ${trail}`)
    }
  })
}

function checkPublicFile(fileRef, context) {
  if (!hasText(fileRef) || !fileRef.startsWith('/')) return

  const localPath = path.join(publicDir, fileRef)
  if (!fs.existsSync(localPath)) {
    report(`${context}: public file does not exist: ${fileRef}`)
  }
}

function checkLinks(links, context) {
  if (!Array.isArray(links)) {
    if (strict) report(`${context}: missing links`)
    return
  }

  links.forEach((link, index) => {
    const linkContext = `${context}.links[${index}]`
    check(hasText(link.label), `${linkContext}: missing label`)
    check(hasText(link.url), `${linkContext}: missing url`)
    if (hasText(link.url)) {
      check(/^https?:\/\//.test(link.url) || link.url.startsWith('/'), `${linkContext}: url must be http(s) or public path`)
      checkPublicFile(link.url, linkContext)
    }
  })
}

function checkGuide(guide, context, requirePoiFields) {
  if (!isObject(guide)) {
    if (strict) report(`${context}: missing guide`)
    return
  }

  const requiredFields = strict && requirePoiFields ? ['history', 'mustSee', 'funFacts', 'tips'] : ['tips']
  requiredFields.forEach(field => {
    check(Array.isArray(guide[field]) && guide[field].length > 0, `${context}.guide.${field}: missing items`)
  })
}

function looksLikeMeal(item) {
  const text = `${item.title || ''} ${item.desc || ''}`.toLowerCase()
  return /reggeli|ebed|ebéd|vacsora|etterem|étterem|kave|kávé|cukraszda|sorozo|söröző|food|lunch|dinner/.test(text)
}

function checkTrip(trip, fileName) {
  const requiredTopLevel = [
    'slug',
    'title',
    'subtitle',
    'emoji',
    'startDate',
    'endDate',
    'people',
    'highlights',
    'accommodation',
    'flight',
    'budget',
    'urgentBookings',
    'usefulLinks',
    'packingList',
    'savingTips',
    'bookingChecklist',
    'overview',
    'days'
  ]

  requiredTopLevel.forEach(field => check(trip[field] !== undefined, `${fileName}: missing top-level field "${field}"`))
  check(hasText(trip.slug), `${fileName}: slug must be non-empty`)
  check(hasText(trip.title), `${fileName}: title must be non-empty`)
  check(/^\d{4}-\d{2}-\d{2}$/.test(trip.startDate || ''), `${fileName}: startDate must be YYYY-MM-DD`)
  check(/^\d{4}-\d{2}-\d{2}$/.test(trip.endDate || ''), `${fileName}: endDate must be YYYY-MM-DD`)
  check(Array.isArray(trip.highlights) && trip.highlights.length > 0, `${fileName}: highlights must be a non-empty array`)

  check(isObject(trip.accommodation), `${fileName}: accommodation must be an object`)
  if (isObject(trip.accommodation)) {
    check(hasText(trip.accommodation.address), `${fileName}: accommodation.address missing`)
    check(hasText(trip.accommodation.mapUrl), `${fileName}: accommodation.mapUrl missing`)
    if (trip.accommodation.mapUrl) check(/^https?:\/\//.test(trip.accommodation.mapUrl), `${fileName}: accommodation.mapUrl must be http(s)`)
  }

  if (trip.insurance?.pdf) {
    checkPublicFile(trip.insurance.pdf, `${fileName}.insurance.pdf`)
  }

  check(Array.isArray(trip.usefulLinks), `${fileName}: usefulLinks must be an array`)
  trip.usefulLinks?.forEach((link, index) => {
    check(hasText(link.name), `${fileName}.usefulLinks[${index}]: missing name`)
    check(hasText(link.url), `${fileName}.usefulLinks[${index}]: missing url`)
  })

  check(Array.isArray(trip.overview) && trip.overview.length > 0, `${fileName}: overview must be a non-empty array`)
  check(Array.isArray(trip.days) && trip.days.length > 0, `${fileName}: days must be a non-empty array`)
  if (!Array.isArray(trip.days)) return

  if (Array.isArray(trip.overview)) {
    check(trip.overview.length === trip.days.length, `${fileName}: overview length must match days length`)
  }

  trip.days.forEach((day, dayIndex) => {
    const dayContext = `${fileName}.days[${dayIndex}]`
    check(Number.isInteger(day.dayNum), `${dayContext}: dayNum must be an integer`)
    check(hasText(day.title), `${dayContext}: missing title`)
    check(Array.isArray(day.schedule) && day.schedule.length > 0, `${dayContext}: missing schedule`)
    check(Array.isArray(day.costs) && day.costs.length > 0, `${dayContext}: missing costs`)

    day.tickets?.forEach((ticket, ticketIndex) => {
      checkPublicFile(ticket.pdf, `${dayContext}.tickets[${ticketIndex}].pdf`)
    })

    day.images?.forEach((image, imageIndex) => {
      check(hasText(image.url), `${dayContext}.images[${imageIndex}]: missing url`)
      if (hasText(image.url)) {
        check(/^https:\/\/upload\.wikimedia\.org\//.test(image.url), `${dayContext}.images[${imageIndex}]: expected Wikimedia Commons image URL`)
      }
      check(hasText(image.caption), `${dayContext}.images[${imageIndex}]: missing caption`)
    })

    day.schedule?.forEach((item, itemIndex) => {
      const itemContext = `${dayContext}.schedule[${itemIndex}]`
      check(hasText(item.time), `${itemContext}: missing time`)
      check(hasText(item.title), `${itemContext}: missing title`)
      if (strict) check(hasText(item.desc), `${itemContext}: missing desc`)
      checkLinks(item.links, itemContext)

      const requirePoiFields = !looksLikeMeal(item)
      checkGuide(item.guide, itemContext, requirePoiFields)
    })
  })

  checkNoTypographicQuotes(trip, fileName)
}

const files = fs.readdirSync(tripsDir)
  .filter(file => file.endsWith('.json') && file !== '_template.json')
  .sort()

if (files.length === 0) {
  console.log('0 local trip files found — nothing to validate (trip data lives in Supabase).')
  process.exit(0)
}

files.forEach(file => {
  const filePath = path.join(tripsDir, file)
  try {
    const trip = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    checkTrip(trip, file)
  } catch (error) {
    report(`${file}: invalid JSON: ${error.message}`)
  }
})

if (errorCount > 0) {
  console.error(`\nTrip validation failed with ${errorCount} issue(s).`)
  process.exit(1)
}

console.log(`Trip validation passed for ${files.length} trip(s)${strict ? ' in strict mode' : ''}.`)
