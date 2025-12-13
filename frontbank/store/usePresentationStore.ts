import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Slide, Presentation } from "@/services/types";

export interface PresentationStore {
  templatePresentationId: number;
  presentationId: number;
  name: string;
  createdAt: string;
  slides: Slide[];

  presentationsCache: { [id: number]: Presentation };

  updateSlide: (slideId: number, updatedSlide: Partial<Slide>) => void;
  updateContent: (slideId: number, fieldId: number, newValue: string) => void;
  setPresentation: (presentation: Presentation) => void;
  clearPresentation: () => void;

  loadPresentationById: (id: number) => Promise<Presentation | null>;
}

export const usePresentationStore = create<PresentationStore>()(
  persist(
    (set, get) => ({
      templatePresentationId: 0,
      presentationId: 0,
      name: "",
      createdAt: "",
      slides: [],
      presentationsCache: {},

      updateSlide: (slideId: number, updatedSlide: Partial<Slide>) => {
        set((state) => ({
          slides: state.slides.map((slide) =>
            slide.slideId === slideId ? { ...slide, ...updatedSlide } : slide
          ),
        }));
      },

      updateContent: (slideId: number, fieldId: number, newValue: string) => {
        set((state) => ({
          slides: state.slides.map((slide) => {
            if (slide.slideId === slideId) {
              return {
                ...slide,
                content: slide.content.map((field) =>
                  field.fieldId === fieldId
                    ? { ...field, value: newValue }
                    : field
                ),
              };
            }
            return slide;
          }),
        }));
      },

      setPresentation: (presentation: Presentation) => {
        set({ ...presentation });
      },

      clearPresentation: () => {
        set({
          templatePresentationId: 0,
          presentationId: 0,
          name: "",
          createdAt: "",
          slides: [],
        });
      },

      loadPresentationById: async (id: number) => {
        const state = get();
        
        // 1. Проверяем в кэше
        const cachedPresentation = state.presentationsCache[id];
        if (cachedPresentation) {
          set({ 
            presentationId: cachedPresentation.presentationId,
            name: cachedPresentation.name,
            createdAt: cachedPresentation.createdAt,
            slides: cachedPresentation.slides,
            templatePresentationId: cachedPresentation.templatePresentationId,
          });
          return cachedPresentation;
        }
        
        // 2. Если нет в кэше, загружаем с сервера
        try {
          // Динамический импорт, чтобы избежать циклических зависимостей
          const { getPresentationById } = await import('@/services/api/requests');
          const presentation = await getPresentationById(id);
          
          // Сохраняем в кэш и устанавливаем как текущую
          set((state) => ({
            ...presentation,
            presentationsCache: {
              ...state.presentationsCache,
              [presentation.presentationId]: presentation,
            },
          }));
          
          return presentation;
        } catch (error) {
          console.error("Ошибка при загрузке презентации:", error);
          return null;
        }
      },
    }),
    {
      name: "presentation",
    }
  )
);
