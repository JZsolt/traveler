# Az Utazásaim — Codex útmutató

## Projekt

React + Vite + Tailwind CSS + shadcn/ui utazástervező PWA.
Magyar nyelvű, mobile-first alkalmazás offline támogatással.
Deploy: Vercel. Repo: github.com:JZsolt/traveler.git

## Alap parancsok

```bash
pnpm install
pnpm dev
pnpm vite --host
pnpm build
```

Új vagy módosított trip előtt legalább ezt futtasd:

```bash
pnpm run validate:trips
node -c src/data/trips.js
```

Szigorú adatminőségi auditként futtatható:

```bash
pnpm run validate:trips:strict
```

A strict mód a régi trip adatokon még várhatóan hiányokat jelezhet; új, teljes tartalmú tripnél ez legyen a célállapot.

## Struktúra

```text
src/
  data/trips.js       # Összes utazás regisztrációja
  data/trips/         # Trip JSON fájlok, _template.json sablonnal
  components/         # UI komponensek
  pages/
    HomePage.jsx
    TripPage.jsx
docs/
  new-trip-workflow.md
  trip-data-schema.md # csak átirányító; a teljes séma: src/data/trips/_template.json
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

## BMAD Method Codex alatt

A BMAD core a projektben `_bmad/` alatt van, de `.gitignore`-olt és külön telepíthető:

```bash
pnpm dlx bmad-method
```

A Codex-kompatibilis BMAD skillek a `.codex/skills/` mappában vannak. Ha egy feladat BMAD jellegű, automatikusan használd a megfelelő skillt; ne várd, hogy a user pontos parancsot mondjon.

| Mikor használd | Codex skill |
| --- | --- |
| Utazás ötletelés, brainstorming, kreatív tervezés | `bmad-brainstorming` |
| "Mit csináljak?", "Hogyan tovább?", BMAD kérdés | `bmad-help` |
| PRD / követelmény dokumentum készítés | `bmad-create-prd` |
| Kritikai review tervre, dokumentumra vagy kódra | `bmad-review-adversarial-general` |
| Szöveg/prose minőség javítás | `bmad-editorial-review-prose` |
| Dokumentum struktúra review | `bmad-editorial-review-structure` |
| Edge case analízis | `bmad-review-edge-case-hunter` |

## Új utazás workflow

Amikor a user új utazást kér, először brainstorming vagy brief pontosítás, utána generálás.

Gyors mód: ha a user már tudja mit akar, kérdezd meg a hiányzó alapadatokat röviden:

- hová, honnan, mikor, mennyi időre
- közlekedés módja
- felnőttek és gyerekek száma, gyerekek életkora
- budget és hogy összesen vagy fejenként értendő
- trip jellege, tempó, érdeklődések
- szállás preferencia és fix foglalások

Kreatív mód: ha a user ötletelni akar, használd a `bmad-brainstorming` skillt.

Amikor minden lényeges adat megvan, készíts rövid Trip Briefet, és kérj jóváhagyást generálás előtt.

## Trip generálás szabályai

1. Olvasd be: `src/data/trips/_template.json`.
2. Másold új fájlba: `src/data/trips/[slug].json`.
3. Töltsd ki az alapadatokat: slug, title, dates, emoji.
4. `people`: a csapat összetétele alapján.
5. Hozz létre annyi `days[]` elemet, ahány napos az út.
6. Minden naphoz legyen 4-8 schedule item.
7. A `costs` mindig az összes utazóra vonatkozik, nem fejenként.
8. Gyerekek esetén jelöld a gyerekbarát programokat badge-ben.
9. Regisztráld az új tripet `src/data/trips.js`-ben.
10. Ellenőrizd: `pnpm run validate:trips` és `node -c src/data/trips.js`.

## Tartalmi szabályok

- A nyelv magyar: minden szöveg, leírás és guide magyarul készüljön.
- Minden POI-hoz kell Google Maps link és Wikipedia vagy hivatalos oldal link.
- Minden látványossághoz kell guide: history, mustSee, funFacts, tips.
- Étkezésekhez adj étterem ajánlatokat Google ratinggel és címmel.
- Ne használj bizonytalan URL-eket; Wikipedia link általában stabil.
- Képekhez Wikimedia Commons 960px thumbnail URL-eket használj.
- JS stringekben ne használj tipográfiai idézőjeleket; használj aposztrófot vagy escaped quote-ot.

## Claude-kompatibilitás

A `CLAUDE.md` és `.claude/skills/` továbbra is megmarad Claude Code használathoz. Codex alatt az `AGENTS.md` és `.codex/skills/` az elsődleges.
