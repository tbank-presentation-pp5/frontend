import { getFields } from "../../slideHelper";
import styles from './main.module.css';
import { EditableText } from "../EditableText";

export const Slide1 = ({ slide, createdAt }: any) => {
  const fields = getFields(slide.content);
  return (
    <div className={styles.mainSlide}>
      <img src="/tbank.png" alt="logo" />
      <EditableText
        field={fields.title}
        className={styles.mainField}
      />
      <div className={styles.mainCred}>
        <p>Автор презентации: akiraduck</p>
        {new Date(createdAt * 1000).toLocaleString('ru-RU')}
      </div>
    </div>
  );
};