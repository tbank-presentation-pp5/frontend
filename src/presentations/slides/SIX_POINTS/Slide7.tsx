import { getFields } from "../../slideHelper";
import styles from './six-points.module.css';
import { EditableText } from "../EditableText";

export const Slide7 = ({ slide }: any) => {
    const f = getFields(slide.content);
    const points = [1, 2, 3, 4, 5, 6];
    return (
        <div className={styles.sixPoints}>
            <EditableText
                field={f.title}
                className={styles.title} 
            />
            <div className={styles.sixPointsGrid}>
                {points.map(num => {
                    const subtitle = f[`point_${num}_subtitle`];
                    const text = f[`point_${num}_text`];

                    if (!subtitle) return null;

                    return (
                        <div key={num} className={styles.pointItem}>
                            <EditableText field={subtitle} className={styles.pointTitle}/>
                            <EditableText field={text} className={styles.pointText}/>
                        </div>
                    );
                })}
            </div>
            <div className={styles.image}>
                <img src="/six_points_brain.png" alt="brain" />
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};