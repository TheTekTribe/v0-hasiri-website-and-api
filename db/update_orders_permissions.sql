-- Grant all permissions on orders table to authenticated users
GRANT ALL ON orders TO authenticated;

-- Grant all permissions on order_items table to authenticated users
GRANT ALL ON order_items TO authenticated;

-- Disable RLS temporarily for testing
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Create a direct SQL function to update order status
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
  p_order_id UUID,
  p_status TEXT
)
RETURNS SETOF orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE orders
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_order_id
  RETURNING *;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_update_order_status TO authenticated;
