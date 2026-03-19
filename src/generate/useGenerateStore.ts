import { create } from "zustand";

type GenerateState = {
    page: string;
    actions: Actions;
}

type Actions = {
    setPage: (page: string) => void;
    clearPage: () => void;
}

const useGenerateStore = create<GenerateState>((set) => ({
    page: "",
    actions: {
        setPage: (page) => set({ page: page }),
        clearPage: () => set({ page: "" })
    }
}));

export const usePage = () => useGenerateStore((state) => state.page);

export const useActions = () => useGenerateStore((state) => state.actions);