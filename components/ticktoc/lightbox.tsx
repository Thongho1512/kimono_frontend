"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 animate-in fade-in duration-300 backdrop-blur-sm"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-2 bg-white/10 rounded-full z-[110]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {onPrev && images.length > 1 && (
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-primary bg-white/5 rounded-full hover:bg-white/10 transition-all z-[110]"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {onNext && images.length > 1 && (
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-primary bg-white/5 rounded-full hover:bg-white/10 transition-all z-[110]"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
      
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <Image
          src={currentImage}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
