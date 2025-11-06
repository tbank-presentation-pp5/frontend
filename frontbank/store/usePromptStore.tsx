import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type page = "create" | "ai" | "text" | "file";

type PromptStore = {
  page: page;
  setPage: (page: page) => void;
};

export const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: "create",
        setPage: (page: page) => {
          set({ page });
        },
      }),
      { name: "prompts" }
    )
  )
);

