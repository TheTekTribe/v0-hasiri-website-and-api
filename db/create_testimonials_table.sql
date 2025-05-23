-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  video_id TEXT,
  profile_image TEXT,
  page TEXT NOT NULL CHECK (page IN ('login', 'signup', 'both')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to reorder testimonials
CREATE OR REPLACE FUNCTION reorder_testimonials(testimonials JSON[])
RETURNS VOID AS $$
DECLARE
  testimonial JSON;
BEGIN
  FOR testimonial IN SELECT * FROM unnest(testimonials)
  LOOP
    UPDATE testimonials
    SET display_order = (testimonial->>'display_order')::INTEGER
    WHERE id = (testimonial->>'id')::UUID;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert initial testimonials if table is empty
INSERT INTO testimonials (image_url, quote, author, video_id, profile_image, page, display_order, is_active)
SELECT
  '/tech-harvest.png',
  'Join thousands of farmers who have improved their yields and sustainability with Hasiri''s innovative agricultural solutions.',
  'Priya Sharma, Agricultural Consultant',
  'dQw4w9WgXcQ',
  '/farmer-profile-1.png',
  'signup',
  0,
  true
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

INSERT INTO testimonials (image_url, quote, author, video_id, profile_image, page, display_order, is_active)
SELECT
  '/rolling-green-fields.png',
  'Since implementing Hasiri''s soil health program, my wheat yields have increased by 30% while using less water and chemical inputs.',
  'Rajesh Kumar, Punjab Farmer',
  'jNQXAC9IVRw',
  '/farmer-profile-2.png',
  'signup',
  1,
  true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE display_order = 1);

INSERT INTO testimonials (image_url, quote, author, video_id, profile_image, page, display_order, is_active)
SELECT
  '/collaborative-harvest.png',
  'The Hasiri community has been invaluable. I''ve learned sustainable practices from other farmers that have transformed my farm''s productivity.',
  'Amina Patel, Organic Farmer',
  'jNQXAC9IVRw',
  '/farmer-profile-3.png',
  'signup',
  2,
  true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE display_order = 2);

INSERT INTO testimonials (image_url, quote, author, video_id, profile_image, page, display_order, is_active)
SELECT
  '/rolling-green-fields.png',
  'Being part of the Hasiri community has connected me with like-minded farmers who share sustainable practices and support each other''s growth.',
  'Amina Osei, Community Leader',
  'dQw4w9WgXcQ',
  '/farmer-profile-1.png',
  'login',
  3,
  true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE display_order = 3);

INSERT INTO testimonials (image_url, quote, author, video_id, profile_image, page, display_order, is_active)
SELECT
  '/collaborative-harvest.png',
  'Our farming cooperative has thrived since joining Hasiri. The community workshops and knowledge sharing have been invaluable for all our members.',
  'Miguel Rodriguez, Cooperative President',
  'jNQXAC9IVRw',
  '/farmer-profile-2.png',
  'login',
  4,
  true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE display_order = 4);
