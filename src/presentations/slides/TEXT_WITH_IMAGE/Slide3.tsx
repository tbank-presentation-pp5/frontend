import { getFields } from "../../slideHelper";
import styles from './text-with-image.module.css';
import { EditableText } from "../../editableFields/EditableText";
import { EditableImage } from "../../editableFields/EditableImage";

export const Slide3 = ({ slide }: any) => {
    const fields = getFields(slide.content);
    return (
        <div className={styles.imageSlide}>
            <EditableText
                field={fields.title}
                className={styles.imageTitle}
            />
            <div className={styles.textContainer}>
                <EditableText 
                    field={fields.text}
                    className={styles.textContent}
                />
                {fields.image?.image?.url && (
                    <EditableImage
                        field={fields.image}
                        alt={fields.image?.value}
                        className={styles.image}
                    />
                )}
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};