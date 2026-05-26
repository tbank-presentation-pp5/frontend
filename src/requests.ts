import type { AiImageModelDto, AiModelsResponseDto, NotePrompt, Plan, PlanPrompt, PlanSlide, Presentation, Preview } from "./types"

export async function GeneratePlan(data: PlanPrompt) {
    const response = await fetch(
        `/api/v1/presentation-plans/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    )
    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
    return await response.json() as Plan
}

export async function GetPlan(id: number) {
    const response = await fetch(
        `/api/v1/presentation-plans/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )

    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
    return await response.json() as Plan
}

export async function UpdatePlan(data: PlanSlide[], id: number) {
    const payload = { plan: data }

    const response = await fetch(
        `/api/v1/presentation-plans/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })

    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
}

export async function GeneratePresentationFromPlan(
    templatePresentationId: number = 1,
    planId: number,
    textModel?: string,
    imageModel?: string,
    textModelParams?: Record<string, unknown>,
) {
    const body: Record<string, unknown> = { templatePresentationId, planId }
    if (textModel) body.textModel = textModel
    if (imageModel) body.imageModel = imageModel
    if (textModelParams && Object.keys(textModelParams).length > 0) body.textModelParams = textModelParams

    const response = await fetch(
        `/api/v1/presentations/generate/plan`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    )

    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
    return await response.json() as Presentation
}

export async function GenerateFromNote(data: NotePrompt) {
    const response = await fetch('/api/v1/presentations/generate/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Что-то пошло не так.')
    return await response.json() as Presentation
}

export async function GetPresentation(id: number) {
    const response = await fetch(
        `/api/v1/presentations/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )

    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
    return await response.json() as Presentation
}

export async function GetAiModels() {
    const response = await fetch(`/api/ai/models`, { headers: { "Content-Type": "application/json" } })
    if (!response.ok) throw new Error('Что-то пошло не так.')
    return await response.json() as AiModelsResponseDto
}

export async function GetAiImageModels() {
    const response = await fetch(`/api/ai/models/image`, { headers: { "Content-Type": "application/json" } })
    if (!response.ok) throw new Error('Что-то пошло не так.')
    return await response.json() as AiImageModelDto[]
}

export type AiImageGenerateRequest = {
    prompt: string
    model: string
    width: number
    height: number
}

export async function GenerateAiImage(data: AiImageGenerateRequest): Promise<{ url: string }> {
    const response = await fetch('/api/ai/models/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Ошибка генерации изображения')
    return response.json()
}

export async function GetPreviews(pageNumber: number, pageSize: number) {
    const response = await fetch(
        `/api/v1/presentations/previews?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
        }
    )

    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
    return await response.json() as Preview
}