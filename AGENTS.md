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
node -c src/data/trips.js
```

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
  trip-data-schema.md
```

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
10. Ellenőrizd: `node -c src/data/trips.js`.

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
