import { supabase, isLocalhost } from './supabase';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<UserSession> {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  console.log(`Signing in with email: ${email}`);
  
  try {
    // First, ensure we don't have any existing session that might interfere
    await supabase.auth.signOut();
    
    // Now sign in with the credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    if (!data.session) {
      console.error('No session data returned from signInWithPassword');
      throw new Error('Failed to create session');
    }

    console.log('Sign in successful, session created:', !!data.session);
    console.log('Session expires at:', new Date((data.session.expires_at || 0) * 1000).toISOString());
    
    // For localhost, we'll log additional info to help debug
    if (isLocalhost) {
      console.log('Localhost environment detected');
      
      // Log info for debugging
      try {
        const cookieString = document.cookie;
        console.log('Current cookies after login:', cookieString);
        
        // Verify the session was properly created
        const verifySession = await supabase.auth.getSession();
        if (verifySession.data.session) {
          console.log('Session verified via getSession()');
          // Try setting the session manually in localStorage as a backup
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              const storageKey = 'supabase.auth.token';
              window.localStorage.setItem(storageKey, JSON.stringify({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at
              }));
              console.log('Session data manually stored in localStorage');
            } catch (storageErr) {
              console.warn('Could not store session in localStorage:', storageErr);
            }
          }
        } else {
          console.warn('Session not found in getSession() immediately after login');
        }
      } catch (e) {
        console.warn('Could not perform extra session verification:', e);
      }
    }
    
    return data as UserSession;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    
    // Force redirect to login page after sign out
    window.location.href = '/admin/login';
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Get the current user
 */
export async function getUser() {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  try {
    const session = await getSession();
    return !!session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// User types
export type UserSession = {
  user: {
    id: string;
    email: string;
  } | null;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
    user: {
      id: string;
      email: string;
    }
  } | null;
};

// Check if user is admin - simplified to just check if authenticated
export async function isAdmin(): Promise<boolean> {
  return isAuthenticated();
} 