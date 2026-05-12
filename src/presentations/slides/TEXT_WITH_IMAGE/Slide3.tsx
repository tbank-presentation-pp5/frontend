import { getFields } from "../../slideHelper";
import styles from './text-with-image.module.css';
import { EditableText } from "../EditableText";
import { EditableImage } from "../EditableImage";

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
                    <img 
                        src={fields.image.image.url} 
                        alt={fields.title?.value} 
                    />
                )}
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};