import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ContactSubmission } from '@/lib/supabase';

// GET /api/contact - Get all contact form submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin access
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching contact submissions' },
      { status: 500 }
    );
  }
}

// POST /api/contact - Submit a new contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Insert new contact submission
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          service: body.service || '',
          message: body.message,
          read: false,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send email notification to admin

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting the contact form' },
      { status: 500 }
    );
  }
}

// PUT /api/contact/:id - Mark a contact submission as read (admin only)
export async function PUT(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin access
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', body.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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