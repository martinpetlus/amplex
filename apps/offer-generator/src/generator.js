import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMPANY_INFO = {
  name: "Amplex s. r. o.",
  address: "Galvaniho 19032/37 821 04 Bratislava - mestská časť Ružinov",
  phone: "+421915425052",
  email: "kontakt@amplex.sk",
  ico: "57920222",
  dic: "2123388146",
};

export class OfferGenerator {
  constructor() {
    this.logoPath = path.join(__dirname, "../../public/logo.svg");
  }

  async generatePDF(offerData) {
    return new Promise((resolve, reject) => {
      const pdfDoc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
      });

      let yPosition = pdfDoc.page.height - 60;

      // Draw header
      this.drawHeader(pdfDoc, yPosition, offerData.offerNumber);
      yPosition -= 80;

      // Draw addresses
      yPosition = this.drawAddresses(pdfDoc, yPosition, offerData);
      yPosition -= 20;

      // Draw offer details
      yPosition = this.drawOfferDetails(pdfDoc, yPosition, offerData);
      yPosition -= 30;

      // Draw table
      yPosition = this.drawTableHeader(pdfDoc, yPosition);
      yPosition -= 10;

      // Draw items
      for (let i = 0; i < offerData.items.length; i++) {
        const item = offerData.items[i];
        item.index = i + 1;
        const itemHeight = this.getItemHeight(item);

        if (yPosition - itemHeight < 100) {
          pdfDoc.addPage();
          yPosition = pdfDoc.page.height - 50;
          yPosition = this.drawTableHeader(pdfDoc, yPosition);
          yPosition -= 10;
        }

        yPosition = this.drawTableRow(pdfDoc, yPosition, item);
        yPosition -= 5;
      }

      yPosition -= 10;
      yPosition = this.drawTotals(pdfDoc, yPosition, offerData);

      this.drawFooter(pdfDoc, pdfDoc.page.height - 30);

      // Buffer output
      const chunks = [];
      pdfDoc.on("data", (chunk) => chunks.push(chunk));
      pdfDoc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      pdfDoc.on("error", reject);

      pdfDoc.end();
    });
  }

  drawHeader(pdfDoc, yPosition, offerNumber) {
    pdfDoc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#6D28D9")
      .text("AMPLEX", 50, yPosition);

    pdfDoc
      .fontSize(16)
      .font("Helvetica")
      .fillColor("#000000")
      .text(`CENOVÁ PONUKA ${offerNumber}`, 350, yPosition, {
        align: "right",
        width: 150,
      });
  }

  drawAddresses(pdfDoc, yPosition, offerData) {
    const leftX = 50;
    const rightX = 320;
    const lineHeight = 14;
    const startY = yPosition;

    // Supplier section
    pdfDoc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("DODÁVATEĽ", leftX, yPosition);
    yPosition -= lineHeight;

    pdfDoc.fontSize(10).font("Helvetica");
    pdfDoc.text(COMPANY_INFO.name, leftX, yPosition);
    yPosition -= lineHeight;

    pdfDoc.fontSize(9);
    pdfDoc.text(COMPANY_INFO.address, leftX, yPosition, { width: 250 });
    yPosition -= lineHeight * 1.5;

    pdfDoc.text(
      `IČO: ${COMPANY_INFO.ico}  DIČ: ${COMPANY_INFO.dic}`,
      leftX,
      yPosition,
      { width: 250 },
    );
    yPosition -= lineHeight * 1.5;

    pdfDoc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Kontaktné údaje", leftX, yPosition);
    yPosition -= lineHeight;

    pdfDoc.fontSize(9).font("Helvetica");
    pdfDoc.text(`📱 ${COMPANY_INFO.phone}`, leftX, yPosition);
    yPosition -= lineHeight;

    pdfDoc.text(`📧 ${COMPANY_INFO.email}`, leftX, yPosition);

    // Recipient section
    let rightY = startY;
    pdfDoc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("ODBERATEĽ", rightX, rightY);
    rightY -= lineHeight;

    pdfDoc.fontSize(10).font("Helvetica");
    if (offerData.recipient) {
      pdfDoc.text(offerData.recipient.name || "", rightX, rightY, {
        width: 200,
      });
      rightY -= lineHeight;

      pdfDoc.fontSize(9);
      if (offerData.recipient.address) {
        pdfDoc.text(offerData.recipient.address, rightX, rightY, {
          width: 200,
        });
        rightY -= lineHeight;
      }

      if (offerData.recipient.city) {
        pdfDoc.text(offerData.recipient.city, rightX, rightY, { width: 200 });
        rightY -= lineHeight;
      }

      if (offerData.recipient.country) {
        pdfDoc.text(offerData.recipient.country, rightX, rightY, {
          width: 200,
        });
        rightY -= lineHeight;
      }

      if (offerData.recipient.ico || offerData.recipient.dic) {
        rightY -= lineHeight;
        const icoText = offerData.recipient.ico
          ? `IČO: ${offerData.recipient.ico}`
          : "";
        const dicText = offerData.recipient.dic
          ? `DIČ: ${offerData.recipient.dic}`
          : "";
        pdfDoc.text(
          `${icoText}${icoText && dicText ? "  " : ""}${dicText}`,
          rightX,
          rightY,
          { width: 200 },
        );
      }
    }

    return Math.min(yPosition, rightY) - lineHeight;
  }

  drawOfferDetails(pdfDoc, yPosition, offerData) {
    const lineHeight = 14;

    pdfDoc.fontSize(10).font("Helvetica-Bold").fillColor("#000000");
    pdfDoc.text("Dátum vystavenia:", 50, yPosition);
    pdfDoc
      .font("Helvetica")
      .text(
        offerData.dateIssued || new Date().toLocaleDateString("sk-SK"),
        200,
        yPosition,
      );

    yPosition -= lineHeight;

    pdfDoc.font("Helvetica-Bold");
    pdfDoc.text("Platnosť ponuky:", 50, yPosition);
    pdfDoc.font("Helvetica").text(offerData.validUntil || "", 200, yPosition);

    return yPosition - lineHeight;
  }

  drawTableHeader(pdfDoc, yPosition) {
    const headers = ["Č.", "NÁZOV", "MNOŽSTVO", "CENA BEZ DPH", "SPOLU"];
    const columnX = [50, 85, 310, 420, 480];
    const columnWidth = [30, 225, 110, 60, 65];

    // Background
    pdfDoc
      .rect(50, yPosition - 20, 495, 20)
      .fillAndStroke("#F5F5F5", "#B3B3B3");

    // Headers
    pdfDoc.fontSize(9).font("Helvetica-Bold").fillColor("#000000");
    for (let i = 0; i < headers.length; i++) {
      pdfDoc.text(headers[i], columnX[i], yPosition - 17, {
        width: columnWidth[i],
        align: i > 2 ? "right" : "left",
      });
    }

    return yPosition - 25;
  }

  drawTableRow(pdfDoc, yPosition, item) {
    const columnX = [50, 85, 310, 420, 480];
    const columnWidth = [30, 225, 110, 60, 65];
    const baseHeight = 20;
    let rowHeight = baseHeight;

    // Calculate height with description
    if (item.description) {
      pdfDoc.fontSize(7);
      const descHeight = pdfDoc.heightOfString(item.description, {
        width: columnWidth[1] - 10,
      });
      rowHeight += descHeight + 5;
    }

    // Background (alternating)
    const bgColor = item.index % 2 === 0 ? "#F9F9F9" : "#FFFFFF";
    pdfDoc
      .rect(50, yPosition - rowHeight, 495, rowHeight)
      .fill(bgColor)
      .stroke("#E5E5E5");

    // Content
    pdfDoc.fontSize(9).font("Helvetica").fillColor("#000000");

    // Item number
    pdfDoc.text(String(item.index), columnX[0], yPosition - 16, {
      width: columnWidth[0],
      align: "center",
    });

    // Item name
    pdfDoc.text(item.name, columnX[1], yPosition - 16, {
      width: columnWidth[1],
    });

    // Quantity
    pdfDoc.text(
      `${item.quantity} ${item.unit || "ks"}`,
      columnX[2],
      yPosition - 16,
      {
        width: columnWidth[2],
        align: "right",
      },
    );

    // Price
    pdfDoc.text(this.formatPrice(item.price), columnX[3], yPosition - 16, {
      width: columnWidth[3],
      align: "right",
    });

    // Total
    const total = item.quantity * item.price;
    pdfDoc.text(this.formatPrice(total), columnX[4], yPosition - 16, {
      width: columnWidth[4],
      align: "right",
    });

    // Description
    if (item.description) {
      pdfDoc.fontSize(7).fillColor("#666666").font("Helvetica");
      pdfDoc.text(item.description, columnX[1], yPosition - 32, {
        width: columnWidth[1] - 10,
      });
    }

    return yPosition - rowHeight;
  }

  drawTotals(pdfDoc, yPosition, offerData) {
    let totalAmount = 0;
    for (const item of offerData.items) {
      totalAmount += item.quantity * item.price;
    }

    const boxX = 320;
    const boxWidth = 225;
    const boxHeight = 60;

    // Draw box
    pdfDoc
      .rect(boxX, yPosition - boxHeight, boxWidth, boxHeight)
      .stroke("#B3B3B3");

    // Labels and amounts
    pdfDoc.fontSize(10).font("Helvetica").fillColor("#000000");
    pdfDoc.text("Spolu bez DPH", boxX + 10, yPosition - 20, {
      width: boxWidth - 20,
      align: "left",
    });

    pdfDoc.fontSize(11).font("Helvetica-Bold");
    pdfDoc.text(this.formatPrice(totalAmount), boxX + 10, yPosition - 35, {
      width: boxWidth - 20,
      align: "right",
    });

    pdfDoc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Spolu", boxX + 10, yPosition - 50, {
        width: boxWidth - 20,
        align: "left",
      });

    pdfDoc.fillColor("#6D28D9");
    pdfDoc.text(
      `${this.formatPrice(totalAmount)} EUR`,
      boxX + 10,
      yPosition - 60,
      {
        width: boxWidth - 20,
        align: "right",
      },
    );

    return yPosition - boxHeight - 10;
  }

  drawFooter(pdfDoc, yPosition) {
    pdfDoc.fontSize(8).font("Helvetica").fillColor("#808080");
    pdfDoc.text(
      "Spoločnosť je zapísaná v Obchodnom registri Okresného súdu Bratislava, oddiel Sro, vložka č. XXXXX/B",
      50,
      yPosition,
      {
        width: 495,
        align: "center",
      },
    );
  }

  formatPrice(amount) {
    return amount.toLocaleString("sk-SK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getItemHeight(item) {
    let height = 20;
    if (item.description) {
      height += 15; // Approximate description height
    }
    return height;
  }
}
