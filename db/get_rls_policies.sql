-- Create a function to get RLS policies for debugging
CREATE OR REPLACE FUNCTION public.get_rls_policies()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Get RLS policies for orders table
  SELECT json_agg(row_to_json(policies))::JSONB INTO result
  FROM (
    SELECT 
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE tablename = 'orders'
  ) policies;
  
  RETURN result;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.get_rls_policies TO service_role;
