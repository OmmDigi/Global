import { PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";

interface DeclarationFormData {
  name: string;
  sonDaughterWifeOf: string;
  address: string;
  admissionFee: number;
  batchNumber?: number;
  bssRegistrationFee: number;
  parentGuardianName?: string;
  applicantName?: string;
  date?: string;
}

class DeclarationFormGenerator {
  private doc: PDFDocument | null = null;
  private font: PDFFont | null = null;
  private boldFont: PDFFont | null = null;
  private pageWidth: number = 595.28; // A4 width in points
  private pageHeight: number = 841.89; // A4 height in points
  private margin: number = 72; // 1 inch margin

    // constructor() {
    //   this.doc = await PDFDocument.create();
    // }

  async initialize(): Promise<void> {
    this.doc = await PDFDocument.create();
    this.font = await this.doc.embedFont(StandardFonts.TimesRoman);
    this.boldFont = await this.doc.embedFont(StandardFonts.TimesRomanBold);
  }

  async generateDeclarationForm(
    formData: DeclarationFormData
  ): Promise<Buffer> {
    await this.initialize();

    if (!this.doc) {
      throw new Error("No doc reffrence found");
    }

    if (!this.boldFont) {
      throw new Error("Add a bold font first");
    }

    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    let yPosition = this.pageHeight - 100;

    // Title
    page.drawText("DECLARATION", {
      x: (this.pageWidth - this.getTextWidth("DECLARATION", 16)) / 2,
      y: yPosition,
      size: 16,
      font: this.boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 60;

    // First declaration paragraph
    const firstDeclaration = this.formatFirstDeclaration(formData);
    yPosition = this.drawParagraph(page, firstDeclaration, yPosition);

    yPosition -= 40;

    // Second declaration paragraph
    const secondDeclaration = this.formatSecondDeclaration(formData);
    yPosition = this.drawParagraph(page, secondDeclaration, yPosition);

    yPosition -= 80;

    // Signature section
    this.drawSignatureSection(page, yPosition, formData);

    return Buffer.from(await this.doc.save());
  }

  private formatFirstDeclaration(formData: DeclarationFormData): string {
    const nameField = `I, Sri/Smt./Miss. ${
      formData.name || "..........................."
    } S/o, D/o, W/o Sri/Srmt. ${
      formData.sonDaughterWifeOf || "....................."
    }`;
    const addressField = `of ${
      formData.address ||
      "..........................................................................................."
    }`;
    const feeAmount = formData.admissionFee
      ? `Rs. ${formData.admissionFee}/-`
      : "Rs. 5000/-";
    const feeWords =
      formData.admissionFee === 5000
        ? "(Rupees Five thousand"
        : "(Rupees Five thousand";
    const batchInfo = formData.batchNumber
      ? `Batch, ${formData.batchNumber}........`
      : "Batch, 20........";

    return `${nameField} ${addressField} do hereby declare that I will have to pay a sum of ${feeAmount} ${feeWords} only) towards Admission Fee for Montessori Teachers' Training course (6 Months) of................... ${batchInfo} within 3 (three) months from the date of getting Admission in the aforesaid Course.`;
  }

  private formatSecondDeclaration(formData: DeclarationFormData): string {
    const nameField = `I, Sri/Smt./Miss. ${
      formData.name || "..........................."
    } S/o, D/o, W/o Sri/Srmt. ${
      formData.sonDaughterWifeOf || "..................."
    }`;
    const addressField = `of ${
      formData.address ||
      "..........................................................................................."
    }`;
    const bssAmount = formData.bssRegistrationFee
      ? `Rs. ${formData.bssRegistrationFee}/-`
      : "Rs. 5,000/-";

    return `${nameField} ${addressField} do hereby declare that I will also have to pay a sum of ${bssAmount} (Rupees Five thousand) only towards BSS Registration Fee within 3 (Three) months after 6 (Six) months of getting Admission for Montessori Teachers' Training Course.`;
  }

  private drawParagraph(page: any, text: string, startY: number): number {
    const fontSize = 12;
    const lineHeight = 18;
    const maxWidth = this.pageWidth - 2 * this.margin;

    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.getTextWidth(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    let currentY = startY;
    for (const line of lines) {
      page.drawText(line, {
        x: this.margin,
        y: currentY,
        size: fontSize,
        font: this.font,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }

    return currentY;
  }

  private drawSignatureSection(
    page: any,
    yPosition: number,
    formData: DeclarationFormData
  ): void {
    const leftX = this.margin;
    const rightX = this.pageWidth / 2 + 50;
    const lineLength = 150;

    if (formData.applicantName) {
      // Labels below signature lines
      page.drawText(formData.applicantName, {
        x: leftX,
        y: yPosition + 10,
        size: 12,
        font: this.font,
        color: rgb(0, 0, 0),
      });
    }

    if (formData.parentGuardianName) {
      // Labels below signature lines
      page.drawText(formData.parentGuardianName, {
        x: rightX,
        y: yPosition + 10,
        size: 12,
        font: this.font,
        color: rgb(0, 0, 0),
      });
    }
    // Draw signature lines
    page.drawLine({
      start: { x: leftX, y: yPosition },
      end: { x: leftX + lineLength, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: rightX, y: yPosition },
      end: { x: rightX + lineLength, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Labels below signature lines
    page.drawText("Signature of Parent/Guardian", {
      x: leftX,
      y: yPosition - 20,
      size: 12,
      font: this.font,
      color: rgb(0, 0, 0),
    });

    page.drawText("Signature of the Applicant/Candidate", {
      x: rightX,
      y: yPosition - 20,
      size: 12,
      font: this.font,
      color: rgb(0, 0, 0),
    });

    // Date lines
    page.drawText("Date:", {
      x: leftX,
      y: yPosition - 50,
      size: 12,
      font: this.font,
      color: rgb(0, 0, 0),
    });

    page.drawText("Date:", {
      x: rightX,
      y: yPosition - 50,
      size: 12,
      font: this.font,
      color: rgb(0, 0, 0),
    });

    // If date is provided, add it
    if (formData.date) {
      page.drawText(formData.date, {
        x: leftX + 35,
        y: yPosition - 50,
        size: 12,
        font: this.font,
        color: rgb(0, 0, 0),
      });

      page.drawText(formData.date, {
        x: rightX + 35,
        y: yPosition - 50,
        size: 12,
        font: this.font,
        color: rgb(0, 0, 0),
      });
    }
  }

  private getTextWidth(text: string, size: number): number {
    if (!this.font) {
      throw new Error("Font is needed");
    }
    return this.font.widthOfTextAtSize(text, size);
  }

  async saveToFile(buffer: Buffer, filename: string): Promise<void> {
    fs.writeFileSync(filename, buffer);
  }
}

// // Export for use as module
export { DeclarationFormGenerator, DeclarationFormData };
