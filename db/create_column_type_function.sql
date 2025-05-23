-- Function to get column type
CREATE OR REPLACE FUNCTION get_column_type(table_name text, column_name text)
RETURNS text AS $$
DECLARE
    column_type text;
BEGIN
    SELECT data_type INTO column_type
    FROM information_schema.columns
    WHERE table_name = $1 AND column_name = $2;
    
    RETURN column_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_column_type TO service_role;
GRANT EXECUTE ON FUNCTION get_column_type TO authenticated;
GRANT EXECUTE ON FUNCTION get_column_type TO anon;
