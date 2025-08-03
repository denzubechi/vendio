import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { creatorUsername, amount, message, tipperName, tipperEmail } =
      await request.json();

    const creator = await prisma.user.findUnique({
      where: { username: creatorUsername },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const tip = {
      id: `tip-${Date.now()}`,
      amount,
      currency: "USDC",
      message,
      createdAt: new Date(),
    };

    try {
      const tipEmail = emailTemplates.tipReceived(tip, creator, {
        name: tipperName,
        email: tipperEmail,
      });
      await sendEmail({
        to: creator.email,
        ...tipEmail,
      });
    } catch (emailError) {
      console.error("Failed to send tip email:", emailError);
    }

    return NextResponse.json({
      success: true,
      tipId: tip.id,
      message: "Tip sent successfully!",
    });
  } catch (error) {
    console.error("Tip processing failed:", error);
    return NextResponse.json(
      { error: "Failed to process tip" },
      { status: 500 }
    );
  }
}
