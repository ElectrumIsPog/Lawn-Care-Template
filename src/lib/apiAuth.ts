import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Middleware to check if the user is authenticated for API routes
 * @param request The Next.js request object
 * @returns A response object if unauthorized, null if authenticated
 */
export async function checkApiAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    // DEVELOPMENT MODE - Skip auth check for localhost if environment variable is set
    const isDevMode = process.env.NEXT_PUBLIC_SKIP_AUTH_FOR_LOCALHOST === 'true';
    const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                        request.headers.get('host')?.includes('127.0.0.1');
    
    if (isDevMode && isLocalhost) {
      console.log('Skipping auth check for localhost in development mode');
      return null; // Allow the request through for localhost in dev mode
    }
    
    // Always allow development mode OPTIONS requests for CORS
    if (request.method === 'OPTIONS' && isLocalhost) {
      return null;
    }
    
    // Get URL to check if it's a path we want to be more lenient with
    const url = new URL(request.url);
    const isReadOnlyEndpoint = 
      (request.method === 'GET') && 
      (url.pathname.includes('/api/services') || url.pathname.includes('/api/gallery'));
    
    // Be more lenient with read-only endpoints in development
    if (isLocalhost && isReadOnlyEndpoint) {
      console.log('Allowing read-only API access in dev mode without strict auth checks');
      return null;
    }
    
    // Get Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }
    
    // Look for authorization in cookies
    const cookieNames = [
      'sb-auth-token',
      'supabase-auth-token',
      'sb:token',
      'sb-access-token',
      'sb-refresh-token'
    ];
    
    let authCookieValue = '';
    
    // Look for any cookie that might be an auth cookie
    for (const name of cookieNames) {
      const cookie = request.cookies.get(name);
      if (cookie?.value) {
        authCookieValue = cookie.value;
        break;
      }
    }
    
    // If no direct cookie, try checking for cookie with prefix
    if (!authCookieValue) {
      const cookies = Array.from(request.cookies.getAll());
      const matchingCookie = cookies.find(cookie => cookie.name.startsWith('sb-'));
      if (matchingCookie) {
        authCookieValue = matchingCookie.value;
      }
    }
    
    // Also check for Authorization header
    const authHeader = request.headers.get('authorization');
    const hasAuthHeader = authHeader && authHeader.startsWith('Bearer ');
    
    // Note: Since this is server-side code, we can't check localStorage directly
    // But the Supabase client should attempt to use any session that is available

    const noExplicitAuthFound = !authCookieValue && !hasAuthHeader;
    
    // Configure Supabase client based on available auth
    let supabaseClientOptions: any = {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    };
    
    // If we found an auth cookie, add it to the request
    if (authCookieValue) {
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
      console.log('Session error in API auth check:', error.message);
      return NextResponse.json(
        { error: 'Authentication error' }, 
        { status: 401 }
      );
    }
    
    if (!data.session) {
      // Only log auth failure if we didn't find explicit auth tokens
      if (noExplicitAuthFound) {
        console.log('No valid session found in API auth check');
      } else {
        console.log('Auth credentials present but no valid session found');
      }
      
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Authentication successful
    return null;
  } catch (error) {
    console.error('Error in API auth check:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 