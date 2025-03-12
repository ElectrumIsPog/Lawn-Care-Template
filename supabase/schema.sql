-- Create tables for the Lawn Care Pro website

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_range VARCHAR(255),
  features TEXT[] DEFAULT '{}',
  image_url VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL DEFAULT 'Lawn Care Pro',
  contact_email VARCHAR(255) NOT NULL DEFAULT 'info@lawncareproexample.com',
  contact_phone VARCHAR(50) NOT NULL DEFAULT '(555) 123-4567',
  address TEXT NOT NULL DEFAULT '123 Green Street, Anytown, USA 12345',
  business_hours TEXT NOT NULL DEFAULT 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM, Sunday: Closed',
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  primary_color VARCHAR(20) NOT NULL DEFAULT '#16a34a',
  secondary_color VARCHAR(20) NOT NULL DEFAULT '#166534',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies with stronger authentication requirements

-- Services table policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to services
CREATE POLICY "Allow public read access to services" ON services
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert, update, delete services
CREATE POLICY "Allow authenticated users to insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to update services" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to delete services" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery images table policies
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery images
CREATE POLICY "Allow public read access to gallery images" ON gallery_images
  FOR SELECT USING (true);
  
-- Allow authenticated users (admins) to insert, update, delete gallery images
CREATE POLICY "Allow authenticated users to insert gallery images" ON gallery_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to update gallery images" ON gallery_images
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to delete gallery images" ON gallery_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Site settings table policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site settings
CREATE POLICY "Allow public read access to site settings" ON site_settings
  FOR SELECT USING (true);
  
-- Allow authenticated users (admins) to update site settings
CREATE POLICY "Allow authenticated users to update site settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Contact submissions table policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to submit contact forms (insert only)
CREATE POLICY "Allow public to submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);
  
-- Allow authenticated users (admins) to view contact submissions
CREATE POLICY "Allow authenticated users to view contact submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');
  
-- Allow authenticated users (admins) to update contact submissions (mark as read)
CREATE POLICY "Allow authenticated users to update contact submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');
  
-- Allow authenticated users (admins) to delete contact submissions
CREATE POLICY "Allow authenticated users to delete contact submissions" ON contact_submissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Sample data for services
INSERT INTO services (name, description, price_range, features, image_url, category)
VALUES 
  ('Lawn Mowing', 'Regular lawn mowing services to keep your grass healthy and looking great year-round.', '$30 - $100', ARRAY['Regular scheduled mowing', 'Precision edging', 'Trimming around obstacles', 'Cleanup of clippings'], '/lawn-mowing.jpg', 'lawn-maintenance'),
  ('Landscaping', 'Professional landscaping design and installation to transform your outdoor living space.', '$500 - $5,000', ARRAY['Custom landscape design', 'Plant selection and installation', 'Mulching and decorative stone', 'Hardscape features'], '/landscaping.jpg', 'landscaping'),
  ('Fertilization & Weed Control', 'Lawn fertilization and weed control treatments for a lush, green, and healthy lawn.', '$50 - $200', ARRAY['Customized fertilization programs', 'Pre-emergent and post-emergent weed control', 'Soil testing', 'Environmentally friendly options'], '/fertilization.jpg', 'fertilization'),
  ('Lawn Aeration', 'Core aeration to reduce soil compaction and improve water and nutrient absorption.', '$100 - $300', ARRAY['Core aeration', 'Improved water absorption', 'Enhanced root development', 'Reduced thatch buildup'], '/aeration.jpg', 'lawn-maintenance'),
  ('Seasonal Cleanup', 'Comprehensive cleanup services to prepare your lawn and landscape for the changing seasons.', '$150 - $500', ARRAY['Spring cleanup', 'Fall leaf removal', 'Pruning and trimming', 'Gutter cleaning'], '/seasonal-cleanup.jpg', 'cleanup');

-- Sample data for gallery images
INSERT INTO gallery_images (title, description, image_url, category)
VALUES 
  ('Residential Lawn Maintenance', 'Weekly lawn maintenance for a residential property in Anytown.', '/gallery/lawn-1.jpg', 'lawn-maintenance'),
  ('Front Yard Transformation', 'Complete front yard landscaping redesign with new plants and mulch.', '/gallery/landscaping-1.jpg', 'landscaping'),
  ('Commercial Property Maintenance', 'Regular maintenance for a commercial office building.', '/gallery/lawn-2.jpg', 'lawn-maintenance'),
  ('Backyard Garden Oasis', 'Custom garden design with flowering plants and stone pathways.', '/gallery/landscaping-2.jpg', 'landscaping'),
  ('Lawn Fertilization Program', 'Before and after results of our seasonal fertilization program.', '/gallery/fertilization-1.jpg', 'fertilization');

-- Initialize site settings
INSERT INTO site_settings (site_name, contact_email, contact_phone, address, business_hours, maintenance_mode, primary_color, secondary_color)
VALUES ('Lawn Care Pro', 'info@lawncareproexample.com', '(555) 123-4567', '123 Green Street, Anytown, USA 12345', 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM, Sunday: Closed', FALSE, '#16a34a', '#166534'); 