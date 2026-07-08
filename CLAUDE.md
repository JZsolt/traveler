# Az Utazásaim — Utazástervező PWA

## Projekt

React + Vite + Tailwind CSS + shadcn/ui + Supabase utazástervező app.
Magyar nyelvű, mobile-first, PWA.
Deploy: Vercel. Repo: github.com:JZsolt/traveler.git

## Klónozás után

```bash
git clone git@github.com:JZsolt/traveler.git Utazasaim
cd Utazasaim
pnpm install
```

### Supabase beállítás (KÖTELEZŐ — az app nem működik nélküle!)

1. Hozz létre egy Supabase projektet: https://supabase.com
2. Futtasd az SQL migrációt a Supabase SQL Editor-ban: `supabase/migrations/001_create_trips.sql`
3. Futtasd a GRANT-okat is:
   ```sql
   GRANT ALL ON public.trips TO service_role;
   GRANT ALL ON public.trips TO authenticated;
   GRANT SELECT ON public.trips TO anon;
   ```
4. Hozd létre a `.env.local` fájlt (`.gitignore`-ban van, soha nem commitolódik):
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
5. Seed (trip adatok feltöltése a DB-be):
   ```bash
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm run seed
   ```
   Vagy ha a `.env.local`-ban vannak a SUPABASE_ változók:
   ```bash
   export $(grep -v '^#' .env.local | grep -E '^SUPABASE_' | xargs) && pnpm run seed
   ```

Ha a Supabase nincs konfigurálva vagy nem elérhető, az app hibaüzenetet jelenít meg debug checklist-tel.

### BMAD telepítés (opcionális — brainstorming, utazás tervezés)

```bash
pnpm dlx bmad-method     # BMAD core telepítés a projekt gyökerébe (_bmad/ mappa)
```

Ez létrehozza az `_bmad/` core engine-t. A `.claude/skills/` (BMAD skillek) már a repóban vannak.

## Fejlesztés

```bash
pnpm dev             # dev szerver (localhost:5173)
pnpm vite --host     # dev szerver hálózatról is elérhető (mobil teszteléshez)
pnpm build           # production build → dist/
pnpm run seed        # trip JSON-ok → Supabase (SUPABASE_ env kell)
pnpm run validate:trips  # trip JSON validáció
```

## Struktúra

```
src/
  lib/constants.js       # Centralizált konstansok (AI modellek, API utak, storage kulcsok)
  lib/supabase.js        # Supabase kliens (VITE_ env-ekből)
  lib/tripSections.js    # Immutable trip data transform helperek
  lib/exportTripJson.js  # JSON blob export helper
  lib/extractLocationName.js # Google Maps URL parser
  lib/createTripHelpers.js   # Trip draft → trip data konverzió
  hooks/useTripUpdater.js    # Supabase save hook (saveTrip, saving, error)
  hooks/useDeleteTrip.js     # Trip törlés workflow (modal, supabase delete, navigate)
  hooks/useExpandDay.js      # Nap részletezés AI workflow (TripPage expand)
  hooks/useCreateTripChat.js # Trip létrehozás chat + generálás workflow
  hooks/useDayMetaEditor.js  # Nap cím/alcím editor state
  hooks/useDayAdvancedEditor.js # Nap haladó JSON editor state
  hooks/useDayScheduleAi.js  # Nap AI programterv generálás + pending draft
  hooks/useScheduleItemEditor.js # Program szerkesztés draft/dirty/validation
  hooks/useAdmin.js          # Admin context hook
  context/TripsContext.jsx   # Trip adat provider — Supabase-ből tölt
  context/AdminContext.jsx   # Admin session provider
  data/trips/_template.json  # Trip sablon (generáláshoz)
  components/
    editor/EditableSection.jsx  # Szekció edit shell (view/edit mód, dirty-state, AI gomb)
    editor/AiSuggestionPanel.jsx # Újrahasználható AI javaslat panel (instruction, preview, apply/discard)
    editor/DirtyCancelRow.jsx    # Megosztott dirty-cancel figyelmeztetés (dark/light variáns)
    DaySection.jsx       # Nap megjelenítés + inline editor (meta, advanced, schedule)
    ScheduleItem.jsx     # Program megjelenítés + inline editor (basic + details + AI guide)
    GuideInfo.jsx        # Guide collapsible megjelenítés
    DbError.jsx          # DB hiba megjelenítés debug checklist-tel
    trip/                # Szekció komponensek (PackingList, UsefulLinks, SavingTips, stb.)
  pages/
    HomePage.jsx         # Főoldal — trip kártyák listája (Supabase-ből)
    TripPage.jsx         # Trip részletek oldal (/trip/:slug)
api/
  _admin-auth.js           # Megosztott admin jelszó validáció
  suggest-trip-section.js  # AI szekció javaslat endpoint (Gemini)
  plan-trip.js           # Trip tervezés AI endpoint
  expand-day.js          # Nap részletezés AI endpoint
supabase/migrations/     # SQL migrációk
scripts/                 # Seed + validáció scriptek
```

