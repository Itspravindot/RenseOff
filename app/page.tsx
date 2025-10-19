import { HeroSlider } from "@/components/hero-slider"
import { Navigation } from "@/components/navigation"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSlider />
      <ProductGrid />
      <Footer />
    </div>
  )
}
