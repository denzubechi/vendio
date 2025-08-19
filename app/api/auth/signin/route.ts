import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email"; // Make sure to import the sendEmail function

export async function POST(request: Request) {
  try {
    const { walletAddress, email } = await request.json();
    const userAgent = request.headers.get("user-agent") || "Unknown Device";

    let user = null;
    if (walletAddress) {
      user = await prisma.user.findUnique({
        where: { walletAddress },
        include: {
          stores: true,
        },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          stores: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Sign-in to Your Vendio Account</h2>
          <p>Hi ${user.username || user.email},</p>
          <p>We noticed a new sign-in to your account on a new device.</p>
          <p><strong>Device:</strong> ${userAgent}</p>
          <p>If this was you, you can ignore this email. If you did not sign in, please contact support immediately.</p>
          <p>Thank you,<br/>The Vendio Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: "New Sign-in Notification",
        html: emailHtml,
      });
    }

    const authUserPayload: any = {
      userId: user.id,
      email: user.email,
      walletAddress: user.walletAddress || "",
    };

    const token = generateToken(authUserPayload);

    cookies().set("vendio-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60,
      path: "/",
    });
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        walletAddress: user.walletAddress,
      },
      store: user.stores[0]
        ? {
            id: user.stores[0].id,
            slug: user.stores[0].slug,
          }
        : null,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
