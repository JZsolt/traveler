export const trips = [
  {
    slug: 'brusszel-2026',
    title: 'Brüsszel · Hollandia · Bruges · Gent',
    subtitle: '2026. április 8–12.',
    emoji: '🇧🇪 🌷 🇳🇱',
    startDate: '2026-04-08',
    endDate: '2026-04-12',
    people: '5 fő · 2 házaspár + 1 kislány',
    highlights: ['Grand-Place', 'Keukenhof', 'Van Gogh', 'Bruges', 'Gent'],
    accommodation: {
      address: 'Rue De Pascale 15, Brussels 1040',
      mapUrl: 'https://maps.google.com/?q=Rue+De+Pascale+15+Brussels+1040',
      host: 'Mohamed',
      gateCode: '🔑7180',
      doorCode: '180925🔔',
      wifi: { name: 'pascale15', password: 'Pascale15' },
      videos: [
        { label: 'Bejutás a szállásra', url: 'https://youtube.com/shorts/wAS9Jy-zs1U' },
        { label: 'Parkolás', url: 'https://youtube.com/shorts/zB-4Pvdvt70' },
      ],
    },
    flight: {
      airport: 'Charleroi (CRL)',
      arrival: '06:10',
      departure: '08:30',
    },
    budget: {
      lowPerFamily: '~€629',
      comfortPerFamily: '~€964',
      lowTotal: '~€1258',
      comfortTotal: '~€1927',
    },
    urgentBookings: [
      {
        name: 'Van Gogh Muzeum',
        reason: 'MEGVAN ✅',
        done: true,
        url: 'https://www.vangoghmuseum.nl/en/visit/tickets',
      },
      {
        name: 'Eurostar/FlixBus Amszterdam',
        reason: 'MEGVAN ✅',
        done: true,
        urls: [
          { label: 'eurostar.com', url: 'https://www.eurostar.com' },
          { label: 'flixbus.com', url: 'https://www.flixbus.com' },
        ],
      },
      {
        name: 'Keukenhof',
        reason: 'MEGVAN ✅',
        done: true,
        url: 'https://www.keukenhof.nl',
      },
    ],
    usefulLinks: [
      {
        emoji: '🎨',
        name: 'Van Gogh Múzeum',
        desc: 'Jegyek MEGVANNAK · ápr. 10. · 17:15',
        url: 'https://www.vangoghmuseum.nl/en/visit/tickets',
      },
      {
        emoji: '🌷',
        name: 'Keukenhof',
        desc: 'Tulipánpark jegyek + kombi busz',
        url: 'https://www.keukenhof.nl',
      },
      {
        emoji: '🚄',
        name: 'Eurostar',
        desc: 'Brüsszel↔Amszterdam gyorsvonat',
        url: 'https://www.eurostar.com',
      },
      {
        emoji: '🚌',
        name: 'FlixBus',
        desc: 'Brüsszel↔Amszterdam budget busz',
        url: 'https://www.flixbus.com',
      },
      {
        emoji: '🚂',
        name: 'SNCB / Belgian Train',
        desc: 'Belga vonatok — Bruges, Gent',
        url: 'https://www.belgiantrain.be',
      },
      {
        emoji: '✈️',
        name: 'FLIBCO',
        desc: 'Charleroi reptér ↔ Brüsszel busz',
        url: 'https://www.flibco.com',
      },
      {
        emoji: '🚇',
        name: 'STIB-MIVB',
        desc: 'Brüsszeli metró, villamos, busz',
        url: 'https://www.stib-mivb.be',
      },
      {
        emoji: '🇳🇱',
        name: 'NS International',
        desc: 'Holland vonatok, nemzetközi jegyek',
        url: 'https://www.nsinternational.com',
      },
    ],
    packingList: [
      'Kényelmes cipő (napi 15-20 ezer lépés!)',
      'Esőkabát / esernyő (Belgium + Hollandia = bármikor eshet)',
      'Powerbank (fotók, Google Maps egész nap)',
      'Hátizsák (poggyászt a szálláson hagyjátok)',
      'Meleg réteg (április — jellemzően 8-16°C)',
      'Kényelmes cipő/talpbetét a kislánynak (sok séta!)',
    ],
    savingTips: [
      { tip: '🚂 Belga vonat: 12 év alatti gyerek INGYENES', saving: '~€50-70' },
      { tip: '💰 Hétvégi vonatjegy (szo-vas): 50% kedvezmény', saving: '~€35' },
      { tip: '🎨 Van Gogh Múzeum: 18 év alatt INGYENES', saving: '€25' },
      { tip: '🚌 FlixBus vs Eurostar Amszterdamba', saving: '~€100-200' },
      { tip: '🏛 Ingyenes: Grand-Place, parkok, Graslei, Begijnhof', saving: 'Sokat!' },
      { tip: '🍟 Street food > étterem (frituurok, piacok)', saving: '~€50-100' },
      { tip: '🌷 Keukenhof kombi jegy (belépő + busz)', saving: '~€15-20' },
      { tip: '💧 Csapvíz — kiváló mindkét országban', saving: '~€20-30' },
    ],
    practicalInfo: [
      {
        title: '📱 Közlekedési appok — töltsd le előre!',
        items: [
          'STIB-MIVB — brüsszeli metró/busz/villamos: menetrend, jegyvásárlás',
          'SNCB/NMBS — belga vonatok: menetrend, jegyvásárlás (Bruges, Gent)',
          '9292 — holland közlekedés: busz, vonat, metró Amszterdamban',
          'Google Maps — offline térkép: töltsd le Belgium + Hollandia térképét WiFi-n!',
          'Flibco — Charleroi reptér busz: jegy + menetrend',
        ],
      },
      {
        title: '💳 Fizetés & pénz',
        items: [
          'Mindenhol elfogadják a kártyát (Visa/Mastercard) — még az utcai standokon is általában',
          'Készpénz: ~€50-100 érdemes vinni apróra (WC, kisebb piacok, borravalónak)',
          'Borravaló: NEM kötelező Belgiumban és Hollandiában — a számla tartalmazza a szervízdíjat',
          'Ha adtok, kerekítsetek fel (~5-10%) — ez elegáns gesztus, de senki nem várja el',
          "ATM (bancomat): mindenhol van, de kerüljétek a 'Euronet' automatákat (magas jutalék)",
        ],
      },
      {
        title: '🗣 Nyelv — pár hasznos szó',
        items: [
          "Brüsszel francia nyelvű (de mindenki tud angolul): Bonjour, Merci, S'il vous plaît, L'addition (számla)",
          'Bruges & Gent flamand (holland) nyelvű: Hallo, Dank u, Alstublieft, De rekening',
          'Amszterdam: szinte mindenki beszél angolul — a hollandok Európa legjobb angoltudásúak',
          'A belga vonatjegy-automaták angolra állíthatók — ne ijedjetek meg a francia/holland felülettől',
        ],
      },
      {
        title: '📶 Mobilnet & WiFi',
        items: [
          'EU roaming: a magyar előfizetésetekkel díjmentesen netezhettek — ellenőrizzétek az adatkeretetek!',
          'Ingyenes WiFi: szinte minden kávézóban, étteremben, és a főbb tereken (Grand-Place, Markt)',
          'Offline térkép: Google Maps-ben töltsétek le Belgium és Hollandia térképét — ez a legfontosabb!',
        ],
      },
      {
        title: '🌦 Időjárás — áprilisi',
        items: [
          'Átlaghőmérséklet: 7-14°C — rétegesen öltözzetek (reggel hideg, délután kellemes)',
          'Eső: Belgium és Hollandia = bármikor eshet, rövid záporok gyakoriak — esőkabát KÖTELEZŐ',
          'Napfény: ~13 óra nappal, sötétedés ~20:30 körül — hosszú napok, jó fotóidő',
          'Szél: Bruges és a holland tengerpart szeles — vékony széldzseki jól jön',
        ],
      },
      {
        title: '🚰 Víz & WC',
        items: [
          'Csapvíz kiváló minőségű mindkét országban — nyugodtan igyatok csapvizet (és spóroltok)',
          "Étteremben kérjetek 'eau du robinet' / 'kraanwater' (csapvíz) — ingyenes, de nem mindig adják szívesen",
          'Nyilvános WC: általában €0.50 — legyen mindig apró nálatok',
          'Múzeumok, éttermek WC-je ingyenes — használjátok ki',
        ],
      },
      {
        title: '👧 Gyerekkel utazás',
        items: [
          'Belga vonat: 12 év alatti gyerek INGYENES (felnőtt kísérővel) — nem kell jegy!',
          'Legtöbb múzeum 18 év alattiaknak kedvezményes vagy ingyenes',
          'Bugaboo/babakocsi: Bruges és Gent macskakövesek — kényelmes cipő jobb, mint babakocsi',
          'Játszóterek: Cinquantenaire park (Nap 1), Vondelpark (Nap 2), Minnewater (Nap 3)',
          'Gyerekmenü: szinte mindenhol van — nuggets, pasta, croque-monsieur (melegszendvics)',
          'Ha elfárad: a szálláson délután 15-17h pihenő beiktatva minden nap',
        ],
      },
      {
        title: '🆘 Vészhelyzet',
        items: [
          'Európai segélyhívó: 112 (rendőrség, mentő, tűzoltó — mindenhol működik)',
          'Magyar konzulátus Brüsszel: Rue de Trèves 92, +32 2 792 1100',
          'Gyógyszertár (pharmacie/apotheek): a szállás közelében Multipharma (Rue de Namur 48) — hétköznap 9-19h',
          "Kórház: Cliniques de l'Europe - St-Michel (10 perc a szállástól) — sürgősségi",
          'Európai Egészségbiztosítási Kártya (EHIC/EEKK): VIGYÉTEK MAGATOKKAL — ingyenes ellátás az EU-ban',
        ],
      },
    ],
    bookingChecklist: [
      {
        item: 'Van Gogh Múzeum jegy — MEGVAN ✅ · ápr. 10. 17:15 slot',
        url: 'https://www.vangoghmuseum.nl/en/visit/tickets',
      },
      {
        item: 'Eurostar VAGY FlixBus Brüsszel↔Amszterdam — MEGVAN ✅',
        done: true,
        url: 'https://www.eurostar.com',
      },
      { item: 'Keukenhof jegy (kombi busszal) — MEGVAN ✅', done: true, url: 'https://www.keukenhof.nl' },
      { item: 'FLIBCO busz CRL↔Brüsszel (oda + vissza)', url: 'https://www.flibco.com' },
      { item: 'Szállás check-in idő egyeztetés (korai érkezés ápr. 8!)' },
    ],
    overview: [
      {
        day: 1,
        date: 'Ápr. 8 (sze)',
        program: '🏛 Brüsszel',
        highlights: 'Grand-Place, Manneken Pis, Sablon, gofri, (Atomium)',
      },
      {
        day: 2,
        date: 'Ápr. 9 (csü)',
        program: '🏰 Bruges',
        highlights: 'Csatornák, csónaktúra, csokoládé, Begijnhof',
      },
      {
        day: 3,
        date: 'Ápr. 10 (pé)',
        program: '🌷 Hollandia',
        highlights: 'Keukenhof tulipánpark, Van Gogh Múzeum, Amszterdam',
      },
      {
        day: 4,
        date: 'Ápr. 11 (szo)',
        program: '⚔️ Gent',
        highlights: 'Gravensteen vár, Graslei, Waterzooi, graffiti utca',
      },
      {
        day: 5,
        date: 'Ápr. 12 (vas)',
        program: '✈️ Hazaút',
        highlights: 'Hajnali transzfer → CRL',
      },
    ],
    days: [
      {
        dayNum: 1,
        title: 'Brüsszel',
        subtitle: 'Április 8. szerda — Érkezés + városnézés',
        images: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bruxelles_Grand_Place.JPG/960px-Bruxelles_Grand_Place.JPG',
            caption: 'Grand-Place — Brüsszel szíve',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Atomium_Br%C3%BCssel.JPG/960px-Atomium_Br%C3%BCssel.JPG',
            caption: 'Atomium',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Manneken_Pis_Brussel.jpg/960px-Manneken_Pis_Brussel.jpg',
            caption: 'Manneken Pis',
          },
        ],
        schedule: [
          {
            time: '06:10',
            title: '✈️ Érkezés Charleroi (CRL)',
            desc: 'Poggyász átvétel, frissítés. Charleroi egy kis reptér, gyorsan kijuttok.',
          },
          {
            time: '06:45',
            title: '🚌 FLIBCO busz → Szállás',
            desc: 'A FLIBCO shuttle közvetlenül a terminálból indul, félóránként. Jegyet előre érdemes venni. Brussels-Midi-nél szálltok le, onnan metro a szállásig.',
            highlight: true,
            links: [
              { label: 'flibco.com', url: 'https://www.flibco.com' },
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Rue+De+Pascale+15+Brussels+1040',
              },
            ],
            transport: [
              {
                type: 'transit',
                label: '🚌 FLIBCO · ~50 perc → Brussels-Midi',
                url: 'https://www.google.com/maps/dir/Brussels+South+Charleroi+Airport/Brussels-Midi+Station',
              },
              {
                type: 'transit',
                label: '🚇 Metro M2/M6 · ~10 perc → Trône',
                url: 'https://www.google.com/maps/dir/Brussels-Midi+Station/Trône+metro+station+Brussels',
              },
              {
                type: 'walk',
                label: '🚶 ~3 perc → Rue De Pascale 15',
                url: 'https://www.google.com/maps/dir/Trône+metro+station+Brussels/Rue+De+Pascale+15+Brussels+1040',
              },
            ],
          },
          {
            time: '08:00',
            title: '🏠 Szállás — poggyász lerakás',
            desc: 'Rue De Pascale 15 — az EU-negyed szívében. Lehet, hogy korai a check-in, de a cuccot leadhatjátok.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Rue+De+Pascale+15+Brussels+1040',
              },
            ],
          },
          {
            time: '08:45',
            title: '☕ Reggeli a környéken',
            desc: 'Croissant, pain au chocolat + kávé. (~€5-8/fő)',
            transport: [
              {
                type: 'walk',
                label: '🚶 ~2 perc · séta a környéken',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Le+Pain+Quotidien+Rue+de+Namur+Brussels',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: 'Le Pain Quotidien (Rue de Namur 68) — belga lánc, bio kenyerek, nagy közös asztal, Google 4.2★',
                  url: 'https://maps.google.com/?q=Le+Pain+Quotidien+Rue+de+Namur+Brussels',
                },
                {
                  text: 'Charli (Rue du Bailli 1) — specialty kávé, avokádós toast, modern, Google 4.5★',
                  url: 'https://maps.google.com/?q=Charli+Rue+du+Bailli+Brussels',
                },
                {
                  text: 'OR Coffee (Rue Auguste Orts 9, Grand-Place közelében) — helyi specialty kávézó, Google 4.5★',
                  url: 'https://maps.google.com/?q=OR+Coffee+Rue+Auguste+Orts+Brussels',
                },
                'Panos — belga pékséglánc, gyors és olcsó (~€4-5), mindenhol van',
              ],
              tips: [
                'A szállás közelében (EU-negyed) sok kávézó hétfő-péntekig az irodai dolgozóknak nyitva van — szerdán tökéletes',
                'Olcsóbb opció: szupermarketből croissant + kávé (~€2-3) — Delhaize, Carrefour Express mindenhol van',
              ],
            },
          },
          {
            time: '09:30',
            title: '🌳 Parc du Cinquantenaire',
            badges: ['INGYENES'],
            desc: 'Hatalmas park impozáns diadalívvel — I. Lipót belga király építtette Belgium 50. évfordulójára. A kislány futhat a réten, ti kávéztok a padon. Az ívek alatt néha kiállítások vannak.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Parc+du+Cinquantenaire+Brussels',
              },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Cinquantenaire' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc · séta a szállástól',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Parc+du+Cinquantenaire',
              },
            ],
            guide: {
              history: [
                'II. Lipót belga király rendelte el a park építését 1880-ban Belgium függetlenségének 50. évfordulójára (Cinquantenaire = ötvenedik évforduló)',
                'A monumentális diadalívet eredetileg fából építették, a kőváltozat csak 1905-re készült el — Lipót nem érte meg az átadást',
                'A park alatt húzódik az Európai Unió főhadiszállásához vezető alagút',
              ],
              mustSee: [
                'A hármas diadalív tetején álló bronz kvadriga (négylovas fogat) — Brabant tartomány felkelését ábrázolja',
                'Az ív alatti átjáró akusztikája különleges — állj középre és tapsolj!',
                'A park két szárnyában a Katonai Múzeum (ingyenes!) és az Autoworld oldtimer gyűjtemény található',
              ],
              funFacts: [
                'A parkban található Európa egyik legnagyobb diadalíve — nagyobb mint a párizsi Arc de Triomphe du Carrousel',
                'Nyáranként szabadtéri mozivetítések és koncertek vannak a park füves részén',
                'A park területén egy kis mecset is áll — az 1969-ben alapított Brüsszeli Nagymecset, Európa egyik legrégebbi aktív mecsetje',
              ],
              tips: [
                'Reggel kevés a turista, ideális fotóhelyszín a diadalívnél',
                'A park padjai mellett sokszor ingyenes wifi érhető el',
                'A gyerekjátszótér a park déli sarkában van, a Merode metró felőli oldalon',
              ],
            },
          },
          {
            time: '10:30',
            title: '🇪🇺 Parlamentárium',
            badges: ['INGYENES', 'GYEREKBARÁT'],
            desc: 'Az Európai Parlament interaktív látogatóközpontja — 24 nyelven elérhető (magyarul is!). Multimédiás időutazás az EU történetén. A gyerekeknek külön interaktív állomások vannak. Nem tipikus múzeum, inkább élmény!',
            links: [
              {
                label: '📍 Info',
                url: 'https://visiting.europarl.europa.eu/en/visitor-offer/places-to-visit/parlamentarium',
              },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Parlamentarium' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~10 perc · séta a parktól',
                url: 'https://www.google.com/maps/dir/Parc+du+Cinquantenaire/Parlamentarium+Brussels',
              },
            ],
            guide: {
              history: [
                '2011-ben nyílt meg, Európa legnagyobb parlamenti látogatóközpontjaként',
                'Az Európai Parlament 705 képviselővel működik 27 tagállamból — a világ egyetlen közvetlenül választott nemzetek feletti parlamentje',
                'Brüsszel azért lett az EU fővárosa, mert Belgium alapító tag volt és a kis ország semleges kompromisszumnak tűnt a nagyhatalmak között',
              ],
              mustSee: [
                'A 360°-os mozi, ahol az EU történetét mutatják be lenyűgöző vetítésen',
                'Az interaktív padlótérkép, ahol az EU összes tagállamának történetét megnézhetitek',
                'A gyerekállomás (Luna game) — interaktív játék ahol saját EU-törvényt alkothattok',
              ],
              funFacts: [
                'Az EP-nek 24 hivatalos nyelve van — a fordítószolgálat a világ legnagyobb, több mint 600 tolmáccsal',
                "Az EU-negyed lakói viccelődve 'Eurokrácia' negyednek hívják a környéket",
                'A parlamenti ülésterem székei úgy vannak rendezve, hogy balról jobbra haladva tükrözzék a politikai spektrumot',
              ],
              tips: [
                'Érdemes legalább 1.5 órát szánni rá — az audio guide nagyon részletes',
                'Nincs szükség előzetes foglalásra, de hétfőn zárva van',
                'A kijáratnál van egy ajándékbolt EU-s szuvenírekkel',
              ],
            },
          },
          {
            time: '11:30',
            title: '🏛 Grand-Place',
            badges: ['INGYENES'],
            highlight: true,
            desc: 'UNESCO Világörökség — Európa egyik legszebb tere! Az aranyozott homlokzatú céhházak a 17. századból valók. Victor Hugo "a világ legszebb terének" nevezte. Minden 2. évben virágszőnyeg borítja (sajnos nem áprilisban). Este kivilágítva a legszebb!',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Grand+Place+Brussels',
              },
              { label: 'Magyar Wiki', url: 'https://hu.wikipedia.org/wiki/Grand-Place' },
            ],
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro · ~8 perc · Maelbeek → De Brouckère + 5 perc séta',
                url: 'https://www.google.com/maps/dir/Parlamentarium+Brussels/Grand+Place+Brussels',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bruxelles_Grand_Place.JPG/960px-Bruxelles_Grand_Place.JPG',
                caption: 'Grand-Place - Brusszel szive',
              },
              history: [
                '1695-ben XIV. Lajos francia csapatai szinte teljesen lerombolták a teret — a brüsszeliek 4 év alatt építették újjá, még szebben, a mai barokk stílusban',
                'A tér eredetileg piactér volt a 12. századtól — itt tartották a vásárokat, kivégzéseket és ünnepségeket',
                'Az 1998-ban UNESCO Világörökséggé nyilvánított teret Victor Hugo, Jean Cocteau és Karl Marx is megcsodálta — Marx itt írta a Kommunista Kiáltvány egy részét 1847-ben',
                'A Városháza (Hôtel de Ville) tornya 96 méter magas, a csúcsán Szent Mihály arkangyal szobra áll',
              ],
              mustSee: [
                'A Városháza (bal oldal) — a tér egyetlen épülete ami túlélte az 1695-ös bombázást, 15. századi gótikus remekmű',
                'A Királyi Ház (Maison du Roi) — ma a Brüsszeli Városi Múzeum, itt vannak a Manneken Pis kosztümjei',
                'Az aranyozott céhházak homlokzatai — minden háznak saját neve van: A Hattyú (Labud), A Csillag, A Róka stb.',
                'Páros évben (2026-ban IGEN!) az augusztusi Virágszőnyeg: 600.000 begóniából készül, 1800 m²-es',
              ],
              funFacts: [
                'A tér 68×110 méteres — meglepően kicsi ha először meglátod, de éppen ez teszi intimé és lenyűgözővé',
                'A Hattyú nevű céhházban működött a sörcéh — itt találkozott Karl Marx és Friedrich Engels 1847-ben',
                'Minden este más színű világítás borítja a teret — a fény-show kb. 22:00 körül kezdődik',
                "A 'Grand-Place' név egyszerűen 'nagy tér'-t jelent — a flamandok 'Grote Markt'-nak hívják",
              ],
              tips: [
                'Először a tér közepéről nézd körbe 360°-ban — a hatás lenyűgöző',
                'A legjobb fotó a Királyi Ház felől készül, szemben a Városházával',
                'A téren a kávé/sör turista áron megy (€6-8) — egy utcányival arrébb fele annyiba kerül',
                'Este 21:00 után a legszebb, kivilágítva és turisták nélkül',
              ],
            },
          },
          {
            time: '12:00',
            title: '👦 Manneken Pis',
            badges: ['INGYENES'],
            desc: 'Brüsszel ikonikus 61 cm-es szobrocskája 1619-ből. Hetente más jelmezbe öltöztetik (már 1000+ kosztümje van!) — nézzétek meg, aznap miben van! Van egy női megfelelője is, a Jeanneke Pis, a Delirium Café mellett.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Manneken+Pis+Brussels',
              },
              { label: 'Magyar Wiki', url: 'https://hu.wikipedia.org/wiki/Manneken_Pis' },
              {
                label: 'Garderobe naptár',
                url: 'https://www.mannekenpis.brussels/en/calendar',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc · séta a Grand-Place-tól délre',
                url: 'https://www.google.com/maps/dir/Grand+Place+Brussels/Manneken+Pis+Brussels',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Manneken_Pis_Brussel.jpg/960px-Manneken_Pis_Brussel.jpg',
                caption: 'Manneken Pis',
              },
              history: [
                'Az eredeti szobor 1388-ból származik, a jelenlegi bronz verzió Jérôme Duquesnoy flamand szobrász munkája 1619-ből',
                'Többször ellopták: az angolok 1745-ben, a franciák 1747-ben — XIV. Lajos bocsánatkérésül arany ruhát küldött neki',
                'A legenda szerint egy kisfiú mentette meg a várost azzal, hogy egy égő kanócra pisilt, ami felrobbantotta volna az ellenség lőszerét',
              ],
              mustSee: [
                'Maga a szobor — készülj, hogy NAGYON kicsi (61 cm), sokan csalódnak a méretén, de pont ez a bája',
                'A Királyi Házban (Grand-Place) 1000+ kosztümje van kiállítva — Elvis-ruhától a magyar népviseletig',
                'Jeanneke Pis — a női megfelelője egy kis sikátorban a Delirium Café mellett (Impasse de la Fidélité)',
                'Zinneke Pis — a pisilő kutya szobor a Rue des Chartreux és Rue du Vieux Marché aux Grains sarkán',
              ],
              funFacts: [
                'Évente 130-140 alkalommal öltöztetik be — naptár a garderobemannekenpis.be oldalon',
                'Különleges napokon sört pisil a szobor (pl. belga sörfesztivál) — ilyenkor ingyen kóstolhatsz!',
                'A kosztüm-gyűjtemény 1698-ban kezdődött, amikor Miksa Emánuel bajor herceg adta az első ruhát',
                "Van egy 'Manneken Peace' nap is, amikor békeüzenetes ruhát kap",
              ],
              tips: [
                'Reggel 9 előtt szinte senki sincs ott — tökéletes fotó',
                'Nézd meg előre a garderobe.mannekenpis.be oldalon, aznap miben lesz',
                'Ne hagyd ki a Jeanneke Pis-t sem (3 perc séta) — sokkal kevésbé ismert, de szintén vicces',
              ],
            },
          },
          {
            time: '12:15',
            title: '🍽 Ebéd — Moules-frites!',
            highlight: true,
            desc: 'A belga nemzeti étel: gőzölt kagyló fehérboros szószban, sült krumplival! Tipp: a Rue des Bouchers turista csapda — a mellékutcákban olcsóbb és jobb. (~€12-18/fő)',
            links: [
              {
                label: '📍 Étterem utca',
                url: 'https://maps.google.com/?q=Rue+des+Bouchers+Brussels',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~3 perc · vissza a Grand-Place felé',
                url: 'https://www.google.com/maps/dir/Manneken+Pis/Rue+des+Bouchers+Brussels',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: 'Chez Léon (Rue des Bouchers 18) — 1893 óta, a klasszikus, turistás de ikonikus. Google 3.9★',
                  url: 'https://maps.google.com/?q=Chez+Léon+Rue+des+Bouchers+Brussels',
                },
                {
                  text: 'Aux Armes de Bruxelles (Rue des Bouchers 13) — elegánsabb, helyi kedvenc, Google 4.1★',
                  url: 'https://maps.google.com/?q=Aux+Armes+de+Bruxelles+Rue+des+Bouchers+Brussels',
                },
                {
                  text: 'Le Pré Salé (Rue de Flandre 20, Ste-Catherine negyed) — a brüsszeliek kedvence, nem a turista zónában! Google 4.3★',
                  url: 'https://maps.google.com/?q=Le+Pré+Salé+Rue+de+Flandre+Brussels',
                },
                {
                  text: 'Bij den Boansen (Quai aux Briques 60, Ste-Catherine) — autentikus halpiac étterem, Google 4.2★',
                  url: 'https://maps.google.com/?q=Bij+den+Boansen+Quai+aux+Briques+Brussels',
                },
              ],
              tips: [
                'A Rue des Bouchers-on az éttermek előtt álló pincérek próbálnak behívni — ez turista csapda jel',
                'A Ste-Catherine negyed (10 perc séta) a helyi halkonyha központja — itt esznek a brüsszeliek',
                'A moules (kagyló) szezon szept-ápr — áprilisban még jó, friss!',
                'Gyereknek: a legtöbb helyen van poulet-frites (csirke + sült krumpli)',
              ],
            },
          },
          {
            time: '13:30',
            title: '🧇 Belga gofri kóstolás',
            desc: 'Két típus létezik: a brüsszeli (könnyű, ropogós, téglalap) és a liège-i (nehezebb, cukros, kerek). (~€4-6/db, tejszínhabbal, eperrel, csokival)',
            links: [
              {
                label: '📍 Maison Dandoy',
                url: 'https://maps.google.com/?q=Maison+Dandoy+Grand+Place+Brussels',
              },
              {
                label: 'Magyar Wiki: Belga gofri',
                url: 'https://hu.wikipedia.org/wiki/Belga_gofri',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~1 perc · a Grand-Place sarkán',
                url: 'https://www.google.com/maps/dir/Rue+des+Bouchers+Brussels/Maison+Dandoy+Grand+Place',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: 'Maison Dandoy (Rue au Beurre 31) — 1829 óta, a leghíresebb, Google 4.3★ — drágább de megéri',
                  url: 'https://maps.google.com/?q=Maison+Dandoy+Rue+au+Beurre+Brussels',
                },
                {
                  text: 'Vitalgaufre (Rue de la Colline 3) — helyi kedvenc, kisebb, autentikusabb, Google 4.6★',
                  url: 'https://maps.google.com/?q=Vitalgaufre+Rue+de+la+Colline+Brussels',
                },
                'Utcai standok a Grand-Place körül — olcsóbbak (€3-4), de a minőség változó',
              ],
              tips: [
                'A brüsszeli gofrit SIMÁN (porcukorral) kell enni — a sok topping turista dolog',
                'A liège-i gofri magában is édes (cukorkristályos tészta) — nem kell rá csoki',
                'Kerüljétek a standokat ahol előre becsomagolt, hideg gofrit árulnak — frissen sütve kell enni',
              ],
            },
          },
          {
            time: '14:00',
            title: '🍫 Sablon negyed — csokoládé & antik',
            badges: ['INGYENES'],
            desc: 'Brüsszel legelegánsabb negyede. Pierre Marcolini, Wittamer és Neuhaus (aki feltalálta a praliné bonbont 1912-ben!) mind itt van. Sok helyen ingyen kóstolhattok. Az antik boltok és galériák is lenyűgözőek. Hétvégenként antikpiac a téren.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Place+du+Grand+Sablon+Brussels',
              },
              {
                label: 'Wikipedia',
                url: 'https://en.wikipedia.org/wiki/Sablon,_Brussels',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~12 perc · séta délre, lejtőn le a Sablon felé',
                url: 'https://www.google.com/maps/dir/Grand+Place+Brussels/Place+du+Grand+Sablon+Brussels',
              },
            ],
            guide: {
              history: [
                'A Sablon neve a homokos (sablonneux) talajból ered — a középkorban itt volt a város homokbányája',
                'A Notre-Dame du Sablon templom a 15. századból származik, brüsszeli gótika remekműve — eredetileg az íjász céh kápolnája volt',
                'A praliné bonbont Jean Neuhaus svájci-belga cukrász találta fel itt 1912-ben — a világ első telt csokija!',
              ],
              mustSee: [
                {
                  text: "Pierre Marcolini — a világ egyik legjobb csokoládékészítője, belga 'csokicézár', többszörös világbajnok",
                  url: 'https://maps.google.com/?q=Pierre+Marcolini+Grand+Sablon+Brussels',
                },
                {
                  text: 'Wittamer — 1910 óta működő családi cukrászda, a királyi család szállítója',
                  url: 'https://maps.google.com/?q=Wittamer+Place+du+Grand+Sablon+Brussels',
                },
                'A Petit Sablon kert — 48 bronz szoborral a középkori céhek szimbólumaival körülvéve, gyönyörű kis park',
                'Notre-Dame du Sablon templom belseje (ingyenes) — a festett üvegablakok elképesztőek',
              ],
              funFacts: [
                'Belgium a világ legnagyobb csokoládé-exportőre — évi 220.000 tonna csokit gyártanak',
                'A brüsszeli reptéren több csokot adnak el, mint bármelyik üzletben a világon',
                'A belga csoki azért más, mert magasabb kakaóvaj-tartalommal készül (min. 35%) mint máshol',
                'A Sablon szomboton és vasárnap antikpiaccá változik — régiségek, könyvek, műtárgyak',
              ],
              tips: [
                'Lépj be minden csokoládéboltba — szinte mindenhol ingyen kóstolhatsz',
                'A Petit Sablon kert ideális pihenőhely — padon ülve kilátás a templomra',
                'Az alsó Sablon (Place du Jeu de Balle) bolhapiac is megér egy sétát ha van időtök',
              ],
            },
          },
          {
            time: '15:30',
            title: '😴 Pihenő a szálláson',
            desc: 'Hajnali 4-kor keltetek — ilyenkor jól jön egy kis pihi! A kislány különösen rá fog férni.',
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro · ~10 perc · Louise/Trône',
                url: 'https://www.google.com/maps/dir/Place+du+Grand+Sablon+Brussels/Rue+De+Pascale+15+Brussels',
              },
            ],
          },
          {
            time: '17:00',
            title: '⚛️ Atomium + Mini-Europe',
            optional: true,
            badges: ['GYEREKBARÁT'],
            desc: 'Atomium: 102 méter magas vasatom-modell az 1958-as világkiállításból. Belül kiállítás + panoráma kilátás. Mini-Europe: 350 miniatűr épület 1:25-ös méretben — Big Ben, Eiffel-torony, Velence... A kislány IMÁDNI fogja! Kombi jegy olcsóbb.',
            links: [
              { label: 'atomium.be', url: 'https://www.atomium.be' },
              { label: 'minieurope.com', url: 'https://www.minieurope.com/en/' },
            ],
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro M6 · ~25 perc · Trône → Heysel',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Atomium+Brussels',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Atomium_Br%C3%BCssel.JPG/960px-Atomium_Br%C3%BCssel.JPG',
                caption: 'Atomium - kozelrol',
              },
              history: [
                'André Waterkeyn mérnök tervezte az 1958-as brüsszeli világkiállításra — eredetileg le akarták bontani utána, de annyira népszerű lett, hogy maradhatott',
                'Egy vasatom 165 milliárdszoros nagyítása — a 9 gömb egy kristályszerkezetet ábrázol',
                '2006-ban teljesen felújították — az eredeti alumínium borítást rozsdamentes acélra cserélték',
              ],
              mustSee: [
                'A legfelső gömb panoráma-kilátója — tiszta időben Antwerpenig ellátni (85 km!)',
                'A gömbök közötti mozgólépcsők — a leghosszabb mozgólépcső Európában (35 méter)',
                'Az állandó kiállítás az 1958-as Expo-ról — retro-futurisztikus design és archív filmek',
                'Mini-Europe: az Eiffel-torony, a Big Ben és a Vezúv (ami kitör!) miniatűrben',
              ],
              funFacts: [
                'Az Atomium 102 méter magas és 2400 tonna — minden gömb 18 méter átmérőjű',
                'Évente 600.000 látogató jön — Brüsszel leglátogatottabb fizetős látványossága',
                'A Mini-Europe-ban 80 EU-város 350 épülete van 1:25-ös méretben, interaktív elemekkel',
                'Éjszaka 2970 LED fény világítja meg — a fényshow időnként a zenéhez szinkronizálva változik',
              ],
              tips: [
                'Kombi jegy (Atomium + Mini-Europe) ~€10-al olcsóbb mint külön-külön',
                'A Mini-Europe kb. 1.5 óra, az Atomium kb. 1 óra — összesen tervezz 3 órát',
                'A gyerekeknek a Mini-Europe interaktívabb és szórakoztatóbb mint az Atomium belső kiállítása',
              ],
            },
          },
          {
            time: '19:30',
            title: '🍽 Vacsora',
            highlight: true,
            desc: 'Sainte-Catherine negyed — a helyi halétterem-negyed, ahol a brüsszeliek is esznek (nem turista csapda!). (~€15-22/fő)',
            links: [
              {
                label: '📍 Ste-Catherine tér',
                url: 'https://maps.google.com/?q=Place+Sainte-Catherine+Brussels',
              },
            ],
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro · ~20 perc · Heysel → De Brouckère',
                url: 'https://www.google.com/maps/dir/Atomium+Brussels/Place+Sainte-Catherine+Brussels',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: 'Noordzee / Mer du Nord (Rue Ste-Catherine 45) — pult étterem, halak és tengeri gyümölcsök, helyi legenda! Google 4.3★',
                  url: 'https://maps.google.com/?q=Noordzee+Mer+du+Nord+Rue+Sainte-Catherine+Brussels',
                },
                {
                  text: 'Le Greenwich (Rue des Chartreux 7) — hangulatos bisztró, belga klasszikusok, Google 4.2★',
                  url: 'https://maps.google.com/?q=Le+Greenwich+Rue+des+Chartreux+Brussels',
                },
                {
                  text: 'Nüetnigenansen (Rue du Marché aux Porcs 1) — flamand konyha, szép belső, Google 4.4★',
                  url: 'https://maps.google.com/?q=Nüetnigenansen+Rue+du+Marché+aux+Porcs+Brussels',
                },
                {
                  text: 'Restobières (Rue des Renards 32) — minden fogás sörrel készül, egyedi! Google 4.3★',
                  url: 'https://maps.google.com/?q=Restobières+Rue+des+Renards+Brussels',
                },
              ],
              tips: [
                'A Ste-Catherine negyed 10 perc séta a Grand-Place-tól — megéri a kitérő',
                'A Noordzee-ben nincs ülőhely — a pultnál állva esztek, de a hal frissebb mint bárhol',
                "Gyerekbarát opció: a belga 'vol-au-vent' (csirkés-gombás pite) vagy 'stoemp' (krumplipüré zöldségekkel)",
              ],
            },
          },
          {
            time: '21:00',
            title: '🌙 Grand-Place éjszakai kivilágítás',
            badges: ['INGYENES'],
            desc: 'A tér aranyozott homlokzatai éjszaka meleg fényben ragyognak — teljesen más élmény mint nappal! Ilyenkor kevesebb a turista, és a tér varázslatos.',
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc · séta',
                url: 'https://www.google.com/maps/dir/Place+Sainte-Catherine+Brussels/Grand+Place+Brussels',
              },
            ],
          },
          {
            time: '21:30',
            title: '🛏 Vissza a szállásra — korai fekvés!',
            desc: 'Holnap Hollandia — korai kelés (06:30), vonat 07:49 Midi-ről! Készítsetek ki mindent este.',
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro · ~8 perc · De Brouckère → Trône',
                url: 'https://www.google.com/maps/dir/Grand+Place+Brussels/Rue+De+Pascale+15+Brussels',
              },
            ],
          },
        ],
        costs: [
          { item: 'FLIBCO busz CRL→Brüsszel', cost: '~€76' },
          { item: 'Brüsszeli metro (napijegy × 4 felnőtt)', cost: '~€28' },
          { item: 'Parlamentárium, Grand-Place, Manneken Pis, Sablon', cost: 'INGYENES' },
          { item: 'Atomium + Mini-Europe kombi (opcionális)', cost: '~€141' },
          { item: 'Étkezés (reggeli+ebéd+gofri+vacsora)', cost: '~€130–180' },
          { item: 'Nap 1 összesen', cost: '~€234–425', total: true },
        ],
      },
      {
        dayNum: 2,
        title: 'Bruges — A mesebeli város',
        subtitle: 'Április 9. csütörtök — Egész napos kirándulás',
        images: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Brugge-CanalRozenhoedkaai.JPG/960px-Brugge-CanalRozenhoedkaai.JPG',
            caption: 'Rozenhoedkaai — a legikonikusabb pont',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bruges_Market_Square_and_Belfry.jpg/960px-Bruges_Market_Square_and_Belfry.jpg',
            caption: 'Markt tér és Belfort-torony',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Brugge_beguinage.JPG/960px-Brugge_beguinage.JPG',
            caption: 'Begijnhof — fehér házak, nyugalom',
          },
        ],
        alerts: [
          {
            type: 'tip',
            text: '🚂 IC vonat Brussels-Midi → Brugge · ~1 óra · direkt járat. 12 év alatti gyerek INGYENES! Jegy az automatából, nem kell előre. · belgiantrain.be\n💡 Bruges teljesen gyalogosan bejárható! A centrum kompakt — minden 15 percen belül elérhető.',
          },
        ],
        schedule: [
          {
            time: '08:30',
            title: '☕ Reggeli',
            desc: 'A szálláson vagy a környéken. (~€5-8/fő)',
            guide: {
              mustSee: [
                'Ugyanazok a helyek mint az 1. napon — Le Pain Quotidien, Charli, Panos',
                'Vagy: a szálláson reggeli (ha van), szupermarketből előző este bevásárolva',
              ],
              tips: ['Ma Bruges-be mentek — pakolás után reggelizzetek, ne siessetek'],
            },
          },
          {
            time: '09:30',
            title: '🚂 IC vonat → Brugge',
            highlight: true,
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro Trône→Midi (5 perc) + 🚂 Vonat ~1 óra → Brugge',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Bruges+Station',
              },
            ],
          },
          {
            time: '10:30',
            title: '📍 Érkezés Brugge',
            desc: 'A pályaudvartól a centrumig kellemes séta a Minnewater parkon és a Begijnhof-on át. Már az út maga is szép!',
            transport: [
              {
                type: 'walk',
                label: '🚶 ~15 perc · séta a centrumba',
                url: 'https://www.google.com/maps/dir/Brugge+Station/Markt+Bruges',
              },
            ],
          },
          {
            time: '10:45',
            title: '🏛 Markt (Piactér)',
            badges: ['INGYENES'],
            desc: 'Bruges középkori szíve! A teret színes lépcsős oromzatú házak szegélyezik, középen Jan Breydel és Pieter de Coninck szobra (flamand szabadsághősök 1302-ből). A lovaskocsi-túrák is innen indulnak.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Markt+Bruges' },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Markt_(Bruges)' },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bruges_Market_Square_and_Belfry.jpg/960px-Bruges_Market_Square_and_Belfry.jpg',
                caption: 'Markt ter - szines oromzatu hazak',
              },
              history: [
                'A Markt a 10. század óta Bruges kereskedelmi központja — itt tartották a hetipiacot, lovagi tornákat és ünnepségeket',
                "Jan Breydel és Pieter de Coninck a 'Bruges-i hajnal' (Brugse Metten) hősei: 1302. május 18-án a flamand kézművesek felkeltek a francia megszállók ellen — mindenkit megöltek aki nem tudta kimondani a flamand 'schild en vriend' (pajzs és barát) jelszót",
                'Bruges a 13-14. században Európa leggazdagabb városa volt — a Hanza-szövetség legfontosabb kikötője, a gyapjú- és szövetkereskedelem központja',
                "A város neve a 'Bryggia' (kikötő/híd) szóból ered",
              ],
              mustSee: [
                'A színes, lépcsős oromzatú házak — minden szín más céhet jelölt a középkorban',
                'A Jan Breydel és Pieter de Coninck szobor a tér közepén — a flamand nemzeti büszkeség jelképe',
                'A Belfort-torony (83 m) — Bruges ikonikus jelképe, a tér délkeleti sarkán',
                'A Provinciaal Hof (tartományi palota) — neogótikus épület a tér keleti oldalán',
              ],
              funFacts: [
                "Bruges-t a 'Észak Velencéjének' hívják a csatornái miatt — de a brugge-iek nem szeretik ezt a nevet",
                "A Markt-on forgatták az 'In Bruges' (2008) c. film számos jelenetét Colin Farrell-lel és Brendan Gleeson-nal",
                'A tér alatt középkori pincék húzódnak — némelyik ma étteremként működik',
              ],
              tips: [
                'A lovaskocsi-túra ~€60/kocsi (max 5 fő) — 30 perc, jó áttekintés a városról',
                'A tér körüli éttermek drágák — 1-2 utcával beljebb fele annyiért esztek',
                'A Markt-ról indul a legtöbb sétatúra — ingyenes walking tour naponta 10:30-kor és 14:00-kor',
              ],
            },
          },
          {
            time: '11:00',
            title: '🗼 Belfort-torony',
            optional: true,
            desc: '83 méter magas, 366 lépcsőfok — de a kilátás megéri! A toronyban 47 harangjáték (carillon) szól, UNESCO Világörökség. A szűk csigalépcső kaland a kislánynak! €14/felnőtt, €6/gyerek.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Belfry+of+Bruges' },
              {
                label: 'Wikipedia',
                url: 'https://en.wikipedia.org/wiki/Belfry_of_Bruges',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Belfort_Brugge.jpg/960px-Belfort_Brugge.jpg',
                caption: 'Belfort-torony - 83 meter, 366 lepcsofok',
              },
              history: [
                'A torony építése 1240-ben kezdődött, a jelenlegi formáját 1482-re nyerte el — a csúcsa eredményleg magasabb volt, de egy 1741-es villámcsapás után nem építették újra',
                'A középkorban a város kincstára volt a toronyban — a városi szabadságlevelet és pecsétet itt őrizték',
                'A 47 harangból álló carillon UNESCO Világörökség — ma is zenél, negyedóránként szól',
              ],
              mustSee: [
                'A kilátás a tetőről — egész Bruges és a flamand síkság a tengerig',
                'A harangjáték mechanizmusa a torony belsejében — ha felmentek, útközben látjátok',
                'A szűk csigalépcső — a 366 lépcsőfok maga is élmény (és jó edzés!)',
              ],
              funFacts: [
                'A torony 1.2 méterrel dől észak-kelet felé — szándéktalan, de stabil',
                'A carillon-játékos (beiaardier) kézzel játssza a harangokat egy speciális billentyűzeten — a város hivatalos állása',
              ],
              tips: [
                'Egyszerre max 70 ember lehet fent — csúcsidőben (11-14h) akár 30 perc a sor',
                'Menjetek minél korábban (10:00-kor nyit) — ilyenkor szinte üres',
                'A lépcső nagyon szűk — kislányt fogjátok kézen, és kényelmes cipő kötelező',
              ],
            },
          },
          {
            time: '11:30',
            title: '🏰 Burg tér + Városháza + Szent Vér Bazilika',
            badges: ['INGYENES'],
            desc: 'A Burg tér Bruges politikai szíve volt. A Városháza (1376) Flandria legrégebbi gótikus épülete. A Szent Vér Bazilika egy 12. századi kápolna, ahol állítólag Krisztus vérének ereklyéjét őrzik!',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Burg+Square+Bruges',
              },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Burg_(Bruges)' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~2 perc · szomszédos tér',
                url: 'https://www.google.com/maps/dir/Markt+Bruges/Burg+Square+Bruges',
              },
            ],
            guide: {
              history: [
                'A Burg tér a 9. századtól Bruges hatalmi központja — itt állt az eredeti erődítmény (burg), amiről a város a nevét kapta',
                "A Szent Vér ereklyét állítólag Thierry d'Alsace flandriai gróf hozta a Szentföldről a II. keresztes háború után (1149)",
                'A Városháza (Stadhuis) 1376-1421 között épült — Flandria és Belgium legrégebbi gótikus városházája',
                'A Szent Vér Bazilika két szinten épül: az alsó román kori (12. sz.), a felső gótikus (15. sz.) — két teljesen különböző világ egymás felett',
              ],
              mustSee: [
                'A Szent Vér ereklye — egy kristályfiola, ami állítólag Krisztus vérét tartalmazza; naponta kiviszik megtekintésre a hívőknek (11:30-12:00)',
                'A Városháza gótikus terme (Gotische Zaal) — a mennyezeti boltozat és a 20. századi falfestmények lenyűgözőek (€6 belépő)',
                'Az Oude Griffie (Régi Írnokház) — reneszánsz homlokzat 1537-ből, a tér legdíszesebb épülete',
                'A bazilika alsó kápolnájában a román kori oszlopfők — 900 éves faragványok',
              ],
              funFacts: [
                'Minden évben Áldozócsütörtökön (Hemelvaart) a Szent Vér körmenet (Heilig Bloedprocessie) végigvonul a városon — UNESCO szellemi világörökség',
                'A bazilika felső szintjére vezető lépcső olyan szűk, hogy egyszerre csak egy irányba lehet menni',
                'A Burg téren 5 különböző építészeti stílus látható egymás mellett: román, gótikus, reneszánsz, barokk és neoklasszicista',
              ],
              tips: [
                'A Szent Vér megtekintése ingyenes, de a kincstár €2.50 — megéri a gyönyörű ötvösmunkákért',
                'Reggel kevesebb a sor a bazilika lépcsőjénél',
                'A Burg tér kisebb és intimebb mint a Markt — jobb fotók készülnek itt',
              ],
            },
          },
          {
            time: '12:00',
            title: '🚤 Csónaktúra a csatornákon',
            highlight: true,
            badges: ['GYEREKBARÁT'],
            desc: '~30 perces csónakázás Bruges titkos oldalát mutatja meg — alacsonyan ívelt hidak, lógó füzfák, hátsó kertek amiket az utcáról nem látnátok. Több indulási pont van, a legközelebbi a Burg-nál. ~€12/felnőtt, €7/gyerek.',
            transport: [
              {
                type: 'walk',
                label: '🚶 ~3 perc · több kikötő a Burg közelében',
                url: 'https://www.google.com/maps/dir/Burg+Square+Bruges/Boat+tours+Bruges',
              },
            ],
            guide: {
              mustSee: [
                'A Dijver csatorna szakasz — középkori paloták és füzfák között kanyarog, itt készül a legtöbb fotó',
                'A Rozenhoedkaai látképe a vízről — az ikonikus nézet teljesen más perspektíva mint a partról',
                'Az alacsony középkori kőhidak — a csónak alig fér el alattuk, a gyereknek kaland!',
                'A hátsó kertek — a helyi lakók magánkertjeit csak a vízről lehet látni',
              ],
              funFacts: [
                'A bruges-i csatornákat a 12. században ásták, eredetileg kereskedelmi célra — a Zwin-csatornán az Északi-tengerig lehetett hajózni',
                'A csónakok motorja hangtompított, hogy ne zavarják a lakókat — ezért hallani a hattyúk szárnycsapkodását',
                "A bruges-i hattyúk a város 'tulajdonai' — 1488 óta törvény védi őket",
              ],
              tips: [
                'A Dijver kikötő a legkevésbé zsúfolt — a Burg melletti a legforgalmasabb',
                'A túra 30 perc, de a sor akár 20-30 perc is lehet déli csúcsban — menjetek 12:00 előtt vagy 15:00 után',
                'A csónakban elöl a legjobb a kilátás — ha van választás, kérjetek elülső helyet',
              ],
            },
          },
          {
            time: '12:45',
            title: '🍟 Ebéd — Bruges-i frietjes!',
            desc: "A belga sült krumpli az igazi 'French fries' — kétszer sütve, kívül ropogós, belül puha! Rengeteg szósz közül választhattok (andalouse, samourai, tartare...). Stoofvlees (flamand sörben párolt marhapörkölt) a tökéletes mellé. (~€10-15/fő)",
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc · vissza a Markt felé',
                url: 'https://www.google.com/maps/dir/Boat+tours+Bruges/Markt+Bruges',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: 'Chez Vincent (Simon Stevinplein 15) — a helyiek kedvence, nem turista csapda, Google 4.2★',
                  url: 'https://maps.google.com/?q=Chez+Vincent+Bruges',
                },
                {
                  text: 'The Potato Bar (Langestraat 39) — modern frituur, kreatív toppingek, Google 4.4★',
                  url: 'https://maps.google.com/?q=The+Potato+Bar+Bruges',
                },
                {
                  text: 'De Bolansen (Wollestraat 35) — steak + frieten, családbarát, Google 4.3★',
                  url: 'https://maps.google.com/?q=De+Bolansen+Bruges',
                },
              ],
              tips: [
                "A 'frituur' = sült krumplis stand, az 'eetcafé' = kisvendéglő — mindkettő jó és olcsó",
                'A Markt téri éttermek 30-50%-kal drágábbak — 1 utcányival beljebb ugyanazt kapjátok kevesebbért',
                'Andalouse szósz = majonéz + paradicsom + csípős paprika — a belga kedvenc',
              ],
            },
          },
          {
            time: '13:30',
            title: '🍫 Csokoládé-séta',
            desc: 'Bruges a belga csokoládé fővárosa — 50+ csokoládébolt a centrumban! Sok helyen ingyen kóstolhattok!',
            links: [
              {
                label: '📍 Katelijnestraat',
                url: 'https://maps.google.com/?q=Katelijnestraat+Bruges',
              },
              {
                label: 'Magyar Wiki: Belga csoki',
                url: 'https://hu.wikipedia.org/wiki/Belga_csokoládé',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 séta · boltról boltra a Katelijnestraat mentén',
                url: 'https://www.google.com/maps/dir/Markt+Bruges/The+Chocolate+Line+Bruges',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: 'Dumon (Eiermarkt 6) — családi manufaktúra 1992 óta, mennyei trüffelek, Google 4.7★',
                  url: 'https://maps.google.com/?q=Dumon+Chocolatier+Bruges',
                },
                {
                  text: "The Chocolate Line (Simon Stevinplein 19) — Dominique Persoone, a 'csokirocksztár' boltja, meglepő ízek. Google 4.5★",
                  url: 'https://maps.google.com/?q=The+Chocolate+Line+Bruges',
                },
                {
                  text: 'Leonidas (Breidelstraat 24) — a klasszikus belga praliné, jó ár-érték arány ajándéknak. Google 4.3★',
                  url: 'https://maps.google.com/?q=Leonidas+Breidelstraat+Bruges',
                },
                {
                  text: 'Neuhaus (Steenstraat 66) — ők találták fel a praliné bonbont 1912-ben, prémium kategória. Google 4.5★',
                  url: 'https://maps.google.com/?q=Neuhaus+Steenstraat+Bruges',
                },
              ],
              funFacts: [
                'Belgium a világ legnagyobb csokoládé-exportőre — évi 220.000 tonna',
                'Bruges-ben 50+ csokoládébolt van a kis belvárosban — több mint patika',
                'A belga csoki titkja: min. 35% kakaóvaj (EU törvény), szemben más országok 20%-ával',
              ],
              tips: [
                'Minden boltban ingyen kóstolhattok — ne szégyelljétek kérni, ez a szokás',
                'A legjobb ajándék: Dumon trüffel (házias) vagy Leonidas mix (áras)',
                "A Katelijnestraat és a Steenstraat a két fő 'csoki utca' — végig sétáljatok mindkettőn",
              ],
            },
          },
          {
            time: '14:30',
            title: '🏡 Begijnhof (Béguinage)',
            badges: ['INGYENES'],
            desc: 'UNESCO Világörökség! Fehérre meszelt házacskák egy zárt udvar körül — a 13. században beginák (vallásos nők) éltek itt. Ma bencés apácáké. A kert tavasszal nárciszokkal tele — áprilisban tökéletes! Bruges legcsendesebb, legbékésebb helye.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Begijnhof+Bruges' },
              {
                label: 'Wikipedia',
                url: 'https://en.wikipedia.org/wiki/Beguinage_of_Bruges',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~10 perc · séta délre',
                url: 'https://www.google.com/maps/dir/The+Chocolate+Line+Bruges/Begijnhof+Bruges',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Brugge_beguinage.JPG/960px-Brugge_beguinage.JPG',
                caption: 'Begijnhof - feher hazak, narciszok',
              },
              history: [
                '1245-ben alapította Konstantinápolyi Margit flandriai grófnő — a beginák (beguine) félig vallásos, félig világi nők voltak akik közösségben éltek, de nem tettek szerzetesi fogadalmat',
                'A beginamozgalom a 13. században indult Flandriában — az özvegyek és hajadonok számára nyújtott védett közösséget, ahol dolgozhattak (csipkeverés, ápolás) és tanulhattak',
                'A 13 flamand Begijnhof együttesen UNESCO Világörökség (1998) — a bruges-i az egyik legjobb állapotban megmaradt',
                'Az utolsó begina 1927-ben halt meg; ma bencés apácák lakják a házakat',
              ],
              mustSee: [
                'A belső udvar — tavasszal (ÁPRILISBAN!) fehér és sárga nárciszok borítják a füvet, mesebeli látvány',
                'A Begina-ház múzeum (Begijnhuisje) — egy eredeti begina szoba berendezése a 17. századból (€2)',
                'A fehérre meszelt homlokzatok a zöld fák alatt — Bruges legikonikusabb fényképezési helyszíne',
                'A bejárati híd a Minnewater felől — innen a legjobb az első benyomás',
              ],
              funFacts: [
                'A beginák fehérre meszelték a házaikat az alázatosság jeleként — ezért tűnik ma is olyan egységesnek',
                'A csend szabály még ma is érvényes — kérjük ne kiabáljatok és ne zenéljetek a területen',
                "A beginák saját sört is főztek — a 'begijntje' ma is népszerű belga sörstílus",
              ],
              tips: [
                'Reggel 8-9 között szinte üres — a turistabuszok 10 után érkeznek',
                'A belső kertet NEM szabad letaposni — csak a kavicsos ösvényeken sétáljatok',
                'A hátsó bejárat a Minnewater felől a hangulatos — a főbejárat a Wijngaardstraat-ról van',
              ],
            },
          },
          {
            time: '15:00',
            title: "🦢 Minnewater ('Szerelem tava')",
            badges: ['INGYENES', 'GYEREKBARÁT'],
            desc: 'Romantikus tó hattyúkkal! A legenda szerint egy lány, Minna, szerelméért halt meg, és a tavat róla nevezték el. A hattyúk 1488 óta élnek itt — Miksa császár büntetésül rendelte, mert a brugge-iek lefejezték tanácsadóját, akinek a címerében hattyú volt.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Minnewater+Bruges' },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Minnewater' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~2 perc · a Begijnhof mellett',
                url: 'https://www.google.com/maps/dir/Begijnhof+Bruges/Minnewater+Bruges',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Brugge_Minnewater_R01.jpg/960px-Brugge_Minnewater_R01.jpg',
                caption: 'Minnewater - a Szerelem tava',
              },
              history: [
                'A Minnewater a középkorban belső kikötőként szolgált — itt kötöttek ki a kereskedőhajók amelyek a Zwin csatornán érkeztek az Északi-tengerről',
                "A név eredete vitatott: a 'minne' jelenthet szerelmet (középkori holland) vagy belső vizet (binnenwaters)",
                "A hattyúk 1488 óta vannak itt — Miksa császár rendelte el örök büntetésként, mert a bruges-iek lefejezték Pieter Lanchals tanácsadóját (akinek a nevében a 'hals' = nyak, a címerében hattyú volt)",
              ],
              mustSee: [
                'A Poertoren (Lőportorony, 1398) a tó partján — a város régi lőporraktára, ma nem látogatható belülről, de kívülről fotogén',
                'A zsilipház a tó végén — innen szabályozták a város vízszintjét',
                'A hattyúk — nyugodtan közeledj, de ne etesd kenyérrel (nem jó nekik), inkább salátával',
              ],
              funFacts: [
                'A város gondozói (zwaanherders = hattyúpásztorok) naponta etetik a hattyúkat — ez hivatalos bruges-i állás',
                'A legenda szerint ha egy pár megcsókolja egymást a Minnewater hídján, örökké szeretni fogják egymást',
              ],
              tips: [
                'A tó legszebb a Begijnhof felőli partról — a fehér házak és a hattyúk együtt tökéletes fotó',
                'A park padjai ideálisak pihenőre — a Begijnhof után ez egy nyugodt pont',
              ],
            },
          },
          {
            time: '15:30',
            title: '🧇🍺 Gofri + sör szünet',
            desc: 'Üljetek le egy teraszra, rendeljetek egy Brugse Zot-ot (Bruges saját söre) és egy gofrit. Megérdemlitek! (~€5-8/fő)',
            guide: {
              mustSee: [
                {
                  text: "That's Toast (Noordzandstraat 28) — gofri es kave specialista, Google 4.6★",
                  url: "https://maps.google.com/?q=That's+Toast+Bruges",
                },
                {
                  text: 'Oyya (Noordzandstraat 1) — kreativ gofri toppingek, Google 4.5★',
                  url: 'https://maps.google.com/?q=Oyya+Bruges',
                },
                {
                  text: 'Cafe Rose Red (Cordoeaniersstraat 16) — hangulatos sorbar, 200+ belga sor, Google 4.5★',
                  url: 'https://maps.google.com/?q=Cafe+Rose+Red+Bruges',
                },
              ],
              tips: [
                'A Brugse Zot a helyi sör — a De Halve Maan főzi, könnyű szőke, 6%',
                'Kerüljétek a Markt téri teraszokat — drágábbak, a mellékutcákban jobb',
              ],
            },
          },
          {
            time: '16:00',
            title: '🚶 Szabad séta / vásárlás',
            desc: 'Bruges-i csipke (handmade lace — hagyomány a 16. századtól), csokoládé ajándékba, szuvenírek. A legjobb program: egyszerűen eltévedni a sikátorokban!',
          },
          {
            time: '17:00',
            title: '📸 Rozenhoedkaai',
            badges: ['INGYENES'],
            desc: 'Bruges legtöbbet fotózott pontja! A csatorna, a középkori házak és a Belfort-torony együtt — képeslapba illő. Alkonyatkor különösen varázslatos.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Rozenhoedkaai+Bruges',
              },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Rozenhoedkaai' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~8 perc · visszafelé észak felé',
                url: 'https://www.google.com/maps/dir/Minnewater+Bruges/Rozenhoedkaai+Bruges',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Brugge-CanalRozenhoedkaai.JPG/960px-Brugge-CanalRozenhoedkaai.JPG',
                caption: 'Rozenhoedkaai - Bruges legfotozott pontja',
              },
              mustSee: [
                "A klasszikus nézet: a csatorna, a középkori téglaépületek és háttérben a Belfort-torony — ez Bruges 'képeslap' fotója",
                'A tükröződés a vízben — szélcsendes napon tökéletes tükörképet látsz',
                'A régi halpiaci épületek a partmentén — ma galériák és éttermek működnek bennük',
              ],
              funFacts: [
                "A Rozenhoedkaai neve 'Rózsafüzér-rakpart'-ot jelent — itt árulták régen a rózsafüzéreket a zarándokoknak",
                "Ez a pont az 'In Bruges' film plakátján is szerepel — a városnak ez a legismertebb képe világszerte",
                'Reggel 7-8 között szinte üres — a hivatásos fotósok ilyenkor jönnek',
              ],
              tips: [
                'Alkonyatkor (17-18h körül) a legjobb a fény — a nap pont a házakra süt és aranyló tükröződést ad',
                'A legjobb fotó a kis híd korlátjáról készül, kicsit balra a fő nézőponttól',
                'Ha túl zsúfolt, a szomszédos Groenerei csatorna ugyanolyan szép, de turistamentes',
              ],
            },
          },
          {
            time: '17:30',
            title: '🍺 De Halve Maan sörfőzde',
            optional: true,
            desc: 'Bruges egyetlen még működő sörfőzdéje, 1856 óta! A Brugse Zot és a Straffe Hendrik sörök itt készülnek. Kóstolós túra ~€12/fő.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=De+Halve+Maan+Bruges',
              },
              { label: 'halvemaan.be', url: 'https://www.halvemaan.be/en' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc',
                url: 'https://www.google.com/maps/dir/Rozenhoedkaai+Bruges/De+Halve+Maan+Bruges',
              },
            ],
            guide: {
              history: [
                'A Maes család 1856 óta főz sört ezen a helyen — hat generáción át, ma Xavier Vanneste vezeti',
                '2016-ban 4 millió euróért építették meg a világ első sör-csővezetékét: 3 km hosszú, föld alatti cső a főzdétől a palackozóig — napi 6000 liter sör folyik benne',
                'A sör-csővezeték crowdfundinggal jött létre — aki befektetett, élete végéig ingyen sört kap',
              ],
              mustSee: [
                'A tetőterasz — a főzde tetejéről 360°-os kilátás Bruges-re, a Belfort-toronnyal szemben',
                'A főzési folyamat — a túra végigvezet a réz üstökön, hordókon és a modern palackozón',
                'A kóstolás — a túra végén egy Brugse Zot jár, a tetőteraszon',
              ],
              funFacts: [
                "A Brugse Zot ('Bruges-i Bolond') neve onnan ered, hogy Miksa császár bolondok házát ígért a bruges-ieknek, akik mindig ünnepeltek",
                "A Straffe Hendrik ('Erős Henrik') 11%-os — a legerősebb sörük, óvatosan!",
              ],
              tips: [
                'A túra 45 perc, utolsó indulás 16:00 — érdemes online foglalni hétvégén',
                'A gyerek limonádét kap a kóstolás helyett',
                'A sörüzletben palackozott Brugse Zot vihető haza ajándékba (~€4)',
              ],
            },
          },
          {
            time: '18:30',
            title: '🍽 Vacsora Bruges-ben',
            highlight: true,
            desc: 'Waterzooi vagy stoofvlees — a Markt-tól 1-2 utcával beljebb olcsóbb és autentikusabb. (~€15-22/fő)',
            guide: {
              mustSee: [
                {
                  text: 'De Stove (Kleine Sint-Amandsstraat 4) — intim, 20 ferőhelyes, hazi belga konyha, Google 4.6★ — foglalas ajanlott!',
                  url: 'https://maps.google.com/?q=De+Stove+Bruges',
                },
                {
                  text: 'Den Dyver (Dijver 5) — sorrel fozott fogasok, a csatorna partjan, Google 4.3★',
                  url: 'https://maps.google.com/?q=Den+Dyver+Bruges',
                },
                {
                  text: 'Cambrinus (Philipstockstraat 19) — 400+ belga sor + klasszikus etel, Google 4.2★',
                  url: 'https://maps.google.com/?q=Cambrinus+Bruges',
                },
                {
                  text: 'Tom Pouce (Burg 17) — a Burg teren, jo ar-ertek, gyerekbarat, Google 4.0★',
                  url: 'https://maps.google.com/?q=Tom+Pouce+Bruges',
                },
              ],
              tips: [
                'A Markt téri éttermek 30-50%-kal drágábbak — 1 utcányival beljebb ugyanazt kapjátok',
                'Stoofvlees = flamand marhapörkölt sörben párolva, fritekkel — a gyereknek is ízlik',
                'Foglaljatok előre ha szombat/vasárnap van — Bruges hétvégén tele van',
              ],
            },
          },
          {
            time: '20:00',
            title: '🚂 Vonat → Brüsszel',
            highlight: true,
            desc: 'Utolsó vonatok ~22:30-ig, bőven van idő. Holnap korai kelés Hollandiába (vonat 07:49) — ne maradjatok sokáig!',
            transport: [
              {
                type: 'walk',
                label: '🚶 ~15 perc → pályaudvar',
                url: 'https://www.google.com/maps/dir/Markt+Bruges/Brugge+Station',
              },
              {
                type: 'transit',
                label: '🚂 Vonat ~1 óra → Brussels-Midi',
                url: 'https://www.google.com/maps/dir/Brugge+Station/Brussels-Midi+Station',
              },
            ],
          },
        ],
        costs: [
          {
            item: 'Vonat Brüsszel↔Bruges retúr (4 felnőtt, gyerek ingyenes)',
            cost: '~€141',
          },
          { item: 'Csónaktúra', cost: '~€55' },
          { item: 'Belfort-torony (opcionális)', cost: '~€62' },
          { item: 'Étkezés + csokoládé', cost: '~€140–210' },
          { item: 'Nap 2 összesen', cost: '~€336–468', total: true },
        ],
      },
      {
        dayNum: 3,
        title: 'Hollandia — Keukenhof + Amszterdam',
        subtitle: 'Április 10. péntek — A nagy kaland!',
        images: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Keukenhof_Tulip_Gardens_1.JPG/960px-Keukenhof_Tulip_Gardens_1.JPG',
            caption: 'Keukenhof — 7 millió tulipán',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
            caption: 'Van Gogh — Csillagos éj',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Amsterdam_canals_in_summer.JPG/960px-Amsterdam_canals_in_summer.JPG',
            caption: 'Amszterdam csatornái',
          },
        ],
        tickets: [
          {
            label: 'Keukenhof kombi jegy (5 fő)',
            desc: 'Belépő + Bus 852 retúr · ápr. 10.',
            pdf: '/tickets/keukenhof-kombi.pdf',
          },
          {
            label: 'Vonat jegyek (oda + vissza)',
            desc: 'Eurocity 9527 + NS + Eurostar 9398',
            pdf: '/tickets/vonat-brusszel-amsterdam.pdf',
          },
          {
            label: 'Van Gogh Muzeum (5 fo)',
            desc: '4 felnott + 1 gyerek · apr. 10. · 17:15 slot',
            pdf: '/tickets/van-gogh-muzeum.pdf',
          },
          {
            label: 'Utasbiztositas',
            desc: 'Polita THS184041424',
            pdf: '/insurance/POLITA_THS184041424.pdf',
          },
        ],
        alerts: [
          {
            type: 'warning',
            text: 'Napi útvonal: Brüsszel-Midi → vonat → Amsterdam Zuid → metro → RAI/Europaplein → Bus 852 → Keukenhof → Bus 852 → Amszterdam (város) → Amsterdam Zuid → Schiphol → Eurostar → Brüsszel-Midi',
          },
        ],
        schedule: [
          {
            time: '06:30',
            title: '⏰ Ébresztő + reggeli',
            desc: 'Korai kelés, de egy nap alatt két ország — megéri! Gyors reggeli a szálláson vagy útközben.',
          },
          {
            time: '07:15',
            title: '🚇 Metro → Brüsszel-Midi',
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro Trône → Midi · ~8 perc',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Brussels-Midi+Station',
              },
            ],
          },
          {
            time: '07:49',
            title: '🚄 Eurocity Direct 9527 → Amsterdam Zuid',
            highlight: true,
            desc: 'Kocsiszám es helyjegy nincs — 2. osztály, szabad helyfoglalás. ~2h50 út, kiváló idő pihenésre vagy a nap tervezésére. A gyerek jegye ingyenes!',
            transport: [
              {
                type: 'transit',
                label:
                  '🚄 Eurocity Direct 9527 · ~2h50 · Bruxelles-Midi → Amsterdam Zuid',
                url: 'https://www.google.com/maps/dir/Brussels-Midi+Station/Amsterdam+Zuid+Station',
              },
            ],
          },
          {
            time: '~10:40',
            title: '📍 Érkezés Amsterdam Zuid',
            desc: 'Szálljatok le Amsterdam Zuid-on (NEM Centraal!). Innen 1 megálló metroval (M52) az Europaplein-re, ahol a Keukenhof busz indul.',
          },
          {
            time: '10:50',
            title: '🚇 Metro M52 → Europaplein',
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro M52 · 1 megálló · Amsterdam Zuid → Europaplein',
                url: 'https://www.google.com/maps/dir/Amsterdam+Zuid+Station/Europaplein+Amsterdam',
              },
            ],
          },
          {
            time: '11:00',
            title: '🚌 Bus 852 → Keukenhof',
            highlight: true,
            desc: 'KeukenhofBuzz 852-es busz, Europaplein megállóból. A kombi jegy (belépő + busz retúr) QR-kóddal a telefonon mutatható! Kövessétek a táblákat a RAI állomástól.',
            links: [{ label: 'keukenhof.nl', url: 'https://www.keukenhof.nl' }],
            transport: [
              {
                type: 'transit',
                label: '🚌 Bus 852 · ~40 perc · Europaplein → Keukenhof',
                url: 'https://www.google.com/maps/dir/Europaplein+Amsterdam/Keukenhof+Lisse',
              },
            ],
          },
          {
            time: '~11:40',
            title: '🌷 KEUKENHOF PARK',
            badges: ['JÁTSZÓTÉR'],
            desc: 'A világ legnagyobb virágoskertje! 32 hektáron 7 millió tulipán, jácint, nárcisz virágzik. Az üvegházakban orchideák és liliomok. A kislánynak: labirintus, játszótér, és a Juliana-pavilonban interaktív kiállítás. Tipp: a kert hátsó része csendesebb és legalább olyan szép! Ápr. 10 = péntek, kevesebb tömeg mint hétvégén.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Keukenhof+Lisse' },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Keukenhof_Tulip_Gardens_1.JPG/960px-Keukenhof_Tulip_Gardens_1.JPG',
                caption: 'Keukenhof - tulipanmezok',
              },
              history: [
                'A Keukenhof ("konyhakert") neve onnan ered, hogy a 15. században Jakoba von Bayern grófnő konyhakertje volt itt — innen szerezte be a fűszereket a Teylingen kastélyba',
                '1949-ben nyitotta meg a polgármester, hogy a holland virágkertészek kiállíthassák termékeiket — azóta évi 1.5 millió látogató jön',
                'A tulipánmánia (1637) idején egyetlen ritka tulipánhagymáért házat lehetett venni Amszterdamban — a világ első spekulatív buborékja volt',
                "A tulipán eredetileg Törökországból érkezett Hollandiába a 16. században — a neve a török 'tülbend' (turbán) szóból ered",
              ],
              mustSee: [
                'A Juliana-pavilon — a legnagyobb fedett virágkiállítás, orchideák és liliomok ezreivel',
                'A szélmalom — a park ikonikus jelképe, belsejébe fel lehet menni, onnan látni a végtelen tulipánmezőket',
                'A Keukenhof-kastély kertje (a park hátuljában) — kevésbé zsúfolt és gyönyörű angol kert stílusban',
                'Az Inspirációs Kertek — kis mintakertek amikből ötleteket meríthettek az otthoni kerthez',
              ],
              funFacts: [
                'Évente 7 millió virághagymát ültetnek el kézzel — 40 kertész 3 hónapig dolgozik az ültetésen (okt-dec)',
                'A park csak 8 hétig van nyitva (márc. közepe – máj. közepe) — ti pont a csúcsszezonban mentek!',
                '800 fajta tulipán virágzik egyszerre — némelyik tulipán olyan ritka, hogy csak itt látható',
                'A park területe 32 hektár — kb. 45 futballpálya méretű',
              ],
              tips: [
                'Menjetek azonnal a park hátuljába — mindenki a bejáratnál fotózik, hátul üres és ugyanolyan szép',
                'A labirintus és a játszótér a déli részen van — ha a kislány elfárad, oda menjetek',
                'Vigyetek elemózsiát — a park éttermeiben turista árak vannak',
                'Az üvegházak esős időben is tökéletesek',
              ],
            },
          },
          {
            time: '14:30',
            title: '🚌 Bus 852 → Amsterdam RAI vissza',
            desc: 'Utolsó busz RAI-ba 20:00, de ne késsetek — este még Amszterdam vár!',
            transport: [
              {
                type: 'transit',
                label: '🚌 Bus 852 · ~40 perc · Keukenhof → Europaplein/RAI',
                url: 'https://www.google.com/maps/dir/Keukenhof+Lisse/Europaplein+Amsterdam',
              },
            ],
          },
          {
            time: '15:15',
            title: '🍽 Ebéd: Albert Cuyp Piac',
            highlight: true,
            desc: 'Amszterdam legnagyobb utcai piaca, 1905 óta! 300+ stand: holland sajt (próbáljátok a trüffelsajtosat!), friss hering, stroopwafel (frissen sütve, meleg karamellel), kibbeling (rántott hal). Budget paradicsom! (~€8-12/fő)',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Albert+Cuyp+Market+Amsterdam',
              },
              {
                label: 'Wikipedia',
                url: 'https://en.wikipedia.org/wiki/Albert_Cuyp_Market',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~10 perc · séta a piactól',
                url: 'https://www.google.com/maps/dir/Europaplein+Amsterdam/Albert+Cuyp+Market+Amsterdam',
              },
            ],
            guide: {
              mustSee: [
                'Friss stroopwafel — meleg karamellás töltelékkel, frissen sütve az utcán (ne a bolti változatot vedd!)',
                'Holland haring (Hollandse Nieuwe) — a helyiek nyers hagymával eszik, a halat a farkánál fogva csúsztatják be a szájukba',
                'Kibbeling — rántott tőkehal-falatok remoulade szósszal, a holland fish & chips',
                "Gouda sajt kóstolás — a 'jong' (fiatal) krémes, az 'oud' (érett) pikáns; a trüffelös a gourmet-kedvencek",
              ],
              funFacts: [
                'A piacot Albert Cuyp holland festőről (1620-1691) nevezték el, aki a mindennapi holland életet festette',
                'Hétfőtől szombatig 300+ stand árul itt — ruha, elektronika, virág és persze étel',
                "A De Pijp negyed, ahol a piac van, Amszterdam multikulturális szíve — 'a Latin Quarter'-nek is hívják",
              ],
              tips: [
                'A piac végén (a Ferdinand Bolstraat felé) kevesebb a turista és olcsóbbak az árak',
                'A sajtkóstolás mindenhol ingyenes — ne szégyelljetek kérni!',
                'Vigyázzatok a biciklisekre a piac szélén — Amszterdamban a kerékpáros mindig elsőbbséget élvez',
              ],
            },
          },
          {
            time: '17:15',
            title: '🎨 Van Gogh Múzeum',
            desc: 'A világ legnagyobb Van Gogh gyűjteménye: 200+ festmény, 500 rajz. Napraforgók, Csillagos éj, Önarcképek... Az audio guide magyarul is elérhető. 18 év alatt INGYENES! Jegy MEGVAN, 17:15 slot. ~1.5-2 óra elég.',
            links: [
              {
                label: '📍 Múzeum oldala',
                url: 'https://www.vangoghmuseum.nl/en/visit/tickets',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~8 perc · séta a Museumplein felé',
                url: 'https://www.google.com/maps/dir/Albert+Cuyp+Market+Amsterdam/Van+Gogh+Museum+Amsterdam',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
                caption: 'Van Gogh - Csillagos ej',
              },
              history: [
                'Vincent van Gogh (1853-1890) mindössze 10 évet festett, de ez alatt 2100+ műalkotást készített — életében egyetlen egyet adott el',
                'A múzeum 1973-ban nyílt, Theo van Gogh (Vincent öccse) családjának adományából — Theo egész életében támogatta bátyját anyagilag és lelkileg',
                'Van Gogh élete tragikus volt: pszichiátriai problémák, szegénység, magány — 37 évesen öngyilkos lett Auvers-sur-Oise-ban',
                'Halála után Theo özvegye, Johanna van Gogh-Bonger tette világhírűvé — ő szervezte az első kiállításokat és adta ki a levelezését',
              ],
              mustSee: [
                'Napraforgók (1889) — a világ egyik legismertebb festménye, 7 változat létezik, itt van az egyik eredeti',
                'A hálószoba Arles-ban (1888) — Van Gogh saját szobáját festette, a ferde perspektíva szándékos',
                'Önarcképek sorozata — az 1. emeleten kronologikus sorrendben, láthatod ahogy a stílusa és mentális állapota változik',
                'Mandulavirágzás (1890) — újszülött unokaöccsének festette (akit szintén Vincentnek hívtak), gyönyörű japán hatás',
              ],
              funFacts: [
                'A Csillagos éj NEM itt van — az a New York-i MoMA-ban található! Viszont itt van a Csillagos éj a Rhône felett',
                "Van Gogh nem vágta le a fülét teljesen — csak a fülcimpáját, és egy 'Rêve' nevű bordélyházban hagyta egy nőnél",
                'Életében egyetlen festményét adta el: A vörös szőlőskert (400 frankért) — ma a művei 100+ millió dollárt érnek',
                'A múzeum a világ leglátogatottabb egyszemélyes művészeti múzeuma — évi 2.1 millió látogató',
              ],
              tips: [
                'Az audio guide (€5) megéri — Van Gogh leveleiből idéz, amik megmagyarázzák a festmények mögötti érzelmeket',
                'A 2. emelet kronológiai, a 0. emelet tematikus — ha kevés az időtök, a 2. emelet a legfontosabb',
                'A múzeumshop-ban gyönyörű reprodukciók kaphatók — tökéletes ajándék',
              ],
            },
          },
          {
            time: '~19:00',
            title: '🚶 Jordaan negyed & grachtok',
            badges: ['INGYENES'],
            desc: 'Amszterdam leghangulatosabb negyede! Szűk utcák, vintage boltok, galériák, kávézók. A grachtok (csatornák) UNESCO Világörökségek — a 17. századi Aranykorban építették. Csak sétáljatok és szívjátok be a holland hangulatot!',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Jordaan+Amsterdam' },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jordaan' },
            ],
            transport: [
              {
                type: 'transit',
                label: '🚋 Villamos · ~10 perc',
                url: 'https://www.google.com/maps/dir/Van+Gogh+Museum+Amsterdam/Jordaan+Amsterdam',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Amsterdam_canals_in_summer.JPG/960px-Amsterdam_canals_in_summer.JPG',
                caption: 'Jordaan - amszterdami csatornahazak',
              },
              history: [
                'A Jordaan eredetileg munkásnegyed volt a 17. században — a francia hugenották és más menekültek települtek ide',
                "A név valószínűleg a francia 'jardin' (kert) szóból ered, mert a területet kertekre és csatornákra osztották",
                'A grachtenrendszert (csatornarendszert) az 1600-as években építették az Aranykorban — a világ legambiciózabb városrendezési projektje volt',
                '2010-ben a grachtöv UNESCO Világörökség lett — a Herengracht, Keizersgracht és Prinsengracht a három fő csatorna',
              ],
              mustSee: [
                'A Brouwersgracht és Prinsengracht sarka — Amszterdam legtöbbet fotózott csatornakereszteződése',
                "A '9 Straatjes' (9 kis utca) — vintage boltok, independent designerek, kávézók",
                "A házak homlokzatai: figyelj a díszes oromzatokra és a 'gevelstenen' (homlokzati kövek) — régen így azonosították a házakat, mert nem voltak házszámok",
                'Az Anne Frank Ház a Prinsengracht 263-ban van — kívülről érdemes megnézni (belülre hónapokkal előre kell jegyet venni)',
              ],
              funFacts: [
                'Az amszterdami házak azért dőlnek előre, mert szándékosan így építették — a horoggerendával (hijsbalk) könnyebb volt a bútorokat felhúzni a szűk lépcsőház helyett',
                'Amszterdam 1281 híddal rendelkezik — több mint Velence!',
                'A csatornákban ~15.000 bicikli nyugszik a víz alatt — évente 8000-et halásznak ki',
                'A házhajók (woonboten) száma kb. 2500 — a várakozási lista egy helyre akár 10 év is lehet',
              ],
              tips: [
                'A legjobb fotók a hidakról készülnek, különösen az Herengracht-on',
                'Vigyázzatok a biciklisekre! Amszterdamban a bringás király — a gyalogos tér az a vékony csík a fal mellett',
                "A kávézókban a 'koffie verkeerd' (rossz kávé) = café latte — ne lepődjetek meg a nevén",
              ],
            },
          },
          {
            time: '19:15',
            title: '💐 Bloemenmarkt — Úszó virágpiac',
            optional: true,
            desc: 'A világ egyetlen úszó virágpiaca 1862 óta! A Singel csatornán álló bárkákon tulipánhagymákat, virágokat, holland szuveníreket árulnak. Vigyetek haza tulipánhagymákat — áprilisban ültethetitek!',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Bloemenmarkt+Amsterdam',
              },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bloemenmarkt' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~12 perc · séta a csatornák mentén délre',
                url: 'https://www.google.com/maps/dir/Jordaan+Amsterdam/Bloemenmarkt+Amsterdam',
              },
            ],
            guide: {
              history: [
                '1862-ben alapították — a kereskedők eredetileg csónakkal hozták a virágokat a közeli kertészetekből, és a bárkákról árulták',
                'A Singel csatorna mentén található, a Koningsplein és a Muntplein között — Amszterdam egyik legrégebbi piaca',
              ],
              mustSee: [
                'A tulipánhagyma standok — rengeteg fajta kapható, csomagolva, EU-n belül hazavihető',
                'A fából készült tulipán szuvenírek — klasszikus holland ajándék',
                'A csatorna felőli oldal — innen látni hogy a standok valóban bárkákon állnak',
              ],
              funFacts: [
                "Bár 'úszó piac'-nak hívják, a bárkák valójában rögzítettek és nem mozognak — de technikailag a vízen vannak",
                'A piac ma inkább turista látványosság mint helyi virágpiac — a hollandok az Albert Cuyp-on vagy online vásárolnak',
              ],
              tips: [
                "Tulipánhagymát CSAK 'EU export approved' matricával vegyetek — különben a reptéri vám elkobozhatja",
                'Az árak alkudhatók ha többet vesztek — különösen záróra előtt (17:30)',
              ],
            },
          },
          {
            time: '19:30',
            title: '🌳 Vondelpark',
            optional: true,
            badges: ['INGYENES', 'GYEREKBARÁT'],
            desc: 'Amszterdam Central Parkja — 47 hektáron tavak, rétek, játszóterek, kávézók. A kislány végre szabadon rohangálhat! Ha szép az idő, a hollandok piknikeznek a fűben.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Vondelpark+Amsterdam',
              },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Vondelpark' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~10 perc · séta nyugat felé',
                url: 'https://www.google.com/maps/dir/Bloemenmarkt+Amsterdam/Vondelpark+Amsterdam',
              },
            ],
            guide: {
              history: [
                '1865-ben nyitották meg, Joost van den Vondel holland költőről (1587-1679) nevezték el — az ő szobra áll a park bejáratánál',
                'Eredetileg lovaglópark volt a gazdag amszterdamiak számára — ma évi 10 millió látogató jön',
              ],
              mustSee: [
                'A nagy játszótér a park közepén — csúszdák, mászókák, homokozó',
                'A Groot Melkhuis kávézó — terasz a tó mellett, gyerekbarát',
                'A Vondelpark Openluchttheater — nyári szabadtéri előadások (ingyenes!)',
              ],
              funFacts: [
                'A park 47 hektáros — kb. 66 futballpálya méretű, Amszterdam legnagyobb parkja',
                'Kb. 100 féle fa él a parkban és rengeteg papagáj — igen, vadon élő zöld papagájok Amszterdamban!',
              ],
              tips: [
                'A park déli bejárata (Museumplein felől) a legközelebbi a Van Gogh Múzeumtól',
                'Szép időben a hollandok piknikeznek — vigyetek magatok is nassolnivalót',
              ],
            },
          },
          {
            time: '19:30',
            title: '🍺 Teraszozás egy gracht mellett',
            highlight: true,
            desc: 'Holland sör (Heineken, Amstel, vagy craft sör), bitterballen (rántott húsgolyó — a holland snack!), és a csatorna felett alkonyat. Ez AZ amszterdami élmény. (~€5-8/fő)',
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc · séta a Leidseplein felé',
                url: 'https://www.google.com/maps/dir/Vondelpark+Amsterdam/Leidseplein+Amsterdam',
              },
            ],
          },
          {
            time: '19:45',
            title: '📍 Dam tér + Királyi Palota',
            optional: true,
            badges: ['INGYENES'],
            desc: 'Amszterdam központi tere a 17. századi Királyi Palotával. A palota 13.659 facölöpön áll (igen, tizenháromezer)! Este gyönyörűen kivilágított.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Dam+Square+Amsterdam',
              },
              { label: 'paleisamsterdam.nl', url: 'https://www.paleisamsterdam.nl/en' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~15 perc · séta a Jordaan-on át',
                url: 'https://www.google.com/maps/dir/Leidseplein+Amsterdam/Dam+Square+Amsterdam',
              },
            ],
            guide: {
              history: [
                'A Dam tér neve a 13. századi gátról (dam) ered, amit az Amstel folyón építettek — innen az Amsterdam név is (Amstel + dam)',
                'A Királyi Palota (Koninklijk Paleis) 1655-ben épült városházaként — Napóleon öccse, Lajos király alakította királyi palotává 1808-ban',
                'A Nemzeti Emlékmű (National Monument) a tér közepén a II. világháborús áldozatoknak állít emléket (1956)',
              ],
              mustSee: [
                'A Királyi Palota homlokzata — holland klasszicista remekmű, a timpanon felett Atlas tartja a világot',
                'A Nationale Monument — 22 méter magas obeliszk, minden május 4-én itt tartják a nemzeti megemlékezést',
                'A Madame Tussauds (a tér sarkán) — ha a kislány szereti a viaszfigurákat',
              ],
              funFacts: [
                'A palota 13.659 facölöpön áll — ezeket 18 méter mélyre verték a homokos talajba, a sziklaalapig',
                'A palota padlóján a márványba vésett térképeken az egész világ látható — a holland Aranykor ambícióit tükrözi',
                'A Dam téren tartják az éves karácsonyi vásárt és a Koningsdag (Király Napja, ápr. 27) ünnepségeket',
              ],
              tips: [
                'A palota belülről is látogatható (€12.50) de csak bizonyos napokon — nézd meg a weboldalon',
                'A tér körül sok turista csapda étterem van — inkább a mellékutcákban egyetek',
              ],
            },
          },
          {
            time: '20:00',
            title: '🚇 Metro → Amsterdam Zuid',
            desc: 'Ideje indulni Schiphol fele! Metro M52 bármelyik központi megállóból Amsterdam Zuid-ra.',
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro M52 · ~10 perc → Amsterdam Zuid',
                url: 'https://www.google.com/maps/dir/Dam+Square+Amsterdam/Amsterdam+Zuid+Station',
              },
            ],
          },
          {
            time: '20:15',
            title: '🚂 NS vonat → Schiphol Airport',
            desc: 'Amsterdam Zuid-ról Schiphol-ra ~5-10 perc vonattal. Az NS jegy QR-kóddal a telefonon mutatható.',
            transport: [
              {
                type: 'transit',
                label: '🚂 NS Sprinter · ~7 perc · Amsterdam Zuid → Schiphol Airport',
                url: 'https://www.google.com/maps/dir/Amsterdam+Zuid+Station/Schiphol+Airport',
              },
            ],
          },
          {
            time: '20:30',
            title: '📍 Érkezés Schiphol Airport',
            desc: '21:07-ig kell ott lennetek (Eurostar check-in)! Kövessétek a Eurostar jelzéseket a reptéren belül. Van idő még gyorsan vásárolni a Schiphol Plaza-ban.',
          },
          {
            time: '21:27',
            title: '🚄 Eurostar 9398 → Brussels Midi',
            highlight: true,
            desc: 'Schiphol Airport-ról direkt Brüsszelbe! Coach 16, helyek: 45-48, 54. PNR: NVDGPK. ~1h40 kényelmes út — aludni is lehet!',
            transport: [
              {
                type: 'transit',
                label: '🚄 Eurostar 9398 · 1h39 · Schiphol → Brussels Midi',
                url: 'https://www.google.com/maps/dir/Schiphol+Airport/Brussels-Midi+Station',
              },
            ],
          },
          {
            time: '23:06',
            title: '🏠 Érkezés Brüsszel-Midi',
            desc: 'Metro Midi → Trône, onnan séta a szállásra. Fáradtan, de tele élményekkel!',
          },
        ],
        costs: [
          {
            item: 'Eurocity Direct oda (2 adult €33 + 2 youth €27 + gyerek ingyen)',
            cost: '€120',
          },
          {
            item: 'Keukenhof kombi jegy (belépő + Bus 852 retúr, 4 felnőtt + 1 gyerek)',
            cost: '€171.50',
          },
          {
            item: 'Amsterdam Zuid → Schiphol NS jegy (4 × €3.70 + gyerek ingyen)',
            cost: '€14.80',
          },
          {
            item: 'Eurostar vissza (2 adult €35 + 2 youth €28 + gyerek €17)',
            cost: '€143',
          },
          { item: 'Van Gogh Muzeum (4 felnott x €25, gyerek ingyenes!)', cost: '€100' },
          { item: 'Amsterdam metro napijegy', cost: '~€20' },
          { item: 'Étkezés (ebéd + terasz + snack)', cost: '~€80–120' },
          { item: 'Nap 3 összesen', cost: '~€649–669', total: true },
        ],
        endAlerts: [
          {
            type: 'tip',
            text: '🎫 Vonat + Keukenhof + Eurostar + Van Gogh jegyek MEGVANNAK! PDF-ek a telefonon. Eurostar PNR: NVDGPK',
          },
        ],
      },
      {
        dayNum: 4,
        title: 'Gent — Lovagvárak és street art',
        subtitle: 'Április 11. szombat — Hétvégi vonatkedvezmény!',
        images: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Grasbrug_en_Graslei.JPG/960px-Grasbrug_en_Graslei.JPG',
            caption: 'Graslei — Gent szíve',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gravensteen_Gent_vanuit_MIAT.JPG/960px-Gravensteen_Gent_vanuit_MIAT.JPG',
            caption: 'Gravensteen — Grófok Vára',
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Belgio_-_Gand_-_ponte_San_Michele%2C_chiesa_San_Michele_e_fiume_Lys.jpg/960px-Belgio_-_Gand_-_ponte_San_Michele%2C_chiesa_San_Michele_e_fiume_Lys.jpg',
            caption: 'Sint-Michielsbrug — 3 torony',
          },
        ],
        alerts: [
          {
            type: 'tip',
            text: '💰 SZOMBAT = hétvégi jegy! Fél áron! Brussels→Gent retúr: ~€8.80/fő (€17.60 helyett). 12 év alatti gyerek INGYENES!\n💡 Gent centruma gyalogosan bejárható! Csak a pályaudvar↔centrum villamos kell (~15 perc).',
          },
        ],
        schedule: [
          {
            time: '09:00',
            title: '☕ Reggeli — nyugisan',
            desc: 'Ma nem kell rohanni! Tegnap Hollandia, ma Gent — nyugisabb tempó. (~€5-8/fő)',
            guide: {
              mustSee: [
                'Ugyanazok mint korábban: Le Pain Quotidien, Charli, OR Coffee',
                'Vagy valami újat: Cafe Novo (Rue de Namur 78) — lokális kedvenc, Google 4.4★',
                'Ha hétvége: a Place du Châtelain piacán reggeli (szombat 7-14h, 15 perc séta)',
              ],
            },
          },
          {
            time: '10:00',
            title: '🚂 IC vonat → Gent',
            highlight: true,
            transport: [
              {
                type: 'transit',
                label: '🚂 Vonat · ~28 perc · Brussels-Midi → Gent-Sint-Pieters',
                url: 'https://www.google.com/maps/dir/Brussels-Midi+Station/Gent-Sint-Pieters+Station',
              },
            ],
          },
          {
            time: '10:30',
            title: '📍 Érkezés + villamos a centrumba',
            transport: [
              {
                type: 'transit',
                label: '🚋 Villamos 1 · ~15 perc → Korenmarkt',
                url: 'https://www.google.com/maps/dir/Gent-Sint-Pieters+Station/Korenmarkt+Gent',
              },
            ],
          },
          {
            time: '10:45',
            title: '⛪ Sint-Baafskathedraal (Szent Bavó-katedrális)',
            desc: 'A katedrális maga INGYENES és lenyűgöző gótikus belső. A fő attrakció: A Genti Oltár (Van Eyck testvérek, 1432) — az olajfestészet egyik legnagyobb mestermű! A Monuments Men csapata mentette meg a náci bányából a II. világháborúban. Opcionális belépő: €16/fő.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Sint-Baafskathedraal+Gent',
              },
              {
                label: 'Wikipedia',
                url: 'https://hu.wikipedia.org/wiki/Sint-Baafskathedraal',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~2 perc · a Korenmarkt sarkán',
                url: 'https://www.google.com/maps/dir/Korenmarkt+Gent/Sint-Baafskathedraal+Gent',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gent_Sint-Baafskathedraal-PM_07041.jpg/960px-Gent_Sint-Baafskathedraal-PM_07041.jpg',
                caption: 'Sint-Baafskathedraal - a Genti Oltar otthona',
              },
              history: [
                'A katedrális a 10. századig nyúlik vissza — az eredeti Szent János-templom helyén épült, a jelenlegi gótikus épület a 14-16. századból való',
                'A Genti Oltár (Het Lam Gods, az Isten Báránya) Jan és Hubert van Eyck 1432-es főműve — a nyugati festészet egyik legfontosabb műalkotása, az olajfestés technikájának úttörője',
                'Az oltárt 13-szor lopták el vagy vették el: Napóleon, a kálvinisták, Hitler mind birtokolták — a nácik az ausztriai Altaussee sóbányában rejtették el',
                'A Monuments Men — az a szövetséges egység akik a II. vh-ban a műkincseket mentették — innen hozták vissza az oltárt 1945-ben (erről szól a George Clooney-film is)',
              ],
              mustSee: [
                'A Genti Oltár (€16 belépő, DE megéri!) — 12 panelből áll, kinyitva 3.5 × 5.2 méter, a részletek hihetetlenek: minden egyes gyöngyszemet, fűszálat, drágakövet megfestettek',
                "Az 'Ádám és Éva' panelek — a művészettörténet első realisztikus meztelen aktjai",
                'A katedrális kriptája — középkori freskómaradványok a föld alatt',
                "Rubens 'Szent Bavó kolostorba lépése' — a barokk mester egyik fő műve itt van",
              ],
              funFacts: [
                'A Genti Oltár a világ legtöbbször ellopott műalkotása — egy panelt (Az Igazságos Bírák) 1934-ben lopták el és sosem került elő; ami ma ott van, másolat',
                'A Van Eyck testvérek olyan apró részleteket festettek, hogy a szabad szemmel láthatatlan szövegek is olvashatók mikroszkóp alatt',
                'V. Károly császár (aki Gentben született) itt keresztelkedett meg 1500-ban',
                'Az oltár teljes restaurálása 2012-ben kezdődött és 2024-ben fejeződött be — 12 év munka!',
              ],
              tips: [
                'Az oltár megtekintése időpontra szól — online érdemes foglalni, különösen hétvégén',
                'A katedrális többi része ingyenes — a gótikus oszlopok és üvegablakok önmagukban is lenyűgözőek',
                'Az audio guide (€4) nagyon részletesen mesél az oltárról — megéri ha nincs időtök a teljes kiállításra',
              ],
            },
          },
          {
            time: '11:30',
            title: '🏛 Graslei & Korenlei',
            badges: ['INGYENES'],
            desc: 'Gent legikonikusabb helyszíne! A Leie folyó két partján középkori céhházak sorakoznak — a gabonakereskedők, kőműves és mérlegelők céhháza mind itt van. A 12-13. századi homlokzatok Európa legjobb állapotban megmaradt középkori rakpartjai.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Graslei+Gent' },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Graslei' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~3 perc · a katedrálistól',
                url: 'https://www.google.com/maps/dir/Sint-Baafskathedraal+Gent/Graslei+Gent',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Grasbrug_en_Graslei.JPG/960px-Grasbrug_en_Graslei.JPG',
                caption: 'Graslei - kozepkori cehhazak a Leie folyo partjan',
              },
              history: [
                'A Graslei (Fű-rakpart) és Korenlei (Gabona-rakpart) Gent középkori kikötője volt — innen indult a gabona, gyapjú és fűszer kereskedelme egész Európába',
                'A céhházak a 12-15. századból valók — minden céh (gabonakereskedők, kőművesek, mérlegelők) saját díszes székházat épített a gazdagságát fitogtatva',
                'Gent a középkorban Párizs után Európa második legnagyobb városa volt — a textilipar tette gazdaggá',
              ],
              mustSee: [
                'A Korenmetershuis (1698) — a gabona-mérők céhháza, barokk homlokzattal és szóró gabona-díszítéssel',
                'A Gildehuis van de Vrije Schippers (Szabad Hajósok Háza) — a legrégebbi, román kori (12. sz.)',
                'Az egész sort a Korenlei-oldalról fotózd — a Graslei homlokzatai a legdíszesebbek',
                'Alkonyatkor a kivilágított homlokzatok tükröződése a Leie vizében — lenyűgöző',
              ],
              funFacts: [
                'Gent Belgiumból a legtöbb Michelin-csillagos étteremmel rendelkező város lakosságarányosan',
                'A Graslei teraszai nyáron 23:00-ig tele vannak egyetemistákkal — Gent 70.000 diák városa',
                "Csütörtökön 'Veggiedag' (Vegetáriánus Nap) van Gentben — a világ első városa ahol hivatalosan bevezették",
              ],
              tips: [
                'A legjobb fotó a Sint-Michielsbrug-ról (5 perc séta) — innen látni a teljes panorámát',
                'A teraszok a Graslei-n drágábbak — a Korenlei-oldalon ugyanaz a kilátás, de olcsóbb a sör',
                '40 perces csónaktúrák indulnak a Graslei-tól (~€9/fő) — más perspektívából mutatja a várost',
              ],
            },
          },
          {
            time: '12:00',
            title: '⚔️ Gravensteen (Grófok Vára)',
            highlight: true,
            badges: ['GYEREKBARÁT'],
            desc: 'Igazi lovagvár a város közepén! 1180-ban építette I. Fülöp flandriai gróf a keresztes háborúk szíriai erődítményei mintájára. Vastag falak, tornyok, vizesárok — a kislány ODALESZ! Belül fegyverkiállítás és börtöncellák. A tetőről panoráma kilátás egész Gentre. €12/felnőtt, €2/gyerek.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Gravensteen+Gent' },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Gravensteen' },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~4 perc · a Graslei-tól',
                url: 'https://www.google.com/maps/dir/Graslei+Gent/Gravensteen+Gent',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gravensteen_Gent_vanuit_MIAT.JPG/960px-Gravensteen_Gent_vanuit_MIAT.JPG',
                caption: 'Gravensteen - Grofok Vara',
              },
              history: [
                "I. Fülöp (Fülöp d'Alsace) flandriai gróf 1180-ban építtette a szíriai Krak des Chevaliers keresztes erőd mintájára — az egyik legjobban megmaradt középkori vizesárkos vár Európában",
                'A vár 900 éves története során volt grófi rezidencia, börtön, pénzverde, gyapjúraktár és még gyár is — a 19. században textilmunkások dolgoztak a falai között',
                "1885-ben a város megvette és restaurálta — a gentiek korábban le akarták bontani, mert 'csúfnak' tartották",
                "1949-ben diáktüntetés volt a vár előtt a sörárak emelése ellen — azóta a gentiek büszkén emlegetik mint a 'sörlázadás' helyszínét",
              ],
              mustSee: [
                'A tetőterasz — 360°-os panoráma egész Gentre, a három torony és a Leie folyó',
                'A fegyvergyűjtemény — középkori kardok, páncélok, számszeríjak; a kislánynak lovagi élmény',
                'A kínzókamra kiállítás — a középkori büntetések (guillotine, kaloda) bemutatása; ijesztő, de lenyűgöző',
                'A vizesárok és a felvonóhíd — a vár bejárata már önmagában kaland a kislánynak',
              ],
              funFacts: [
                'A vár audio guide-ja szándékosan humoros — szarkasztikus megjegyzésekkel kíséri végig a középkori kínzási módszereket',
                'A Gravensteen Flandria egyetlen megmaradt középkori vizesárkos vára ami a város közepén áll — nem a külvárosban',
                "Az 1949-es 'sörlázadás' során a diákok elfoglalták a várat és sörtől csöpögő zászlókat tűztek ki a toronyra",
                'A vár falai 2 méter vastagok — eredeti állapotukban maradtak meg',
              ],
              tips: [
                'Az audio guide (a jegyárban benne van) nagyon szórakoztató — halkan nevetni fogtok a szarkasztikus narrátoron',
                'A lépcsők meredekek és szűkek — kényelmes cipő kötelező, a kislányt fogjátok kézen',
                'Kb. 1-1.5 óra a teljes bejárás — a tetőre mindenképp menjetek fel',
              ],
            },
          },
          {
            time: '13:00',
            title: '🍲 Ebéd — Gentse Waterzooi',
            desc: "Gent saját fogása! Krémes csirke (eredetileg hal) ragu zöldségekkel és tejszínes lével. A név 'forró víz'-et jelent gentül. (~€12-18/fő)",
            links: [
              {
                label: 'Magyar Wiki: Waterzooi',
                url: 'https://hu.wikipedia.org/wiki/Waterzooi',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~3 perc · a vár mellett',
                url: 'https://www.google.com/maps/dir/Gravensteen+Gent/Patershol+Gent',
              },
            ],
            guide: {
              mustSee: [
                {
                  text: "'t Klokhuys (Corduwaniersstraat 65, Patershol) — hangulatos kozepkori haz, kivalo waterzooi, Google 4.4★",
                  url: 'https://maps.google.com/?q=t+Klokhuys+Gent',
                },
                {
                  text: 'Pakhuis (Schuurkenstraat 4) — ipari loft etterem, modern belga konyha, Google 4.1★',
                  url: 'https://maps.google.com/?q=Pakhuis+Gent',
                },
                {
                  text: 'Amadeus (Plotersgracht 8, Patershol) — spare ribs specialista, all-you-can-eat, Google 4.3★',
                  url: 'https://maps.google.com/?q=Amadeus+Patershol+Gent',
                },
                {
                  text: 'Bij Sint-Jacobs (Bij Sint-Jacobs 15) — bolhapiac mellett, autentikus, Google 4.3★',
                  url: 'https://maps.google.com/?q=Bij+Sint-Jacobs+Gent',
                },
              ],
              tips: [
                'A Patershol éttermei a hangulatos választás — középkori házakban, a vár mellett',
                'Csirke waterzooi a népszerűbb, hal waterzooi az eredeti — mindkettő isteni',
                'Ha a kislány nem szereti: bőven van pasta, steak, krokett is a menükben',
                'Szombaton a Groentenmarkt melletti standokon street food ebéd is opció (~€6-8/fő)',
              ],
            },
          },
          {
            time: '14:00',
            title: '🍬 Cuberdons kóstolás',
            desc: 'Gent titkos különlegessége! Lila kúp alakú gumicukor, kívül kemény, belül lágy málnás töltelék. A Groentenmarkt-on két rivális cuberdon-árus háborúzik egymással évek óta — mindkettőt próbáljátok ki! (~€3-5/zacskó)',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Groentenmarkt+Gent',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~2 perc · a Groentenmarkt-on',
                url: 'https://www.google.com/maps/dir/Patershol+Gent/Groentenmarkt+Gent',
              },
            ],
            guide: {
              history: [
                "A cuberdon (neuzekes = 'orrocskák' flamandul) a 19. század közepén született Gentben — egy gyógyszerész találta fel véletlenül, miközben köhögés elleni cukorkát próbált készíteni",
                "A Groentenmarkt-on évtizedek óta 'háborúzik' két rivális árus — nem beszélnek egymással, de egymás mellett árulnak",
              ],
              mustSee: [
                'A két rivális stand a Groentenmarkt-on — mindkettőnél kóstoljatok, és döntsétek el melyik jobb',
                'A készítés — ha szerencsétek van, látjátok ahogy a friss cuberdont formázzák',
              ],
              funFacts: [
                'A cuberdon receptje titkos — a pontos összetételt minden gyártó féltve őrzi',
                'Csak frissen finom — 3 héten belül meg kell enni, mert a belső töltelék megszilárdul',
                'Gentben próbálkoztak cuberdon-ízű sörrel, likőrrel és jégkrémmel is',
              ],
              tips: [
                'A klasszikus íz a málnás (lila) — de vannak exotikus változatok: mango, mojito, cola',
                'Zacskóban vihetők haza, de 2-3 héten belül egyétek meg',
              ],
            },
          },
          {
            time: '14:30',
            title: '🏘 Patershol negyed',
            badges: ['INGYENES'],
            desc: 'Gent legrégebbi lakónegyede — szűk középkori sikátorok, macskakövek, rejtett kávézók. A 11. századig visszanyúló utcahálózat labirintusszerű. A Gravensteen-tól pár lépés.',
            links: [
              { label: '📍 Térkép', url: 'https://maps.google.com/?q=Patershol+Gent' },
              { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Patershol' },
            ],
            guide: {
              history: [
                'Gent legrégebbi lakónegyede, a 11. századig nyúlik vissza — a név a karmelita atyákról (paters) ered, akiknek kolostora itt állt',
                'A középkorban a bőripar központja volt — a cserzőműhelyeknek kellett a közeli Leie folyó vize',
                'Az 1980-as években majdnem lebontották városfejlesztés címén — a lakók tiltakozása mentette meg',
              ],
              mustSee: [
                'A szűk sikátorok — Kraanlei, Plotersgracht, Corduwaniersstraat: középkori utcanevek, macskakő, rejtett sarkok',
                'Az éttermek — a hangulatos középkori házakban ma Gent legjobb éttermei működnek',
                'A Gravensteen falai a Patershol felől — innen a legjobb a várra a fotó',
              ],
              tips: [
                'Csak sétáljatok és fedezzétek fel — nincs konkrét látnivaló, maga a negyed az élmény',
                'Az éttermek itt drágábbak de autentikusabbak — ha Gentben akartok vacsorázni, ide gyertek',
              ],
            },
          },
          {
            time: '15:00',
            title: '📸 Sint-Michielsbrug (Szent Mihály híd)',
            badges: ['INGYENES'],
            desc: 'Gent LEGJOBB panoráma pontja! Innen egyszerre látni a három tornyot: Sint-Niklaaskerk, Belfort és Sint-Baafskathedraal — egyetlen fényképen. Este kivilágítva még szebb. Kötelező fotó!',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Sint-Michielsbrug+Gent',
              },
              {
                label: 'Wikipedia',
                url: 'https://en.wikipedia.org/wiki/St_Michael%27s_Bridge',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~5 perc · a Graslei-tól',
                url: 'https://www.google.com/maps/dir/Patershol+Gent/Sint-Michielsbrug+Gent',
              },
            ],
            guide: {
              image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Belgio_-_Gand_-_ponte_San_Michele%2C_chiesa_San_Michele_e_fiume_Lys.jpg/960px-Belgio_-_Gand_-_ponte_San_Michele%2C_chiesa_San_Michele_e_fiume_Lys.jpg',
                caption: 'Sint-Michielsbrug - a harom torony',
              },
              mustSee: [
                "A 'három torony' egy vonalban: Sint-Niklaaskerk (13. sz.), Belfort (14. sz.), Sint-Baafskathedraal (15. sz.) — egyetlen fotón három század építészete",
                'A Sint-Michielskerk (mellette) — befejezetlen toronnyal; a pénz elfogyott, és sosem építették meg a tervezett csúcsot',
                'Alkonyatkor a tornyok kivilágítása — Gent fénytervét egy világszínvonalú tervező készítette, minden torony más színben ragyog',
              ],
              funFacts: [
                "A három torony 'Gent koronájának' is hívják — a város címerében is megjelenik",
                'A Belfort-torony csúcsán egy arany sárkány ül — a legenda szerint a keresztesek hozták Konstantinápolyból',
                'Gent a legtöbb műemlékkel rendelkező belga város — több mint 10.000 védett épülete van',
              ],
              tips: [
                'A legjobb fotó a híd közepéről készül, kelet felé nézve (délután a fény is ideális)',
                'Este 21:00 után a kivilágítás különösen szép — ha Gentben vacsoráztok, sétáljatok vissza ide',
              ],
            },
          },
          {
            time: '15:30',
            title: '🍺 Terász a Graslei-n',
            desc: 'Genti Gruut sör (egyedi: fűszerekkel készül, komló nélkül — visszanyúl a középkori sörhagyományhoz). A Graslei teraszán ülni a legszebb hely Gentben, különösen ha süt a nap. (~€4-6/fő)',
          },
          {
            time: '16:00',
            title: '🎨 Graffiti Street (Werregarenstraat)',
            badges: ['INGYENES', 'GYEREKBARÁT'],
            desc: 'Gent egyetlen legális graffiti utcája! Minden fal, ajtó és ablak tele van színes street art-tal — hetente változik. A kislány imádni fogja a színeket! Kb. 100 méter hosszú, de minden négyzetcenti tele van.',
            links: [
              {
                label: '📍 Térkép',
                url: 'https://maps.google.com/?q=Werregarenstraat+Gent',
              },
              {
                label: 'Wikipedia',
                url: 'https://en.wikipedia.org/wiki/Werregarenstraat',
              },
            ],
            transport: [
              {
                type: 'walk',
                label: '🚶 ~3 perc · a Graslei-tól',
                url: 'https://www.google.com/maps/dir/Graslei+Gent/Werregarenstraat+Gent',
              },
            ],
            guide: {
              history: [
                '1995-ben a város legálissá nyilvánította az utcát graffiti számára — így a street art művészek szabadon alkothatnak anélkül hogy illegálisan festenének',
                "Gent a belga street art mozgalom központja — a 'Sorry, Not Sorry' street art fesztivált évente itt rendezik meg",
                'Az utca folyamatosan változik — a régi műveket újak fedik le, így soha nem ugyanaz a látvány',
              ],
              mustSee: [
                'A teljes utca — kb. 100 méter, de minden négyzetcentiméter tele van; a padlót, ajtókat, ablakokat is belefestik',
                'Keressétek a politikai üzenetű és humoros alkotásokat — a legjobb darabok a falak felső részén vannak',
                'A mellékutcákban is van street art — a környező sikátorok szintén tele vannak, csak kevésbé sűrűn',
              ],
              funFacts: [
                'A graffitik élettartama néhány naptól pár hónapig terjed — amit ma láttok, jövőre már nem lesz ott',
                'Néha neves nemzetközi street art művészek is idejönnek festeni — ROA (a genti óriás állatfestő) innen indult',
                'ROA, a világhírű genti művész fekete-fehér állatokat fest épületek oldalára szerte a világon — a városban több műve is látható a Graffiti Street-en kívül',
              ],
              tips: [
                'Menj végig az egész utcán lassan — a részletek csak közelről látszanak',
                'Tökéletes fotóháttér — a kislány a színes falak előtt szuper képet ad',
                'A bejárat a Hoogpoort utcából nyílik, a Korenmarkt közelében',
              ],
            },
          },
          {
            time: '16:30',
            title: '🛍 Utolsó séta + vásárlás',
            desc: 'Cuberdons haza, genti csoki, esetleg a Tierenteyn-Verlent mustárboltja (1790 óta!). Gent maga a szuvenír.',
          },
          {
            time: '17:30',
            title: '🚂 Vonat → Brüsszel',
            highlight: true,
            transport: [
              {
                type: 'transit',
                label: '🚋 Villamos · ~15 perc → pályaudvar',
                url: 'https://www.google.com/maps/dir/Korenmarkt+Gent/Gent-Sint-Pieters+Station',
              },
              {
                type: 'transit',
                label: '🚂 Vonat · ~28 perc → Brussels-Midi',
                url: 'https://www.google.com/maps/dir/Gent-Sint-Pieters+Station/Brussels-Midi+Station',
              },
            ],
          },
          {
            time: '18:15',
            title: '📦 Pakolás a szálláson',
            desc: 'Holnap hajnali kelés! Készítsetek ki mindent este.',
          },
          {
            time: '19:30',
            title: '🍽 Búcsúvacsora Brüsszelben',
            highlight: true,
            desc: 'Utolsó moules-frites, utolsó belga sör, utolsó gofri. Szép volt! (~€15-22/fő)',
            transport: [
              {
                type: 'transit',
                label: '🚇 Metro · ~8 perc · Trône → De Brouckère',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Grand+Place+Brussels',
              },
            ],
            guide: {
              mustSee: [
                'Restobières (Rue des Renards 32) — sörös konyha, ha az 1. nap kimaradt, Google 4.3★',
                'Fin de Siècle (Rue des Chartreux 9) — no-menu board, naponta változó belga klasszikusok, Google 4.2★',
                'Chez Henri (Rue de Flandre 113) — legjobb frietkot Brüsszelben, a helyiek szerint, Google 4.4★',
                'A La Mort Subite (Rue Montagne aux Herbes Potagères 7) — ikonikus sörözö 1928-ból, lambic sörök, Google 4.4★',
              ],
              tips: [
                'Utolsó este: ha volt kedvencetek az utazás alatt, menjetek vissza oda!',
                'A Delirium Café (Impasse de la Fidélité) 2000+ sörével világrekorder — megér egy utolsó kört',
              ],
            },
          },
          { time: '21:30', title: '🛏 Korai fekvés!!' },
        ],
        costs: [
          {
            item: 'Vonat Brüsszel↔Gent HÉTVÉGI jegy (4 felnőtt, gyerek ingyenes)',
            cost: '~€70',
          },
          { item: 'Genti villamos retúr (4 felnőtt)', cost: '~€14' },
          { item: 'Gravensteen', cost: '~€50' },
          { item: 'Genti Oltár (opcionális)', cost: '~€68' },
          { item: 'Étkezés (ebéd + cuberdons + terasz + vacsora)', cost: '~€120–170' },
          { item: 'Nap 4 összesen', cost: '~€254–372', total: true },
        ],
      },
      {
        dayNum: 5,
        title: 'Hazautazás',
        subtitle: 'Április 12. vasárnap — Viszlát Belgium!',
        schedule: [
          { time: '05:00', title: '⏰ Ébresztő' },
          { time: '05:30', title: '🧳 Szállás elhagyása' },
          {
            time: '06:00',
            title: '🚌 FLIBCO → CRL',
            highlight: true,
            links: [{ label: 'flibco.com', url: 'https://www.flibco.com' }],
            transport: [
              {
                type: 'transit',
                label: '🚌 FLIBCO busz · ~50 perc → CRL',
                url: 'https://www.google.com/maps/dir/Rue+De+Pascale+15+Brussels/Brussels+South+Charleroi+Airport',
              },
            ],
          },
          { time: '06:50', title: '📍 Érkezés CRL — Check-in, security' },
          { time: '08:30', title: '✈️ Repülő indul — Viszlát Belgium! 🇧🇪' },
        ],
        costs: [
          { item: 'FLIBCO busz Brüsszel→CRL', cost: '~€76' },
          { item: 'Reggeli reptéren (opcionális)', cost: '~€20–30' },
          { item: 'Nap 5 összesen', cost: '~€76–106', total: true },
        ],
      },
    ],
  },
];
