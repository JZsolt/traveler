# Az Utazásaim — Utazástervező PWA

## Projekt

React + Vite + Tailwind CSS + shadcn/ui utazástervező app.
Magyar nyelvű, mobile-first, PWA offline támogatással.
Deploy: Vercel. Repo: github.com:JZsolt/traveler.git

## Klónozás után

```bash
git clone git@github.com:JZsolt/traveler.git Utazasaim
cd Utazasaim
pnpm install         # React app függőségek
pnpm dev             # dev szerver (localhost:5173)
```

Az app ezzel működik. A BMAD (brainstorming, utazás tervezés) használatához:

```bash
pnpm dlx bmad-method     # BMAD core telepítés a projekt gyökerébe (_bmad/ mappa)
```

Ez létrehozza az `_bmad/` core engine-t. A `.claude/skills/` (BMAD skillek) már a repóban vannak.

## Fejlesztés

```bash
pnpm dev             # dev szerver (localhost:5173)
pnpm vite --host     # dev szerver hálózatról is elérhető (mobil teszteléshez)
pnpm build           # production build → dist/
```

## Struktúra

```
src/
  data/trips.js       # ÖSSZES utazás adata — IDE kell az új tripet hozzáadni
  components/          # UI komponensek (DaySection, ScheduleItem, GuideInfo, stb.)
  pages/
    HomePage.jsx       # Főoldal — trip kártyák listája (automatikus a trips.js-ből)
    TripPage.jsx       # Trip részletek oldal (/trip/:slug)
```

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

1. Másold: `_template.json` → `src/data/trips/[slug].json`
2. Töltsd ki az alapadatokat (slug, title, dates, emoji az ország zászlajával)
3. `people`: a megadott összetétel alapján (pl. "4 felnőtt · 2 gyerek · 2 család")
4. Generálj annyi `days[]` elemet, ahány napra szól az út
5. Minden naphoz: 4-8 schedule item (POI-k, étkezések, opcionálisok)
6. **Költségek (costs) mindig az ÖSSZES utazóra vonatkoznak** — nem fejenként
7. `budget` label-ek: igazítsd a csapat összetételéhez (pl. "Spórolós / 1 pár", "Összesen / 6 fő")
8. Budget összegek: célállomás + létszám alapján becsüld (Nyugat-EU drágább, Balkán olcsóbb)
9. Gyerekek esetén: `badges` mezőben jelöld a GYEREKBARÁT programokat, éttermeknél gyerekmenü tipp
10. Regisztráld a `src/data/trips.js`-ben (import + trips tömbbe)
11. Ellenőrzés: `node -c src/data/trips.js` MINDIG a commit előtt

## Fontos szabályok

- A nyelv MAGYAR — minden szöveg, leírás, guide magyarul
- Linkek: minden POI-hoz kell Google Maps link + Wikipedia/hivatalos oldal link
- Guide: minden látványossághoz kell guide (history, mustSee, funFacts, tips)
- Étkezésekhez: étterem ajánlatok Google ratinggel és címmel
- Linkek ellenőrzése: NE használj bizonytalan URL-eket, Wikipedia mindig működik
- Képek: Wikimedia Commons 960px thumbnail URL-ek (mindig elérhetők)
- Tipográfiai idézőjelek (`„"`) TILOSAK JS stringekben — használj aposztrófot (`'`) vagy escaped quote-ot (`\"`)
- Build ellenőrzés: `node -c src/data/trips.js` szintaxis check MINDIG a commit előtt
