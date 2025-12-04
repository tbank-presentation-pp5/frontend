export interface Presentation {
    templatePresentationId: number,
    presentationId: number,
    name: string,
    createdAt: string,
    slides: Slide[]
}

export interface Slide {
    slideId: number,
    templateSlideId: number,
    type: 'MAIN' | 'SECTION' | "TEXT_WITH_IMAGE",
    orderNumber: number,
    content: SlideContent[]
}

export interface SlideContent {
    templateFieldId: number,
    fieldId: number,
    type: 'TEXT' | 'IMAGE',
    key: string,
    value: string,
    image: {
        id: number,
        url: string
    }
}

export type page = "create" | "ai" | "text" | "file";

export type PromptStore = {
  page: page;
  setPage: (page: page) => void;
};

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

export interface PresentationOutlineStore {
  currentOutline: PresentationOutline | null;
  
  outlines: Record<number, PresentationOutline>;

  viewedOutline: PresentationOutline | null;
  
  isLoading: boolean;
  error: string | null;
  
  setCurrentOutline: (outline: PresentationOutline) => void;
  setViewedOutline: (outline: PresentationOutline | null) => void;
  addToHistory: (outline: PresentationOutline) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentOutline: () => void;
  clearViewedOutline: () => void;
  getOutlineById: (id: number) => PresentationOutline | null;
  loadOutlineById: (id: number) => Promise<PresentationOutline | null>;
}

export interface GenerateOutlineRequest {
  numberOfSlides: number;
  shortDescription: string;
}