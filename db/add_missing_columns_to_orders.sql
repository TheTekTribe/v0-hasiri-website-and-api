-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_method character varying,
ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0;
