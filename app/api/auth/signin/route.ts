import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { walletAddress, email } = await request.json()

    let user = null

    if (walletAddress) {
      user = await prisma.user.findUnique({
        where: { walletAddress },
        include: {
          stores: true,
        },
      })
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          stores: true,
        },
      })
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

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
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
