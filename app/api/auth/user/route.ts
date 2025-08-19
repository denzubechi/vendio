import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    
  const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    
    // Find user by the authenticated userId
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
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
    
    const { name, email, username, avatar } = await request.json();
   const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }
    let newUsername = username;

    if (newUsername) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(newUsername)) {
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
          username: newUsername,
          walletAddress: {
            not: walletAddress,
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

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (newUsername !== undefined) updateData.username = newUsername;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await prisma.user.update({
      where: {
        walletAddress: walletAddress,
      },
      data: updateData,
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

    if (newUsername) {
      await prisma.store.updateMany({
        where: {
          userId: updatedUser.id,
        },
        data: {
          slug: newUsername,
        },
      });

      await prisma.linkInBio.updateMany({
        where: {
          userId: updatedUser.id,
        },
        data: {
          slug: newUsername,
        },
      });
    }

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
