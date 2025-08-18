import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { type NextRequest } from "next/server";

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
      include: {
        orders: {
          where: {
            status: "COMPLETED",
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        products: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedOrders = user.orders;
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = completedOrders.length;

    const uniqueCustomers = new Set(
      completedOrders
        .map((order) => order.buyerEmail || order.buyerAddress)
        .filter(Boolean)
    ).size;

    const totalVisitors = totalOrders * 15;
    const conversionRate =
      totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

    const currentMonth = new Date();
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const currentMonthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );

    const previousMonthOrders = completedOrders.filter(
      (order) =>
        order.createdAt >= previousMonth && order.createdAt < currentMonthStart
    );
    const currentMonthOrders = completedOrders.filter(
      (order) => order.createdAt >= currentMonthStart
    );

    const previousMonthRevenue = previousMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const currentMonthRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const revenueChange =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100
        : currentMonthRevenue > 0
        ? 100
        : 0;

    const ordersChange =
      previousMonthOrders.length > 0
        ? ((currentMonthOrders.length - previousMonthOrders.length) /
            previousMonthOrders.length) *
          100
        : currentMonthOrders.length > 0
        ? 100
        : 0;

    const productSales = new Map();
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId;
        const existing = productSales.get(productId) || {
          name: item.product.name,
          sales: 0,
          revenue: 0,
        };
        existing.sales += item.quantity;
        existing.revenue += item.price * item.quantity;
        productSales.set(productId, existing);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentActivity = completedOrders
      .map((order) => ({
        type: "sale",
        product: order.items[0]?.product.name || "Unknown Product",
        amount: order.totalAmount,
        time: order.createdAt,
      }))
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalRevenue,
        revenueChange,
        totalOrders,
        ordersChange,
        totalCustomers: uniqueCustomers,
        customersChange: 0,
        conversionRate,
        conversionChange: 0,
      },
      topProducts,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
