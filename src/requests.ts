import type { Plan, PlanPrompt, PlanSlide, Presentation } from "./types"

export async function GeneratePlan(data: PlanPrompt) {
    const response = await fetch(
        `http://localhost:8080/api/v1/presentation-plans/generate`,
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
        `http://localhost:8080/api/v1/presentation-plans/${id}`,
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
        `http://localhost:8080/api/v1/presentation-plans/${id}`,
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

export async function GeneratePresentationFromPlan(templatePresentationId: number = 1, planId: number) {
    const response = await fetch(
        `http://localhost:8080/api/v1/presentations/generate/plan`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ templatePresentationId, planId })
        }
    )

    if (!response.ok) {
        throw new Error('Что-то пошло не так.')
    }
    return await response.json() as Presentation
}

export async function GetPresentation(id: number) {
    const response = await fetch(
        `http://localhost:8080/api/v1/presentations/${id}`,
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