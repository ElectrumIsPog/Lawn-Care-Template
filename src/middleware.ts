import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the protected routes that require authentication
const PROTECTED_ROUTES = [
  '/admin/services', 
  '/admin/gallery', 
  '/admin/contact', 
  '/admin/settings',
  '/admin/dashboard'
];

// Skip auth check on these routes
const PUBLIC_ROUTES = [
  '/',
  '/admin/login'
];

// Maximum redirects to prevent loops
const MAX_REDIRECTS = 3;

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Get redirect count to prevent loops
  const url = new URL(request.url);
  const redirectCount = parseInt(url.searchParams.get('redirectCount') || '0');
  
  // If we're in a redirect loop, break it with a debug page
  if (redirectCount >= MAX_REDIRECTS) {
    console.log('⚠️ Breaking redirect loop after', redirectCount, 'redirects');
    return createDebugResponse(request, redirectCount);
  }
  
  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some(route => pathname === route)) {
    return NextResponse.next();
  }
  
  // Only apply middleware to admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Check if this is a protected route that requires auth
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Log debugging info
  console.log('🔒 Checking auth for protected route:', pathname);
  
  // Get Supabase environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return redirectToLogin(request, redirectCount);
  }
  
  try {
    // Extract the session cookie from the request
    const supabaseAuthCookie = request.cookies.get('sb-auth-token')?.value || 
                               request.cookies.get('supabase-auth-token')?.value || 
                               getCookieByPrefix(request, 'sb-');
                               
    if (!supabaseAuthCookie) {
      console.log('⚠️ No Supabase auth cookie found, redirecting to login');
      return redirectToLogin(request, redirectCount);
    }
    
    // Create a Supabase client with the auth cookie
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Cookie: `sb-auth-token=${supabaseAuthCookie}`
        }
      }
    });
    
    // Check if the session is valid
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.log('❌ Invalid session, redirecting to login');
      return redirectToLogin(request, redirectCount);
    }
    
    console.log('✅ Valid session found for user:', data.session.user.email);
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return redirectToLogin(request, redirectCount);
  }
}

/**
 * Helper function to find a cookie by prefix
 */
function getCookieByPrefix(request: NextRequest, prefix: string): string | undefined {
  const cookies = Array.from(request.cookies.getAll());
  const matchingCookie = cookies.find(cookie => cookie.name.startsWith(prefix));
  return matchingCookie?.value;
}

/**
 * Redirect to login page
 */
function redirectToLogin(request: NextRequest, currentRedirectCount: number) {
  const redirectUrl = new URL('/admin/login', request.url);
  
  // Add the original URL as a query parameter
  redirectUrl.searchParams.set('from', request.nextUrl.pathname);
  
  // Add redirect counter to prevent infinite loops
  redirectUrl.searchParams.set('redirectCount', (currentRedirectCount + 1).toString());
  
  console.log(`🔄 Redirecting to login (count: ${currentRedirectCount + 1})`);
  
  return NextResponse.redirect(redirectUrl);
}

/**
 * Create debug response for breaking redirect loops
 */
function createDebugResponse(request: NextRequest, redirectCount: number) {
  const debugHtml = `
    <html>
      <head>
        <title>Auth Debug Page</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          h1 { color: #d00; }
          .card { padding: 15px; border: 1px solid #e2e8f0; margin-bottom: 15px; border-radius: 5px; }
          .steps { background-color: #f7fafc; }
          code { background: #f1f1f1; padding: 2px 5px; border-radius: 3px; font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>Authentication Debug Page</h1>
        <div class="card">
          <p>Stopped redirect loop after ${redirectCount} redirects.</p>
          <p>This page is displayed to prevent an infinite redirect loop. It means that your authentication system is having trouble validating your session.</p>
        </div>
        
        <div class="card">
          <h2>Environment Variables</h2>
          <p>NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          
          <h2>Request Details</h2>
          <p>URL: ${request.url}</p>
          <p>Path: ${request.nextUrl.pathname}</p>
          <p>Cookies: ${request.cookies.getAll().map(c => c.name).join(', ') || 'None found'}</p>
        </div>
        
        <div class="card steps">
          <h2>Troubleshooting Steps</h2>
          <ol>
            <li>Ensure your <code>.env.local</code> file has correct Supabase settings:<br>
              <pre>
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
              </pre>
            </li>
            <li>Restart your Next.js development server</li>
            <li>Clear your browser cookies</li>
            <li>Try using a different browser</li>
            <li>Check browser console for any errors</li>
          </ol>
        </div>
        
        <div class="card">
          <h2>Actions</h2>
          <p><a href="/admin/login?redirectCount=0">Go to Login Page (reset counter)</a></p>
          <p><a href="/">Go to Home Page</a></p>
        </div>
      </body>
    </html>
  `;
  
  return new NextResponse(debugHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// Configure the middleware to match all admin routes
export const config = {
  matcher: ['/admin/:path*'],
}; 