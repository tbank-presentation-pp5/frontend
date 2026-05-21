import { useState } from "react";
import { useEditableImageField } from "../../ws/useEditableImageField";
import styles from './editable-image.module.css'
import { PexelsModal } from "./PexelsModal";

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

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/v1/images',
            {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            setImage(data.id);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className={styles.editableImage}>
            <img
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
                    <img src='../upload.png' alt="Upload" className={styles.icon}/>
                </label>

                <button
                    type='button'
                    className={styles.editableImageButton}
                    onClick={() => setShowPexels(true)}>
                    <img src='../pexels_logo.svg' alt="Upload" className={styles.icon}/>
                </button>

                {showPexels && (
                    <PexelsModal
                        initialQuery={alt}
                        onClose={() => setShowPexels(false)}
                        onSelect={(pexelsId) => {
                            setPexelsImage(pexelsId)
                            setShowPexels(false)
                        }}
                    />
                )}
            </div>
    </div>
);
};