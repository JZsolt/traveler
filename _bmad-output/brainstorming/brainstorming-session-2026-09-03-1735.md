---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Az Utazásaim következő termék-roadmapje: design váltás, AI minőség és guardrails, előfizetések, utazás közbeni live mód, wallet integráció, közös szerkesztés, értesítések és mobil widgetek'
session_goals: 'Storyk és taskok feltárása egy komplexebb, életképesebb utazástervező termékhez; fókusz, sorrend, üzleti modell és technikai kockázatok azonosítása'
selected_approach: 'ai-recommended'
techniques_used: ['Question Storming', 'Morphological Analysis']
ideas_generated: ['Morning Brief', 'Tomorrow Preview', 'Trust-Or-It-Dies Generation', 'No Chat As Product', 'Evidence-Backed Day Plan', 'Free Short Trips, Paid Serious Travel', 'Travel Collector', 'Shared Trip Command Center', 'Product-Grade Visual Reset', 'Guarded Travel-Only AI', 'End-to-End Travel Lifecycle', 'Next Step Travel Mode', 'Contextual Rescue Chat', 'Offline-First Trip Runtime', 'Wallet-Ready Travel Documents', 'Today Command View', 'Schedule Drift Detection', 'Situation-Based Replanning', 'Trip Runtime Cache', 'Offline-Safe Critical Links', 'Time-Based Trip Progress', 'Optional Low-Power Location Layer', 'Productization Pass']
context_file: 'prototypes/utazasaim-design-lab'
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Zsolt
**Date:** 2026-09-03

## Session Overview

**Topic:** Az Utazásaim következő termék-roadmapje: design váltás, AI minőség és guardrails, előfizetések, utazás közbeni live mód, wallet integráció, közös szerkesztés, értesítések és mobil widgetek

**Goals:** Storyk és taskok feltárása egy komplexebb, életképesebb utazástervező termékhez; fókusz, sorrend, üzleti modell és technikai kockázatok azonosítása

### Context Guidance

A projekt jelenlegi állapota alapján már van működő React + Vite + Supabase alap,
auth, ownership, sharing, public landing/demo, és előkészített design prototype
anyag a `prototypes/utazasaim-design-lab` alatt. A brainstorming fókusza nem
csak feature-lista, hanem termékéletképesség: mi ad valódi felhasználói értéket,
mi kell a fizetős modellhez, és mit érdemes előbb stabilizálni.

### Session Setup

Kiinduló ötletcsomag:

- nagy design váltás befejezése a meglévő design lab alapján;
- AI generálás minőségének javítása, limitálása és utazás-domainre szorítása;
- előfizetéses modell és AI használati keretek;
- utazás közbeni live progress: hol tartunk, hol kellene tartani;
- fixált kis AI asszisztens ablak gyors program-módosításhoz és útbaigazításhoz;
- iOS Wallet kompatibilis jegy/dokumentum kezelés, ahol lehetséges;
- megosztott tripek közös szerkesztése owner engedélyekkel;
- értesítések trip módosításokról és új megosztásokról;
- mobil widgetek;
- további ötletek egy komplex, használható, üzletileg is életképes termékhez.

## Technique Selection

**Approach:** AI-Recommended Techniques

**Analysis Context:** komplex termék-roadmap, ahol egyszerre kell kezelni a
felhasználói értéket, üzleti modellt, AI minőséget, platform-integrációkat és
technikai kockázatokat.

**Recommended Techniques:**

- **Question Storming:** először a jó termékkérdéseket gyűjtjük, hogy ne rosszul
  megfogalmazott problémákra tervezzünk feature-öket.
- **Morphological Analysis:** a terméket tengelyekre bontjuk, majd ezek
  kombinációiból story-csomagokat és roadmap irányokat képzünk.
- **Six Thinking Hats:** külön nézzük a tényeket, kockázatokat, előnyöket,
  felhasználói érzést, kreatív lehetőségeket és folyamatot.
