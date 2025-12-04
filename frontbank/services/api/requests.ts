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

export const downloadPresentationPPTX = async (
  presentationId: number,
  fileName: string = 'presentation.pptx'
): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/presentations/${presentationId}/pptx/download`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Получаем blob из ответа
    const blob = await response.blob();
    
    // Создаем URL для скачивания
    const url = window.URL.createObjectURL(blob);
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = url;
    
    // Используем имя файла из параметра или из store
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s\-_]/g, '_');
    link.download = cleanFileName.endsWith('.pptx') 
      ? cleanFileName 
      : `${cleanFileName}.pptx`;
    
    // Добавляем ссылку на страницу, кликаем по ней и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Освобождаем URL
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error downloading presentation PPTX:', error);
    throw error;
  }
};