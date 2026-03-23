# Trip adatstruktúra séma

Minden utazás egy objektum a `src/data/trips.js` `trips` tömbben.

## Teljes séma

```js
{
  // === ALAPADATOK ===
  slug: "roma-2026",                          // URL-ben használt azonosító (ékezet nélkül, kötőjellel)
  title: "Róma · Vatikán · Tivoli",           // Megjelenő cím (városok · elválasztóval)
  subtitle: "2026. október 15–19.",            // Dátum szövegesen
  emoji: "🇮🇹 🏛 ⛪",                          // Zászlók + tematikus emojik
  startDate: "2026-10-15",                     // ISO dátum (rendezéshez, státuszhoz)
  endDate: "2026-10-19",                       // ISO dátum
  people: "5 fő · 2 házaspár + 1 kislány",    // Résztvevők
  highlights: ["Colosseum", "Vatikán", "..."], // Főoldali kártya tag-ek (5-6 max)

  // === SZÁLLÁS ===
  accommodation: {
    address: "Via del Corso 15, Roma 00186",
    mapUrl: "https://maps.google.com/?q=Via+del+Corso+15+Roma"
  },

  // === REPÜLŐ ===
  flight: {
    airport: "Fiumicino (FCO)",
    arrival: "10:30",
    departure: "18:00"
  },

  // === BÜDZSÉ ===
  budget: {
    lowPerFamily: "~€500",         // Spórolós verzió 1 családra
    comfortPerFamily: "~€800",     // Komfort verzió 1 családra
    lowTotal: "~€1000",            // Spórolós az 5 főre összesen
    comfortTotal: "~€1600"         // Komfort az 5 főre összesen
  },

  // === SÜRGŐS FOGLALÁSOK ===
  urgentBookings: [
    {
      name: "Vatikáni Múzeum",
      reason: "jegyek hetekre előre elfogynak",
      url: "https://..."
    }
  ],

  // === HASZNOS LINKEK ===
  usefulLinks: [
    {
      emoji: "🏛",
      name: "Colosseum",
      desc: "Jegyvásárlás + időpont foglalás",
      url: "https://..."
    }
  ],

  // === CSOMAGOLÁS ===
  packingList: [
    "Kényelmes cipő (napi 15-20 ezer lépés!)",
    "Napvédő krém + kalap (október is meleg!)"
  ],

  // === SPÓROLÁSI TIPPEK ===
  savingTips: [
    { tip: "🚇 Roma Pass: 48h korlátlan metró + 2 múzeum", saving: "~€30-50" }
  ],

  // === PRAKTIKUS INFÓK (összecsukható szekciók) ===
  practicalInfo: [
    {
      title: "💳 Fizetés & pénz",
      items: [
        "Kártyát szinte mindenhol elfogadják",
        "Borravaló: 10% szokásos étteremben"
      ]
    }
  ],

  // === FOGLALÁSI CHECKLIST ===
  bookingChecklist: [
    { item: "Vatikáni Múzeum jegy", url: "https://..." },
    { item: "Szállás check-in idő egyeztetés" }    // url opcionális
  ],

  // === NAPI ÁTTEKINTÉS ===
  overview: [
    { day: 1, date: "Okt. 15 (sze)", program: "🏛 Róma", highlights: "Colosseum, Forum, Palatinus" }
  ],

  // === NAPOK RÉSZLETESEN ===
  days: [
    {
      dayNum: 1,
      title: "Róma — Ókori emlékek",
      subtitle: "Október 15. szerda — Érkezés + városnézés",

      // Képek (opcionális, max 3, Wikimedia 960px thumb URL)
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/.../960px-....jpg",
          caption: "Colosseum — Róma szíve"
        }
      ],

      // Figyelmeztetések (opcionális)
      alerts: [
        { type: "tip",     text: "🚇 Roma Pass ajánlott!" },       // zöld
        { type: "warning", text: "⚡ Hosszú nap, korán keljetek!" }, // narancs
        { type: "urgent",  text: "🔴 Jegyet MOST foglald!" }        // piros
      ],

      // Közlekedési opciók tábla (opcionális, max 1 per nap)
      transportOptions: {
        title: "Közlekedési opciók repülőtér ↔ belváros",
        options: [
          {
            name: "🚄 Leonardo Express",
            time: "~32 perc",
            pricePerPerson: "€14",
            total: "~€56",
            url: "https://...",
            recommended: true          // sárga háttér
          }
        ]
      },

      // === MENETREND (a nap fő tartalma) ===
      schedule: [
        {
          time: "10:30",               // időpont (relatív, szöveges)
          title: "🏛 Colosseum",       // cím emoji-val
          desc: "A világ leghíresebb amfiteátruma...", // rövid leírás

          // Opcionális mezők:
          highlight: true,             // sárga kiemelés (fontos programok, étkezések)
          optional: true,              // "(opcionális)" felirat
          badges: ["INGYENES", "GYEREKBARÁT"],  // zöld / narancs badge a cím mellett

          // Linkek (térkép + külső referencia)
          links: [
            { label: "📍 Térkép", url: "https://maps.google.com/?q=Colosseum+Rome" },
            { label: "Magyar Wiki", url: "https://hu.wikipedia.org/wiki/Colosseum" }
          ],

          // Közlekedési pill-ek (a lokáció alatt jelennek meg)
          transport: [
            { type: "transit", label: "🚇 Metro B · ~5 perc → Colosseo", url: "https://www.google.com/maps/dir/..." },
            { type: "walk",    label: "🚶 ~10 perc · séta",              url: "https://www.google.com/maps/dir/..." }
          ],

          // === GUIDE INFO (összecsukható részletek) ===
          guide: {
            history: [                 // Történelem & háttér
              "80-ban építtette Vespasianus császár...",
              "50.000 néző fért bele..."
            ],
            mustSee: [                 // Ezt nézd meg!
              "Az aréna padlószintje — innen látni a föld alatti folyosókat",
              "A 3. szint kilátója — panoráma a Forum-ra"
            ],
            funFacts: [                // Érdekességek
              "A 'kenyeret és cirkuszt' mondás innen ered",
              "Eredetileg vízzel töltötték fel tengeri csatákat szimulálva"
            ],
            tips: [                    // Praktikus tippek
              "Reggel 8:30-kor nyit — a sor 9:30 után 1+ óra",
              "A Roma Pass-szal skip-the-line belépő jár"
            ]
          }
        }
      ],

      // Napi költségtábla
      costs: [
        { item: "Colosseum + Forum kombi jegy (4 felnőtt)", cost: "~€64" },
        { item: "Étkezés (ebéd + vacsora)", cost: "~€100–140" },
        { item: "Nap 1 összesen", cost: "~€200–280", total: true }  // total: true = kiemelt sor
      ],

      // Nap végi figyelmeztetések (opcionális)
      endAlerts: [
        { type: "urgent", text: "🔴 Holnap Vatikán — jegyet MOST foglald!", url: "https://..." }
      ]
    }
  ]
}
```