- **What If Scenarios:** opcionális nyitás nagyobb, megkülönböztető termékötletek
  felé, ha a roadmap túl konzervatívnak tűnik.

**AI Rationale:** a cél nem pusztán ötletlista, hanem védhető, később taskokra
bontható product roadmap. Ehhez előbb kérdések kellenek, utána rendszer, végül
priorizálható döntési szempontok.

## Technique Execution Results

### Question Storming

#### First User Input — Raw Signals

- Visszatérő használat főleg utazás előtt: city break, nyaralás, ötletelés,
  hova menjünk.
- AI akkor érték, ha tényleg jó tervet készít, és nem kell külön ChatGPT/Gemini
  ellenőrzés. Ha rossz, csak tokenpazarlás és bizalomvesztés.
- Utazás közbeni kulcspillanatok:
  - reggel: mikor induljak és hova;
  - este: holnap merre megyünk.
- Fizetési hajlandóság bizonytalan; a user maga megoldaná, ezért külön kell
  feltárni, más persona miért fizetne.
- Amit nem szabad megépíteni: chat mint fő termék.

#### Captured Ideas

**Product #1**: Morning Brief
_Concept_: Az app reggel egy rövid, konkrét napi eligazítást ad: mikor indulj,
mi az első célpont, mi a kritikus időpont, mire figyelj. Nem beszélgetésként,
hanem utazási napi vezérlőként működik.
_Novelty_: Az AI nem chatablak, hanem napi operációs döntéstámogató réteg.

**Product #2**: Tomorrow Preview
_Concept_: Este az app automatikusan vagy egy gombbal összefoglalja a holnapi
napot: fő programok, indulási idők, foglalások, időjárásfüggő kockázatok,
alternatívák.
_Novelty_: A trip nem statikus itinerary, hanem aktívan előkészíti a következő
napot.

**AI #3**: Trust-Or-It-Dies Generation
_Concept_: Az AI generálás fő mércéje nem az, hogy sok szöveget ír-e, hanem hogy
a user ne akarja külön ChatGPT/Gemini-ben újraellenőrizni. Ehhez forrásolt,
ellenőrzött, domainre szűrt output kell.
_Novelty_: A termék AI-stratégiája a bizalomvesztés elkerülésére épül, nem token
maximalizálásra.

**Product #4**: No Chat As Product
_Concept_: A chat nem elsődleges navigáció és nem fő képernyő. Csak kontextuális
eszköz: adott nap, program, útvonal vagy probléma módosítására.
_Novelty_: Tudatos anti-chatbot pozicionálás egy AI travel appban.

#### Second User Input — Trust, Personas, Pricing, Priority

- A reggeli vagy napi ajánlás csak akkor lesz megbízható, ha konkrét,
  ellenőrizhető adatokat tartalmaz:
  - jegyvásárlási link;
  - jegy-integráció;
  - Google Maps vagy hivatalos térkép link;
  - hivatalos oldal link;
  - leírás;
  - nyitvatartás;
  - programadatok;
  - live adat, ha elérhető.
- A releváns döntési adatok köre helyes irány: időjárás, nyitvatartás,
  jegy/foglalás időpont, távolság, tömegközlekedés, gyerek/fáradtság, budget,
  aktuális késés.
- Fizetőképes célcsoport:
  - nyugati, magasabb jövedelmű utazók;
  - akik nem előfizetésenként optimalizálnak, hanem kényelmet vesznek;
  - akik szeretik gyűjteni, naplózni és visszanézni az utazásaikat;
  - csapatok és baráti társaságok, akik megosztott tripben akarják látni,
    merre tovább.
- Monetizációs alapirány:
  - 2 trip ingyen;
  - ingyenes trip maximum 3-4 napig;
  - hosszabb trip, gyorsabb AI, többnapos trip, megosztás és közös szerkesztés
    fizetős csomagba kerülhet;
  - lehetséges csomagnevek: Pro, Pro Plus, Traveler Plus, Traveler Max.
