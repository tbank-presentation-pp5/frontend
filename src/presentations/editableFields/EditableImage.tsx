import { useState, useRef } from "react";
import { useEditableImageField } from "../../ws/useEditableImageField";
import styles from './editable-image.module.css'
import { PexelsModal } from "./PexelsModal";
import { AiImageModal } from "./AiImageModal";

interface EditableImageProps {
    field: {
        fieldId: number;
        image?: {
            url: string;
        };
    };
    alt: string;
    className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
    field,
    alt,
    className,
}) => {
    const [showPexels, setShowPexels] = useState(false);
    const [showAi, setShowAi] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const {
        imageUrl,
        setImage,
        setPexelsImage,
        isPending,
        hasError
    } = useEditableImageField(
        field.fieldId,
        field.image?.url ?? ''
    );

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch('/api/v1/images', { method: 'POST', body: formData });
            const data = await response.json();
            setImage(data.id);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const naturalWidth = imgRef.current?.naturalWidth ?? 704;
    const naturalHeight = imgRef.current?.naturalHeight ?? 528;

    return (
        <div className={styles.editableImage}>
            <img
                ref={imgRef}
                src={imageUrl}
                alt={alt}
                className={className}
                style={{
                    opacity: isPending ? 0.5 : 1,
                    border: hasError ? "1px solid red" : "none",
                }}
            />

            <input
                id={`image-upload-${field.fieldId}`}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.editableImageInput}
            />

            <div className={styles.editableImageOverlay}>
                <label
                    htmlFor={`image-upload-${field.fieldId}`}
                    className={styles.editableImageButton}
                >
                    <img src='../upload.png' alt="Upload" className={styles.icon} />
                </label>

                <button
                    type='button'
                    className={styles.editableImageButton}
                    onClick={() => { setShowPexels(true); setShowAi(false); }}
                >
                    <img src='../pexels_logo.svg' alt="Pexels" className={styles.icon} />
                </button>

                <button
                    type='button'
                    className={styles.editableImageButton}
                    onClick={() => { setShowAi(true); setShowPexels(false); }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
                    </svg>
                </button>

                {showPexels && (
                    <PexelsModal
                        initialQuery={alt}
                        onClose={() => setShowPexels(false)}
                        onSelect={(pexelsId) => {
                            setPexelsImage(pexelsId);
                            setShowPexels(false);
                        }}
                    />
                )}

                {showAi && (
                    <AiImageModal
                        initialPrompt={alt}
                        initialWidth={naturalWidth}
                        initialHeight={naturalHeight}
                        onApply={(imageId) => {
                            setImage(imageId);
                            setShowAi(false);
                        }}
                        onClose={() => setShowAi(false)}
                    />
                )}
            </div>
        </div>
    );
};
