import { useState, useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Helmet } from "react-helmet"
import { FadeLoader } from "react-spinners"
import type { PlanPrompt } from "../types"
import { GeneratePlan } from "../requests"
import { ModelSelector, type ModelSelectorValue } from "../components/ModelSelector"
import styles from "./generate.module.css"

function Zero() {
    const navigate = useNavigate()

    const [description, setDescription] = useState("")
    const [numberOfSlides, setNumberOfSlides] = useState(10)

    // Хранится в ref — обновляется ModelSelector без ре-рендера формы
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

    const mutation = useMutation({
        mutationFn: (data: PlanPrompt) => GeneratePlan(data),
        onSuccess: data => {
            navigate(`/plans/${data.id}`)
        },
    })

    const handleSubmit = () => {
        if (!description.trim() || mutation.isPending) return
        const { textModel, modelParams } = modelSelectionRef.current
        const payload: PlanPrompt = { shortDescription: description, numberOfSlides }
        if (textModel) payload.model = textModel
        if (Object.keys(modelParams).length > 0) payload.modelParams = modelParams
        mutation.mutate(payload)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleSubmit()
        }
    }

    if (mutation.isPending) {
        return <div className={styles.loader}><FadeLoader color="#6F7071" /></div>
    }

    return (
        <div className={styles.mainContainer}>
            <Helmet><title>Создание по промпту</title></Helmet>

            <div className={styles.flex}>
                <img src="/public/AI.png" />
                <h1>Генерируем</h1>
            </div>
            <p>О чем будет ваша презентация?</p>

            <form className={styles.promptForm} onSubmit={e => { e.preventDefault(); handleSubmit() }}>
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
                        placeholder="Опишите презентацию..."
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
                    showImageModel={false}
                    direction="down"
                    onChange={val => { modelSelectionRef.current = val }}
                />

                {mutation.isError && <span>{mutation.error.message}</span>}
            </form>
        </div>
    )
}

export default Zero
