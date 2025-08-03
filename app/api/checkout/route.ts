import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { items, total, buyerInfo, buyerAddress, type, paymentId, transactionHash } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Get the first item's store info (assuming all items are from the same store)
    const firstItem = items[0]
    const store = await prisma.store.findUnique({
      where: { id: firstItem.storeId },
      include: { user: true },
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Create order
    const orderData: any = {
      orderNumber: `ORD-${Date.now()}`,
      totalAmount: total,
      currency: "USDC",
      status: "COMPLETED", // Payment already processed
      paymentHash: transactionHash || paymentId,
      sellerId: store.userId,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    }

    if (type === "guest") {
      orderData.buyerName = buyerInfo.name
      orderData.buyerEmail = buyerInfo.email
    } else if (type === "wallet") {
      orderData.buyerAddress = buyerAddress
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
    })

    // Send emails
    try {
      // Send order confirmation to buyer
      if (orderData.buyerEmail) {
        const confirmationEmail = emailTemplates.orderConfirmation(order, {
          name: orderData.buyerName,
          email: orderData.buyerEmail,
        })
        await sendEmail({
          to: orderData.buyerEmail,
          ...confirmationEmail,
        })
      }

      // Send sale notification to seller
      const sellerEmail = emailTemplates.sellerNotification(order, store.user)
      await sendEmail({
        to: store.user.email,
        ...sellerEmail,
      })

      // Send payment received notification to seller
      if (transactionHash) {
        const paymentEmail = emailTemplates.paymentReceived(
          {
            amount: total,
            currency: "USDC",
            txHash: transactionHash,
          },
          store.user,
        )
        await sendEmail({
          to: store.user.email,
          ...paymentEmail,
        })
      }
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError)
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.totalAmount,
      currency: order.currency,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
