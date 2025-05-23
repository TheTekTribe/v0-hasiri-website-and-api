-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User permissions table (many-to-many)
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, permission_name)
);

-- Login history for audit
CREATE TABLE IF NOT EXISTS login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  event_type TEXT DEFAULT 'login',
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default permissions
INSERT INTO permissions (name, description, resource) VALUES
('view_products', 'View product listings', 'products'),
('manage_products', 'Create, update, and delete products', 'products'),
('view_orders', 'View all orders', 'orders'),
('manage_orders', 'Update order status and details', 'orders'),
('view_own_orders', 'View own orders', 'orders'),
('place_orders', 'Place new orders', 'orders'),
('view_users', 'View user accounts', 'users'),
('manage_users', 'Create, update, and delete users', 'users'),
('view_analytics', 'View analytics data', 'analytics'),
('manage_content', 'Manage website content', 'content'),
('manage_settings', 'Manage system settings', 'settings'),
('manage_roles', 'Manage roles and permissions', 'roles')
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User permissions policies
CREATE POLICY "Users can view their own permissions"
  ON user_permissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all permissions"
  ON user_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Login history policies
CREATE POLICY "Users can view their own login history"
  ON login_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all login history"
  ON login_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Admins have all permissions
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Check specific permission
  RETURN EXISTS (
    SELECT 1 FROM user_permissions
    WHERE user_id = $1 AND permission_name = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
