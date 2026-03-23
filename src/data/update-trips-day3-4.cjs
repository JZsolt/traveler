#!/usr/bin/env node
// Script to update Day 3 and Day 4 guide sections in trips.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'trips.js');
let content = fs.readFileSync(filePath, 'utf8');

// ============================================================
// PART 1: Convert restaurant/cafe/shop strings to {text, url} objects
// ============================================================

const restaurantReplacements = [
  // Day 3 - Ebed (frietjes)
  [
    `"Chez Vincent (Simon Stevinplein 15) \u2014 a helyiek kedvence, nem turista csapda, Google 4.2\u2605"`,
    `{ text: "Chez Vincent (Simon Stevinplein 15) \u2014 a helyiek kedvence, nem turista csapda, Google 4.2\u2605", url: "https://maps.google.com/?q=Chez+Vincent+Bruges" }`
  ],
  [
    `"The Potato Bar (Langestraat 39) \u2014 modern frituur, kreat\u00edv toppingek, Google 4.4\u2605"`,
    `{ text: "The Potato Bar (Langestraat 39) \u2014 modern frituur, kreat\u00edv toppingek, Google 4.4\u2605", url: "https://maps.google.com/?q=The+Potato+Bar+Bruges" }`
  ],
  [
    `"De Bolansen (Wollestraat 35) \u2014 steak + frieten, csal\u00e1dbar\u00e1t, Google 4.3\u2605"`,
    `{ text: "De Bolansen (Wollestraat 35) \u2014 steak + frieten, csal\u00e1dbar\u00e1t, Google 4.3\u2605", url: "https://maps.google.com/?q=De+Bolansen+Bruges" }`
  ],

  // Day 3 - Csokolade-seta
  [
    `"Dumon (Eiermarkt 6) \u2014 csal\u00e1di manufakt\u00fara 1992 \u00f3ta, mennyei tr\u00fcffelek, Google 4.7\u2605 \u2014 a helyiek szerint a legjobb Bruges-ben"`,
    `{ text: "Dumon (Eiermarkt 6) \u2014 csal\u00e1di manufakt\u00fara 1992 \u00f3ta, mennyei tr\u00fcffelek, Google 4.7\u2605 \u2014 a helyiek szerint a legjobb Bruges-ben", url: "https://maps.google.com/?q=Dumon+Chocolatier+Bruges" }`
  ],
  [
    `"The Chocolate Line (Simon Stevinplein 19) \u2014 Dominique Persoone, a 'csokirockszt\u00e1r' boltja, meglep\u0151 \u00edzek: wasabi, bacon, cola, tequila. Google 4.5\u2605"`,
    `{ text: "The Chocolate Line (Simon Stevinplein 19) \u2014 Dominique Persoone, a 'csokirockszt\u00e1r' boltja, meglep\u0151 \u00edzek: wasabi, bacon, cola, tequila. Google 4.5\u2605", url: "https://maps.google.com/?q=The+Chocolate+Line+Bruges" }`
  ],
  [
    `"Leonidas (Breidelstraat 24) \u2014 a klasszikus belga pralin\u00e9, j\u00f3 \u00e1r-\u00e9rt\u00e9k ar\u00e1ny aj\u00e1nd\u00e9knak. Google 4.3\u2605"`,
    `{ text: "Leonidas (Breidelstraat 24) \u2014 a klasszikus belga pralin\u00e9, j\u00f3 \u00e1r-\u00e9rt\u00e9k ar\u00e1ny aj\u00e1nd\u00e9knak. Google 4.3\u2605", url: "https://maps.google.com/?q=Leonidas+Breidelstraat+Bruges" }`
  ],
  [
    `"Neuhaus (Steenstraat 66) \u2014 \u0151k tal\u00e1lt\u00e1k fel a pralin\u00e9 bonbont 1912-ben, pr\u00e9mium kateg\u00f3ria. Google 4.5\u2605"`,
    `{ text: "Neuhaus (Steenstraat 66) \u2014 \u0151k tal\u00e1lt\u00e1k fel a pralin\u00e9 bonbont 1912-ben, pr\u00e9mium kateg\u00f3ria. Google 4.5\u2605", url: "https://maps.google.com/?q=Neuhaus+Steenstraat+Bruges" }`
  ],

  // Day 3 - Gofri + sor szunet
  [
    `"That's Toast (Noordzandstraat 28) \u2014 gofri \u00e9s k\u00e1v\u00e9 specialista, Google 4.6\u2605"`,
    `{ text: "That's Toast (Noordzandstraat 28) \u2014 gofri \u00e9s k\u00e1v\u00e9 specialista, Google 4.6\u2605", url: "https://maps.google.com/?q=That's+Toast+Bruges" }`
  ],
  [
    `"Oyya (Noordzandstraat 1) \u2014 kreat\u00edv gofri toppingek, Google 4.5\u2605"`,
    `{ text: "Oyya (Noordzandstraat 1) \u2014 kreat\u00edv gofri toppingek, Google 4.5\u2605", url: "https://maps.google.com/?q=Oyya+Bruges" }`
  ],
  [
    `"Caf\u00e9 Rose Red (Cordoeaniersstraat 16) \u2014 hangulatos s\u00f6rbar, 200+ belga s\u00f6r, Google 4.5\u2605"`,
    `{ text: "Caf\u00e9 Rose Red (Cordoeaniersstraat 16) \u2014 hangulatos s\u00f6rbar, 200+ belga s\u00f6r, Google 4.5\u2605", url: "https://maps.google.com/?q=Cafe+Rose+Red+Bruges" }`
  ],

  // Day 3 - Vacsora Bruges-ben
  [
    `"De Stove (Kleine Sint-Amandsstraat 4) \u2014 intim, 20 f\u00e9r\u0151helyes, h\u00e1zi belga konyha, Google 4.6\u2605 \u2014 foglal\u00e1s aj\u00e1nlott!"`,
    `{ text: "De Stove (Kleine Sint-Amandsstraat 4) \u2014 intim, 20 f\u00e9r\u0151helyes, h\u00e1zi belga konyha, Google 4.6\u2605 \u2014 foglal\u00e1s aj\u00e1nlott!", url: "https://maps.google.com/?q=De+Stove+Bruges" }`
  ],
  [
    `"Den Dyver (Dijver 5) \u2014 s\u00f6rrel f\u0151z\u00f6tt fog\u00e1sok, a csatorna partj\u00e1n, Google 4.3\u2605"`,
    `{ text: "Den Dyver (Dijver 5) \u2014 s\u00f6rrel f\u0151z\u00f6tt fog\u00e1sok, a csatorna partj\u00e1n, Google 4.3\u2605", url: "https://maps.google.com/?q=Den+Dyver+Bruges" }`
  ],
  [
    `"Cambrinus (Philipstockstraat 19) \u2014 400+ belga s\u00f6r + klasszikus \u00e9tel, Google 4.2\u2605"`,
    `{ text: "Cambrinus (Philipstockstraat 19) \u2014 400+ belga s\u00f6r + klasszikus \u00e9tel, Google 4.2\u2605", url: "https://maps.google.com/?q=Cambrinus+Bruges" }`
  ],
  [
    `"Tom Pouce (Burg 17) \u2014 a Burg t\u00e9ren, j\u00f3 \u00e1r-\u00e9rt\u00e9k, gyerekbar\u00e1t, Google 4.0\u2605"`,
    `{ text: "Tom Pouce (Burg 17) \u2014 a Burg t\u00e9ren, j\u00f3 \u00e1r-\u00e9rt\u00e9k, gyerekbar\u00e1t, Google 4.0\u2605", url: "https://maps.google.com/?q=Tom+Pouce+Bruges" }`
  ],

  // Day 4 - Reggeli (Cafe Novo)
  [
    `"Vagy valami \u00fajat: Cafe Novo (Rue de Namur 78) \u2014 lok\u00e1lis kedvenc, Google 4.4\u2605"`,
    `{ text: "Vagy valami \u00fajat: Cafe Novo (Rue de Namur 78) \u2014 lok\u00e1lis kedvenc, Google 4.4\u2605", url: "https://maps.google.com/?q=Cafe+Novo+Rue+de+Namur+Brussels" }`
  ],

  // Day 4 - Ebed (Waterzooi)
  [
    `"'t Klokhuys (Corduwaniersstraat 65, Patershol) \u2014 hangulatos k\u00f6z\u00e9pkori h\u00e1z, kiv\u00e1l\u00f3 waterzooi, Google 4.4\u2605"`,
    `{ text: "'t Klokhuys (Corduwaniersstraat 65, Patershol) \u2014 hangulatos k\u00f6z\u00e9pkori h\u00e1z, kiv\u00e1l\u00f3 waterzooi, Google 4.4\u2605", url: "https://maps.google.com/?q='t+Klokhuys+Gent" }`
  ],
  [
    `"Pakhuis (Schuurkenstraat 4) \u2014 ipari loft \u00e9tterem, modern belga konyha, Google 4.1\u2605"`,
    `{ text: "Pakhuis (Schuurkenstraat 4) \u2014 ipari loft \u00e9tterem, modern belga konyha, Google 4.1\u2605", url: "https://maps.google.com/?q=Pakhuis+Gent" }`
  ],
  [
    `"Amadeus (Plotersgracht 8, Patershol) \u2014 spare ribs specialista, all-you-can-eat, Google 4.3\u2605"`,
    `{ text: "Amadeus (Plotersgracht 8, Patershol) \u2014 spare ribs specialista, all-you-can-eat, Google 4.3\u2605", url: "https://maps.google.com/?q=Amadeus+Gent+Patershol" }`
  ],
  [
    `"Bij Sint-Jacobs (Bij Sint-Jacobs 15) \u2014 bolhapiac mellett, autentikus, Google 4.3\u2605"`,
    `{ text: "Bij Sint-Jacobs (Bij Sint-Jacobs 15) \u2014 bolhapiac mellett, autentikus, Google 4.3\u2605", url: "https://maps.google.com/?q=Bij+Sint-Jacobs+Gent" }`
  ],

  // Day 4 - Bucsuvacsora Brusszelben
  [
    `"Restobi\u00e8res (Rue des Renards 32) \u2014 s\u00f6r\u00f6s konyha, ha az 1. nap kimaradt, Google 4.3\u2605"`,
    `{ text: "Restobi\u00e8res (Rue des Renards 32) \u2014 s\u00f6r\u00f6s konyha, ha az 1. nap kimaradt, Google 4.3\u2605", url: "https://maps.google.com/?q=Restobieres+Brussels" }`
  ],
  [
    `"Fin de Si\u00e8cle (Rue des Chartreux 9) \u2014 no-menu board, naponta v\u00e1ltoz\u00f3 belga klasszikusok, Google 4.2\u2605"`,
    `{ text: "Fin de Si\u00e8cle (Rue des Chartreux 9) \u2014 no-menu board, naponta v\u00e1ltoz\u00f3 belga klasszikusok, Google 4.2\u2605", url: "https://maps.google.com/?q=Fin+de+Siecle+Brussels" }`
  ],
  [
    `"Chez Henri (Rue de Flandre 113) \u2014 legjobb frietkot Br\u00fcsszelben, a helyiek szerint, Google 4.4\u2605"`,
    `{ text: "Chez Henri (Rue de Flandre 113) \u2014 legjobb frietkot Br\u00fcsszelben, a helyiek szerint, Google 4.4\u2605", url: "https://maps.google.com/?q=Chez+Henri+Rue+de+Flandre+Brussels" }`
  ],
  [
    `"A La Mort Subite (Rue Montagne aux Herbes Potag\u00e8res 7) \u2014 ikonikus s\u00f6r\u00f6z\u00f6 1928-b\u00f3l, lambic s\u00f6r\u00f6k, Google 4.4\u2605"`,
    `{ text: "A La Mort Subite (Rue Montagne aux Herbes Potag\u00e8res 7) \u2014 ikonikus s\u00f6r\u00f6z\u00f6 1928-b\u00f3l, lambic s\u00f6r\u00f6k, Google 4.4\u2605", url: "https://maps.google.com/?q=A+La+Mort+Subite+Brussels" }`
  ],
];

