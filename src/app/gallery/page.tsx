"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryImage } from '@/lib/supabase';

const DEFAULT_IMAGES = [
  {
    id: 1,
    title: 'Beautiful Lawn Maintenance',
    description: 'Regular lawn care keeps your yard looking its best year-round.',
    image_url: '/images/gallery/lawn-1.jpg',
    category: 'Lawn Care',
    created_at: new Date().toISOString()
  },
  // ... other default images
];

export default function GalleryPage() {
  // We're using default images directly since we don't have actual data yet
  // const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // In a real application, we would fetch data here
  // useEffect(() => {
  //   async function fetchGalleryImages() {
  //     try {
  //       const response = await fetch('/api/gallery');
  //       const data = await response.json();
  //       setGalleryImages(data);
  //       
  //       // Extract unique categories
  //       const uniqueCategories = ['All', ...new Set(data.map((image: GalleryImage) => image.category))];
  //       setCategories(uniqueCategories);
  //       setIsLoading(false);
  //     } catch (err) {
  //       setError('Failed to load gallery images');
  //       setIsLoading(false);
  //     }
  //   }
  //   
  //   fetchGalleryImages();
  // }, []);

  // Simulate data fetching
  useEffect(() => {
    // Extract unique categories from default images
    const uniqueCategories = ['All', ...new Set(DEFAULT_IMAGES.map(image => image.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter images by category
  const filteredImages = selectedCategory === 'All'
    ? DEFAULT_IMAGES
    : DEFAULT_IMAGES.filter(image => image.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (id: number) => {
    setSelectedImage(id);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const getSelectedImageData = () => {
    return DEFAULT_IMAGES.find(img => img.id === selectedImage);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery-hero.jpg"
            alt="Our work"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our Work
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Browse our portfolio of lawn care and landscaping projects
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => handleCategoryChange('All')}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === 'All'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                All Projects
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
                  onClick={() => openLightbox(image.id)}
                >
                  <div className="h-64 relative">
                    <Image
                      src={image.image_url}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-green-800">{image.title}</h3>
                    <p className="text-gray-700 text-sm">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-700 mb-4">No projects found in this category.</p>
                <button
                  onClick={() => handleCategoryChange('All')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  View All Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-white rounded-lg overflow-hidden">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="h-96 relative">
              <Image
                src={getSelectedImageData()?.image_url || ''}
                alt={getSelectedImageData()?.title || ''}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-green-800 mb-2">{getSelectedImageData()?.title}</h3>
              <p className="text-gray-700 mb-4">{getSelectedImageData()?.description}</p>
              <Link 
                href="/contact" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Request Similar Service
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Outdoor Space?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-700">
            Contact us today to schedule a consultation and see how we can help with your lawn care and landscaping needs.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
} 