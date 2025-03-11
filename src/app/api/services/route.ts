import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// Service type is used indirectly through the response
// import { Service } from '@/lib/supabase';

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in services API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/services - Create a new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.name || !body.description || !body.category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    // Insert new service
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          name: body.name,
          description: body.description,
          price_range: body.price_range || '',
          features: body.features || [],
          image_url: body.image_url || '',
          category: body.category,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the service' },
      { status: 500 }
    );
  }
} 