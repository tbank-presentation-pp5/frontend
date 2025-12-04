import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PresentationOutlineStore } from "@/services/types";

export const usePresentationOutlineStore = create<PresentationOutlineStore>()(
  persist(
    (set, get) => ({
      currentOutline: null,
      outlines: {},
      viewedOutline: null,
      isLoading: false,
      error: null,
      
      setCurrentOutline: (outline) => 
        set((state) => ({ 
          currentOutline: outline,
          outlines: { ...state.outlines, [outline.id]: outline }
        })),
      
      setViewedOutline: (outline) => set({ viewedOutline: outline }),
      
      addToHistory: (outline) =>
        set((state) => ({
          outlines: { ...state.outlines, [outline.id]: outline }
        })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearCurrentOutline: () => set({ currentOutline: null }),
      
      clearViewedOutline: () => set({ viewedOutline: null }),
      
      getOutlineById: (id) => {
        const state = get();
        return state.outlines[id] || null;
      },
      
      loadOutlineById: async (id: number) => {
        const state = get();
        
        // 1. Проверяем в кэше (истории)
        const cachedOutline = state.outlines[id];
        if (cachedOutline) {
          set({ viewedOutline: cachedOutline });
          return cachedOutline;
        }
        
        // 2. Если нет в кэше, загружаем с сервера
        set({ isLoading: true, error: null });
        
        try {
          // Импортируем функцию динамически, чтобы избежать циклических зависимостей
          const { getPresentationOutline } = await import('@/services/api/requests');
          const outline = await getPresentationOutline(id);
          
          // Сохраняем в историю и устанавливаем как viewed
          set((state) => ({
            viewedOutline: outline,
            outlines: { ...state.outlines, [outline.id]: outline },
            isLoading: false
          }));
          
          return outline;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки';
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },
    }),
    {
      name: 'presentation-outline-storage',
      partialize: (state) => ({ 
        outlines: state.outlines,
        currentOutline: state.currentOutline
      }),
    }
  )
);