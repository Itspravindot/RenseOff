import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with your actual database
const orders: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = orders.find((o) => o.id === params.id)

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Order retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const orderIndex = orders.findIndex((o) => o.id === params.id)

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // TODO: Send status update email if status changed
    // if (updates.status) {
    //   await sendOrderStatusEmail(orders[orderIndex])
    // }

    return NextResponse.json({
      success: true,
      order: orders[orderIndex],
    })
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
