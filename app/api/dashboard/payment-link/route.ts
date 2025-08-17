import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

const createPaymentLinkSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  currency: z.string().default("USDC"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  digitalFileUrl: z.string().url("Invalid file URL").optional(),
  allowTips: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

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

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const validationResult = createPaymentLinkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }
    const {
      title,
      description,
      type,
      price,
      currency,
      imageUrl,
      digitalFileUrl,
      allowTips,
      isActive,
    } = validationResult.data;

    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    let slugExists = true;

    while (slugExists) {
      const existingLink = await prisma.paymentLink.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existingLink) {
        slugExists = false;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const newPaymentLink = await prisma.paymentLink.create({
      data: {
        title,
        description,
        type,
        price,
        currency,
        imageUrl,
        digitalFileUrl,
        allowTips,
        isActive,
        creatorId: userId,
        slug,
      },
    });

    return NextResponse.json(newPaymentLink, { status: 201 });
  } catch (error) {
    console.error("Failed to create payment link:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
