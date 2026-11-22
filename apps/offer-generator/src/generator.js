import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMPANY_INFO = {
  name: "Amplex s. r. o.",
  address: "Galvaniho 19032/37, 821 04 Bratislava - mestská časť Ružinov",
  phone: "+421 915 425 052",
  email: "kontakt@amplex.sk",
  website: "amplex.sk",
  ico: "57920222",
  dic: "2123388146",
};

const LAYOUT = {
  left: 45,
  right: 550,
  width: 505,
  contentBottom: 765,
  columns: [
    { x: 45, width: 34 },
    { x: 79, width: 246 },
    { x: 325, width: 90 },
    { x: 415, width: 135 },
  ],
};

const COLORS = {
  accentStart: "#6D28D9",
  accentEnd: "#2563EB",
  border: "#D9D9E0",
  headerStart: "#F3EDFE",
  headerEnd: "#EAF1FE",
  alternate: "#FAF9FC",
  muted: "#666666",
  text: "#171717",
};

function brandGradient(
  pdfDoc,
  x,
  y,
  width,
  start = COLORS.accentStart,
  end = COLORS.accentEnd,
) {
  return pdfDoc
    .linearGradient(x, y, x + width, y)
    .stop(0, start)
    .stop(1, end);
}

export class OfferGenerator {
  constructor() {
    this.fontPath = path.join(__dirname, "../fonts");
    this.logoPath = path.join(__dirname, "../assets/amplex-logo.png");
  }

