"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GalleryImage } from '@/lib/supabase';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch gallery images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/gallery${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        setImages(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((image: GalleryImage) => image.category))) as string[];
        setCategories(uniqueCategories);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImages();
  }, [selectedCategory]);

  // Handle delete confirmation
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle delete image
  const deleteImage = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/gallery/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      // Remove the deleted image from the state
      setImages(images.filter(image => image.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again later.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Gallery</h2>
        <Link 
          href="/admin/gallery/new" 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Add New Image
        </Link>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600 mb-4">No images found in the gallery.</p>
          <Link 
            href="/admin/gallery/new" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Add Your First Image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="relative h-48 mb-4">
                <Image
                  src={image.image_url}
                  alt={image.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="font-bold text-gray-800">{image.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{image.category}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{image.description}</p>
              
              <div className="flex justify-between">
                <Link 
                  href={`/admin/gallery/edit/${image.id}`} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors text-sm"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => confirmDelete(image.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteImage}
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