- Kötelező fókusz:
  - design váltás mindenképp;
  - AI guarding mindenképp;
  - ezek nélkül nincs minőségi trip generálás;
  - minden felsorolt feature legyen dokumentálva későbbi story/task bontáshoz.

#### Captured Ideas From Second Input

**Trust #5**: Evidence-Backed Day Plan
_Concept_: Minden AI által ajánlott napi döntés mögött legyen ellenőrizhető
bizonyíték: hivatalos link, jegyvásárlás, térkép, nyitvatartás, foglalási adat,
live státusz, ahol elérhető.
_Novelty_: A terv nem csak "szép itinerary", hanem forrásolt döntési rendszer.

**Business #6**: Free Short Trips, Paid Serious Travel
_Concept_: Az ingyenes csomag rövid, limitált validációra jó: 2 trip, maximum
3-4 nap. A komolyabb használat - többnapos generálás, gyors AI, share edit,
live mód - előfizetéshez kötött.
_Novelty_: A paywall nem mesterséges, hanem a komplexitáshoz és AI költséghez
igazodik.

**Persona #7**: Travel Collector
_Concept_: Fizető user lehet az, aki nem csak megtervezni akarja az utat, hanem
gyűjteni, naplózni, visszanézni és másokkal megosztani.
_Novelty_: A termék nem egyszeri AI generátor, hanem személyes utazási archívum.

**Collaboration #8**: Shared Trip Command Center
_Concept_: Csoportos utazásoknál minden résztvevő látja, mi változott, merre kell
menni, mi a következő program, és mit hagyott jóvá a trip létrehozója.
_Novelty_: A shared trip nem public read-only oldal, hanem koordinációs felület.

**Design #9**: Product-Grade Visual Reset
_Concept_: A következő nagy verzió nem csak új feature-öket kap, hanem teljes
vizuális és UX újragondolást a design lab alapján.
_Novelty_: A design nem kozmetika, hanem bizalomépítő termékfunkció.

**AI #10**: Guarded Travel-Only AI
_Concept_: AI csak utazástervezési, itinerary-módosítási, útbaigazítási és
forrásolt döntéstámogatási kontextusban működhet. A generikus chat nem része a
termékígéretnek.
_Novelty_: A tokenköltség és a minőség ugyanazzal a döntéssel javul:
domain-szűkített AI.

### Morphological Analysis

#### Product Dimension Matrix

| Tengely | Lehetséges irányok |
| --- | --- |
| Utazás fázisa | ötletelés előtt / tervezés közben / utazás közben / utazás után |
| AI szerepe | generátor / ellenőrző / napi asszisztens / módosító / guard |
| Bizalmi adat | hivatalos link / map / jegy / nyitvatartás / live data / user feedback |
| Monetizáció | free limit / premium trip / monthly subscription / team plan |
| Kollaboráció | read-only share / közös edit / owner approval / értesítések |
| Platform | web PWA / mobile UX / wallet / widget / offline |
| Design | dashboard / trip detail / live mode / creation flow / shared view |

#### Core Combination Selected

Az első legerősebb termékmag: teljes utazási életciklus egy appban.

- Utazás előtt:
  - ötletelés, hova menjünk;
  - tervezés, programok kiválasztása;
  - AI által generált, ellenőrzött terv.
- Utazás alatt:
  - live követés, hol vagyok;
  - mi a következő program;
  - hol kellene tartani;
  - kis kontextuális chat, ha elakadunk vagy módosítani kell.
- Dokumentumok és belépők:
  - jegyek és belépők kezelése;
  - iOS Wallet kompatibilis export/integráció, ahol lehetséges.
- Platform alap:
  - offline működés, hogy utazás közben ne essen szét a használat internet nélkül.

