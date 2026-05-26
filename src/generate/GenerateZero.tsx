import { useState, useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Helmet } from "react-helmet"
import { FadeLoader } from "react-spinners"
import type { NotePrompt, PlanPrompt } from "../types"
import { GenerateFromNote, GeneratePlan } from "../requests"
import { ModelSelector, type ModelSelectorValue } from "../components/ModelSelector"
import styles from "./generate.module.css"

type Mode = "plan" | "note"

function Zero() {
    const navigate = useNavigate()

    const [mode, setMode] = useState<Mode>("plan")
    const [description, setDescription] = useState("")
    const [numberOfSlides, setNumberOfSlides] = useState(10)

    const modelSelectionRef = useRef<ModelSelectorValue>({
        textModel: "",
        imageModel: "",
        modelParams: {},
    })

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const ta = textareaRef.current
        if (!ta) return
        ta.style.height = "auto"
        ta.style.height = `${ta.scrollHeight}px`
    }, [description])

    const planMutation = useMutation({
        mutationFn: (data: PlanPrompt) => GeneratePlan(data),
        onSuccess: data => navigate(`/plans/${data.id}`),
    })

    const noteMutation = useMutation({
        mutationFn: (data: NotePrompt) => GenerateFromNote(data),
        onSuccess: data => navigate(`/presentations/${data.presentationId}`),
    })

    const isPending = planMutation.isPending || noteMutation.isPending
    const isError = planMutation.isError || noteMutation.isError
    const errorMessage = planMutation.error?.message ?? noteMutation.error?.message

    const handleSubmit = () => {
        if (!description.trim() || isPending) return
        const { textModel, imageModel, modelParams } = modelSelectionRef.current
        const params = Object.keys(modelParams).length > 0 ? modelParams : undefined

        if (mode === "plan") {
            const payload: PlanPrompt = { shortDescription: description, numberOfSlides }
            if (textModel) payload.model = textModel
            if (params) payload.modelParams = params
            planMutation.mutate(payload)
        } else {
            const payload: NotePrompt = { note: description, numberOfSlides, templatePresentationId: 1 }
            if (textModel) payload.textModel = textModel
            if (imageModel) payload.imageModel = imageModel
            if (params) payload.textModelParams = params
            noteMutation.mutate(payload)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleSubmit()
        }
    }

    if (isPending) {
        return <div className={styles.loader}><FadeLoader color="#6F7071" /></div>
    }

    return (
        <div className={styles.mainContainer}>
            <Helmet><title>Создание по промпту</title></Helmet>

            <div className={styles.flex}>
                <img src="/AI.png" />
                <h1>Генерируем</h1>
            </div>
            <p>О чем будет ваша презентация?</p>

            <form className={styles.promptForm} onSubmit={e => { e.preventDefault(); handleSubmit() }}>

                {/* Mode switcher */}
                <div className={styles.segmented} style={{ alignSelf: 'flex-start' }}>
                    <button
                        type="button"
                        className={`${styles.segBtn} ${mode === "plan" ? styles.segBtnActive : ""}`}
                        onClick={() => setMode("plan")}
                    >
                        По плану
                    </button>
                    <button
                        type="button"
                        className={`${styles.segBtn} ${mode === "note" ? styles.segBtnActive : ""}`}
                        onClick={() => setMode("note")}
                    >
                        По тексту
                    </button>
                </div>

                <div className={styles.flex}>
                    <span>Cлайдов:</span>
                    <input
                        type="number"
                        placeholder="Количество слайдов"
                        value={numberOfSlides}
                        min={1}
                        max={50}
                        onChange={e => setNumberOfSlides(Math.max(1, Math.min(50, Number(e.target.value))))}
                    />
                </div>

                <div className={styles.promptRow}>
                    <textarea
                        ref={textareaRef}
                        className={styles.promptTextarea}
                        placeholder={mode === "plan" ? "Опишите тему презентации..." : "Вставьте текст или заметки..."}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button type="submit" className={styles.sendBtn} disabled={!description.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                    </button>
                </div>

                <ModelSelector
                    showImageModel={mode === "note"}
                    direction="down"
                    onChange={val => { modelSelectionRef.current = val }}
                />

                {isError && <span>{errorMessage}</span>}
            </form>
        </div>
    )
}

export default Zero
