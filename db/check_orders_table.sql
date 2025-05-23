-- Check if orders table exists
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
    ) INTO table_exists;
    
    RAISE NOTICE 'Orders table exists: %', table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Orders table columns:';
        FOR r IN (
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'orders'
            ORDER BY ordinal_position
        ) LOOP
            RAISE NOTICE '%: % (Nullable: %)', r.column_name, r.data_type, r.is_nullable;
        END LOOP;
    END IF;
END $$;

-- Check if order_items table exists
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'order_items'
    ) INTO table_exists;
    
    RAISE NOTICE 'Order_items table exists: %', table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Order_items table columns:';
        FOR r IN (
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'order_items'
            ORDER BY ordinal_position
        ) LOOP
            RAISE NOTICE '%: % (Nullable: %)', r.column_name, r.data_type, r.is_nullable;
        END LOOP;
    END IF;
END $$;

-- Check RLS policies on orders table
DO $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'orders'
    ) INTO policy_exists;
    
    RAISE NOTICE 'Orders table has RLS policies: %', policy_exists;
    
    IF policy_exists THEN
        RAISE NOTICE 'Orders table policies:';
        FOR r IN (
            SELECT policyname, cmd, qual, with_check
            FROM pg_policies
            WHERE tablename = 'orders'
        ) LOOP
            RAISE NOTICE 'Policy: %, Command: %, Using: %, With check: %', 
                r.policyname, r.cmd, r.qual, r.with_check;
        END LOOP;
    END IF;
END $$;
