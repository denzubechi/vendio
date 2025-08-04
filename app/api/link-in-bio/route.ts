import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        linkInBio: true,
      },
    });

    if (!user || !user.linkInBio) {
      return NextResponse.json(
        { error: "Link in Bio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.linkInBio);
  } catch (error) {
    console.error("Error fetching link in bio:", error);
    return NextResponse.json(
      { error: "Failed to fetch link in bio" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      avatar,
      theme,
      links,
      isActive,
      walletAddress,
    } = await request.json();

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const linkInBio = await prisma.linkInBio.create({
      data: {
        title,
        description,
        avatar,
        theme,
        links,
        isActive,
        userId: user.id,
      },
    });

    return NextResponse.json(linkInBio, { status: 201 });
  } catch (error) {
    console.error("Error creating link in bio:", error);
    return NextResponse.json(
      { error: "Failed to create link in bio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { linkInBioId, title, description, avatar, theme, links, isActive } =
      await request.json();

    const linkInBio = await prisma.linkInBio.update({
      where: { id: linkInBioId },
      data: {
        title,
        description,
        avatar,
        theme,
        links,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(linkInBio);
  } catch (error) {
    console.error("Error updating link in bio:", error);
    return NextResponse.json(
      { error: "Failed to update link in bio" },
      { status: 500 }
    );
  }
}
