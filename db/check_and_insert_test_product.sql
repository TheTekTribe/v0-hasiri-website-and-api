-- First, check the products table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';

-- Check if we have any products
SELECT COUNT(*) FROM products;

-- Look at a sample of products
SELECT id, name, price, sale_price, stock_quantity 
FROM products 
LIMIT 5;

-- Insert a test product if needed (only if we have no products)
INSERT INTO products (name, description, price, sale_price, stock_quantity, category_id)
SELECT 
  'Bio-Stimulant Plus', 
  'A premium bio-stimulant for enhanced plant growth', 
  1200, 
  NULL, 
  100, 
  (SELECT id FROM categories LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Bio-Stimulant Plus'
);

-- Verify the test product
SELECT id, name, price, sale_price, stock_quantity 
FROM products 
WHERE name = 'Bio-Stimulant Plus';
