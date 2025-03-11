# Supabase Setup for Lawn Care Pro

This directory contains the database schema and setup instructions for the Supabase backend.

## Setup Instructions

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `schema.sql` and run it in the SQL Editor
4. Set up authentication (see below)
5. Copy your Supabase URL and anon key from the API settings
6. Create a `.env.local` file in the root of your project with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Authentication Setup

For the admin panel, we'll use email/password authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Make sure Email Auth is enabled
3. Disable "Enable email confirmations" for development (optional)
4. Create an admin user:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter the admin email and password

## Row Level Security (RLS) Policies

The schema includes basic RLS policies:

- Public read access to services, gallery images, and site settings
- Public write access to contact submissions
- Admin access will be handled through authentication

You may need to adjust these policies based on your specific requirements.

## Database Tables

The schema creates the following tables:

1. `services` - Stores information about lawn care services
2. `gallery_images` - Stores gallery images and their metadata
3. `site_settings` - Stores site-wide settings
4. `contact_submissions` - Stores contact form submissions

## Sample Data

The schema includes sample data for services, gallery images, and site settings to get you started. 