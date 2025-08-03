import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const {
      productId,
      buyerAddress,
      buyerEmail,
      buyerName,
      paymentIdFromClient,
    } = await request.json();

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
        paymentHash: paymentIdFromClient,
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

    try {
      if (buyerEmail) {
        const confirmationEmail = emailTemplates.orderConfirmation(order, {
          name: buyerName,
          email: buyerEmail,
        });
        await sendEmail({
          to: buyerEmail,
          ...confirmationEmail,
        });
      }
    } catch (emailError) {
      console.error(
        "Failed to send initial order confirmation email:",
        emailError
      );
    }

    return NextResponse.json({
      orderId: order.id,
      paymentId: paymentIdFromClient,
      amount: product.price,
      currency: product.currency,
      message: "Order created. Payment pending confirmation.",
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
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

    const order = await prisma.order.findFirst({
      where: { paymentHash: paymentId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found for this payment ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: order.status, orderId: order.id });
  } catch (error) {
    console.error("Error checking order status:", error);
    return NextResponse.json(
      { error: "Failed to check order status" },
      { status: 500 }
    );
  }
}
