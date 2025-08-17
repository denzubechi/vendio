import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePaymentLinkSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .optional(),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required").optional(),
  price: z
    .number()
    .nonnegative("Price must be a non-negative number")
    .optional(),
  currency: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  digitalFileUrl: z.string().url("Invalid file URL").optional(),
  allowTips: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if payment link exists and belongs to user
    const existingPaymentLink = await prisma.paymentLink.findFirst({
      where: {
        id,
        creatorId: userId,
      },
    });

    if (!existingPaymentLink) {
      return NextResponse.json(
        { error: "Payment link not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = updatePaymentLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const updatedPaymentLink = await prisma.paymentLink.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(updatedPaymentLink);
  } catch (error) {
    console.error("Failed to update payment link:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update payment link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if payment link exists and belongs to user
    const existingPaymentLink = await prisma.paymentLink.findFirst({
      where: {
        id,
        creatorId: userId,
      },
    });

    if (!existingPaymentLink) {
      return NextResponse.json(
        { error: "Payment link not found" },
        { status: 404 }
      );
    }

    await prisma.paymentLink.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Payment link deleted successfully" });
  } catch (error) {
    console.error("Failed to delete payment link:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete payment link" },
      { status: 500 }
    );
  }
}
