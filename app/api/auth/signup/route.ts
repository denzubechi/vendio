import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, username, walletAddress } = await request.json();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }, { walletAddress }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email, username, or wallet" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        walletAddress,
      },
    });

    const store = await prisma.store.create({
      data: {
        name: `${name}'s Store`,
        slug: username,
        description: `Welcome to ${name}'s digital store`,
        userId: user.id,
      },
    });

    await prisma.linkInBio.create({
      data: {
        title: name,
        slug: username,
        description: `Digital Creator & Entrepreneur`,
        links: [],
        userId: user.id,
      },
    });

    try {
      const welcomeEmail = emailTemplates.welcome(name, username);
      await sendEmail({
        to: email,
        ...welcomeEmail,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      store: {
        id: store.id,
        slug: store.slug,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
