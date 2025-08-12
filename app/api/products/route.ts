import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.products);
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const { name, description, price, type, category, isActive } =
      await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stores: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const store = user.stores[0];
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        type,
        category,
        isActive,
        currency: "USDC",
        userId: user.id,
        storeId: store.id,
      },
    });

    try {
      const productEmail = emailTemplates.productAdded(product, user);
      await sendEmail({
        to: user.email,
        ...productEmail,
      });
    } catch (emailError) {
      console.error("Failed to send product added email:", emailError);
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
