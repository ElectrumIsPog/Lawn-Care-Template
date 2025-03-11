import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Environment logging for debugging
export const logSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Supabase Config - Environment:', process.env.NODE_ENV);
  console.log('Supabase Config - URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not set');
  console.log('Supabase Config - Key:', supabaseAnonKey ? 'Key is set' : 'Key is not set');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Check your .env.local file.');
    return false;
  }
  
  return true;
}

// Create a Supabase client
export const createClient = () => {
  logSupabaseConfig();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createSupabaseClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    }
  );
}

// Export a singleton instance for direct use
export const supabase = createClient();

// Determine if we're running on localhost
export const isLocalhost = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

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