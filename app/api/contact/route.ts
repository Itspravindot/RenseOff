import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body?.email || !body?.message) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from("contact_messages").insert({
      name: body.name || "",
      email: body.email,
      phone: body.phone || "",
      subject: body.subject || "General Inquiry",
      message: body.message,
      status: "new",
    })

    if (error) {
      console.error("Contact message save error:", error)
      throw error
    }

    // TODO: Send email notification to admin
    // await sendContactNotificationEmail(body)

    return NextResponse.json({ ok: true, message: "Message sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ ok: false, error: "Failed to send message" }, { status: 500 })
  }
}
