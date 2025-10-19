export type Product = {
  id: string // Changed from number to string for UUID compatibility
  slug: "handwash" | "floor-cleaner" | "laundry-detergent" | "dishwash"
  category: string
  name: string
  price: number
  image: string
  description: string
  longDescription?: string
  features?: string[]
  specifications?: Record<string, string>
  inStock?: boolean
}

export const products: Product[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001", // Mock UUID for handwash
    slug: "handwash",
    category: "Personal Care",
    name: "Premium Hand Wash",
    price: 299.0, // Updated to match database pricing
    image: "/premium-hand-wash.png",
    description:
      "Gentle yet effective hand wash with moisturizing properties. Perfect for daily use with a refreshing fragrance.",
    longDescription:
      "Our premium hand wash combines powerful antibacterial protection with gentle moisturizing ingredients. Perfect for frequent use with aloe vera and vitamin E.",
    features: ["Moisturizing formula", "Antibacterial protection", "Pleasant fragrance", "Gentle on skin"],
    specifications: {
      Volume: "500ml",
      "pH Level": "5.5-6.5",
      Ingredients: "Aloe Vera, Vitamin E, Natural extracts",
    },
    inStock: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", // Mock UUID for floor cleaner
    slug: "floor-cleaner",
    category: "Floor Care",
    name: "Rense Off Floor Cleaner - Geranium Flower",
    price: 449.0, // Updated to match database pricing
    image: "/rense-off-floor-cleaner.png",
    description:
      "Fresh in a flash floor cleaner with geranium flower fragrance. Pet safe and suitable for wood and tiles.",
    longDescription:
      "Professional-grade floor cleaner with geranium flower scent. Safe for pets and effective on wood, tiles, and laminate surfaces.",
    features: ["Pet safe formula", "Wood and tiles safe", "Geranium flower scent", "Quick drying"],
    specifications: {
      Volume: "500ml",
      "Surface Types": "Wood, Tiles, Laminate",
      "Drying Time": "5 minutes",
    },
    inStock: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003", // Mock UUID for laundry detergent
    slug: "laundry-detergent",
    category: "Laundry Care",
    name: "Premium Laundry Detergent",
    price: 399.0, // Updated to match database pricing
    image: "/rense-off-laundry-detergent.png",
    description:
      "Concentrated laundry detergent that removes tough stains while being gentle on fabrics. Suitable for all washing machines.",
    longDescription:
      "Advanced concentrated formula that penetrates deep into fibers to remove tough stains while protecting fabric integrity and colors.",
    features: ["Concentrated formula", "Stain removal", "Fabric protection", "Fresh scent"],
    specifications: {
      Volume: "1L",
      Loads: "40-50",
      "Fabric Types": "Cotton, Synthetic, Delicate",
    },
    inStock: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004", // Mock UUID for dishwash
    slug: "dishwash",
    category: "Kitchen Care",
    name: "Effective Dishwash Liquid",
    price: 249.0, // Updated to match database pricing
    image: "/rense-off-dishwash.png",
    description:
      "Powerful dishwash liquid that cuts through grease and grime. Gentle on hands with a pleasant lemon fragrance.",
    longDescription:
      "Ultra-concentrated dishwash liquid that cuts through grease and grime with ease. Gentle on hands with natural lemon fragrance.",
    features: ["Grease cutting formula", "Gentle on hands", "Lemon fragrance", "Concentrated"],
    specifications: {
      Volume: "500ml",
      "pH Level": "6.0-7.0",
      Fragrance: "Lemon",
    },
    inStock: true,
  },
]

export function getProductBySlug(slug: Product["slug"]) {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}
