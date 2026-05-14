import { getFields } from "../../slideHelper";
import styles from './pros-and-cons.module.css';
import { EditableText } from "../../editableFields/EditableText";

export const Slide4 = ({ slide }: any) => {
  const fields = getFields(slide.content);
  return (
    <div className={styles.sectionSlide}>
      <div className={styles.prosConsLeft}>
        <EditableText 
          field={fields.title}
          className={styles.title}
        />
      </div>
      <div className={styles.prosConsRight}>
        <div>
          <div className={styles.prosConsIcon}>
            <img src="/pros.png" />
            <EditableText field={fields.pros_title} className={styles.prosConsIcon} />
          </div>
          <EditableText 
              field={fields.pros_text}
              className={styles.prosConsText}
            />
        </div>
        <div>
          <div className={styles.prosConsIcon}>
            <img src="/cons.png" />
            <EditableText field={fields.cons_title} className={styles.prosConsIcon} />
          </div>
          <EditableText 
              field={fields.cons_text}
              className={styles.prosConsText}
            />
        </div>
      </div>
      {slide.isNeedPageNumber && <div className={styles.pageNumberPros}>{slide.orderNumber}</div>}
    </div>
  );
};