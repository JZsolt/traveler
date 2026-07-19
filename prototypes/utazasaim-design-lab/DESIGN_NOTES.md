# Traveler Design Notes

Aktualis design dontesek a `prototypes/utazasaim-design-lab` statikus prototipushoz.

Ez nem vegleges production spec, hanem a most mukodo vizualis irany rogzitesere szolgalo munkadokumentum.

## Brand es alapirany

- App nev: `Traveler`.
- Nyelv: magyar.
- Cel: mobile-first, premium, meleg, utazas-fokuszu app erzet.
- Kerulendo: generic SaaS dashboard, tul sok gradient, tul sok floating card, tul eros dekoracio.
- Narancs szerepe: primer CTA, AI/aktiv allapot, fontos akcio.
- Sajat vizualis assetek fontosak: landing, auth, dashboard coverek es empty state kep alapozzak meg a karaktert.

## Alap formai szabalyok

- CTA radius: `21px`.
- Kisebb chipek/pillek radiusa aranyosan kisebb, jelenleg kb. `14px`.
- Card radius a trip cardokon: `20px`.
- Feher surface-ek: tiszta feher vagy `rgba(255,255,255,.92)`.
- Input focus glow: narancs, border-ring nelkul:
  - `0 0 28px rgb(255 122 0 / 32%)`
  - `0 0 10px rgb(255 122 0 / 18%)`
- Felesleges belso border/stroke kerulendo, ha a glow vagy shadow eleg.

## Landing

- Hero kep teljes screen alap.
- Logo + `Traveler` bal fent, feher, kb. 35px logo.
- Focim:
  - `Tervezz okosabban.`
  - `Utazz jobban.`
- Focimen nincs eros shadow.
- Leiro kis szovegen lehet nagyobb, puha shadow:
  - `0 2px 30px rgb(0 0 0 / 59%)`
- Csak egy primer CTA:
  - `Utazas tervezese`
- Demo link kisebb, nagyobb gap a CTA alatt.

## Auth

- Hatter: city illustration full screen, felfele tolva.
- Form: alulra igazított glass sheet.
- Felso logo/Traveler resz ezen a screenen nincs.
- Sheet:
  - glass jelleg
  - blur
  - visszafogott shadow: kb. `0 10px 20px`
- Login/register segmented:
  - egyszeru glass/feher aktiv tab
  - nincs gradiens.
- Social gombok kompaktak.
- Input focus megegyezik a design rendszer glow-val.

## Dashboard

### Hatter

- Vilagos, majdnem feher alap.
- Finom mintazat, eros szinezett gradient nelkul.
- Pattern csak erzetet adjon, ne rontsa az input/card kontrasztot.

### Header

- `Szia, Zsolt`
- `Merre tovabb?` kisebb, lagyabb szurke.
- Profil icon sotet, enyhen fekete/graphite tonalitas.

### Search

- Ugyanaz a vizualis nyelv, mint auth input:
  - feher belso
  - finom border
  - puha shadow
  - focusban narancs glow.

### Filterek

- Filter sor visszaallitva.
- Aktualis filterek:
  - `Osszes`
  - `Kovetkezo`
  - `Most`
  - `Folyamatban`
  - `Megosztott`
  - `Lejart`
- Unselected chip:
  - feher, input-szeru
  - finom border/shadow.
- Selected chip:
  - sotet profile-icon tonalitas, nem primer narancs.
- Overflow miatt also padding kell, kulonben a shadow levagodik.

### Trip card

- 2 oszlopos grid.
- Card magassag kb. 196px.
- Border nincs.
- Alul eros sotet scrim, hogy a cim biztosan olvashato legyen.
- Felso sor:
  - bal oldalt datum, ha a trip kesz
  - jobb oldalt relativ allapot: `2 nap mulva`, `1 het mulva`, `Most`, `Lejart`, `In progress`
- `In progress` tripnek nincs datum.
- Jobb oldali status badge-ben nincs dot.
- Varosnev alul centerelve.
- Emoji sor a varosnev felett, kulon spanokkal, kb. 6px gap.
- Varosnev:
  - kb. 18px
  - tort feher / opacity: `rgba(255,250,242,.92)`
- Also idotartam nem kell a cardra.

