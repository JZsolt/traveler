# Az Utazásaim

Magyar nyelvű, mobile-first utazástervező PWA. Utazások létrehozását,
szerkesztését és utazás közbeni használatát támogatja, Gemini-alapú AI
segítséggel, Supabase adattárolással és GitHub backup lehetőséggel.

## Fő funkciók

- Utazások létrehozása, szerkesztése és törlése
- Napokra bontott programterv és részletes programpontok
- AI chat, teljes tervgenerálás, napbővítés és szekciójavaslatok
- Szállás, költségvetés, pakolási lista, checklist és praktikus információk
- JSON import/export és GitHub backup
- Admin mód a szerkesztési funkciók zárolásához
- Telepíthető PWA és offline alkalmazásváz

## Technológia

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4 + shadcn/ui + Base UI
- Supabase PostgreSQL és JSONB
- Vercel serverless API route-ok
- Google Gemini (`@google/genai`)
- `vite-plugin-pwa`
- pnpm

## Gyors kezdés

### Előfeltételek

- Node.js 20.19 vagy újabb 20.x verzió, illetve Node.js 22.12+
- pnpm
- Supabase projekt
- Gemini API-kulcs az AI funkciókhoz
- Vercel projekt a serverless endpointok éles futtatásához

### Telepítés

```bash
git clone git@github.com:JZsolt/traveler.git
cd traveler
pnpm install
cp .env.example .env.local
```

Töltsd ki a `.env.local` értékeit, majd indítsd el a fejlesztői szervert:

```bash
pnpm dev
```

Alapértelmezett cím: `http://localhost:5173`.

A `pnpm dev` a Vite frontendet indítja el. A `api/` alatti Vercel serverless
endpointokhoz Vercel runtime vagy deployolt környezet szükséges.

## Környezeti változók

| Változó | Környezet | Cél |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | frontend | Supabase projekt URL |
| `VITE_SUPABASE_ANON_KEY` | frontend | Publikus, RLS által védett Supabase kulcs |
| `SUPABASE_URL` | szerver/script | Supabase projekt URL |
| `SUPABASE_SERVICE_ROLE_KEY` | szerver/script | Seed és szerveroldali admin műveletek |
| `GEMINI_API_KEY` | szerver | Gemini API-hívások |
| `ADMIN_PASSWORD` | szerver | Admin mód feloldása és backup/import védelem |
| `GITHUB_TOKEN` | szerver | GitHub Contents API írás |
| `GITHUB_REPO` | szerver | Backup célrepo, például `owner/repo` |
| `GITHUB_BACKUP_BRANCH` | szerver | Backup célbranch, alapértelmezetten `main` |

A szerveroldali titkok soha nem kaphatnak `VITE_` prefixet. A `.env.local`
gitignore-olt; titkot ne commitolj.

## Supabase beállítás

1. Hozz létre egy Supabase projektet.
2. Futtasd a [migrációt](supabase/migrations/001_create_trips.sql) a Supabase
   SQL Editorban.
3. Állítsd be a frontend és szerveroldali env változókat.
4. Ha vannak lokális trip JSON fájlok a `src/data/trips/` mappában, futtasd:

```bash
pnpm run seed
```

Az alkalmazás futás közben kizárólag Supabase-ből olvassa az utazásokat. A
lokális JSON fájlok opcionális seed/validációs források.

## Parancsok

| Parancs | Leírás |
| --- | --- |
| `pnpm dev` | Lokális Vite fejlesztői szerver |
| `pnpm build` | Production build a `dist/` mappába |
| `pnpm preview` | A production build lokális előnézete |
| `pnpm run typecheck` | TypeScript ellenőrzés a `src/` és `api/` mappákon |
| `pnpm run lint` | ESLint |
| `pnpm run validate:trips` | Lokális trip JSON fájlok alapellenőrzése |
| `pnpm run validate:trips:strict` | Szigorú tartalmi trip audit |
| `pnpm run seed` | Lokális trip JSON fájlok upsertje Supabase-be |

