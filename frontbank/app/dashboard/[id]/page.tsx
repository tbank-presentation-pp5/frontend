"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePresentationStore } from "@/store/usePresentationStore";
import { MainSlide } from "@/components/dashboard/slides/main-slide";
import { SectionSlide } from "@/components/dashboard/slides/section-slide";
import { ImageSlide } from "@/components/dashboard/slides/image-slide";
import { Slide } from "@/services/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PPTXExport } from "@/components/dashboard/pptx-export";

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const {
    presentationId,
    name,
    slides,
    clearPresentation,
    loadPresentationById,
  } = usePresentationStore();
  const [isLoading, setIsLoading] = useState(true);

  const id = Number(params.id);

  useEffect(() => {
    const loadPresentation = async () => {
      if (presentationId && presentationId === id) {
        setIsLoading(false);
      } else if (id && !isNaN(id)) {
        const presentation = await loadPresentationById(id);
        if (!presentation) {
          console.log("Презентация не найдена в store, id:", id);
        }
        setIsLoading(false);
      } else {
        console.log("Неверный id:");
        setIsLoading(false);
      }
    };

    loadPresentation();
  }, [id, presentationId, loadPresentationById]);

  const handleBack = () => {
    clearPresentation();
    router.push("/");
  };

  const renderSlideComponent = (slide: Slide) => {
    switch (slide.type) {
      case "MAIN":
        return <MainSlide slide={slide} />;
      case "SECTION":
        return <SectionSlide slide={slide} />;
      case "TEXT_WITH_IMAGE":
        return <ImageSlide slide={slide} />;
      default:
        return <div>Неизвестный тип слайда: {slide.type}</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Загружаем презентацию...</p>
      </div>
    );
  }

  if (!presentationId || slides.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Презентация не найдена</h1>
        <p className="text-muted-foreground mb-6">
          Не удалось загрузить презентацию с ID: {id}
        </p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на главную
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent2 sticky top-0 z-10">
        <div className="flex w-[1104px] h-16 mx-auto items-center justify-between">
          <h1 className="text-xl font-semibold">{name}</h1>
          <div className="flex gap-2">
            <PPTXExport
              presentationId={presentationId}
              presentationName={name}
            />
            <Button variant={"yellow"} onClick={() => handleBack()}>
              Закрыть презентацию
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8">
        {slides.map((slide) => (
          <div key={slide.slideId} className="p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">
              Слайд {slide.orderNumber}
            </h3>
            {renderSlideComponent(slide)}
          </div>
        ))}
      </div>
    </div>
  );
}
