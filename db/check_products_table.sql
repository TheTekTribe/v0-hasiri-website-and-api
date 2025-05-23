-- Check products table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;

-- Check a sample product
SELECT * FROM products LIMIT 1;
