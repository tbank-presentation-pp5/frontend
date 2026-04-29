import styles from './main.module.css';

export const Slide5 = ({ slide }: any) => {
    return (
        <div className={styles.gridSlide}>
            <div className={styles.wrapper}>
              {slide.content.map(point => 
                <div key={point} className={styles.imgItem}>
                  <img src={point.image?.url}/>
                </div>
              )}
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};