#### Captured Ideas From Morphological Analysis

**Core #11**: End-to-End Travel Lifecycle
_Concept_: Az app nem csak trip generátor, hanem az utazás teljes életútját
kezeli: ötletelés, tervezés, végrehajtás, módosítás, dokumentumok és offline
használat.
_Novelty_: A termék nem egy pontszerű AI tool, hanem folytonos utazási operating
system.

**Live #12**: Next Step Travel Mode
_Concept_: Utazás alatt a fő képernyő mindig azt mutatja, hol vagyok, mi a
következő program, mikor kell indulni, és milyen kritikus infó változott.
_Novelty_: A statikus itinerary helyett az app napi navigációs réteggé válik.

**AI #13**: Contextual Rescue Chat
_Concept_: A chat csak akkor jelenik meg értékesen, amikor a user elakad:
programot kell módosítani, útbaigazítás kell, késés van, rossz idő jön, vagy
valamit ki kell cserélni.
_Novelty_: A chat nem fő élmény, hanem helyzetfüggő mentőeszköz.

**Platform #14**: Offline-First Trip Runtime
_Concept_: A trip fontos adatai, napi terv, címek, jegyek, térképlinkek,
nyitvatartások és utasítások offline is elérhetők.
_Novelty_: A PWA nem csak installálható, hanem utazás közben tényleg
megbízhatóan használható.

**Wallet #15**: Wallet-Ready Travel Documents
_Concept_: Jegyek, belépők, foglalások és fontos dokumentumok strukturáltan
kezelhetők, és ahol technikailag lehetséges, Wallet-kompatibilis formában
exportálhatók vagy linkelhetők.
_Novelty_: A trip nem csak programlista, hanem utazási dokumentumtárca.

#### Live Travel Mode + Offline Runtime Breakdown

Ez a feature-csomag az utazás közbeni használatot célozza. A termék itt nem
tervezőként, hanem napi végrehajtási felületként működik.

##### Core User Moments

- Reggel: a user megnyitja az appot, és azonnal látja, mikor induljon, mi az
  első cél, mi a kritikus időpont.
- Útközben: látja, hol tart a napi tervhez képest, mi a következő program, és
  mennyi ideje van.
- Késésnél: az app jelzi, hogy mi borult, és mit érdemes módosítani.
- Rossz időnél: kültéri programokra alternatívát ajánl.
- Fáradtságnál vagy gyerekkel: lazább tempóra vált, kihagyható programokat
  javasol.
- Este: rövid holnapi preview-t ad, hogy ne reggel kelljen újratervezni.
- Internet nélkül: a napi terv, címek, jegyek, linkek és fontos adatok továbbra
  is elérhetők.

##### Minimum Valuable Version

- Napi live képernyő:
  - mai dátum és nap száma;
  - aktuális vagy következő program;
  - indulási javaslat;
  - kritikus időpontok;
  - "késésben vagyunk / időben vagyunk" státusz;
  - gyors linkek: térkép, jegy, hivatalos oldal.
- Offline cache:
  - trip alapadat;
  - napok;
  - schedule itemek;
  - címek;
  - guide szöveg;
  - jegy- és foglalási metaadatok;
  - legfontosabb külső linkek.
- Kontekstusos AI akciók:
  - "cseréld ki ezt a programot";
  - "mi fér még bele ma";
  - "kések 45 percet";
  - "esik az eső";
  - "gyerekek fáradtak";
  - "olcsóbb alternatíva kell".

##### Story Candidates

**Live #16**: Today Command View
_Concept_: A trip detail kap egy utazás közbeni nézetet, amely nem az egész
itineraryt mutatja, hanem a mai nap operatív állapotát: következő program,
indulás, időablak, gyors linkek, státusz.
_Novelty_: A felület használati módot vált: tervezésből végrehajtásba.