Ajánlott ellenőrzés commit előtt:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run validate:trips
```

## Alkalmazás route-ok

| Route | Funkció |
| --- | --- |
| `/` | Utazások listája |
| `/trip/:slug` | Utazás részletes nézete és inline szerkesztése |
| `/create-trip` | Új utazás és AI tervezési folyamat |
| `/trip/:slug/edit` | Alapadatok szerkesztése |
| `/settings` | Admin feloldás, backup és import |

## API endpointok

| Endpoint | Funkció |
| --- | --- |
| `POST /api/admin-login` | Admin jelszó ellenőrzése |
| `POST /api/chat` | Tervezési beszélgetés |
| `POST /api/plan-trip` | Teljes utazásvázlat generálása |
| `POST /api/expand-day` | Egy nap részletezése |
| `POST /api/suggest-trip-section` | Szekció vagy programpont AI-javaslata |
| `POST /api/backup-trips` | Supabase utazások mentése GitHubra |
| `POST /api/import-trip-backup` | Egy backup importálása |
| `POST /api/import-trip-backups` | Több backup importálása |

Az AI és admin endpointok Vercel serverless funkciók.

## Architektúra

```text
src/
  components/       megosztott és domain UI
  context/          alkalmazásszintű providerek
  hooks/            állapotos workflow és async logika
  lib/              tiszta helperek, normalizálás, Supabase kliens
  pages/            route-szintű kompozíció
  types/            kanonikus domain, API és UI típusok
api/                Vercel serverless endpointok
scripts/            seed és trip validáció
supabase/           adatbázis-migrációk
docs/               termék-, design- és architektúradokumentáció
tasks/              fejlesztési roadmap és feladatok
```

Fő adatfolyam:

```text
React UI -> hook/context -> Supabase
React UI -> /api/* -> Gemini, GitHub vagy Supabase service role
```

A `Trip`, `Day` és `ScheduleItem` kanonikus definíciója:
[`src/types/trip.ts`](src/types/trip.ts).

## Kódolási szabályok

- TypeScript strict mód; explicit `any` tilos.
- Külső adat `unknown`, majd Zod validáció a boundary rétegben.
- A runtime sémák a `src/schemas/` alatt élnek, és ahol lehetséges, ezekből
  következtetjük a TypeScript típusokat.
- Domain típusok kizárólag a `src/types/` alatt.
- Oldalak csak route-szintű kompozíciót végeznek.
- Workflow és állapotlogika custom hookba kerül.
- Cél fájlméret körülbelül 200 sor, felső határ körülbelül 250 sor.
- AI-javaslat nem ment automatikusan; a felhasználó kézzel alkalmazza és menti.
- Titkok csak szerveroldali env változókban tárolhatók.

Részletes szabályok: [AGENTS.md](AGENTS.md),
[ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) és
[TYPESCRIPT.md](docs/architecture/TYPESCRIPT.md).

## Biztonsági modell

Az admin mód elrejti és jelszóhoz köti az alkalmazás szerkesztési, import és
backup folyamatait. Ez jelenleg nem teljes többfelhasználós autentikációs
rendszer. A Supabase RLS szabályokat és az anon kulcs jogosultságait production
használat előtt a kívánt fenyegetési modellhez kell igazítani.

A `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `ADMIN_PASSWORD` és
`GITHUB_TOKEN` kizárólag szerveroldalon használható.

## Deploy

A projekt Vercelre van előkészítve:

1. Importáld a repót Vercelbe.
2. Add meg az összes szükséges env változót.
3. Build command: `pnpm run build`.
4. Output directory: `dist`.
5. Deploy után ellenőrizd a Supabase kapcsolatot és az `/api/*` endpointokat.

A SPA fallback beállítása a [vercel.json](vercel.json) fájlban található.

## Dokumentáció

### Termék

- [Product Vision](docs/product/PRODUCT_VISION.md)
- [Information Architecture](docs/product/INFORMATION_ARCHITECTURE.md)
- [User Flows](docs/product/USER_FLOWS.md)
- [Screen Library](docs/product/SCREEN_LIBRARY.md)
- [UX Rules](docs/product/UX_RULES.md)

### Architektúra

- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Database Philosophy](docs/architecture/DATABASE.md)
- [TypeScript](docs/architecture/TYPESCRIPT.md)
- [AI Workflow](docs/architecture/AI_WORKFLOW.md)
- [Decisions](docs/architecture/DECISIONS.md)

### Design

- [Visual Language](docs/design/VISUAL_LANGUAGE.md)
- [Typography](docs/design/TYPOGRAPHY.md)
- [Icon System](docs/design/ICON_SYSTEM.md)
- [Component Spec](docs/design/COMPONENT_SPEC.md)
- [Implementation Plan](docs/design/IMPLEMENTATION_PLAN.md)

### Fejlesztési folyamat

- [Roadmap](tasks/README.md)
- [Új utazás workflow](docs/new-trip-workflow.md)
- [Trip adatstruktúra](src/data/trips/_template.json)

## Projektállapot

A TypeScript migráció elkészült. A következő tervezett fejlesztési fázis a
[Runtime Validation & Data Boundaries](tasks/12-runtime-validation.md); a
design-system implementáció ezután indulhat. Az aktuális sorrendet a
[tasks/README.md](tasks/README.md) tartalmazza.
