'use client';

import { CloudinaryImage } from '../types';
import Image from 'next/image';
import { useState } from 'react';
import { BackButton } from './BackButton';

interface PropertyImageGalleryProps {
  images: CloudinaryImage[];
  title: string;
}

export function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative h-64 sm:h-80 bg-gray-200">
        <Image
          src={images[currentImageIndex]?.url || '/placeholder-property.jpg'}
          alt={images[currentImageIndex]?.caption || title}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-black/70 text-white">
            {currentImageIndex + 1}/{images.length}
          </span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setShowFullscreen(true)}
          className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Back Button */}
        <BackButton />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rou-orange-g overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                  }`}
              >
                <Image
                  src={image.url}
                  alt={image.caption || `Image ${index + 1}`}
                  width={64}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[currentImageIndex]?.url || '/placeholder-property.jpg'}
              alt={images[currentImageIndex]?.caption || title}
              fill
              className="object-contain"
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Fullscreen Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-black/70 text-white">
                {currentImageIndex + 1} of {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}