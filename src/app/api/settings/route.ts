import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkApiAuth } from '@/lib/apiAuth';
// SiteSettings type is used indirectly through the response
// import { SiteSettings } from '@/lib/supabase';

// GET /api/settings - Get site settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
    // Check authentication
    const authResponse = await checkApiAuth(request);
    if (authResponse) {
      return authResponse;
    }
    
    const body = await request.json();
    
    // Validate request body
    if (!body.site_name) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      );
    }

    // Update site settings
    const { data, error } = await supabase
      .from('site_settings')
      .update({
        site_name: body.site_name,
        contact_email: body.contact_email || '',
        contact_phone: body.contact_phone || '',
        address: body.address || '',
        business_hours: body.business_hours || '',
        maintenance_mode: body.maintenance_mode === true,
        primary_color: body.primary_color || '#16a34a', // Default green-600
        secondary_color: body.secondary_color || '#1e40af', // Default blue-800
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1) // Assuming there's only one settings record with ID 1
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating site settings' },
      { status: 500 }
    );
  }
} 