## Kötelező kódarchitektúra szabályok

Ezek minden implementációra és review-ra érvényesek, nem csak a 10-es phase-re.

- Pages csak route-szintű kompozíciót végezzenek; komplex workflow, adatmentés, AI flow, validáció és állapotlogika custom hookba vagy `lib/` helperbe kerüljön.
- Állapotos, újrahasználható logika `src/hooks/use*.js` alatt legyen.
- Megosztott UI `src/components/` vagy `src/components/ui/` alatt legyen.
- Amit 2 vagy több helyen használunk, abból közös komponens, hook, helper vagy konstans legyen.
- Cél fájlméret: körülbelül 200 sor. Kemény felső határ: körülbelül 250 sor, csak dokumentált indokkal léphető túl.
- Konstansok, route pathok, API endpointok, storage key-ek, model id-k, section key-ek és ismételt UI szövegek ne JSX fájlokban legyenek hardcode-olva.
- Theme tokeneket és CSS változókat használj hard-coded színek, spacingek és inline style helyett, amikor van megfelelő token.
- Inline `style` csak platform/browser szükségletnél megengedett, például safe-area vagy dinamikus runtime érték esetén.
- Ha TypeScript kerül be, type/interface definíciók külön `types` fájlba menjenek, ne komponensfájlba.
- TypeScript migráció a design-system migráció előtt kötelező.
- Megosztott TypeScript domain/API/editor típusok `src/types/` alatt legyenek.
- Tilos inline `type` vagy `interface` deklaráció komponensben, hookban, page-ben, libben vagy API fájlban.
- Tilos az `any`: nincs explicit `any`, `as any`, `Record<string, any>` vagy `any[]`.
- JSON, Supabase, browser storage és API boundary esetén `unknown` + narrowing legyen.
- `Trip`, `Day`, `ScheduleItem` pontosan egyszer legyen definiálva: `src/types/trip.ts`. Ne legyen duplikált `TripData`, `TripDay`, `Activity` vagy ekvivalens domain type.
- Review-nál minden érintett fájlnál ellenőrizd: méret, logika/UI szétválasztás, duplikáció, konstansok, theme token használat, TypeScript esetén broad cast, inline type/interface, duplikált domain type és bármilyen `any`.

## Inline szerkesztés architektúra

- **`useTripUpdater`** hook: `saveTrip(updater)` — updater fv megkapja a trip-et, visszaadja a módosítottat, Supabase-be menti
- **`EditableSection`** shell: view/edit mód, SquarePen ikon, Mentés/Mégse, dirty-state figyelmeztetés, opcionális AI gomb
- **`tripSections.js`** helperek: `replaceTripSection`, `updateTripDay`, `addDay`, `deleteDay`, `moveDayUp/Down`, `addScheduleItem`, `deleteScheduleItem`, `moveScheduleItem`, `updateScheduleItem`
- AI javaslat flow: `AiSuggestionPanel` → fetch `/api/suggest-trip-section` → preview → apply (draft-ba, NEM auto-save!) → user kézi Mentés
- AI hibák mindig UI-ban jelennek meg magyar szöveggel (429, token limit, invalid JSON, szerver hiba)
- AI soha nem ment automatikusan — a user mindig kézzel menti

## Adatfolyam

