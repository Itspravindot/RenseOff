-- Insert your 4 cleaning products
-- Run this after creating the tables

INSERT INTO products (name, slug, description, price, image_url, category, features, specifications, stock_quantity) VALUES
(
  'Premium Hand Wash',
  'handwash',
  'Gentle yet effective hand wash with moisturizing properties. Perfect for daily use with a refreshing fragrance.',
  299.00,
  '/premium-hand-wash.png',
  'Personal Care',
  ARRAY['Moisturizing formula', 'Antibacterial protection', 'Pleasant fragrance', 'Gentle on skin'],
  '{"volume": "500ml", "ph_level": "5.5-6.5", "ingredients": ["Aloe Vera", "Vitamin E", "Natural extracts"]}',
  100
),
(
  'Rense Off Floor Cleaner - Geranium Flower',
  'floor-cleaner',
  'Fresh in a flash floor cleaner with geranium flower fragrance. Pet safe and suitable for wood and tiles.',
  449.00,
  '/rense-off-floor-cleaner.png',
  'Floor Care',
  ARRAY['Pet safe formula', 'Wood and tiles safe', 'Geranium flower scent', 'Quick drying'],
  '{"volume": "500ml", "surface_types": ["Wood", "Tiles", "Laminate"], "drying_time": "5 minutes"}',
  75
),
(
  'Premium Laundry Detergent',
  'laundry-detergent',
  'Concentrated laundry detergent that removes tough stains while being gentle on fabrics. Suitable for all washing machines.',
  399.00,
  '/rense-off-laundry-detergent.png',
  'Laundry Care',
  ARRAY['Concentrated formula', 'Stain removal', 'Fabric protection', 'Fresh scent'],
  '{"volume": "1L", "loads": "40-50", "fabric_types": ["Cotton", "Synthetic", "Delicate"]}',
  60
),
(
  'Effective Dishwash Liquid',
  'dishwash',
  'Powerful dishwash liquid that cuts through grease and grime. Gentle on hands with a pleasant lemon fragrance.',
  249.00,
  '/rense-off-dishwash.png',
  'Kitchen Care',
  ARRAY['Grease cutting formula', 'Gentle on hands', 'Lemon fragrance', 'Concentrated'],
  '{"volume": "500ml", "ph_level": "6.0-7.0", "fragrance": "Lemon"}',
  90
);
