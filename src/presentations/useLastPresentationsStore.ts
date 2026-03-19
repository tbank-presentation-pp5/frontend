import { create } from "zustand";
import { persist } from "zustand/middleware";

type Presentation = {
  id: number;
  title: string;
  mainSlide: string;
};

type PresentationState = {
  presentations: Presentation[];
  addPresentation: (presentation: Presentation) => void;
};

const MAX_PRESENTATIONS = 4;

const useLastPresentationsStore = create<PresentationState>()(
  persist(
    (set) => ({
      presentations: [],
      addPresentation: (presentation) =>
        set((state) => {
          const deduped = state.presentations.filter(
            (p) => p.id !== presentation.id
          );

          const presentations = [presentation, ...deduped].slice(
            0,
            MAX_PRESENTATIONS
          );

          return { presentations };
        }),
    }),
    {
      name: "presentations-storage",
    }
  )
);

export const usePresentations = () =>
  useLastPresentationsStore((state) => state.presentations);

export const useAddPresentation = () =>
  useLastPresentationsStore((state) => state.addPresentation);