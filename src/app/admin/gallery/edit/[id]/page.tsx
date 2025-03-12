"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { GalleryImage } from '@/lib/supabase';

export default function EditGalleryImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [imageId, setImageId] = useState<string | null>(null);
  
  useEffect(() => {
    async function extractId() {
      try {
        const resolvedParams = await params;
        setImageId(resolvedParams.id);
      } catch (error) {
        console.error("Error extracting ID from params:", error);
        setError("Invalid image ID");
      }
    }
    
    extractId();
  }, [params]);
  
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) return;
    
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/gallery/${imageId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery image');
        }
        
        const data = await response.json();
        setImage(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setCategory(data.category);
        setImagePreview(data.image_url);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery image:', err);
        setError('Failed to load gallery image. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [imageId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageId) {
      setError('Image ID not found');
      return;
    }
    
    if (!title || !category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      let imageUrl = image?.image_url;
      
      if (imageFile) {
        const fileName = `gallery/${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error('Failed to get public URL for the uploaded image');
        }

        imageUrl = publicUrlData.publicUrl;
      }

      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update gallery image');
      }

      router.push('/admin/gallery');
    } catch (err: any) {
      console.error('Error updating gallery image:', err);
      setError(err.message || 'An error occurred while updating the gallery image');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4 ml-auto"></div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Image Not Found</h2>
        <p className="text-gray-600 mb-6">The gallery image you're trying to edit could not be found.</p>
        <Link
          href="/admin/gallery"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Edit Gallery Image</h2>
        <Link
          href="/admin/gallery"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use categories like "Before/After", "Residential", or "Commercial"
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep the current image. Max file size: 5MB.
          </p>
        </div>

        {imagePreview && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="relative h-64 w-full">
              <Image
                src={imagePreview}
                alt={title}
                fill
                className="object-contain rounded border border-gray-300"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 