**Live #17**: Schedule Drift Detection
_Concept_: Az app kiszámolja, hogy a user a napi tervhez képest időben van-e,
késésben van-e, vagy túl nagy üresjárata van.
_Novelty_: A trip nem csak adat, hanem állapotgép.

**AI #18**: Situation-Based Replanning
_Concept_: Az AI nem szabad beszélgetésből indul, hanem előre definiált utazási
helyzetekből: késés, rossz idő, fáradtság, budget, zárva lévő program,
túlzsúfolt nap.
_Novelty_: Guardrails UX-ből indulnak, nem csak backend promptból.

**Offline #19**: Trip Runtime Cache
_Concept_: A trip futtatásához szükséges adatokat a PWA helyben tárolja, hogy
utazás közben gyenge net mellett is működjön a napi terv.
_Novelty_: Az offline mód nem általános cache, hanem trip-specifikus runtime
adatcsomag.

**Offline #20**: Offline-Safe Critical Links
_Concept_: A külső linkek offline nem nyithatók meg, de a hozzájuk tartozó
kritikus adatok - cím, időpont, foglalási kód, jegy státusz, rövid leírás -
helyben elérhetők.
_Novelty_: A rendszer nem hazudja, hogy offline is van live web, hanem előre
elmenti a döntéshez szükséges lényeget.

##### MVP Decision: Time-Based First, GPS Later

A live mód első verziója ne GPS-re épüljön. A GPS csak akkor éri meg, ha
energiatakarékosan és adatvédelmileg tisztán megoldható. MVP-ben elég a
time-based logika: az app a napi schedule időpontjai alapján mondja meg, hol
kellene tartani, mi a következő program, és mennyire csúszik a nap.

Indok:

- kisebb akkumulátor-terhelés;
- kevesebb permission és privacy súrlódás;
- egyszerűbb PWA implementáció;
- offline módban is jobban működik;
- a meglévő trip schedule adatokból már számolható;
- később opcionális GPS rétegként bővíthető.

**Live #21**: Time-Based Trip Progress
_Concept_: A live mód a napi program kezdő/vég időpontjai alapján jelöli az
aktuális, következő, késésben lévő és kihagyható programokat. Nem kell hozzá GPS,
csak megbízható schedule adat és aktuális idő.
_Novelty_: A termék már GPS nélkül is élőnek érződik, mert az időalapú állapot
utazás közben valódi döntéstámogatást ad.

**Platform #22**: Optional Low-Power Location Layer
_Concept_: GPS csak későbbi, opcionális enhancement legyen: manuális frissítés,
low-power lekérés vagy térkép shortcut alapján. Nem blokkolhatja az MVP live
módot.
_Novelty_: A location nem core dependency, hanem fokozatosan bekapcsolható
kényelmi réteg.

##### Delivery Principle: Refine, Do Not Rebuild

Semmit nem kell nulláról újraépíteni, ha már van használható alap. A következő
roadmap célja a meglévő funkciók termékszintű finomhangolása:

- jobb UX/UI;
- felhasználóbarátabb flow-k;
- design lab alapján egységesített vizuális rendszer;
- meglévő trip nézetek és editorok élesítése;
- AI generálás és módosítás guardrail-ezése;
- meglévő schedule, ticket, share és offline irányok továbbépítése;
- kevesebb generikus chat, több konkrét utazási akció.

**Product #23**: Productization Pass
_Concept_: A következő nagy munka nem greenfield fejlesztés, hanem productization
pass: a meglévő képernyők, adatok és AI flow-k összerakása egy barátságos,
konzisztens, mobil-first termékélménnyé.
_Novelty_: A fókusz nem feature-darabszám, hanem használhatóság, bizalom és
végigvezetett élmény.

#### Roadmap Epic Draft

A korábbi 7 epices draftot a review után felülírtuk. A végleges irány a
lenti 9 epices sorrend, amely külön kezeli az evidence-data integrációkat,
összevonja az offline/runtime alapot a live móddal, és a natív Wallet/widget
kérdéseket későbbi platformdöntésként kezeli.

