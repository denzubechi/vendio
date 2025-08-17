import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const {
      paymentLinkId,
      totalAmount,
      currency,
      buyerEmail,
      buyerName,
      paymentHash,
      tipAmount = 0,
    } = await request.json();

    const purchaseNumber = `PL-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const purchase = await prisma.purchase.create({
      data: {
        purchaseNumber,
        totalAmount,
        currency,
        status: "COMPLETED", // Assuming payment was successful
        paymentHash,
        buyerEmail,
        buyerName,
        paymentLinkId,
      },
      include: {
        paymentLink: {
          include: {
            creator: true,
          },
        },
      },
    });

    console.log("[v0] Purchase created:", purchase.id);

    const buyerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Purchase Confirmation</h2>
        <p>Hi ${buyerName},</p>
        <p>Thank you for your purchase! Here are the details:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${purchase.paymentLink.title}</h3>
          <p><strong>Purchase Number:</strong> ${purchaseNumber}</p>
          <p><strong>Amount:</strong> $${totalAmount.toFixed(2)} ${currency}</p>
          ${
            tipAmount > 0
              ? `<p><strong>Tip:</strong> $${tipAmount.toFixed(
                  2
                )} ${currency}</p>`
              : ""
          }
          <p><strong>Transaction Hash:</strong> ${paymentHash}</p>
        </div>

        ${
          purchase.paymentLink.digitalFileUrl
            ? `
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">Your Digital Download</h3>
            <p>Click the link below to download your digital product:</p>
            <a href="${purchase.paymentLink.digitalFileUrl}" 
               style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Download Now
            </a>
          </div>
        `
            : ""
        }

        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Payment Links Team</p>
      </div>
    `;

    await sendEmail({
      to: buyerEmail,
      subject: `Purchase Confirmation - ${purchase.paymentLink.title}`,
      html: buyerEmailHtml,
    });

    const creatorEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Purchase Notification</h2>
        <p>Hi ${purchase.paymentLink.creator.name || "Creator"},</p>
        <p>Great news! You have a new purchase for your payment link.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${purchase.paymentLink.title}</h3>
          <p><strong>Purchase Number:</strong> ${purchaseNumber}</p>
          <p><strong>Buyer:</strong> ${buyerName} (${buyerEmail})</p>
          <p><strong>Amount:</strong> $${totalAmount.toFixed(2)} ${currency}</p>
          ${
            tipAmount > 0
              ? `<p><strong>Tip Received:</strong> $${tipAmount.toFixed(
                  2
                )} ${currency}</p>`
              : ""
          }
          <p><strong>Transaction Hash:</strong> ${paymentHash}</p>
        </div>

        <p>The payment has been processed successfully and the buyer has been notified.</p>
        <p>Best regards,<br>Payment Links Team</p>
      </div>
    `;

    await sendEmail({
      to: purchase.paymentLink.creator.email,
      subject: `New Purchase - ${purchase.paymentLink.title}`,
      html: creatorEmailHtml,
    });

    console.log("[v0] Confirmation emails sent");

    return NextResponse.json({
      success: true,
      purchase: {
        id: purchase.id,
        purchaseNumber: purchase.purchaseNumber,
        totalAmount: purchase.totalAmount,
        currency: purchase.currency,
      },
    });
  } catch (error) {
    console.error("Purchase creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}
