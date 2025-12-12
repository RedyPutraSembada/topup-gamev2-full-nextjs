'use client'

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function CarouselSliderHome({ data_slider }) {
  const slides = useMemo(() => {
    try {
      return typeof data_slider.data[0].data_slider === 'string'
        ? JSON.parse(data_slider.data[0].data_slider)
        : data_slider.data[0].data_slider;
    } catch (e) {
      console.error("Gagal parsing data_slider:", e);
      return [];
    }
  }, [data_slider.data[0].data_slider]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!slides || slides.length === 0)
    return <p className="text-center text-gray-400">Tidak ada slider.</p>;

  const active = slides[currentSlide];

  return (
    <div 
      className="relative h-[400px] rounded-3xl overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Smooth Transition */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === currentSlide ? 1 : 0,
            transform: idx === currentSlide ? 'scale(1)' : 'scale(1.1)',
            transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: idx === currentSlide ? 1 : 0
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            unoptimized
            className="object-cover"
            sizes="100vw"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Elegant Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
        }}
      />

      {/* Content - Positioned at Left Center */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full max-w-2xl px-12 lg:px-16">
          <div
            key={`content-${currentSlide}`}
            style={{
              animation: 'fadeInUp 800ms ease-out'
            }}
          >
            <h2 
              className="text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight"
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                lineHeight: '1.2'
              }}
            >
              {active.title}
            </h2>
            <p 
              className="text-xl lg:text-2xl text-gray-100 font-light"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              {active.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Minimal Design */}
      <Button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 
        rounded-full flex items-center justify-center
        bg-white/5 backdrop-blur-xl border border-white/10
        opacity-0 group-hover:opacity-100 hover:bg-white/10
        transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-7 h-7 text-white" strokeWidth={1.5} />
      </Button>

      <Button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 
        rounded-full flex items-center justify-center
        bg-white/5 backdrop-blur-xl border border-white/10
        opacity-0 group-hover:opacity-100 hover:bg-white/10
        transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7 text-white" strokeWidth={1.5} />
      </Button>

      {/* Elegant Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group/dot relative"
            aria-label={`Go to slide ${idx + 1}`}
          >
            {/* Background glow effect */}
            {idx === currentSlide && (
              <div 
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
            )}
            {/* Dot */}
            <div
              className={`relative rounded-full transition-all duration-500 ${
                idx === currentSlide
                  ? 'w-10 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 group-hover/dot:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Subtle Top Fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)'
        }}
      />
    </div>
  );
}