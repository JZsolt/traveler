# TypeScript Type Inventory

## Type File Locations

| File | Contents |
|---|---|
| `src/types/trip.ts` | All domain models (Trip, Day, ScheduleItem, Guide, etc.) |
| `src/types/api.ts` | API request/response shapes (AI, import/export, admin) |

## Domain Models

All shared domain types live in `src/types/trip.ts`. One canonical definition per model.

### Trip (top-level trip_data)

| Field | Type | Required | Notes |
|---|---|---|---|
| slug | string | yes | URL-safe identifier |
| title | string | yes | |
| subtitle | string | yes | auto-generated from dates |
| emoji | string | yes | flag/icon |
| startDate | string | yes | ISO date YYYY-MM-DD |
| endDate | string | yes | ISO date YYYY-MM-DD |
| people | string | yes | free-text description |
| destination | string | no | |
| highlights | string[] | yes | defaults [] |
| accommodation | Accommodation | yes | defaults {} |
| flight | Flight | yes | defaults {} |
| budget | Budget | yes | defaults {} |
| urgentBookings | UrgentBooking[] | yes | defaults [] |
| usefulLinks | UsefulLink[] | yes | defaults [] |
| packingList | string[] | yes | defaults [] |
| savingTips | SavingTip[] | yes | defaults [] |
| practicalInfo | PracticalInfoSection[] | yes | defaults [] |
| bookingChecklist | BookingChecklistItem[] | yes | defaults [] |
| overview | OverviewDay[] | yes | defaults [] |
| days | Day[] | yes | defaults [] |
| status | string | no | "complete" / "draft" |
| aiModel | string | no | model used for generation |
| expandedDays | number[] | no | |

### Accommodation

| Field | Type | Required |
|---|---|---|
| address | string | no |
| mapUrl | string | no |
| host | string | no |
| gateCode | string | no |
| doorCode | string | no |
| wifi | { name: string; password: string } | no |
| videos | { url: string; label: string }[] | no |

### Flight

| Field | Type | Required |
|---|---|---|
| airport | string | no |
| arrival | string | no |
| departure | string | no |

### Budget

| Field | Type | Required |
|---|---|---|
| headline | string | no |
| lowPerFamily | string | no |
| comfortPerFamily | string | no |
| lowTotal | string | no |
| comfortTotal | string | no |
| lowPerFamilyLabel | string | no |
| comfortPerFamilyLabel | string | no |
| lowTotalLabel | string | no |
| comfortTotalLabel | string | no |
| summaryLabel | string | no |

### Day

| Field | Type | Required |
|---|---|---|
| dayNum | number | yes |
| title | string | yes |
| subtitle | string | no |
| _draft | boolean | no |
| alerts | Alert[] | no |
| endAlerts | Alert[] | no |
| tickets | Ticket[] | no |
| images | Image[] | no |
| transportOptions | TransportOptions | no |
| schedule | ScheduleItem[] | yes |
| costs | Cost[] | no |

### ScheduleItem

| Field | Type | Required |
|---|---|---|
| time | string | yes |
| title | string | yes |
| desc | string | no |
| highlight | boolean | no |
| optional | boolean | no |
| badges | string[] | no |
| links | Link[] | no |
| transport | TransportLink[] | no |
| guide | Guide | no |

### Guide

| Field | Type | Required |
|---|---|---|
| history | string[] | no |
| mustSee | string[] | no |
| funFacts | string[] | no |
| tips | string[] | no |

### Link

| Field | Type | Required |
|---|---|---|
| label | string | yes |
| url | string | yes |

### TransportLink

| Field | Type | Required |
|---|---|---|
| type | string | yes |
| label | string | yes |
| url | string | yes |

### Cost

| Field | Type | Required |
|---|---|---|
| item | string | yes |
| cost | string | yes |
| total | boolean | no |

### Alert

| Field | Type | Required |
|---|---|---|
| type | "tip" \| "warning" \| "urgent" | yes |
| text | string | yes |

### Ticket

| Field | Type | Required |
|---|---|---|
| label | string | yes |
| desc | string | yes |
| pdf | string | no |

### Image

| Field | Type | Required |
|---|---|---|
| url | string | yes |
| caption | string | no |

### TransportOptions

| Field | Type | Required |
|---|---|---|
| title | string | yes |
| options | TransportOption[] | yes |

### TransportOption

| Field | Type | Required |
|---|---|---|
| name | string | yes |
| time | string | no |
| pricePerPerson | string | no |
| total | string | no |
| url | string | no |
| recommended | boolean | no |

### Supporting list-item types

| Type | Fields |
|---|---|
| UrgentBooking | name: string, reason: string, url: string, done: boolean |
| UsefulLink | emoji: string, name: string, desc: string, url: string |
| SavingTip | tip: string, saving: string |
| PracticalInfoSection | title: string, items: string[] |
| BookingChecklistItem | item: string, url?: string |
| OverviewDay | day: number, date: string, program: string, highlights: string |

---

## External / Unsafe Boundaries

These are the points where data enters or leaves the typed world. All must use `unknown` + narrowing, never `any`.

### Supabase rows

- `trips` table: `{ id, slug, trip_data (JSONB), owner, ... }`
- `trip_data` column is untyped JSON — must be narrowed to `Trip` after fetch
- Pattern: `const raw: unknown = row.trip_data; const trip = normalizeTrip(raw)`

### JSON import/export

- Backup format: `{ application: "Traveler", trip: { slug, trip_data, owner } }`
- Import validation in `api/_import-utils.ts` checks shape before insert
- Imported `trip_data` must be treated as `unknown` until validated

### AI endpoint responses

- `api/suggest-trip-section.ts` — returns partial trip sections (array or object)
- `api/expand-day.ts` — returns a `Day`-shaped object
- `api/plan-trip.ts` — returns a full `Trip`-shaped object
- `api/chat.ts` — returns streaming text
- All AI JSON is parsed from free-text — must use `unknown` + validation
- Pattern: `JSON.parse(extractJson(text))` → validate shape before use

### Browser storage

- `sessionStorage` for admin token — string, not typed data
- No trip data in localStorage/sessionStorage

---

## Compiler Strictness

- `strict: true` — enabled, all app code in `src/` and `api/` passes
- `allowJs: false` — no JS/JSX files remain in `src/` or `api/`
- `noUncheckedIndexedAccess` — deferred, produces 58 errors mostly in array swap patterns and Record lookups across editor components; would require pervasive guards on array element access
- Scripts (`scripts/*.mjs`) are standalone Node.js files outside the `include` path, not typechecked

## Migration Rules

### Zero-any policy

- No `any`, `as any`, `Record<string, any>`, or `any[]` in application code
- ESLint rule `@typescript-eslint/no-explicit-any: error` enforces this
- At external boundaries use `unknown` + narrowing (type guards or validation)

### Canonical types

- `Trip`, `Day`, `ScheduleItem` and all sub-models defined exactly once in `src/types/trip.ts`
- No duplicate aliases (`TripData`, `TripDay`, `Activity`, etc.)
- Components import from `@/types/trip`

### Cast discipline

- `as` casts only at validated boundaries (after a type guard confirms the shape)
- No broad casts to silence errors
- Prefer type narrowing over assertion

### Inline types

- No `type` or `interface` declarations inside component, hook, page, lib, or API files
- All types go to `src/types/`, including single-use component prop types
