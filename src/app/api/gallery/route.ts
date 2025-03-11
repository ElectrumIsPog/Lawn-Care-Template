import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// GalleryImage type is used indirectly through the response
// import { GalleryImage } from '@/lib/supabase';

// GET /api/gallery - Get all gallery images
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching gallery images' },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Upload a new gallery image (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.title || !body.image_url || !body.category) {
      return NextResponse.json(
        { error: 'Title, image URL, and category are required' },
        { status: 400 }
      );
    }

    // Insert new gallery image
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([
        {
          title: body.title,
          description: body.description || '',
          image_url: body.image_url,
          category: body.category,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the gallery image' },
      { status: 500 }
    );
  }
} 