Trip adatok **kizárólag Supabase-ből** jönnek (nincs statikus fallback):
1. `TripsContext` fetch-el a `trips` táblából (`trip_data` JSONB oszlop)
2. Ha Supabase nem elérhető → `DbError` komponens debug útmutatóval
3. Seed script: `src/data/trips/_template.json` alapján generált JSON-ok → Supabase upsert

## BMAD Method — kreatív tervezés & brainstorming

A projektben telepítve van a BMAD Method (`_bmad/` mappa, magyar nyelvre konfigurálva).
**Automatikusan hívd meg a megfelelő BMAD skill-t, NE várd, hogy a user emlékezzen a parancsra!**

| Mikor hívd meg | Skill parancs |
|----------------|---------------|
| Utazás ötletelés, bármilyen brainstorming, kreatív tervezés | `/bmad-brainstorming` |
| "Mit csináljak?", "Hogyan tovább?", BMAD kérdés | `/bmad-help` |
| PRD / követelmény dokumentum készítés | `/bmad-create-prd` |
| Kritikai review (terv, dokumentum, kód) | `/bmad-review-adversarial-general` |
| Szöveg/prose minőség javítás | `/bmad-editorial-review-prose` |
| Dokumentum struktúra review | `/bmad-editorial-review-structure` |
| Edge case analízis | `/bmad-review-edge-case-hunter` |

## Új utazás — brainstorming + generálás

### FONTOS: Amikor a user új utazást kér, ELŐSZÖR brainstorming, UTÁNA generálás!

**NE olvass be meglévő trip fájlokat, schema doc-ot, vagy komponenseket.**
Csak a template kell majd: `src/data/trips/_template.json`

---

### Fázis 1: Brainstorming — útvonal választás

**A) Gyors mód** — ha a user már tudja mit akar (pl. "csináld meg a római tripet, 4 felnőtt, júl 15-20"):
Kérdezd meg ami hiányzik az `AskUserQuestion` tool-lal, max 3-4 kérdést kötegbe.

**B) Kreatív mód** — ha a user ötletelni akar (pl. "tervezzünk valami utazást", "hova menjünk?"):
Hívd meg a `/bmad-brainstorming` skill-t! Az végigviszi az ötletelést strukturáltan.

Mindkét módnál az alábbi infókat kell összegyűjteni:

**Úti cél & logisztika:**
- Hová? (város/ország/régió)
- Honnan indultok? (indulási pont — autósnál kiemelten fontos)
- Mikor? (konkrét dátumok vagy hozzávetőleges időszak)
- Mennyi időre? (ha a dátumokból nem egyértelmű)
- Mivel? (autó / repülő / vonat) — ha autó: hány sofőr, milyen autó

**Utazók:**
- Hány felnőtt? Hány gyerek? (gyerekeknél életkor is kell — befolyásolja a programokat)
- Milyen összetétel? (házaspárok, barátok, nagycsalád, szólóban stb.)

**Pénz:**
- Van fix keret vagy range? (pl. "max €1000" vagy "€800-1200")
- Ez összesen vagy fejenként?
- Spórolós vagy kényelmes vonal?

**A trip jellege:**
- Mi a fő cél? (pihenés / city break / roadtrip / kultúra / gasztro / strand / kaland)
- Milyen tempó? (laza, sok szabadidővel / sűrű, mindent bejárni)
- Van konkrét érdeklődés? (sörözés, múzeumok, természet, éjszakai élet, történelem stb.)

**Szállás & fix dolgok:**
- Szállás preferencia? (hotel / Airbnb / hostel / mindegy)
- Fontos szempont? (parkoló, központi, medence, gyerekbarát stb.)
- Van már valami fix? (lefoglalt jegy, szállás, repjegy, program)

### Fázis 1 vége: Trip Brief

Amikor minden infó megvan, foglald össze egy rövid **Trip Brief**-ben:

```
🗺 Cél: Róma · Vatikán
📅 Dátum: 2026. okt. 15–19. (5 nap)
👥 Utazók: 4 felnőtt + 1 gyerek (8 éves) · 2 család
✈️ Közlekedés: repülő BUD→FCO
💰 Budget: ~€1200-1600 összesen, kényelmes
🎯 Jelleg: city break, kultúra + gasztro, közepes tempó
🏨 Szállás: Airbnb, központi
📌 Fix: semmi még
```