**Final Epic Order**

1. Scoped Product-Grade Design Refresh
2. Trusted AI Generation And Guardrails
3. Offline Runtime + Time-Based Live Travel Mode
4. Tickets And Documents
5. Evidence Data Integrations
6. Shared Trip Collaboration V2
7. Usage Limits And Billing
8. Travel Journal And Collector
9. Native Extensions Later: Wallet Deepening And Widgets

Indok: a design és az AI bizalom az első alap. Az utazás közbeni live mód
offline runtime nélkül gyenge lenne, ezért ezek együtt mozognak. Evidence data,
Wallet és widgetek külön döntési/kockázati témák, nem egyszerű prompt vagy UI
taskok.

#### Epic 1 Breakdown: Product-Grade Design Refresh

Fontos pontosítás: a design foundation már elkészült. Vannak dokumentált design
elvek, tokenek, UI primitivek és production migrációs alapok. Ezért az Epic 1
nem nulláról épített design system, hanem product-grade UX/UI finomhangolás a
meglévő alapokra és a `prototypes/utazasaim-design-lab` mintáira építve.

##### Goal

A production app érzete váltson át generikus AI/trip demo élményből
megbízható, mobil-first, prémium travel journal + travel runtime élménnyé.

##### What Already Exists

- Traveler design dokumentáció;
- CSS tokenek és shadcn-compatible UI alapok;
- `Page`, `PageHeader`, `Section`, `Row`, `Timeline`, loading/error/empty
  primitivek;
- production dashboard/trip/create migrációs alap;
- design lab képernyők:
  - `dashboard.html`;
  - `trip-detail.html`;
  - `create-trip.html`;
  - `landing.html`;
  - `login.html`;
  - `design-system.html`.

##### Design Refresh Story Candidates

**Design #24**: Design Lab Parity Audit
_Concept_: Összevetni a production app képernyőit a design lab képernyőkkel, és
képernyőnként listázni, mi hiányzik UX, vizuális ritmus, információs hierarchia
és mobil polish szinten.
_Novelty_: Nem érzésre redesignolunk, hanem konkrét gap listából dolgozunk.

**Design #25**: Dashboard Product Polish
_Concept_: A saját utak dashboardját a design lab alapján erősebb első képernyővé
tenni: állapotok, upcoming/shared/draft jelzések, empty state, gyors első
akciók, jobb mobil scan.
_Novelty_: A dashboard nem lista, hanem utazási gyűjtemény és visszatérési pont.

**Design #26**: Trip Detail Runtime Layout
_Concept_: A trip detail ne csak hosszú dokumentum legyen, hanem tagolt
utazási vezérlő: hero, mai nap, timeline, jegyek, gyors linkek, AI akciók és
offline státusz világos hierarchiában.
_Novelty_: A trip detail előkészíti a későbbi live mode-ot design szinten.

**Design #27**: Create Trip Guided Flow
_Concept_: A trip létrehozás ne chat-first élmény legyen, hanem vezetett brief,
preferenciák, ellenőrzött AI generálás és preview/accept flow.
_Novelty_: Az AI generálás UX-ből guardrail-ezett, nem csak backend promptból.

**Design #28**: Shared View Consistency
_Concept_: A public és authenticated shared trip nézetek vizuálisan és
információs hierarchiában illeszkedjenek a fő trip élményhez, miközben
egyértelműen read-only vagy collaboration státuszt mutatnak.
_Novelty_: A share nem mellékoldal, hanem termékélmény része.

**Design #29**: Legacy Style Cleanup Pass
_Concept_: A még meglévő hardcoded színek, régi gombstílusok, túl generikus
Tailwind minták és nem ikon-alapú kontrollok fokozatos kiváltása tokenekkel és
meglévő UI primitivekkel.
_Novelty_: A polish mérhető technikai adósságcsökkentéshez kötődik.

