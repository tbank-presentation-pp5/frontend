import { toast } from "sonner";
import { GenerateOutlineRequest, Presentation, PresentationOutline } from "../types";
import { usePresentationStore } from "@/store/usePresentationStore";


export async function Prompt(prompt: string, router: any, slides: number) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/presentations/generate/note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: prompt, templatePresentationId: 1, numberOfSlides: slides }),
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

export const generatePresentationOutline = async (
  data: GenerateOutlineRequest
): Promise<PresentationOutline> => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/presentation-plans/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating presentation outline:', error);
    throw error;
  }
};

export const getPresentationOutline = async (id: number): Promise<PresentationOutline> => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/presentation-plans/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('План презентации не найден');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching presentation outline:', error);
    throw error;
  }
};

export const generatePresentationFromPlan = async (
  planId: number,
  templatePresentationId: number = 1
): Promise<Presentation> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/presentations/generate/plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          templatePresentationId, 
          planId 
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const presentation = await response.json();
    return presentation;
  } catch (error) {
    console.error("Error generating presentation from plan:", error);
    throw error;
  }
};