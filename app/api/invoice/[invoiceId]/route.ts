import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatCurrency } from "@/app/utils/formatCurrency";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientAddress: true,
      clientEmail: true,
      dueDate: true,
      date: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      total: true,
      note: true,
      status: true,
    },
  });
  if (!data) {
    return NextResponse.json({ error: "Invoive not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  //set font
  pdf.setFont("helvetica");

  //set header
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  //from section
  pdf.setFontSize(12);
  pdf.text("From", 20, 40);
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  //client section
  pdf.setFontSize(12);
  pdf.text("Bill to", 20, 70);
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  //invoive details
  pdf.setFontSize(10);
  pdf.text(`Invoice Number:#${data.invoiceNumber}`, 120, 40);
  pdf.text(
    `Date:${new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(data.date)}`,
    120,
    45
  );
  pdf.text(`Due Date: Net ${data.dueDate}`, 120, 50);

  // item table header
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Total", 160, 100);

  // draw header line
  pdf.line(20, 102, 190, 102);

  // item details
  pdf.setFont("helvetica", "normal");
  pdf.text(data.invoiceItemDescription, 20, 110);
  pdf.text(data.invoiceItemQuantity.toString(), 100, 110);
  pdf.text(
    formatCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency as any,
    }),
    130,
    110
  );
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    110
  );

  // total section
  pdf.line(20, 115, 190, 115);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total (${data.currency})`, 130, 130);
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    130
  );

  //additional note
  if (data.note) {
    pdf.setFont("helvetice", "normal");
    pdf.setFontSize(10);
    pdf.text("NOte:", 20, 150);
    pdf.text(data.note, 20, 155);
  }

  //generate pdf as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  //return pdf as download
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
