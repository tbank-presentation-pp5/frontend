export type PlanPrompt = {
  numberOfSlides: number
  shortDescription: string
  model?: string
  modelParams?: Record<string, unknown>
}

export type NotePrompt = {
  note: string
  numberOfSlides: number
  templatePresentationId?: number
  textModel?: string
  imageModel?: string
  textModelParams?: Record<string, unknown>
}

export type AiModelParamValueDto = {
  name: string
  defaultValue: unknown
  possibleValues: string[] | null
}

export type AiModelDto = {
  enumName: string
  modelId: string
  displayName: string
  apiStyle: string
  params: AiModelParamValueDto[]
}

export type AiModelParamInfoDto = {
  name: string
  jsonKey: string
  description: string
  type: string
  min: number | null
  max: number | null
  specDefault: unknown
  possibleValues: string[] | null
}

export type AiModelsResponseDto = {
  models: AiModelDto[]
  paramDefs: AiModelParamInfoDto[]
}

export type AiImageModelDto = {
  enumName: string
  modelId: string
  displayName: string
  apiStyle: string
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
  createdAt: Date,
  slides: Slide[]
}

export type Preview = {
  elements:
    {
      presentationId: number,
      name: string,
      updatedAt: number,
      previewUrls: string[]
    }[],
  totalElements: number // total pages
}

export type Slide = {
  slideId: number,
  templateSlideId: number,
  type: "MAIN" | "SECTION" | "TEXT_WITH_IMAGE" | "PROS_AND_CONS" | "IMAGE_GRID_5" | "SIX_POINTS",
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