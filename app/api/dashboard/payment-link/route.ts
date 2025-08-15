import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
      const paymentLinks = await prisma.paymentLink.findMany({
        where: {
          creatorId: userId,
        },
        include: {
          purchases: {
            select: {
              totalAmount: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const linksWithAnalytics = paymentLinks.map((link) => {
        const completedPurchases = link.purchases.filter(
          (purchase) => purchase.status === OrderStatus.COMPLETED
        );

        const totalSales = completedPurchases.length;
        const totalRevenue = completedPurchases.reduce(
          (sum, purchase) => sum + purchase.totalAmount,
          0
        );

        return {
          id: link.id,
          title: link.title,
          slug: link.slug,
          type: link.type,
          price: link.price,
          isActive: link.isActive,
          purchases: totalSales,
          revenue: totalRevenue,
        };
      });

      return NextResponse.json(linksWithAnalytics);
    } catch (error) {
      console.error("Failed to fetch payment links:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to fetch payment links" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Failed to fetch payment links:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch paymentlink data" },
      { status: 500 }
    );
  }
}
