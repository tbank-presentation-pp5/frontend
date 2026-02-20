import { create } from "zustand";

interface OutlineActions {
	setOutline: (outline: PresentationOutline) => void;
	setPlan: (plan: SlidePlan[]) => void;
	loadOutline: (id: number) => void;
}

interface PresentationOutlineStore {
	currentOutline: PresentationOutline;
	error: string | null;
	actions: OutlineActions;
}

export interface SlidePlan {
	title: string;
	points: string[];
}

export interface PresentationOutline {
	id: number;
	shortDescription: string;
	numberOfSlides: number;
	plan: SlidePlan[];
}

const usePresentationOutlineStore = create<PresentationOutlineStore>()(
	(set) => ({
		currentOutline: {
			id: -1,
			shortDescription: "",
			numberOfSlides: 0,
			plan: [],
		},

		error: null,

		actions: {
			setOutline: (outline) => set({ currentOutline: outline }),

			setPlan: (plan) =>
				set((state) => ({
					currentOutline: { ...state.currentOutline, plan },
				})),

			loadOutline: async (id: number) => {
				try {
					const { getPresentationOutline } = await import(
						"@/services/api/requests"
					);
					const outline = await getPresentationOutline(id);
					set(() => ({
						currentOutline: outline,
					}));

					return outline;
				} catch (error) {
					set({ error: (error as Error).message });
				}
			},
		},
	}),
);

export const useOutline = () =>
	usePresentationOutlineStore((s) => s.currentOutline);

export const useError = () => usePresentationOutlineStore((s) => s.error);

export const useActions = () => usePresentationOutlineStore((s) => s.actions);
