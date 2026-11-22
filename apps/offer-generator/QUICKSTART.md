# Offer Generator - Quick Start Guide

## 🚀 Rýchly začiatok

Aplikácia na generovanie cenných ponúk PDF v slovenčine pre Amplex.

### Inštalácia a spustenie

```bash
cd apps/offer-generator
npm install
npm run dev
```

## 📋 Tri spôsoby použitia

### 1️⃣ Interaktívny režim (najjednoduchšie)

```bash
npm run dev
```

Aplikácia vás interaktívne prevedie:

- Číslo ponuky
- Dátumy
- Údaje o odberateľovi
- Položky (nazáciou, množstvom, cenou)

### 2️⃣ Z JSON súboru (najrýchlejšie)

```bash
npm run dev sample-offer.json
```

Pripravte JSON súbor s ponukou a aplikácia ho vygeneruje na PDF.

Príklad `sample-offer.json`:

```json
{
  "offerNumber": "40260001",
  "dateIssued": "22.11.2026",
  "validUntil": "22.12.2026",
  "recipient": {
    "name": "Názov spoločnosti",
    "address": "Adresa",
    "city": "Mesto PSČ",
    "country": "Krajina",
    "ico": "12345678",
    "dic": "1234567890"
  },
  "items": [
    {
      "name": "Položka 1",
      "quantity": 1,
      "unit": "ks",
      "price": 100.0,
      "description": "Popis"
    }
  ]
}
```

### 3️⃣ Programaticky (pre vývojárov)

```javascript
import { generateOffer } from "./src/index.js";

await generateOffer(
  {
    offerNumber: "40260001",
    // ... ďalšie pole
  },
  "./ponuka.pdf",
);
```

## 🎯 Vlastnosti

✅ Automatický výpočet sumy bez DPH  
✅ Bez DPH stĺpca (podľa požiadavky)  
✅ Slovenčina - všetky texty a dátumy  
✅ Profesionálny layout s logom Amplex  
✅ Podpora viacerých položiek  
✅ Voliteľné popisy  
✅ Automatické prelamovanie na nové strany

## 📂 Štruktúra

```
offer-generator/
├── src/
│   ├── index.js       - API
│   ├── cli.js         - Interaktívny režim
│   └── generator.js   - PDF logika
├── examples/
│   └── example.js     - Príklad
└── sample-offer.json  - Príklad JSON
```

## 🏢 Amplex údaje (automaticky vložené)

**Dodávateľ:**

- Amplex s. r. o.
- Galvaniho 19032/37 821 04 Bratislava - mestská časť Ružinov
- IČO: 57920222
- DIČ: 2123388146
- Tel: +421915425052
- Email: kontakt@amplex.sk

**Odberateľ:** - zadajte pri generovaní ponuky

## 💡 Príkazy

```bash
npm run dev                          # Interaktívny režim
npm run dev sample-offer.json        # Z JSON súboru
node src/cli.js sample-offer.json   # Priamo
node examples/example.js             # Príklad
```

## ❓ Časté otázky

**Q: Ako zmením číslo ponuky?**  
A: Zadajte v interaktívnom režime alebo upravte v JSON súbore.

**Q: Ako pridám nové položky?**  
A: V interaktívnom režime pokračujte v pridávaní, alebo dajte do JSON `items` poľa.

**Q: Kde sa ukladajú PDF?**  
A: V aktuálnom priečinku s menom podľa čísla ponuky (napr. `ponuka_40260001.pdf`).

**Q: Ako zmením dátumy?**  
A: V interaktívnom režime alebo v JSON `dateIssued` a `validUntil`.

**Q: Môžem vygenerovať bez interakcie?**  
A: Áno, použite `generateOffer()` z `src/index.js` v svojom kóde.

## 🔧 Troubleshooting

Ak sa znaky nezobrazia správne:

```bash
export LANG=sk_SK.UTF-8
npm run dev
```

## 📚 Viac informácií

Pozrite si [README.md](./README.md) pre úplnú dokumentáciu.
