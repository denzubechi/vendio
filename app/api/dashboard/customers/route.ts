import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all orders for this seller
    const orders = await prisma.order.findMany({
      where: { sellerId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Group orders by customer and calculate stats
    const customerMap = new Map();

    orders.forEach((order) => {
      const customerId = order.buyerEmail || order.buyerAddress || order.id;
      const customerKey = order.buyerEmail || order.buyerAddress;

      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          id: customerId,
          name: order.buyerName,
          email: order.buyerEmail,
          walletAddress: order.buyerAddress,
          totalSpent: 0,
          orderCount: 0,
          lastOrderDate: order.createdAt,
          orders: [],
        });
      }

      const customer = customerMap.get(customerKey);
      customer.totalSpent += order.totalAmount;
      customer.orderCount += 1;
      customer.orders.push(order);

      // Update last order date if this order is more recent
      if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
