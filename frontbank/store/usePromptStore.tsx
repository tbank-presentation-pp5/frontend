import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { PromptStore, page } from "@/services/types"

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

