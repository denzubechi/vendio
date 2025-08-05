import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress.toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        walletAddress: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data with avatar
    return NextResponse.json({
      ...user,
      avatar:
        user.avatar ||
        `/placeholder.svg?height=40&width=40&text=${
          user.name?.charAt(0) || "U"
        }`,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { walletAddress, name, email, username, avatar } =
      await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Validate username format if provided
    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          {
            error:
              "Username can only contain letters, numbers, and underscores",
          },
          { status: 400 }
        );
      }

      // Check if username is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          walletAddress: {
            not: walletAddress.toLowerCase(),
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            error: "Username is already taken",
          },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        walletAddress: walletAddress.toLowerCase(),
      },
      data: {
        name: name || null,
        email: email || null,
        username: username || null,
        avatar: avatar || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        walletAddress: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
