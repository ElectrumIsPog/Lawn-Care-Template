import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkApiAuth } from '@/lib/apiAuth';

// Define the params type for gallery item ID
interface GalleryIdParams {
  id: string;
}

// GET /api/gallery/[id] - Get a specific gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<GalleryIdParams> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the gallery image' },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id] - Update a specific gallery image (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<GalleryIdParams> }
) {
  try {
    // Check authentication
    const authResponse = await checkApiAuth(request);
    if (authResponse) {
      return authResponse;
    }
    
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    // Validate request body
    if (!body.title || !body.image_url || !body.category) {
      return NextResponse.json(
        { error: 'Title, image URL, and category are required' },
        { status: 400 }
      );
    }

    // Update gallery image
    const { data, error } = await supabase
      .from('gallery_images')
      .update({
        title: body.title,
        description: body.description || '',
        image_url: body.image_url,
        category: body.category,
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the gallery image' },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - Delete a specific gallery image (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<GalleryIdParams> }
) {
  try {
    // Check authentication
    const authResponse = await checkApiAuth(request);
    if (authResponse) {
      return authResponse;
    }
    
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the gallery image' },
      { status: 500 }
    );
  }
} 