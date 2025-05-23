-- Update RLS policies for orders table to ensure proper update permissions

-- First, check if the policy exists and drop it if it does
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'orders' 
        AND policyname = 'Only admins can update orders'
    ) THEN
        DROP POLICY "Only admins can update orders" ON orders;
    END IF;
END
$$;

-- Create a more permissive policy for order updates
CREATE POLICY "Only admins can update orders" ON orders
  FOR UPDATE USING (
    -- Allow updates if user is admin
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
