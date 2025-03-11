"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { supabase, isLocalhost } from '@/lib/supabase';

// Enhanced debug component to display cookie info and Supabase configuration
function DebugInfo() {
  const [cookieInfo, setCookieInfo] = useState('');
  const [sessionInfo, setSessionInfo] = useState('');
  const [configInfo] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not found',
    keyStatus: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Key is set' : 'Key is missing',
  });
  const [testConnStatus, setTestConnStatus] = useState('Not tested');

  // Test Supabase connection
  const testConnection = async () => {
    setTestConnStatus('Testing...');
    try {
      // Check if we can connect to Supabase Auth API
      const { error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setTestConnStatus(`Auth Error: ${authError.message}`);
        return;
      }
      
      // Try to access the auth API info
      try {
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          setTestConnStatus(`User API Error: ${userError.message}, but connection is working`);
          return;
        }
        
        setTestConnStatus('Connection successful! ✅');
      } catch (e) {
        setTestConnStatus(`Auth API test error, but basic connection is working: ${e instanceof Error ? e.message : String(e)}`);
      }
    } catch (e) {
      setTestConnStatus(`Exception: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  useEffect(() => {
    // Check for cookies
    const cookies = document.cookie;
    setCookieInfo(cookies || 'No cookies found');

    // Check for session
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setSessionInfo(
        data.session 
          ? `Active session for ${data.session.user?.email}` 
          : 'No session found'
      );
    }
    checkSession();
  }, []);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
      <h3 className="text-gray-700 font-bold mb-2">Debug Info</h3>
      
      <div className="mb-3">
        <p className="font-semibold mb-1">Environment:</p>
        <p className="ml-2">• {isLocalhost ? 'Localhost' : 'Remote server'}</p>
        <p className="ml-2">• Next.js environment: {process.env.NODE_ENV}</p>
      </div>
      
      <div className="mb-3">
        <p className="font-semibold mb-1">Supabase Configuration:</p>
        <p className="ml-2">• URL: {configInfo.url.substring(0, 20)}...</p>
        <p className="ml-2">• API Key: {configInfo.keyStatus}</p>
        <div className="mt-1">
          <button 
            onClick={testConnection}
            className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
          >
            Test Connection
          </button>
          <span className="ml-2">Status: {testConnStatus}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="font-semibold mb-1">Session Info:</p>
        <p className="ml-2">• {sessionInfo}</p>
      </div>
      
      <div className="mb-3">
        <p className="font-semibold mb-1">Cookie Info:</p>
        <p className="ml-2 break-all text-[8px]">{cookieInfo}</p>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <p>If Supabase connection fails, check your .env.local file and restart the server.</p>
      </div>
    </div>
  );
}

// Wrap the part of the component that uses useSearchParams in a separate client component
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  
  const _router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';
  const redirectCount = searchParams.get('redirectCount') || '0';

  // Automatically show debug info if we're in a redirect loop
  useEffect(() => {
    if (parseInt(redirectCount) > 0) {
      setShowDebug(true);
      setError(`Redirect loop detected (${redirectCount} redirects). Please check Supabase configuration.`);
    }
  }, [redirectCount]);

  // Check if already authenticated
  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log('User already has a session, redirecting to:', from);
        window.location.href = from;
      }
    }
    checkAuth();
  }, [from]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', email);
      const data = await signIn(email, password);
      
      if (data.session) {
        console.log('Login successful, session created');
        
        // Force a slight delay to ensure cookie is set before redirect
        setTimeout(() => {
          console.log('Redirecting to:', from);
          window.location.href = from;
        }, 500);
      } else {
        setError('Failed to create session');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Invalid email or password');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-600 p-6">
        <h1 className="text-xl font-semibold text-white text-center">
          Admin Login {isLocalhost && '(Localhost)'}
        </h1>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLocalhost && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
            <p className="mb-1"><strong>Localhost Environment</strong></p>
            <p className="mb-1">Make sure your .env.local file has correct Supabase settings:</p>
            <p className="text-xs">NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set correctly</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
        
        {showDebug && <DebugInfo />}
      </div>
    </div>
  );
}

// Main login page component that uses Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-6 text-center">
          Loading...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
} 