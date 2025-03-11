"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryImage } from '@/lib/supabase';

// Gallery image data
const galleryImages = [
  {
    id: 1,
    src: '/gallery/lawn-1.jpg',
    alt: 'Beautiful residential lawn',
    category: 'lawn-maintenance',
    title: 'Residential Lawn Maintenance',
    description: 'Weekly lawn maintenance for a residential property in Anytown.'
  },
  {
    id: 2,
    src: '/gallery/landscaping-1.jpg',
    alt: 'Front yard landscaping',
    category: 'landscaping',
    title: 'Front Yard Transformation',
    description: 'Complete front yard landscaping redesign with new plants and mulch.'
  },
  {
    id: 3,
    src: '/gallery/lawn-2.jpg',
    alt: 'Large commercial lawn',
    category: 'lawn-maintenance',
    title: 'Commercial Property Maintenance',
    description: 'Regular maintenance for a commercial office building.'
  },
  {
    id: 4,
    src: '/gallery/landscaping-2.jpg',
    alt: 'Backyard garden design',
    category: 'landscaping',
    title: 'Backyard Garden Oasis',
    description: 'Custom garden design with flowering plants and stone pathways.'
  },
  {
    id: 5,
    src: '/gallery/fertilization-1.jpg',
    alt: 'Lawn fertilization',
    category: 'fertilization',
    title: 'Lawn Fertilization Program',
    description: 'Before and after results of our seasonal fertilization program.'
  },
  {
    id: 6,
    src: '/gallery/cleanup-1.jpg',
    alt: 'Fall cleanup',
    category: 'cleanup',
    title: 'Fall Cleanup Service',
    description: 'Comprehensive fall cleanup including leaf removal and bed preparation.'
  },
  {
    id: 7,
    src: '/gallery/landscaping-3.jpg',
    alt: 'Hardscape installation',
    category: 'landscaping',
    title: 'Patio and Retaining Wall',
    description: 'Custom hardscape installation with paver patio and retaining wall.'
  },
  {
    id: 8,
    src: '/gallery/lawn-3.jpg',
    alt: 'Lawn renovation',
    category: 'lawn-maintenance',
    title: 'Lawn Renovation Project',
    description: 'Complete lawn renovation with aeration, overseeding, and fertilization.'
  },
  {
    id: 9,
    src: '/gallery/landscaping-4.jpg',
    alt: 'Flower bed installation',
    category: 'landscaping',
    title: 'Colorful Flower Bed Installation',
    description: 'Seasonal flower bed installation for a residential property.'
  },
  {
    id: 10,
    src: '/gallery/cleanup-2.jpg',
    alt: 'Spring cleanup',
    category: 'cleanup',
    title: 'Spring Cleanup and Mulching',
    description: 'Spring cleanup service with fresh mulch application.'
  },
  {
    id: 11,
    src: '/gallery/fertilization-2.jpg',
    alt: 'Weed control',
    category: 'fertilization',
    title: 'Weed Control Treatment',
    description: 'Targeted weed control treatment for a residential lawn.'
  },
  {
    id: 12,
    src: '/gallery/landscaping-5.jpg',
    alt: 'Tree and shrub planting',
    category: 'landscaping',
    title: 'Tree and Shrub Installation',
    description: 'Selection and installation of trees and shrubs for privacy screening.'
  }
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery images from the API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/gallery${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        setGalleryImages(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again later.');
        // Use placeholder data if API fails
        setGalleryImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGalleryImages();
  }, [selectedCategory]);

  const filteredImages = galleryImages;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const openLightbox = (id: number) => {
    setSelectedImage(id);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const getSelectedImageData = () => {
    return galleryImages.find(img => img.id === selectedImage);
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
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                All Projects
              </button>
              <button
                onClick={() => handleCategoryChange('lawn-maintenance')}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === 'lawn-maintenance'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Lawn Maintenance
              </button>
              <button
                onClick={() => handleCategoryChange('landscaping')}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === 'landscaping'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Landscaping
              </button>
              <button
                onClick={() => handleCategoryChange('fertilization')}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === 'fertilization'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Fertilization
              </button>
              <button
                onClick={() => handleCategoryChange('cleanup')}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === 'cleanup'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Seasonal Cleanup
              </button>
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
                      src={image.src}
                      alt={image.alt}
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
                  onClick={() => handleCategoryChange('all')}
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
                src={getSelectedImageData()?.src || ''}
                alt={getSelectedImageData()?.alt || ''}
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