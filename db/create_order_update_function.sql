-- Create a function to update order status that bypasses RLS
CREATE OR REPLACE FUNCTION update_order_status(order_id UUID, new_status TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
AS $$
BEGIN
  UPDATE orders
  SET 
    status = new_status,
    updated_at = NOW()
  WHERE id = order_id;
  
  RETURN FOUND; -- Returns true if a row was updated, false otherwise
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_order_status TO authenticated;
