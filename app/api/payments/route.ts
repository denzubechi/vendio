import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createPayment, getPaymentStatus } from "@/lib/base-account"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { productId, buyerAddress, buyerEmail, buyerName } = await request.json()

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Create order
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
    })

    // Create payment with Base Account SDK
    const payment = await createPayment({
      amount: product.price,
      currency: product.currency,
      recipient: product.user.walletAddress!,
      metadata: {
        orderId: order.id,
        productId: product.id,
      },
    })

    // Update order with payment hash
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentHash: payment.id,
        status: "COMPLETED", // Assuming payment is successful
      },
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
      if (buyerEmail) {
        const confirmationEmail = emailTemplates.orderConfirmation(updatedOrder, {
          name: buyerName,
          email: buyerEmail,
        })
        await sendEmail({
          to: buyerEmail,
          ...confirmationEmail,
        })
      }

      // Send sale notification to seller
      const sellerEmail = emailTemplates.sellerNotification(updatedOrder, product.user)
      await sendEmail({
        to: product.user.email,
        ...sellerEmail,
      })

      // Send payment received notification to seller
      const paymentEmail = emailTemplates.paymentReceived(
        {
          amount: product.price,
          currency: product.currency,
          txHash: payment.id,
        },
        product.user,
      )
      await sendEmail({
        to: product.user.email,
        ...paymentEmail,
      })
    } catch (emailError) {
      console.error("Failed to send payment emails:", emailError)
    }

    return NextResponse.json({
      orderId: order.id,
      paymentId: payment.id,
      amount: product.price,
      currency: product.currency,
    })
  } catch (error) {
    console.error("Payment creation failed:", error)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("id")

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 })
    }

    // Check payment status with Base Account SDK
    const status = await getPaymentStatus(paymentId)

    // Update order status if payment is completed
    if (status.status === "completed") {
      await prisma.order.updateMany({
        where: { paymentHash: paymentId },
        data: { status: "COMPLETED" },
      })
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error checking payment status:", error)
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 })
  }
}
