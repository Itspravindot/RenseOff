import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    const supabase = await createServerSupabaseClient()

    let customerId: string
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", orderData.customer.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
      // Update customer info
      await supabase
        .from("customers")
        .update({
          first_name: orderData.customer.firstName,
          last_name: orderData.customer.lastName,
          phone: orderData.customer.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId)
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          email: orderData.customer.email,
          first_name: orderData.customer.firstName,
          last_name: orderData.customer.lastName,
          phone: orderData.customer.phone,
        })
        .select("id")
        .single()

      if (customerError) throw customerError
      customerId = newCustomer.id
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: "pending",
        subtotal: orderData.pricing.subtotal,
        tax_amount: orderData.pricing.tax,
        shipping_amount: orderData.pricing.shipping,
        total_amount: orderData.pricing.total,
        currency: "USD",
        payment_status: orderData.payment?.razorpay_payment_id ? "paid" : "pending",
        payment_method: orderData.payment?.method || "razorpay",
        razorpay_order_id: orderData.payment?.razorpay_order_id,
        razorpay_payment_id: orderData.payment?.razorpay_payment_id,
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress,
      })
      .select("id, order_number")
      .single()

    if (orderError) throw orderError

    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id, // Assuming item.id matches product UUID
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(order)

    return NextResponse.json({
      success: true,
      orderId: order.order_number,
      order: order,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const orderId = searchParams.get("orderId")
    const supabase = await createServerSupabaseClient()

    if (orderId) {
      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          customers (
            email,
            first_name,
            last_name,
            phone
          ),
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .eq("order_number", orderId)
        .single()

      if (error || !order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, order })
    }

    if (email) {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          customers!inner (
            email,
            first_name,
            last_name
          ),
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .eq("customers.email", email)
        .order("created_at", { ascending: false })

      if (error) throw error
      return NextResponse.json({ success: true, orders: orders || [] })
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        customers (
          email,
          first_name,
          last_name
        ),
        order_items (
          quantity,
          total_price
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, orders: orders || [] })
  } catch (error) {
    console.error("Order retrieval error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve orders" }, { status: 500 })
  }
}