## Szabályok és tippek az agent számára

### Nyelv
- MINDEN szöveg magyarul
- Személyes hangnem, tegezés, gyakorlatias tippek

### Linkek
- Minden POI-hoz KELL: `📍 Térkép` (Google Maps) + külső link (Wikipedia vagy hivatalos oldal)
- Wikipedia linkek mindig működnek — ha bizonytalan, használd azt
- Magyar Wikipedia (`hu.wikipedia.org`) ha létezik az oldal, különben angol
- Google Maps link formátum: `https://maps.google.com/?q=Helynev+Varos`
- Transport link formátum: `https://www.google.com/maps/dir/Honnan/Hova`
- NE használj bizonytalan turisztikai oldalakat (visitbruges.be, iamsterdam.com stb.) — ezek változnak

### Guide info
- Minden látványossághoz KELL guide (history, mustSee, funFacts, tips)
- Étkezésekhez: mustSee = étterem ajánlatok (név, cím, Google rating★), tips = praktikus tippek
- 2-4 pont szekciónként, nem kell mindegyik szekció minden itemhez
- A szövegben NE használj tipográfiai idézőjeleket (`„"`) — csak aposztrófot (`'`)

### Képek
- Wikimedia Commons thumb URL: `https://upload.wikimedia.org/wikipedia/commons/thumb/.../960px-...`
- 3 kép per nap maximum
- `loading="lazy"` automatikus a komponensben

### Költségek
- Mindig az ÖSSZES résztvevőre (5 fő) vonatkoznak
- `total: true` flag az összesítő sorra

### Szintaxis
- `node -c src/data/trips.js` futtatás KÖTELEZŐ commit előtt
- Tipográfiai idézőjelek (`„"`) TILOSAK — build hibát okoznak
- Az `\"` escape-elt idézőjelet is kerüld — használj `'`-t helyette
