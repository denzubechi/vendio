import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Payment callback received:", body)

    // Handle payment callback from Base Pay
    // You can update order status, send notifications, etc.

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.json({ error: "Callback failed" }, { status: 500 })
  }
}
