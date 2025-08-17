import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const {
      name,
      description,
      price,
      type,
      category,
      imageUrls,
      productUrl,
      isActive,
    } = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        type,
        category,
        imageUrls,
        productUrl,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
