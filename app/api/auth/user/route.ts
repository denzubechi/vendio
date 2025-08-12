import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    // Find user by the authenticated userId
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
    const userId = await requireAuth(request);
    const { name, email, username, avatar } = await request.json();

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

      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          id: {
            not: userId, 
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

    const updatedUser = await prisma.user.update({
      where: {
        id: userId, 
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