  async generatePDF(offerData) {
    return new Promise((resolve, reject) => {
      const pdfDoc = new PDFDocument({
        size: "A4",
        margin: LAYOUT.left,
        bufferPages: true,
      });

      pdfDoc.registerFont("Lato", path.join(this.fontPath, "Lato-Regular.ttf"));
      pdfDoc.registerFont(
        "Lato-Bold",
        path.join(this.fontPath, "Lato-Bold.ttf"),
      );

      let yPosition = this.drawHeader(pdfDoc, 42, offerData.offerNumber);
      yPosition = this.drawAddresses(pdfDoc, yPosition + 22, offerData) + 22;
      yPosition = this.drawOfferDetails(pdfDoc, yPosition, offerData);
      yPosition = this.drawTableHeader(pdfDoc, yPosition + 18);

      for (let i = 0; i < offerData.items.length; i++) {
        const item = offerData.items[i];
        const itemHeight = this.getItemHeight(pdfDoc, item);
        const spaceAfterRow = i === offerData.items.length - 1 ? 100 : 5;

        if (yPosition + itemHeight + spaceAfterRow > LAYOUT.contentBottom) {
          pdfDoc.addPage();
          yPosition = this.drawTableHeader(pdfDoc, 48);
        }

        yPosition = this.drawTableRow(pdfDoc, yPosition, item, i + 1) + 5;
      }

      this.drawTotals(pdfDoc, yPosition + 12, offerData);

      const pageRange = pdfDoc.bufferedPageRange();
      for (let pageIndex = 0; pageIndex < pageRange.count; pageIndex++) {
        pdfDoc.switchToPage(pageRange.start + pageIndex);
        this.drawFooter(pdfDoc, pdfDoc.page.height - 58);
      }

      const chunks = [];
      pdfDoc.on("data", (chunk) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.on("error", reject);
      pdfDoc.end();
    });
  }

  drawHeader(pdfDoc, yPosition, offerNumber) {
    pdfDoc.image(this.logoPath, LAYOUT.left, yPosition + 1, { width: 30 });

    pdfDoc
      .font("Lato-Bold")
      .fontSize(23)
      .fillColor(brandGradient(pdfDoc, 82, yPosition, 95))
      .text("AMPLEX", 82, yPosition + 1);

    pdfDoc
      .font("Lato-Bold")
      .fontSize(15)
      .fillColor(COLORS.text)
      .text(`CENOVÁ PONUKA ${offerNumber}`, 300, yPosition + 7, {
        width: LAYOUT.right - 300,
        align: "right",
      });

    pdfDoc
      .rect(LAYOUT.left, yPosition + 39, LAYOUT.width, 2)
      .fill(brandGradient(pdfDoc, LAYOUT.left, yPosition + 39, LAYOUT.width));

    return yPosition + 53;
  }

  drawAddresses(pdfDoc, yPosition, offerData) {
    const columnWidth = 235;
    const rightX = 315;

    const supplierLines = [
      { text: COMPANY_INFO.name, bold: true, size: 10 },
      { text: COMPANY_INFO.address, size: 9 },
      {
        text: `IČO: ${COMPANY_INFO.ico}    DIČ: ${COMPANY_INFO.dic}`,
        size: 9,
      },
      { text: COMPANY_INFO.phone, size: 9, icon: "phone" },
      { text: COMPANY_INFO.email, size: 9, icon: "email" },
      { text: COMPANY_INFO.website, size: 9, icon: "web" },
    ];

    const recipient = offerData.recipient || {};
    const recipientLines = [
      { text: recipient.name, bold: true, size: 10 },
      { text: recipient.address, size: 9 },
      { text: recipient.city, size: 9 },
      { text: recipient.country, size: 9 },
      {
        text: [
          recipient.ico && `IČO: ${recipient.ico}`,
          recipient.dic && `DIČ: ${recipient.dic}`,
        ]
          .filter(Boolean)
          .join("    "),
        size: 9,
      },
      { text: recipient.icDph && `IČ DPH: ${recipient.icDph}`, size: 9 },
    ].filter((line) => line.text);

    const supplierBottom = this.drawAddressColumn(
      pdfDoc,
      LAYOUT.left,
      yPosition,
      columnWidth,
      "DODÁVATEĽ",
      supplierLines,
    );
    const recipientBottom = this.drawAddressColumn(
      pdfDoc,
      rightX,
      yPosition,
      columnWidth,
      "ODBERATEĽ",
      recipientLines,
    );

    return Math.max(supplierBottom, recipientBottom);
  }

  drawAddressColumn(pdfDoc, x, yPosition, width, heading, lines) {
    pdfDoc
      .font("Lato-Bold")
      .fontSize(9)
      .fillColor(COLORS.accentStart)
      .text(heading, x, yPosition, { width });

    let y = yPosition + 17;
    for (const line of lines) {
      const iconWidth = line.icon ? 16 : 0;
      if (line.icon) {
        this.drawContactIcon(pdfDoc, line.icon, x, y + 1);
      }
      const font = line.bold ? "Lato-Bold" : "Lato";
      pdfDoc.font(font).fontSize(line.size).fillColor(COLORS.text);
      const textWidth = width - iconWidth;
      const height = pdfDoc.heightOfString(line.text, { width: textWidth });
      pdfDoc.text(line.text, x + iconWidth, y, { width: textWidth });
      y += height + 3;
    }

    return y;
  }

  drawContactIcon(pdfDoc, icon, x, y) {
    pdfDoc
      .save()
      .translate(x, y)
      .scale(0.5)
      .lineWidth(1.6)
      .lineCap("round")
      .lineJoin("round")
      .strokeColor(COLORS.accentStart);

    if (icon === "phone") {
      pdfDoc
        .path(
          "M22 16.92V20a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2H7a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.03 9.86a16 16 0 0 0 6 6l1.22-1.22a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z",
        )
        .stroke();
    } else if (icon === "email") {
      pdfDoc.roundedRect(2, 4, 20, 16, 2).stroke();
      pdfDoc.path("M2 5L12 13L22 5").stroke();
    } else if (icon === "web") {
      pdfDoc.circle(12, 12, 10).stroke();
      pdfDoc.ellipse(12, 12, 4, 10).stroke();
      pdfDoc.moveTo(2, 12).lineTo(22, 12).stroke();
    } else {
      throw new Error(`Unknown contact icon: ${icon}`);
    }

    pdfDoc.restore();
  }

  drawOfferDetails(pdfDoc, yPosition, offerData) {
    const details = [
      {
        label: "Dátum vystavenia:",
        value: offerData.dateIssued || new Date().toLocaleDateString("sk-SK"),
        x: LAYOUT.left,
      },
      {
        label: "Platnosť ponuky:",
        value: offerData.validUntil || "",
        x: 310,
      },
    ];

    for (const detail of details) {
      pdfDoc
        .font("Lato-Bold")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(detail.label, detail.x, yPosition, { width: 110 });
      pdfDoc
        .font("Lato")
        .fontSize(9)
        .text(detail.value, detail.x + 115, yPosition, { width: 125 });
    }

    return yPosition + 26;
  }

  drawTableHeader(pdfDoc, yPosition) {
    pdfDoc
      .roundedRect(LAYOUT.left, yPosition, LAYOUT.width, 27, 3)
      .fill(
        brandGradient(
          pdfDoc,
          LAYOUT.left,
          yPosition,
          LAYOUT.width,
          COLORS.headerStart,
          COLORS.headerEnd,
        ),
      );

    const headers = ["Č.", "NÁZOV POLOŽKY", "MNOŽSTVO", "CENA"];
    pdfDoc.font("Lato-Bold").fontSize(8).fillColor(COLORS.text);

    headers.forEach((header, index) => {
      const column = LAYOUT.columns[index];
      pdfDoc.text(header, column.x + 5, yPosition + 9, {
        width: column.width - 10,
        align: index > 1 ? "right" : "left",
        lineBreak: false,
      });
    });

    return yPosition + 27;
  }

  drawTableRow(pdfDoc, yPosition, item, index) {
    const rowHeight = this.getItemHeight(pdfDoc, item);
    const [number, name, quantity, price] = LAYOUT.columns;

    pdfDoc
      .rect(LAYOUT.left, yPosition, LAYOUT.width, rowHeight)
      .fill(index % 2 === 0 ? COLORS.alternate : "#FFFFFF");
    pdfDoc
      .moveTo(LAYOUT.left, yPosition + rowHeight)
      .lineTo(LAYOUT.right, yPosition + rowHeight)
      .lineWidth(0.5)
      .strokeColor(COLORS.border)
      .stroke();

    const textY = yPosition + 8;
    pdfDoc.font("Lato").fontSize(9).fillColor(COLORS.text);
    pdfDoc.text(String(index), number.x + 3, textY, {
      width: number.width - 6,
      align: "center",
    });
    pdfDoc.text(item.name || "", name.x + 5, textY, {
      width: name.width - 10,
    });
    pdfDoc.text(
      `${item.quantity} ${item.unit || "ks"}`,
      quantity.x + 3,
      textY,
      {
        width: quantity.width - 8,
        align: "right",
      },
    );
    pdfDoc.text(this.formatPrice(item.price), price.x + 3, textY, {
      width: price.width - 8,
      align: "right",
    });

    if (item.description) {
      const nameHeight = pdfDoc.heightOfString(item.name || "", {
        width: name.width - 10,
      });
      pdfDoc
        .font("Lato")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(item.description, name.x + 5, textY + nameHeight + 2, {
          width: name.width - 10,
        });
    }

    return yPosition + rowHeight;
  }

  drawTotals(pdfDoc, yPosition, offerData) {
    const totalAmount = offerData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
    const boxX = 320;
    const boxWidth = LAYOUT.right - boxX;
    const boxHeight = 76;

    pdfDoc
      .roundedRect(boxX, yPosition, boxWidth, boxHeight, 3)
      .lineWidth(1)
      .strokeColor(COLORS.border)
      .stroke();
    pdfDoc
      .rect(boxX, yPosition, boxWidth, 3)
      .fill(brandGradient(pdfDoc, boxX, yPosition, boxWidth));

    pdfDoc
      .font("Lato")
      .fontSize(9)
      .fillColor(COLORS.text)
      .text("Spolu", boxX + 12, yPosition + 11, {
        width: boxWidth - 24,
      });
    pdfDoc
      .font("Lato-Bold")
      .fontSize(13)
      .fillColor(
        brandGradient(pdfDoc, boxX + 12, yPosition + 29, boxWidth - 24),
      )
      .text(`${this.formatPrice(totalAmount)} EUR`, boxX + 12, yPosition + 29, {
        width: boxWidth - 24,
        align: "right",
      });
    pdfDoc
      .font("Lato")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text("Nie sme platcami DPH", boxX + 12, yPosition + 54, {
        width: boxWidth - 24,
      });
  }

  drawFooter(pdfDoc, yPosition) {
    pdfDoc
      .font("Lato")
      .fontSize(7)
      .fillColor(COLORS.muted)
      .text(
        "Spoločnosť je zapísaná v Obchodnom registri Okresného súdu Bratislava, oddiel Sro, vložka č. Sro/204732/B",
        LAYOUT.left,
        yPosition,
        { width: LAYOUT.width, align: "center" },
      );
  }

  formatPrice(amount) {
    return amount.toLocaleString("sk-SK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getItemHeight(pdfDoc, item) {
    const nameWidth = LAYOUT.columns[1].width - 10;
    pdfDoc.font("Lato").fontSize(9);
    let contentHeight = pdfDoc.heightOfString(item.name || "", {
      width: nameWidth,
    });

    if (item.description) {
      pdfDoc.fontSize(8);
      contentHeight +=
        2 + pdfDoc.heightOfString(item.description, { width: nameWidth });
    }

    return Math.max(26, contentHeight + 16);
  }
}
