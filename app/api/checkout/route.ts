import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const {
      items,
      total,
      buyerInfo,
      buyerAddress,
      type,
      paymentId,
      transactionHash,
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const firstItem = items[0];
    const store = await prisma.store.findUnique({
      where: { id: firstItem.storeId },
      include: { user: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const orderData: any = {
      orderNumber: `ORD-${Date.now()}`,
      totalAmount: total,
      currency: "USDC",
      status: "COMPLETED", 
      paymentHash: transactionHash || paymentId,
      sellerId: store.userId,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    if (type === "guest") {
      orderData.buyerName = buyerInfo.name;
      orderData.buyerEmail = buyerInfo.email;
    } else if (type === "wallet") {
      orderData.buyerAddress = buyerAddress;
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    try {
      if (orderData.buyerEmail) {
        const confirmationEmail = emailTemplates.orderConfirmation(order, {
          name: orderData.buyerName,
          email: orderData.buyerEmail,
        });
        await sendEmail({
          to: orderData.buyerEmail,
          ...confirmationEmail,
        });
      }

      const sellerEmail = emailTemplates.sellerNotification(order, store.user);
      await sendEmail({
        to: store.user.email,
        ...sellerEmail,
      });

      if (transactionHash) {
        const paymentEmail = emailTemplates.paymentReceived(
          {
            amount: total,
            currency: "USDC",
            txHash: transactionHash,
          },
          store.user
        );
        await sendEmail({
          to: store.user.email,
          ...paymentEmail,
        });
      }
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.totalAmount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
