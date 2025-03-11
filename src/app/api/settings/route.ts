import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SiteSettings } from '@/lib/supabase';

// GET /api/settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no settings exist yet, return default settings
    if (!data) {
      return NextResponse.json({
        site_name: 'Lawn Care Pro',
        contact_email: 'info@lawncareproexample.com',
        contact_phone: '(555) 123-4567',
        address: '123 Green Street, Anytown, USA 12345',
        business_hours: 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM, Sunday: Closed',
        maintenance_mode: false,
        primary_color: '#16a34a', // green-600
        secondary_color: '#166534', // green-800
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching site settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if settings already exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from('site_settings')
      .select('id')
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    
    let result;
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          site_name: body.site_name,
          contact_email: body.contact_email,
          contact_phone: body.contact_phone,
          address: body.address,
          business_hours: body.business_hours,
          maintenance_mode: body.maintenance_mode,
          primary_color: body.primary_color,
          secondary_color: body.secondary_color,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSettings.id)
        .select();
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      result = data[0];
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('site_settings')
        .insert([
          {
            site_name: body.site_name || 'Lawn Care Pro',
            contact_email: body.contact_email || 'info@lawncareproexample.com',
            contact_phone: body.contact_phone || '(555) 123-4567',
            address: body.address || '123 Green Street, Anytown, USA 12345',
            business_hours: body.business_hours || 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM, Sunday: Closed',
            maintenance_mode: body.maintenance_mode || false,
            primary_color: body.primary_color || '#16a34a',
            secondary_color: body.secondary_color || '#166534',
          },
        ])
        .select();
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      result = data[0];
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating site settings' },
      { status: 500 }
    );
  }
} 