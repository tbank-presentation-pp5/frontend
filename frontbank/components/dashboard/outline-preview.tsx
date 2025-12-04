"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PresentationOutline } from "@/services/types";
import { ChevronRight } from 'lucide-react';

interface PresentationOutlineViewProps {
  outline: PresentationOutline;
  showHeader?: boolean;
  showActions?: boolean;
  onGeneratePresentation?: () => void;
}

export const PresentationOutlineView: React.FC<PresentationOutlineViewProps> = ({
  outline,
  showHeader = true,
  showActions = false,
  onGeneratePresentation,
}) => {
  return (
    <div className="space-y-6">
      {/* Список слайдов */}
      <div className="grid gap-4">
        {outline.plan.map((slide, index) => (
          <Card key={index} className="overflow-hidden bg-accent2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <CardTitle className="text-lg">{slide.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {slide.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Кнопки действий (если нужны) */}
      {showActions && onGeneratePresentation && (
        <div className="pt-6 border-t">
          <button
            onClick={onGeneratePresentation}
            className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Сгенерировать презентацию
          </button>
        </div>
      )}
    </div>
  );
};