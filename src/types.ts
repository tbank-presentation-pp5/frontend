export type PlanPrompt = {
  numberOfSlides: number,
  shortDescription: string
}

export type Plan = {
  id: number,
  shortDescription: string,
  numberOfSlides: number,
  plan: PlanSlide[]
}

export type PlanSlide = {
  title: string,
  points?: string[]
}

export type Presentation = {
  templatePresentationId: number,
  presentationId: number,
  name: string,
  createdAt: string,
  slides: Slide[]
}

export type Slide = {
  slideId: number,
  templateSlideId: number,
  type: "MAIN" | "SECTION" | "TEXT_WITH_IMAGE" | "PROS_AND_CONS" | "IMAGE_GRID_5",
  orderNumber: number,
  isNeedPageNumber: boolean,
  content: SlideContent[]
}

export type SlideContent = {
  templateFieldId: number,
  fieldId: number,
  type: "TEXT" | "IMAGE" | "CHART",
  key: string,
  value: string,
  image: {
    id: number,
    url: string
  }
}