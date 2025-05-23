-- Create address types enum
CREATE TYPE address_type AS ENUM ('farm', 'home', 'business', 'delivery', 'billing', 'other');

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Main Farm", "Home", "North Field"
  address_type address_type NOT NULL DEFAULT 'farm',
  is_default BOOLEAN DEFAULT false,
  is_billing_default BOOLEAN DEFAULT false,
  is_shipping_default BOOLEAN DEFAULT false,
  recipient_name TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  phone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  farm_size_acres DECIMAL(10, 2),
  soil_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_type ON addresses(address_type);

-- Create RLS policies for addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own addresses
CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can manage all addresses
CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update all addresses"
  ON addresses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can delete all addresses"
  ON addresses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Function to ensure only one default address per type per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting as default
  IF NEW.is_default = true THEN
    -- Clear default flag from other addresses for this user
    UPDATE addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id;
  END IF;
  
  -- If setting as billing default
  IF NEW.is_billing_default = true THEN
    -- Clear billing default flag from other addresses for this user
    UPDATE addresses
    SET is_billing_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id;
  END IF;
  
  -- If setting as shipping default
  IF NEW.is_shipping_default = true THEN
    -- Clear shipping default flag from other addresses for this user
    UPDATE addresses
    SET is_shipping_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default address management
CREATE TRIGGER ensure_single_default_address_trigger
BEFORE INSERT OR UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_address();

-- Create function to get default address for a user
CREATE OR REPLACE FUNCTION get_default_address(p_user_id UUID, p_type TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
  v_address_id UUID;
BEGIN
  IF p_type = 'billing' THEN
    SELECT id INTO v_address_id FROM addresses
    WHERE user_id = p_user_id AND is_billing_default = true
    LIMIT 1;
  ELSIF p_type = 'shipping' THEN
    SELECT id INTO v_address_id FROM addresses
    WHERE user_id = p_user_id AND is_shipping_default = true
    LIMIT 1;
  ELSE
    SELECT id INTO v_address_id FROM addresses
    WHERE user_id = p_user_id AND is_default = true
    LIMIT 1;
  END IF;
  
  -- If no default found, return the first address
  IF v_address_id IS NULL THEN
    SELECT id INTO v_address_id FROM addresses
    WHERE user_id = p_user_id
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;
  
  RETURN v_address_id;
END;
$$ LANGUAGE plpgsql;
