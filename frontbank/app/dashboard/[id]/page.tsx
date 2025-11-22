"use client";
import React from "react";
import { usePresentationStore } from "@/store/usePresentationStore";
import { MainSlide } from "@/components/dashboard/slides/main-slide";
import { SectionSlide } from "@/components/dashboard/slides/section-slide";
import { ImageSlide } from "@/components/dashboard/slides/image-slide";
import { Slide } from "@/services/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PDFExport } from "@/components/dashboard/pdf-export";

export default function PresentationPage() {
  const { presentationId, name, createdAt, slides, clearPresentation } =
    usePresentationStore();
  const router = useRouter();

  const handleClose = () => {
    clearPresentation();
    router.push("/");
  };

  if (!presentationId) {
    return <div>Загрузка...</div>;
  }

  const renderSlideComponent = (slide: Slide) => {
    switch (slide.type) {
      case "MAIN":
        return <MainSlide slide={slide} />;
      case "SECTION":
        return <SectionSlide slide={slide} />;
      case "TEXT_WITH_IMAGE":
        return <ImageSlide slide={slide} />;
      default:
        return (
          <div>
            Неизвестный тип слайда: {slide.type}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="bg-accent2 sticky top-0">
        <div className="flex w-[1104px] h-16 mx-auto items-center justify-between">
          <a>{name}</a>
          <div className="flex gap-2">
            {/* <PDFExport slides={slides} presentationName={name} /> */}
            <Button variant={"yellow"} onClick={() => handleClose()}>
              Закрыть презентацию
            </Button>
          </div>
        </div>
      </div>

      {slides.map((slide) => (
        <div key={slide.slideId} className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">
            Слайд {slide.orderNumber}
          </h3>
          {renderSlideComponent(slide)}
        </div>
      ))}
    </div>
  );
}
