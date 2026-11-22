#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";
import { OfferGenerator } from "./generator.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("\n📋 Generátor cenových ponúk - Amplex\n");

  // Check if JSON file is provided as argument
  if (process.argv[2]) {
    const filePath = process.argv[2];
    if (fs.existsSync(filePath)) {
      console.log(`📂 Načítavam ponuku z: ${filePath}\n`);
      const offerData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const outputFile =
        (await question(
          `Názov výstupného súboru [ponuka_${offerData.offerNumber}.pdf]: `,
        )) || `ponuka_${offerData.offerNumber}.pdf`;

      try {
        console.log("⏳ Generujem PDF...");
        const generator = new OfferGenerator();
        const pdfBuffer = await generator.generatePDF(offerData);

        const pdfPath = path.resolve(outputFile);
        fs.writeFileSync(pdfPath, pdfBuffer);

        console.log(`✅ Ponuka úspešne vygenerovaná: ${pdfPath}`);
      } catch (error) {
        console.error("❌ Chyba pri generovaní ponuky:", error.message);
      }

      rl.close();
      return;
    }
  }

  // Interactive mode
  // Offer number
  const offerNumber = await question("Číslo ponuky (napr. 40260001): ");

  // Dates
  const dateIssued =
    (await question("Dátum vystavenia (napr. 28.07.2026) [dnes]: ")) ||
    new Date().toLocaleDateString("sk-SK");
  const validUntil = await question("Platnosť ponuky do (napr. 27.08.2026): ");

  // Recipient info
  console.log("\n👥 Údaje o odberateľovi:");
  const recipientName = await question("Meno/Názov spoločnosti: ");
  const recipientAddress = await question("Adresa: ");
  const recipientCity = await question("Mesto a PSČ: ");
  const recipientCountry =
    (await question("Krajina [Slovenská republika]: ")) ||
    "Slovenská republika";
  const recipientICO = await question("IČO (voliteľné): ");
  const recipientDIC = await question("DIČ (voliteľné): ");

  // Items
  console.log('\n📦 Položky ponuky (zadajte položky, ukonči s "done"):');
  const items = [];
  let itemNumber = 1;

  while (true) {
    const name = await question(
      `\nNázov položky ${itemNumber} (alebo "done" na ukončenie): `,
    );
    if (name.toLowerCase() === "done" || name === "") break;

    const quantity = parseFloat(await question("Množstvo: "));
    const unit =
      (await question("Jednotka (napr. ks, hod, m, m2) [ks]: ")) || "ks";
    const price = parseFloat(await question("Cena bez DPH: "));
    const description = await question("Popis (voliteľné): ");

    items.push({
      name,
      quantity,
      unit,
      price,
      description: description || "",
    });

    itemNumber++;
  }

  if (items.length === 0) {
    console.log("❌ Musíte zadať aspoň jednu položku!");
    rl.close();
    return;
  }

  // Output file
  const outputFile =
    (await question(
      `\nNázov výstupného súboru [ponuka_${offerNumber}.pdf]: `,
    )) || `ponuka_${offerNumber}.pdf`;

  // Create offer data
  const offerData = {
    offerNumber,
    dateIssued,
    validUntil,
    recipient: {
      name: recipientName,
      address: recipientAddress,
      city: recipientCity,
      country: recipientCountry,
      ico: recipientICO,
      dic: recipientDIC,
    },
    items,
  };

  try {
    console.log("\n⏳ Generujem PDF...");
    const generator = new OfferGenerator();
    const pdfBuffer = await generator.generatePDF(offerData);

    // Save PDF
    const pdfPath = path.resolve(outputFile);
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log(`✅ Ponuka úspešne vygenerovaná: ${pdfPath}`);
  } catch (error) {
    console.error("❌ Chyba pri generovaní ponuky:", error.message);
  }

  rl.close();
}

main().catch(console.error);
