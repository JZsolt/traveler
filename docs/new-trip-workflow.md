# Új utazás létrehozásának workflow-ja

## Áttekintés

Egy új utazás 5 fázisban készül el. Az 1. fázis interaktív (brainstorming a userrel),
a 2-5. fázis párhuzamosítható sub-agentekkel.

## Fázisok

### 1. Brainstorming (BMAD) — interaktív, a userrel

Használd a `/bmad-brainstorming` skill-t. Tisztázandó kérdések:
- Úticél(ok) és dátumok
- Kik mennek (létszám, gyerekek kora)
- Büdzsé keret
- Szállás (van már? ha igen, cím)
- Repjegy (van már? reptér, időpontok)
- Érdeklődés: kultúra, gasztro, természet, gyerekprogram, nightlife?
- Tempó: laza vs tömött napok
- Speciális igények (allergia, kerekesszék, stb.)

Kimenet: egy rövid összefoglaló MD ami a többi fázis inputja.

### 2. Útiterv összeállítás — tervező agent

Input: brainstorming összefoglaló
Feladat:
- Napi bontás (melyik nap hova)
- Menetrend időpontokkal (reggeli, látnivalók, ebéd, pihenő, vacsora)
- Közlekedés megtervezése (reptér↔szállás, városok közötti, helyi)
- Google Maps transport linkek generálása
- Költségbecslés naponta és összesítve
- Overview tábla

Kimenet: a trip objektum váza (slug, title, overview, days[].schedule alapadatok, costs)

### 3. POI kutatás — research agent (PÁRHUZAMOSÍTHATÓ)

Input: a tervező agent által kijelölt POI lista
Feladat MINDEN látványossághoz:
- `guide.history`: 2-4 történelmi/háttér tény
- `guide.mustSee`: 2-4 must-see dolog
- `guide.funFacts`: 2-3 érdekesség
- `guide.tips`: 2-3 praktikus tipp
- `links`: Google Maps + Wikipedia (magyar ha van, angol ha nincs)
- `badges`: INGYENES / GYEREKBARÁT ha releváns
- `images`: 3 Wikimedia Commons kép naponta (960px thumb URL)

Kimenet: guide objektumok minden schedule itemhez

### 4. Étterem & gasztro kutatás — restaurant agent (PÁRHUZAMOSÍTHATÓ)

Input: a városok/negyedek listája + étkezési időpontok
Feladat MINDEN étkezéshez:
- 3-4 étterem ajánlat (név, cím, Google rating, rövid jellemzés)
- Helyi specialitások leírása
- Gyerekbarát opciók
- Árkategória (~€X-Y/fő)
- Tippek (hol NE egyetek, turista csapdák)

Kimenet: guide objektumok az étkezési schedule itemekhez

### 5. Validálás & összeszerelés — validator agent

Input: a teljes trip objektum
Feladatok:
- `node -c src/data/trips.js` szintaxis ellenőrzés
- Tipográfiai idézőjelek keresése és javítása (`„"` → `'`)
- Linkek formátum ellenőrzése (maps.google.com, wikipedia.org)
- Minden POI-nak van-e guide + links
- Minden napnak van-e costs tábla
- overview tábla egyezik-e a days-szel
- Budget számítás konzisztencia
- Build teszt: `npm run build`

## Párhuzamosítás

A 3. és 4. fázis PÁRHUZAMOSAN futtatható sub-agentekkel:

```
Fázis 2 (terv) → kész
                ├── Fázis 3a: POI kutatás Nap 1-2 (sub-agent)
                ├── Fázis 3b: POI kutatás Nap 3-4 (sub-agent)
                ├── Fázis 4a: Éttermek város 1 (sub-agent)
                └── Fázis 4b: Éttermek város 2 (sub-agent)
                         ↓ mind kész
                    Fázis 5: összeszerelés + validálás
```

## Gyors indítás

Ha a user azt mondja: "tervezzünk egy új utazást [város]":

1. Kérdezd meg a hiányzó alapinfókat (dátum, kik, szállás, repjegy)
2. Olvasd be a `docs/trip-data-schema.md`-t a pontos struktúráért
3. Indítsd el a tervező fázist
4. A POI és étterem kutatást indítsd párhuzamos sub-agentekkel
5. Szeresd össze, validáld, commitold
