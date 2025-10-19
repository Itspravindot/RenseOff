import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const supabase = await createServerSupabaseClient()

    // For demo purposes, we'll use a simple email/password check
    // In production, you'd use proper authentication with Supabase Auth
    const { data: customer, error } = await supabase.from("customers").select("*").eq("email", email).single()

    if (error || !customer) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // In production, you'd verify the password hash here
    // For demo, we'll accept any password for existing customers

    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
