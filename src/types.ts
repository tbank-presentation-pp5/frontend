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