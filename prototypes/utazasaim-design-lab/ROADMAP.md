# Utazasaim Design Lab Roadmap

## Alapelv

Eloszor screeneken dolgozunk plain HTML/CSS-ben, mert itt gyorsabb es olcsobb az iteracio. A design systemet nem elore kitalaljuk, hanem a jo screen mintakbol fejtjuk vissza. React/shadcn komponens csak akkor keszul, amikor a minta mar bizonyitott.

## Celirany

A production app vizualis iranya: calm, premium digital travel journal.

Legyen:

- mobil-first
- magyar nyelvu
- eros tipografia
- tagolt, olvashato itinerary
- timeline-alapu napi program
- keves szin, keves arnyek
- narancs csak primer CTA / AI / fontos akcio
- Lucide-szeru ikonrendszer

Keruljuk:

- tul sok gradientet
- tul sok kartyat
- minden elem beboxolasat
- tul sok akcentusszint
- emoji ikonrendszert production mintakban
- generikus SaaS/dashboard erzetet

## Munkamenet

1. Screen prototipus
   - Egy teljes hasznalati helyzetet tervezunk meg.
   - Plain HTML/CSS, minimal JS.
   - Gyorsan lehet torolni, atirni, ujrarendezni.

2. Screen review
   - Mi mukodik?
   - Mi tul zajos?
   - Mi lesz ujrahasznalhato?
   - Melyik elem valodi komponens, es melyik csak screen-specifikus layout?

3. Design system visszafejtes
   - Tokenek pontositas.
   - Komponensvariansok tisztitasa.
   - Allapotok es edge case-ek felvetele.

4. Production atemeles
   - React komponens `src/components/` vagy `src/components/ui/` alatt.
   - Logika hookba vagy `src/lib/` helperbe.
   - Hardcoded szoveg/route/token ne maradjon komponensben.
   - shadcn/ui testreszabas, ahol mar van megfelelo primitive.

## Screen backlog

### 1. Foundation

- `design-system.html` - tokenek, tipografia, alapelemek, trip mintak
- `index.html` - screen gallery es prototipus navigacio

### 2. Onboarding es auth

- `landing.html` - elso benyomas, primer CTA
- `login.html` - belepes/regisztracio
- `forgot-password.html` - jelszo visszaallitas

### 3. Utazas lista

- `dashboard.html` - sajat utak
- `empty-dashboard.html` vagy query state - elso utazas nelkuli allapot
- `settings.html` - profil, admin/dev kapcsolok, backup/import kiindulopont

### 4. Utazas reszletek

- `trip-detail.html` - hero, datumok, emberek, budget, napok attekintese
- `day-detail.html` - napi itinerary timeline
- `schedule-item.html` vagy beagyazott minta - POI, etterem, kozlekedes, jegy, guide

### 5. Letrehozas es szerkesztes

- `create-trip.html` - brief/wizard
- `create-trip-chat.html` - AI brief pontositas
- `edit-trip.html` - trip meta es sections szerkesztese
- `ai-editor.html` - itinerary javaslat, preview, apply/discard

### 6. Offline es adatallapotok

- `offline.html` - offline read-only allapot
- `sync-conflict.html` - mentett/remote adat elteres
- `import-backup.html` - backup import flow
- `error-state.html` - recoverable hibak

## Elso konkret kor

1. Magyaritsuk a meglovo screeneket.
2. Tisztitsuk a vizualis nyelvet a `VISUAL_LANGUAGE.md` szerint.
3. Keszitsuk el a `trip-detail.html` screent.
4. Keszitsuk el a `day-detail.html` timeline screent.
5. Frissitsuk a `design-system.html`-t a screenekbol visszafejtett elemekkel.

## Dontesi pontok

- A primer szin marad-e #FF7A00, vagy tompitottabb token kell?
- A telefonkeret csak prezentaciohoz kell, vagy screenenkent is marad?
- A production app inkabb bottom navot kap, vagy jelenlegi header/navigation marad?
- A trip detail hero kepes legyen, vagy editorial tipografiai hero?
- AI funkciok kapjanak-e kulon vizualis stilust, vagy csak akcio badge-et?
