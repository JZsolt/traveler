# Az Utazásaim — Utazástervező PWA

## Projekt

React + Vite + Tailwind CSS + shadcn/ui utazástervező app.
Magyar nyelvű, mobile-first, PWA offline támogatással.
Deploy: Vercel. Repo: github.com:JZsolt/traveler.git

## Fejlesztés

```bash
npm run dev          # dev szerver (localhost:5173)
npx vite --host      # dev szerver hálózatról is elérhető (mobil teszteléshez)
npm run build        # production build → dist/
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

## Új utazás hozzáadása

1. A `src/data/trips.js` fájlban a `trips` tömbbe adj hozzá egy új objektumot
2. Kövesd a lenti adatstruktúrát (vagy nézd meg a meglévő brüsszeli tripet mintának)
3. A főoldal és a routing automatikusan működik — nem kell komponenst írni
4. Az adatstruktúra leírása: `docs/trip-data-schema.md`

## Fontos szabályok

- A nyelv MAGYAR — minden szöveg, leírás, guide magyarul
- Linkek: minden POI-hoz kell Google Maps link + Wikipedia/hivatalos oldal link
- Guide: minden látványossághoz kell guide (history, mustSee, funFacts, tips)
- Étkezésekhez: étterem ajánlatok Google ratinggel és címmel
- Linkek ellenőrzése: NE használj bizonytalan URL-eket, Wikipedia mindig működik
- Képek: Wikimedia Commons 960px thumbnail URL-ek (mindig elérhetők)
- Tipográfiai idézőjelek (`„"`) TILOSAK JS stringekben — használj aposztrófot (`'`) vagy escaped quote-ot (`\"`)
- Build ellenőrzés: `node -c src/data/trips.js` szintaxis check MINDIG a commit előtt
