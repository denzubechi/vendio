import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch link in bio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request); // Authenticate the user

    const { title, description, avatar, theme, links, isActive } =
      await request.json();

    // Find the authenticated user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if a LinkInBio already exists for this user (should be unique per user)
    const existingLinkInBio = await prisma.linkInBio.findUnique({
      where: { userId: user.id },
    });

    if (existingLinkInBio) {
      return NextResponse.json(
        {
          error: "Link in Bio already exists for this user. Use PUT to update.",
        },
        { status: 409 } // Conflict
      );
    }

    const linkInBio = await prisma.linkInBio.create({
      data: {
        title,
        description,
        avatar,
        slug: user.username || "",
        theme,
        links,
        isActive,
        userId: user.id,
      },
    });

    return NextResponse.json(linkInBio, { status: 201 });
  } catch (error) {
    console.error("Error creating link in bio:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create link in bio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const {
      linkInBioId,
      title,
      description,
      avatar,
      theme,
      links,
      socialUrls,
      projects,
      isActive,
    } = await request.json();

    // Ensure the linkInBioId belongs to the authenticated user
    const existingLinkInBio = await prisma.linkInBio.findUnique({
      where: { id: linkInBioId },
      select: { userId: true },
    });

    if (!existingLinkInBio || existingLinkInBio.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized or Link in Bio not found" },
        { status: 403 }
      );
    }

    const linkInBio = await prisma.linkInBio.update({
      where: { id: linkInBioId },
      data: {
        title,
        description,
        avatar,
        theme,
        socialUrls,
        links,
        isActive,
        projects,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(linkInBio);
  } catch (error) {
    console.error("Error updating link in bio:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update link in bio" },
      { status: 500 }
    );
  }
}
