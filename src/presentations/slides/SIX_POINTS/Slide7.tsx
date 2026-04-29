import { getFields } from "../../slideHelper";
import styles from './six-points.module.css';

export const Slide7 = ({ slide }: any) => {
    const f = getFields(slide.content);
    const points = [1, 2, 3, 4, 5, 6];
    return (
        <div className={styles.sixPoints}>
            <h1>{f.title?.value}</h1>
            <div className={styles.sixPointsGrid}>
                {points.map(num => {
                    const subtitle = f[`point_${num}_subtitle`]?.value;
                    const text = f[`point_${num}_text`]?.value;

                    if (!subtitle) return null;

                    return (
                        <div key={num} className={styles.pointItem}>
                            <h2 className={styles.pointTitle}>{subtitle}</h2>
                            <p className={styles.pointText}>{text}</p>
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