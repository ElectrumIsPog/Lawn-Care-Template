import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the protected routes that require authentication
const PROTECTED_ROUTES = [
  '/admin/services', 
  '/admin/gallery', 
  '/admin/contact', 
  '/admin/settings'
];

// Semi-protected routes - we're more lenient on these routes (especially for localhost)
const SEMI_PROTECTED_ROUTES = [
  '/admin/dashboard'
];

// Skip auth check on these routes
const PUBLIC_ROUTES = [
  '/',
  '/admin/login',
  '/auth/verify',
  // Additional resources that should be publicly accessible
  '/favicon.ico',
  '/_next',
  '/images',
  '/api/auth' // Allow public access to auth-related API routes
];

// Maximum redirects to prevent loops
const MAX_REDIRECTS = 3;

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Log the request for debugging
  console.log('📝 Middleware processing:', pathname, request.method);
  
  // Skip middleware for static resources
  if (pathname.includes('/_next/') || pathname.includes('/images/') || pathname.endsWith('.ico')) {
    return NextResponse.next();
  }

  // Get redirect count to prevent loops
  const url = new URL(request.url);
  const redirectCount = parseInt(url.searchParams.get('redirectCount') || '0');
  
  // If we're in a redirect loop, break it with a debug page
  if (redirectCount >= MAX_REDIRECTS) {
    console.log('⚠️ Breaking redirect loop after', redirectCount, 'redirects');
    return createDebugResponse(request, redirectCount);
  }
  
  // Skip middleware for public routes - using more permissive matching
  if (PUBLIC_ROUTES.some(route => {
    if (route.endsWith('/')) {
      return pathname === route || pathname.startsWith(route);
    }
    return pathname === route || pathname.startsWith(route + '/');
  })) {
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

  const isSemiProtectedRoute = SEMI_PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (!isProtectedRoute && !isSemiProtectedRoute) {
    return NextResponse.next();
  }
  
  // Log debugging info
  console.log('🔒 Checking auth for route:', pathname, 
    isProtectedRoute ? '(strictly protected)' : '(semi-protected)');
  
  // Get Supabase environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return redirectToLogin(request, redirectCount);
  }
  
  // Check for localhost and whether we should be more lenient
  const isLocalhost = 
    request.headers.get('host')?.includes('localhost') || 
    request.headers.get('host')?.includes('127.0.0.1');
  
  try {
    // Look for various forms of Supabase auth cookies that might be present
    const cookieNames = [
      'sb-auth-token',
      'supabase-auth-token',
      'sb:token',
      'sb-access-token',
      'sb-refresh-token'
    ];
    
    let foundAuthCookie = false;
    let authCookieValue = '';
    
    // Look for any cookie that might be an auth cookie
    for (const name of cookieNames) {
      const cookie = request.cookies.get(name);
      if (cookie?.value) {
        foundAuthCookie = true;
        authCookieValue = cookie.value;
        console.log(`📝 Found auth cookie: ${name}`);
        break;
      }
    }
    
    // If no direct cookie, try checking for cookie with prefix
    if (!foundAuthCookie) {
      const maybeAuthCookie = getCookieByPrefix(request, 'sb-');
      if (maybeAuthCookie) {
        foundAuthCookie = true;
        authCookieValue = maybeAuthCookie;
        console.log('📝 Found auth cookie with prefix sb-');
      }
    }
    
    // Also check for Authorization header (might be used in API requests)
    const authHeader = request.headers.get('authorization');
    const hasAuthHeader = authHeader && authHeader.startsWith('Bearer ');
    
    if (!foundAuthCookie && !hasAuthHeader) {
      console.log('⚠️ No Supabase auth cookie or header found');
      
      // For semi-protected routes on localhost, we'll be more lenient
      if (isLocalhost && isSemiProtectedRoute) {
        console.log('🔓 Allowing localhost access to semi-protected route without auth');
        return NextResponse.next();
      }
      
      return redirectToLogin(request, redirectCount);
    }
    
    // Try to create a Supabase client with the auth cookie
    let supabaseClientOptions: any = {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    };
    
    // If we found an auth cookie, add it to the request
    if (foundAuthCookie) {
      supabaseClientOptions.global = {
        headers: {
          Cookie: `sb-auth-token=${authCookieValue}`
        }
      };
    } else if (hasAuthHeader) {
      // If we have an auth header, use it
      supabaseClientOptions.global = {
        headers: {
          Authorization: authHeader
        }
      };
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseClientOptions);
    
    // Check if the session is valid
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Session error:', error.message);
      
      // For semi-protected routes on localhost, allow even with errors
      if (isLocalhost && isSemiProtectedRoute) {
        console.log('🔓 Allowing localhost access to semi-protected route despite error');
        return NextResponse.next();
      }
      
      return redirectToLogin(request, redirectCount);
    }
    
    if (!data.session) {
      console.log('❌ No valid session found');
      
      // For semi-protected routes on localhost, we'll be more lenient
      if (isLocalhost && isSemiProtectedRoute) {
        console.log('🔓 Allowing localhost access to semi-protected route without session');
        return NextResponse.next();
      }
      
      return redirectToLogin(request, redirectCount);
    }
    
    console.log('✅ Valid session found for user:', data.session.user.email);
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    
    // For semi-protected routes on localhost, allow even with errors
    if (isLocalhost && isSemiProtectedRoute) {
      console.log('🔓 Allowing localhost access to semi-protected route despite error');
      return NextResponse.next();
    }
    
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
  // Create an absolute URL for more reliable redirects across environments
  const baseUrl = new URL(request.url).origin;
  const loginPath = '/admin/login';
  const redirectUrl = new URL(loginPath, baseUrl);
  
  // Add the original URL as a query parameter (encode to handle special characters)
  const originalPath = request.nextUrl.pathname + request.nextUrl.search;
  redirectUrl.searchParams.set('from', encodeURIComponent(originalPath));
  
  // Add redirect counter to prevent infinite loops
  redirectUrl.searchParams.set('redirectCount', (currentRedirectCount + 1).toString());
  
  console.log(`🔄 Redirecting to login (count: ${currentRedirectCount + 1}, from: ${originalPath})`);
  
  // Use a 302 (temporary) redirect for authentication redirects
  return NextResponse.redirect(redirectUrl, { status: 302 });
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
          <p>Host: ${request.headers.get('host') || 'Unknown'}</p>
          <p>Auth Header: ${request.headers.get('authorization') ? '✅ Present' : '❌ Missing'}</p>
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
            <li>Try clearing your browser cookies or using a private/incognito window</li>
            <li>Restart your Next.js development server</li>
            <li>Check your Supabase configuration in the Supabase dashboard</li>
            <li>Make sure your Supabase URL is added to the allowed URLs in Supabase Auth settings</li>
            <li>Check browser console and network tab for errors</li>
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