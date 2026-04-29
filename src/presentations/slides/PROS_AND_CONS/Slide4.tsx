import { getFields } from "../../slideHelper";
import styles from './pros-and-cons.module.css';

export const Slide4 = ({ slide }: any) => {
  const f = getFields(slide.content);
  return (
    <div className={styles.sectionSlide}>
      <div className={styles.prosConsLeft}><h1>{f.title?.value}</h1></div>
      <div className={styles.prosConsRight}>
        <div>
          <div className={styles.prosConsIcon}><img src="/pros.png" /> {f.pros_title?.value}</div>
          <div className={styles.prosConsText}>{f.pros_text?.value}</div>
        </div>
        <div>
          <div className={styles.prosConsIcon}><img src="/cons.png" /> {f.cons_title?.value}</div>
          <div className={styles.prosConsText}>{f.cons_text?.value}</div>
        </div>
      </div>
      {slide.isNeedPageNumber && <div className={styles.pageNumberPros}>{slide.orderNumber}</div>}
    </div>
  );
};