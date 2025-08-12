import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stores: true,
      },
    });

    if (!user || !user.stores.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(user.stores[0]);
  } catch (error) {
    console.error("Error fetching store:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const { name, description, logo, banner, theme, isActive } =
      await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingStore = await prisma.store.findFirst({
      where: { userId: user.id },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "User already has a store. Use PUT to update." },
        { status: 409 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const store = await prisma.store.create({
      data: {
        name,
        slug,
        description,
        logo,
        banner,
        theme,
        isActive,
        userId: user.id,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const { storeId, name, description, logo, banner, theme, isActive } =
      await request.json();

    const existingStore = await prisma.store.findUnique({
      where: { id: storeId },
      select: { userId: true },
    });

    if (!existingStore || existingStore.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized or Store not found" },
        { status: 403 }
      );
    }

    const store = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        description,
        logo,
        banner,
        theme,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("Error updating store:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
