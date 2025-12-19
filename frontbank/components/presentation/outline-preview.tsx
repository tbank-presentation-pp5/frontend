"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PresentationOutline } from "@/services/types";
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePresentationOutlineStore } from '@/store/usePresentationOutlineStore';
import { updatePresentationPlan } from '@/services/api/requests';
import { useOutlineEditor } from '@/hooks/useOutlineEditor';
import { SlideMenu } from './slide-menu';

interface PresentationOutlineViewProps {
  outline: PresentationOutline;
}

export const PresentationOutlineView: React.FC<PresentationOutlineViewProps> = ({
  outline,
}) => {
  const store = usePresentationOutlineStore();
  
  useEffect(() => {
    if (outline.id !== store.currentOutline?.id) {
      store.setCurrentOutline(outline);
    }
  }, [outline, store]);

  const {
    plan,
    handleSlideTitleChange,
    handlePointChange,
    moveSlideDown,
    moveSlideUp,
    addSlide,
    removeSlide,
  } = useOutlineEditor({ outline });

  return (
    <div className="bg-accent2 rounded-2xl">
      <h1 className="pl-7 pt-6 font-bold text-2xl font-tinkoff">Содержание</h1>
      
      <div className="grid gap-4 p-7">
        {plan.map((slide, index) => (
          <Card key={index} className="overflow-hidden bg-field">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary font-bold text-3xl">
                    {index + 1}
                  </div>
                  <Input
                    value={slide.title}
                    onChange={(e) => handleSlideTitleChange(index, e.target.value)}
                    className="text-xl font-semibold"
                    placeholder="Название слайда"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SlideMenu
                    slideIndex={index}
                    totalSlides={plan.length}
                    onMoveUp={() => moveSlideUp(index)}
                    onMoveDown={() => moveSlideDown(index)}
                    onDelete={() => removeSlide(index)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {slide.points?.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex gap-3">
                    <ChevronRight className="h-4 w-4 flex text-muted-foreground mt-3" />
                    <Textarea
                      value={point}
                      onChange={(e) => handlePointChange(index, pointIndex, e.target.value)}
                      className="min-h-[60px] resize-none flex-col justify-center"
                      placeholder="Текст пункта"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          onClick={addSlide}
          variant="white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить слайд
        </Button>
      </div>
    </div>
  );
};