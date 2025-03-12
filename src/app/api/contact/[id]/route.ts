import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkApiAuth } from '@/lib/apiAuth';

// GET /api/contact/[id] - Get a specific contact submission (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication for admin access
    const authResponse = await checkApiAuth(request);
    if (authResponse) {
      return authResponse;
    }
    
    const id = params.id;
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the contact submission' },
      { status: 500 }
    );
  }
}

// PUT /api/contact/[id] - Update a contact submission (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication for admin access
    const authResponse = await checkApiAuth(request);
    if (authResponse) {
      return authResponse;
    }
    
    const id = params.id;
    const body = await request.json();
    
    // Update contact submission
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({
        read: body.read === true,
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the contact submission' },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/[id] - Delete a contact submission (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication for admin access
    const authResponse = await checkApiAuth(request);
    if (authResponse) {
      return authResponse;
    }
    
    const id = params.id;
    
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the contact submission' },
      { status: 500 }
    );
  }
} 