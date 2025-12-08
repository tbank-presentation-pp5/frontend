"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimpleSlidesCarouselProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
  className?: string;
}

export const SimpleSlidesCarousel: React.FC<SimpleSlidesCarouselProps> = ({
  value,
  onChange,
  options,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = options.indexOf(value);
    return index !== -1 ? index : Math.floor(options.length / 2);
  });

  // Синхронизация с внешним значением
  useEffect(() => {
    const index = options.indexOf(value);
    if (index !== -1 && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [value, options, currentIndex]);

  const handlePrevious = useCallback(() => {
    const newIndex = (currentIndex - 1 + options.length) % options.length;
    setCurrentIndex(newIndex);
    onChange(options[newIndex]);
  }, [currentIndex, options, onChange]);

  const handleNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % options.length;
    setCurrentIndex(newIndex);
    onChange(options[newIndex]);
  }, [currentIndex, options, onChange]);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    },
    [handleNext, handlePrevious]
  );

  // Функция для правильного склонения слова "слайд"
  const getSlideText = (num: number) => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    
    if (lastDigit === 1 && lastTwoDigits !== 11) return 'слайд';
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
      return 'слайда';
    }
    return 'слайдов';
  };

  return (
    <div
      className={cn('flex items-center justify-center space-x-2', className)}
      onWheel={handleWheel}
    >
      <Button
        variant="white"
        size="white"
        onClick={handlePrevious}
        className="h-6 w-6 bg-field hover:bg-field active:bg-field"
        aria-label="Предыдущий"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="min-w-[100px] text-center select-none">
        <div className="text-base font-medium tracking-tight">
          {options[currentIndex]} {getSlideText(options[currentIndex])}
        </div>
      </div>
      
      <Button
        variant="white"
        size="white"
        onClick={handleNext}
        className="h-6 w-6 bg-field hover:bg-field active:bg-field"
        aria-label="Следующий"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SimpleSlidesCarousel;