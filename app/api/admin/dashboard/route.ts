import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Get total orders
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

    // Get total revenue
    const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("payment_status", "paid")

    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Get total customers
    const { count: totalCustomers } = await supabase.from("customers").select("*", { count: "exact", head: true })

    // Get total products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select(`
        order_number,
        total_amount,
        status,
        created_at,
        customers (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    const formattedRecentOrders =
      recentOrders?.map((order) => ({
        id: order.order_number,
        customer: `${order.customers?.first_name} ${order.customers?.last_name}`,
        total: Number(order.total_amount),
        status: order.status,
        date: order.created_at,
      })) || []

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalCustomers: totalCustomers || 0,
        totalProducts: totalProducts || 0,
        recentOrders: formattedRecentOrders,
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
