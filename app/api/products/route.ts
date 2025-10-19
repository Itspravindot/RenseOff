import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Products fetch error:", error)
      throw error
    }

    // Transform database products to match frontend Product type
    const transformedProducts =
      products?.map((product) => ({
        id: product.id,
        slug: product.slug,
        category: product.category,
        name: product.name,
        price: Number.parseFloat(product.price),
        image: product.image_url,
        description: product.description,
        longDescription: product.description,
        features: product.features || [],
        specifications: product.specifications || {},
        inStock: product.stock_quantity > 0,
      })) || []

    return NextResponse.json({
      success: true,
      products: transformedProducts,
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}
