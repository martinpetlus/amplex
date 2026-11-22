# Offer Generator

Automatický generátor cenových ponúk PDF v slovenčine pre Amplex.

## Inštalácia

```bash
npm install
```

## Použitie

### 1. Interaktívny režim (CLI)

Spusťte aplikáciu bez argumentov:

```bash
npm run dev
```

Aplikácia vás interaktívne prevedie procesom vytvárania cennej ponuky:

1. Číslo ponuky
2. Dátumy (vystavenia a platnosti)
3. Údaje o odberateľovi (názov, adresa, IČO, DIČ, IČ DPH)
4. Položky ponuky (názov, množstvo, jednotka, cena, popis)
5. Názov výstupného súboru

Príklad:

```bash
$ npm run dev

📋 Generátor cenových ponúk - Amplex

Číslo ponuky (napr. 40260001): 40260001
Dátum vystavenia (napr. 28.07.2026) [dnes]: 22.11.2026
Platnosť ponuky do (napr. 27.08.2026): 22.12.2026

👥 Údaje o odberateľovi:
Meno/Názov spoločnosti: Cresco Hotels, s.r.o.
Adresa: Poštová 3
Mesto a PSČ: 811 06 Bratislava
...
```

### 2. Generovanie z JSON súboru

Spustite CLI s cestu k JSON súboru:

```bash
npm run dev sample-offer.json
```

Alebo priamo:

```bash
node src/cli.js sample-offer.json
```

Ako referenčný príklad slúži súbor [sample-offer.json](sample-offer.json).

Štruktúra JSON súboru:

```json
{
  "offerNumber": "40260001",
  "dateIssued": "22.11.2026",
  "validUntil": "22.12.2026",
  "recipient": {
    "name": "Názov spoločnosti",
    "address": "Ulica a číslo",
    "city": "Mesto a PSČ",
    "country": "Krajina",
    "ico": "IČO",
    "dic": "DIČ",
    "icDph": "SK1234567890"
  },
  "items": [
    {
      "name": "Názov položky",
      "quantity": 1,
      "unit": "ks",
      "price": 100.0,
      "description": "Voliteľný popis"
    }
  ]
}
```

Pole `recipient.icDph` (IČ DPH) je voliteľné. Ak ho nevyplníte alebo vynecháte, v PDF sa nezobrazí.

### 3. Programatické použitie

```javascript
import { generateOffer } from "./src/index.js";

const offerData = {
  offerNumber: "40260001",
  dateIssued: "22.11.2026",
  validUntil: "22.12.2026",
  recipient: {
    name: "Cresco Hotels, s.r.o.",
    address: "Poštová 3",
    city: "811 06 Bratislava",
    country: "Slovenská republika",
    ico: "43837964",
    dic: "2022490140",
  },
  items: [
    {
      name: "Kontrolné bodové pole",
      quantity: 6,
      unit: "ks",
      price: 20.0,
      description: "Zamerané pomocou GNSS rovera",
    },
  ],
};

await generateOffer(offerData, "./ponuka_40260001.pdf");
```

## Vlastnosti

✅ Automatické vypočítavanie celkovej sumy<br>
✅ Bez stĺpca DPH (podľa požiadavky)  
✅ Slovenčina - všetky texty a dátumy  
✅ Profesionálny layout s logom Amplex  
✅ Podpora pre viacerých položiek  
✅ Voliteľné popisy položiek  
✅ Konfigurovateľné dáta odberateľa  
✅ Automatické prelamovanie na nové stránky  
✅ Generovanie z JSON súboru  
✅ Interaktívny CLI režim

## Štruktúra projektu

```
offer-generator/
├── package.json
├── README.md
├── .gitignore
├── sample-offer.json        # Príklad JSON ponuky
├── assets/
│   └── amplex-logo.png      # Logo pre hlavičku PDF
├── fonts/                   # Vložené fonty Lato a licencia OFL
├── src/
│   ├── index.js             # Exporty a API
│   ├── cli.js               # Interaktívny režim
│   └── generator.js         # Generátor PDF logika
└── examples/
    └── example.js           # Príklad programatického použitia
```

## Príklad výstupu

Ponuka obsahuje:

- **Hlavičku** s logom Amplex a číslom ponuky
- **Dodávateľa** - Amplex s. r. o. s kontaktnými údajmi a vektorovými ikonami telefónu, e-mailu a webu
- **Odberateľa** - vložené z vašich vstupov
- **Tabuľku položiek** s:
  - Poradovým číslom
  - Názvom položky
  - Množstvom a jednotkou
  - Jednotkovou cenou v stĺpci „CENA“
  - Celkovou cenou položky (množstvo × cena) v poslednom stĺpci „SPOLU“
- **Súhrn** - Celková suma a informácia „Nie sme platcami DPH“
- **Pätu** so súpisom v registri

## Dependencie

- **pdfkit + Lato** - Generovanie PDF s vloženou podporou slovenských znakov
- **sharp** - Spracovanie obrázkov (ak v budúcnosti vložíme logo)

## Budúce vylepšenia

- Vloženie obrázku SVG loga priamo do PDF
- Šablóny (rôzne štýly ponúk)
- Hromadné generovanie z CSV
- Priame odoslanie emailom
- QR kódy na platbu
- Automatická zmena čísla ponuky
- Export do rôznych formátov (DOCX, XLSX)

## Riešenie problémov

### Kódovanie znakov

Vstupné JSON súbory používajte v UTF-8. Vygenerované PDF obsahuje vložené fonty Lato s podporou slovenských znakov, takže ich zobrazenie nezávisí od fontov nainštalovaných na počítači, ktorý PDF otvorí.

## Príkazy

| Príkaz                              | Popis                      |
| ----------------------------------- | -------------------------- |
| `npm run dev`                       | Spustiť interaktívny režim |
| `npm start`                         | Spustiť programaticky      |
| `node examples/example.js`          | Spustiť príklad            |
| `node src/cli.js sample-offer.json` | Generovať z JSON súboru    |
