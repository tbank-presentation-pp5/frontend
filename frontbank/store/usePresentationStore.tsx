import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Slide, Presentation } from "@/services/types";

export interface PresentationStore {
  templatePresentationId: number;
  presentationId: number;
  name: string;
  createdAt: string;
  slides: Slide[];
  updateSlide: (slideId: number, updatedSlide: Partial<Slide>) => void;
  updateContent: (slideId: number, fieldId: number, newValue: string) => void;
  setPresentation: (presentation: Presentation) => void;
  clearPresentation: () => void;
}

export const usePresentationStore = create<PresentationStore>((set) => ({
  templatePresentationId: 0,
  presentationId: 0,
  name: "",
  createdAt: "",
  slides: [],

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
              field.fieldId === fieldId ? { ...field, value: newValue } : field
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
}));
