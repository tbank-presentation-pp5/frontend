import { useCallback } from 'react';
import { PresentationOutline } from '@/services/types';
import { usePresentationOutlineStore } from '@/store/usePresentationOutlineStore';

interface UseOutlineEditorProps {
  outline: PresentationOutline;
}

export const useOutlineEditor = ({ outline }: UseOutlineEditorProps) => {
  const store = usePresentationOutlineStore();
  
  const currentOutline = store.currentOutline || outline;
  const plan = currentOutline.plan;

  const updatePlanInStore = useCallback((newPlan: PresentationOutline['plan']) => {
    if (!currentOutline) return;
    
    const updatedOutline = {
      ...currentOutline,
      plan: newPlan
    };
    
    store.setCurrentOutline(updatedOutline);
  }, [currentOutline, store]);

  const handleSlideTitleChange = useCallback((index: number, value: string) => {
    const newPlan = [...plan];
    newPlan[index] = { ...newPlan[index], title: value };
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const handlePointChange = useCallback((slideIndex: number, pointIndex: number, value: string) => {
    const newPlan = [...plan];
    if (!newPlan[slideIndex].points) {
      newPlan[slideIndex].points = [];
    }
    newPlan[slideIndex].points![pointIndex] = value;
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const moveSlideUp = useCallback((slideIndex: number) => {
    if (slideIndex === 0) return;
    const newPlan = [...plan];
    const temp = newPlan[slideIndex];
    newPlan[slideIndex] = newPlan[slideIndex - 1];
    newPlan[slideIndex - 1] = temp;
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const moveSlideDown = useCallback((slideIndex: number) => {
    if (slideIndex === plan.length - 1) return;
    const newPlan = [...plan];
    const temp = newPlan[slideIndex];
    newPlan[slideIndex] = newPlan[slideIndex + 1];
    newPlan[slideIndex + 1] = temp;
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const removeSlide = useCallback((slideIndex: number) => {
    if (plan.length <= 1) return;
    const newPlan = plan.filter((_, index) => index !== slideIndex);
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const removePoint = useCallback((slideIndex: number, pointIndex: number) => {
    if (!plan[slideIndex].points || plan[slideIndex].points.length <= 1) return;
    const newPlan = [...plan];
    newPlan[slideIndex].points = newPlan[slideIndex].points.filter(
      (_, index) => index !== pointIndex
    );
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const addPoint = useCallback((slideIndex: number) => {
    const newPlan = [...plan];
    if (!newPlan[slideIndex].points) {
      newPlan[slideIndex].points = [];
    }
    newPlan[slideIndex].points = [...newPlan[slideIndex].points, ''];
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const addSlide = useCallback(() => {
    const newPlan = [...plan, { title: 'Новый слайд', points: [''] }];
    updatePlanInStore(newPlan);
  }, [plan, updatePlanInStore]);

  const resetPlan = useCallback((newPlan: PresentationOutline['plan']) => {
    updatePlanInStore(newPlan);
  }, [updatePlanInStore]);

  const isPlanModified = useCallback((originalPlan: PresentationOutline['plan']) => {
    return JSON.stringify(originalPlan) !== JSON.stringify(plan);
  }, [plan]);

  return {
    plan,
    handleSlideTitleChange,
    handlePointChange,
    moveSlideUp,
    moveSlideDown,
    removeSlide,
    removePoint,
    addPoint,
    addSlide,
    resetPlan,
    isPlanModified,
  };
};