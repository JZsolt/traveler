# Utazasaim Design Lab

Statikus design system prototipus az Utazasaim app kovetkezo UI iranyahoz.

## Cel

- A mobil-first utazastervezo felulet vizualis nyelvenek gyors kiprobalasa.
- Tokenek, komponensmintak es teljes kepernyok osszekotese egy attekintheto labban.
- Jo mintak kesobbi atemelese a React + Tailwind + shadcn/ui appba.

## Fajlok

- `index.html` - design lab attekinto es screen gallery.
- `design-system.html` - tokenek, komponensek, allapotok es trip-specifikus mintak.
- `DESIGN_NOTES.md` - aktualis vizualis dontesek, screen allapotok es komponensiranyok.
- `ROADMAP.md` - screen-first fejlesztesi sorrend es atemelesi szabalyok.
- `landing.html`, `login.html`, `dashboard.html`, `create-trip.html` - interaktiv mobil screen prototipusok.
- `css/app.css` - kozos tokenek es statikus prototipus komponensek.
- `assets/coastal-hero.png` - hero kep a landing screenhez.
- `assets/utazasaim-logo.svg` - hatter nelkuli vektor logo es favicon.
- `assets/utazasaim-logo.png` - raszteres referencia logo.

## Hasznalat

Nyisd meg bongeszoben:

```bash
open prototypes/utazasaim-design-lab/index.html
```

Vagy indits egyszeru statikus szervert a repo gyokerebol:

```bash
python3 -m http.server 4173
```

Ezutan:

```text
http://localhost:4173/prototypes/utazasaim-design-lab/
```

## Fejlesztesi szabaly

Ez a mappa prototipus. Ha egy minta bekerul a production appba, ott mar a projekt szabalyai ervenyesek:

- React komponens `src/components/` alatt.
- Ujrahasznalhato logika `src/hooks/` vagy `src/lib/` alatt.
- Tokenek es konstansok ne legyenek JSX-ben hardcode-olva.
- A magyar termekszoveg legyen az alap.