##### Suggested First Implementation Task

Az első konkrét task ne rögtön rewrite legyen, hanem audit:

`20-01-design-lab-parity-and-productization-audit`

Kimenet:

- production képernyő lista;
- design lab megfelelőik;
- gap táblázat;
- megtartandó meglévő komponensek;
- módosítandó komponensek;
- no-rebuild szabályok;
- első 3 implementációs task sorrendje.

## Idea Organization and Prioritization

### Thematic Organization

**Theme 1: Product-Grade UX/UI**

Focus: a meglévő appot kell termékszintű, mobil-first, prémium travel journal
élménnyé finomítani, nem nulláról újraépíteni.

Related ideas:

- Product-Grade Visual Reset
- Productization Pass
- Design Lab Parity Audit
- Dashboard Product Polish
- Trip Detail Runtime Layout
- Create Trip Guided Flow
- Shared View Consistency
- Legacy Style Cleanup Pass

Pattern insight: a design nem dekoráció, hanem bizalmi és használhatósági
réteg. Ha az app generikus AI demónak hat, a jó funkciók is gyengébbnek
érződnek.

**Theme 2: Trusted AI, Not Generic Chat**

Focus: az AI csak akkor érték, ha jó, ellenőrizhető, utazási domainre szűrt
tervet ad, amit nem kell ChatGPT/Gemini-ben újraellenőrizni.

Related ideas:

- Trust-Or-It-Dies Generation
- No Chat As Product
- Evidence-Backed Day Plan
- Guarded Travel-Only AI
- Situation-Based Replanning
- Contextual Rescue Chat

Pattern insight: a chat nem fő termék. Az AI szerepe: generálás, ellenőrzés,
módosítás és helyzetfüggő segítség előre definiált utazási kontextusban.

**Theme 3: Travel Runtime**

Focus: az app utazás közben is használható legyen, ne csak előre elkészített
útitervként.

Related ideas:

- Morning Brief
- Tomorrow Preview
- End-to-End Travel Lifecycle
- Next Step Travel Mode
- Today Command View
- Schedule Drift Detection
- Time-Based Trip Progress
- Optional Low-Power Location Layer

Pattern insight: MVP-ben GPS nélkül, időalapon is lehet élőnek érződő élményt
adni: hol kellene tartani, mi a következő program, késésben vagyunk-e.

**Theme 4: Offline And Critical Travel Data**

Focus: utazás közben gyenge internet mellett sem eshet szét az élmény.

Related ideas:

- Offline-First Trip Runtime
- Trip Runtime Cache
- Offline-Safe Critical Links

Pattern insight: az offline mód nem általános app cache, hanem trip runtime
adatcsomag: napi terv, cím, időpont, guide, jegy/foglalás metaadat és kritikus
link információ.

**Theme 5: Tickets, Wallet And Documents**

Focus: a trip nem csak programlista, hanem utazási dokumentumtár is.

Related ideas:

- Wallet-Ready Travel Documents
- Evidence-Backed Day Plan

Pattern insight: jegyek, belépők, foglalások és hivatalos linkek növelik a
bizalmat, és később fizetős értékréteget adhatnak.

**Theme 6: Collaboration And Retention**

Focus: shared trips ne csak public read-only oldalak legyenek, hanem később
csoportos koordinációs felületek.

Related ideas:

- Shared Trip Command Center
- Shared Trip Collaboration V2
- Travel Collector

Pattern insight: a visszatérő használat nem csak új trip generálásból jön,
hanem gyűjtésből, naplózásból, megosztásból és közös utazási koordinációból.

**Theme 7: Monetization And Limits**

Focus: a fizetős modell a komolyabb utazási értékhez és AI költséghez
kapcsolódjon.

Related ideas:

- Free Short Trips, Paid Serious Travel
- Subscription And Limits

