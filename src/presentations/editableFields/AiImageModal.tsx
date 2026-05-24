import { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import { GetAiImageModels, GenerateAiImage } from "../../requests";
import type { AiImageModelDto } from "../../types";
import styles from "./editable-image.module.css";

interface AiImageModalProps {
    initialPrompt: string;
    initialWidth: number;
    initialHeight: number;
    onApply: (imageId: number) => void;
    onClose: () => void;
}

export const AiImageModal: React.FC<AiImageModalProps> = ({
    initialPrompt,
    initialWidth,
    initialHeight,
    onApply,
    onClose,
}) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [models, setModels] = useState<AiImageModelDto[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [width, setWidth] = useState(initialWidth || 704);
    const [height, setHeight] = useState(initialHeight || 528);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        GetAiImageModels().then((list) => {
            setModels(list);
            if (list.length > 0) setSelectedModel(list[0].enumName);
        });
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim() || !selectedModel) return;
        setIsGenerating(true);
        setError(null);
        setGeneratedUrl(null);
        try {
            const result = await GenerateAiImage({ prompt, model: selectedModel, width, height });
            setGeneratedUrl(result.url);
        } catch {
            setError("Ошибка генерации. Попробуйте ещё раз.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = async () => {
        if (!generatedUrl) return;
        setIsApplying(true);
        setError(null);
        try {
            const blob = await fetch(generatedUrl).then((r) => r.blob());
            const form = new FormData();
            form.append("image", blob, "generated.jpg");
            const resp = await fetch("/api/v1/images", { method: "POST", body: form });
            if (!resp.ok) throw new Error();
            const data = await resp.json();
            onApply(data.id);
        } catch {
            setError("Ошибка применения. Попробуйте ещё раз.");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className={styles.aiModal}>
            <div className={styles.aiModalHeader}>
                <span className={styles.aiModalTitle}>AI Генерация изображений</span>
                <button onClick={onClose} className={styles.aiCloseBtn}>
                    <img style={{ width: 12, height: 12 }} src="../close.svg" />
                </button>
            </div>

            <textarea
                className={styles.aiPrompt}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Опишите изображение..."
            />

            <div className={styles.aiControls}>
                <select
                    className={styles.aiSelect}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    {models.map((m) => (
                        <option key={m.enumName} value={m.enumName}>
                            {m.displayName}
                        </option>
                    ))}
                </select>

                <div className={styles.aiDimensions}>
                    <input
                        type="number"
                        className={styles.aiDimInput}
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        placeholder="W"
                    />
                    <span className={styles.aiDimSep}>×</span>
                    <input
                        type="number"
                        className={styles.aiDimInput}
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        placeholder="H"
                    />
                </div>
            </div>

            <button
                className={styles.aiGenerateBtn}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
            >
                {isGenerating ? <PropagateLoader color="#333" size={8} /> : "Сгенерировать"}
            </button>

            {error && <p className={styles.aiError}>{error}</p>}

            {generatedUrl && !isGenerating && (
                <div className={styles.aiPreview}>
                    <img src={generatedUrl} alt="AI generated" className={styles.aiPreviewImg} />
                    <button
                        className={styles.aiApplyBtn}
                        onClick={handleApply}
                        disabled={isApplying}
                    >
                        {isApplying ? "Применяю..." : "Применить"}
                    </button>
                </div>
            )}
        </div>
    );
};
