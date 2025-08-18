import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { sellerId: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const customerMap = new Map();

    orders.forEach((order) => {
      const customerId = order.buyerEmail || order.buyerAddress || order.id;
      const customerKey = order.buyerEmail || order.buyerAddress;

      if (!customerKey) {
        return;
      }

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
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
