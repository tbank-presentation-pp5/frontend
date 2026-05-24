import { getFields } from "../../slideHelper";
import styles from './section.module.css';
import { EditableText } from "../../editableFields/EditableText";

export const Slide2 = ({ slide }: any) => {
  const fields = getFields(slide.content);
  return (
    <div className={styles.sectionSlide}>
      <div className={styles.sectionLeft}>
        <img src="/tbank.png" alt="logo" className={styles.logo} />
      </div>
      <div className={styles.sectionRight}>
        <EditableText
          field={fields.section_title}
          className={styles.sectionTitle}
        />
      </div>
    </div>
  );
};
