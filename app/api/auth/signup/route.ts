import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, username, walletAddress } = await request.json();

    // Check if user already exists
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

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        walletAddress,
      },
    });

    // Create default store
    const store = await prisma.store.create({
      data: {
        name: `${name}'s Store`,
        slug: username,
        description: `Welcome to ${name}'s digital store`,
        userId: user.id,
      },
    });

    // Create default link in bio
    await prisma.linkInBio.create({
      data: {
        title: name,
        slug: username,
        description: `Digital Creator & Entrepreneur`,
        links: [],
        userId: user.id,
      },
    });

    // Send welcome email
    try {
      const welcomeEmail = emailTemplates.welcome(name, username);
      await sendEmail({
        to: email,
        ...welcomeEmail,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the signup if email fails
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
