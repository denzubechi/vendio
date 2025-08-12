import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
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

    // Calculate overview metrics
    const completedOrders = user.orders.filter(
      (order) => order.status === "COMPLETED"
    );
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = completedOrders.length;

    // Get unique customers
    const uniqueCustomers = new Set(
      completedOrders
        .map((order) => order.buyerEmail || order.buyerAddress)
        .filter(Boolean)
    ).size;

    // Calculate conversion rate (rough estimate)
    const totalVisitors = totalOrders * 15;
    const conversionRate =
      totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

    // Calculate month-over-month changes
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

    // Get recent orders (last 5)
    const recentOrders = user.orders.slice(0, 5);

    return NextResponse.json({
      totalRevenue,
      revenueChange,
      totalOrders,
      ordersChange,
      totalCustomers: uniqueCustomers,
      customersChange: 0,
      conversionRate,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}