Pattern insight: 2 rövid trip ingyen, kb. 3-4 napig. Hosszabb trip, gyors AI,
advanced generálás, share edit, live mód és document/wallet funkciók fizetős
csomagba kerülhetnek.

### Prioritization Results

**Top Priority Ideas**

1. Productization Pass
2. Product-Grade Design Refresh
3. Trusted AI Generation And Guardrails
4. Offline Runtime + Time-Based Live Travel Mode

Rationale: a design és az AI bizalom a két alapfeltétel. Ha ezek nem erősek,
akkor a live, offline, wallet, collaboration és subscription rétegek sem
lesznek meggyőzőek.

**Quick Win Opportunities**

- Design Lab Parity Audit
- Legacy Style Cleanup Pass
- Trip Detail Runtime Layout audit
- AI chat surfaces audit
- Time-based live mode spec

**Breakthrough Concepts**

- No Chat As Product
- End-to-End Travel Lifecycle
- Evidence-Backed Day Plan
- Shared Trip Command Center
- Offline-First Trip Runtime

### Action Planning

**Immediate Next Step**

Start Phase 20 with:

`20-01-design-lab-parity-and-productization-audit`

This is documentation/audit work, not implementation. It should produce the
screen-by-screen gap list and the first three small implementation tasks.

**Recommended Follow-Up Task Order**

1. Product-grade dashboard/trip detail polish task from the audit output.
2. Create trip guided flow and AI guardrails task.
3. Time-based live mode specification and progress helper task.

**Quality Gate**

For the audit task, runtime commands can be skipped with explanation because no
production code changes are made. For the first implementation task after the
audit, run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:run
pnpm run build
```

## Session Summary and Insights

### Key Achievements

- Captured the core product direction: existing app productization, not
  greenfield rebuild.
- Defined the anti-chatbot AI principle: trips first, AI second.
- Identified the strongest differentiator: trusted plan plus travel-time
  execution support.
- Selected time-based live mode as MVP; GPS remains a later optional layer.
- Created Phase 20 and the first audit task to continue with concrete work.

### Final Roadmap Direction

The next product phase should use the canonical 9-epic order defined above in
the **Final Epic Order** section. It starts with scoped design productization
and trusted AI, then moves into offline-backed live travel mode, documents,
evidence data, collaboration, billing, retention, and later native extensions.

### Risks And Open Questions

**Evidence data is not an LLM-only problem.** Hivatalos linkek,
nyitvatartások, jegyárak, foglalhatóság és live státusz nem bízható pusztán
promptokra. Ehhez adatintegrációs stratégia kell: Google Places, hivatalos POI
oldalak, ticket provider linkek, cache-frissítés, költségkeret és fallback.

**Wallet requires a platform decision.** iOS Wallet `.pkpass` generáláshoz Apple
Developer Program, szerveroldali pass signing certificate és pass frissítési
folyamat kell. MVP-ben elég lehet strukturált ticket/document layer és külső
link, a valódi Wallet export külön döntési pont.

**Mobile widgets are not PWA-native.** iOS/Android widget natív wrapper vagy
platformspecifikus app nélkül nem reális MVP. A widget ötletet nem töröljük, de
`Native Extensions Later` scope-ba kerül.

**Travel Collector persona needs a feature home.** Ha a fizető persona az, aki
gyűjti, naplózza és visszanézi az utazásait, akkor kell későbbi Travel Journal
epic. Ha nem építjük meg korán, a monetizációs érvelésben deferred
feltételezésként kell kezelni.

**Success metrics are missing until Phase 20.** A következő audit/task bontás
definiálja a mérőszámokat: AI plan acceptance rate, regeneration rate,
trip-opened-during-travel rate, token cost per trip, free-to-paid conversion,
share/collaboration activation.

### Completion State

Brainstorming is complete enough to move into task execution. The next artifact
is no longer more brainstorming, but the Phase 20 audit task.
