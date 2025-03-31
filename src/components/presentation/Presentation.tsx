'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PresentationProps {
  children: ReactNode[];
}

export function Presentation({ children }: PresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const totalSlides = children.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        router.back();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  return (
    <div className="relative bg-gray-900 text-white">
      {/* Current Slide */}
      <div className="relative">
        {children[currentSlide]}
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-4 right-4 flex gap-4 bg-black/20 p-2 rounded">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-2 rounded hover:bg-white/10 disabled:opacity-50"
        >
          ←
        </button>
        <span className="p-2">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 rounded hover:bg-white/10 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
