import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_active", true)
      .single()

    if (error || !product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    // Transform database product to match frontend Product type
    const transformedProduct = {
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
    }

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    })
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}
