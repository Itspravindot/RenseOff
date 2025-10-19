"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Premium Hand Wash",
    subtitle: "Gentle Care for Your Hands",
    description: "Antibacterial formula that cleanses while moisturizing your skin",
    image: "/premium-hand-wash.png",
    cta: "Shop Hand Wash",
    href: "/products/handwash",
  },
  {
    id: 2,
    title: "Rense Off Floor Cleaner",
    subtitle: "Fresh in a Flash",
    description: "Geranium flower scented cleaner that's pet safe and perfect for wood and tiles",
    image: "/rense-off-floor-cleaner.png",
    cta: "Shop Floor Cleaner",
    href: "/products/floor-cleaner",
  },
  {
    id: 3,
    title: "Advanced Laundry Detergent",
    subtitle: "Deep Clean Technology",
    description: "Removes tough stains while keeping fabrics soft and fresh",
    image: "/placeholder-ifylf.png",
    cta: "Shop Detergent",
    href: "/products/laundry-detergent",
  },
  {
    id: 4,
    title: "Ultra Dish Wash",
    subtitle: "Grease-Fighting Power",
    description: "Cuts through grease and grime, leaving dishes spotless",
    image: "/placeholder-76g9n.png",
    cta: "Shop Dish Wash",
    href: "/products/dishwash",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className="relative h-full">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-4">
                <h2 className="text-sm font-medium text-white/80 mb-2 tracking-wide uppercase">{slide.subtitle}</h2>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">{slide.description}</p>
                <Link href={slide.href}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
