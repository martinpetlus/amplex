/**
 * Example: Generate an offer programmatically
 * Run with: node examples/example.js
 */

import { generateOffer } from "../src/index.js";

const exampleOffer = {
  offerNumber: "40260017",
  dateIssued: "28.07.2026",
  validUntil: "27.08.2026",
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
      name: "Kontrolné polohové a výškové bodové pole",
      quantity: 6,
      unit: "ks",
      price: 20.0,
      description:
        "Zamerané pomocou GNSS rovera s pripojením na SKPOS s 5s observáciou.",
    },
    {
      name: "Spracovanie modelu s textúrou vo formáte .OBJ",
      quantity: 1,
      unit: "ks",
      price: 600.0,
      description: "odovzdanie elektronicky",
    },
    {
      name: "Spracovanie farebného mračna bodov vo formáte .las/.laz/.57",
      quantity: 1,
      unit: "ks",
      price: 300.0,
      description: "odovzdanie elektronicky",
    },
    {
      name: "Spracovanie ortofotomozaiky vo formáte .geotif/.png/.jpeg",
      quantity: 1,
      unit: "ks",
      price: 400.0,
      description: "odovzdanie elektronicky",
    },
    {
      name: "Spracovanie digitálneho modelu povrchu (DSM) vo formáte .geotif",
      quantity: 1,
      unit: "ks",
      price: 100.0,
      description: "odovzdanie elektronicky",
    },
    {
      name: "Spracovanie digitálneho modelu terénu (DTM) vo formáte .geotif/.Tin",
      quantity: 1,
      unit: "ks",
      price: 400.0,
      description: "odovzdanie elektronicky",
    },
    {
      name: "Ostatné náklady",
      quantity: 1,
      unit: "ks",
      price: 200.0,
      description: "Cestovné, stravné, administratíva",
    },
    {
      name: "Opcia: Autorizačná doložka",
      quantity: 1,
      unit: "ks",
      price: 320.0,
      description: "Overenie výstupov autorizovaným geodetom.",
    },
    {
      name: "Opcia - Zber dát pomocou UAV - letecké laserové skenovanie",
      quantity: 1,
      unit: "ks",
      price: 4200.0,
      description:
        "Fotogrametria bude vykonaná v rámci jedného letu (nahrádza položku 1) v kombinácií s laserovým skenom územia so zameraním terénu aj pod hustou vegetáciou.",
    },
    {
      name: "Opcia - polohopis a výškopis",
      quantity: 1,
      unit: "ks",
      price: 800.0,
      description:
        "Grafcké znázornenie situácie, zoznam súradníc a výšok podrobných bodov, Technická správa",
    },
  ],
};

async function main() {
  try {
    console.log("📋 Generujem príkladdovú cenovanú ponuku...");
    await generateOffer(exampleOffer, "./ponuka_40260017.pdf");
    console.log("✅ Ponuka úspešne vygenerovaná: ponuka_40260017.pdf");
  } catch (error) {
    console.error("❌ Chyba pri generovaní ponuky:", error);
    process.exit(1);
  }
}

main();
