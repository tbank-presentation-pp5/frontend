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
                    const newPresentations = [...state.presentations, presentation];

                    if (newPresentations.length > MAX_PRESENTATIONS) {
                        newPresentations.shift();
                    }

                    return { presentations: newPresentations };
                }),
        }),

        {
            name: "presentations-storage",
        })

);

export const usePresentations = () => useLastPresentationsStore((state) => state.presentations);
export const useAddPresentation = () => useLastPresentationsStore((state) => state.addPresentation);