-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can view all reviews
CREATE POLICY "Users can view all reviews"
    ON reviews FOR SELECT
    USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create their own reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = customer_id)
    WITH CHECK (auth.uid() = customer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = customer_id);

-- Admin policies
CREATE POLICY "Admins can view all reviews"
    ON reviews FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update all reviews"
    ON reviews FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete all reviews"
    ON reviews FOR DELETE
    USING (is_admin());