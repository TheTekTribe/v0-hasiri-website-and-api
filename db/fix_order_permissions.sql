-- Check current RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders' OR tablename = 'order_items';

-- Drop existing policies if they're causing issues
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;

-- Create more permissive policies for orders
CREATE POLICY "Public insert access for orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create more permissive policies for order items
CREATE POLICY "Public insert access for order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create a function to bypass RLS for order creation
CREATE OR REPLACE FUNCTION admin_create_order(
  p_user_id UUID,
  p_shipping_address JSONB,
  p_billing_address JSONB,
  p_payment_method TEXT,
  p_shipping_method TEXT,
  p_subtotal NUMERIC,
  p_shipping_cost NUMERIC,
  p_tax NUMERIC,
  p_total NUMERIC,
  p_status TEXT,
  p_items JSONB
) RETURNS JSONB AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_quantity INT;
  v_result JSONB;
BEGIN
  -- Create the order
  INSERT INTO orders (
    user_id,
    shipping_address,
    billing_address,
    payment_method,
    shipping_method,
    subtotal,
    shipping_cost,
    tax,
    total,
    status
  ) VALUES (
    p_user_id,
    p_shipping_address,
    p_billing_address,
    p_payment_method,
    p_shipping_method,
    p_subtotal,
    p_shipping_cost,
    p_tax,
    p_total,
    p_status
  ) RETURNING id INTO v_order_id;
  
  -- Create order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    
    -- Insert order item
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      unit_price,
      total_price
    ) VALUES (
      v_order_id,
      v_product_id,
      v_quantity,
      (v_item->>'unit_price')::NUMERIC,
      (v_item->>'total_price')::NUMERIC
    );
    
    -- Update product stock
    UPDATE products
    SET stock_quantity = stock_quantity - v_quantity
    WHERE id = v_product_id;
  END LOOP;
  
  -- Get the created order with items
  SELECT jsonb_build_object(
    'id', o.id,
    'user_id', o.user_id,
    'status', o.status,
    'subtotal', o.subtotal,
    'shipping_cost', o.shipping_cost,
    'tax', o.tax,
    'total', o.total,
    'created_at', o.created_at,
    'items', (
      SELECT jsonb_agg(jsonb_build_object(
        'id', oi.id,
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'total_price', oi.total_price
      ))
      FROM order_items oi
      WHERE oi.order_id = o.id
    )
  ) INTO v_result
  FROM orders o
  WHERE o.id = v_order_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
