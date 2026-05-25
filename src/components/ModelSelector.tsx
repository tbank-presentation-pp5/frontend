import { useState, useEffect, useRef } from "react"
import type { AiImageModelDto, AiModelDto, AiModelParamInfoDto } from "../types"
import { GetAiImageModels, GetAiModels } from "../requests"
import styles from "./model-selector.module.css"

// Только полезные параметры
const DISPLAY_PARAMS = new Set([
    "TEMPERATURE", "TOP_P", "TOP_K", "REPETITION_PENALTY",
    "FREQUENCY_PENALTY", "PRESENCE_PENALTY", "MAX_COMPLETION_TOKENS",
    "REASONING_EFFORT", "CHAT_TEMPLATE_KWARGS",
])

const SIMPLE_PARAMS = new Set(["REASONING_EFFORT", "CHAT_TEMPLATE_KWARGS"])

const VALUE_LABELS: Record<string, Record<string, string>> = {
    CHAT_TEMPLATE_KWARGS: {
        "{'enable_thinking': true}": "Thinking ВКЛ",
        "{'enable_thinking': false}": "Thinking ВЫКЛ",
    },
}

const PARAM_DISPLAY_NAMES: Record<string, string> = {
    CHAT_TEMPLATE_KWARGS: "Режим рассуждений",
    REASONING_EFFORT: "Effort",
    TEMPERATURE: "Temperature",
    TOP_P: "Top P",
    TOP_K: "Top K",
    REPETITION_PENALTY: "Repetition penalty",
    FREQUENCY_PENALTY: "Frequency penalty",
    PRESENCE_PENALTY: "Presence penalty",
    MAX_COMPLETION_TOKENS: "Max tokens",
}

export type ModelSelectorValue = {
    textModel: string
    imageModel: string
    modelParams: Record<string, unknown>
}

export type ModelSelectorProps = {
    showImageModel?: boolean
    direction?: "up" | "down"
    onChange: (val: ModelSelectorValue) => void
}

type ParamRowProps = {
    def: AiModelParamInfoDto
    value: unknown
    changed: boolean
    onChange: (v: unknown) => void
}

