"use client";

import { useState, useEffect } from 'react';
import { ContactSubmission } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch contact submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contact');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact submissions');
        }
        
        const data = await response.json();
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setSubmissions(data);
        } else {
          console.error('Expected array but received:', data);
          setError('Received invalid data format from the server. Please try again later.');
          setSubmissions([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching contact submissions:', err);
        setError('Failed to load contact submissions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, []);

  // View submission details
  const viewSubmission = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
    
    // Mark as read if not already read
    if (!submission.read) {
      try {
        const response = await fetch(`/api/contact/${submission.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            read: true,
          }),
        });
        
        if (response.ok) {
          // Update the local state to show as read
          setSubmissions(submissions.map(item => 
            item.id === submission.id ? { ...item, read: true } : item
          ));
        }
      } catch (err) {
        console.error('Error marking submission as read:', err);
      }
    }
  };

  // Handle delete confirmation
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
    setShowDetailModal(false);
  };

  // Handle delete submission
  const deleteSubmission = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/contact/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      
      // Remove the deleted submission from the state
      setSubmissions(submissions.filter(submission => submission.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError('Failed to delete submission. Please try again later.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (err) {
      return 'Unknown date';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Form Submissions</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">No contact form submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div 
              key={submission.id} 
              className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!submission.read ? 'border-l-4 border-green-600' : ''}`}
              onClick={() => viewSubmission(submission)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{submission.name}</h3>
                  <p className="text-gray-600">{submission.email}</p>
                  {submission.service && (
                    <p className="text-green-600 text-sm mt-1">Service: {submission.service}</p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(submission.created_at)}
                  {!submission.read && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Contact Submission</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="text-gray-800">{selectedSubmission.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-gray-800">{selectedSubmission.email}</p>
              </div>
              
              {selectedSubmission.phone && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="text-gray-800">{selectedSubmission.phone}</p>
                </div>
              )}
              
              {selectedSubmission.service && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Service</h4>
                  <p className="text-gray-800">{selectedSubmission.service}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Submitted</h4>
                <p className="text-gray-800">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => confirmDelete(selectedSubmission.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this contact submission? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSubmission}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 