**Kérd a user jóváhagyását a Brief-re, MIELŐTT generálsz!**

---

### Fázis 2: Trip generálás (a Brief alapján)

Olvasd be: `src/data/trips/_template.json` — ez a sablon MINDEN mezővel és mintaértékkel.

1. Generáld a trip JSON-t a `_template.json` struktúra alapján
2. Töltsd ki az alapadatokat (slug, title, dates, emoji az ország zászlajával)
3. `people`: a megadott összetétel alapján (pl. "4 felnőtt · 2 gyerek · 2 család")
4. Generálj annyi `days[]` elemet, ahány napra szól az út
5. Minden naphoz: 4-8 schedule item (POI-k, étkezések, opcionálisok)
6. **Költségek (costs) mindig az ÖSSZES utazóra vonatkoznak** — nem fejenként
7. `budget` label-ek: igazítsd a csapat összetételéhez (pl. "Spórolós / 1 pár", "Összesen / 6 fő")
8. Budget összegek: célállomás + létszám alapján becsüld (Nyugat-EU drágább, Balkán olcsóbb)
9. Gyerekek esetén: `badges` mezőben jelöld a GYEREKBARÁT programokat, éttermeknél gyerekmenü tipp
10. Mentsd el Supabase-be a seed scripttel vagy az API-n keresztül

## GitHub Backup & Import

A fooldal aljan talalhato "Export mentes Gitre" gombbal az osszes utazas kimentheto a GitHub repoba, trip-enkent kulon fajlba. Ugyanott importalhatok is backup fajlok.

### Szukseges env valtozok (szerver oldali, SOHA ne VITE_ prefix)

```
GITHUB_TOKEN=ghp_...          # GitHub Personal Access Token (Contents read & write)
GITHUB_REPO=JZsolt/traveler   # owner/repo formatum
GITHUB_BACKUP_BRANCH=main     # melyik branchre commitoljon
```

Vercel-en is be kell allitani (Settings → Environment Variables).

### Backup fajl struktura

```
backups/trips/manifest.json              # osszes trip listaja
backups/trips/by-slug/<slug>.json        # trip-enkent kulon fajl
```

### Export mukodes

1. `POST /api/backup-trips` — exportalja az osszes tripet Supabase-bol (paginalt fetch)
2. Minden tripet kulon JSON fajlkent commitol a `backups/trips/by-slug/<slug>.json` utvonalra
3. Frissiti a `manifest.json`-t az osszes trip listajaval
4. Ha a fajl mar letezik, SHA-val frissiti; ha nem, letrehozza
5. Commit message: `backup: export trip <slug> YYYY-MM-DD HH:mm`

### Import mukodes

Ket import mod tamogatott:
- **Ujkent importalas** (`create`): mindig uj tripet hoz letre, slug utkozesnel suffixet ad (-2, -3)
- **Frissites slug alapjan** (`upsert-by-slug`): ha letezik a slug, frissiti; ha nem, letrehozza

Endpointok:
- `POST /api/import-trip-backup` — egy trip importalasa (`{ mode, backup }`)
- `POST /api/import-trip-backups` — tobb trip importalasa (`{ mode, backups: [...] }`)

### Visszaallitas

Minden trip kulon visszaallithato a sajat backup fajljabol. Az import UI-ban valaszd ki a `.json` fajl(oka)t es valassz import modot.

## Fontos szabályok

- A nyelv MAGYAR — minden szöveg, leírás, guide magyarul
- Linkek: minden POI-hoz kell Google Maps link + Wikipedia/hivatalos oldal link
- Guide: minden látványossághoz kell guide (history, mustSee, funFacts, tips)
- Étkezésekhez: étterem ajánlatok Google ratinggel és címmel
- Linkek ellenőrzése: NE használj bizonytalan URL-eket, Wikipedia mindig működik
- Képek: Wikimedia Commons 960px thumbnail URL-ek (mindig elérhetők)
- Tipográfiai idézőjelek (`„"`) TILOSAK JS stringekben — használj aposztrófot (`'`) vagy escaped quote-ot (`\"`)
- Build ellenőrzés: `pnpm build` MINDIG a commit előtt
