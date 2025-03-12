"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import { supabase, isLocalhost } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalServices: number;
  totalGalleryImages: number;
  unreadContactSubmissions: number;
  userEmail: string | null;
}

// Debug component to display session info
function SessionDebug() {
  const [sessionInfo, setSessionInfo] = useState<{
    session: {
      user?: {
        email?: string;
        id?: string;
      };
      expires_at?: number;
    } | null;
  } | null>(null);
  const [cookies, setCookies] = useState<string>('');
  const [localStorageAuth, setLocalStorageAuth] = useState<string | null>(null);

  useEffect(() => {
    async function getDebugInfo() {
      const { data } = await supabase.auth.getSession();
      setSessionInfo(data);
      setCookies(document.cookie);
      
      // Check localStorage for auth tokens - commonly used by Supabase
      if (typeof window !== 'undefined') {
        try {
          // Check common Supabase token locations in localStorage
          const lsKeys = ['supabase.auth.token', 'sb-access-token', 'sb-refresh-token'];
          for (const key of lsKeys) {
            const token = localStorage.getItem(key);
            if (token) {
              setLocalStorageAuth(`Found auth in localStorage (${key})`);
              break;
            }
          }
        } catch (e) {
          console.warn('Could not check localStorage auth:', e);
        }
      }
    }
    getDebugInfo();
  }, []);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-60">
      <h3 className="text-gray-700 font-bold mb-2">Session Debug (Admin Only)</h3>
      <p className="mb-1"><strong>Environment:</strong> {isLocalhost ? 'Localhost' : 'Production'}</p>
      <p className="mb-1"><strong>Cookies:</strong> {cookies || 'No cookies found'}</p>
      <p className="mb-1"><strong>LocalStorage Auth:</strong> {localStorageAuth || 'No localStorage auth found'}</p>
      <p className="mb-1"><strong>Session Status:</strong> {sessionInfo?.session ? 'Active' : 'None'}</p>
      {sessionInfo?.session && (
        <div>
          <p className="mb-1"><strong>User:</strong> {sessionInfo.session.user?.email}</p>
          <p className="mb-1"><strong>Expires:</strong> {sessionInfo.session.expires_at 
            ? new Date(sessionInfo.session.expires_at * 1000).toString()
            : 'No expiration'}</p>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    totalGalleryImages: 0,
    unreadContactSubmissions: 0,
    userEmail: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true on mount to prevent hydration mismatch
    setIsClient(true);
  }, []);

  // Check authentication and fetch data
  useEffect(() => {
    const initDashboard = async () => {
      try {
        console.log(`Dashboard - Checking session (${isLocalhost ? 'Localhost' : 'Production'} environment)...`);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Dashboard - Session check result:', !!session);
        
        if (!session) {
          console.log('No session found, redirecting to login');
          window.location.href = '/admin/login';
          return;
        }

        setStats(prev => ({...prev, userEmail: session.user?.email || null}));
        
        // Fetch dashboard statistics
        try {
          // Fetch services count
          const servicesResponse = await fetch('/api/services');
          const servicesData = await servicesResponse.json();
          
          // Fetch gallery images count
          const galleryResponse = await fetch('/api/gallery');
          const galleryData = await galleryResponse.json();
          
          // Fetch contact submissions
          const contactResponse = await fetch('/api/contact');
          const contactData = await contactResponse.json();
          
          // Set stats
          setStats(prev => ({
            ...prev,
            totalServices: servicesData.length || 0,
            totalGalleryImages: galleryData.length || 0,
            unreadContactSubmissions: contactData.filter((submission: {read: boolean}) => !submission.read).length || 0,
          }));
          
        } catch (err) {
          console.error('Error fetching dashboard stats:', err);
          setError('Failed to load some dashboard statistics.');
        }
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError('An error occurred while initializing the dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initDashboard();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // The signOut function will handle the redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Dashboard {isClient && isLocalhost ? '(Localhost)' : ''}
          </h2>
          {stats.userEmail && (
            <p className="text-sm text-gray-600">Logged in as: {stats.userEmail}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isClient && isLocalhost && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6 text-sm">
          <strong>Localhost Environment:</strong> Using standard Supabase client for authentication.
        </div>
      )}

      {showDebug && <SessionDebug />}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Services Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Services</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">{stats.totalServices}</p>
            <Link href="/admin/services" className="text-green-600 hover:text-green-800">
              Manage Services →
            </Link>
          </div>

          {/* Gallery Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Gallery Images</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">{stats.totalGalleryImages}</p>
            <Link href="/admin/gallery" className="text-green-600 hover:text-green-800">
              Manage Gallery →
            </Link>
          </div>

          {/* Contact Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Unread Contact Submissions</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">{stats.unreadContactSubmissions}</p>
            <Link href="/admin/contact" className="text-green-600 hover:text-green-800">
              View Submissions →
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/admin/services/new" 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-medium">Add New Service</span>
          </Link>

          <Link 
            href="/admin/gallery/new" 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium">Upload Image</span>
          </Link>

          <Link 
            href="/admin/settings" 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-medium">Site Settings</span>
          </Link>

          <Link 
            href="/admin/contact" 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium">Contact Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
}