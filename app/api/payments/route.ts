import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPayment, checkPaymentStatus } from "@/lib/base-account";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { productId, buyerAddress, buyerEmail, buyerName } =
      await request.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        totalAmount: product.price,
        currency: product.currency,
        status: "PENDING",
        buyerEmail,
        buyerName,
        buyerAddress,
        sellerId: product.userId,
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const payment = await createPayment({
      amount: product.price,
      to: product.user.walletAddress!,
      message: `Payment for ${product.name} (Order: ${order.orderNumber})`,
    });

    if (payment.success) {
      const { id } = payment;
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentHash: id,
          status: "COMPLETED",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      try {
        if (buyerEmail) {
          const confirmationEmail = emailTemplates.orderConfirmation(
            updatedOrder,
            {
              name: buyerName,
              email: buyerEmail,
            }
          );
          await sendEmail({
            to: buyerEmail,
            ...confirmationEmail,
          });
        }

        const sellerEmail = emailTemplates.sellerNotification(
          updatedOrder,
          product.user
        );
        await sendEmail({
          to: product.user.email,
          ...sellerEmail,
        });

        const paymentEmail = emailTemplates.paymentReceived(
          {
            amount: product.price,
            currency: product.currency,
            txHash: payment.id,
          },
          product.user
        );
        await sendEmail({
          to: product.user.email,
          ...paymentEmail,
        });
      } catch (emailError) {
        console.error("Failed to send payment emails:", emailError);
      }
      return NextResponse.json({
        orderId: order.id,
        paymentId: id,
        amount: product.price,
        currency: product.currency,
      });
    } else {
      const { error } = payment;
      console.error("Payment creation failed:", error);
      return NextResponse.json(
        { error: `Payment failed: ${error || "Unknown error"}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment creation failed:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID required" },
        { status: 400 }
      );
    }

    const status = await checkPaymentStatus(paymentId);

    if (status.status === "completed") {
      await prisma.order.updateMany({
        where: { paymentHash: paymentId },
        data: { status: "COMPLETED" },
      });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
