import { getFields } from "../../slideHelper";
import styles from './main.module.css';

export const Slide1 = ({ slide, createdAt }: any) => {
  const fields = getFields(slide.content);
  return (
    <div className={styles.mainSlide}>
      <img src="/tbank.png" alt="logo" />
      <div className={styles.mainField}>{fields.title?.value}</div>
      <div className={styles.mainCred}>
        <p>Автор презентации: akiraduck</p>
        {new Date(createdAt * 1000).toLocaleString('ru-RU')}
      </div>
    </div>
  );
};