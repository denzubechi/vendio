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
      include: {
        orders: {
          where: { status: "COMPLETED" },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate stats
    const totalEarnings = user.orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Calculate monthly earnings (current month)
    const currentMonth = new Date();
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthlyEarnings = user.orders
      .filter((order) => new Date(order.createdAt) >= monthStart)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const transactionCount = user.orders.length;
    const averageTransaction =
      transactionCount > 0 ? totalEarnings / transactionCount : 0;

    // Format transactions
    const transactions = user.orders.map((order) => ({
      id: order.id,
      type: "received" as const,
      amount: order.totalAmount,
      currency: order.currency,
      from: order.buyerAddress || order.buyerEmail || "Anonymous",
      txHash: order.paymentHash || `order-${order.id}`,
      timestamp: order.createdAt.toISOString(),
      description: `Payment for ${order.items[0]?.product.name || "Order"}`,
      status: order.status.toLowerCase() as "completed" | "pending" | "failed",
    }));

    return NextResponse.json({
      stats: {
        totalEarnings,
        monthlyEarnings,
        transactionCount,
        averageTransaction,
      },
      transactions,
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}
