"use client";
import React from "react";
import { usePresentationStore } from "@/store/usePresentationStore";
import { MainSlide } from "@/components/dashboard/slides/main-slide";
import { SectionSlide } from "@/components/dashboard/slides/section-slide";
import { ImageSlide } from "@/components/dashboard/slides/image-slide";
import { Slide } from "@/services/types";

export default function PresentationPage() {
  const { presentationId, name, createdAt, slides } = usePresentationStore();

  if (!presentationId) {
    return <div>Загрузка...</div>;
  }

  const renderSlideComponent = (slide: Slide) => {
    switch (slide.type) {
      case 'MAIN':
        return <MainSlide slide={slide} />;
      case 'SECTION':
        return <SectionSlide slide={slide} />;
      case 'TEXT_WITH_IMAGE':
        return <ImageSlide slide={slide} />;
      default:
        return (
          <div className="rounded-xl p-6 text-white w-[1104px] h-[621px] bg-textd">
            Неизвестный тип слайда: {slide.type}
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <p className="text-gray-600 mb-6">
        Создано: {new Date(createdAt).toLocaleDateString()}
      </p>

      {slides.map((slide) => (
        <div
          key={slide.slideId}
          className="p-6 flex flex-col items-center"
        >
          <h3 className="text-xl font-semibold mb-4">
            Слайд {slide.orderNumber} - {slide.type}
          </h3>
          {renderSlideComponent(slide)}
        </div>
      ))}
    </div>
  );
}