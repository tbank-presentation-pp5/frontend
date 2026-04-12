import { getFields } from "../../slideHelper";

export const Slide3 = ({ slide, styles }: any) => {
    const f = getFields(slide.content);
    return (
        <div className={styles.imageSlide}>
            <div className={styles.imageTitle}>
                {f.title?.value}
            </div>
            <div className={styles.textContainer}>
                <div className={styles.textContent}>
                    {f.text?.value}
                </div>
                {f.image?.image?.url && (
                    <img 
                        src={f.image.image.url} 
                        alt={f.title?.value} 
                    />
                )}
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};