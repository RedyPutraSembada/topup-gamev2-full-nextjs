"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const carouselImages = [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative mx-4 lg:mx-8 mt-6 mb-8 text-white">
      <div className="relative h-64 rounded-2xl overflow-hidden">
        <img
          src={carouselImages[currentSlide]}
          alt="Featured game"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex items-center">
          <div className="px-8">
            <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚔️</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">The Impending</h2>
            <p className="text-xl text-blue-300">Clash of Waves</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}