function ParamRow({ def, value, changed, onChange }: ParamRowProps) {
    const label = PARAM_DISPLAY_NAMES[def.name] ?? def.name

    if (def.possibleValues && def.possibleValues.length > 0) {
        const labels = VALUE_LABELS[def.name] ?? {}
        return (
            <div className={styles.paramRow}>
                <label className={styles.paramLabel}>
                    {label}
                    {changed && <span className={styles.changedDot} />}
                </label>
                <div className={styles.segmented}>
                    {def.possibleValues.map(v => (
                        <button
                            key={v}
                            type="button"
                            className={`${styles.segBtn} ${value === v ? styles.segBtnActive : ""}`}
                            onClick={() => onChange(v)}
                        >
                            {labels[v] ?? v}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (def.type === "BOOLEAN") {
        const checked = Boolean(value)
        return (
            <div className={styles.paramRow}>
                <label className={styles.paramLabel}>
                    {label}
                    {changed && <span className={styles.changedDot} />}
                </label>
                <button
                    type="button"
                    className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
                    onClick={() => onChange(!checked)}
                >
                    <span
                        className={styles.toggleThumb}
                        style={{ left: checked ? "calc(100% - 21px)" : "3px" }}
                    />
                </button>
            </div>
        )
    }

    if (def.type === "NUMBER") {
        const min = def.min ?? 0
        const max = def.max ?? 2
        const num = typeof value === "number" ? value : Number(value ?? min)
        return (
            <div className={styles.paramRowVertical}>
                <div className={styles.paramRowHeader}>
                    <label className={styles.paramLabel}>
                        {label}
                        {changed && <span className={styles.changedDot} />}
                    </label>
                    <span className={styles.paramValue}>{num.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    className={styles.slider}
                    min={min}
                    max={max}
                    step={0.01}
                    value={num}
                    onChange={e => onChange(Number(e.target.value))}
                />
            </div>
        )
    }

    if (def.type === "INTEGER") {
        const num = typeof value === "number" ? value : Number(value ?? 0)
        return (
            <div className={styles.paramRow}>
                <label className={styles.paramLabel}>
                    {label}
                    {changed && <span className={styles.changedDot} />}
                </label>
                <input
                    type="number"
                    className={styles.paramInput}
                    value={num}
                    min={def.min ?? undefined}
                    max={def.max ?? undefined}
                    onChange={e => onChange(Number(e.target.value))}
                />
            </div>
        )
    }

    return null
}

export function ModelSelector({ showImageModel = true, direction = "up", onChange }: ModelSelectorProps) {
    const [textModels, setTextModels] = useState<AiModelDto[]>([])
    const [imageModels, setImageModels] = useState<AiImageModelDto[]>([])
    const [paramDefs, setParamDefs] = useState<AiModelParamInfoDto[]>([])
    const [selectedTextModel, setSelectedTextModel] = useState("")
    const [selectedImageModel, setSelectedImageModel] = useState("")
    const [modelParams, setModelParams] = useState<Record<string, unknown>>({})
    const [loading, setLoading] = useState(true)
    const [showSettings, setShowSettings] = useState(false)
    const [showTextMenu, setShowTextMenu] = useState(false)
    const [showImageMenu, setShowImageMenu] = useState(false)

    const settingsRef = useRef<HTMLDivElement>(null)
    const textModelRef = useRef<HTMLDivElement>(null)
    const imageModelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        Promise.all([GetAiModels(), GetAiImageModels()])
            .then(([modelsData, imgModels]) => {
                setTextModels(modelsData.models)
                setParamDefs(modelsData.paramDefs)
                setImageModels(imgModels)
                if (modelsData.models.length > 0) {
                    const first = modelsData.models[0].enumName
                    setSelectedTextModel(first)
                    onChange({ textModel: first, imageModel: imgModels[0]?.enumName ?? "", modelParams: {} })
                }
                if (imgModels.length > 0) setSelectedImageModel(imgModels[0].enumName)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node))
                setShowSettings(false)
            if (textModelRef.current && !textModelRef.current.contains(e.target as Node))
                setShowTextMenu(false)
            if (imageModelRef.current && !imageModelRef.current.contains(e.target as Node))
                setShowImageMenu(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const selectTextModel = (enumName: string) => {
        setSelectedTextModel(enumName)
        setShowTextMenu(false)
        const params = {}
        setModelParams(params)
        onChange({ textModel: enumName, imageModel: selectedImageModel, modelParams: params })
    }

    const selectImageModel = (enumName: string) => {
        setSelectedImageModel(enumName)
        setShowImageMenu(false)
        onChange({ textModel: selectedTextModel, imageModel: enumName, modelParams })
    }

    const setParam = (paramName: string, val: unknown) => {
        const next = { ...modelParams, [paramName]: val }
        setModelParams(next)
        onChange({ textModel: selectedTextModel, imageModel: selectedImageModel, modelParams: next })
    }

    const resetParams = () => {
        setModelParams({})
        onChange({ textModel: selectedTextModel, imageModel: selectedImageModel, modelParams: {} })
    }

    const selectedModel = textModels.find(m => m.enumName === selectedTextModel)
    const getDisplayValue = (paramName: string): unknown =>
        paramName in modelParams
            ? modelParams[paramName]
            : selectedModel?.params.find(p => p.name === paramName)?.defaultValue

    const currentParamDefs = paramDefs.filter(def =>
        DISPLAY_PARAMS.has(def.name) &&
        selectedModel?.params.some(p => p.name === def.name)
    )
    const simpleParams = currentParamDefs.filter(d => SIMPLE_PARAMS.has(d.name))
    const advancedParams = currentParamDefs.filter(d => !SIMPLE_PARAMS.has(d.name))
    const changedCount = Object.keys(modelParams).length

    const textLabel = textModels.find(m => m.enumName === selectedTextModel)?.displayName ?? "Текстовая модель"
    const imageLabel = imageModels.find(m => m.enumName === selectedImageModel)?.displayName ?? "Изображения"

    if (loading) return null

    const menuClass = direction === "down" ? styles.dropdownMenuDown : styles.dropdownMenu
    const popoverClass = direction === "down" ? styles.settingsPopoverDown : styles.settingsPopover

    return (
        <div className={styles.row}>
            {/* Текстовая модель */}
            {textModels.length > 0 && (
                <div className={styles.dropdown} ref={textModelRef}>
                    <button
                        type="button"
                        className={styles.modelBtn}
                        onClick={() => { setShowTextMenu(v => !v); setShowImageMenu(false); setShowSettings(false) }}
                    >
                        <span className={styles.modelIcon}>T</span>
                        <span className={styles.modelBtnLabel}>{textLabel}</span>
                        <span className={styles.chevron}>▾</span>
                    </button>
                    {showTextMenu && (
                        <div className={menuClass}>
                            {textModels.map(m => (
                                <button
                                    key={m.enumName}
                                    type="button"
                                    className={`${styles.dropdownItem} ${m.enumName === selectedTextModel ? styles.dropdownItemActive : ""}`}
                                    onClick={() => selectTextModel(m.enumName)}
                                >
                                    {m.displayName}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Модель изображений */}
            {showImageModel && imageModels.length > 0 && (
                <div className={styles.dropdown} ref={imageModelRef}>
                    <button
                        type="button"
                        className={styles.modelBtn}
                        onClick={() => { setShowImageMenu(v => !v); setShowTextMenu(false); setShowSettings(false) }}
                    >
                        <span className={styles.modelIcon}>I</span>
                        <span className={styles.modelBtnLabel}>{imageLabel}</span>
                        <span className={styles.chevron}>▾</span>
                    </button>
                    {showImageMenu && (
                        <div className={menuClass}>
                            {imageModels.map(m => (
                                <button
                                    key={m.enumName}
                                    type="button"
                                    className={`${styles.dropdownItem} ${m.enumName === selectedImageModel ? styles.dropdownItemActive : ""}`}
                                    onClick={() => selectImageModel(m.enumName)}
                                >
                                    {m.displayName}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Параметры */}
            {currentParamDefs.length > 0 && (
                <div className={styles.settingsWrap} ref={settingsRef}>
                    <button
                        type="button"
                        className={`${styles.gearBtn} ${showSettings ? styles.gearBtnActive : ""}`}
                        title="Параметры модели"
                        onClick={() => { setShowSettings(v => !v); setShowTextMenu(false); setShowImageMenu(false) }}
                    >
                        ⚙{changedCount > 0 && <span className={styles.gearBadge}>{changedCount}</span>}
                    </button>
                    {showSettings && (
                        <div className={popoverClass}>
                            <div className={styles.popoverHeader}>
                                Параметры модели
                                <div className={styles.popoverHeaderActions}>
                                    {changedCount > 0 && (
                                        <button type="button" className={styles.resetBtn} onClick={resetParams}>
                                            Сбросить
                                        </button>
                                    )}
                                    <button type="button" className={styles.popoverCloseBtn} onClick={() => setShowSettings(false)}>
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {simpleParams.length > 0 && (
                                <div className={styles.paramSection}>
                                    <div className={styles.sectionLabel}>Быстрые настройки</div>
                                    {simpleParams.map(def => (
                                        <ParamRow key={def.name} def={def} value={getDisplayValue(def.name)} changed={def.name in modelParams} onChange={v => setParam(def.name, v)} />
                                    ))}
                                </div>
                            )}

                            {advancedParams.length > 0 && (
                                <div className={styles.paramSection}>
                                    {simpleParams.length > 0 && <div className={styles.sectionLabel}>Дополнительно</div>}
                                    {advancedParams.map(def => (
                                        <ParamRow key={def.name} def={def} value={getDisplayValue(def.name)} changed={def.name in modelParams} onChange={v => setParam(def.name, v)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
