import PDFDocument from "pdfkit";
import { formatDate } from "./formateDate.js";

export const generateInvoiceUpgrade = (user, data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData); // Return the PDF as a buffer
      });

      // **Title**
      doc
        .fontSize(35)
        .fillColor("#007bff")
        .font("Helvetica-Bold")
        .text("INVOICE", { align: "center" })
        .moveDown(1);

      // **Company Name**
      doc
        .fontSize(20)
        .fillColor("#333")
        .font("Helvetica-Bold")
        .text("Gym Membership Invoice", { align: "center" })
        .moveDown(0.5);

      // **Invoice ID**
      let invoiceId = Math.floor(Math.random() * 1000000);
      doc
        .fontSize(12)
        .fillColor("gray")
        .text(`Invoice ID: #${invoiceId}`, { align: "right" })
        .moveDown(1);

      // **Line Separator**
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1.5);

      // **User Details**
      doc
        .fontSize(18)
        .fillColor("#000")
        .font("Helvetica-Bold")
        .text("User Details")
        .moveDown(0.7);
      doc
        .fontSize(14)
        .font("Helvetica")
        .text(`Name: ${user.name}`)
        .moveDown(0.3);
      doc.text(`Email: ${user.email}`).moveDown(1);

      // **Line Separator**
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1.5);

      // **Purchase Details**
      doc
        .fontSize(18)
        .fillColor("#000")
        .font("Helvetica-Bold")
        .text("Membership Details")
        .moveDown(0.7);
      doc
        .fontSize(14)
        .font("Helvetica")
        .text(`Type: Upgrade`)
        .moveDown(0.3)
        .text(`Upgraded From: ${data.currentMembership}`)
        .moveDown(0.3)
        .text(`Upgraded To: ${data.newMembershipType}`)
        .moveDown(0.3)
        .text(`Price: Rs. ${data.price}`)
        .moveDown(0.3)
        .text(`Purchase Date: ${formatDate(user.membershipStartDate)}`)
        .moveDown(0.3)
        .text(`Expiry Date: ${formatDate(user.membershipExpirationDate)}`)
        .moveDown(1.5);

      // **Line Separator**
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1.5);

      // **Total Amount Paid**
      doc
        .fontSize(18)
        .fillColor("#007bff")
        .font("Helvetica-Bold")
        .text(`Total Amount Paid: Rs. ${data.price}`, { align: "right" })
        .moveDown(2);

      // **Footer**
      doc
        .fontSize(12)
        .fillColor("gray")
        .text("Thank you for your purchase!", { align: "center" });

      // **End Document**
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
