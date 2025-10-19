import { notFound } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"
import { getProductBySlug, products } from "@/lib/products"
import { ProductPageClient } from "@/components/product-page-client"

export default function ProductBySlugPage({ params }: { params: { slug: string } }) {
  console.log("params.slug:", params.slug)
  const product = getProductBySlug(params.slug as any)
  console.log("product:", product)
  if (!product) return notFound()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ProductDetails product={product} />
      <ProductPageClient product={product} />
      <Footer />
    </div>
  )
}

// Pre-generate static params for the four slugs
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}
