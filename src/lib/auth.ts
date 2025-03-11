import { supabase, isLocalhost } from './supabase';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  console.log(`Signing in with email: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful, session created:', !!data.session);
    
    // For localhost, we'll log additional info to help debug
    if (isLocalhost) {
      console.log('Localhost environment detected');
      
      // Log info for debugging
      try {
        const cookieString = document.cookie;
        console.log('Current cookies after login:', cookieString);
      } catch (e) {
        console.warn('Could not read cookies:', e);
      }
    }
    
    return data;
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
  session: any | null;
};

// Check if user is admin - simplified to just check if authenticated
export async function isAdmin(): Promise<boolean> {
  return isAuthenticated();
} 