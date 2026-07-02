# 09 — AI napok újratervezése / átrendezése

## Cél

Az utazás napjainak AI-alapú optimalizálása és átrendezése. A user egy gombnyomással kérheti, hogy az AI nézze át az összes napot és javasoljon jobb sorrendet vagy elosztást.

## Motiváció

Jelenleg a napok kézi sorrendben vannak. Ha a user hozzáad/töröl/módosít napokat, előfordulhat, hogy a sorrend nem optimális (pl. földrajzilag távol eső helyszínek vannak egymás után, vagy egy nap túl zsúfolt, másik túl laza).

## Funkciók

### 9.1 — AI Day Reorder Endpoint

- Új endpoint: `api/reorder-trip-days.js`
- Input: teljes trip (title, days, destination, people, startDate, endDate) + opcionális instrukció
- Az AI elemzi:
  - Földrajzi közelség (schedule item-ek helyszínei)
  - Napi terhelés kiegyensúlyozottság (programok száma/időtartama)
  - Logikai sorrend (érkezés → városnézés → kirándulás → hazaút)
  - Nyitvatartási idők, heti napok (pl. múzeum hétfőn zárva)
- Output: `{ days: [...], summary: "Magyar összefoglaló a változtatásokról" }`
- A days tömb az átrendezett/újraelosztott napokat tartalmazza
- Standard AI error kezelés (429, token limit, invalid JSON)

### 9.2 — AI Day Reorder UI

- TripPage-en vagy TripOverview-ban "AI napok optimalizálása" gomb
- Opcionális instrukció mező (pl. "a múzeumos napot tedd előbbre", "lazább tempó")
- Preview: a javasolt nap sorrend összefoglalóval
  - Mi változott: mely napok cserélődtek, mely programok mozogtak
- Apply: felülírja az összes napot egyszerre (egy save)
- Discard: eldobja
- NEM auto-save

### 9.3 — Megőrzendő szabályok

- Unknown mezők megőrzése (images, tickets, alerts, stb.)
- dayNum normalizálás (1..N) az átrendezés után
- A schedule item-ek guide/links/transport/badges adatai megmaradnak
- AI hibák UI-ban magyar szöveggel

## Technikai megjegyzések

- Az expand-day.js mintáját követheti (Gemini hívás, JSON parse, validáció)
- A prompt-ban a teljes trip-et kell küldeni (minden nap schedule-jával)
- Token limit: nagy trip-eknél a prompt hosszú lehet — fontolóra veendő a napok tömörítése a prompt-ban
- A response a teljes days tömb, nem diff — egyszerűbb implementálni és review-olni

## Előfeltétel

- Phase 08 teljes (inline editor + AI szekció javaslatok) ✅
