# 📋 Generátor Cenových Ponúk - Súhrn

## ✅ Hotovo

Vytvoril som kompletnú Node.js aplikáciu na generovanie cenových ponúk PDF pre Amplex s nasledujúcimi vlastnosťami:

## 🎯 Poskytnuté Features

✅ **Automatické výpočty** - Celková suma sa počíta automaticky<br>
✅ **Bez DPH stĺpca** - Podľa požiadavky (bez DPH kolóny)  
✅ **Slovenský jazyk** - Všetky texty, dátumy, formáty sú v slovenčine  
✅ **Amplex údaje** - Vložené:

- Amplex s. r. o.
- Galvaniho 19032/37 821 04 Bratislava - mestská časť Ružinov
- IČO: 57920222
- DIČ: 2123388146
- Tel: +421915425052
- Email: kontakt@amplex.sk

✅ **Konfigurovateľné údaje** - Odberateľ, dátumy, položky - všetko sa dá zadať  
✅ **Tri spôsoby použitia:**

1. Interaktívny CLI režim
2. Z JSON súboru
3. Programaticky (Node.js API)

✅ **Profesionálny layout** - Tabuľka s položkami, súhrny, päta  
✅ **Viacstranový support** - Automatické prelamovanie na nové strany

## 📂 Štruktúra Projektu

```
apps/offer-generator/
├── src/
│   ├── index.js           # Exporty a API
│   ├── cli.js             # Interaktívny CLI
│   └── generator.js       # PDF generátor
├── examples/
│   └── example.js         # Príklad s 10 položkami
├── package.json
├── sample-offer.json      # Príklad JSON
├── README.md              # Úplná dokumentácia
├── QUICKSTART.md          # Rýchly návod
└── .gitignore
```

## 🚀 Rýchly začiatok

```bash
# Inštalácia
cd apps/offer-generator
npm install

# Spustenie - vyberte jeden:
npm run dev                      # Interaktívny režim
npm run dev sample-offer.json    # Z JSON súboru
node examples/example.js         # Príklad s 10 položkami
```

## 📋 Tri spôsoby použitia

### 1️⃣ Interaktívny Režim (Najjednoduchšie)

```bash
npm run dev
```

Aplikácia vás poprosia:

- Číslo ponuky
- Dátum vystavenia (default: dnes)
- Dátum platnosti
- Údaje o odberateľovi (meno, adresa, IČO, DIČ)
- Položky ponuky (názov, množstvo, jednotka, cena, popis)
- Názov výstupného PDF súboru

### 2️⃣ Z JSON Súboru (Najrýchlejšie)

Pripravte JSON súbor:

```json
{
  "offerNumber": "40260001",
  "dateIssued": "22.11.2026",
  "validUntil": "22.12.2026",
  "recipient": {
    "name": "Názov spoločnosti",
    "address": "Ulica a číslo",
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
      "description": "Voliteľný popis"
    }
  ]
}
```

Spustite:

```bash
npm run dev moja-ponuka.json
```

### 3️⃣ Programaticky (Vývojári)

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

## 📄 Obsah Generovanej Ponuky

Každá ponuka obsahuje:

- **Hlavička** - Logo Amplex + číslo ponuky
- **Dodávateľ** - Amplex s. r. o. s kontaktnými údajmi
- **Odberateľ** - Vaše vstupné údaje
- **Dátumy** - Vystavenia a platnosti
- **Tabuľka položiek:**
  - Poradové číslo
  - Názov a popis
  - Množstvo a jednotka
  - Jednotková cena v stĺpci „CENA“
  - Celková cena položky (množstvo × cena) v poslednom stĺpci „SPOLU“
- **Súhrn** - Spolu v EUR a informácia „Nie sme platcami DPH“
- **Päta** - Právne informácie

## 🛠️ Príkazy

| Príkaz                              | Popis                    |
| ----------------------------------- | ------------------------ |
| `npm install`                       | Nainštalovať dependencie |
| `npm run dev`                       | Interaktívny režim       |
| `npm run dev sample-offer.json`     | Z JSON súboru            |
| `node examples/example.js`          | Príklad (10 položiek)    |
| `node src/cli.js sample-offer.json` | Priamo bez npm           |

## 📦 Dependencie

- **pdfkit** - Generovanie PDF s plnou Unicode podporou
- **sharp** - Spracovanie obrázkov (príprava na budúce vylepšenia)

## 🎨 Layout a Dizajn

- Farby z Amplex loga (purpurová #6D28D9, modrá #2563EB)
- Profesionálny formát A4
- Prispôsobený slovenský jazyk (dátumy, čísla, text)
- Automatické prelamovanie na nové strany
- Striedavé farby riadkov tabuľky pre čitateľnosť

## 📚 Dokumentácia

- **README.md** - Úplná technická dokumentácia
- **QUICKSTART.md** - Rýchly návod s príkladmi
- **sample-offer.json** - Príklad JSON vstupného súboru
- **examples/example.js** - Príklad s 10 položkami

## 🔒 Git Setup

- Súbor `.gitignore` vylučuje:
  - `node_modules/`
  - `*.pdf` (vygenerované ponuky)
  - `.DS_Store`, `*.log`, `.env`

## 💡 Budúce Vylepšenia

- Vloženie SVG loga priamo do PDF
- Rôzne šablóny/štýly
- Hromadné generovanie z CSV
- Automatické odoslanie emailom
- QR kódy na platbu
- Export do iných formátov (DOCX, XLSX)

## ✨ Zaujímavosti

- Aplikácia automaticky:
  - Počíta celkové sumy
  - Formátuje čísla v slovenskom formáte (1 234,56 EUR)
  - Prelamuje dlhé texty v bunke
  - Prelamuje na novú stránku pri potrebe
  - Posiela atribúty Unicode (ľ, š, č, ž) bez problémov

## 📝 Príklad Workflow

```bash
# 1. Nainštalovať
cd apps/offer-generator
npm install

# 2. Spustiť s príkladom
node examples/example.js
# Vygeneruje: ponuka_40260017.pdf (10 položiek)

# 3. Alebo používať vlastné dáta
npm run dev sample-offer.json
# Zadajte názov súboru, keď sa pýta

# 4. Ponuka je hotová v PDF
# Otvoriť: ponuka_40260001.pdf
```

## 🎉 Hotovo!

Aplikácia je pripravená na produkciu. Môžete ju ihneď používať na generovanie cenných ponúk pre Amplex.
