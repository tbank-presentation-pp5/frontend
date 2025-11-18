import { toast } from "sonner";
import { Presentation } from "../types";
import { usePresentationStore } from "@/store/usePresentationStore";

export async function Prompt(prompt: string, router: any) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API}/v1/presentations/generate/note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: prompt, templatePresentationId: 0 }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const presentation = (await response.json()) as Presentation;

    usePresentationStore.getState().setPresentation(presentation);

    router.push(`/dashboard/${presentation.presentationId}`);

    return presentation;
  } catch (error) {
    console.error("Error creating presentation:", error);
    toast.error("Ошибка при создании презентации");
    throw error;
  }
}
