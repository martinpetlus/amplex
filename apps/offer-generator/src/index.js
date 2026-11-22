import { OfferGenerator } from "./generator.js";
import fs from "fs";

/**
 * Generate a price offer programmatically
 * @param {Object} offerData - The offer data
 * @param {string} offerData.offerNumber - Offer number
 * @param {string} offerData.dateIssued - Date issued (optional)
 * @param {string} offerData.validUntil - Valid until date
 * @param {Object} offerData.recipient - Recipient information
 * @param {string} offerData.recipient.name - Recipient name/company
 * @param {string} offerData.recipient.address - Recipient address
 * @param {string} offerData.recipient.city - Recipient city and postal code
 * @param {string} offerData.recipient.country - Recipient country
 * @param {string} offerData.recipient.ico - Recipient IČO (optional)
 * @param {string} offerData.recipient.dic - Recipient DIČ (optional)
 * @param {string} offerData.recipient.icDph - Recipient IČ DPH (optional)
 * @param {Array<Object>} offerData.items - Array of line items
 * @param {string} offerData.items[].name - Item name
 * @param {number} offerData.items[].quantity - Quantity
 * @param {string} offerData.items[].unit - Unit (default: ks)
 * @param {number} offerData.items[].price - Price without VAT
 * @param {string} offerData.items[].description - Item description (optional)
 * @param {string} outputPath - Path where to save the PDF
 * @returns {Promise<void>}
 */
export async function generateOffer(offerData, outputPath) {
  const generator = new OfferGenerator();
  const pdfBuffer = await generator.generatePDF(offerData);
  fs.writeFileSync(outputPath, pdfBuffer);
}

export { OfferGenerator };
