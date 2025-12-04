"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { usePresentationOutlineStore } from '@/store/usePresentationOutlineStore';
import { PresentationOutlineView } from '@/components/dashboard/outline-preview';
import { GeneratePresentationButton } from '@/components/presentation/generate-presentation-button';

export default function PresentationOutlinePage() {
  const params = useParams();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    viewedOutline, 
    isLoading, 
    error, 
    loadOutlineById,
    clearViewedOutline 
  } = usePresentationOutlineStore();

  const id = Number(params.id);

  useEffect(() => {
    if (!id) {
      router.push('/');
      return;
    }

    const loadOutline = async () => {
      await loadOutlineById(id);
      setIsInitialized(true);
    };

    loadOutline();

    // Очищаем viewedOutline при размонтировании
    return () => {
      clearViewedOutline();
    };
  }, [id, loadOutlineById, clearViewedOutline, router]);

  const handleBack = () => {
    router.push('/');
  };

  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Загружаем план презентации...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Ошибка загрузки</h1>
        <p className="text-muted-foreground mb-6 text-center">{error}</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться назад
        </Button>
      </div>
    );
  }

  if (!viewedOutline) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">План не найден</h1>
        <p className="text-muted-foreground mb-6">План презентации с ID {id} не найден</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться назад
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Шапка с кнопкой назад */}
        <div className="mb-8">
          <Button
            variant="white"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к генерации
          </Button>
          
          <div className="bg-card rounded-lg p-6 border">
            <h1 className="text-2xl font-bold mb-2">{viewedOutline.shortDescription}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{viewedOutline.numberOfSlides} слайдов</span>
              <span>•</span>
              <span>ID: {viewedOutline.id}</span>
            </div>
          </div>
        </div>

        {/* Компонент с отображением outline */}
        <PresentationOutlineView outline={viewedOutline} />

        <div className="sticky bottom-6 backdrop-blur p-4 rounded-lg border shadow-lg flex justify-center">
          <GeneratePresentationButton 
            planId={id}
          />
        </div>
      </div>
    </div>
  );
}