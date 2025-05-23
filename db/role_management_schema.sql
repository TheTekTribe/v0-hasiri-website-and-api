-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  resource VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

-- Create default roles
INSERT INTO roles (name, description)
VALUES 
  ('Admin', 'Full access to all sections'),
  ('Order Fulfillment', 'Access to order management only')
ON CONFLICT (name) DO NOTHING;

-- Create default permissions for each admin section
INSERT INTO permissions (name, description, resource)
VALUES
  ('view_dashboard', 'View admin dashboard', 'dashboard'),
  ('manage_dashboard', 'Manage dashboard settings', 'dashboard'),
  ('view_products', 'View products', 'products'),
  ('manage_products', 'Manage products', 'products'),
  ('view_categories', 'View categories', 'categories'),
  ('manage_categories', 'Manage categories', 'categories'),
  ('view_orders', 'View orders', 'orders'),
  ('manage_orders', 'Manage orders', 'orders'),
  ('view_users', 'View users', 'users'),
  ('manage_users', 'Manage users', 'users'),
  ('view_content', 'View content', 'content'),
  ('manage_content', 'Manage content', 'content'),
  ('view_analytics', 'View analytics', 'analytics'),
  ('manage_analytics', 'Manage analytics', 'analytics'),
  ('view_appearance', 'View appearance settings', 'appearance'),
  ('manage_appearance', 'Manage appearance settings', 'appearance'),
  ('view_settings', 'View settings', 'settings'),
  ('manage_settings', 'Manage settings', 'settings'),
  ('view_roles', 'View roles', 'roles'),
  ('manage_roles', 'Manage roles', 'roles'),
  ('view_homepage', 'View homepage settings', 'homepage'),
  ('manage_homepage', 'Manage homepage settings', 'homepage')
ON CONFLICT (name) DO NOTHING;

-- Give Admin role all permissions
WITH admin_role AS (
  SELECT id FROM roles WHERE name = 'Admin'
),
all_permissions AS (
  SELECT id FROM permissions
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT admin_role.id, all_permissions.id
FROM admin_role, all_permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Give Order Fulfillment role access to orders only
WITH order_role AS (
  SELECT id FROM roles WHERE name = 'Order Fulfillment'
),
order_permissions AS (
  SELECT id FROM permissions WHERE resource = 'orders'
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT order_role.id, order_permissions.id
FROM order_role, order_permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;
