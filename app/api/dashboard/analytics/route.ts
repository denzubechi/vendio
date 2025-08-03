import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        products: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate analytics
    const completedOrders = user.orders.filter((order) => order.status === "COMPLETED")
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = completedOrders.length

    // Get unique customers
    const uniqueCustomers = new Set(
      completedOrders.map((order) => order.buyerEmail || order.buyerAddress).filter(Boolean),
    ).size

    // Calculate conversion rate (assuming 100 visitors per order for demo)
    const totalVisitors = totalOrders * 15 // Rough estimate
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0

    // Get previous month data for comparison
    const currentMonth = new Date()
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

    const previousMonthOrders = completedOrders.filter(
      (order) => order.createdAt >= previousMonth && order.createdAt < currentMonthStart,
    )
    const currentMonthOrders = completedOrders.filter((order) => order.createdAt >= currentMonthStart)

    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    const revenueChange =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0

    const ordersChange =
      previousMonthOrders.length > 0
        ? ((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100
        : currentMonthOrders.length > 0
          ? 100
          : 0

    // Top products
    const productSales = new Map()
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId
        const existing = productSales.get(productId) || {
          name: item.product.name,
          sales: 0,
          revenue: 0,
        }
        existing.sales += item.quantity
        existing.revenue += item.price * item.quantity
        productSales.set(productId, existing)
      })
    })

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Recent activity
    const recentActivity = completedOrders
      .slice(-10)
      .reverse()
      .map((order) => ({
        type: "sale",
        product: order.items[0]?.product.name || "Unknown Product",
        amount: order.totalAmount,
        time: order.createdAt,
      }))

    return NextResponse.json({
      overview: {
        totalRevenue,
        revenueChange,
        totalOrders,
        ordersChange,
        totalCustomers: uniqueCustomers,
        customersChange: 0, // Would need historical data
        conversionRate,
        conversionChange: 0, // Would need historical data
      },
      topProducts,
      recentActivity,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
