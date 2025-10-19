"use client";

import { useState } from "react";
import { ProductReviews } from "@/components/product-reviews";
import { ReviewForm } from "@/components/review-form";
import { Product } from "@/lib/products";

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [refreshReviews, setRefreshReviews] = useState(false);

  const handleReviewSubmit = () => {
    setRefreshReviews(!refreshReviews);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ProductReviews productId={product.id} key={refreshReviews ? 'refresh' : 'no-refresh'} />
      <div className="mt-8">
        <ReviewForm productId={product.id} onReviewSubmit={handleReviewSubmit} />
      </div>
    </div>
  );
}