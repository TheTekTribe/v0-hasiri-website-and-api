-- This script creates an admin user if one doesn't exist
-- Note: In production, you should use environment variables for sensitive data

DO $$
DECLARE
  admin_exists BOOLEAN;
  admin_user_id UUID;
BEGIN
  -- Check if admin user exists
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE role = 'admin'
  ) INTO admin_exists;

  IF NOT admin_exists THEN
    -- Create admin user in auth.users
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      recovery_sent_at
    ) VALUES (
      'admin@hasiri.com',
      crypt('Admin123!', gen_salt('bf')), -- Change this password in production!
      NOW(),
      NOW(),
      NOW()
    ) RETURNING id INTO admin_user_id;

    -- Create admin profile
    INSERT INTO profiles (
      id,
      email,
      first_name,
      last_name,
      role,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'admin@hasiri.com',
      'Admin',
      'User',
      'admin',
      NOW(),
      NOW()
    );

    -- Grant all permissions to admin
    INSERT INTO user_permissions (user_id, permission_name)
    SELECT admin_user_id, name FROM permissions;

    RAISE NOTICE 'Admin user created with email: admin@hasiri.com';
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;