let replacementCount = 0;
for (const [oldStr, newStr] of restaurantReplacements) {
  if (!content.includes(oldStr)) {
    console.error(`WARNING: Could not find: ${oldStr.substring(0, 80)}...`);
    continue;
  }
  content = content.replace(oldStr, newStr);
  replacementCount++;
}
console.log(`Part 1: ${replacementCount}/${restaurantReplacements.length} restaurant replacements done.`);

// ============================================================
// PART 2: Add image fields to guide objects for major attractions
// ============================================================

let imageCount = 0;

// Day 3 - Markt guide image
const marktBefore = content;
content = content.replace(
  /(\{ time: "10:45", title: "\u{1F3DB} Markt \(Piact\u00e9r\)"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Brugge_Markt.jpg/960px-Brugge_Markt.jpg", caption: "Markt -- szines oromzatu hazak" },`
);
if (content !== marktBefore) imageCount++;
else console.error('WARNING: Markt image not inserted');

// Day 3 - Belfort guide image
const belfortBefore = content;
content = content.replace(
  /(\{ time: "11:00", title: "\u{1F5FC} Belfort-torony"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bruges_Market_Square_and_Belfry.jpg/960px-Bruges_Market_Square_and_Belfry.jpg", caption: "Belfort-torony -- 83 meter, 366 lepcsofok" },`
);
if (content !== belfortBefore) imageCount++;
else console.error('WARNING: Belfort image not inserted');

// Day 3 - Burg ter guide image
const burgBefore = content;
content = content.replace(
  /(\{ time: "11:30", title: "\u{1F3F0} Burg t\u00e9r[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Brugge_-_Burg_4.jpg/960px-Brugge_-_Burg_4.jpg", caption: "Burg ter es a Szent Ver Bazilika" },`
);
if (content !== burgBefore) imageCount++;
else console.error('WARNING: Burg image not inserted');

// Day 3 - Begijnhof guide image
const begijnBefore = content;
content = content.replace(
  /(\{ time: "14:30", title: "\u{1F3E1} Begijnhof[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Brugge_beguinage.JPG/960px-Brugge_beguinage.JPG", caption: "Begijnhof -- feher hazak, narciszok" },`
);
if (content !== begijnBefore) imageCount++;
else console.error('WARNING: Begijnhof image not inserted');

// Day 3 - Minnewater guide image
const minneBefore = content;
content = content.replace(
  /(\{ time: "15:00", title: "\u{1F9A2} Minnewater[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Brugge_Minnewater_R01.jpg/960px-Brugge_Minnewater_R01.jpg", caption: "Minnewater -- a Szerelem tava hattyukkal" },`
);
if (content !== minneBefore) imageCount++;
else console.error('WARNING: Minnewater image not inserted');

// Day 3 - Rozenhoedkaai guide image
const rozenBefore = content;
content = content.replace(
  /(\{ time: "17:00", title: "\u{1F4F8} Rozenhoedkaai"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Brugge-CanalRozenhoedkaai.JPG/960px-Brugge-CanalRozenhoedkaai.JPG", caption: "Rozenhoedkaai -- Bruges legikonikusabb pontja" },`
);
if (content !== rozenBefore) imageCount++;
else console.error('WARNING: Rozenhoedkaai image not inserted');

// Day 4 - Sint-Baafskathedraal guide image
const sintBBefore = content;
content = content.replace(
  /(\{ time: "10:45", title: "\u26EA Sint-Baafskathedraal[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Gent_Sint-Baafskathedraal-PM_09873.jpg/960px-Gent_Sint-Baafskathedraal-PM_09873.jpg", caption: "Sint-Baafskathedraal -- a Genti Oltar otthona" },`
);
if (content !== sintBBefore) imageCount++;
else console.error('WARNING: Sint-Baafskathedraal image not inserted');

// Day 4 - Graslei guide image
const grasleiBefore = content;
content = content.replace(
  /(\{ time: "11:30", title: "\u{1F3DB} Graslei & Korenlei"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Grasbrug_en_Graslei.JPG/960px-Grasbrug_en_Graslei.JPG", caption: "Graslei -- kozepkori cehhazak a Leie folyo partjan" },`
);
if (content !== grasleiBefore) imageCount++;
else console.error('WARNING: Graslei image not inserted');

// Day 4 - Gravensteen guide image
const gravenBefore = content;
content = content.replace(
  /(\{ time: "12:00", title: "\u2694\uFE0F Gravensteen[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gravensteen_Gent_vanuit_MIAT.JPG/960px-Gravensteen_Gent_vanuit_MIAT.JPG", caption: "Gravensteen -- a Grofok Vara" },`
);
if (content !== gravenBefore) imageCount++;
else console.error('WARNING: Gravensteen image not inserted');

// Day 4 - Sint-Michielsbrug guide image
const sintMBefore = content;
content = content.replace(
  /(\{ time: "15:00", title: "\u{1F4F8} Sint-Michielsbrug[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Belgio_-_Gand_-_ponte_San_Michele%2C_chiesa_San_Michele_e_fiume_Lys.jpg/960px-Belgio_-_Gand_-_ponte_San_Michele%2C_chiesa_San_Michele_e_fiume_Lys.jpg", caption: "Sint-Michielsbrug -- harom torony egy kepben" },`
);
if (content !== sintMBefore) imageCount++;
else console.error('WARNING: Sint-Michielsbrug image not inserted');

// Day 4 - Graffiti Street guide image
const graffBefore = content;
content = content.replace(
  /(\{ time: "16:00", title: "\u{1F3A8} Graffiti Street[^"]*"[^}]*guide: \{)/su,
  (match) => match + `\n              image: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Werregarenstraat_%28Graffiti_Street%29_in_Ghent_-_panoramio.jpg/960px-Werregarenstraat_%28Graffiti_Street%29_in_Ghent_-_panoramio.jpg", caption: "Graffiti Street -- Gent legalis street art utcaja" },`
);
if (content !== graffBefore) imageCount++;
else console.error('WARNING: Graffiti Street image not inserted');

console.log(`Part 2: ${imageCount}/11 attraction images inserted.`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File written successfully.');
