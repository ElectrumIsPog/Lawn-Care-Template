"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SessionVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get('to') || '/admin/dashboard';
  
  const [status, setStatus] = useState('Verifying session...');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [debugMode, setDebugMode] = useState(false);
  
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Attempt to get the session
        const { data, error } = await supabase.auth.getSession();
        
        setAttempts(prev => prev + 1);
        
        if (error) {
          console.error('Error verifying session:', error);
          setError(error.message);
          return;
        }
        
        if (data.session) {
          setSessionDetails(data.session);
          setStatus(`Session verified! Redirecting to ${destination}...`);
          
          // Ensure the session data is properly saved in localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              const storageKey = 'supabase.auth.token';
              window.localStorage.setItem(storageKey, JSON.stringify({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at
              }));
              console.log('Session data stored in localStorage');
            } catch (e) {
              console.warn('Could not store session in localStorage:', e);
            }
          }
          
          // Short delay before redirecting to ensure everything is set
          setTimeout(() => {
            router.push(destination);
          }, 1000);
        } else if (attempts < 5) {
          // Session not yet available, try again in 500ms (up to 5 attempts)
          setStatus(`Session not found, retrying (${attempts}/5)...`);
          setTimeout(verifySession, 500);
        } else {
          // After 5 attempts, give up and show an error
          setError('Failed to verify session after multiple attempts. Please try logging in again.');
          setStatus('Verification failed');
        }
      } catch (e) {
        setError(`Unexpected error: ${e instanceof Error ? e.message : String(e)}`);
        setStatus('Verification error');
      }
    };
    
    verifySession();
  }, [destination, router, attempts]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Session Verification</h1>
        
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p>{status}</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => router.push('/admin/login')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Back to Login
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => setDebugMode(!debugMode)} 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
        
        {debugMode && sessionDetails && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
            <h3 className="text-gray-700 font-bold mb-2">Session Details</h3>
            <div className="overflow-auto max-h-40">
              <pre className="text-xs">{JSON.stringify(sessionDetails, null, 2)}</pre>
            </div>
            
            <h3 className="text-gray-700 font-bold mb-2 mt-4">Cookies</h3>
            <div className="overflow-auto max-h-40">
              <pre className="text-xs break-all">{document.cookie}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 