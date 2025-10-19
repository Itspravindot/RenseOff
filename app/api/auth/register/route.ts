import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()
    const supabase = await createServerSupabaseClient()

    // Check if customer already exists
    const { data: existingCustomer } = await supabase.from("customers").select("id").eq("email", email).single()

    if (existingCustomer) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 })
    }

    // Create new customer
    // In production, you'd hash the password before storing
    const { data: newCustomer, error } = await supabase
      .from("customers")
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        // Note: In production, store password hash, not plain text
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newCustomer.id,
        email: newCustomer.email,
        firstName: newCustomer.first_name,
        lastName: newCustomer.last_name,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}