### Trip card allapotok

- `shared`
  - bal felso, kilogo 25x25 share icon
  - iconon nincs border
  - cardnak nincs lila border
  - lila glow jelzi a megosztott allapotot
  - enyhe lila tint a kepen
- `current / Most`
  - zold glow
- `expired / Lejart`
  - kep B&W/deszaturalt
  - emoji is B&W
- `draft / In progress`
  - nincs datum
  - jobb felul `In progress`
  - ferde csikos overlay:
    - `repeating-linear-gradient(135deg, rgb(255 255 255 / 40%) 0 10px, rgb(255 255 255 / 0%) 10px 20px)`

## Cover image strategia

- Minden tripnek legyen szep default cover.
- Default coverek lehetnek generikus kategoria-alapu illusztraciok.
- User kesobb tud:
  - sajat kepet feltolteni
  - AI assistenssel kepet valasztani
  - Unsplashrol kepet valasztani.
- Javasolt cover model productionben:

```js
cover: {
  type: "default" | "uploaded" | "unsplash" | "ai_generated",
  category: "city_escape",
  url: "...",
  alt: "..."
}
```

## Create Trip Flow

Aktualis lepesek:

1. `Uticel`
2. `Datumok`
3. `Utazok`
4. `Keret`
5. `Stilus`
6. `AI terv`

### Uticel

- `Most nepszeru` 6 javaslat.
- Tile-ok default deszaturalt keppel.
- Selected allapot:
  - kep visszanyeri a szineit
  - enyhe zoom
  - halvany narancs overlay/glow
  - nincs badge, nincs dot, nincs belso border.

### Datumok

- Date inputok ket oszlopban.
- Mobilon a native date input tul szeles lehet, ezert:
  - `minmax(0,1fr)`
  - kisebb gap
  - input `min-width:0`.
- Duration helper ne legyen warning narancs.
- Jelenlegi irany: feher info card, bal oldali teal ikon-token.

### Utazok

- Party chipek + adults/children stepper.
- Stepper gombok kartyas/feher feluletu kis controlok.

### Keret

- Harom tier nem ikon-card, hanem segmented control:
  - `Okos`
  - `Kenyelmes`
  - `Premium`
- Segment stilus hasonlo az auth login/register controlhoz:
  - feher hatter
  - border nelkul
  - enyhe shadow
  - aktiv elem feher, finom shadow.
- Osszeg a fo fokusz.
- Osszeg kezzel editalhato:
  - tizedes engedett
  - max 2 tizedes
  - pl. `999.99`
- Slider marad, de nincs kulon cardba zarva.

### Stilus

- Ne legyen random chip-felho.
- 2 oszlopos rendezett grid.
- Default feher opcio.
- Selected sotet, tiszta allapot.
- Focus state ne legyen browser-kek.

### AI terv

- Ez a lepes a letrehozas elott van.
- Cel: a beallitott adatok alapjan az AI elokesziti a trip template-et.
- Nem success screen chatbox.
- Jelenlegi irany: AI briefing panel:
  - header
  - osszefoglalo sorok
  - extra keres textarea.

### Siker / generalas overlay

- Emoji nem kell.
- Ne csak statikus `Utazas letrehozva` legyen.
- AI-generalis allapot:
  - `Utiterv generalasa`
  - AI/spark icon
  - generasi status card
  - progress line
  - CTA: `Ugras az utakhoz`

## Assetek

Aktualis fontos assetek:

- `assets/coastal-hero.png` - landing hero
- `assets/auth-city-bg.png` - auth background
- `assets/empty-trip-illustration-transparent.png` - dashboard empty state
- `assets/utazasaim-logo.svg` - logo/favicon
- `assets/categories/city-escape.png`
- `assets/categories/beach-relax.png`
- `assets/categories/road-trip.png`
- `assets/categories/nature-adventure.png`
- `assets/categories/explore-freely.png`
- `assets/categories/surprise-me.png`

## Nyitott kerdesek

- Trip detail screen vizualis nyelve.
- Day timeline komponens.
- In-progress trip reszletezo allapot.
- Profile/settings screen.
- Design system oldal frissitese a mostani komponensekkel.
- Production React komponens bontas es token nevadas.
