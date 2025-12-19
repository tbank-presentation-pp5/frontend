"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { generatePresentationFromPlan, updatePresentationPlan } from '@/services/api/requests';
import { useRouter } from 'next/navigation';
import { usePresentationStore } from '@/store/usePresentationStore';
import { usePresentationOutlineStore } from '@/store/usePresentationOutlineStore';
import { toast } from 'sonner';

interface GeneratePresentationButtonProps {
  planId: number;
  className?: string;
}

export const GeneratePresentationButton: React.FC<GeneratePresentationButtonProps> = ({
  planId,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setPresentation } = usePresentationStore();
  const { currentOutline, setCurrentOutline } = usePresentationOutlineStore();

  const handleGeneratePresentation = async () => {
    if (!planId || !currentOutline) return;
    
    setIsLoading(true);
    
    try {
      const updatedOutline = await updatePresentationPlan(planId, currentOutline.plan);
      
      setCurrentOutline(updatedOutline);
      
      const presentation = await generatePresentationFromPlan(planId);
      
      setPresentation(presentation);
      
      router.push(`/dashboard/${presentation.presentationId}`);
      
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error('Ошибка при генерации презентации. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGeneratePresentation}
      className={`${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      variant={"yellow"}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Генерируем...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Сгенерировать презентацию
        </>
      )}
    </Button>
  );
};