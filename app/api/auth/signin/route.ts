import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { generateToken, AuthUser } from "@/lib/auth";
export async function POST(request: Request) {
  try {
    const { walletAddress, email } = await request.json();

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
    const authUserPayload: any = {
      userId: user.id,
      email: user.email,

      walletAddress: user.walletAddress || "",
    };

    const token = generateToken(authUserPayload);

    cookies().set("auth-token", token, {
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
