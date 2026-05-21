import styles from './grids.module.css';
import { getFields } from "../../slideHelper";
import { EditableImage } from "../../editableFields/EditableImage";

export const Slide5 = ({ slide }: any) => {
    const fields = getFields(slide.content);
    return (
        <div className={styles.gridSlide}>
            <div className={styles.wrapper}>
              {Object.values(fields).map((point: any) => 
                <div key={point.fieldId} className={styles.imgItem}>
                  <EditableImage 
                    field={point} 
                    alt={point.value}
                    className={styles.editableImage} 
                  />
                </div>
              )}
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};