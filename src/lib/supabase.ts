import { createClient } from '@supabase/supabase-js';

// Check if we're in a localhost environment
export const isLocalhost = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client with reduced logging in production
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    debug: isLocalhost && process.env.NODE_ENV !== 'production',
  }
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Types for Supabase tables
export type Service = {
  id: number;
  name: string;
  description: string;
  price_range: string;
  features: string[];
  image_url: string;
  category: string;
  created_at: string;
};

export type GalleryImage = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  business_hours: string;
  maintenance_mode: boolean;
  primary_color: string;
  secondary_color: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
  read: boolean;
}; 